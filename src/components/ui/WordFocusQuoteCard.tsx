// Lucian UX/UI Prompt #388 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#388
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface WordFocusQuoteItem {
  q: string;
  n: string;
  r: string;
  c: [string, string];
}

export interface WordFocusQuoteCardProps {
  quotes?: WordFocusQuoteItem[];
  initialIndex?: number;
  compact?: boolean;
  isDark?: boolean;
  className?: string;
}

const DEFAULT_PORTFOLIO_QUOTES: WordFocusQuoteItem[] = [
  {
    q: 'Khách hàng không nhớ những gì bạn nói, họ nhớ cảm giác bạn mang lại trong từng điểm chạm dịch vụ.',
    n: 'Nguyễn Hùng Thái',
    r: '22+ Năm Quản Trị CSKH & CX',
    c: ['#7B61FF', '#EC4899'],
  },
  {
    q: 'Mỗi điểm chạm nhỏ đều là cơ hội vàng để biến khách hàng bình thường thành người đồng hành trọn đời.',
    n: 'Triết lý Dịch vụ',
    r: 'Chuẩn hóa Tổng đài Đa kênh',
    c: ['#10B981', '#06B6D4'],
  },
  {
    q: 'Sự hài lòng của khách hàng không đến từ sự hoàn hảo, mà đến từ sự đồng cảm kịp thời và minh bạch.',
    n: 'Tâm huyết Nghề',
    r: 'Hiệu quả · Nhân văn · Bền vững',
    c: ['#F59E0B', '#EF4444'],
  },
];

const U388_STYLES = `
.u388 {
  --ux-surface: rgba(255, 255, 255, 0.14);
  --ux-surface-2: rgba(255, 255, 255, 0.18);
  --ux-ink: #FFFFFF;
  --ux-ink-3: rgba(255, 255, 255, 0.72);
  --ux-line: rgba(255, 255, 255, 0.22);
  --ux-accent: #FDE047;
  --ux-accent-soft: rgba(253, 224, 71, 0.2);
  --ux-shadow: rgba(15, 23, 42, 0.22);
  position: relative;
  width: 100%;
  border-radius: 18px;
  background: radial-gradient(85% 60% at 15% 15%, var(--ux-accent-soft), transparent 70%), var(--ux-surface);
  box-shadow: 0 0 0 1px var(--ux-line), 0 18px 36px -22px var(--ux-shadow);
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  color: var(--ux-ink);
  overflow: hidden;
  box-sizing: border-box;
}

.u388.u388--surface {
  --ux-surface: var(--bg-subcard, rgba(255, 255, 255, 0.85));
  --ux-surface-2: var(--bg-elevated, rgba(241, 245, 249, 0.9));
  --ux-ink: var(--text-primary, #16151B);
  --ux-ink-3: var(--text-muted, #64748B);
  --ux-line: var(--border-subcard, rgba(22, 21, 27, 0.1));
  --ux-accent: var(--color-primary, #6A57F2);
  --ux-accent-soft: rgba(106, 87, 242, 0.12);
}

.dark .u388.u388--surface,
[data-theme="dark"] .u388.u388--surface {
  --ux-surface: rgba(19, 20, 28, 0.88);
  --ux-surface-2: rgba(30, 41, 59, 0.85);
  --ux-ink: #F4F0E8;
  --ux-ink-3: rgba(244, 240, 232, 0.62);
  --ux-line: rgba(255, 255, 255, 0.12);
  --ux-accent: #B7A4FF;
  --ux-accent-soft: rgba(183, 164, 255, 0.15);
}

.u388-qm {
  font-family: Georgia, serif;
  font-size: 36px;
  line-height: 0.7;
  color: var(--ux-accent);
  opacity: 0.45;
  height: 16px;
  user-select: none;
}

.u388-st {
  position: relative;
  min-height: 52px;
  display: flex;
  align-items: center;
}

.u388-q {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.u388-w {
  display: inline-block;
  margin-right: 0.26em;
  filter: blur(10px);
  opacity: 0;
  transform: translateY(-10px) scale(1.12);
  transition:
    filter 0.65s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.55s cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 0.65s cubic-bezier(0.2, 0.9, 0.25, 1);
  transition-delay: calc(var(--i, 0) * 55ms);
}

.u388-q.in .u388-w {
  filter: none;
  opacity: 1;
  transform: none;
}

.u388-q.out .u388-w {
  filter: blur(12px);
  opacity: 0;
  transform: translate(var(--dx, 10px), 12px) rotate(var(--r, 8deg)) scale(0.88);
  transition-duration: 0.38s;
  transition-delay: calc(var(--i, 0) * 18ms);
}

.u388-by {
  display: flex;
  align-items: center;
  gap: 9px;
  overflow: hidden;
}

.u388-av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--a1, #7B61FF), var(--a2, #EC4899));
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 11px;
  font-weight: 900;
  flex-shrink: 0;
  transition: transform 0.5s cubic-bezier(0.34, 1.45, 0.64, 1);
}

.u388-by.swap .u388-av {
  transform: scale(0.6) rotate(-30deg);
}

.u388-who {
  transition:
    transform 0.45s cubic-bezier(0.2, 0.9, 0.25, 1),
    opacity 0.35s;
  min-width: 0;
}

.u388-by.swap .u388-who {
  transform: translateY(14px);
  opacity: 0;
}

.u388-who b {
  display: block;
  font-size: 11.5px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u388-who small {
  display: block;
  font-size: 10px;
  color: var(--ux-ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.u388-ft {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.u388-dots {
  display: flex;
  gap: 5px;
  flex: 1;
}

.u388-dot {
  flex: 1;
  height: 4px;
  padding: 0;
  border: 0;
  border-radius: 99px;
  background: var(--ux-surface-2);
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.u388-dot i {
  display: block;
  height: 100%;
  width: 100%;
  background: var(--ux-accent);
  transform: scaleX(0);
  transform-origin: left;
}

.u388-dot.done i {
  transform: scaleX(1);
}

.u388-nav {
  display: flex;
  gap: 5px;
}

.u388-nav button {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 0;
  background: var(--ux-surface-2);
  color: var(--ux-ink);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.45, 0.64, 1), background 0.2s;
}

.u388-nav button:hover {
  transform: scale(1.08);
}

.u388-nav svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (prefers-reduced-motion: reduce) {
  .u388-w {
    filter: none !important;
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
`;

