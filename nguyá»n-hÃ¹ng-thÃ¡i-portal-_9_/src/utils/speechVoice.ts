export const VOICE_CHANGE_EVENT = 'speech_voice_changed';

export type AssistantVoiceLanguage = 'vi' | 'en';

export type TtsVoicePersonaId =
  | 'gemini-puck'
  | 'vi-north-male'
  | 'vi-north-female'
  | 'vi-south-male'
  | 'vi-south-female'
  | 'en-us-male'
  | 'en-us-female';

export interface VoicePersonaConfig {
  id: TtsVoicePersonaId | string;
  name: string;
  shortLabelVi: string;
  shortLabelEn: string;
  voiceName: string;
  gender: 'male' | 'female';
  lang: string;
  langGroup: AssistantVoiceLanguage;
  region: string;
  regionEn: string;
  style: string;
  pitch: number;
  rate: number;
  useGeminiCloud?: boolean;
  sampleTextVi: string;
  sampleTextEn: string;
}

export const TTS_VOICE_PERSONAS: VoicePersonaConfig[] = [
  {
    id: 'gemini-puck',
    name: 'AI Trí Nhân (Puck • Bé trai 10 tuổi Miền Nam)',
    shortLabelVi: 'AI Trí Nhân (Puck)',
    shortLabelEn: 'AI Tri Nhan (Puck)',
    voiceName: 'Puck',
    gender: 'male',
    lang: 'vi-VN',
    langGroup: 'vi',
    region: 'Miền Nam Việt Nam',
    regionEn: 'Southern Vietnam',
    style: 'Nam giới trẻ em 10 tuổi, giọng Miền Nam Việt Nam',
    pitch: 1.32,
    rate: 1.03,
    useGeminiCloud: true,
    sampleTextVi:
      'Xin chào Anh Chị! Em là AI Trí Nhân, đang sử dụng giọng đọc Puck trẻ em 10 tuổi Miền Nam Việt Nam để hỗ trợ thuyết minh hồ sơ anh Nguyễn Hùng Thái.',
    sampleTextEn:
      'Hello! I am AI Tri Nhan speaking with the Puck 10-year-old boy voice for Nguyen Hung Thai portfolio narration.',
  },
  {
    id: 'vi-south-male',
    name: 'Tiếng Việt · Nam (Miền Nam)',
    shortLabelVi: 'Nam · Miền Nam (VI)',
    shortLabelEn: 'Vietnamese Male · South',
    voiceName: 'NamMinh',
    gender: 'male',
    lang: 'vi-VN',
    langGroup: 'vi',
    region: 'Miền Nam Việt Nam',
    regionEn: 'Southern Vietnam',
    style: 'Nam giới, giọng ấm áp Miền Nam',
    pitch: 0.94,
    rate: 1.0,
    sampleTextVi:
      'Xin chào, đây là giọng đọc Nam Miền Nam cho phần thuyết minh kinh nghiệm quản trị dịch vụ khách hàng.',
    sampleTextEn:
      'Xin chào, đây là giọng đọc Nam Miền Nam hỗ trợ đọc nội dung Tiếng Việt tự nhiên.',
  },
  {
    id: 'vi-south-female',
    name: 'Tiếng Việt · Nữ (Miền Nam)',
    shortLabelVi: 'Nữ · Miền Nam (VI)',
    shortLabelEn: 'Vietnamese Female · South',
    voiceName: 'HoaiMy',
    gender: 'female',
    lang: 'vi-VN',
    langGroup: 'vi',
    region: 'Miền Nam Việt Nam',
    regionEn: 'Southern Vietnam',
    style: 'Nữ giới, giọng truyền cảm Miền Nam',
    pitch: 1.14,
    rate: 1.0,
    sampleTextVi:
      'Xin chào, đây là giọng đọc Nữ Miền Nam dịu dàng phục vụ phần giới thiệu hồ sơ năng lực Nguyễn Hùng Thái.',
    sampleTextEn:
      'Xin chào, đây là giọng đọc Nữ Miền Nam phục vụ phần thuyết minh Tiếng Việt.',
  },
  {
    id: 'vi-north-male',
    name: 'Tiếng Việt · Nam (Miền Bắc)',
    shortLabelVi: 'Nam · Miền Bắc (VI)',
    shortLabelEn: 'Vietnamese Male · North',
    voiceName: 'NamMinh',
    gender: 'male',
    lang: 'vi-VN',
    langGroup: 'vi',
    region: 'Miền Bắc Việt Nam',
    regionEn: 'Northern Vietnam',
    style: 'Nam giới, giọng chuẩn mực Miền Bắc',
    pitch: 0.88,
    rate: 0.98,
    sampleTextVi:
      'Xin chào, đây là giọng đọc Nam Miền Bắc rõ ràng, chuẩn xác cho báo cáo điều hành và dự án.',
    sampleTextEn:
      'Xin chào, đây là giọng đọc Nam Miền Bắc phục vụ thuyết minh Tiếng Việt chuẩn mực.',
  },
  {
    id: 'vi-north-female',
    name: 'Tiếng Việt · Nữ (Miền Bắc)',
    shortLabelVi: 'Nữ · Miền Bắc (VI)',
    shortLabelEn: 'Vietnamese Female · North',
    voiceName: 'Linh',
    gender: 'female',
    lang: 'vi-VN',
    langGroup: 'vi',
    region: 'Miền Bắc Việt Nam',
    regionEn: 'Northern Vietnam',
    style: 'Nữ giới, giọng thanh thoát Miền Bắc',
    pitch: 1.08,
    rate: 1.02,
    sampleTextVi:
      'Xin chào, đây là giọng đọc Nữ Miền Bắc trong trẻo, đồng hành giới thiệu hành trình sự nghiệp hơn 22 năm.',
    sampleTextEn:
      'Xin chào, đây là giọng đọc Nữ Miền Bắc cho phần thuyết minh Tiếng Việt.',
  },
  {
    id: 'en-us-male',
    name: 'English (US) · Male',
    shortLabelVi: 'Anh-Mỹ · Nam (EN-US)',
    shortLabelEn: 'English (US) · Male',
    voiceName: 'Guy',
    gender: 'male',
    lang: 'en-US',
    langGroup: 'en',
    region: 'United States',
    regionEn: 'US English',
    style: 'Male, Standard American English',
    pitch: 0.94,
    rate: 1.0,
    sampleTextVi:
      'Hello! This is the US English male narration voice for Nguyen Hung Thai executive portfolio.',
    sampleTextEn:
      'Hello! This is the US English male narration voice for Nguyen Hung Thai executive portfolio.',
  },
  {
    id: 'en-us-female',
    name: 'English (US) · Female',
    shortLabelVi: 'Anh-Mỹ · Nữ (EN-US)',
    shortLabelEn: 'English (US) · Female',
    voiceName: 'Aria',
    gender: 'female',
    lang: 'en-US',
    langGroup: 'en',
    region: 'United States',
    regionEn: 'US English',
    style: 'Female, Standard American English',
    pitch: 1.08,
    rate: 1.0,
    sampleTextVi:
      'Hello! This is the US English female narration voice for Nguyen Hung Thai executive portfolio.',
    sampleTextEn:
      'Hello! This is the US English female narration voice for Nguyen Hung Thai executive portfolio.',
  },
];

