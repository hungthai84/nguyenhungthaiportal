import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';
import {
  buildTriNhanSystemPrompt,
  findVerifiedFallbackAnswer,
} from './src/data/triNhanKnowledgeBase.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    apiVersion: 'v1beta',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const TEXT_TRANSLATION_MODELS = ['gemini-3.8-flash', 'gemini-1.5-flash'] as const;
const ASSISTANT_CHAT_MODELS = ['gemini-3.8-flash', 'gemini-1.5-flash'] as const;
const TTS_MODEL = 'gemini-3.8-flash-tts';
const DEFAULT_QUOTA_COOLDOWN_MS = 15 * 60 * 1000;
const MAX_QUOTA_COOLDOWN_MS = 60 * 60 * 1000;
const MAX_SERVER_TRANSLATION_CACHE = 4000;

const modelCooldownUntil = new Map<string, number>();
const cooldownWarnedUntil = new Map<string, number>();
const serverTranslationCache = new Map<string, string>();

function getCachedTranslation(targetLang: 'vi' | 'en', text: string): string | undefined {
  return serverTranslationCache.get(`${targetLang}::${text}`);
}

function setCachedTranslation(targetLang: 'vi' | 'en', source: string, translated: string): void {
  if (!source || !translated) return;
  const key = `${targetLang}::${source}`;
  if (serverTranslationCache.size >= MAX_SERVER_TRANSLATION_CACHE && !serverTranslationCache.has(key)) {
    const oldestKey = serverTranslationCache.keys().next().value;
    if (oldestKey) {
      serverTranslationCache.delete(oldestKey);
    }
  }
  serverTranslationCache.set(key, translated);
}

function isModelInCooldown(model: string): boolean {
  const until = modelCooldownUntil.get(model);
  if (!until) return false;
  if (Date.now() >= until) {
    modelCooldownUntil.delete(model);
    cooldownWarnedUntil.delete(model);
    return false;
  }
  return true;
}

function getRemainingCooldownSec(models: readonly string[]): number {
  const now = Date.now();
  let minRemaining = 0;
  for (const m of models) {
    const until = modelCooldownUntil.get(m) || 0;
    if (until > now) {
      const rem = Math.ceil((until - now) / 1000);
      minRemaining = minRemaining === 0 ? rem : Math.min(minRemaining, rem);
    } else {
      return 0;
    }
  }
  return minRemaining;
}

function parseQuotaError(err: unknown): { isQuota: boolean; cooldownMs: number; message: string } {
  const rawMessage =
    err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : JSON.stringify(err ?? 'Unknown Gemini error');

  const status = (err as { status?: number; code?: number })?.status ?? (err as { code?: number })?.code;
  const lower = rawMessage.toLowerCase();
  const isQuota =
    status === 429 ||
    lower.includes('429') ||
    lower.includes('resource_exhausted') ||
    lower.includes('quota exceeded') ||
    lower.includes('rate limit') ||
    lower.includes('rate-limits');

  let cooldownMs = DEFAULT_QUOTA_COOLDOWN_MS;
  const retryMatch = rawMessage.match(/(\d+(?:\.\d+)?)s/);
  if (retryMatch) {
    const parsedSec = Number(retryMatch[1]);
    if (Number.isFinite(parsedSec) && parsedSec > 0) {
      cooldownMs = Math.min(Math.max(parsedSec * 1000, 60_000), MAX_QUOTA_COOLDOWN_MS);
    }
  }

  return { isQuota, cooldownMs, message: rawMessage };
}

function markModelQuotaCooldown(model: string, cooldownMs: number, reason: string): void {
  const until = Date.now() + cooldownMs;
  modelCooldownUntil.set(model, until);
  const lastWarned = cooldownWarnedUntil.get(model) || 0;
  if (Date.now() >= lastWarned) {
    cooldownWarnedUntil.set(model, until);
    const mins = Math.max(1, Math.round(cooldownMs / 60000));
    console.warn(
      `[Gemini Quota Notice] Model ${model} đạt giới hạn lượt miễn phí, tạm chuyển sang từ điển/giọng đọc dự phòng trong ~${mins} phút. (${reason.slice(0, 140)})`
    );
  }
}

