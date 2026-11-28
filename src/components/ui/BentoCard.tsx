'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export type BentoFxModeId = 'spotlight-3d' | 'float-shadow' | 'neon' | 'minimal';
export type BentoCardType = 'hero' | 'info' | 'metric' | 'nested' | 'timeline' | 'interactive';
export type BentoCardElevation = 'flat' | 'elevated' | 'floating';
export type BentoCardSurface = 'solid' | 'gradient' | 'glass' | 'transparent' | 'nested';
export type BentoAccentColor =
  | 'cyan'
  | 'orange'
  | 'indigo'
  | 'rose'
  | 'purple'
  | 'emerald'
  | 'blue'
  | 'pink'
  | 'amber'
  | 'teal';

export interface BentoCardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'article' | 'div' | 'section';
  fxMode?: BentoFxModeId;
  variant?: 'main' | 'info' | 'subcard' | 'metric' | 'action' | 'gradient';
  cardType?: BentoCardType;
  elevation?: BentoCardElevation;
  surface?: BentoCardSurface;
  accent?: BentoAccentColor;
  cardRef?: React.Ref<HTMLElement>;
  disableTilt?: boolean;
  isDarkText?: boolean;
  glowColor?: string;
  hasRipple?: boolean;
}

/**
 * Universal BentoCard Component (Global Bento Card Design System):
 * - 6 Card Taxonomy Types: hero, info, metric, nested, timeline, interactive
 * - 3 Elevation Tiers: flat, elevated, floating
 * - 5 Surface Modes: solid, gradient, glass, transparent, nested
 * - 10 Accent Palette Tokens: cyan, orange, indigo, rose, purple, emerald, blue, pink, amber, teal
 * - Canonical 15px Card / 11px Sub-card radii, 16px/12px padding, 14px gap
 * - Mouse tracking spotlight (--mx, --my), subtle tilt, ripple, and IntersectionObserver reveal
 */
export const BentoCard: React.FC<BentoCardProps> = ({
  as: Tag = 'article',
  className = '',
  fxMode = 'spotlight-3d',
  variant = 'subcard',
  cardType,
  elevation,
  surface,
  accent,
  cardRef,
  disableTilt = false,
  isDarkText = true,
  glowColor,
  hasRipple = true,
  onClick,
  style,
  children,
  ...rest
}) => {
  const localRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const resolvedType: BentoCardType =
    cardType ??
    (variant === 'metric'
      ? 'metric'
      : variant === 'action'
        ? 'interactive'
        : variant === 'main'
          ? 'hero'
          : 'info');

  const resolvedElevation: BentoCardElevation =
    elevation ??
    (variant === 'main'
      ? 'floating'
      : variant === 'subcard' || variant === 'metric'
        ? 'flat'
        : 'elevated');

  const resolvedSurface: BentoCardSurface =
    surface ??
    (variant === 'gradient'
      ? 'gradient'
      : variant === 'subcard'
        ? 'nested'
        : 'glass');

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof cardRef === 'function') {
        cardRef(node);
      } else if (cardRef && 'current' in cardRef) {
        (cardRef as React.MutableRefObject<HTMLElement | null>).current = node;
      }
    },
    [cardRef]
  );

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
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
      { threshold: 0.05, rootMargin: '0px 0px -10px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if ((fxMode !== 'spotlight-3d' || disableTilt) && localRef.current) {
      localRef.current.style.setProperty('--rx', '0deg');
      localRef.current.style.setProperty('--ry', '0deg');
    }
  }, [fxMode, disableTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = localRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);

    if (disableTilt) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (fxMode === 'spotlight-3d' && !prefersReducedMotion && rect.width > 0 && rect.height > 0) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (((y - centerY) / centerY) * -2.5).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * 2.5).toFixed(2);
      card.style.setProperty('--rx', `${rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
    }
  };

  const handleMouseLeave = () => {
    const card = localRef.current;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    if (!hasRipple) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, button, a')) return;
    const card = localRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.35;
    const ripple = document.createElement('span');
    ripple.className = 'bento-card-ripple';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    card.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 680);
  };

  const ElementTag = Tag as React.ElementType;

  return (
    <ElementTag
      ref={setRefs}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      data-bento-card="true"
      data-bento-variant={variant}
      data-card-type={resolvedType}
      data-card-elevation={resolvedElevation}
      data-card-surface={resolvedSurface}
      data-bento-accent={accent}
      data-fx-mode={fxMode}
      data-dark-text={isDarkText ? 'true' : 'false'}
      style={
        {
          ...style,
          ...(glowColor ? { '--bento-glow': glowColor } : {}),
        } as React.CSSProperties
      }
      className={cn(
        'bento-card bento-studio-card card-reveal relative font-play box-border min-w-0',
        variant === 'main' && 'bento-card--main rounded-[var(--card-radius,15px)] p-4',
        variant === 'info' && 'bento-card--info rounded-[var(--card-radius,15px)] p-4',
        variant === 'subcard' && 'bento-card--sub rounded-[var(--subcard-radius,11px)] p-3',
        variant === 'metric' && 'bento-card--metric rounded-[var(--subcard-radius,11px)] p-3 text-center',
        variant === 'action' && 'bento-card--action rounded-[var(--subcard-radius,11px)] p-3 cursor-pointer',
        variant === 'gradient' && 'bento-card--gradient rounded-[var(--card-radius,15px)] p-4',
        isVisible && 'is-visible',
        isDarkText ? 'text-[var(--text-primary,#0f172a)]' : 'text-white',
        className
      )}
      {...rest}
    >
      {children}
    </ElementTag>
  );
};

export interface BentoCardHeaderProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  kicker?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const BentoCardHeader: React.FC<BentoCardHeaderProps> = ({
  icon,
  title,
  kicker,
  rightSlot,
  className = '',
  titleClassName = '',
}) => (
  <div className={cn('bento-card-header', className)}>
    <div className="flex items-start gap-2 min-w-0 text-[var(--text-link,var(--color-primary))]">
      {icon ? <span className="shrink-0 mt-0.5">{icon}</span> : null}
      <div className="min-w-0 flex flex-col">
        {kicker ? <span className="bento-card-label">{kicker}</span> : null}
        <h3 className={cn('bento-card-title text-[var(--text-link,var(--color-primary))]', titleClassName)}>
          {title}
        </h3>
      </div>
    </div>
    {rightSlot ? <div className="flex items-center gap-2 shrink-0">{rightSlot}</div> : null}
  </div>
);

export interface BentoSubCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: BentoAccentColor;
  interactive?: boolean;
  elevation?: BentoCardElevation;
}

export const BentoSubCard: React.FC<BentoSubCardProps> = ({
  accent,
  interactive = false,
  elevation = 'flat',
  className = '',
  children,
  ...rest
}) => (
  <div
    data-subcard="true"
    data-card-surface="nested"
    data-card-elevation={elevation}
    data-bento-accent={accent}
    data-interactive={interactive ? 'true' : undefined}
    className={cn(
      'rounded-[var(--subcard-radius,11px)] p-3 border flex flex-col justify-start relative overflow-hidden min-w-0 box-border transition-all',
      interactive && 'cursor-pointer',
      className
    )}
    {...rest}
  >
    {children}
  </div>
);
