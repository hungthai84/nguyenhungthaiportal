import { useEffect } from 'react';

const DESKTOP_MIN_WIDTH = 1024;
const FRICTION_RATE = 7.4; // Exponential damping rate per second for silky native-like inertia
const STOP_VELOCITY_PX_PER_MS = 0.032;
const MAX_VELOCITY_PX_PER_MS = 2.6;

interface MomentumSession {
  el: HTMLElement;
  velocity: number; // px / ms
  virtualTop: number;
  lastAppliedTop: number;
  lastTickTime: number;
  lastWheelTime: number;
  rafId: number | null;
}

const isDesktopMomentumEligible = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (window.innerWidth < DESKTOP_MIN_WIDTH) return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return false;
  return true;
};

const hasVerticalScrollableRange = (el: HTMLElement): boolean => {
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  if (overflowY !== 'auto' && overflowY !== 'scroll') return false;
  return el.scrollHeight - el.clientHeight > 4;
};

const isExplicitlyIgnoredTarget = (target: HTMLElement | null): boolean => {
  if (!target) return true;
  if (
    target.closest(
      'select, textarea, input[type="range"], [contenteditable="true"], [data-no-momentum-scroll="true"], [role="slider"]'
    )
  ) {
    return true;
  }
  return false;
};

const resolveVerticalScrollContainer = (startEl: HTMLElement | null): HTMLElement | null => {
  let cursor = startEl;
  while (cursor && cursor !== document.body && cursor !== document.documentElement) {
    // Allow horizontal carousel tracks to keep their dedicated wheel horizontal navigation
    if (
      cursor.matches('.horizontal-scroll-smooth') &&
      cursor.scrollWidth - cursor.clientWidth > 4 &&
      cursor.scrollHeight - cursor.clientHeight <= 4
    ) {
      return null;
    }

    if (hasVerticalScrollableRange(cursor)) {
      return cursor;
    }
    cursor = cursor.parentElement;
  }

  // Fallback to active primary scroll viewport inside #global-content-viewport if cursor didn't match
  const mainViewport = document.querySelector<HTMLElement>(
    '#global-content-viewport .main-card-scroll-viewport, #global-content-viewport [data-main-card="true"], #global-content-viewport .page-main-card'
  );
  if (mainViewport && hasVerticalScrollableRange(mainViewport)) {
    return mainViewport;
  }

  return null;
};

const normalizeWheelDeltaY = (e: WheelEvent, containerHeight: number): number => {
  let dy = e.deltaY;
  if (e.deltaMode === 1) {
    dy *= 32;
  } else if (e.deltaMode === 2) {
    dy *= Math.max(240, containerHeight * 0.85);
  }
  return dy;
};

/**
 * High-performance desktop momentum scroll physics engine.
 * Uses strictly { passive: true } listeners + delta-time exponential damping via requestAnimationFrame
 * so main card viewports glide smoothly with native-like inertia without blocking browser scroll threads.
 */
export function useDesktopMomentumScroll(): void {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    let activeSession: MomentumSession | null = null;

    const stopSession = () => {
      if (!activeSession) return;
      if (activeSession.rafId !== null) {
        window.cancelAnimationFrame(activeSession.rafId);
      }
      delete activeSession.el.dataset.momentumActive;
      activeSession = null;
    };

    const tick = (now: number) => {
      const session = activeSession;
      if (!session) return;

      const { el } = session;
      if (!el.isConnected) {
        stopSession();
        return;
      }

      const dt = Math.min(34, Math.max(4, now - session.lastTickTime));
      session.lastTickTime = now;

      const maxScrollTop = Math.max(0, el.scrollHeight - el.clientHeight);
      if (maxScrollTop <= 1) {
        stopSession();
        return;
      }

      // Detect external user scrollbar drag / programmatic jump so we never fight the user
      if (Math.abs(el.scrollTop - session.lastAppliedTop) > 28 && now - session.lastWheelTime > 48) {
        stopSession();
        return;
      }

      // Re-sync anchor immediately during fresh native wheel tick
      if (now - session.lastWheelTime <= 22) {
        session.virtualTop = el.scrollTop;
      }

      const deltaPx = session.velocity * dt;
      const nextTop = Math.min(maxScrollTop, Math.max(0, session.virtualTop + deltaPx));

      session.virtualTop = nextTop;
      el.scrollTop = nextTop;
      session.lastAppliedTop = el.scrollTop;

      // Exponential friction decay for buttery momentum glide
      session.velocity *= Math.exp(-FRICTION_RATE * (dt / 1000));

      const hitTopBoundary = nextTop <= 0.5 && session.velocity < 0;
      const hitBottomBoundary = nextTop >= maxScrollTop - 0.5 && session.velocity > 0;

      if (
        Math.abs(session.velocity) < STOP_VELOCITY_PX_PER_MS ||
        hitTopBoundary ||
        hitBottomBoundary
      ) {
        stopSession();
        return;
      }

      session.rafId = window.requestAnimationFrame(tick);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isDesktopMomentumEligible()) {
        stopSession();
        return;
      }
      if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || Math.abs(e.deltaY) < 0.5) return;

      const target = e.target as HTMLElement | null;
      if (isExplicitlyIgnoredTarget(target)) return;

      const container = resolveVerticalScrollContainer(target);
      if (!container) return;

      const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
      if (maxScrollTop <= 4) return;

      const dy = normalizeWheelDeltaY(e, container.clientHeight);
      if (
        (container.scrollTop <= 0 && dy < 0) ||
        (container.scrollTop >= maxScrollTop - 1 && dy > 0)
      ) {
        return;
      }

      const now = performance.now();
      const isFineTrackpadStream = Math.abs(dy) < 20;
      const impulseGain = isFineTrackpadStream ? 0.0022 : 0.0054;
      const impulseVelocity = dy * impulseGain;

      if (!activeSession || activeSession.el !== container) {
        stopSession();
        container.dataset.momentumActive = 'true';
        activeSession = {
          el: container,
          velocity: Math.max(
            -MAX_VELOCITY_PX_PER_MS,
            Math.min(MAX_VELOCITY_PX_PER_MS, impulseVelocity)
          ),
          virtualTop: container.scrollTop,
          lastAppliedTop: container.scrollTop,
          lastTickTime: now,
          lastWheelTime: now,
          rafId: null,
        };
      } else {
        const reversedDirection =
          activeSession.velocity !== 0 &&
          Math.sign(activeSession.velocity) !== Math.sign(impulseVelocity);
        const baseVelocity = reversedDirection ? 0 : activeSession.velocity * 0.72;
        activeSession.velocity = Math.max(
          -MAX_VELOCITY_PX_PER_MS,
          Math.min(MAX_VELOCITY_PX_PER_MS, baseVelocity + impulseVelocity)
        );
        activeSession.virtualTop = container.scrollTop;
        activeSession.lastAppliedTop = container.scrollTop;
        activeSession.lastWheelTime = now;
      }

      if (activeSession.rafId === null) {
        activeSession.lastTickTime = now;
        activeSession.rafId = window.requestAnimationFrame(tick);
      }
    };

    const handleUserInterrupt = () => {
      if (activeSession) {
        stopSession();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PageUp' ||
        e.key === 'PageDown' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === ' '
      ) {
        stopSession();
      }
    };

    const handleResize = () => {
      if (!isDesktopMomentumEligible()) {
        stopSession();
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: true });
    document.addEventListener('pointerdown', handleUserInterrupt, { passive: true });
    document.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      stopSession();
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('pointerdown', handleUserInterrupt);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
}
