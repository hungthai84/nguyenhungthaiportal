import { useEffect, useRef, useState, type RefObject } from 'react';
import { type Variants } from 'motion/react';

export const DECK_EASE = [0.22, 1, 0.36, 1] as const;
export const TACTILE_EASE = [0.4, 0, 0.2, 1] as const;

export const SPRING_DECK = {
  type: 'spring' as const,
  stiffness: 360,
  damping: 22,
  mass: 0.75,
};

export const SPRING_SOFT = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 20,
  mass: 0.85,
};

export interface IconTriggerOptions {
  isActive?: boolean;
  disableAncestorTrigger?: boolean;
  prefersReducedMotion: boolean | null;
}

/**
 * Coordinates interactive icon animation triggers across mouse hover,
 * keyboard focus (:focus-visible / focusin), and mobile touch tap
 * for both direct icon interaction and parent buttons/cards/navigation items.
 */
export function useIconInteractionTrigger(
  svgRef: RefObject<SVGSVGElement | null>,
  { isActive = false, disableAncestorTrigger = false, prefersReducedMotion }: IconTriggerOptions
): 'idle' | 'hover' {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTapBurst, setIsTapBurst] = useState(false);
  const tapTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsHovered(false);
      setIsFocused(false);
      setIsTapBurst(false);
      return;
    }

    const svgEl = svgRef.current;
    if (!svgEl) return;

    let targetEl: Element = svgEl;

    if (!disableAncestorTrigger) {
      const interactiveParent = svgEl.closest(
        'button, a, [role="button"], .nav-pill, [data-icon-trigger="true"]'
      );

      if (interactiveParent) {
        targetEl = interactiveParent;
      } else {
        const headingWrap = svgEl.closest(
          '.card-header-sync, .subcard-header-sync, .card-heading'
        );
        if (headingWrap) {
          targetEl =
            svgEl.closest(
              '[data-section-card="true"], .bento-card, .sub-card, .glass-card, .service-card, .system-card-tile, .project-card'
            ) || headingWrap;
        } else {
          const tileParent = svgEl.closest(
            '.service-card, .system-card-tile, .project-card, [data-icon-card="true"]'
          );
          if (tileParent) {
            targetEl = tileParent;
          }
        }
      }
    }

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const handleFocusIn = () => {
      try {
        if (targetEl.matches(':focus-visible') || document.activeElement === targetEl) {
          setIsFocused(true);
        }
      } catch {
        setIsFocused(true);
      }
    };

    const handleFocusOut = (e: Event) => {
      const fe = e as FocusEvent;
      if (!fe.relatedTarget || !targetEl.contains(fe.relatedTarget as Node)) {
        setIsFocused(false);
      }
    };

    const handlePointerDown = (e: Event) => {
      const pe = e as PointerEvent;
      if (pe.pointerType !== 'mouse') {
        setIsTapBurst(true);
        if (tapTimerRef.current) {
          window.clearTimeout(tapTimerRef.current);
        }
        tapTimerRef.current = window.setTimeout(() => {
          setIsTapBurst(false);
          tapTimerRef.current = null;
        }, 760);
      }
    };

    targetEl.addEventListener('mouseenter', handleMouseEnter);
    targetEl.addEventListener('mouseleave', handleMouseLeave);
    targetEl.addEventListener('focusin', handleFocusIn);
    targetEl.addEventListener('focusout', handleFocusOut);
    targetEl.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      targetEl.removeEventListener('mouseenter', handleMouseEnter);
      targetEl.removeEventListener('mouseleave', handleMouseLeave);
      targetEl.removeEventListener('focusin', handleFocusIn);
      targetEl.removeEventListener('focusout', handleFocusOut);
      targetEl.removeEventListener('pointerdown', handlePointerDown);
      if (tapTimerRef.current) {
        window.clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
    };
  }, [svgRef, disableAncestorTrigger, prefersReducedMotion]);

  if (prefersReducedMotion) return 'idle';
  return isHovered || isFocused || isTapBurst || isActive ? 'hover' : 'idle';
}