export const WordFocusQuoteCard: React.FC<WordFocusQuoteCardProps> = ({
  quotes = DEFAULT_PORTFOLIO_QUOTES,
  initialIndex = 0,
  compact = false,
  className = '',
}) => {
  const safeQuotes = quotes.length > 0 ? quotes : DEFAULT_PORTFOLIO_QUOTES;
  const [index, setIndex] = useState(() => initialIndex % safeQuotes.length);
  const [phase, setPhase] = useState<'idle' | 'in' | 'out'>('idle');
  const [isSwapping, setIsSwapping] = useState(false);

  const dotFillRefs = useRef<Array<HTMLElement | null>>([]);
  const animRef = useRef<Animation | null>(null);
  const swapTimerRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Sync when quotes array changes (e.g. switching milestone in ExperienceView)
  useEffect(() => {
    setIndex(0);
    setPhase('idle');
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('in'));
    });
    return () => cancelAnimationFrame(raf);
  }, [safeQuotes[0]?.q]);

  const startBar = useCallback(
    (activeIdx: number) => {
      if (animRef.current) {
        animRef.current.cancel();
        animRef.current = null;
      }
      const fillEl = dotFillRefs.current[activeIdx];
      const rm =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!fillEl || rm || typeof fillEl.animate !== 'function' || safeQuotes.length <= 1) {
        return;
      }
      const anim = fillEl.animate(
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        { duration: 5200, easing: 'linear', fill: 'forwards' }
      );
      animRef.current = anim;
      anim.onfinish = () => {
        if (isVisibleRef.current) {
          goToIndex(activeIdx + 1);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeQuotes.length]
  );

  const goToIndex = useCallback(
    (nextRaw: number) => {
      const nextIdx = (nextRaw + safeQuotes.length) % safeQuotes.length;
      if (animRef.current) {
        animRef.current.cancel();
        animRef.current = null;
      }
      if (swapTimerRef.current) {
        window.clearTimeout(swapTimerRef.current);
      }

      const rm =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (rm) {
        setIndex(nextIdx);
        setPhase('in');
        return;
      }

      setPhase('out');
      setIsSwapping(true);

      swapTimerRef.current = window.setTimeout(() => {
        setIndex(nextIdx);
        setPhase('idle');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setPhase('in');
            setIsSwapping(false);
          });
        });
      }, 360);
    },
    [safeQuotes.length]
  );

  useEffect(() => {
    if (phase === 'in') {
      startBar(index);
    }
    return () => {
      if (animRef.current) {
        animRef.current.cancel();
      }
    };
  }, [index, phase, startBar]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      isVisibleRef.current = entry.isIntersecting;
      if (animRef.current) {
        if (entry.isIntersecting) {
          animRef.current.play();
        } else {
          animRef.current.pause();
        }
      }
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (swapTimerRef.current) {
        window.clearTimeout(swapTimerRef.current);
      }
      if (animRef.current) {
        animRef.current.cancel();
      }
    };
  }, []);

  const currentQuote = safeQuotes[index] || safeQuotes[0];
  const words = currentQuote.q.split(/\s+/).filter(Boolean);

  return (
    <div
      ref={rootRef}
      onPointerEnter={() => animRef.current?.pause()}
      onPointerLeave={() => animRef.current?.play()}
      className={`ux u388 ${compact ? 'u388--compact' : ''} ${className}`}
    >
      <style>{U388_STYLES}</style>
      <div className="u388-qm" aria-hidden="true">
        “
      </div>

      <div className="u388-st" aria-live="polite">
        <blockquote className={`u388-q ${phase === 'in' ? 'in' : phase === 'out' ? 'out' : ''}`}>
          {words.map((word, i) => {
            const dx = ((i % 5) - 2) * 8;
            const r = ((i % 3) - 1) * 7;
            return (
              <span
                key={`${index}-${i}-${word}`}
                className="u388-w"
                style={{
                  ['--i' as string]: i,
                  ['--dx' as string]: `${dx}px`,
                  ['--r' as string]: `${r}deg`,
                }}
              >
                {word}
              </span>
            );
          })}
        </blockquote>
      </div>

      <div className="u388-ft">
        <div className={`u388-by ${isSwapping ? 'swap' : ''}`}>
          <div
            className="u388-av"
            style={{
              ['--a1' as string]: currentQuote.c[0],
              ['--a2' as string]: currentQuote.c[1],
            }}
            aria-hidden="true"
          >
            {currentQuote.n[0]}
          </div>
          <div className="u388-who">
            <b>{currentQuote.n}</b>
            <small>{currentQuote.r}</small>
          </div>
        </div>

        {safeQuotes.length > 1 && (
          <div className="flex items-center gap-2 shrink-0 min-w-[96px]">
            <div className="u388-dots" role="tablist" aria-label="Quotes">
              {safeQuotes.map((item, k) => (
                <button
                  key={`${item.n}-${k}`}
                  type="button"
                  role="tab"
                  aria-label={`Quote ${k + 1}`}
                  aria-selected={k === index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(k);
                  }}
                  className={`u388-dot ${k < index ? 'done' : ''}`}
                >
                  <i
                    ref={(el) => {
                      dotFillRefs.current[k] = el;
                    }}
                  />
                </button>
              ))}
            </div>
            <div className="u388-nav">
              <button
                type="button"
                className="u388-pv"
                aria-label="Previous quote"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index - 1);
                }}
              >
                <svg viewBox="0 0 14 14">
                  <path d="M9 3 5 7l4 4" />
                </svg>
              </button>
              <button
                type="button"
                className="u388-nx"
                aria-label="Next quote"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index + 1);
                }}
              >
                <svg viewBox="0 0 14 14">
                  <path d="m5 3 4 4-4 4" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