export const DEFAULT_PUCK_VOICE_PERSONA: VoicePersonaConfig = TTS_VOICE_PERSONAS[0];

export const ENGLISH_PUCK_VOICE_PERSONA: VoicePersonaConfig = {
  ...TTS_VOICE_PERSONAS[0],
  id: 'puck-male-english',
  name: 'AI Tri Nhan (Puck • 10yo Boy)',
  lang: 'en-US',
  langGroup: 'en',
  region: 'International English',
  regionEn: 'International English',
  style: '10-year-old boy, clear youthful natural English',
  pitch: 1.32,
  rate: 1.03,
};

const TTS_PERSONA_STORAGE_KEY = 'hungthai_tts_persona_id';
const VOICE_URI_STORAGE_KEY = 'hungthai_speech_voice_uri';

const ttsAudioCache = new Map<string, string>();
let activeHtmlAudio: HTMLAudioElement | null = null;
let activeTtsRequestId = 0;

export function getSavedVoiceURI(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(VOICE_URI_STORAGE_KEY) || '';
}

export function saveDefaultVoiceURI(uri: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VOICE_URI_STORAGE_KEY, uri);
  window.dispatchEvent(new CustomEvent(VOICE_CHANGE_EVENT, { detail: { voiceURI: uri, personaId: getSavedVoicePersonaId() } }));
}

