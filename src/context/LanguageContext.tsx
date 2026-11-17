import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { buildInstantViToEnMap } from '@/data/translationsEn';

export type Language = 'vi' | 'en';
export type LanguagePreference = 'auto' | 'vi' | 'en';

const LANG_MODE_STORAGE_KEY = 'portfolio_lang_mode';
const EN_CACHE_STORAGE_KEY = 'portfolio_en_cache_v2';
const BATCH_COOLDOWN_STORAGE_KEY = 'portfolio_translate_cooldown_until';

function isBatchTranslateCoolingDown(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = sessionStorage.getItem(BATCH_COOLDOWN_STORAGE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    if (Number.isFinite(until) && Date.now() < until) {
      return true;
    }
    sessionStorage.removeItem(BATCH_COOLDOWN_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  return false;
}

function setBatchTranslateCooldown(retryAfterSec?: number): void {
  if (typeof window === 'undefined') return;
  try {
    const sec =
      typeof retryAfterSec === 'number' && Number.isFinite(retryAfterSec) && retryAfterSec > 0
        ? Math.min(Math.max(retryAfterSec, 60), 30 * 60)
        : 15 * 60;
    sessionStorage.setItem(BATCH_COOLDOWN_STORAGE_KEY, String(Date.now() + sec * 1000));
  } catch {
    // ignore storage errors
  }
}

const VIETNAMESE_DIACRITIC_REGEX =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

const NON_TRANSLATABLE_REGEX = /^[\d\s.,:%+\-–—/()[\]{}•·|✓✕⚙°CF#@!&*?~="'`<>\\]+$/;
// Allow SELECT and OPTION to be translated cleanly too
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'CODE', 'PRE']);
const TRANSLATABLE_ATTRS = ['placeholder', 'title', 'aria-label'] as const;

function getRawBrowserLocale(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'vi-VN';
  }
  const preferred =
    (Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages[0]
      : '') ||
    navigator.language ||
    (navigator as any).userLanguage ||
    'vi-VN';
  return String(preferred || 'vi-VN');
}

export function detectBrowserLanguage(): Language {
  const raw = getRawBrowserLocale().trim().toLowerCase();
  if (!raw || raw.startsWith('vi')) {
    return 'vi';
  }
  return 'en';
}

function loadPersistedCache(baseMap: Map<string, string>): Map<string, string> {
  const merged = new Map(baseMap);
  if (typeof window === 'undefined') return merged;
  try {
    const raw = localStorage.getItem(EN_CACHE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.entries(parsed).forEach(([k, v]) => {
          if (
            typeof k === 'string' &&
            typeof v === 'string' &&
            k.trim() &&
            v.trim() &&
            !VIETNAMESE_DIACRITIC_REGEX.test(v) &&
            !merged.has(k)
          ) {
            merged.set(k, v);
          }
        });
      }
    }
  } catch {
    // ignore corrupted cache
  }
  return merged;
}

function savePersistedCache(cacheMap: Map<string, string>, baseMap: Map<string, string>) {
  if (typeof window === 'undefined') return;
  try {
    const diff: Record<string, string> = {};
    let count = 0;
    cacheMap.forEach((v, k) => {
      if (!baseMap.has(k) && v !== k && !VIETNAMESE_DIACRITIC_REGEX.test(v) && count < 1500) {
        diff[k] = v;
        count++;
      }
    });
    localStorage.setItem(EN_CACHE_STORAGE_KEY, JSON.stringify(diff));
  } catch {
    // ignore quota errors
  }
}

function shouldSkipElement(el: Element | null): boolean {
  let cur: Element | null = el;
  while (cur) {
    if (SKIP_TAGS.has(cur.tagName)) return true;
    if (
      cur.getAttribute('data-no-translate') === 'true' ||
      cur.getAttribute('translate') === 'no' ||
      cur.classList?.contains('notranslate')
    ) {
      return true;
    }
    cur = cur.parentElement;
  }
  return false;
}

function splitWhitespace(str: string): { leading: string; core: string; trailing: string } {
  const match = str.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return { leading: '', core: str, trailing: '' };
  return { leading: match[1] || '', core: match[2] || '', trailing: match[3] || '' };
}

function normalizeLookupKey(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .trim();
}

