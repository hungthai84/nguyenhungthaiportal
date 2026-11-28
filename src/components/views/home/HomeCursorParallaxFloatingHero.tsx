// Lucian UX/UI Prompt #270 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#270
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface HomeCursorParallaxFloatingHeroProps {
  isEn?: boolean;
  isDark?: boolean;
  children?: React.ReactNode;
}

const U270_STYLES = `
.u270-stage {
  --ux-page: var(--bg-page, #F4F2EE);
  --ux-surface: var(--bg-surface, rgba(255, 255, 255, 0.92));
  --ux-surface-2: var(--bg-elevated, #F5F3EF);
  --ux-surface-3: var(--bg-muted, #EAE7E1);
  --ux-ink: var(--text-primary, #16151B);
  --ux-ink-2: var(--text-secondary, #57535F);
  --ux-ink-3: var(--text-muted, #8E8A97);
  --ux-line: var(--border-subtle, rgba(22, 21, 27, 0.09));
  --ux-line-2: var(--border-strong, rgba(22, 21, 27, 0.17));
  --ux-accent: var(--color-primary, #6A57F2);
  --ux-accent-2: var(--color-secondary, #2F8FE0);
  --ux-accent-soft: rgba(106, 87, 242, 0.12);
  --ux-accent-ink: #FFFFFF;
  --ux-mint: #119C72;
  --ux-warn: #D6731E;
  --ux-danger: #D93A55;
  --ux-glass: rgba(255, 255, 255, 0.72);
  --ux-glass-line: rgba(255, 255, 255, 0.85);
  --ux-shadow: rgba(40, 30, 80, 0.14);
  --ux-shadow-strong: rgba(40, 30, 80, 0.28);
  --ux-grad: linear-gradient(120deg, #7B61FF, #3D8BFF 55%, #1FB89A);
  --ux-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ux-spring: cubic-bezier(0.34, 1.45, 0.64, 1);
  position: relative;
  color: var(--ux-ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -0.01em;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

#home-u270-parallax-stage::before,
#home-u270-parallax-stage::after {
  content: none !important;
  display: none !important;
}

.dark .u270-stage,
[data-theme="dark"] .u270-stage,
.u270-stage[data-theme="dark"] {
  --ux-page: #07080D;
  --ux-surface: rgba(19, 20, 28, 0.92);
  --ux-surface-2: rgba(26, 27, 37, 0.92);
  --ux-surface-3: #252632;
  --ux-ink: #F4F0E8;
  --ux-ink-2: rgba(244, 240, 232, 0.72);
  --ux-ink-3: rgba(244, 240, 232, 0.48);
  --ux-line: rgba(255, 255, 255, 0.12);
  --ux-line-2: rgba(255, 255, 255, 0.2);
  --ux-accent: #B7A4FF;
  --ux-accent-2: #7DB4FF;
  --ux-accent-soft: rgba(183, 164, 255, 0.15);
  --ux-accent-ink: #0B0C12;
  --ux-mint: #7EE8C0;
  --ux-warn: #FFB26B;
  --ux-danger: #FF7D8C;
  --ux-glass: rgba(19, 20, 28, 0.76);
  --ux-glass-line: rgba(255, 255, 255, 0.18);
  --ux-shadow: rgba(0, 0, 0, 0.45);
  --ux-shadow-strong: rgba(0, 0, 0, 0.72);
  --ux-grad: linear-gradient(120deg, #B7A4FF, #7DB4FF 55%, #A5F2D3);
}

.u270-stage,
.u270-stage *,
.u270-stage *::before,
.u270-stage *::after {
  box-sizing: border-box;
}

.u270-l {
  position: absolute;
  z-index: 25;
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1);
  pointer-events: auto;
}

.u270-l > div {
  animation: u270-f var(--t, 5s) ease-in-out infinite alternate;
  animation-delay: var(--dl, 0s);
}

@keyframes u270-f {
  to {
    transform: translateY(-7px);
  }
}

.u270-app {
  right: -12px;
  top: 52%;
  width: 168px;
  border-radius: 15px;
  background: var(--ux-surface);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 0 0 1px var(--ux-line), 0 22px 44px -20px var(--ux-shadow-strong);
  padding: 10px 11px;
  font-size: 10.5px;
}

.u270-app b {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  font-weight: 800;
  color: var(--ux-ink);
}

.u270-tk {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 5px 7px;
  border-radius: 8px;
  background: var(--ux-surface-2);
  font-weight: 700;
  font-size: 10px;
  color: var(--ux-ink-2);
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease, transform 0.15s ease;
}

.u270-tk:hover {
  transform: translateX(2px);
}

.u270-tk i {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  border-radius: 3.5px;
  box-shadow: inset 0 0 0 1.5px var(--ux-ink-3);
  display: inline-block;
  position: relative;
}

.u270-tk.is-ok i {
  background: var(--ux-accent);
  box-shadow: none;
}

.u270-tk.is-ok i::after {
  content: '';
  position: absolute;
  left: 3.5px;
  top: 1.5px;
  width: 3.5px;
  height: 6px;
  border: solid #fff;
  border-width: 0 1.5px 1.5px 0;
  transform: rotate(45deg);
}

.u270-tk.is-ok span {
  text-decoration: line-through;
  color: var(--ux-ink-3);
}

.u270-card {
  border-radius: 14px;
  background: var(--ux-surface);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 0 0 1px var(--ux-line), 0 16px 30px -16px var(--ux-shadow-strong);
  padding: 8px 11px;
  font-size: 10.5px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--ux-ink);
}

.u270-pay {
  left: -10px;
  top: 7%;
}

.u270-pay .u270-card {
  display: flex;
  align-items: center;
  gap: 8px;
}

.u270-pay i {
  width: 22px;
  height: 22px;
  border-radius: 7px;
  background: #10B981;
  display: grid;
  place-items: center;
  color: #fff;
  font-style: normal;
  font-size: 11px;
  font-weight: 900;
  flex-shrink: 0;
}

.u270-pay small {
  display: block;
  font-size: 9px;
  color: var(--ux-ink-3);
}

.u270-pay b {
  display: inline-block;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--ux-ink);
}

.u270-ch {
  right: -8px;
  top: 14%;
}

.u270-ch .u270-card {
  width: 116px;
}

.u270-ch small {
  display: block;
  font-size: 9px;
  color: var(--ux-ink-3);
}

.u270-ch svg {
  display: block;
  width: 88px;
  height: 28px;
  margin-top: 3px;
}

.u270-rt {
  left: 4%;
  bottom: 2%;
}

.u270-rt .u270-card {
  display: flex;
  align-items: center;
  gap: 6px;
}

.u270-rt em {
  font-style: normal;
  color: #F59E0B;
  letter-spacing: 1px;
}

@media (max-width: 639px) {
  .u270-app {
    display: none;
  }
  .u270-card {
    padding: 6px 8px;
    font-size: 9.5px;
  }
  .u270-pay {
    left: -6px;
    top: 2%;
  }
  .u270-ch {
    right: -6px;
    top: 6%;
  }
  .u270-ch .u270-card {
    width: 98px;
  }
  .u270-ch svg {
    width: 74px;
    height: 22px;
  }
  .u270-rt {
    left: 2%;
    bottom: 0%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .u270-l > div {
    animation: none !important;
  }
  .u270-l {
    transition: none !important;
  }
}
`;

