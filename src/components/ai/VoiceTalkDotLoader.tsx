// Lucian UX/UI Prompt #084 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#084
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_SAMPLE_QUESTIONS } from '@/data/aiSampleQuestions';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { WebIcon } from '@/components/ui/WebIcon';

export interface VoiceTalkDotLoaderProps {
  isEn?: boolean;
  onTranscribedQuestion?: (question: string, autoSend?: boolean) => void;
}

let u084StyleInjected = false;

const U084_SCOPED_CSS = `
/* Lucian UX/UI Prompt #084 · Voice-reactive dot loader */
.u084-host {
  --ux-page: var(--app-bg-base, #F4F2EE);
  --ux-surface: var(--surface-secondary-bg, var(--bg-subcard, #FFFFFF));
  --ux-surface-2: var(--surface-tertiary-bg, #F5F3EF);
  --ux-surface-3: rgba(148, 163, 184, 0.18);
  --ux-ink: var(--text-primary, #16151B);
  --ux-ink-2: var(--text-secondary, #57535F);
  --ux-ink-3: var(--text-muted, #8E8A97);
  --ux-line: var(--border-subcard, rgba(22, 21, 27, .09));
  --ux-line-2: rgba(22, 21, 27, .17);
  --ux-accent: var(--color-primary, #6A57F2);
  --ux-accent-2: #2F8FE0;
  --ux-accent-soft: color-mix(in srgb, var(--color-primary, #6A57F2) 14%, transparent);
  --ux-accent-ink: #FFFFFF;
  --ux-mint: #119C72;
  --ux-warn: #D6731E;
  --ux-danger: #D93A55;
  --ux-shadow: rgba(40, 30, 80, .14);
  --ux-shadow-strong: rgba(40, 30, 80, .3);
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
}

html.dark .u084-host,
:root[data-theme="dark"] .u084-host {
  --ux-page: #07080D;
  --ux-surface: var(--surface-secondary-bg, #13141C);
  --ux-surface-2: #1A1B25;
  --ux-surface-3: #252632;
  --ux-ink: var(--text-primary, #F4F0E8);
  --ux-ink-2: var(--text-secondary, rgba(244, 240, 232, .68));
  --ux-ink-3: var(--text-muted, rgba(244, 240, 232, .48));
  --ux-line: var(--border-subcard, rgba(255, 255, 255, .12));
  --ux-line-2: rgba(255, 255, 255, .18);
  --ux-accent: var(--color-primary, #B7A4FF);
  --ux-accent-2: #7DB4FF;
  --ux-accent-soft: rgba(183, 164, 255, .15);
  --ux-accent-ink: #0B0C12;
  --ux-mint: #7EE8C0;
  --ux-warn: #FFB26B;
  --ux-danger: #FF7D8C;
  --ux-shadow: rgba(0, 0, 0, .45);
  --ux-shadow-strong: rgba(0, 0, 0, .72);
}

.u084 {
  position: relative;
  width: 100%;
  max-width: 440px;
  min-height: 330px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px 22px 22px;
  border-radius: 26px;
  background: var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 30px 60px -36px var(--ux-shadow-strong);
  overflow: hidden;
  text-align: center;
  color: var(--ux-ink);
  box-sizing: border-box;
}

.u084-lab {
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--ux-ink-3);
  transition: color .3s;
}

.u084[data-s="listen"] .u084-lab {
  color: var(--ux-danger);
}

.u084[data-s="think"] .u084-lab {
  color: var(--ux-accent);
}

.u084-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 96px;
  margin-top: 10px;
}

.u084-dots i {
  display: inline-block;
  width: 22px;
  height: calc(22px + var(--h, 0) * 68px);
  border-radius: 999px;
  background: linear-gradient(180deg, var(--c1), var(--c2));
  transition: height .12s linear;
}

.u084-dots i:nth-child(1) { --c1: #22C3A6; --c2: #0EA5E9; }
.u084-dots i:nth-child(2) { --c1: #3D8BFF; --c2: #7B61FF; }
.u084-dots i:nth-child(3) { --c1: #7B61FF; --c2: #B04FD0; }
.u084-dots i:nth-child(4) { --c1: #FF6B8B; --c2: #E5484D; }
.u084-dots i:nth-child(5) { --c1: #FFB547; --c2: #FF7A45; }

.u084[data-s="idle"] .u084-dots i {
  animation: u084-breath 2.4s ease-in-out infinite;
  animation-delay: calc(var(--i, 0) * .12s);
}

@keyframes u084-breath {
  50% { transform: scale(1.15); opacity: .75; }
}

.u084[data-s="think"] .u084-dots i {
  height: 22px;
  animation: u084-wave 1s cubic-bezier(.45, 0, .55, 1) infinite;
  animation-delay: calc(var(--i, 0) * .1s);
}

@keyframes u084-wave {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-18px); }
}

.u084-say {
  min-height: 48px;
  margin: 12px 0 14px;
  font-size: 16px;
  line-height: 1.45;
  font-weight: 750;
  letter-spacing: -.02em;
  color: var(--ux-ink);
  max-width: 100%;
}

.u084-say .c {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -2px;
  background: var(--ux-accent);
  animation: u084-caret 1s steps(1) infinite;
}

@keyframes u084-caret {
  50% { opacity: 0; }
}

.u084-say.dim {
  color: var(--ux-ink-3);
  font-weight: 650;
  font-size: 14.5px;
}

.u084-mic {
  position: relative;
  width: 74px;
  height: 74px;
  margin-top: auto;
  border: 0;
  padding: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--ux-ink);
  color: var(--ux-page);
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: pointer;
  transition: transform .35s var(--ux-spring), background-color .3s, color .3s;
}

.u084-mic svg {
  width: 28px;
  height: 28px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.u084-mic::before {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: 2px solid var(--ux-danger);
  opacity: 0;
  transform: scale(calc(1 + var(--lv, 0) * .35));
  transition: opacity .2s;
  pointer-events: none;
}

.u084[data-s="listen"] .u084-mic {
  background: var(--ux-danger);
  color: #fff;
  transform: scale(1.08);
}

.u084[data-s="listen"] .u084-mic::before {
  opacity: .55;
}

.u084-mic:focus-visible {
  outline: 2px solid var(--ux-accent);
  outline-offset: 6px;
}

.u084-hint {
  margin-top: 14px;
  font-size: 12px;
  font-weight: 650;
  color: var(--ux-ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .u084, .u084 *, .u084 *::before, .u084 *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}
`;

