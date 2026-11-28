'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export type BentoFxModeId = 'spotlight-3d' | 'float-shadow' | 'neon' | 'minimal';

export interface BentoCardProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'article' | 'div' | 'section';
  fxMode?: BentoFxModeId;
  variant?: 'main' | 'info' | 'subcard' | 'metric' | 'action' | 'gradient';
  cardRef?: React.Ref<HTMLElement>;
  disableTilt?: boolean;
  isDarkText?: boolean;
  glowColor?: string;
  hasRipple?: boolean;
}

/**
 * Universal BentoCard Component (Bento Design System):
 * - Mouse tracking spotlight (--mx, --my)
 * - 3D tilt response (Spotlight 3D)
 * - Float shadow, Neon border, and Minimal styles
 * - Subtle click ripple
 * - Scroll reveal (card-reveal is-visible)
 * - Icon micro-interaction on hover
 * - High contrast light-mode styling with layered glass depth
 */
export const BentoCard: React.FC<BentoCardProps> = ({
  as: Tag = 'article',
  className = '',
  fxMode = 'spotlight-3d',
  variant = 'subcard',
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
      const rotateX = (((y - centerY) / centerY) * -3.5).toFixed(2);
      const rotateY = (((x - centerX) / centerX) * 3.5).toFixed(2);
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
      data-fx-mode={fxMode}
      data-dark-text={isDarkText ? 'true' : 'false'}
      style={
        {
          ...style,
          ...(glowColor ? { '--bento-glow': glowColor } : {}),
        } as React.CSSProperties
      }
      className={cn(
        'bento-card bento-studio-card card-reveal relative select-none font-play box-border',
        variant === 'main' && 'bento-card--main rounded-[var(--radius-main,14px)] p-4 sm:p-5',
        variant === 'info' && 'bento-card--info rounded-[var(--radius-card,14px)] p-3.5 sm:p-4',
        variant === 'subcard' && 'bento-card--sub rounded-[var(--radius-subcard,12px)] p-3 sm:p-3.5',
        variant === 'metric' && 'bento-card--metric rounded-[var(--radius-subcard,12px)] p-3 sm:p-4 text-center',
        variant === 'action' && 'bento-card--action rounded-[var(--radius-subcard,12px)] p-3 cursor-pointer',
        variant === 'gradient' && 'bento-card--gradient rounded-[var(--radius-card,14px)] p-4 text-white',
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