export function getSavedVoicePersonaId(): TtsVoicePersonaId {
  return 'gemini-puck';
}

export function getVoicePersonaConfig(_personaId?: string): VoicePersonaConfig {
  return TTS_VOICE_PERSONAS[0];
}

export function saveVoicePersonaId(personaId: TtsVoicePersonaId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TTS_PERSONA_STORAGE_KEY, personaId);
  const voices = 'speechSynthesis' in window ? window.speechSynthesis.getVoices() : [];
  const config = getVoicePersonaConfig(personaId);
  const matchedVoice = pickVoiceForPersona(voices, config);
  if (matchedVoice?.voiceURI) {
    localStorage.setItem(VOICE_URI_STORAGE_KEY, matchedVoice.voiceURI);
  }
  window.dispatchEvent(
    new CustomEvent(VOICE_CHANGE_EVENT, {
      detail: { personaId, voiceURI: matchedVoice?.voiceURI || getSavedVoiceURI() },
    })
  );
}

export function subscribeSpeechVoicesReady(onUpdate: (voices: SpeechSynthesisVoice[]) => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return () => {};
  }
  const update = () => {
    const list = window.speechSynthesis.getVoices();
    if (list.length > 0) onUpdate(list);
  };
  update();
  window.speechSynthesis.addEventListener?.('voiceschanged', update);
  return () => {
    window.speechSynthesis.removeEventListener?.('voiceschanged', update);
  };
}

function scoreVoiceMatch(voice: SpeechSynthesisVoice, persona: VoicePersonaConfig, targetLangGroup: AssistantVoiceLanguage): number {
  const name = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  const vLang = (voice.lang || '').toLowerCase();
  let score = 0;

  if (targetLangGroup === 'en') {
    if (vLang.startsWith('en-us') || vLang.includes('en_us')) score += 40;
    else if (vLang.startsWith('en')) score += 20;
    else return -100;

    const femaleKw = ['aria', 'jenny', 'samantha', 'victoria', 'zira', 'ava', 'emma', 'female', 'woman', 'michelle', 'karen'];
    const maleKw = ['guy', 'david', 'mark', 'andrew', 'ryan', 'alex', 'daniel', 'male', 'man', 'christopher', 'steffan'];

    if (persona.gender === 'female') {
      if (femaleKw.some((k) => name.includes(k))) score += 30;
      if (maleKw.some((k) => name.includes(k))) score -= 20;
    } else {
      if (maleKw.some((k) => name.includes(k))) score += 30;
      if (femaleKw.some((k) => name.includes(k))) score -= 20;
    }
    if (name.includes('natural') || name.includes('google') || name.includes('microsoft')) score += 10;
    return score;
  }

  // Vietnamese matching
  if (vLang.includes('vi')) score += 50;
  else return -100;

  const maleViKw = ['namminh', 'nam minh', 'minh', 'puck', 'male', 'nam ', ' an', 'anh'];
  const femaleViKw = ['hoaimy', 'hoai my', 'linh', 'mai', 'lan', 'female', 'nu', 'nữ', 'chi'];
  const southKw = ['south', 'saigon', 'sai gon', 'mien nam', 'miền nam', 'ho chi minh'];
  const northKw = ['north', 'hanoi', 'ha noi', 'mien bac', 'miền bắc'];

  if (persona.gender === 'male') {
    if (maleViKw.some((k) => name.includes(k))) score += 25;
    if (femaleViKw.some((k) => name.includes(k))) score -= 20;
  } else {
    if (femaleViKw.some((k) => name.includes(k))) score += 25;
    if (maleViKw.some((k) => name.includes(k))) score -= 20;
  }

  if (persona.id.includes('south') && southKw.some((k) => name.includes(k))) score += 15;
  if (persona.id.includes('north') && northKw.some((k) => name.includes(k))) score += 15;
  if (name.includes('natural') || name.includes('google') || name.includes('microsoft')) score += 10;
  return score;
}