const ALLOWED_DRIVE_VIDEO_IDS = new Set<string>([
  // Interview Video 1 & 2
  '1-XpJWJEyTq4PYh902i7FQbWYnpO17PvM',
  '10oUM0icL2Q2SbDkS2phSskqqWm8DaIZf',
  '2-10oUM0icL2Q2SbDkS2phSskqqWm8DaIZf',
  // About Video 1 & 2
  '1YBxLU_NyWM8T3WAjOvtjSz0iP_6m1aB5',
  '12cdItjoc6LpIetmw6-1BiSt8kUaaNe7R',
  // Letter Video 1 & 2 (Thư Ngỏ)
  '156Uwr88AhLmybquXyrMsXqzxdAs5I6lw',
  // 11 Banner Card Videos
  '1jzOyu3bEDn3_4q1mBM_x_Fa3hwZjD3jP',
  '1G2ydHrMUchyBLjl3YR5xat8eF1MdPOQ4',
  '1Dtwp6LMU7uUZ2oE7DNDsXTCxr7y9Iwwx',
  '1SxwuMCwZEjqGXaBez6k2R1lUb1dfRKav',
  '1x-u8GDuR95rAAiFJo2Qc7eV4qtiKGfwB',
  '1ruWiQjZF1D_sIiw0G6jY05qulslNMj7B',
  '1GLEn1qcwUCTdzcoCxy715IrvQe3l4QVn',
  '1rbcqxl4WUeZvXg98OfQUIxOO1ja5_vIY',
  '1e1yYVIngi93onbPdKdKL9TdiI_lIOfzP',
  '1Hj-mzRUy2Z_XX4pXEVfCMIwpHV9KYL2U',
]);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Same-origin inline MP4 range-streaming proxy for allowlisted Google Drive portfolio videos
  app.get('/api/media/drive-video/:fileId', async (req, res) => {
    const fileId = typeof req.params.fileId === 'string' ? req.params.fileId.trim() : '';
    if (!ALLOWED_DRIVE_VIDEO_IDS.has(fileId)) {
      res.status(403).json({ error: 'Video ID không thuộc danh sách được phép.' });
      return;
    }

    const upstreamUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;
    const controller = new AbortController();
    res.on('close', () => {
      if (!res.writableEnded) {
        controller.abort();
      }
    });

    try {
      const upstreamHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioVideoStream/1.0)',
      };
      if (typeof req.headers.range === 'string' && /^bytes=\d*-\d*(,\s*\d*-\d*)*$/.test(req.headers.range)) {
        upstreamHeaders.Range = req.headers.range;
      }

      const upstreamRes = await fetch(upstreamUrl, {
        method: req.method === 'HEAD' ? 'HEAD' : 'GET',
        headers: upstreamHeaders,
        redirect: 'follow',
        signal: controller.signal,
      });

      if (!upstreamRes.ok && upstreamRes.status !== 206) {
        res.status(upstreamRes.status).end();
        return;
      }

      const upstreamType = upstreamRes.headers.get('content-type') || 'video/mp4';
      if (!upstreamType.toLowerCase().includes('video') && !upstreamType.toLowerCase().includes('octet-stream')) {
        res.status(502).json({ error: 'Nguồn video không trả về luồng MP4 hợp lệ.' });
        return;
      }

      res.status(upstreamRes.status);
      res.setHeader('Content-Type', upstreamType.includes('video') ? upstreamType : 'video/mp4');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Accept-Ranges', upstreamRes.headers.get('accept-ranges') || 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=3600');

      const contentLength = upstreamRes.headers.get('content-length');
      if (contentLength) res.setHeader('Content-Length', contentLength);

      const contentRange = upstreamRes.headers.get('content-range');
      if (contentRange) res.setHeader('Content-Range', contentRange);

      if (req.method === 'HEAD' || !upstreamRes.body) {
        res.end();
        return;
      }

      const nodeStream = Readable.fromWeb(upstreamRes.body as unknown as NodeReadableStream);
      nodeStream.on('error', () => {
        if (!res.headersSent) {
          res.status(502).end();
        } else {
          res.end();
        }
      });
      nodeStream.pipe(res);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        return;
      }
      if (!res.headersSent) {
        res.status(502).json({ error: 'Không thể truyền phát video lúc này.' });
      } else {
        res.end();
      }
    }
  });

  // Safe resolver/proxy for public Google Photos share links (photos.app.goo.gl / photos.google.com/share)
  app.get('/api/media/photos-video', async (req, res) => {
    const rawUrl = typeof req.query.url === 'string' ? req.query.url.trim() : '';
    let parsed: URL;
    try {
      parsed = new URL(rawUrl);
    } catch {
      res.status(400).json({ error: 'URL Google Photos không hợp lệ.' });
      return;
    }

    const isAllowedHost =
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'photos.app.goo.gl' ||
        parsed.hostname === 'photos.google.com' ||
        parsed.hostname.endsWith('.googleusercontent.com'));
    if (!isAllowedHost) {
      res.status(403).json({
        error: 'Chỉ hỗ trợ liên kết chia sẻ công khai từ Google Photos.',
      });
      return;
    }

    const controller = new AbortController();
    res.on('close', () => {
      if (!res.writableEnded) controller.abort();
    });

    try {
      const pageRes = await fetch(parsed.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        },
        redirect: 'follow',
        signal: controller.signal,
      });

      if (pageRes.url.includes('accounts.google.com')) {
        res.status(403).json({ error: 'Liên kết Google Photos yêu cầu đăng nhập.' });
        return;
      }

      const html = await pageRes.text();
      const videoMatch =
        html.match(/https:\/\/video-downloads\.googleusercontent\.com\/[^"'\s\\<>]+/i) ||
        html.match(/https:\/\/lh3\.googleusercontent\.com\/[^"'\s\\<>]+=m(?:37|22|18)\b/i) ||
        html.match(/https:\/\/[^"'\s\\<>]+\.googlevideo\.com\/[^"'\s\\<>]+/i);

      if (!videoMatch?.[0]) {
        res.status(404).json({ error: 'Không tìm thấy luồng MP4 công khai trong liên kết Google Photos này.' });
        return;
      }

      const streamUrl = videoMatch[0].replace(/\\u003d/g, '=').replace(/\\u0026/g, '&');
      const upstreamHeaders: Record<string, string> = {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioVideoStream/1.0)',
      };
      if (typeof req.headers.range === 'string' && /^bytes=\d*-\d*(,\s*\d*-\d*)*$/.test(req.headers.range)) {
        upstreamHeaders.Range = req.headers.range;
      }

      const upstreamRes = await fetch(streamUrl, {
        method: req.method === 'HEAD' ? 'HEAD' : 'GET',
        headers: upstreamHeaders,
        redirect: 'follow',
        signal: controller.signal,
      });

      if (!upstreamRes.ok && upstreamRes.status !== 206) {
        res.status(upstreamRes.status).end();
        return;
      }

      res.status(upstreamRes.status);
      res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'video/mp4');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Accept-Ranges', upstreamRes.headers.get('accept-ranges') || 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=1800');
      const contentLength = upstreamRes.headers.get('content-length');
      if (contentLength) res.setHeader('Content-Length', contentLength);
      const contentRange = upstreamRes.headers.get('content-range');
      if (contentRange) res.setHeader('Content-Range', contentRange);

      if (req.method === 'HEAD' || !upstreamRes.body) {
        res.end();
        return;
      }

      const nodeStream = Readable.fromWeb(upstreamRes.body as unknown as NodeReadableStream);
      nodeStream.on('error', () => {
        if (!res.headersSent) res.status(502).end();
        else res.end();
      });
      nodeStream.pipe(res);
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') return;
      if (!res.headersSent) {
        res.status(502).json({ error: 'Không thể tải video từ Google Photos lúc này.' });
      } else {
        res.end();
      }
    }
  });

  // Gemini TTS endpoint using male Puck voice (Southern Vietnamese & English)
  app.post('/api/tts', async (req, res) => {
    try {
      const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      const lang = req.body?.lang === 'en' ? 'en' : 'vi';

      if (!text) {
        res.status(400).json({ error: 'Thiếu nội dung văn bản cần đọc.', fallback: true });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.json({
          error: 'GEMINI_API_KEY chưa được cấu hình. Đang dùng giọng đọc trình duyệt dự phòng.',
          fallback: true,
        });
        return;
      }

      if (isModelInCooldown(TTS_MODEL)) {
        res.json({
          fallback: true,
          quotaExhausted: true,
          retryAfterSec: getRemainingCooldownSec([TTS_MODEL]),
          error: 'Gemini TTS đang tạm nghỉ theo giới hạn lượt miễn phí, đang dùng giọng đọc trình duyệt.',
        });
        return;
      }

      const speechStyle =
        lang === 'en'
          ? 'Bright, cheerful, natural 10-year-old boy voice with clear, friendly youthful articulation.'
          : 'Bright, cheerful, natural 10-year-old Vietnamese boy voice (trẻ em nam 10 tuổi), authentic Southern Vietnamese (Miền Nam Việt Nam, Sài Gòn) accent, clear articulation, warm and lively youthful tone.';

      const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text,
                speechMetadata: {
                  style: speechStyle,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
          },
        },
      });

      const part = response.candidates?.[0]?.content?.parts?.[0];
      const base64Audio = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || 'audio/wav';

      if (!base64Audio) {
        res.json({ error: 'Không nhận được dữ liệu âm thanh từ Gemini TTS.', fallback: true });
        return;
      }

      res.json({
        audioBase64: base64Audio,
        mimeType,
        voiceName: 'Puck',
        gender: 'male',
        lang,
      });
    } catch (err) {
      const { isQuota, cooldownMs, message } = parseQuotaError(err);
      if (isQuota) {
        markModelQuotaCooldown(TTS_MODEL, cooldownMs, message);
        res.json({
          fallback: true,
          quotaExhausted: true,
          retryAfterSec: Math.ceil(cooldownMs / 1000),
          error: 'Đã chạm giới hạn lượt TTS miễn phí, đang chuyển sang giọng đọc trình duyệt.',
        });
        return;
      }
      console.warn('[TTS Fallback]', message);
      res.json({ error: message, fallback: true });
    }
  });

  // Bilingual translation helper grounded strictly on existing Vietnamese CV data
  app.post('/api/assistant/translate', async (req, res) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const targetLang: 'vi' | 'en' = req.body?.targetLang === 'en' ? 'en' : 'vi';

    if (!text) {
      res.status(400).json({ error: 'Missing text' });
      return;
    }

    const cached = getCachedTranslation(targetLang, text);
    if (cached) {
      res.json({ translatedText: cached, cached: true });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({ translatedText: text, fallback: true });
      return;
    }

    const availableModels = TEXT_TRANSLATION_MODELS.filter((m) => !isModelInCooldown(m));
    if (availableModels.length === 0) {
      res.json({
        translatedText: text,
        fallback: true,
        quotaExhausted: true,
        retryAfterSec: getRemainingCooldownSec(TEXT_TRANSLATION_MODELS),
      });
      return;
    }

    const instruction =
      targetLang === 'en'
        ? 'Translate the provided Vietnamese customer experience portfolio Q&A content accurately into clear, natural, professional English. Preserve every fact, number, company name, year, metric, and person name (Nguyễn Hùng Thái, Trí Nhân) without adding or altering any information. Return only the translated text.'
        : 'Dịch chính xác nội dung sang tiếng Việt tự nhiên, giữ nguyên 100% số liệu, tên riêng và thông tin gốc. Chỉ trả về văn bản đã dịch.';

    let lastQuotaRetrySec = 0;
    for (const model of availableModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: text,
          config: {
            systemInstruction: instruction,
          },
        });

        const translatedText = response.text?.trim() || text;
        if (translatedText !== text) {
          setCachedTranslation(targetLang, text, translatedText);
        }
        res.json({ translatedText, model });
        return;
      } catch (err) {
        const { isQuota, cooldownMs, message } = parseQuotaError(err);
        if (isQuota) {
          markModelQuotaCooldown(model, cooldownMs, message);
          lastQuotaRetrySec = Math.ceil(cooldownMs / 1000);
          continue;
        }
        console.warn('[Assistant Translate Fallback]', message);
        break;
      }
    }

    res.json({
      translatedText: text,
      fallback: true,
      quotaExhausted: lastQuotaRetrySec > 0,
      retryAfterSec: lastQuotaRetrySec || getRemainingCooldownSec(TEXT_TRANSLATION_MODELS),
    });
  });

  // Batch translation endpoint for instant whole-website switching (VI <-> EN)
  app.post('/api/translate-batch', async (req, res) => {
    const rawTexts: unknown[] = Array.isArray(req.body?.texts) ? req.body.texts : [];
    const texts = rawTexts
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .slice(0, 45);
    const targetLang: 'vi' | 'en' = req.body?.targetLang === 'en' ? 'en' : 'vi';

    if (texts.length === 0) {
      res.json({ translations: [] });
      return;
    }

    // Resolve server-cached entries first and deduplicate remaining unique strings
    const uncachedUnique: string[] = [];
    const uncachedSet = new Set<string>();
    for (const item of texts) {
      if (!getCachedTranslation(targetLang, item) && !uncachedSet.has(item)) {
        uncachedSet.add(item);
        uncachedUnique.push(item);
      }
    }

    if (uncachedUnique.length === 0) {
      res.json({
        translations: texts.map((item) => getCachedTranslation(targetLang, item) || item),
        cached: true,
      });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        translations: texts.map((item) => getCachedTranslation(targetLang, item) || item),
        fallback: true,
      });
      return;
    }

    const availableModels = TEXT_TRANSLATION_MODELS.filter((m) => !isModelInCooldown(m));
    if (availableModels.length === 0) {
      res.json({
        translations: texts.map((item) => getCachedTranslation(targetLang, item) || item),
        fallback: true,
        quotaExhausted: true,
        retryAfterSec: getRemainingCooldownSec(TEXT_TRANSLATION_MODELS),
      });
      return;
    }

    const instruction =
      targetLang === 'en'
        ? 'You are translating an executive Customer Experience (CX) & Digital Transformation Portfolio website from Vietnamese to natural, concise, executive English. Input is a JSON array of strings. Return a JSON array of strings of the EXACT same length and order. CRITICAL RULES: Keep proper names unchanged (Nguyễn Hùng Thái, Trí Nhân, MobiFone, Shopee, Garena, Prudential Vietnam, MoMo, ShopeePay, Finviet, Power Service, etc.), preserve all numbers, years, percentages, currency, project codes (1.1, 8.1, Q01), and industry acronyms (CX, CSKH -> Customer Service/CS, SLA, KPI, OKR, CRM, SOP, RPA, BPO, BI, COPC, TQA, VoC, CJM, AI). Match concise button/label lengths cleanly. Return ONLY valid JSON array of strings.'
        : 'Dịch mảng JSON chuỗi đầu vào sang tiếng Việt tự nhiên, giữ nguyên số lượng phần tử, thứ tự, tên riêng và số liệu. Chỉ trả về mảng JSON các chuỗi.';

    let lastQuotaRetrySec = 0;

    for (const model of availableModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: JSON.stringify(uncachedUnique),
          config: {
            systemInstruction: instruction,
            responseMimeType: 'application/json',
          },
        });

        const rawOutput = response.text?.trim() || '';
        let parsed: unknown = null;
        try {
          parsed = JSON.parse(rawOutput);
        } catch {
          const match = rawOutput.match(/\[[\s\S]*\]/);
          if (match) {
            parsed = JSON.parse(match[0]);
          }
        }

        if (Array.isArray(parsed) && parsed.length === uncachedUnique.length) {
          uncachedUnique.forEach((src, idx) => {
            const val = parsed[idx];
            if (typeof val === 'string' && val.trim().length > 0) {
              setCachedTranslation(targetLang, src, val.trim());
            }
          });
          res.json({
            translations: texts.map((item) => getCachedTranslation(targetLang, item) || item),
            model,
          });
          return;
        }
      } catch (err) {
        const { isQuota, cooldownMs, message } = parseQuotaError(err);
        if (isQuota) {
          markModelQuotaCooldown(model, cooldownMs, message);
          lastQuotaRetrySec = Math.ceil(cooldownMs / 1000);
          continue;
        }
        console.warn('[Translate Batch Fallback]', message);
        break;
      }
    }

    res.json({
      translations: texts.map((item) => getCachedTranslation(targetLang, item) || item),
      fallback: true,
      quotaExhausted: lastQuotaRetrySec > 0,
      retryAfterSec: lastQuotaRetrySec || getRemainingCooldownSec(TEXT_TRANSLATION_MODELS),
    });
  });

  // Tri Nhan AI Assistant Chat endpoint (multi-turn Gemini grounded on Mr. Nguyen Hung Thai's portfolio & 47 Q&A)
  app.post('/api/assistant/chat', async (req, res) => {
    const rawMessage = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    const language: 'vi' | 'en' = req.body?.language === 'en' ? 'en' : 'vi';
    const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];

    if (!rawMessage) {
      res.status(400).json({ error: 'Vui lòng nhập nội dung câu hỏi.' });
      return;
    }

    const message = rawMessage.slice(0, 2000);
    const localFallback = findVerifiedFallbackAnswer(message, language);

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        reply: localFallback.reply,
        matchedTitle: localFallback.matchedTitle,
        source: 'fallback',
        fallback: true,
      });
      return;
    }

    const availableModels = ASSISTANT_CHAT_MODELS.filter((m) => !isModelInCooldown(m));
    if (availableModels.length === 0) {
      res.json({
        reply: localFallback.reply,
        matchedTitle: localFallback.matchedTitle,
        source: 'fallback',
        fallback: true,
        quotaExhausted: true,
        retryAfterSec: getRemainingCooldownSec(ASSISTANT_CHAT_MODELS),
      });
      return;
    }

    // Build clean multi-turn contents ensuring first role is always 'user' and roles alternate cleanly
    const normalizedHistory: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    for (const item of rawHistory.slice(-10)) {
      if (!item || typeof item.text !== 'string') continue;
      const text = item.text.trim();
      if (!text) continue;
      const role: 'user' | 'model' = item.sender === 'user' ? 'user' : 'model';
      if (normalizedHistory.length === 0 && role === 'model') {
        continue;
      }
      const prev = normalizedHistory[normalizedHistory.length - 1];
      if (prev && prev.role === role) {
        prev.parts[0].text = `${prev.parts[0].text}\n\n${text}`;
      } else {
        normalizedHistory.push({ role, parts: [{ text }] });
      }
    }

    // Append current user turn
    const lastTurn = normalizedHistory[normalizedHistory.length - 1];
    if (lastTurn && lastTurn.role === 'user') {
      lastTurn.parts[0].text = message;
    } else {
      normalizedHistory.push({ role: 'user', parts: [{ text: message }] });
    }

    const systemInstruction = buildTriNhanSystemPrompt(language);
    let lastQuotaRetrySec = 0;

    for (const model of availableModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: normalizedHistory,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text?.trim();
        if (reply) {
          res.json({
            reply,
            matchedTitle: localFallback.matchedTitle,
            source: 'gemini',
            model,
            fallback: false,
          });
          return;
        }
      } catch (err) {
        const { isQuota, cooldownMs, message: errMsg } = parseQuotaError(err);
        if (isQuota) {
          markModelQuotaCooldown(model, cooldownMs, errMsg);
          lastQuotaRetrySec = Math.ceil(cooldownMs / 1000);
          continue;
        }
        console.warn('[Assistant Chat Fallback]', errMsg);
        break;
      }
    }

    res.json({
      reply: localFallback.reply,
      matchedTitle: localFallback.matchedTitle,
      source: 'fallback',
      fallback: true,
      quotaExhausted: lastQuotaRetrySec > 0,
      retryAfterSec: lastQuotaRetrySec || getRemainingCooldownSec(ASSISTANT_CHAT_MODELS),
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
