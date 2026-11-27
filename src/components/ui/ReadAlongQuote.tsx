'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ReadAlongQuoteProps {
  text?: string;
  className?: string;
  activeColor?: string;
  autoPlay?: boolean;
}

export const ReadAlongQuote: React.FC<ReadAlongQuoteProps> = ({
  text = 'Thành công không chỉ đến từ năng lực, mà từ sự chân thành và tinh thần phụng sự.',
  className,
  activeColor,
  autoPlay = true,
}) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);

  const words = React.useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  useEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    if (!container || !pill || words.length === 0) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const S = (x: number, k = 400, c = 30) => ({ x, v: 0, t: x, k, c });
    const tune = (s: { k: number; c: number }, k: number, c: number) => {
      s.k = k;
      s.c = reduce ? 2 * Math.sqrt(k) : c;
    };
    const step = (s: { x: number; v: number; t: number; k: number; c: number }, dt: number) => {
      const a = -s.k * (s.x - s.t) - s.c * s.v;
      s.v += a * dt;
      s.x += s.v * dt;
    };
    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const PAD = 0.16; // em past each side of word
    const L = S(0, 520, 40);
    const R = S(0, 520, 40);
    const Y = S(0, 600, 48);
    const O = S(0, 300, 30);

    let at = -1;
    let wait = 0.8;
    let lineTop: number | null = null;
    let animationFrameId: number;
    let lastTime = performance.now();

    const em = () => {
      const fs = window.getComputedStyle(container).fontSize;
      return parseFloat(fs) || 16;
    };

    const box = (i: number) => {
      const el = wordsRef.current[i];
      if (!el) return { l: 0, r: 0, top: 0 };
      const p = em() * PAD;
      return {
        l: el.offsetLeft - p,
        r: el.offsetLeft + el.offsetWidth + p,
        top: el.offsetTop + (el.offsetHeight - em() * 1.3) / 2,
      };
    };

    const dwell = (i: number) => {
      const word = words[i] || '';
      return 0.28 + word.length * 0.04;
    };

    const show = () => {
      setActiveWordIdx(at);
      if (at < 0) {
        O.t = 0;
        return;
      }
      const b = box(at);
      O.t = 1;
      const forward = b.l >= L.t;
      if (lineTop === null || Math.abs(b.top - lineTop) > 2 || O.x < 0.05) {
        L.x = L.t = b.l;
        R.x = b.l;
        Y.x = Y.t = b.top;
      }
      lineTop = b.top;
      tune(forward ? R : L, 520, 40);
      tune(forward ? L : R, 210, 26);
      L.t = b.l;
      R.t = b.r;
      Y.t = b.top;
    };

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      if (autoPlay) {
        wait -= dt;
        if (wait <= 0) {
          if (at === words.length - 1) {
            at = -1;
            lineTop = null;
            wait = 2.0;
          } else {
            at++;
            wait = at === words.length - 1 ? 2.2 : dwell(at);
          }
          show();
        }
      }

      const sub = 4;
      for (let k = 0; k < sub; k++) {
        [L, R, Y, O].forEach((s) => step(s, dt / sub));
      }

      const w = Math.max(0, R.x - L.x);
      pill.style.transform = `translate3d(${L.x.toFixed(2)}px, ${Y.x.toFixed(2)}px, 0)`;
      pill.style.width = `${w.toFixed(2)}px`;
      pill.style.opacity = String(clamp(O.x, 0, 1).toFixed(3));

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [words, autoPlay]);

  return (
    <div className={cn('relative w-full overflow-hidden select-none', className)}>
      <p
        ref={containerRef}
        className="read-along-text relative w-full leading-[1.6] tracking-tight font-play font-bold text-amber-900/60 dark:text-amber-100/60 text-left transition-colors"
      >
        <span
          ref={pillRef}
          aria-hidden="true"
          className="pill absolute left-0 top-0 h-[1.3em] rounded-[0.4em] pointer-events-none will-change-transform z-0"
          style={{
            backgroundColor: activeColor || 'var(--color-primary, #6366f1)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
          }}
        />

        {words.map((w, i) => {
          const isPast = activeWordIdx >= 0 && i < activeWordIdx;
          const isNow = i === activeWordIdx;

          return (
            <React.Fragment key={`${w}-${i}`}>
              <span
                ref={(el) => {
                  if (el) wordsRef.current[i] = el;
                }}
                onClick={() => {
                  setActiveWordIdx(i);
                }}
                className={cn(
                  'w relative z-10 cursor-pointer inline-block transition-colors duration-150 px-[1px]',
                  isNow && 'text-white font-extrabold drop-shadow-xs',
                  isPast && 'text-amber-950 dark:text-amber-100 font-semibold',
                  !isNow && !isPast && 'text-amber-800/60 dark:text-amber-200/50 hover:text-amber-900 dark:hover:text-amber-100'
                )}
              >
                {w}
              </span>
              {i < words.length - 1 && ' '}
            </React.Fragment>
          );
        })}
      </p>
    </div>
  );
};
