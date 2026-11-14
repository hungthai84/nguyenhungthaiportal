export const VOICE_CHANGE_EVENT = 'speech_voice_changed';

export type AssistantVoiceLanguage = 'vi' | 'en';

export interface VoicePersonaConfig {
  id: string;
  name: string;
  voiceName: string;
  gender: 'male' | 'female';
  lang: string;
  region: string;
  style: string;
  pitch: number;
  rate: number;
}

export const DEFAULT_PUCK_VOICE_PERSONA: VoicePersonaConfig = {
  id: 'puck-male-southern-vi',
  name: 'Trí Nhân (Giọng Puck Nam • Miền Nam Việt Nam)',
  voiceName: 'Puck',
  gender: 'male',
  lang: 'vi-VN',
  region: 'Miền Nam Việt Nam',
  style: 'Nam giới, Tiếng Việt (Giọng Miền Nam Việt Nam)',
  pitch: 0.96,
  rate: 1.02,
};

export const ENGLISH_PUCK_VOICE_PERSONA: VoicePersonaConfig = {
  id: 'puck-male-english',
  name: 'Tri Nhan (Puck Male Voice • English)',
  voiceName: 'Puck',
  gender: 'male',
  lang: 'en-US',
  region: 'International English',
  style: 'Male, Clear Natural English',
  pitch: 0.96,
  rate: 1.0,
};

const ttsAudioCache = new Map<string, string>();
let activeHtmlAudio: HTMLAudioElement | null = null;
let activeTtsRequestId = 0;

export function getSavedVoiceURI(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('hungthai_speech_voice_uri') || '';
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

  const targetUri = savedUriParam || getSavedVoiceURI();
  if (targetUri) {
    const matched = voices.find((v) => v.voiceURI === targetUri);
    if (matched) return matched;
  }

  const viVoices = voices.filter((v) => v.lang.toLowerCase().includes('vi'));
  if (viVoices.length > 0) {
    // Ưu tiên giọng Nam miền Nam / NamMinh / Puck / Google Tiếng Việt
    const maleSouthern = viVoices.find((v) => {
      const n = `${v.name} ${v.voiceURI}`.toLowerCase();
      return (
        n.includes('puck') ||
        n.includes('namminh') ||
        n.includes('nam minh') ||
        n.includes('southern') ||
        n.includes('sai gon') ||
        n.includes('saigon') ||
        n.includes('male') ||
        n.includes('nam') ||
        n.includes('an')
      );
    });
    return maleSouthern || viVoices[0];
  }

  return voices[0] || null;
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

  const enVoices = voices.filter((v) => v.lang.toLowerCase().includes('en'));
  if (enVoices.length > 0) {
    const maleEnglish = enVoices.find((v) => {
      const n = `${v.name} ${v.voiceURI}`.toLowerCase();
      return (
        n.includes('puck') ||
        n.includes('male') ||
        n.includes('guy') ||
        n.includes('daniel') ||
        n.includes('david') ||
        n.includes('mark') ||
        n.includes('alex') ||
        n.includes('ryan') ||
        n.includes('andrew')
      );
    });
    return maleEnglish || enVoices[0];
  }
  return voices[0] || null;
}

export function saveDefaultVoiceURI(uri: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hungthai_speech_voice_uri', uri);
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

  const langMode: AssistantVoiceLanguage = options?.lang === 'en' ? 'en' : 'vi';
  const persona = langMode === 'en' ? ENGLISH_PUCK_VOICE_PERSONA : DEFAULT_PUCK_VOICE_PERSONA;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = persona.lang;
  utterance.rate = options?.rate ?? persona.rate;
  utterance.pitch = options?.pitch ?? persona.pitch;

  const bestVoice = langMode === 'en' ? findBestEnglishVoice() : findBestVoice();
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.onstart = () => {
    if (options?.onStart) options.onStart();
  };

  utterance.onend = () => {
    if (options?.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    if (options?.onError) options.onError(e.error || 'Lỗi phát âm thanh');
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
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err?: string) => void;
  }
) {
  stopActiveSpeech();
  const requestId = activeTtsRequestId;
  const langMode: AssistantVoiceLanguage = options?.lang === 'en' ? 'en' : 'vi';

  if (options?.useGeminiTts) {
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