export const HomeCursorParallaxFloatingHero: React.FC<HomeCursorParallaxFloatingHeroProps> = ({
  isEn = false,
  isDark = false,
  children,
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const amtRef = useRef<HTMLElement | null>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isVisibleRef = useRef<boolean>(true);

  const metricsList = isEn
    ? ['98.5% CSAT', '99.2% SLA', '-35% AHT', '500+ Agents']
    : ['98.5% CSAT', '99.2% SLA', '-35% AHT', '500+ Nhân sự'];

  const [metricIndex, setMetricIndex] = useState(0);
  const [checkedTasks, setCheckedTasks] = useState<boolean[]>([true, false, false]);

  const tasks = isEn
    ? ['Omnichannel Setup', 'AI & CRM Workflow', 'QA & SLA Audit']
    : ['Chuẩn hóa Đa kênh', 'Tích hợp CRM & AI', 'Đào tạo & QA SLA'];

  const setLayerRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    layerRefs.current[idx] = el;
  }, []);

  const moveLayers = useCallback((nx: number, ny: number) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    layerRefs.current.forEach((l) => {
      if (!l) return;
      const z = Number(l.dataset.z || 1);
      l.style.transform = `translate(${(-nx * 16 * z).toFixed(1)}px, ${(-ny * 12 * z).toFixed(1)}px)`;
    });
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const root = rootRef.current;
      if (!root) return;
      const r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      moveLayers(nx, ny);
    },
    [moveLayers]
  );

  const handlePointerLeave = useCallback(() => {
    moveLayers(0, 0);
  }, [moveLayers]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]) {
        isVisibleRef.current = entries[0].isIntersecting;
      }
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!isVisibleRef.current) return;
      setMetricIndex((prev) => (prev + 1) % metricsList.length);
      const amtEl = amtRef.current;
      const rm =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (amtEl && !rm && typeof amtEl.animate === 'function') {
        amtEl.animate(
          [
            { transform: 'translateY(6px)', opacity: 0 },
            { transform: 'none', opacity: 1 },
          ],
          { duration: 350, easing: 'ease-out' }
        );
      }
    }, 3200);
    return () => window.clearInterval(timer);
  }, [metricsList.length]);

  const toggleTask = (idx: number, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setCheckedTasks((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div
      ref={rootRef}
      id="home-u270-parallax-stage"
      data-theme={isDark ? 'dark' : 'light'}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="ux u270-stage relative flex items-center justify-center w-full h-full bg-transparent border-0 shadow-none"
      style={{
        background: 'transparent',
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
      }}
    >
      <style>{U270_STYLES}</style>

      {/* Center Circular Video Frame & Orbit Lines passed as children */}
      {children}

      {/* Layer 1: Mini CX Task Checklist Card (.u270-app) */}
      <div
        ref={setLayerRef(0)}
        className="u270-l u270-app"
        data-z="0.65"
        style={{ ['--t' as string]: '5s' }}
      >
        <div>
          <b>
            <span>{isEn ? 'CX Focus' : 'Trọng tâm CX'}</span>
            <span style={{ fontSize: '9px', color: 'var(--ux-accent)', fontWeight: 800 }}>
              24/7
            </span>
          </b>
          {tasks.map((taskLabel, idx) => (
            <div
              key={taskLabel}
              role="checkbox"
              aria-checked={checkedTasks[idx]}
              tabIndex={0}
              onClick={(e) => toggleTask(idx, e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleTask(idx, e);
                }
              }}
              className={`u270-tk ${checkedTasks[idx] ? 'is-ok' : ''}`}
            >
              <i aria-hidden="true" />
              <span>{taskLabel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 2: Live KPI / SLA Alert (.u270-pay) */}
      <div
        ref={setLayerRef(1)}
        className="u270-l u270-pay"
        data-z="1.2"
        style={{ ['--t' as string]: '4.2s' }}
      >
        <div className="u270-card" aria-live="polite">
          <i aria-hidden="true">✓</i>
          <div>
            <small>
              {isEn ? 'KPI verified · ' : 'Hiệu suất · '}
              <span className="u270-ago">{isEn ? 'live' : 'trực tiếp'}</span>
            </small>
            <b ref={amtRef} className="u270-amt">
              {metricsList[metricIndex]}
            </b>
          </div>
        </div>
      </div>

      {/* Layer 4: Omnichannel Growth Sparkline Chart (.u270-ch) */}
      <div
        ref={setLayerRef(3)}
        className="u270-l u270-ch"
        data-z="0.9"
        style={{ ['--t' as string]: '5.4s', ['--dl' as string]: '-2s' }}
        aria-hidden="true"
      >
        <div className="u270-card">
          <small>{isEn ? 'CX Efficiency' : 'Tối ưu Vận hành'}</small>
          <svg viewBox="0 0 82 30">
            <path
              d="M1 26 L14 20 L26 23 L39 13 L52 16 L66 7 L81 3"
              fill="none"
              stroke="#6366F1"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Layer 5: 5-Star Rating & Experience Badge (.u270-rt) */}
      <div
        ref={setLayerRef(4)}
        className="u270-l u270-rt"
        data-z="1.4"
        style={{ ['--t' as string]: '4.8s', ['--dl' as string]: '-0.5s' }}
        aria-hidden="true"
      >
        <div className="u270-card">
          <em>★★★★★</em>
          <span>{isEn ? '22+ Yrs · 8 Groups' : '22+ Năm · 8 Tập đoàn'}</span>
        </div>
      </div>
    </div>
  );
};
