'use client';

import React, { useState, useEffect } from 'react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';

export interface AiMascotWidgetProps {
  visible: boolean;
  widthPx: number;
  isDark?: boolean;
  onOpenAiAssistant: () => void;
}

const POSE_FRAMES = [
  '/assets/widgets/ai-mascot-welcome.png',
  '/assets/widgets/ai-mascot-wave.png',
  '/assets/widgets/ai-mascot-jump.png',
  '/assets/widgets/ai-mascot-wave.png',
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(mq.matches);
    handleChange();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    }
    mq.addListener(handleChange);
    return () => mq.removeListener(handleChange);
  }, []);

  return reduced;
}

export const AiMascotWidget: React.FC<AiMascotWidgetProps> = ({
  visible,
  widthPx,
  isDark = false,
  onOpenAiAssistant,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const prefersReducedMotion = usePrefersReducedMotion();

  const [useAnimatedWebp, setUseAnimatedWebp] = useState(true);
  const [poseIdx, setPoseIdx] = useState(0);
  const [webpFailed, setWebpFailed] = useState(false);
  const [pngFailed, setPngFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Subtle pose cycle fallback only if animated webp fails
  useEffect(() => {
    if (!visible || prefersReducedMotion || (useAnimatedWebp && !webpFailed)) return;
    const interval = window.setInterval(() => {
      setPoseIdx((prev) => (prev + 1) % POSE_FRAMES.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [visible, prefersReducedMotion, useAnimatedWebp, webpFailed]);

  if (!visible || widthPx <= 0) {
    return null;
  }

  const label = isEn
    ? 'Tri Nhan AI Assistant — Click to open AI Assistant'
    : 'Trợ lý AI Trí Nhân — Nhấn để mở Trợ lý AI';

  const activeSrc =
    prefersReducedMotion
      ? '/assets/widgets/ai-mascot-welcome.png'
      : useAnimatedWebp && !webpFailed
        ? '/assets/widgets/ai-mascot-loop.webp'
        : POSE_FRAMES[poseIdx];

  return (
    <div
      id="peripheral-ai-mascot-wrapper"
      data-element-name="Nhân vật AI góc dưới bên phải"
      data-element-type="widget"
      data-element-page="global"
      className="fixed bottom-1.5 right-1.5 z-40 pointer-events-none select-none flex items-end justify-center"
      style={{
        width: `${widthPx}px`,
        maxWidth: `${widthPx}px`,
        contain: 'layout style',
      }}
    >
      <button
        id="peripheral-ai-mascot-btn"
        type="button"
        onClick={() => {
          SoundEngine.playPop();
          onOpenAiAssistant();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        aria-label={label}
        title={label}
        style={{
          filter: isDark
            ? 'drop-shadow(0 12px 22px rgba(0, 0, 0, 0.56)) drop-shadow(0 0 12px rgba(78, 158, 170, 0.28))'
            : 'drop-shadow(0 12px 18px rgba(50, 40, 80, 0.18)) drop-shadow(0 0 10px rgba(105, 201, 196, 0.24))',
        }}
        className="ai-mascot-btn pointer-events-auto relative flex flex-col items-center justify-end w-full bg-transparent border-0 p-0 cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2 group"
      >
        {/* Tooltip nhỏ chỉ hiện khi hover hoặc focus */}
        <span
          className={`pointer-events-none mb-1 px-2.5 py-1 rounded-full typo-label font-play font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
          style={{
            background: 'var(--bg-popup)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-card)',
          }}
        >
          {isEn ? 'Ask AI Assistant' : 'Hỏi Trợ lý AI'}
        </span>

        {/* GPU-composited nhún nhảy 10s frame layer (zero layout shifts, zero JS timer loop) */}
        <span
          className={`block w-full pointer-events-none select-none ${
            prefersReducedMotion ? '' : 'ai-mascot-motion-layer'
          }`}
          style={{
            aspectRatio: '1 / 1',
            contain: 'layout style',
          }}
        >
          {!pngFailed ? (
            <img
              src={activeSrc}
              alt={isEn ? 'Animated AI Mascot' : 'Nhân vật Trợ lý AI'}
              draggable={false}
              decoding="async"
              onError={() => {
                if (useAnimatedWebp && !webpFailed) {
                  setWebpFailed(true);
                  setUseAnimatedWebp(false);
                } else {
                  setPngFailed(true);
                }
              }}
              className="w-full h-full object-contain block pointer-events-none select-none"
            />
          ) : (
            <svg
              viewBox="0 0 120 120"
              className="w-full h-full block pointer-events-none"
              aria-hidden="true"
            >
              <circle cx="32" cy="34" r="18" fill="#eef4fb" stroke="#7dd3fc" strokeWidth="3" />
              <circle cx="88" cy="34" r="18" fill="#eef4fb" stroke="#7dd3fc" strokeWidth="3" />
              <circle cx="60" cy="56" r="28" fill="#f8fbff" stroke="#bae6fd" strokeWidth="2.5" />
              <circle cx="50" cy="54" r="6" fill="#06b6d4" />
              <circle cx="70" cy="54" r="6" fill="#06b6d4" />
              <rect x="44" y="84" width="32" height="24" rx="12" fill="#f1f5f9" stroke="#7dd3fc" strokeWidth="2" />
              <circle cx="60" cy="95" r="6" fill="#22d3ee" />
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};
