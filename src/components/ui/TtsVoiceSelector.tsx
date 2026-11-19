'use client';

import React, { useEffect, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  TTS_VOICE_PERSONAS,
  TtsVoicePersonaId,
  VOICE_CHANGE_EVENT,
  getSavedVoicePersonaId,
  getVoicePersonaConfig,
  previewSpeechVoice,
  saveVoicePersonaId,
  stopActiveSpeech,
  subscribeSpeechVoicesReady,
} from '@/utils/speechVoice';

export interface TtsVoiceSelectorProps {
  isEn?: boolean;
  variant?: 'popup-list' | 'inline-select';
  onVoiceChanged?: (personaId: TtsVoicePersonaId) => void;
}

export const TtsVoiceSelector: React.FC<TtsVoiceSelectorProps> = ({
  isEn = false,
  variant = 'popup-list',
  onVoiceChanged,
}) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<TtsVoicePersonaId>('gemini-puck');
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [browserVoiceCount, setBrowserVoiceCount] = useState<number>(0);

  useEffect(() => {
    setSelectedPersonaId(getSavedVoicePersonaId());
    const unsubVoices = subscribeSpeechVoicesReady((list) => {
      setBrowserVoiceCount(list.length);
    });
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent<{ personaId?: TtsVoicePersonaId }>).detail;
      setSelectedPersonaId(detail?.personaId || getSavedVoicePersonaId());
    };
    window.addEventListener(VOICE_CHANGE_EVENT, handleSync);
    return () => {
      unsubVoices();
      window.removeEventListener(VOICE_CHANGE_EVENT, handleSync);
    };
  }, []);

  const handleSelectPersona = (id: TtsVoicePersonaId) => {
    SoundEngine.playTap();
    setSelectedPersonaId(id);
    saveVoicePersonaId(id);
    onVoiceChanged?.(id);
  };

  const handlePreview = (id: TtsVoicePersonaId, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEngine.playTap();
    if (previewingId === id) {
      stopActiveSpeech();
      setPreviewingId(null);
      return;
    }
    setPreviewingId(id);
    previewSpeechVoice(id, isEn ? 'en' : 'vi', {
      onStart: () => setPreviewingId(id),
      onEnd: () => setPreviewingId(null),
      onError: () => setPreviewingId(null),
    });
  };

  const activeConfig = getVoicePersonaConfig(selectedPersonaId);

  if (variant === 'inline-select') {
    return (
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-[14px] border shrink-0"
        style={{
          background: 'var(--bg-subcard)',
          borderColor: 'var(--border-subcard)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 16%, transparent)', color: 'var(--color-primary)' }}
          >
            <WebIcon name="mic" className="w-3.5 h-3.5" />
          </span>
          <span className="typo-label font-semibold truncate" style={{ color: 'var(--text-secondary)' }}>
            {isEn ? 'TTS Voice:' : 'Giọng đọc TTS:'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-1 sm:flex-initial justify-end min-w-0">
          <select
            aria-label={isEn ? 'Select multilingual TTS voice' : 'Chọn giọng đọc đa ngôn ngữ TTS'}
            value={selectedPersonaId}
            onChange={(e) => handleSelectPersona(e.target.value as TtsVoicePersonaId)}
            className="theme-input px-2.5 py-1 rounded-[14px] border typo-caption font-semibold cursor-pointer min-w-0 max-w-[215px] focus:outline-none"
          >
            {TTS_VOICE_PERSONAS.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {isEn ? persona.shortLabelEn : persona.shortLabelVi}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => handlePreview(selectedPersonaId)}
            className="banner-control-pill inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge cursor-pointer transition shrink-0"
            title={
              previewingId === selectedPersonaId
                ? isEn
                  ? 'Stop voice preview'
                  : 'Dừng nghe thử'
                : isEn
                ? `Test ${activeConfig.shortLabelEn}`
                : `Nghe thử ${activeConfig.shortLabelVi}`
            }
          >
            <WebIcon name={previewingId === selectedPersonaId ? 'pause' : 'volume-2'} className="w-3.5 h-3.5" />
            <span>{previewingId === selectedPersonaId ? (isEn ? 'Stop' : 'Dừng') : isEn ? 'Test' : 'Nghe thử'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-1 pt-2 border-t flex flex-col gap-1.5"
      style={{ borderColor: 'var(--border-subcard)' }}
      data-no-translate="true"
    >
      <div className="px-2 py-0.5 flex items-center justify-between gap-2">
        <span
          className="typo-label font-bold tracking-wide flex items-center gap-1.5"
          style={{ color: 'var(--text-link, var(--color-primary))' }}
        >
          <WebIcon name="mic" className="w-3.5 h-3.5 shrink-0" />
          <span>{isEn ? 'TTS Voice Persona' : 'Giọng đọc thuyết minh'}</span>
        </span>
        <span className="typo-badge font-normal" style={{ color: 'var(--text-muted)' }}>
          {browserVoiceCount > 0 ? `${TTS_VOICE_PERSONAS.length} chế độ` : 'Web Speech'}
        </span>
      </div>

      <div className="max-h-[210px] overflow-y-auto no-scrollbar flex flex-col gap-1 pr-0.5">
        {TTS_VOICE_PERSONAS.map((persona) => {
          const isSelected = selectedPersonaId === persona.id;
          const isPreviewing = previewingId === persona.id;
          const flag = persona.id === 'gemini-puck' ? '🤖' : persona.langGroup === 'en' ? '🇺🇸' : '🇻🇳';

          return (
            <div
              key={persona.id}
              data-selected={isSelected ? 'true' : undefined}
              className="theme-dropdown-option w-full flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-[14px] transition"
            >
              <button
                type="button"
                onClick={() => handleSelectPersona(persona.id as TtsVoicePersonaId)}
                className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer"
              >
                <span className="typo-body-sm leading-none shrink-0">{flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="typo-caption font-bold truncate leading-tight">
                    {isEn ? persona.shortLabelEn : persona.shortLabelVi}
                  </div>
                  <div className="typo-badge opacity-80 truncate leading-tight">
                    {isEn ? persona.regionEn : persona.region}
                  </div>
                </div>
                {isSelected && <span className="shrink-0 font-bold typo-caption">✓</span>}
              </button>

              <button
                type="button"
                onClick={(e) => handlePreview(persona.id as TtsVoicePersonaId, e)}
                aria-label={isEn ? `Preview ${persona.shortLabelEn}` : `Nghe thử ${persona.shortLabelVi}`}
                title={isPreviewing ? (isEn ? 'Stop' : 'Dừng') : isEn ? 'Preview voice' : 'Nghe thử giọng'}
                className="w-7 h-7 rounded-full flex items-center justify-center border shrink-0 cursor-pointer transition hover:opacity-85"
                style={{
                  borderColor: 'var(--border-subcard)',
                  background: isPreviewing ? 'var(--bg-button-primary)' : 'var(--bg-subcard)',
                  color: isPreviewing ? '#FFFFFF' : 'var(--color-primary)',
                }}
              >
                <WebIcon name={isPreviewing ? 'pause' : 'volume-2'} className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TtsVoiceSelector;