export function pickVoiceForPersona(
  voicesParam?: SpeechSynthesisVoice[],
  personaParam?: VoicePersonaConfig,
  langOverride?: AssistantVoiceLanguage
): SpeechSynthesisVoice | null {
  const voices =
    voicesParam && voicesParam.length > 0
      ? voicesParam
      : typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];
  if (!voices.length) return null;

  const persona = personaParam || getVoicePersonaConfig();
  const targetLangGroup: AssistantVoiceLanguage =
    langOverride || (persona.langGroup === 'en' ? 'en' : 'vi');

  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -999;

  for (const voice of voices) {
    const score = scoreVoiceMatch(voice, persona, targetLangGroup);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }

  if (best && bestScore > 0) return best;
  const fallbackLang = targetLangGroup === 'en' ? 'en' : 'vi';
  return voices.find((v) => v.lang.toLowerCase().includes(fallbackLang)) || voices[0] || null;
}

export function applyActivePersonaToUtterance(
  utterance: SpeechSynthesisUtterance,
  voicesParam?: SpeechSynthesisVoice[],
  langOverride?: AssistantVoiceLanguage,
  baseRate: number = 1.0
) {
  const persona = getVoicePersonaConfig();
  const effectiveLangGroup: AssistantVoiceLanguage =
    persona.langGroup === 'en' ? 'en' : langOverride === 'en' ? 'en' : 'vi';

  utterance.lang = effectiveLangGroup === 'en' ? 'en-US' : 'vi-VN';
  utterance.pitch = persona.pitch;
  utterance.rate = Number((baseRate * persona.rate).toFixed(2));

  const chosenVoice = pickVoiceForPersona(voicesParam, persona, effectiveLangGroup);
  if (chosenVoice) {
    utterance.voice = chosenVoice;
  }
}

export function findBestVoice(
  voicesParam?: SpeechSynthesisVoice[],
  savedUriParam?: string
): SpeechSynthesisVoice | null {
  const voices =
    voicesParam && voicesParam.length > 0
      ? voicesParam
      : typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];
  if (!voices.length) return null;

  const persona = getVoicePersonaConfig();
  if (persona.langGroup === 'vi' && persona.id !== 'gemini-puck') {
    const matched = pickVoiceForPersona(voices, persona, 'vi');
    if (matched) return matched;
  }

  const targetUri = savedUriParam || getSavedVoiceURI();
  if (targetUri) {
    const matched = voices.find((v) => v.voiceURI === targetUri);
    if (matched && matched.lang.toLowerCase().includes('vi')) return matched;
  }

  return pickVoiceForPersona(voices, persona, 'vi');
}

export function findBestEnglishVoice(
  voicesParam?: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  const voices =
    voicesParam && voicesParam.length > 0
      ? voicesParam
      : typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];
  if (!voices.length) return null;

  const persona = getVoicePersonaConfig();
  return pickVoiceForPersona(voices, persona, 'en');
}

export function stopActiveSpeech() {
  activeTtsRequestId += 1;
  if (activeHtmlAudio) {
    try {
      activeHtmlAudio.pause();
      activeHtmlAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeHtmlAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

function speakWithBrowserSynthesis(
  text: string,
  options?: {
    lang?: AssistantVoiceLanguage;
    speakingStyle?: string;
    voiceName?: string;
    rate?: number;
    pitch?: number;
    personaOverride?: VoicePersonaConfig;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: string) => void;
  }
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onError) options.onError('Trình duyệt không hỗ trợ phát âm thanh.');
    return;
  }

  window.speechSynthesis.cancel();

  const activePersona = options?.personaOverride || getVoicePersonaConfig();
  const langMode: AssistantVoiceLanguage =
    options?.personaOverride
      ? options.personaOverride.langGroup
      : activePersona.id !== 'gemini-puck'
      ? activePersona.langGroup
      : options?.lang === 'en'
      ? 'en'
      : 'vi';

  const fallbackPersona = langMode === 'en' ? ENGLISH_PUCK_VOICE_PERSONA : DEFAULT_PUCK_VOICE_PERSONA;
  const effectivePersona =
    activePersona.id === 'gemini-puck' && !options?.personaOverride ? fallbackPersona : activePersona;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = effectivePersona.lang;
  utterance.rate = options?.rate ?? effectivePersona.rate;
  utterance.pitch =
    options?.pitch && options.pitch !== 1.0 ? options.pitch : effectivePersona.pitch;

  const bestVoice = pickVoiceForPersona(undefined, effectivePersona, langMode);
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    options?.onError?.(e.error || 'Lỗi phát âm thanh');
  };

  window.speechSynthesis.speak(utterance);
}

