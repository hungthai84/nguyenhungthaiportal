import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { buildInstantViToEnMap } from '@/data/translationsEn';

export type Language = 'vi' | 'en';
export type LanguagePreference = 'auto' | 'vi' | 'en';

const LANG_MODE_STORAGE_KEY = 'portfolio_lang_mode';
const EN_CACHE_STORAGE_KEY = 'portfolio_en_cache_v1';

const VIETNAMESE_DIACRITIC_REGEX =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

const NON_TRANSLATABLE_REGEX = /^[\d\s.,:%+\-–—/()[\]{}•·|✓✕⚙°CF#@!&*?~="'`<>\\]+$/;
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'CODE', 'PRE']);
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
          if (typeof k === 'string' && typeof v === 'string' && k.trim() && v.trim() && !merged.has(k)) {
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
      if (!baseMap.has(k) && v !== k && count < 1500) {
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

function isCandidateVietnamese(core: string, dictionary: Map<string, string>): boolean {
  if (!core || core.length > 2500) return false;
  if (NON_TRANSLATABLE_REGEX.test(core)) return false;
  if (/^(https?:\/\/|www\.|mailto:|tel:|data:)/i.test(core)) return false;
  if (dictionary.has(core)) return true;
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
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'vi',
  languageMode: 'auto',
  browserLocale: 'vi-VN',
  browserLanguage: 'vi',
  isTranslating: false,
  setLanguage: () => {},
  setLanguageMode: () => {},
  toggleLanguage: () => {},
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
      } catch {
        // ignore storage access issues
      }
    }
    return 'auto';
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
  const isApplyingRef = useRef<boolean>(false);
  const originalTitleRef = useRef<string | null>(null);

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
        const cachedTitle = cache.get(originalTitleRef.current.trim());
        if (cachedTitle) {
          document.title = cachedTitle;
        } else if (!inFlightKeysRef.current.has(originalTitleRef.current.trim()) && !failedKeysRef.current.has(originalTitleRef.current.trim())) {
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
          // Skip if node already displays our exact translated English output
          if (!existing || val !== existing.en) {
            const { leading, core, trailing } = splitWhitespace(val);
            if (isCandidateVietnamese(core, cache)) {
              const translatedCore = cache.get(core);
              if (translatedCore) {
                const nextFull = `${leading}${translatedCore}${trailing}`;
                textRecords.set(currentNode, { vi: val, en: nextFull });
                trackedNodes.add(currentNode);
                if (val !== nextFull) {
                  currentNode.nodeValue = nextFull;
                }
              } else if (!inFlightKeysRef.current.has(core) && !failedKeysRef.current.has(core)) {
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
            const translatedCore = cache.get(core);
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
            } else if (!inFlightKeysRef.current.has(core) && !failedKeysRef.current.has(core)) {
              pendingStrings.add(core);
            }
          }
        });
      });
    } finally {
      isApplyingRef.current = false;
    }

    // 3. Batch translate uncached Vietnamese strings via /api/translate-batch
    const toFetch = Array.from(pendingStrings);
    if (toFetch.length === 0) return;

    toFetch.forEach((s) => inFlightKeysRef.current.add(s));
    const chunks: string[][] = [];
    for (let i = 0; i < toFetch.length; i += 35) {
      chunks.push(toFetch.slice(i, i + 35));
    }

    setIsTranslating(true);
    let activeWorkers = Math.min(3, chunks.length);
    let chunkCursor = 0;

    const runWorker = async () => {
      while (chunkCursor < chunks.length) {
        const myIndex = chunkCursor++;
        const batch = chunks[myIndex];
        try {
          const res = await fetch('/api/translate-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texts: batch, targetLang: 'en' }),
          });
          if (res.ok) {
            const data = await res.json();
            const list: unknown = data?.translations;
            if (Array.isArray(list) && !data?.fallback) {
              let updatedCount = 0;
              batch.forEach((src, i) => {
                const tr = list[i];
                if (typeof tr === 'string' && tr.trim()) {
                  cache.set(src, tr.trim());
                  updatedCount++;
                }
                inFlightKeysRef.current.delete(src);
              });
              if (updatedCount > 0) {
                savePersistedCache(cache, baseDictRef.current!);
                if (languageRef.current === 'en') {
                  scanAndTranslateToEnglish();
                }
              }
              continue;
            }
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
      activeWorkers--;
      if (activeWorkers <= 0 && inFlightKeysRef.current.size === 0) {
        setIsTranslating(false);
      }
    };

    for (let w = 0; w < activeWorkers; w++) {
      void runWorker();
    }
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

    // Apply English immediately + observe dynamic DOM updates (tab switches, modals, filters)
    failedKeysRef.current.clear();
    let rafId: number | null = null;
    const scheduleScan = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        if (languageRef.current === 'en') {
          scanAndTranslateToEnglish();
        }
      });
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
        if (m.type === 'characterData') {
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
      });
    }

    return () => {
      observer.disconnect();
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
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
