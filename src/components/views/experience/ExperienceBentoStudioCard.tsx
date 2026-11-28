// Lucian UX/UI Prompt #214 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#214
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export type ExperienceBentoVariant =
  | 'hero-purple'
  | 'amber-highlight'
  | 'commitment-amber'
  | 'roadmap-violet'
  | 'emerald-trust'
  | 'slate-tasks'
  | 'indigo-docs'
  | 'rose-kpi'
  | 'gallery-pink';

export type U214MotionScene = 'a' | 'b' | 'c' | 'd' | 'e';

export interface ExperienceBentoStudioCardProps extends React.HTMLAttributes<HTMLElement> {
  variant: ExperienceBentoVariant;
  /** Scene type from Lucian UX/UI #214:
   * 'a' = collaboration (avatars gather + live typing)
   * 'b' = search (query typing + staggered growing result bars)
   * 'c' = stats (vertical growing bars chart)
   * 'd' = security (pulsing dual-ring shield)
   * 'e' = integrations (scrolling marquee row of icons)
   */
  u214Scene?: U214MotionScene;
  /** Default rest text for scene 'a' or 'b' live typing bar */
  u214RestText?: string;
  /** Full text typed at 45ms/char when tile is hovered/focused */
  u214TypeText?: string;
  /** Bar heights (0..1) for scene 'c' stats bars */
  u214BarHeights?: number[];
  /** Result bar widths (0..1) for scene 'b' search result bars */
  u214ResultWidths?: number[];
  /** Marquee items for scene 'e' scrolling icon strip */
  u214MarqueeItems?: Array<{ label: string; color: string }>;
  children: React.ReactNode;
}

const VARIANT_TO_DEFAULT_SCENE: Record<ExperienceBentoVariant, U214MotionScene> = {
  'hero-purple': 'a',
  'amber-highlight': 'e',
  'commitment-amber': 'a',
  'roadmap-violet': 'a',
  'emerald-trust': 'd',
  'slate-tasks': 'b',
  'indigo-docs': 'b',
  'rose-kpi': 'c',
  'gallery-pink': 'e',
};

const VARIANT_TO_ACCENT: Record<ExperienceBentoVariant, string> = {
  'hero-purple': '#C4B5FD',
  'amber-highlight': '#FB7185',
  'commitment-amber': '#F59E0B',
  'roadmap-violet': '#A78BFA',
  'emerald-trust': '#6EE7B7',
  'slate-tasks': '#A855F7',
  'indigo-docs': '#7DD3FC',
  'rose-kpi': '#F472B6',
  'gallery-pink': '#F9A8D4',
};

let u214StyleInjected = false;

