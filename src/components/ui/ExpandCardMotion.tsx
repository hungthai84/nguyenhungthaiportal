'use client';

import type { Transition } from 'motion/react';

/**
 * DesignBookmark Expand Card spring system:
 * - EXPAND_CARD_SPRING: shell expand & collapse morph (k=240, c=21)
 * - CARD_SETTLE_SPRING: sibling shift, scale & card rise (k=300, c=26)
 * - EXPAND_DETAIL_SPRING: staggered `.more` detail reveal after ~160ms (k=260, c=28)
 */
export const EXPAND_CARD_SPRING = {
  type: 'spring' as const,
  stiffness: 240,
  damping: 21,
  mass: 1,
};

export const CARD_SETTLE_SPRING = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 26,
  mass: 1,
};

export const EXPAND_DETAIL_DELAY_S = 0.16;

export const getExpandCardLayoutTransition = (prefersReducedMotion: boolean): Transition =>
  prefersReducedMotion ? { duration: 0 } : EXPAND_CARD_SPRING;

export const getCardSettleTransition = (prefersReducedMotion: boolean): Transition =>
  prefersReducedMotion ? { duration: 0 } : CARD_SETTLE_SPRING;

export const getExpandDetailRevealTransition = (
  prefersReducedMotion: boolean,
  isClosing = false
): Transition => {
  if (prefersReducedMotion) return { duration: 0 };
  if (isClosing) {
    return { duration: 0.14, ease: [0.22, 1, 0.36, 1] };
  }
  return {
    type: 'spring' as const,
    stiffness: 260,
    damping: 28,
    delay: EXPAND_DETAIL_DELAY_S,
  };
};
