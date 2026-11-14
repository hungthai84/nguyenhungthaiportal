import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

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
        res.status(503).json({
          error: 'GEMINI_API_KEY chưa được cấu hình. Đang dùng giọng đọc trình duyệt dự phòng.',
          fallback: true,
        });
        return;
      }

      const speechStyle =
        lang === 'en'
          ? 'Warm, confident, clear adult male voice speaking natural international English.'
          : 'Warm, friendly, clear adult male voice speaking Vietnamese with a natural Southern Vietnamese (Miền Nam Việt Nam, Sài Gòn) accent.';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
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
        res.status(502).json({ error: 'Không nhận được dữ liệu âm thanh từ Gemini TTS.', fallback: true });
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
      const message = err instanceof Error ? err.message : 'Lỗi Gemini TTS';
      console.error('[TTS Error]', message);
      res.status(500).json({ error: message, fallback: true });
    }
  });

  // Bilingual translation helper grounded strictly on existing Vietnamese CV data
  app.post('/api/assistant/translate', async (req, res) => {
    try {
      const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
      const targetLang = req.body?.targetLang === 'en' ? 'en' : 'vi';

      if (!text) {
        res.status(400).json({ error: 'Missing text' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.json({ translatedText: text, fallback: true });
        return;
      }

      const instruction =
        targetLang === 'en'
          ? 'Translate the provided Vietnamese customer experience portfolio Q&A content accurately into clear, natural, professional English. Preserve every fact, number, company name, year, metric, and person name (Nguyễn Hùng Thái, Trí Nhân) without adding or altering any information. Return only the translated text.'
          : 'Dịch chính xác nội dung sang tiếng Việt tự nhiên, giữ nguyên 100% số liệu, tên riêng và thông tin gốc. Chỉ trả về văn bản đã dịch.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: text,
        config: {
          systemInstruction: instruction,
        },
      });

      const translatedText = response.text?.trim() || text;
      res.json({ translatedText });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Translate error';
      console.error('[Translate Error]', message);
      res.json({
        translatedText: typeof req.body?.text === 'string' ? req.body.text : '',
        fallback: true,
        error: message,
      });
    }
  });

  // Batch translation endpoint for instant whole-website switching (VI <-> EN)
  app.post('/api/translate-batch', async (req, res) => {
    try {
      const rawTexts: unknown[] = Array.isArray(req.body?.texts) ? req.body.texts : [];
      const texts = rawTexts
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .slice(0, 45);
      const targetLang = req.body?.targetLang === 'en' ? 'en' : 'vi';

      if (texts.length === 0) {
        res.json({ translations: [] });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.json({ translations: texts, fallback: true });
        return;
      }

      const instruction =
        targetLang === 'en'
          ? 'You are translating an executive Customer Experience (CX) & Digital Transformation Portfolio website from Vietnamese to natural, concise, executive English. Input is a JSON array of strings. Return a JSON array of strings of the EXACT same length and order. CRITICAL RULES: Keep proper names unchanged (Nguyễn Hùng Thái, Trí Nhân, MobiFone, Shopee, Garena, Prudential Vietnam, MoMo, ShopeePay, Finviet, Power Service, etc.), preserve all numbers, years, percentages, currency, project codes (1.1, 8.1, Q01), and industry acronyms (CX, CSKH -> Customer Service/CS, SLA, KPI, OKR, CRM, SOP, RPA, BPO, BI, COPC, TQA, VoC, CJM, AI). Match concise button/label lengths cleanly. Return ONLY valid JSON array of strings.'
          : 'Dịch mảng JSON chuỗi đầu vào sang tiếng Việt tự nhiên, giữ nguyên số lượng phần tử, thứ tự, tên riêng và số liệu. Chỉ trả về mảng JSON các chuỗi.';

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: JSON.stringify(texts),
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

      if (Array.isArray(parsed) && parsed.length === texts.length) {
        const translations = parsed.map((val, idx) =>
          typeof val === 'string' && val.trim().length > 0 ? val : texts[idx]
        );
        res.json({ translations });
        return;
      }

      res.json({ translations: texts, fallback: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Batch translate error';
      console.error('[Translate Batch Error]', message);
      const safeTexts = Array.isArray(req.body?.texts) ? req.body.texts : [];
      res.json({
        translations: safeTexts,
        fallback: true,
        error: message,
      });
    }
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
