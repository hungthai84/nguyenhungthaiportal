'use client';

import React, { useEffect, useRef } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

interface SpringState {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
}

const createSpring = (x: number, k = 400, c = 30): SpringState => ({
  x,
  v: 0,
  t: x,
  k,
  c,
});

const tuneSpring = (s: SpringState, k: number, c: number, reducedMotion: boolean) => {
  s.k = k;
  s.c = reducedMotion ? 2 * Math.sqrt(k) : c;
};

const stepSpring = (s: SpringState, dt: number) => {
  const a = -s.k * (s.x - s.t) - s.c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
};

const isSettled = (s: SpringState) =>
  Math.abs(s.x - s.t) < 0.08 && Math.abs(s.v) < 0.25;

/**
 * Reusable Spring Dropdown elastic highlight controller.
 * Mirrors DesignBookmark Spring Dropdown physics:
 * - Stiff leading edge (k=620, c=36) & soft trailing edge (k=200, c=20) so the highlight pill stretches between rows.
 * - Automatically tags items with --spring-opt-idx for staggered spring entrance.
 */
export function useSpringDropdownHighlight(
  containerRef: React.RefObject<HTMLElement | null>,
  hlRef: React.RefObject<HTMLElement | null>,
  options: {
    itemSelector?: string;
    isOpen?: boolean;
  } = {}
) {
  const {
    itemSelector = '.theme-dropdown-option, [role="option"], .footer-theme-group-row',
    isOpen = true,
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    const hl = hlRef.current;
    if (!container || !hl || !isOpen) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // Assign stagger indices to items for cascading spring entrance
    const tagItems = () => {
      const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
      items.forEach((el, idx) => {
        el.style.setProperty('--spring-opt-idx', String(Math.min(idx, 14)));
      });
    };
    tagItems();

    const HT = createSpring(0, 620, 36);
    const HB = createSpring(0, 620, 36);
    const HL = createSpring(0, 520, 34);
    const HW = createSpring(0, 520, 34);
    const HO = createSpring(0, 420, 32);

    let hasInitialized = false;
    let rafId: number | null = null;
    let lastTime = performance.now();
    let activeEl: HTMLElement | null = null;

    const getRelativeRect = (el: HTMLElement) => {
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      return {
        top: eRect.top - cRect.top + container.scrollTop,
        bottom: eRect.bottom - cRect.top + container.scrollTop,
        left: eRect.left - cRect.left + container.scrollLeft,
        width: eRect.width,
        height: eRect.height,
      };
    };

    const render = () => {
      const opacity = Math.max(0, Math.min(1, HO.x));
      const top = Math.min(HT.x, HB.x - 16);
      const height = Math.max(16, HB.x - top);
      hl.style.opacity = opacity.toFixed(3);
      hl.style.width = `${Math.max(0, HW.x).toFixed(2)}px`;
      hl.style.height = `${height.toFixed(2)}px`;
      hl.style.transform = `translate3d(${HL.x.toFixed(2)}px, ${top.toFixed(2)}px, 0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;

      const subSteps = 4;
      const subDt = dt / subSteps;
      for (let i = 0; i < subSteps; i++) {
        stepSpring(HT, subDt);
        stepSpring(HB, subDt);
        stepSpring(HL, subDt);
        stepSpring(HW, subDt);
        stepSpring(HO, subDt);
      }

      render();

      const done =
        isSettled(HT) &&
        isSettled(HB) &&
        isSettled(HL) &&
        isSettled(HW) &&
        Math.abs(HO.x - HO.t) < 0.01 &&
        Math.abs(HO.v) < 0.05;

      if (!done) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        HT.x = HT.t;
        HB.x = HB.t;
        HL.x = HL.t;
        HW.x = HW.t;
        HO.x = HO.t;
        render();
        rafId = null;
      }
    };

    const ensureAnimating = () => {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const moveToTarget = (el: HTMLElement, snap = false) => {
      const rect = getRelativeRect(el);
      if (rect.height <= 0 || rect.width <= 0) return;

      const prevCenter = (HT.t + HB.t) * 0.5;
      const nextCenter = (rect.top + rect.bottom) * 0.5;

      if (!hasInitialized || snap || reducedMotion) {
        HT.x = HT.t = rect.top;
        HB.x = HB.t = rect.bottom;
        HL.x = HL.t = rect.left;
        HW.x = HW.t = rect.width;
        HT.v = HB.v = HL.v = HW.v = 0;
        hasInitialized = true;
      } else {
        const movingDown = nextCenter > prevCenter;
        // Stiff leading edge + soft trailing edge creates elastic vertical stretch
        tuneSpring(movingDown ? HB : HT, 620, 36, reducedMotion);
        tuneSpring(movingDown ? HT : HB, 200, 20, reducedMotion);
        tuneSpring(HL, 520, 32, reducedMotion);
        tuneSpring(HW, 520, 32, reducedMotion);
        HT.t = rect.top;
        HB.t = rect.bottom;
        HL.t = rect.left;
        HW.t = rect.width;
      }

      activeEl = el;
      HO.t = 1;
      tuneSpring(HO, 420, 32, reducedMotion);
      ensureAnimating();
    };

    const findOptionTarget = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      const matched = target.closest(itemSelector);
      if (!matched || !(matched instanceof HTMLElement) || !container.contains(matched)) {
        return null;
      }
      return matched;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const optionEl = findOptionTarget(e.target);
      if (optionEl && optionEl !== activeEl) {
        moveToTarget(optionEl, !hasInitialized);
      } else if (optionEl && HO.t === 0) {
        HO.t = 1;
        ensureAnimating();
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const optionEl = findOptionTarget(e.target);
      if (optionEl) {
        moveToTarget(optionEl, !hasInitialized);
      }
    };

    const handlePointerLeave = () => {
      activeEl = null;
      HO.t = 0;
      tuneSpring(HO, 380, 32, reducedMotion);
      ensureAnimating();
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, hlRef, itemSelector, isOpen]);
}

export interface SpringDropdownMenuProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  placement?: 'down' | 'up';
  origin?: string;
  itemSelector?: string;
  disableHighlight?: boolean;
  children: React.ReactNode;
}

export const SpringDropdownMenu = React.forwardRef<HTMLDivElement, SpringDropdownMenuProps>(
  (
    {
      placement = 'down',
      origin,
      itemSelector,
      disableHighlight = false,
      className,
      style,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const hlRef = useRef<HTMLSpanElement | null>(null);

    const setRefs = (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    useSpringDropdownHighlight(internalRef, hlRef, {
      itemSelector,
      isOpen: !disableHighlight,
    });

    const isUp = placement === 'up';
    const resolvedOrigin = origin || (isUp ? '50% 100%' : '50% 0%');

    return (
      <motion.div
        ref={setRefs}
        data-spring-dropdown="true"
        data-spring-placement={placement}
        initial={{
          opacity: 0,
          y: isUp ? 12 : -10,
          scaleX: 0.9,
          scaleY: 0.84,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scaleX: 1,
          scaleY: 1,
        }}
        exit={{
          opacity: 0,
          y: isUp ? 8 : -6,
          scaleX: 0.92,
          scaleY: 0.88,
        }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 23,
          mass: 0.85,
        }}
        style={{
          transformOrigin: resolvedOrigin,
          ...style,
        }}
        className={cn('spring-dropdown-menu', className)}
        {...rest}
      >
        {!disableHighlight && (
          <span
            ref={hlRef}
            className="spring-dropdown-hl"
            aria-hidden="true"
          />
        )}
        {children}
      </motion.div>
    );
  }
);

SpringDropdownMenu.displayName = 'SpringDropdownMenu';

export const SpringTick: React.FC<{ active?: boolean; className?: string }> = ({
  active = true,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn(
      'spring-dropdown-tick w-3.5 h-3.5 shrink-0',
      active && 'is-active',
      className
    )}
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
