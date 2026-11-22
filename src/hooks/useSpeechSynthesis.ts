import { useState, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const speak = useCallback((id: string, text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.onend = () => setActiveSpeechId(null);
      utterance.onerror = () => setActiveSpeechId(null);
      setActiveSpeechId(id);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveSpeechId(null);
  }, []);

  const toggleSpeak = useCallback((id: string, text: string) => {
    if (activeSpeechId === id) {
      stop();
    } else {
      speak(id, text);
    }
  }, [activeSpeechId, speak, stop]);

  return { activeSpeechId, speak, stop, toggleSpeak };
}