async function playAudioDataUrl(
  dataUrl: string,
  requestId: number,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: string) => void;
  }
): Promise<boolean> {
  if (requestId !== activeTtsRequestId) return false;
  return new Promise((resolve) => {
    try {
      const audio = new Audio(dataUrl);
      activeHtmlAudio = audio;
      let started = false;

      audio.onplay = () => {
        if (requestId !== activeTtsRequestId) {
          audio.pause();
          resolve(false);
          return;
        }
        started = true;
        options?.onStart?.();
      };

      audio.onended = () => {
        if (activeHtmlAudio === audio) activeHtmlAudio = null;
        if (requestId === activeTtsRequestId) {
          options?.onEnd?.();
        }
        resolve(true);
      };

      audio.onerror = () => {
        if (activeHtmlAudio === audio) activeHtmlAudio = null;
        if (!started) {
          resolve(false);
        } else {
          options?.onError?.('Lỗi phát âm thanh Gemini TTS');
          resolve(true);
        }
      };

      audio.play().catch(() => {
        if (activeHtmlAudio === audio) activeHtmlAudio = null;
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

export function speakSiteText(
  text: string,
  options?: {
    lang?: AssistantVoiceLanguage;
    useGeminiTts?: boolean;
    speakingStyle?: string;
    voiceName?: string;
    rate?: number;
    pitch?: number;
    personaOverride?: VoicePersonaConfig;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: string) => void;
  }
) {
  stopActiveSpeech();
  const requestId = activeTtsRequestId;
  const activePersona = options?.personaOverride || getVoicePersonaConfig();
  const shouldUseGemini =
    (options?.useGeminiTts ?? true) && activePersona.id === 'gemini-puck';

  const langMode: AssistantVoiceLanguage =
    activePersona.id !== 'gemini-puck'
      ? activePersona.langGroup
      : options?.lang === 'en'
      ? 'en'
      : 'vi';

  if (shouldUseGemini) {
    const cacheKey = `${langMode}:${text}`;
    const cachedUrl = ttsAudioCache.get(cacheKey);
    if (cachedUrl) {
      options?.onStart?.();
      playAudioDataUrl(cachedUrl, requestId, {
        onEnd: options?.onEnd,
        onError: options?.onError,
      }).then((ok) => {
        if (!ok && requestId === activeTtsRequestId) {
          speakWithBrowserSynthesis(text, options);
        }
      });
      return;
    }

    options?.onStart?.();
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang: langMode }),
    })
      .then(async (resp) => {
        if (!resp.ok) return null;
        return (await resp.json()) as { audioBase64?: string; mimeType?: string };
      })
      .then(async (data) => {
        if (requestId !== activeTtsRequestId) return;
        if (data?.audioBase64) {
          const dataUrl = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          ttsAudioCache.set(cacheKey, dataUrl);
          const ok = await playAudioDataUrl(dataUrl, requestId, {
            onEnd: options?.onEnd,
            onError: options?.onError,
          });
          if (ok || requestId !== activeTtsRequestId) return;
        }
        if (requestId === activeTtsRequestId) {
          speakWithBrowserSynthesis(text, options);
        }
      })
      .catch(() => {
        if (requestId === activeTtsRequestId) {
          speakWithBrowserSynthesis(text, options);
        }
      });
    return;
  }

  speakWithBrowserSynthesis(text, options);
}

export function previewSpeechVoice(
  personaId?: TtsVoicePersonaId,
  uiLang: AssistantVoiceLanguage = 'vi',
  callbacks?: { onStart?: () => void; onEnd?: () => void; onError?: (err?: string) => void }
) {
  const persona = getVoicePersonaConfig(personaId);
  const sampleText =
    persona.langGroup === 'en' || uiLang === 'en' ? persona.sampleTextEn : persona.sampleTextVi;

  speakSiteText(sampleText, {
    lang: persona.langGroup,
    useGeminiTts: Boolean(persona.useGeminiCloud),
    personaOverride: persona,
    pitch: persona.pitch,
    rate: persona.rate,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onError,
  });
}
