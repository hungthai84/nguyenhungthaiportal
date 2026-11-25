import type { Variants } from 'motion/react';

export type OrigamiFoldPhase =
  | 'folded'
  | 'partial'
  | 'unfolding'
  | 'expanded'
  | 'folding';

export const ORIGAMI_EASE_UNFOLD = [0.22, 1, 0.36, 1] as const;
export const ORIGAMI_EASE_FOLD = [0.4, 0, 0.2, 1] as const;
export const ORIGAMI_EASE_SOFT = [0.16, 1, 0.3, 1] as const;

export const ORIGAMI_TIMINGS = {
  doubleClickWindowMs: 230,
  detailExitMs: 170,
  unfoldDesktopMs: 660,
  unfoldMobileMs: 420,
  foldBackDesktopMs: 560,
  foldBackMobileMs: 360,
} as const;

/**
 * State 1: Resting folded 3D origami column variants.
 */
export const foldedVariants: Variants = {
  foldedOdd: {
    rotateY: 8,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.44,
      ease: ORIGAMI_EASE_FOLD,
    },
  },
  foldedEven: {
    rotateY: -8,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.44,
      ease: ORIGAMI_EASE_FOLD,
    },
  },
};

/**
 * State 2: Partially opened origami paper sheet (Single Click).
 */
export const partialUnfoldVariants: Variants = {
  closed: {
    opacity: 0,
    y: 10,
    rotateY: -14,
    transition: {
      duration: 0.2,
      ease: ORIGAMI_EASE_FOLD,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    rotateY: 0,
    transition: {
      duration: 0.42,
      delay: 0.06,
      ease: ORIGAMI_EASE_UNFOLD,
    },
  },
};

/**
 * State 3: Multi-panel sequential 3D Origami Full Unfold (Double Click).
 * Custom parameter passes `{ compact: boolean; reduced: boolean }`.
 */
export interface OrigamiPanelMotionCustom {
  compact: boolean;
  reduced: boolean;
}

export const fullUnfoldVariants = {
  spine: {
    initial: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0.65 }
        : {
            opacity: 0.92,
            rotateY: compact ? -10 : -18,
            scaleX: compact ? 0.86 : 0.72,
            z: 18,
          },
    animate: ({ reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            opacity: 1,
            rotateY: 0,
            scaleX: 1,
            z: 0,
            transition: {
              duration: 0.48,
              ease: ORIGAMI_EASE_UNFOLD,
            },
          },
  } as Variants,

  leftWing: {
    initial: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0 }
        : {
            rotateY: compact ? 74 : 106,
            opacity: 0.88,
          },
    animate: ({ reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            rotateY: 0,
            opacity: 1,
            transition: {
              duration: 0.44,
              delay: 0.06,
              ease: ORIGAMI_EASE_UNFOLD,
            },
          },
  } as Variants,

  rightWing: {
    initial: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0 }
        : {
            rotateY: compact ? -74 : -106,
            opacity: 0.88,
          },
    animate: ({ reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            rotateY: 0,
            opacity: 1,
            transition: {
              duration: 0.44,
              delay: 0.14,
              ease: ORIGAMI_EASE_UNFOLD,
            },
          },
  } as Variants,

  topFlap: {
    initial: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0 }
        : {
            rotateX: compact ? -66 : -92,
            opacity: 0.85,
          },
    animate: ({ reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            rotateX: 0,
            opacity: 1,
            transition: {
              duration: 0.38,
              delay: 0.2,
              ease: ORIGAMI_EASE_UNFOLD,
            },
          },
  } as Variants,

  bottomFlap: {
    initial: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0 }
        : {
            rotateX: compact ? 68 : 96,
            opacity: 0.85,
          },
    animate: ({ reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 1, transition: { duration: 0.16 } }
        : {
            rotateX: 0,
            opacity: 1,
            transition: {
              duration: 0.4,
              delay: 0.26,
              ease: ORIGAMI_EASE_UNFOLD,
            },
          },
  } as Variants,
};

/**
 * State 4: Reverse-sequence 3D Origami Fold-Back (Close / Esc).
 * Folds flaps in exact reverse order: Bottom/Top -> Right Wing -> Left Wing -> Spine tuck.
 */
export const foldingVariants = {
  bottomFlap: {
    initial: { rotateX: 0, opacity: 1 },
    animate: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0, transition: { duration: 0.14 } }
        : {
            rotateX: compact ? 74 : 102,
            opacity: 0.2,
            transition: {
              duration: 0.26,
              delay: 0,
              ease: ORIGAMI_EASE_FOLD,
            },
          },
  } as Variants,

  topFlap: {
    initial: { rotateX: 0, opacity: 1 },
    animate: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0, transition: { duration: 0.14 } }
        : {
            rotateX: compact ? -70 : -96,
            opacity: 0.2,
            transition: {
              duration: 0.26,
              delay: 0.04,
              ease: ORIGAMI_EASE_FOLD,
            },
          },
  } as Variants,

  rightWing: {
    initial: { rotateY: 0, opacity: 1 },
    animate: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0, transition: { duration: 0.14 } }
        : {
            rotateY: compact ? -78 : -112,
            opacity: 0.12,
            transition: {
              duration: 0.3,
              delay: 0.14,
              ease: ORIGAMI_EASE_FOLD,
            },
          },
  } as Variants,

  leftWing: {
    initial: { rotateY: 0, opacity: 1 },
    animate: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0, transition: { duration: 0.14 } }
        : {
            rotateY: compact ? 78 : 112,
            opacity: 0.12,
            transition: {
              duration: 0.3,
              delay: 0.2,
              ease: ORIGAMI_EASE_FOLD,
            },
          },
  } as Variants,

  spine: {
    initial: { opacity: 1, rotateY: 0, scaleX: 1, z: 0 },
    animate: ({ compact, reduced }: OrigamiPanelMotionCustom) =>
      reduced
        ? { opacity: 0, transition: { duration: 0.14 } }
        : {
            opacity: 0,
            rotateY: compact ? -14 : -24,
            scaleX: compact ? 0.65 : 0.36,
            z: 24,
            transition: {
              duration: 0.28,
              delay: 0.28,
              ease: ORIGAMI_EASE_FOLD,
            },
          },
  } as Variants,
};

/**
 * Detail content reveal / fade-out before fold-back.
 */
export const contentRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: ORIGAMI_EASE_UNFOLD,
    },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: {
      duration: 0.16,
      ease: ORIGAMI_EASE_FOLD,
    },
  },
};