const WEEKDAY_MAP: Record<string, string> = {
  'chủ nhật': 'Sunday',
  'thứ hai': 'Monday',
  'thứ 2': 'Monday',
  'thứ ba': 'Tuesday',
  'thứ 3': 'Tuesday',
  'thứ tư': 'Wednesday',
  'thứ 4': 'Wednesday',
  'thứ năm': 'Thursday',
  'thứ 5': 'Thursday',
  'thứ sáu': 'Friday',
  'thứ 6': 'Friday',
  'thứ bảy': 'Saturday',
  'thứ 7': 'Saturday',
};

const MONTH_ABBR_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function translateDynamicPattern(core: string, dictionary: Map<string, string>): string | null {
  const c = normalizeLookupKey(core);
  if (!c) return null;

  // Date headers: "Thứ Sáu, ngày 06 tháng 11 năm 2026" or "Thứ Sáu, 06/11/2026"
  const fullDateMatch = c.match(
    /^(chủ nhật|thứ\s*(?:hai|ba|tư|năm|sáu|bảy|[2-7]))\s*,\s*(?:ngày\s*)?(\d{1,2})\s*(?:tháng|thg|\/)\s*(\d{1,2})(?:\s*(?:năm|\/)\s*(\d{4}))?$/i
  );
  if (fullDateMatch) {
    const dayEn = WEEKDAY_MAP[fullDateMatch[1].toLowerCase().replace(/\s+/g, ' ')] || fullDateMatch[1];
    const dd = fullDateMatch[2].padStart(2, '0');
    const mmNum = parseInt(fullDateMatch[3], 10);
    const monthEn = MONTH_ABBR_EN[mmNum - 1] || fullDateMatch[3];
    const yyyy = fullDateMatch[4];
    return yyyy ? `${dayEn}, ${monthEn} ${dd}, ${yyyy}` : `${dayEn}, ${monthEn} ${dd}`;
  }

  // "Từ năm 2003 đến năm 2007" / "Từ năm 2023 đến 2024" / "2018 – hiện tại"
  const yearRangeMatch = c.match(/^Từ năm\s+(\d{4})\s+đến(?:\s+năm)?\s+(\d{4}|hiện tại)$/i);
  if (yearRangeMatch) {
    const end = yearRangeMatch[2].toLowerCase() === 'hiện tại' ? 'Present' : yearRangeMatch[2];
    return `${yearRangeMatch[1]} – ${end}`;
  }

  // "Năm 2016"
  const singleYearMatch = c.match(/^Năm\s+(\d{4})$/i);
  if (singleYearMatch) {
    return `Year ${singleYearMatch[1]}`;
  }

  // "Mức độ kỹ năng: 98%" / "Mức độ tác động: 94%"
  const percentMatch = c.match(/^(Mức độ kỹ năng|Mức độ tác động|Độ ổn định|Tỷ lệ hài lòng)\s*:\s*(.+)$/i);
  if (percentMatch) {
    const labelMap: Record<string, string> = {
      'mức độ kỹ năng': 'Proficiency Level',
      'mức độ tác động': 'Impact Level',
      'độ ổn định': 'Stability',
      'tỷ lệ hài lòng': 'Satisfaction Rate',
    };
    const translatedLabel = labelMap[percentMatch[1].toLowerCase()] || percentMatch[1];
    return `${translatedLabel}: ${percentMatch[2]}`;
  }

  // PageCardHeader part labels: "Phần 1/4 · Thông Điệp Hợp Tác" / "Thẻ 1/2 · Chân Dung & Hồ Sơ" / "Thẻ 1/6"
  const partCardMatch = c.match(/^(Phần|Thẻ)\s+(\d+)\s*\/\s*(\d+)(?:\s*[·•|-]\s*(.+))?$/i);
  if (partCardMatch) {
    const kindEn = partCardMatch[1].toLowerCase() === 'phần' ? 'Part' : 'Card';
    const counter = `${kindEn} ${partCardMatch[2]}/${partCardMatch[3]}`;
    const rawTail = (partCardMatch[4] || '').trim();
    if (!rawTail) return counter;
    const tailEn = dictionary.get(rawTail) || dictionary.get(normalizeLookupKey(rawTail)) || translateDynamicPattern(rawTail, dictionary) || rawTail;
    return `${counter} · ${tailEn}`;
  }

  // Dynamic unit counts: "6 Hạng mục", "3 dịch vụ", "4 sản phẩm", "12 hệ thống", "21 dự án", "3 Ngôn ngữ", "12 nhân sự trực tiếp"
  const countUnitMatch = c.match(/^(\d+\+?)\s+(Hạng mục|dịch vụ|sản phẩm|hệ thống|dự án|Ngôn ngữ|nhân sự trực tiếp|nhân sự nhóm|nhân sự)$/i);
  if (countUnitMatch) {
    const unitEnMap: Record<string, string> = {
      'hạng mục': 'Items',
      'dịch vụ': 'Services',
      'sản phẩm': 'Products',
      'hệ thống': 'Systems',
      'dự án': 'Projects',
      'ngôn ngữ': 'Languages',
      'nhân sự trực tiếp': 'Direct Staff',
      'nhân sự nhóm': 'Team Members',
      'nhân sự': 'Staff',
    };
    const unitEn = unitEnMap[countUnitMatch[2].toLowerCase()] || countUnitMatch[2];
    return `${countUnitMatch[1]} ${unitEn}`;
  }

  // "Phóng to (8)" / "Kỷ niệm #3" / "Tác động 85%" / "Phóng to hình kỷ niệm 1: Title"
  const zoomCountMatch = c.match(/^Phóng to\s*\((\d+)\)$/i);
  if (zoomCountMatch) {
    return `Zoom in (${zoomCountMatch[1]})`;
  }
  const memoryNumMatch = c.match(/^Kỷ niệm\s*#(\d+)$/i);
  if (memoryNumMatch) {
    return `Memory #${memoryNumMatch[1]}`;
  }
  const impactPercentMatch = c.match(/^Tác động\s+(\d+%)$/i);
  if (impactPercentMatch) {
    return `Impact ${impactPercentMatch[1]}`;
  }
  const zoomMemoryAriaMatch = c.match(/^Phóng to hình kỷ niệm\s+(\d+)\s*:\s*(.+)$/i);
  if (zoomMemoryAriaMatch) {
    const tail = zoomMemoryAriaMatch[2].trim();
    const tailEn = dictionary.get(tail) || translateDynamicPattern(tail, dictionary) || tail;
    return `Zoom in memory photo ${zoomMemoryAriaMatch[1]}: ${tailEn}`;
  }

  // "Trang 1 / 14" or "Câu 1 / 12" or "Dự án số 1 / 21"
  const pageCountMatch = c.match(/^(Trang|Câu|Dự án số|Ảnh|Mục)\s+(\d+)\s*\/\s*(\d+)$/i);
  if (pageCountMatch) {
    const unitMap: Record<string, string> = {
      'trang': 'Page',
      'câu': 'Question',
      'dự án số': 'Project',
      'ảnh': 'Photo',
      'mục': 'Item',
    };
    const unit = unitMap[pageCountMatch[1].toLowerCase()] || pageCountMatch[1];
    return `${unit} ${pageCountMatch[2]} / ${pageCountMatch[3]}`;
  }

  // "Tất cả (14 chứng chỉ)" / "Tất cả (21 Dự án)" / "Tất cả (12 hệ thống)"
  const allParenMatch = c.match(/^Tất cả\s*\(([^)]+)\)$/i);
  if (allParenMatch) {
    const inner = allParenMatch[1]
      .replace(/dự án/gi, 'Projects')
      .replace(/chứng chỉ/gi, 'Credentials')
      .replace(/hệ thống/gi, 'Systems')
      .replace(/câu hỏi/gi, 'Questions')
      .replace(/kỷ niệm/gi, 'Memories')
      .replace(/hình ảnh/gi, 'Images');
    return `All (${inner})`;
  }

  // "Phân hệ 9.1" / "Nhóm 1" / "Dự án 1.1" / "Bước 1" / "Giai đoạn 2"
  const numberedLabelMatch = c.match(/^(Phân hệ|Nhóm|Dự án|Bước|Giai đoạn|Hạng mục|Trụ cột|Giá trị|Màn hình)\s+([0-9.]+)$/i);
  if (numberedLabelMatch) {
    const prefixMap: Record<string, string> = {
      'phân hệ': 'Module',
      'nhóm': 'Group',
      'dự án': 'Project',
      'bước': 'Step',
      'giai đoạn': 'Phase',
      'hạng mục': 'Workstream',
      'trụ cột': 'Pillar',
      'giá trị': 'Value',
      'màn hình': 'Screen',
    };
    const enPrefix = prefixMap[numberedLabelMatch[1].toLowerCase()] || numberedLabelMatch[1];
    return `${enPrefix} ${numberedLabelMatch[2]}`;
  }

  // "Đã áp dụng giao diện: ..." / "Đã chọn ngôn ngữ..." / "Ngôn ngữ mặc định trình duyệt..."
  if (/^Đã áp dụng giao diện:\s*/i.test(c)) {
    const rest = c.replace(/^Đã áp dụng giao diện:\s*/i, '').trim();
    const restEn = dictionary.get(rest) || rest;
    return `Applied theme: ${restEn}`;
  }
  if (/^Ngôn ngữ mặc định trình duyệt/i.test(c)) {
    return c.includes('English') ? 'Browser default: English' : 'Browser default: Vietnamese';
  }
  if (/^Đang hiển thị chi tiết\s+/i.test(c)) {
    const rest = c.replace(/^Đang hiển thị chi tiết\s+/i, '').trim();
    return `Showing details for ${rest}`;
  }
  if (/^Nhấp để mở rộng chi tiết thẻ:\s*/i.test(c)) {
    const rest = c.replace(/^Nhấp để mở rộng chi tiết thẻ:\s*/i, '').trim();
    return `Click to expand card details: ${rest}`;
  }

  // Wallpaper numbered presets: "Hình nền #41", "Hình nền Video #23", "Hình nền #30 (Bản 2)", "Hình nền #47 (Ảnh)"
  const wpVideoMatch = c.match(/^Hình nền Video #(\d+)(.*)$/i);
  if (wpVideoMatch) {
    const tail = wpVideoMatch[2].replace(/\(Bản\s*(\d+)\)/gi, '(V$1)').replace(/\(Ảnh\)/gi, '(Image)');
    return `Video Wallpaper #${wpVideoMatch[1]}${tail}`;
  }
  const wpImgMatch = c.match(/^Hình nền #(\d+)(.*)$/i);
  if (wpImgMatch) {
    const tail = wpImgMatch[2].replace(/\(Bản\s*(\d+)\)/gi, '(V$1)').replace(/\(Ảnh\)/gi, '(Image)');
    return `Wallpaper #${wpImgMatch[1]}${tail}`;
  }

  // PUCK voice narration toasts
  const stopNarMatch = c.match(/^Đã dừng thuyết trình\s+(.+?)\.?$/i);
  if (stopNarMatch) {
    const subj = dictionary.get(stopNarMatch[1]) || stopNarMatch[1];
    return `Stopped narration: ${subj}.`;
  }
  const connNarMatch = c.match(/^Đang kết nối giọng PUCK MC Nam Sài Gòn:\s*(.+?)\.\.\.$/i);
  if (connNarMatch) {
    const subj = dictionary.get(connNarMatch[1]) || connNarMatch[1];
    return `Connecting Puck AI Voice: ${subj}...`;
  }
  const playNarMatch = c.match(/^AI PUCK MC Sài Gòn đang thuyết trình:\s*(.+?)\.\.\.(\s*🎙️)?$/i);
  if (playNarMatch) {
    const subj = dictionary.get(playNarMatch[1]) || playNarMatch[1];
    return `Puck AI Voice is presenting: ${subj}...${playNarMatch[2] || ''}`;
  }

  // Split "Label: Value" if Label exists in dictionary
  const colonIdx = c.indexOf(':');
  if (colonIdx > 1 && colonIdx < c.length - 1) {
    const left = c.slice(0, colonIdx).trim();
    const right = c.slice(colonIdx + 1).trim();
    const leftEn = dictionary.get(`${left}:`) || dictionary.get(left);
    if (leftEn) {
      const cleanLeftEn = leftEn.endsWith(':') ? leftEn.slice(0, -1) : leftEn;
      const rightEn = dictionary.get(right) || translateDynamicPattern(right, dictionary) || right;
      if (!VIETNAMESE_DIACRITIC_REGEX.test(rightEn) || rightEn !== right) {
        return `${cleanLeftEn}: ${rightEn}`;
      }
    }
  }

  return null;
}

export function lookupEnglish(core: string, dictionary: Map<string, string>): string | undefined {
  if (!core) return undefined;

  const direct = dictionary.get(core);
  if (direct) return direct;

  const normalized = normalizeLookupKey(core);
  const normHit = dictionary.get(normalized);
  if (normHit) return normHit;

  // Strip surrounding quotation marks ("..." or “...”) and optional trailing " ♡"
  const quoteHeartMatch = normalized.match(/^["']([\s\S]+?)(\s*♡)?["']$/);
  if (quoteHeartMatch) {
    const inner = quoteHeartMatch[1].trim();
    const heart = quoteHeartMatch[2] || '';
    const innerHit = lookupEnglish(inner, dictionary);
    if (innerHit) return `"${innerHit}${heart}"`;
  }

  // Strip wrapper icons/punctuation (✓, ⚠️, 🔴, 🔊, 🎧, 📍, •, trailing colon/ellipsis/♡)
  const wrapperMatch = normalized.match(/^([✓✔✕✖⚠️🔴🟡🟢🔊🎧📍🎯💡🌟💛💙💚💖💜🚫↻‹›]+\s*)?([\s\S]*?)(\s*(?::|\.{3}|!|\?|🔊|✓|♡))?$/);
  if (wrapperMatch && (wrapperMatch[1] || wrapperMatch[3])) {
    const pfx = wrapperMatch[1] || '';
    const inner = (wrapperMatch[2] || '').trim();
    const sfx = wrapperMatch[3] || '';
    if (inner) {
      const innerHit =
        dictionary.get(inner) ||
        dictionary.get(normalizeLookupKey(inner)) ||
        translateDynamicPattern(inner, dictionary);
      if (innerHit) {
        const cleanedInner = sfx === ':' && innerHit.endsWith(':') ? innerHit.slice(0, -1) : innerHit;
        return `${pfx}${cleanedInner}${sfx}`;
      }
    }
  }

  // Strip surrounding parentheses "(...)"
  const parenMatch = normalized.match(/^\(([\s\S]+)\)$/);
  if (parenMatch) {
    const innerHit = lookupEnglish(parenMatch[1], dictionary);
    if (innerHit) return `(${innerHit})`;
  }

  // Dynamic pattern translation
  const dynamicHit = translateDynamicPattern(normalized, dictionary);
  if (dynamicHit) return dynamicHit;

  return undefined;
}

function isCandidateVietnamese(core: string, dictionary: Map<string, string>): boolean {
  if (!core || core.length > 2500) return false;
  if (NON_TRANSLATABLE_REGEX.test(core)) return false;
  if (/^(https?:\/\/|www\.|mailto:|tel:|data:)/i.test(core)) return false;
  if (dictionary.has(core) || dictionary.has(normalizeLookupKey(core))) return true;
  return VIETNAMESE_DIACRITIC_REGEX.test(core);
}

interface TextRecord {
  vi: string;
  en: string;
}

interface LanguageContextType {
  language: Language;
  languageMode: LanguagePreference;
  browserLocale: string;
  browserLanguage: Language;
  isTranslating: boolean;
  setLanguage: (lang: Language) => void;
  setLanguageMode: (mode: LanguagePreference) => void;
  toggleLanguage: () => void;
  t: (viText: string, enFallback?: string) => string;
  translateText: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  languageMode: 'vi',
  browserLocale: 'vi-VN',
  browserLanguage: 'vi',
  isTranslating: false,
  setLanguage: () => {},
  setLanguageMode: () => {},
  toggleLanguage: () => {},
  t: (viText: string) => viText,
  translateText: (text: string) => text,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [browserLocale, setBrowserLocale] = useState<string>(() => getRawBrowserLocale());
  const [browserLanguage, setBrowserLanguage] = useState<Language>(() => detectBrowserLanguage());
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const [languageMode, setLanguageModeState] = useState<LanguagePreference>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedMode = localStorage.getItem(LANG_MODE_STORAGE_KEY);
        if (savedMode === 'auto' || savedMode === 'vi' || savedMode === 'en') {
          return savedMode;
        }
        const savedLegacy = localStorage.getItem('portfolio_lang');
        if (savedLegacy === 'vi' || savedLegacy === 'en') {
          return savedLegacy;
        }
      } catch {
        // ignore storage access issues
      }
    }
    return 'vi';
  });

  const language: Language = languageMode === 'auto' ? browserLanguage : languageMode;
  const languageRef = useRef<Language>(language);
  languageRef.current = language;

  // Translation dictionaries & DOM state tracking
  const baseDictRef = useRef<Map<string, string> | null>(null);
  if (!baseDictRef.current) {
    baseDictRef.current = buildInstantViToEnMap();
  }
  const cacheMapRef = useRef<Map<string, string> | null>(null);
  if (!cacheMapRef.current) {
    cacheMapRef.current = loadPersistedCache(baseDictRef.current);
  }

  const textRecordsRef = useRef<WeakMap<Text, TextRecord>>(new WeakMap());
  const trackedNodesRef = useRef<Set<Text>>(new Set());
  const attrRecordsRef = useRef<WeakMap<Element, Record<string, TextRecord>>>(new WeakMap());
  const trackedAttrElsRef = useRef<Set<Element>>(new Set());
  const inFlightKeysRef = useRef<Set<string>>(new Set());
  const failedKeysRef = useRef<Set<string>>(new Set());
  const batchApiUnavailableRef = useRef<boolean>(isBatchTranslateCoolingDown());
  const isApplyingRef = useRef<boolean>(false);
  const originalTitleRef = useRef<string | null>(null);

  const translateText = useCallback((text: string): string => {
    if (!text || languageRef.current !== 'en') return text;
    const { leading, core, trailing } = splitWhitespace(text);
    const hit = lookupEnglish(core, cacheMapRef.current!);
    return hit ? `${leading}${hit}${trailing}` : text;
  }, []);

  const t = useCallback(
    (viText: string, enFallback?: string): string => {
      if (language !== 'en') return viText;
      if (enFallback) return enFallback;
      const { leading, core, trailing } = splitWhitespace(viText);
      const hit = lookupEnglish(core, cacheMapRef.current!);
      return hit ? `${leading}${hit}${trailing}` : viText;
    },
    [language]
  );

  const scanAndTranslateToEnglish = useCallback(() => {
    if (typeof document === 'undefined' || !document.body) return;
    if (languageRef.current !== 'en') return;

    const cache = cacheMapRef.current!;
    const textRecords = textRecordsRef.current;
    const trackedNodes = trackedNodesRef.current;
    const attrRecords = attrRecordsRef.current;
    const trackedAttrEls = trackedAttrElsRef.current;
    const pendingStrings = new Set<string>();

    isApplyingRef.current = true;
    try {
      // Translate document title if Vietnamese
      if (originalTitleRef.current === null) {
        originalTitleRef.current = document.title;
      }
      if (originalTitleRef.current && VIETNAMESE_DIACRITIC_REGEX.test(originalTitleRef.current)) {
        const cachedTitle = lookupEnglish(originalTitleRef.current.trim(), cache);
        if (cachedTitle) {
          document.title = cachedTitle;
        } else if (
          !batchApiUnavailableRef.current &&
          !inFlightKeysRef.current.has(originalTitleRef.current.trim()) &&
          !failedKeysRef.current.has(originalTitleRef.current.trim())
        ) {
          pendingStrings.add(originalTitleRef.current.trim());
        }
      }

      // 1. Walk all Text nodes in document.body
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let currentNode = walker.nextNode() as Text | null;
      while (currentNode) {
        const val = currentNode.nodeValue;
        if (val && val.trim() && !shouldSkipElement(currentNode.parentElement)) {
          const existing = textRecords.get(currentNode);
          if (!existing || val !== existing.en) {
            const { leading, core, trailing } = splitWhitespace(val);
            if (isCandidateVietnamese(core, cache)) {
              const translatedCore = lookupEnglish(core, cache);
              if (translatedCore) {
                const nextFull = `${leading}${translatedCore}${trailing}`;
                textRecords.set(currentNode, { vi: val, en: nextFull });
                trackedNodes.add(currentNode);
                if (val !== nextFull) {
                  currentNode.nodeValue = nextFull;
                }
              } else if (
                !batchApiUnavailableRef.current &&
                !inFlightKeysRef.current.has(core) &&
                !failedKeysRef.current.has(core)
              ) {
                pendingStrings.add(core);
              }
            }
          }
        }
        currentNode = walker.nextNode() as Text | null;
      }

      // 2. Walk Elements for placeholder, title, aria-label
      const allEls = document.body.querySelectorAll('[placeholder], [title], [aria-label]');
      allEls.forEach((el) => {
        if (shouldSkipElement(el)) return;
        let recMap = attrRecords.get(el);
        TRANSLATABLE_ATTRS.forEach((attr) => {
          const rawAttr = el.getAttribute(attr);
          if (!rawAttr || !rawAttr.trim()) return;
          const prev = recMap?.[attr];
          if (prev && rawAttr === prev.en) return;
          const { leading, core, trailing } = splitWhitespace(rawAttr);
          if (isCandidateVietnamese(core, cache)) {
            const translatedCore = lookupEnglish(core, cache);
            if (translatedCore) {
              const nextAttr = `${leading}${translatedCore}${trailing}`;
              if (!recMap) {
                recMap = {};
                attrRecords.set(el, recMap);
              }
              recMap[attr] = { vi: rawAttr, en: nextAttr };
              trackedAttrEls.add(el);
              if (rawAttr !== nextAttr) {
                el.setAttribute(attr, nextAttr);
              }
            } else if (
              !batchApiUnavailableRef.current &&
              !inFlightKeysRef.current.has(core) &&
              !failedKeysRef.current.has(core)
            ) {
              pendingStrings.add(core);
            }
          }
        });
      });
    } finally {
      isApplyingRef.current = false;
    }

    // 3. Batch translate uncached Vietnamese strings via /api/translate-batch (if backend translation quota is available)
    if (batchApiUnavailableRef.current || isBatchTranslateCoolingDown()) {
      batchApiUnavailableRef.current = true;
      return;
    }
    const toFetch = Array.from(pendingStrings);
    if (toFetch.length === 0) return;

    toFetch.forEach((s) => inFlightKeysRef.current.add(s));
    const chunks: string[][] = [];
    for (let i = 0; i < toFetch.length; i += 45) {
      chunks.push(toFetch.slice(i, i + 45));
    }

    setIsTranslating(true);

    const runSequential = async () => {
      try {
        for (let idx = 0; idx < chunks.length; idx++) {
          const batch = chunks[idx];
          if (batchApiUnavailableRef.current || languageRef.current !== 'en') {
            batch.forEach((src) => inFlightKeysRef.current.delete(src));
            continue;
          }
          try {
            const res = await fetch('/api/translate-batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ texts: batch, targetLang: 'en' }),
            });
            if (res.status === 429) {
              batchApiUnavailableRef.current = true;
              setBatchTranslateCooldown(900);
              batch.forEach((src) => {
                inFlightKeysRef.current.delete(src);
                failedKeysRef.current.add(src);
              });
              continue;
            }
            if (res.ok) {
              const data = await res.json();
              const list: unknown = data?.translations;
              let updatedCount = 0;
              if (Array.isArray(list)) {
                batch.forEach((src, i) => {
                  const tr = list[i];
                  if (typeof tr === 'string' && tr.trim() && !VIETNAMESE_DIACRITIC_REGEX.test(tr)) {
                    cache.set(src, tr.trim());
                    updatedCount++;
                  }
                });
              }
              if (updatedCount > 0) {
                savePersistedCache(cache, baseDictRef.current!);
                if (languageRef.current === 'en') {
                  scanAndTranslateToEnglish();
                }
              }
              if (data?.fallback || data?.quotaExhausted) {
                batchApiUnavailableRef.current = true;
                setBatchTranslateCooldown(data?.retryAfterSec);
                batch.forEach((src) => {
                  inFlightKeysRef.current.delete(src);
                  failedKeysRef.current.add(src);
                });
                continue;
              }
              batch.forEach((src) => inFlightKeysRef.current.delete(src));
              continue;
            }
            batch.forEach((src) => {
              inFlightKeysRef.current.delete(src);
              failedKeysRef.current.add(src);
            });
          } catch {
            batch.forEach((src) => {
              inFlightKeysRef.current.delete(src);
              failedKeysRef.current.add(src);
            });
          }
        }
      } finally {
        if (inFlightKeysRef.current.size === 0) {
          setIsTranslating(false);
        }
      }
    };

    void runSequential();
  }, []);

  const restoreVietnamese = useCallback(() => {
    if (typeof document === 'undefined') return;
    isApplyingRef.current = true;
    try {
      if (originalTitleRef.current !== null && document.title !== originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }

      const textRecords = textRecordsRef.current;
      const trackedNodes = trackedNodesRef.current;
      trackedNodes.forEach((node) => {
        if (!node.isConnected) {
          trackedNodes.delete(node);
          return;
        }
        const rec = textRecords.get(node);
        if (rec && node.nodeValue === rec.en) {
          node.nodeValue = rec.vi;
        }
        textRecords.delete(node);
        trackedNodes.delete(node);
      });

      const attrRecords = attrRecordsRef.current;
      const trackedAttrEls = trackedAttrElsRef.current;
      trackedAttrEls.forEach((el) => {
        if (!el.isConnected) {
          trackedAttrEls.delete(el);
          return;
        }
        const recMap = attrRecords.get(el);
        if (recMap) {
          TRANSLATABLE_ATTRS.forEach((attr) => {
            const rec = recMap[attr];
            if (rec && el.getAttribute(attr) === rec.en) {
              el.setAttribute(attr, rec.vi);
            }
          });
          attrRecords.delete(el);
        }
        trackedAttrEls.delete(el);
      });
    } finally {
      isApplyingRef.current = false;
      setIsTranslating(false);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

    if (language === 'vi') {
      restoreVietnamese();
      return;
    }

    // Apply English immediately + observe dynamic DOM updates (tab switches, modals, filters, attributes)
    failedKeysRef.current.clear();
    let rafId: number | null = null;
    let debounceTimer: number | null = null;
    const scheduleScan = () => {
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
      debounceTimer = window.setTimeout(() => {
        debounceTimer = null;
        if (rafId !== null) return;
        rafId = window.requestAnimationFrame(() => {
          rafId = null;
          if (languageRef.current === 'en') {
            scanAndTranslateToEnglish();
          }
        });
      }, 90);
    };

    scanAndTranslateToEnglish();

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current || languageRef.current !== 'en') return;
      let hasRelevantChange = false;
      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        if (m.type === 'childList' && m.addedNodes.length > 0) {
          hasRelevantChange = true;
          break;
        }
        if (m.type === 'characterData' || m.type === 'attributes') {
          hasRelevantChange = true;
          break;
        }
      }
      if (hasRelevantChange) {
        scheduleScan();
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: [...TRANSLATABLE_ATTRS],
      });
    }

    return () => {
      observer.disconnect();
      if (debounceTimer !== null) {
        window.clearTimeout(debounceTimer);
      }
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [language, scanAndTranslateToEnglish, restoreVietnamese]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleBrowserLangChange = () => {
      setBrowserLocale(getRawBrowserLocale());
      setBrowserLanguage(detectBrowserLanguage());
    };
    window.addEventListener('languagechange', handleBrowserLangChange);
    return () => window.removeEventListener('languagechange', handleBrowserLangChange);
  }, []);

  const setLanguageMode = useCallback((mode: LanguagePreference) => {
    setLanguageModeState(mode);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANG_MODE_STORAGE_KEY, mode);
        if (mode === 'auto') {
          localStorage.removeItem('portfolio_lang');
        } else {
          localStorage.setItem('portfolio_lang', mode);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageMode(lang);
    },
    [setLanguageMode]
  );

  const toggleLanguage = useCallback(() => {
    const next: Language = language === 'vi' ? 'en' : 'vi';
    setLanguageMode(next);
  }, [language, setLanguageMode]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageMode,
        browserLocale,
        browserLanguage,
        isTranslating,
        setLanguage,
        setLanguageMode,
        toggleLanguage,
        t,
        translateText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