export const VoiceTalkDotLoader: React.FC<VoiceTalkDotLoaderProps> = ({
  isEn = false,
  onTranscribedQuestion,
}) => {
  const [phase, setPhase] = useState<'idle' | 'listen' | 'think'>('idle');
  const [statusLabel, setStatusLabel] = useState<string>(isEn ? 'Idle' : 'Sẵn sàng');
  const [displayText, setDisplayText] = useState<string>(
    isEn ? 'Listening while you hold' : 'Nhấn và giữ nút Mic để nói'
  );
  const [isDimText, setIsDimText] = useState<boolean>(true);
  const [isTypingCaret, setIsTypingCaret] = useState<boolean>(false);
  const [lastTranscribed, setLastTranscribed] = useState<string>('');

  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRefs = useRef<Array<HTMLElement | null>>([]);
  const micRef = useRef<HTMLButtonElement | null>(null);
  const rafRef = useRef<number>(0);
  const t0Ref = useRef<number>(0);
  const timersRef = useRef<number[]>([]);
  const promptIdxRef = useRef<number>(0);
  const heldRef = useRef<boolean>(false);
  const phaseRef = useRef<'idle' | 'listen' | 'think'>('idle');
  // Optional browser SpeechRecognition transcript if user speaks into real mic
  const recognitionRef = useRef<any>(null);
  const liveSpeechTranscriptRef = useRef<string>('');

  phaseRef.current = phase;

  useEffect(() => {
    if (typeof document !== 'undefined' && !u084StyleInjected) {
      if (!document.getElementById('lucian-u084-voice-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'lucian-u084-voice-styles';
        styleEl.textContent = U084_SCOPED_CSS;
        document.head.appendChild(styleEl);
      }
      u084StyleInjected = true;
    }
  }, []);

  useEffect(() => {
    if (phase === 'idle' && !lastTranscribed) {
      setStatusLabel(isEn ? 'Idle' : 'Sẵn sàng');
      setDisplayText(isEn ? 'Listening while you hold' : 'Nhấn và giữ nút Mic để nói');
    }
  }, [isEn, phase, lastTranscribed]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
    };
  }, [clearAllTimers]);

  const getNextSamplePrompt = useCallback(() => {
    if (isEn) {
      const enPrompts = [
        'Summarize Mr. Nguyen Hung Thai’s 22+ years of CX leadership experience',
        'What were his key achievements at MoMo Wallet and Vietnam Esports?',
        'Which Contact Center, CRM and AI Bot systems has he built?',
        'How does he design COPC quality assurance and SLA > 98.6%?',
        'How can I contact Mr. Hung Thai or download his full CV?',
      ];
      const txt = enPrompts[promptIdxRef.current % enPrompts.length];
      promptIdxRef.current += 1;
      return txt;
    }
    const pool =
      ALL_SAMPLE_QUESTIONS.length > 0
        ? ALL_SAMPLE_QUESTIONS.map((q) => q.question)
        : [
            'Tóm tắt hành trình 22+ năm lãnh đạo CSKH của anh Hùng Thái',
            'Thành tựu nổi bật tại Ví MoMo và Vietnam Esports là gì?',
            'Các hệ thống tổng đài Omnichannel & CRM anh đã xây dựng?',
          ];
    const txt = pool[promptIdxRef.current % pool.length];
    promptIdxRef.current += 1;
    return txt;
  }, [isEn]);

  const listenLoop = useCallback((now: number) => {
    if (phaseRef.current !== 'listen') return;
    const rm =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    const t = (now - t0Ref.current) / 1000;
    let lv = 0;
    dotRefs.current.forEach((d, i) => {
      if (!d) return;
      let v = Math.abs(
        Math.sin(t * 7 + i * 1.3) * 0.6 +
          Math.sin(t * 13 + i * 2.1) * 0.3 +
          Math.sin(t * 3.1) * 0.2
      );
      v = rm ? 0.4 : Math.min(1, v * (0.7 + 0.3 * Math.sin(t * 2 + i)));
      d.style.setProperty('--h', v.toFixed(3));
      lv += v;
    });
    if (micRef.current) {
      micRef.current.style.setProperty('--lv', (lv / 5).toFixed(3));
    }
    rafRef.current = window.requestAnimationFrame(listenLoop);
  }, []);

  const handleDown = useCallback(() => {
    if (heldRef.current) return;
    heldRef.current = true;
    SoundEngine.playTap();
    clearAllTimers();
    liveSpeechTranscriptRef.current = '';

    setPhase('listen');
    phaseRef.current = 'listen';
    setStatusLabel(isEn ? 'Listening' : 'Đang nghe...');
    setIsDimText(true);
    setIsTypingCaret(false);
    setDisplayText(isEn ? 'Go ahead…' : 'Mời Anh/Chị nói câu hỏi…');

    // Try browser Web Speech API if supported alongside the voice-reactive animation
    try {
      const SpeechRec =
        (window as unknown as Record<string, any>).SpeechRecognition ||
        (window as unknown as Record<string, any>).webkitSpeechRecognition;
      if (SpeechRec) {
        const rec = new SpeechRec();
        rec.lang = isEn ? 'en-US' : 'vi-VN';
        rec.interimResults = true;
        rec.continuous = false;
        rec.onresult = (event: any) => {
          const transcript = Array.from(event.results || [])
            .map((r: any) => r[0]?.transcript || '')
            .join(' ')
            .trim();
          if (transcript) {
            liveSpeechTranscriptRef.current = transcript;
          }
        };
        rec.start();
        recognitionRef.current = rec;
      }
    } catch {
      // Fallback to curated portfolio questions if mic permission not granted
    }

    t0Ref.current = performance.now();
    rafRef.current = window.requestAnimationFrame(listenLoop);
  }, [clearAllTimers, isEn, listenLoop]);

  const handleUp = useCallback(() => {
    if (!heldRef.current) return;
    heldRef.current = false;
    SoundEngine.playTap();

    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    try {
      recognitionRef.current?.stop?.();
    } catch {
      // ignore
    }

    dotRefs.current.forEach((d) => {
      d?.style.setProperty('--h', '0');
    });
    micRef.current?.style.setProperty('--lv', '0');

    setPhase('think');
    phaseRef.current = 'think';
    setStatusLabel(isEn ? 'Thinking' : 'Đang xử lý giọng nói');
    setDisplayText('');
    setIsTypingCaret(false);

    const rm =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

    const thinkTimer = window.setTimeout(() => {
      const txt = liveSpeechTranscriptRef.current.trim() || getNextSamplePrompt();
      setPhase('idle');
      phaseRef.current = 'idle';
      setStatusLabel(isEn ? 'Got it' : 'Đã nhận diện câu hỏi');
      setIsDimText(false);
      setLastTranscribed(txt);

      if (rm) {
        setDisplayText(txt);
        setIsTypingCaret(false);
        onTranscribedQuestion?.(txt, false);
        return;
      }

      const chars = Array.from(txt);
      let k = 0;
      setIsTypingCaret(true);

      const typeNext = () => {
        k += 1;
        setDisplayText(chars.slice(0, k).join(''));
        if (k < chars.length) {
          const tid = window.setTimeout(typeNext, 38);
          timersRef.current.push(tid);
        } else {
          setIsTypingCaret(false);
          onTranscribedQuestion?.(txt, false);
        }
      };
      typeNext();
    }, rm ? 300 : 1400);

    timersRef.current.push(thinkTimer);
  }, [getNextSamplePrompt, isEn, onTranscribedQuestion]);

  return (
    <div className="u084-host w-full flex flex-col items-center justify-center py-2">
      <div ref={rootRef} className="ux u084" data-s={phase}>
        <span className="u084-lab" aria-live="polite">
          {statusLabel}
        </span>

        <div className="u084-dots" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((idx) => (
            <i
              key={idx}
              ref={(el) => {
                dotRefs.current[idx] = el;
              }}
              style={{ '--i': idx } as React.CSSProperties}
            />
          ))}
        </div>

        <p className={`u084-say ${isDimText ? 'dim' : ''}`} aria-live="polite">
          {displayText}
          {isTypingCaret && <span className="c" />}
        </p>

        <button
          ref={micRef}
          id="ai-talk-mic-hold-btn"
          className="u084-mic"
          type="button"
          aria-label={isEn ? 'Hold to talk to AI Tri Nhan' : 'Nhấn và giữ để nói với AI Trí Nhân'}
          onPointerDown={(e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            try {
              e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
              // ignore
            }
            handleDown();
          }}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
              e.preventDefault();
              handleDown();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleUp();
            }
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <svg viewBox="0 0 28 28" aria-hidden="true">
            <rect x="10" y="4" width="8" height="13" rx="4" />
            <path d="M6.5 13.5a7.5 7.5 0 0 0 15 0M14 21v3" />
          </svg>
        </button>

        <span className="u084-hint" aria-hidden="true">
          {isEn
            ? 'Press and hold Mic (or Space) to talk, release to transcribe'
            : 'Nhấn giữ nút Mic (hoặc phím Space) để nói, thả ra để chuyển thành câu hỏi'}
        </span>

        {lastTranscribed && phase === 'idle' && !isTypingCaret && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                onTranscribedQuestion?.(lastTranscribed, true);
              }}
              style={{
                background: 'var(--bg-button-primary)',
                color: 'var(--text-button-primary, #FFFFFF)',
              }}
              className="px-4 py-1.5 rounded-full typo-badge font-bold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition hover:opacity-95"
            >
              <WebIcon name="send" className="w-3.5 h-3.5" />
              <span>{isEn ? 'Ask Tri Nhan Now' : 'Gửi hỏi Trí Nhân ngay'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceTalkDotLoader;