const U214_SCOPED_CSS = `
/* Lucian UX/UI Prompt #214 · Scoped Living Bento Feature Grid Styles */
.ux-u214-grid {
  --ux-surface: var(--surface-primary-bg, #13141C);
  --ux-surface-2: rgba(0, 0, 0, 0.24);
  --ux-surface-3: rgba(255, 255, 255, 0.12);
  --ux-ink: #F4F0E8;
  --ux-ink-2: rgba(244, 240, 232, 0.82);
  --ux-ink-3: rgba(244, 240, 232, 0.56);
  --ux-line: rgba(255, 255, 255, 0.14);
  --ux-line-2: rgba(255, 255, 255, 0.24);
  --ux-accent: var(--color-primary, #B7A4FF);
  --ux-accent-2: #7DB4FF;
  --ux-mint: #7EE8C0;
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
}

html:not(.dark)[data-theme="light"] .ux-u214-grid {
  --ux-accent: var(--color-primary, #6A57F2);
}

#experience-main-card #experience-bento-grid .u214-t.exp-studio-card {
  --mx: 50%;
  --my: 50%;
  --rx: 0deg;
  --ry: 0deg;
  position: relative;
  overflow: hidden;
  border-radius: 16px !important;
  transform-style: preserve-3d;
  transition: transform .35s cubic-bezier(.3, 1.4, .5, 1), box-shadow .3s ease, border-color .3s ease, opacity .45s ease !important;
  will-change: transform, box-shadow !important;
}

#experience-main-card #experience-bento-grid .u214-t.exp-studio-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 12;
  opacity: 0;
  transition: opacity 0.28s ease;
  background: radial-gradient(
    360px circle at var(--mx) var(--my),
    color-mix(in srgb, var(--u214-tile-accent, var(--ux-accent)) 18%, transparent),
    transparent 70%
  );
}

#experience-main-card #experience-bento-grid .u214-t.exp-studio-card:hover::before {
  opacity: 1;
}

#experience-main-card #experience-bento-grid .u214-t.exp-studio-card:hover,
#experience-main-card #experience-bento-grid .u214-t.exp-studio-card.is-on,
#experience-main-card #experience-bento-grid .u214-t.exp-studio-card:focus-visible {
  transform: perspective(920px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(-3px) !important;
  border-color: color-mix(in srgb, var(--u214-tile-accent, var(--ux-accent)) 68%, rgba(255, 255, 255, 0.45)) !important;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--u214-tile-accent, var(--ux-accent)) 58%, transparent),
              0 16px 30px -14px color-mix(in srgb, var(--u214-tile-accent, var(--ux-accent)) 65%, rgba(0, 0, 0, 0.45)) !important;
  outline: none !important;
}

#experience-main-card #experience-bento-grid .u214-t.exp-studio-card:hover .exp-studio-icon {
  transform: scale(1.12) rotate(-4deg);
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Subtile interactive micro-lift when parent tile is active (.is-on) */
#experience-main-card #experience-bento-grid .u214-t.exp-studio-card .exp-studio-subtile,
#experience-main-card #experience-bento-grid .u214-t.exp-studio-card .exp-studio-subtile--amber {
  transition: transform .38s cubic-bezier(.3, 1.4, .5, 1), border-color .3s ease, background-color .3s ease !important;
}

#experience-main-card #experience-bento-grid .u214-t.exp-studio-card.is-on .exp-studio-subtile:hover,
#experience-main-card #experience-bento-grid .u214-t.exp-studio-card.is-on .exp-studio-subtile--amber:hover {
  transform: translateX(3px) !important;
  border-color: rgba(255, 255, 255, 0.32) !important;
}

/* Scene A: Collaboration gathering avatars (.u214-av) & live typing bar (.u214-ty) */
.u214-av {
  display: inline-flex;
  align-items: center;
  pointer-events: none;
}
.u214-av i {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(15, 23, 42, 0.65);
  margin-left: -6px;
  transition: transform .45s cubic-bezier(.3, 1.5, .5, 1) !important;
  display: inline-block;
}
.u214-av i:first-child {
  margin-left: 0;
}
.u214-av i:nth-child(1) {
  background: #F472B6;
  transform: translateX(14px);
}
.u214-av i:nth-child(2) {
  background: #60A5FA;
  transform: translateX(7px);
}
.u214-av i:nth-child(3) {
  background: #34D399;
}
.u214-t.is-on .u214-av i {
  transform: none !important;
}

/* Company logos gather like .u214-av when tile A is hovered */
.u214-logo-gather > *:nth-child(1) {
  transition: transform .45s cubic-bezier(.3, 1.5, .5, 1) !important;
}
.u214-logo-gather > *:nth-child(2) {
  transition: transform .45s cubic-bezier(.3, 1.5, .5, 1) .04s !important;
}
.u214-logo-gather > *:nth-child(3) {
  transition: transform .45s cubic-bezier(.3, 1.5, .5, 1) .08s !important;
}
.u214-t.is-on .u214-logo-gather > * {
  transform: translateY(-2px) scale(1.04) !important;
}

.u214-ty {
  height: 24px;
  padding: 0 9px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 11px;
  font-weight: 650;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.u214-ty::after {
  content: "";
  display: inline-block;
  width: 1.5px;
  height: 11px;
  margin-left: 2px;
  vertical-align: -2px;
  background: #F472B6;
  animation: u214-blink 1s step-end infinite;
}
@keyframes u214-blink {
  50% { opacity: 0; }
}

/* Scene B: Search bar (.u214-sb) & expanding result bars (.u214-rs) */
.u214-scene-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.u214-sb {
  height: 24px;
  padding: 0 8px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}
.u214-sb svg {
  flex: none;
  width: 11px;
  height: 11px;
  color: rgba(255, 255, 255, 0.65);
}
.u214-rs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 76px;
  flex-shrink: 0;
}
.u214-rs i {
  display: block;
  height: 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.28);
  transform-origin: 0 50%;
  transform: scaleX(.3);
  opacity: .45;
  transition: transform .45s cubic-bezier(.3, 1.3, .5, 1), opacity .3s !important;
}
.u214-rs i:nth-child(2) { transition-delay: .06s !important; }
.u214-rs i:nth-child(3) { transition-delay: .12s !important; }
.u214-rs i:nth-child(4) { transition-delay: .18s !important; }
.u214-t.is-on .u214-rs i {
  transform: scaleX(var(--w, 1)) !important;
  opacity: 1 !important;
}
.u214-rs i:first-child {
  background: color-mix(in srgb, var(--u214-tile-accent, #7DB4FF) 75%, #ffffff);
}

/* Scene C: Stats growing vertical bars (.u214-br) & KPI progress bar spring */
.u214-br {
  height: 28px;
  width: 68px;
  display: flex;
  align-items: flex-end;
  gap: 3.5px;
  flex-shrink: 0;
}
.u214-br i {
  flex: 1;
  height: 100%;
  border-radius: 3px 3px 0 0;
  background: color-mix(in srgb, #34D399 78%, #ffffff);
  transform-origin: 50% 100%;
  transform: scaleY(.28);
  transition: transform .5s cubic-bezier(.3, 1.5, .5, 1) !important;
  transition-delay: calc(var(--i, 0) * 45ms) !important;
}
.u214-t.is-on .u214-br i {
  transform: scaleY(var(--h, 1)) !important;
}
#experience-main-card #experience-bento-grid .u214-t .u214-kpi-bar-fill {
  transform-origin: 0 50%;
  transform: scaleX(0.72);
  transition: transform .55s cubic-bezier(.3, 1.5, .5, 1) !important;
  transition-delay: calc(var(--i, 0) * 55ms) !important;
}
#experience-main-card #experience-bento-grid .u214-t.is-on .u214-kpi-bar-fill {
  transform: scaleX(1) !important;
}

/* Scene D: Security pulsing shield (.u214-sh) */
.u214-sh {
  position: relative;
  width: 28px;
  height: 32px;
  color: #6EE7B7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.u214-sh::before,
.u214-sh::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 28px;
  height: 28px;
  margin: -14px 0 0 -14px;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  opacity: 0;
  pointer-events: none;
}
.u214-t.is-on .u214-sh::before {
  animation: u214-p 1.4s ease-out infinite !important;
}
.u214-t.is-on .u214-sh::after {
  animation: u214-p 1.4s ease-out .7s infinite !important;
}
@keyframes u214-p {
  0% { transform: scale(.6); opacity: .75; }
  100% { transform: scale(1.75); opacity: 0; }
}
.u214-sh svg {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Scene E: Integrations scrolling marquee track (.u214-lg & .u214-lt) */
.u214-lg {
  position: relative;
  width: 136px;
  height: 28px;
  display: flex;
  align-items: center;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);
  overflow: hidden;
  flex-shrink: 0;
}
.u214-lt {
  display: flex;
  gap: 6px;
  animation: u214-m 9s linear infinite !important;
  animation-play-state: paused !important;
}
.u214-t.is-on .u214-lt {
  animation-play-state: running !important;
  animation-duration: 3.6s !important;
}
@keyframes u214-m {
  to { transform: translateX(-50%); }
}
.u214-lt i {
  flex: none;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.22);
  display: grid;
  place-items: center;
  font-style: normal;
  font-size: 10.5px;
  font-weight: 900;
}

/* Light Mode Overrides for U214 Bento Footer Scenes */
html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-scene-bar {
  background: rgba(255, 255, 255, 0.78) !important;
  border-color: rgba(148, 163, 184, 0.28) !important;
  color: #0f172a !important;
}

html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-ty,
html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-sb {
  background: rgba(255, 255, 255, 0.92) !important;
  border-color: rgba(148, 163, 184, 0.32) !important;
  color: #0f172a !important;
}

html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-sb svg {
  color: #475569 !important;
}

html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-rs i {
  background: rgba(15, 23, 42, 0.14) !important;
}

html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-lt i {
  background: #ffffff !important;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(148, 163, 184, 0.3) !important;
}

html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-sh {
  color: #059669 !important;
}

html:not(.dark):not([data-card-style="dark-liquid-glass"]):not([data-card-style="deep-ocean"]):not([data-card-style="dark-flat-soft-ui"]):not([data-card-style="cowhide-leather"]):not([data-card-style="dark-cowhide-leather"]):not([data-card-style="walnut-wood"]):not([data-card-style="dark-iridescent-liquid-glass"]) #experience-main-card #experience-bento-grid .u214-scene-label {
  color: #0f172a !important;
}

@media (prefers-reduced-motion: reduce) {
  #experience-main-card #experience-bento-grid .u214-t.exp-studio-card,
  .u214-av i,
  .u214-rs i,
  .u214-br i,
  .u214-kpi-bar-fill {
    transition: none !important;
  }
  .u214-lt,
  .u214-t.is-on .u214-sh::before,
  .u214-t.is-on .u214-sh::after {
    animation: none !important;
  }
}
`;

