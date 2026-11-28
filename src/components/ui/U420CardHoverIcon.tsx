// Lucian UX/UI Prompt #420 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#420
'use client';

import React from 'react';

export type U420Variant = 'c1' | 'c2' | 'c3' | 'c4';

export const U420_STYLES = `
/* Lucian UX/UI Prompt #420 — Card hover lift & SVG micro-interactions */
.u420-scope {
  --ux-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ux-spring: cubic-bezier(0.34, 1.45, 0.64, 1);
  --ux-line: rgba(22, 21, 27, 0.09);
  --ux-line-2: rgba(255, 255, 255, 0.28);
  --ux-shadow: rgba(40, 30, 80, 0.14);
  --ux-shadow-strong: rgba(15, 23, 42, 0.45);
  --ux-accent: var(--color-primary, #6A57F2);
}

.dark .u420-scope,
[data-theme="dark"] .u420-scope {
  --ux-line: rgba(255, 255, 255, 0.1);
  --ux-line-2: rgba(255, 255, 255, 0.26);
  --ux-shadow: rgba(0, 0, 0, 0.45);
  --ux-shadow-strong: rgba(0, 0, 0, 0.72);
  --ux-accent: #B7A4FF;
}

.u420-t {
  transition:
    transform 0.5s cubic-bezier(0.3, 1.5, 0.5, 1),
    box-shadow 0.35s var(--ux-ease, cubic-bezier(0.2, 0.8, 0.2, 1)),
    border-color 0.35s var(--ux-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) !important;
}

.u420-t:hover,
.u420-t:focus-visible {
  transform: translateY(-4px) !important;
  box-shadow:
    0 0 0 1px var(--ux-line-2, rgba(255, 255, 255, 0.28)),
    0 18px 32px -18px var(--ux-shadow-strong, rgba(15, 23, 42, 0.5)) !important;
}

.u420-t:focus-visible {
  outline: 2px solid var(--ux-accent, #6A57F2);
  outline-offset: 2px;
}

.u420-ic {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: var(--c1);
  color: var(--c2);
  flex-shrink: 0;
}

.u420-ic svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  overflow: visible;
}

.u420-ic svg * {
  transform-box: fill-box;
  transform-origin: center;
}

.u420-c1 {
  --c1: rgba(238, 235, 255, 0.2);
  --c2: #E9D5FF;
}
.u420-c2 {
  --c1: rgba(255, 241, 222, 0.2);
  --c2: #FEF08A;
}
.u420-c3 {
  --c1: rgba(227, 241, 255, 0.2);
  --c2: #A5F3FC;
}
.u420-c4 {
  --c1: rgba(223, 247, 238, 0.2);
  --c2: #A7F3D0;
}

.u420-t .ca,
.u420-t .cb {
  transition: transform 0.6s cubic-bezier(0.3, 1.6, 0.5, 1);
}
.u420-t:hover .ca,
.u420-t:focus-visible .ca {
  transform: translate(3px, 3px);
}
.u420-t:hover .cb,
.u420-t:focus-visible .cb {
  transform: translate(-3px, -3px);
}

.u420-t .sa {
  transition: transform 0.7s cubic-bezier(0.3, 1.6, 0.5, 1);
}
.u420-t:hover .sa,
.u420-t:focus-visible .sa {
  transform: rotate(90deg) scale(1.12);
}
.u420-t .sb {
  opacity: 0.5;
  transition: transform 0.5s cubic-bezier(0.3, 1.8, 0.5, 1), opacity 0.3s;
}
.u420-t:hover .sb,
.u420-t:focus-visible .sb {
  transform: scale(1.6);
  opacity: 1;
}

.u420-t:hover .za,
.u420-t:focus-visible .za {
  animation: u420-zap 0.55s cubic-bezier(0.3, 1.6, 0.5, 1);
}
@keyframes u420-zap {
  0% {
    transform: none;
  }
  30% {
    transform: translateY(-2px) scale(1.15) rotate(-6deg);
  }
  60% {
    transform: translateY(1px) scale(0.96);
  }
  100% {
    transform: none;
  }
}

.u420-t .zs {
  opacity: 0;
  stroke-dasharray: 4;
  stroke-dashoffset: 4;
}
.u420-t:hover .zs,
.u420-t:focus-visible .zs {
  animation: u420-sp 0.6s var(--ux-ease, cubic-bezier(0.2, 0.8, 0.2, 1)) 0.1s both;
}
@keyframes u420-sp {
  0% {
    opacity: 0;
    stroke-dashoffset: 4;
  }
  40% {
    opacity: 1;
    stroke-dashoffset: 0;
  }
  100% {
    opacity: 0;
    stroke-dashoffset: -4;
  }
}

.u420-t:hover .la,
.u420-t:focus-visible .la {
  animation: u420-lock 0.8s cubic-bezier(0.3, 1.6, 0.5, 1);
}
@keyframes u420-lock {
  0% {
    transform: none;
  }
  35% {
    transform: translateY(-3px);
  }
  100% {
    transform: none;
  }
}

.u420-t:hover .lb,
.u420-t:focus-visible .lb {
  animation: u420-key 0.8s var(--ux-ease, cubic-bezier(0.2, 0.8, 0.2, 1));
}
@keyframes u420-key {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: scaleY(0.4);
  }
}

@media (prefers-reduced-motion: reduce) {
  .u420-t,
  .u420-t * {
    animation: none !important;
    transition: none !important;
  }
}
`;

export interface U420CardHoverIconProps {
  variant: U420Variant;
  className?: string;
}

export const U420CardHoverIcon: React.FC<U420CardHoverIconProps> = ({
  variant,
  className = '',
}) => {
  return (
    <span className={`u420-ic u420-${variant} ${className}`} aria-hidden="true">
      {variant === 'c1' && (
        <svg viewBox="0 0 22 22">
          <g className="ca">
            <path d="M3.5 3.5 8 13.5l1.4-4.1 4.1-1.4z" />
          </g>
          <g className="cb">
            <path d="M18.5 18.5 14 8.5l-1.4 4.1-4.1 1.4z" opacity=".55" />
          </g>
        </svg>
      )}
      {variant === 'c2' && (
        <svg viewBox="0 0 22 22">
          <path
            className="sa"
            d="M10 3c.5 4 2.5 6 6.5 6.5-4 .5-6 2.5-6.5 6.5-.5-4-2.5-6-6.5-6.5C7.5 9 9.5 7 10 3z"
          />
          <circle
            className="sb"
            cx="17"
            cy="16.5"
            r="1.3"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )}
      {variant === 'c3' && (
        <svg viewBox="0 0 22 22">
          <path className="za" d="M12.5 2.5 5.5 12h5l-1 7.5L16.5 10h-5z" />
          <path className="zs" d="M18 4.5l1.5-1.5M19 8h2M3 16.5 1.5 18" />
        </svg>
      )}
      {variant === 'c4' && (
        <svg viewBox="0 0 22 22">
          <rect x="4.5" y="9.5" width="13" height="9" rx="2.4" />
          <path className="la" d="M7.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5" />
          <path className="lb" d="M11 13v2" />
        </svg>
      )}
    </span>
  );
};
