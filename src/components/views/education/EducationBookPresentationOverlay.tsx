'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { EducationCourse } from '@/data/education';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { formatCardTitle } from '@/lib/utils';
import {
  EducationBookCoverArt,
  type ArtPattern,
  type BookPalette,
  type BookTemplate,
} from './EducationBookCoverArt';

export interface PresentedBookData {
  course: EducationCourse;
  globalIdx: number;
  template: BookTemplate;
  pattern: ArtPattern;
  palette: BookPalette;
  accentHex: string;
  categoryLabel: string;
  iconName: string;
  sourceRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface EducationBookPresentationOverlayProps {
  presented: PresentedBookData | null;
  getSourceRect: (globalIdx: number) => DOMRect | null;
  isEn: boolean;
  onCloseComplete: () => void;
  onOpenInterior: (course: EducationCourse) => void;
}

const HARDCOVER_ASPECT = 152 / 214; // Exact canonical hardcover cover ratio (~0.7103)

function computeTargetBookBox(
  vw: number,
  vh: number,
  template: BookTemplate,
  sourceRect: { width: number; height: number }
): { width: number; height: number } {
  // Preserve source proportion for front-facing covers; use canonical hardcover aspect when rotating from side-spine
  const aspect =
    template === 'side-spine' || sourceRect.width <= 0 || sourceRect.height <= 0
      ? HARDCOVER_ASPECT
      : Math.max(0.62, Math.min(0.82, sourceRect.width / sourceRect.height));

  let heightRatio = 0.72; // Desktop target: 65–78vh
  let maxWidthRatio = 0.8;

  if (vw < 640) {
    // Mobile target: 55–65vh inside safe area
    heightRatio = 0.6;
    maxWidthRatio = 0.84;
  } else if (vw < 1024) {
    // Tablet target: 60–70vh
    heightRatio = 0.65;
    maxWidthRatio = 0.82;
  }

  let targetH = Math.round(vh * heightRatio);
  let targetW = Math.round(targetH * aspect);

  const maxW = Math.round(vw * maxWidthRatio);
  if (targetW > maxW) {
    targetW = maxW;
    targetH = Math.round(targetW / aspect);
  }

  const maxH = Math.round(vh * (vw < 640 ? 0.65 : vw < 1024 ? 0.7 : 0.78));
  if (targetH > maxH) {
    targetH = maxH;
    targetW = Math.round(targetH * aspect);
  }

  return {
    width: Math.max(180, targetW),
    height: Math.max(250, targetH),
  };
}

function getInitialAngleY(template: BookTemplate): number {
  switch (template) {
    case 'side-spine':
      return -76;
    case 'vjy-layered':
      return -18;
    case 'variant-editorial':
    case 'variant-bauhaus':
    case 'variant-zen':
    default:
      return -10;
  }
}

export const EducationBookPresentationOverlay: React.FC<
  EducationBookPresentationOverlayProps
> = ({ presented, getSourceRect, isEn, onCloseComplete, onOpenInterior }) => {
  const [phase, setPhase] = useState<'idle' | 'pulling' | 'presented' | 'returning'>('idle');
  const [backdropVisible, setBackdropVisible] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [viewport, setViewport] = useState<{ w: number; h: number }>(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  const bookElRef = useRef<HTMLButtonElement | null>(null);
  const activeAnimRef = useRef<Animation | null>(null);
  const lightTimerRef = useRef<number | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const clearTimersAndAnim = useCallback(() => {
    if (lightTimerRef.current !== null) {
      window.clearTimeout(lightTimerRef.current);
      lightTimerRef.current = null;
    }
    if (activeAnimRef.current) {
      try {
        activeAnimRef.current.cancel();
      } catch {
        // ignore cancel errors
      }
      activeAnimRef.current = null;
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const targetBox = presented
    ? computeTargetBookBox(viewport.w, viewport.h, presented.template, presented.sourceRect)
    : { width: 320, height: 450 };

  // Run Stage 1–3 FLIP Pull-Out Choreography when a book is selected
  useLayoutEffect(() => {
    if (!presented) {
      setPhase('idle');
      setBackdropVisible(false);
      setIsLit(false);
      return;
    }

    clearTimersAndAnim();
    const el = bookElRef.current;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setBackdropVisible(true);

    if (!el || prefersReduced) {
      setPhase('presented');
      setIsLit(true);
      return;
    }

    setPhase('pulling');
    setIsLit(false);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const src = presented.sourceRect;
    const box = computeTargetBookBox(vw, vh, presented.template, src);

    const dx = src.left + src.width / 2 - vw / 2;
    const dy = src.top + src.height / 2 - vh / 2;
    const sy = Math.max(0.2, src.height / box.height);
    const sx =
      presented.template === 'side-spine'
        ? Math.max(0.28, sy * 0.72)
        : Math.max(0.2, src.width / box.width);
    const startRotY = getInitialAngleY(presented.template);

    const midScaleX = sx + (1 - sx) * 0.72;
    const midScaleY = sy + (1 - sy) * 0.72;

    const anim = el.animate(
      [
        {
          offset: 0,
          transform: `translate3d(${dx}px, ${dy}px, 0px) scale3d(${sx}, ${sy}, 1) rotateY(${startRotY}deg) rotateX(2deg)`,
        },
        {
          // Stage 1-2 (~350ms): Pull out from shelf forward in Z with gentle lift
          offset: 0.36,
          transform: `translate3d(${dx * 0.86}px, ${dy - 14}px, 95px) scale3d(${sx * 1.1}, ${sy * 1.1}, 1) rotateY(${startRotY * 0.65}deg) rotateX(-2deg)`,
        },
        {
          // Curved trajectory mid-flight toward center
          offset: 0.72,
          transform: `translate3d(${dx * 0.14}px, ${dy * 0.14 - 24}px, 54px) scale3d(${midScaleX}, ${midScaleY}, 1) rotateY(${startRotY * 0.16}deg) rotateX(1deg)`,
        },
        {
          // Stage 3 (~800ms): Front-facing crisp center presentation
          offset: 1,
          transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateY(0deg) rotateX(0deg)',
        },
      ],
      {
        duration: 800,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    activeAnimRef.current = anim;

    // Trigger Stage 4 (250ms front cover lighting sweep) as book settles into center
    lightTimerRef.current = window.setTimeout(() => {
      setIsLit(true);
    }, 560);

    anim.onfinish = () => {
      if (activeAnimRef.current === anim) {
        activeAnimRef.current = null;
        try {
          anim.commitStyles();
          anim.cancel();
        } catch {
          // fallback if commitStyles is unsupported
        }
        el.style.transform =
          'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateY(0deg) rotateX(0deg)';
      }
      setPhase('presented');
      setIsLit(true);
    };

    return () => {
      clearTimersAndAnim();
    };
  }, [presented, clearTimersAndAnim]);

  const onOpenInteriorRef = useRef(onOpenInterior);
  onOpenInteriorRef.current = onOpenInterior;

  // After pulling out from shelf and presenting the front cover + lighting sheen, automatically proceed to flip pages open
  useEffect(() => {
    if (phase !== 'presented' || !presented) return;
    const timer = window.setTimeout(() => {
      if (phaseRef.current !== 'presented') return;
      onOpenInteriorRef.current(presented.course);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [phase, presented]);

  // Reverse FLIP Return to Shelf
  const handleClose = useCallback(() => {
    if (!presented) return;
    if (phaseRef.current === 'pulling' || phaseRef.current === 'returning') return;

    SoundEngine.playBookReturnThud?.();
    const el = bookElRef.current;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!el || prefersReduced) {
      setBackdropVisible(false);
      setIsLit(false);
      setPhase('idle');
      onCloseComplete();
      return;
    }

    clearTimersAndAnim();
    setPhase('returning');
    setIsLit(false);
    setBackdropVisible(false);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const liveRect = getSourceRect(presented.globalIdx);
    const dest = liveRect
      ? {
          top: liveRect.top,
          left: liveRect.left,
          width: liveRect.width,
          height: liveRect.height,
        }
      : presented.sourceRect;

    const box = computeTargetBookBox(vw, vh, presented.template, dest);
    const dx = dest.left + dest.width / 2 - vw / 2;
    const dy = dest.top + dest.height / 2 - vh / 2;
    const sy = Math.max(0.2, dest.height / box.height);
    const sx =
      presented.template === 'side-spine'
        ? Math.max(0.28, sy * 0.72)
        : Math.max(0.2, dest.width / box.width);
    const endRotY = getInitialAngleY(presented.template);

    const midScaleX = 1 - (1 - sx) * 0.32;
    const midScaleY = 1 - (1 - sy) * 0.32;

    const anim = el.animate(
      [
        {
          offset: 0,
          transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateY(0deg) rotateX(0deg)',
        },
        {
          offset: 0.36,
          transform: `translate3d(${dx * 0.24}px, ${dy * 0.24 - 20}px, 50px) scale3d(${midScaleX}, ${midScaleY}, 1) rotateY(${endRotY * 0.24}deg) rotateX(1deg)`,
        },
        {
          offset: 0.74,
          transform: `translate3d(${dx * 0.9}px, ${dy - 10}px, 72px) scale3d(${sx * 1.06}, ${sy * 1.06}, 1) rotateY(${endRotY * 0.75}deg) rotateX(-1deg)`,
        },
        {
          offset: 1,
          transform: `translate3d(${dx}px, ${dy}px, 0px) scale3d(${sx}, ${sy}, 1) rotateY(${endRotY}deg) rotateX(2deg)`,
        },
      ],
      {
        duration: 720,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    activeAnimRef.current = anim;

    anim.onfinish = () => {
      if (activeAnimRef.current === anim) {
        activeAnimRef.current = null;
      }
      setPhase('idle');
      onCloseComplete();
    };
  }, [presented, clearTimersAndAnim, getSourceRect, onCloseComplete]);

  // ESC key handler (capture phase so it cleanly intercepts before inner views)
  useEffect(() => {
    if (!presented) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [presented, handleClose]);

  if (!presented || typeof document === 'undefined') return null;

  const title = formatCardTitle(presented.course.title);

  return createPortal(
    <div
      id="education-book-presentation-overlay"
      className="edu-book-presentation-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${presented.course.issuer} (${presented.course.year})`}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Translucent dark backdrop (35–50%) + light backdrop blur; click outside closes book */}
      <div
        className="edu-book-presentation-backdrop"
        data-visible={backdropVisible ? 'true' : 'false'}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-hidden="true"
      />

      {/* Top-right floating Close (X) button */}
      <button
        type="button"
        className="edu-book-presentation-close"
        data-visible={backdropVisible ? 'true' : 'false'}
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        aria-label={isEn ? 'Return book to shelf (Esc)' : 'Trả sách về kệ (Esc)'}
        title={isEn ? 'Close (Esc)' : 'Đóng sách (Esc)'}
      >
        <WebIcon name="x" className="w-5 h-5" />
      </button>

      {/* Center Stage: Only the 3D book itself (no large enclosing card or extra borders) */}
      <div className="edu-book-presentation-stage">
        <button
          ref={bookElRef}
          type="button"
          className="edu-presented-book-3d"
          data-lit={isLit ? 'true' : 'false'}
          style={{
            width: `${targetBox.width}px`,
            height: `${targetBox.height}px`,
          }}
          aria-label={
            isEn
              ? `Open pages of ${title}`
              : `Mở đọc nội dung bên trong sách ${title}`
          }
          title={
            isEn
              ? 'Click book cover to flip pages inside'
              : 'Nhấp vào bìa sách để mở đọc các trang bên trong'
          }
          onClick={(e) => {
            e.stopPropagation();
            if (phaseRef.current !== 'presented') return;
            SoundEngine.playBookOpen?.();
            onOpenInterior(presented.course);
          }}
        >
          {/* Soft ambient + contact drop shadow behind and beneath book */}
          <span className="edu-presented-book-shadow" aria-hidden="true" />

          {/* Subtle 3D left spine thickness */}
          <span
            className="edu-presented-book-spine"
            style={{ background: presented.palette.spineBg }}
            aria-hidden="true"
          />

          {/* Subtle 3D stacked page edges on right */}
          <span className="edu-presented-book-pages" aria-hidden="true" />

          {/* Crisp front-facing cover preserving exact design, textures, motifs & data */}
          <div className="edu-presented-book-cover-shell">
            <EducationBookCoverArt
              course={presented.course}
              courseColor={presented.accentHex}
              categoryLabel={presented.categoryLabel}
              courseIconName={presented.iconName}
              isEn={isEn}
              variant="book"
              showSpine={true}
              showGlint={isLit}
              imageLoading="eager"
            />
            <span className="edu-presented-book-lighting" aria-hidden="true" />
          </div>
        </button>
      </div>
    </div>,
    document.body
  );
};

export default EducationBookPresentationOverlay;