/**
 * Semantic SVG animation presets decoupled from icon path geometry.
 * Every preset enforces a calm resting `idle` state and a purposeful `hover` state
 * lasting 0.4s - 1.2s with fluid easing.
 */
export const ICON_VARIANTS = {
  // 1. Bell: pendulum ring + lagged clapper swing (loops softly while hovered)
  bellBody: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -14, 14, -10, 7, -3, 0],
      transition: {
        duration: 0.85,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.45,
      },
    },
  } satisfies Variants,

  bellClapper: {
    idle: { x: 0 },
    hover: {
      x: [0, 1.7, -1.7, 1.2, -0.8, 0],
      transition: {
        duration: 0.85,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.45,
      },
    },
  } satisfies Variants,

  // 2. Heart: rhythmic lub-dub heartbeat (loops gently while hovered)
  heartBeat: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.18, 0.97, 1.14, 1],
      transition: {
        duration: 0.82,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    },
  } satisfies Variants,

  heartHandshakePulse: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.1, 0.98, 1.07, 1],
      transition: {
        duration: 0.78,
        ease: DECK_EASE,
      },
    },
  } satisfies Variants,

  handshakeFold: {
    idle: { pathLength: 1, opacity: 1 },
    hover: {
      pathLength: [0.2, 1],
      opacity: [0.5, 1],
      transition: { duration: 0.6, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 3. Search / Zoom: crisp inspection sweep
  searchScan: {
    idle: { x: 0, y: 0, rotate: 0 },
    hover: {
      x: [0, 1.8, -1.2, 0],
      y: [0, -1.8, 0.9, 0],
      rotate: [0, -8, 4, 0],
      transition: { duration: 0.75, ease: DECK_EASE },
    },
  } satisfies Variants,

  zoomPulse: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.15, 0.96, 1],
      transition: { duration: 0.56, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 4. Download / Upload: directional transfer into/out of steady tray
  downloadArrow: {
    idle: { y: 0, opacity: 1 },
    hover: {
      y: [0, 3.2, -0.5, 0],
      opacity: [1, 0.85, 1, 1],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  downloadTray: {
    idle: { scaleX: 1, y: 0 },
    hover: {
      scaleX: [1, 1.05, 1],
      y: [0, 0.6, 0],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  uploadArrow: {
    idle: { y: 0, opacity: 1 },
    hover: {
      y: [0, -3.2, 0.5, 0],
      opacity: [1, 0.85, 1, 1],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 5. Check / Circle / Path Draw: self-drawing stroke (plays once per interaction)
  pathDraw: {
    idle: { pathLength: 1, opacity: 1 },
    hover: {
      pathLength: [0, 1],
      opacity: [0.35, 1],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,

  pathDrawDelayed: {
    idle: { pathLength: 1, opacity: 1 },
    hover: {
      pathLength: [0, 0, 1],
      opacity: [0.25, 0.25, 1],
      transition: { duration: 0.68, times: [0, 0.22, 1], ease: DECK_EASE },
    },
  } satisfies Variants,

  circleSettle: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 0.94, 1.04, 1],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 6. Directional Arrows & Chevrons
  slideLeft: {
    idle: { x: 0 },
    hover: { x: [0, -3.2, 0], transition: { duration: 0.52, ease: DECK_EASE } },
  } satisfies Variants,

  slideRight: {
    idle: { x: 0 },
    hover: { x: [0, 3.2, 0], transition: { duration: 0.52, ease: DECK_EASE } },
  } satisfies Variants,

  slideUp: {
    idle: { y: 0 },
    hover: { y: [0, -3.2, 0], transition: { duration: 0.52, ease: DECK_EASE } },
  } satisfies Variants,

  slideDown: {
    idle: { y: 0 },
    hover: { y: [0, 3.2, 0], transition: { duration: 0.52, ease: DECK_EASE } },
  } satisfies Variants,

  launchDiagonal: {
    idle: { x: 0, y: 0 },
    hover: {
      x: [0, 2.5, 0],
      y: [0, -2.5, 0],
      transition: { duration: 0.56, ease: DECK_EASE },
    },
  } satisfies Variants,

  splitLeft: {
    idle: { x: 0 },
    hover: { x: [0, -2.2, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  splitRight: {
    idle: { x: 0 },
    hover: { x: [0, 2.2, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  splitUp: {
    idle: { y: 0 },
    hover: { y: [0, -2.1, 0], transition: { duration: 0.52, ease: DECK_EASE } },
  } satisfies Variants,

  splitDown: {
    idle: { y: 0 },
    hover: { y: [0, 2.1, 0], transition: { duration: 0.52, ease: DECK_EASE } },
  } satisfies Variants,

  // 7. Refresh & Settings
  spinCW: {
    idle: { rotate: 0 },
    hover: {
      rotate: 360,
      transition: { duration: 0.72, ease: DECK_EASE },
    },
  } satisfies Variants,

  spinCCW: {
    idle: { rotate: 0 },
    hover: {
      rotate: -360,
      transition: { duration: 0.72, ease: DECK_EASE },
    },
  } satisfies Variants,

  gearRotateLoop: {
    idle: { rotate: 0 },
    hover: {
      rotate: 180,
      transition: {
        duration: 1.15,
        ease: 'linear',
        repeat: Infinity,
      },
    },
  } satisfies Variants,

  // 8. Mail: envelope flap opens & reseals smoothly
  mailFlapOpen: {
    idle: { scaleY: 1, y: 0 },
    hover: {
      scaleY: [1, -0.35, 1],
      y: [0, -1.1, 0],
      transition: { duration: 0.74, ease: DECK_EASE },
    },
  } satisfies Variants,

  mailFrameLift: {
    idle: { y: 0 },
    hover: {
      y: [0, -1, 0],
      transition: { duration: 0.65, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 9. Calendar: binding rings click + date indicator pops
  calendarRing: {
    idle: { y: 0 },
    hover: {
      y: [0, -1.4, 0],
      transition: { duration: 0.48, ease: DECK_EASE },
    },
  } satisfies Variants,

  calendarDatePop: {
    idle: { scale: 1, opacity: 1 },
    hover: {
      scale: [1, 0.7, 1.32, 1],
      opacity: [1, 0.45, 1],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 10. Activity / Waveform: fluid ECG path draw
  waveformDraw: {
    idle: { pathLength: 1, opacity: 1 },
    hover: {
      pathLength: [0, 1],
      opacity: [0.35, 1],
      transition: { duration: 0.85, ease: TACTILE_EASE },
    },
  } satisfies Variants,

  // 11. Rocket: thrust hover + subtle flickering exhaust trail while hovered
  rocketFloat: {
    idle: { x: 0, y: 0 },
    hover: {
      x: [0, 1.8, 1.1, 2.0, 1.1],
      y: [0, -1.8, -1.1, -2.0, -1.1],
      transition: {
        duration: 0.9,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror',
      },
    },
  } satisfies Variants,

  rocketTrail: {
    idle: { pathLength: 1, opacity: 1 },
    hover: {
      pathLength: [0.5, 1, 0.65, 1],
      opacity: [0.45, 1, 0.6, 1],
      transition: {
        duration: 0.56,
        ease: 'easeInOut',
        repeat: Infinity,
      },
    },
  } satisfies Variants,

  // 12. Star & Sparkles
  starTwinkle: {
    idle: { rotate: 0, scale: 1 },
    hover: {
      rotate: [0, 18, -7, 0],
      scale: [1, 1.12, 1],
      transition: { duration: 0.78, ease: DECK_EASE },
    },
  } satisfies Variants,

  sparkleMain: {
    idle: { scale: 1, rotate: 0 },
    hover: {
      scale: [1, 1.12, 0.96, 1.08, 1],
      rotate: [0, 10, -5, 0],
      transition: {
        duration: 0.95,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.35,
      },
    },
  } satisfies Variants,

  sparkleMinor: {
    idle: { scale: 1, opacity: 1 },
    hover: {
      scale: [1, 0.45, 1.25, 1],
      opacity: [1, 0.3, 1],
      transition: {
        duration: 0.82,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 0.42,
      },
    },
  } satisfies Variants,

  // 13. Sun & Moon
  sunRays: {
    idle: { rotate: 0, scale: 1 },
    hover: {
      rotate: 45,
      scale: [1, 1.06, 1],
      transition: { duration: 0.68, ease: DECK_EASE },
    },
  } satisfies Variants,

  moonTilt: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -14, 5, 0],
      transition: { duration: 0.75, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 14. Audio / Media
  soundWaveInner: {
    idle: { scale: 1, opacity: 1 },
    hover: {
      scale: [0.88, 1.08, 0.95, 1],
      opacity: [0.45, 1, 0.65, 1],
      transition: { duration: 0.75, ease: 'easeInOut', repeat: Infinity },
    },
  } satisfies Variants,

  soundWaveOuter: {
    idle: { scale: 1, opacity: 1 },
    hover: {
      scale: [0.85, 1.12, 0.92, 1],
      opacity: [0.25, 1, 0.45, 1],
      transition: { duration: 0.75, delay: 0.14, ease: 'easeInOut', repeat: Infinity },
    },
  } satisfies Variants,

  pauseBarA: {
    idle: { scaleY: 1 },
    hover: { scaleY: [1, 0.72, 1], transition: { duration: 0.56, ease: DECK_EASE } },
  } satisfies Variants,

  pauseBarB: {
    idle: { scaleY: 1 },
    hover: {
      scaleY: [1, 0.72, 1],
      transition: { duration: 0.56, delay: 0.1, ease: DECK_EASE },
    },
  } satisfies Variants,

  micPulse: {
    idle: { scaleY: 1, y: 0 },
    hover: {
      scaleY: [1, 1.08, 0.96, 1],
      y: [0, -1.1, 0],
      transition: { duration: 0.68, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 15. Navigation / Geography / Time
  compassSeek: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, 48, -16, 6, 0],
      transition: { duration: 0.85, ease: DECK_EASE },
    },
  } satisfies Variants,

  clockMinuteSweep: {
    idle: { rotate: 0 },
    hover: {
      rotate: 180,
      transition: { duration: 0.85, ease: DECK_EASE },
    },
  } satisfies Variants,

  clockHourSweep: {
    idle: { rotate: 0 },
    hover: {
      rotate: 45,
      transition: { duration: 0.85, ease: DECK_EASE },
    },
  } satisfies Variants,

  mapPinDrop: {
    idle: { y: 0 },
    hover: {
      y: [0, -3.2, 0.5, 0],
      transition: { duration: 0.6, ease: DECK_EASE },
    },
  } satisfies Variants,

  globeMeridian: {
    idle: { scaleX: 1 },
    hover: {
      scaleX: [1, 0.62, 1],
      transition: { duration: 0.82, ease: 'easeInOut' },
    },
  } satisfies Variants,

  // 16. People & Workspace
  userHeadNod: {
    idle: { y: 0 },
    hover: {
      y: [0, -1.4, 0],
      transition: { duration: 0.54, ease: DECK_EASE },
    },
  } satisfies Variants,

  userSecondarySlide: {
    idle: { x: 0, opacity: 1 },
    hover: {
      x: [0, 1.6, 0],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.58, ease: DECK_EASE },
    },
  } satisfies Variants,

  briefcaseHandle: {
    idle: { y: 0 },
    hover: {
      y: [0, -1.6, 0],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,

  gradCapTilt: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -8, 6, 0],
      transition: { duration: 0.66, ease: DECK_EASE },
    },
  } satisfies Variants,

  gradTassel: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, 14, -8, 0],
      transition: { duration: 0.7, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 17. Tech, Server, AI & Automation
  botAntenna: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -14, 14, -7, 0],
      transition: { duration: 0.68, ease: DECK_EASE },
    },
  } satisfies Variants,

  botEyeBlink: {
    idle: { scaleY: 1 },
    hover: {
      scaleY: [1, 0.18, 1],
      transition: { duration: 0.45, delay: 0.1, ease: 'easeInOut' },
    },
  } satisfies Variants,

  serverLedA: {
    idle: { opacity: 1 },
    hover: {
      opacity: [1, 0.2, 1],
      transition: { duration: 0.55, repeat: Infinity, repeatDelay: 0.15 },
    },
  } satisfies Variants,

  serverLedB: {
    idle: { opacity: 1 },
    hover: {
      opacity: [0.3, 1, 0.3],
      transition: { duration: 0.55, repeat: Infinity, repeatDelay: 0.15 },
    },
  } satisfies Variants,

  dbTier1: {
    idle: { y: 0 },
    hover: { y: [0, -1.1, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  dbTier2: {
    idle: { y: 0 },
    hover: { y: [0, -0.6, 0], transition: { duration: 0.55, delay: 0.07, ease: DECK_EASE } },
  } satisfies Variants,

  cpuCore: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.14, 0.96, 1],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 18. Documents, Files, Charts & Layers
  docLine1: {
    idle: { pathLength: 1 },
    hover: { pathLength: [0, 1], transition: { duration: 0.42, ease: DECK_EASE } },
  } satisfies Variants,

  docLine2: {
    idle: { pathLength: 1 },
    hover: { pathLength: [0, 1], transition: { duration: 0.42, delay: 0.08, ease: DECK_EASE } },
  } satisfies Variants,

  docLine3: {
    idle: { pathLength: 1 },
    hover: { pathLength: [0, 1], transition: { duration: 0.42, delay: 0.16, ease: DECK_EASE } },
  } satisfies Variants,

  layersTop: {
    idle: { y: 0 },
    hover: { y: [0, -2, 0], transition: { duration: 0.58, ease: DECK_EASE } },
  } satisfies Variants,

  layersMid: {
    idle: { y: 0 },
    hover: { y: [0, -0.9, 0], transition: { duration: 0.58, delay: 0.05, ease: DECK_EASE } },
  } satisfies Variants,

  bar1Grow: {
    idle: { scaleY: 1 },
    hover: { scaleY: [1, 0.55, 1.12, 1], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  bar2Grow: {
    idle: { scaleY: 1 },
    hover: { scaleY: [1, 0.55, 1.12, 1], transition: { duration: 0.55, delay: 0.09, ease: DECK_EASE } },
  } satisfies Variants,

  bar3Grow: {
    idle: { scaleY: 1 },
    hover: { scaleY: [1, 0.55, 1.12, 1], transition: { duration: 0.55, delay: 0.18, ease: DECK_EASE } },
  } satisfies Variants,

  copyFront: {
    idle: { x: 0, y: 0 },
    hover: {
      x: [0, 1.6, 0],
      y: [0, 1.6, 0],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,

  // 19. Tools, Actions & Status
  sliderLeft: {
    idle: { x: 0 },
    hover: { x: [0, -2.2, 0], transition: { duration: 0.58, ease: DECK_EASE } },
  } satisfies Variants,

  sliderRight: {
    idle: { x: 0 },
    hover: { x: [0, 2.4, 0], transition: { duration: 0.58, delay: 0.06, ease: DECK_EASE } },
  } satisfies Variants,

  lockShackleLift: {
    idle: { y: 0 },
    hover: { y: [0, -1.9, 0], transition: { duration: 0.58, ease: DECK_EASE } },
  } satisfies Variants,

  trashLidLift: {
    idle: { rotate: 0, y: 0 },
    hover: {
      rotate: [0, -16, 0],
      y: [0, -1.2, 0],
      transition: { duration: 0.58, ease: DECK_EASE },
    },
  } satisfies Variants,

  giftLidLift: {
    idle: { y: 0, rotate: 0 },
    hover: {
      y: [0, -2.1, 0],
      rotate: [0, -4, 4, 0],
      transition: { duration: 0.64, ease: DECK_EASE },
    },
  } satisfies Variants,

  eyeBlink: {
    idle: { scaleY: 1 },
    hover: {
      scaleY: [1, 0.12, 1],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
  } satisfies Variants,

  cameraShutter: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 0.72, 1.08, 1],
      transition: { duration: 0.56, ease: DECK_EASE },
    },
  } satisfies Variants,

  paletteTilt: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -9, 5, 0],
      transition: { duration: 0.66, ease: DECK_EASE },
    },
  } satisfies Variants,

  paletteDot: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.5, 1],
      transition: { duration: 0.5, ease: DECK_EASE },
    },
  } satisfies Variants,

  zapFlash: {
    idle: { scale: 1, opacity: 1 },
    hover: {
      scale: [1, 1.14, 0.96, 1.08, 1],
      opacity: [1, 0.72, 1],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,

  flameFlicker: {
    idle: { scaleY: 1, rotate: 0 },
    hover: {
      scaleY: [1, 1.08, 0.95, 1.06, 1],
      rotate: [0, -4, 4, -2, 0],
      transition: { duration: 0.85, ease: 'easeInOut', repeat: Infinity },
    },
  } satisfies Variants,

  targetBullseye: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.38, 0.9, 1],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  phoneVibrate: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -10, 10, -8, 6, 0],
      transition: { duration: 0.62, ease: 'easeInOut' },
    },
  } satisfies Variants,

  sendFly: {
    idle: { x: 0, y: 0 },
    hover: {
      x: [0, 2.6, 0],
      y: [0, -2.6, 0],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  editWrite: {
    idle: { x: 0, y: 0, rotate: 0 },
    hover: {
      x: [0, 1.6, -0.8, 0],
      y: [0, -1.2, 0.4, 0],
      rotate: [0, -6, 3, 0],
      transition: { duration: 0.66, ease: DECK_EASE },
    },
  } satisfies Variants,

  trophyLift: {
    idle: { y: 0, rotate: 0 },
    hover: {
      y: [0, -1.8, 0],
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.65, ease: DECK_EASE },
    },
  } satisfies Variants,

  expandNE: {
    idle: { x: 0, y: 0 },
    hover: { x: [0, 1.8, 0], y: [0, -1.8, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  expandSW: {
    idle: { x: 0, y: 0 },
    hover: { x: [0, -1.8, 0], y: [0, 1.8, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  contractNE: {
    idle: { x: 0, y: 0 },
    hover: { x: [0, -1.6, 0], y: [0, 1.6, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  contractSW: {
    idle: { x: 0, y: 0 },
    hover: { x: [0, 1.6, 0], y: [0, -1.6, 0], transition: { duration: 0.55, ease: DECK_EASE } },
  } satisfies Variants,

  qrModulePulse: {
    idle: { scale: 1, opacity: 1 },
    hover: {
      scale: [1, 0.85, 1.08, 1],
      opacity: [1, 0.65, 1],
      transition: { duration: 0.62, ease: DECK_EASE },
    },
  } satisfies Variants,

  shareNodeRadiate: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.25, 1],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,

  wrenchTurn: {
    idle: { rotate: 0 },
    hover: {
      rotate: [0, -22, 12, 0],
      transition: { duration: 0.68, ease: DECK_EASE },
    },
  } satisfies Variants,

  shieldPulse: {
    idle: { scale: 1 },
    hover: {
      scale: [1, 1.06, 1],
      transition: { duration: 0.55, ease: DECK_EASE },
    },
  } satisfies Variants,
} as const;