export const ExperienceBentoStudioCard: React.FC<ExperienceBentoStudioCardProps> = ({
  variant,
  u214Scene,
  u214RestText,
  u214TypeText,
  u214BarHeights = [0.45, 0.7, 0.55, 0.9, 0.75, 1],
  u214ResultWidths = [0.92, 0.7, 0.82, 0.55],
  u214MarqueeItems,
  className = '',
  children,
  style,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}) => {
  const scene = u214Scene || VARIANT_TO_DEFAULT_SCENE[variant];
  const tileAccent = VARIANT_TO_ACCENT[variant];

  const cardRef = useRef<HTMLElement | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [typedText, setTypedText] = useState(u214RestText || '');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const rm =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    if (rm || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined' && !u214StyleInjected) {
      const existing = document.getElementById('lucian-u214-bento-styles');
      if (!existing) {
        const styleEl = document.createElement('style');
        styleEl.id = 'lucian-u214-bento-styles';
        styleEl.textContent = U214_SCOPED_CSS;
        document.head.appendChild(styleEl);
      }
      u214StyleInjected = true;
    }
  }, []);

  useEffect(() => {
    setTypedText(u214RestText || '');
  }, [u214RestText]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const triggerTypewriter = useCallback((fullText?: string, fallbackText?: string) => {
    if (!fullText) return;
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const rm =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    if (rm) {
      setTypedText(fullText);
      return;
    }
    const chars = Array.from(fullText);
    let k = 0;
    const step = () => {
      k += 1;
      setTypedText(chars.slice(0, k).join(''));
      if (k < chars.length) {
        timerRef.current = window.setTimeout(step, 45);
      }
    };
    step();
    void fallbackText;
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x.toFixed(1)}px`);
    el.style.setProperty('--my', `${y.toFixed(1)}px`);
    const rm =
      typeof window !== 'undefined' &&
      Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    if (!rm && rect.width > 0 && rect.height > 0) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      el.style.setProperty('--rx', `${(((y - cy) / cy) * -2.6).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(((x - cx) / cx) * 2.6).toFixed(2)}deg`);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, a, input, video')) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.3;
    const ripple = document.createElement('span');
    ripple.className = 'bento-card-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    el.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 680);
  };

  const handleEnter = (e: React.PointerEvent<HTMLElement>) => {
    setIsOn(true);
    if ((scene === 'a' || scene === 'b') && u214TypeText) {
      triggerTypewriter(u214TypeText, u214RestText);
    }
    onPointerEnter?.(e);
  };

  const handleLeave = (e: React.PointerEvent<HTMLElement>) => {
    setIsOn(false);
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rx', '0deg');
      cardRef.current.style.setProperty('--ry', '0deg');
    }
    onPointerLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLElement>) => {
    setIsOn(true);
    if ((scene === 'a' || scene === 'b') && u214TypeText) {
      triggerTypewriter(u214TypeText, u214RestText);
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsOn(false);
    onBlur?.(e);
  };

  const defaultLogos: Array<{ label: string; color: string }> =
    u214MarqueeItems && u214MarqueeItems.length > 0
      ? u214MarqueeItems
      : [
          { label: 'CX', color: '#F472B6' },
          { label: 'AI', color: '#60A5FA' },
          { label: 'QA', color: '#34D399' },
          { label: 'BI', color: '#FBBF24' },
          { label: 'SL', color: '#A78BFA' },
          { label: 'OM', color: '#38BDF8' },
        ];
  const loopLogos = [...defaultLogos, ...defaultLogos];

  return (
    <section
      ref={cardRef}
      data-bento-studio-card="true"
      data-studio-variant={variant}
      data-u214-scene={scene}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={
        {
          '--u214-tile-accent': tileAccent,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'u214-t',
        `u214-${scene}`,
        isOn && 'is-on',
        'card-reveal',
        isVisible && 'is-visible',
        'exp-studio-card',
        `exp-studio-card--${variant}`,
        className
      )}
      {...rest}
    >
      {children}

      {/* Scene A Footer Widget: Gathering Avatars + Live Typing Bar */}
      {scene === 'a' && (u214TypeText || u214RestText) && (
        <div className="u214-scene-bar mt-auto" aria-hidden="true">
          <div className="u214-ty flex-1 min-w-0">{typedText || u214RestText}</div>
          <span className="u214-av shrink-0">
            <i />
            <i />
            <i />
          </span>
        </div>
      )}

      {/* Scene B Footer Widget: Live Search Input + Expanding Result Bars */}
      {scene === 'b' && (u214TypeText || u214RestText) && (
        <div className="u214-scene-bar mt-auto" aria-hidden="true">
          <div className="u214-sb">
            <svg viewBox="0 0 12 12">
              <circle cx="5" cy="5" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.6 7.6 10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="truncate">{typedText || u214RestText}</span>
          </div>
          <div className="u214-rs">
            {u214ResultWidths.map((w, idx) => (
              <i key={idx} style={{ '--w': w } as React.CSSProperties} />
            ))}
          </div>
        </div>
      )}

      {/* Scene C Footer Widget: Stats Growing Vertical Bars */}
      {scene === 'c' && (
        <div className="u214-scene-bar mt-auto" aria-hidden="true">
          <span className="u214-scene-label text-[11px] font-bold tracking-wide text-white/85 truncate">
            Biểu đồ tăng trưởng KPI
          </span>
          <div className="u214-br">
            {u214BarHeights.map((h, idx) => (
              <i
                key={idx}
                style={{ '--h': h, '--i': idx } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scene D Footer Widget: Pulsing Security Shield */}
      {scene === 'd' && (
        <div className="u214-scene-bar mt-auto" aria-hidden="true">
          <span className="u214-scene-label text-[11px] font-bold tracking-wide text-emerald-100/90 truncate">
            Bảo chứng cam kết SLA & Bảo mật
          </span>
          <span className="u214-sh">
            <svg viewBox="0 0 30 34">
              <path
                d="M15 2l11 4.5v8.5c0 8-5 13.5-11 16.5C9 28.5 4 23 4 15V6.5z"
                fill="currentColor"
                opacity=".18"
              />
              <path
                d="M15 2l11 4.5v8.5c0 8-5 13.5-11 16.5C9 28.5 4 23 4 15V6.5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M10.5 16.5l3 3 6-6.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      )}

      {/* Scene E Footer Widget: Scrolling Integrations / Services Marquee */}
      {scene === 'e' && (
        <div
          className="u214-scene-bar mt-auto"
          aria-hidden="true"
        >
          <span className="u214-scene-label text-[11px] font-bold tracking-wide text-white/90 truncate">
            {variant === 'amber-highlight' ? 'Hệ sinh thái lĩnh vực' : 'Chuỗi tư liệu kỷ niệm'}
          </span>
          <div className="u214-lg">
            <div className="u214-lt">
              {loopLogos.map((item, idx) => (
                <i key={idx} style={{ color: item.color }}>
                  {item.label}
                </i>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExperienceBentoStudioCard;
