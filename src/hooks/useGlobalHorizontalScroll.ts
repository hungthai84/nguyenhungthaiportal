import { useEffect } from 'react';

interface WheelAnimState {
  target: number;
  rafId: number | null;
}

const WHEEL_STATES = new WeakMap<HTMLElement, WheelAnimState>();

const HORIZONTAL_CONTAINER_SELECTOR =
  '.horizontal-scroll-smooth, .overflow-x-auto, .overflow-auto';

function findHorizontalScrollContainer(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  let el = target.closest(HORIZONTAL_CONTAINER_SELECTOR) as HTMLElement | null;
  while (el) {
    if (el.getAttribute('data-no-wheel-horizontal') === 'true') {
      el = el.parentElement?.closest(HORIZONTAL_CONTAINER_SELECTOR) as HTMLElement | null;
      continue;
    }
    if (el.scrollWidth > el.clientWidth + 2) {
      return el;
    }
    el = el.parentElement?.closest(HORIZONTAL_CONTAINER_SELECTOR) as HTMLElement | null;
  }
  return null;
}

function stopWheelAnimation(container: HTMLElement) {
  const state = WHEEL_STATES.get(container);
  if (state?.rafId !== null && state?.rafId !== undefined) {
    cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

export function useGlobalHorizontalScroll(): void {
  useEffect(() => {
    let activeDragContainer: HTMLElement | null = null;
    let dragStartX = 0;
    let dragStartScrollLeft = 0;
    let didDragMove = false;
    let suppressNextClick = false;
    let suppressTimer: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      const container = findHorizontalScrollContainer(e.target);
      if (!container) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 2) return;

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const isHorizontalDelta = absX > absY;
      const hasVerticalOverflow = container.scrollHeight > container.clientHeight + 4;

      // Chỉ chuyển cuộn dọc sang ngang cho các dải hàng ngang thuần túy, hoặc khi giữ Shift / cuộn ngang trackpad
      if (hasVerticalOverflow && !e.shiftKey && !isHorizontalDelta) {
        return;
      }

      const rawDelta = isHorizontalDelta ? e.deltaX : e.deltaY;
      if (Math.abs(rawDelta) < 0.5) return;

      const multiplier = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? container.clientWidth : 1;
      const delta = rawDelta * multiplier;

      const atLeftEdge = container.scrollLeft <= 0 && delta < 0;
      const atRightEdge = container.scrollLeft >= maxScrollLeft - 1 && delta > 0;
      if ((atLeftEdge || atRightEdge) && !isHorizontalDelta) {
        return;
      }

      e.preventDefault();

      let state = WHEEL_STATES.get(container);
      if (!state) {
        state = { target: container.scrollLeft, rafId: null };
        WHEEL_STATES.set(container, state);
      }

      if (state.rafId === null) {
        state.target = container.scrollLeft;
      }

      state.target = Math.max(0, Math.min(maxScrollLeft, state.target + delta));

      if (state.rafId === null) {
        const step = () => {
          const currentState = WHEEL_STATES.get(container);
          if (!currentState) return;
          const diff = currentState.target - container.scrollLeft;
          if (Math.abs(diff) <= 0.75) {
            container.scrollLeft = currentState.target;
            container.classList.remove('is-wheel-scrolling');
            currentState.rafId = null;
            return;
          }
          container.classList.add('is-wheel-scrolling');
          container.scrollLeft += diff * 0.26;
          currentState.rafId = requestAnimationFrame(step);
        };
        state.rafId = requestAnimationFrame(step);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;

      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('input, textarea, select, option, [contenteditable="true"]')) return;

      const container = findHorizontalScrollContainer(e.target);
      if (!container) return;

      stopWheelAnimation(container);
      activeDragContainer = container;
      dragStartX = e.clientX;
      dragStartScrollLeft = container.scrollLeft;
      didDragMove = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!activeDragContainer) return;
      const deltaX = e.clientX - dragStartX;
      if (!didDragMove && Math.abs(deltaX) > 6) {
        didDragMove = true;
        activeDragContainer.classList.add('is-dragging');
      }
      if (didDragMove) {
        activeDragContainer.scrollLeft = dragStartScrollLeft - deltaX * 1.15;
      }
    };

    const endMouseDrag = () => {
      if (!activeDragContainer) return;
      activeDragContainer.classList.remove('is-dragging');
      if (didDragMove) {
        suppressNextClick = true;
        if (suppressTimer !== null) window.clearTimeout(suppressTimer);
        suppressTimer = window.setTimeout(() => {
          suppressNextClick = false;
        }, 80);
      }
      activeDragContainer = null;
      didDragMove = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      const container = findHorizontalScrollContainer(e.target);
      if (!container) return;
      stopWheelAnimation(container);
      container.classList.add('is-dragging');
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const container = findHorizontalScrollContainer(e.target);
      if (container) {
        container.classList.remove('is-dragging');
      }
    };

    const handleClickCapture = (e: MouseEvent) => {
      if (suppressNextClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressNextClick = false;
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', endMouseDrag);
    window.addEventListener('pointercancel', endMouseDrag);
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    document.addEventListener('click', handleClickCapture, true);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', endMouseDrag);
      window.removeEventListener('pointercancel', endMouseDrag);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('click', handleClickCapture, true);
      if (suppressTimer !== null) window.clearTimeout(suppressTimer);
    };
  }, []);
}
