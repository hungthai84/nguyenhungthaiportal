import { useState, useEffect } from 'react';

export interface PeripheralClearanceState {
  showLeftLamp: boolean;
  showLeftPlant: boolean;
  showRightMascot: boolean;
  leftGutterTop: number;
  leftGutterBottom: number;
  rightGutterBottom: number;
  plantWidthPx: number;
  mascotWidthPx: number;
  lampLeftOffsetPx: number;
}

const DEFAULT_CLEARANCE: PeripheralClearanceState = {
  showLeftLamp: false,
  showLeftPlant: false,
  showRightMascot: false,
  leftGutterTop: 0,
  leftGutterBottom: 0,
  rightGutterBottom: 0,
  plantWidthPx: 0,
  mascotWidthPx: 0,
  lampLeftOffsetPx: 16,
};

const MIN_LAMP_GUTTER_PX = 92;
const MIN_PLANT_GUTTER_PX = 94;
const MIN_MASCOT_GUTTER_PX = 98;
const MIN_VIEWPORT_HEIGHT_PX = 480;
const SAFE_GAP_PX = 10;

export function usePeripheralClearance(enabled = true): PeripheralClearanceState {
  const [state, setState] = useState<PeripheralClearanceState>(DEFAULT_CLEARANCE);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      setState(DEFAULT_CLEARANCE);
      return;
    }

    let rafId: number | null = null;

    const computeClearance = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw < 1280) {
        setState(DEFAULT_CLEARANCE);
        return;
      }

      const headerEl = document.getElementById('app-header');
      const footerEl = document.getElementById('app-footer');

      const headerRect = headerEl ? headerEl.getBoundingClientRect() : null;
      const footerRect = footerEl ? footerEl.getBoundingClientRect() : null;

      // Fallback gutter estimate before header/footer mount cleanly
      const fallbackGutter = Math.max(0, (vw - Math.min(vw, 1250)) / 2);

      const leftGutterTop = headerRect && headerRect.width > 0 ? headerRect.left : fallbackGutter;
      const leftGutterFooter = footerRect && footerRect.width > 0 ? footerRect.left : leftGutterTop;
      const leftGutterBottom = Math.min(leftGutterTop, leftGutterFooter);

      const rightGutterHeader =
        headerRect && headerRect.width > 0 ? Math.max(0, vw - headerRect.right) : fallbackGutter;
      const rightGutterFooter =
        footerRect && footerRect.width > 0 ? Math.max(0, vw - footerRect.right) : rightGutterHeader;
      const rightGutterBottom = Math.min(rightGutterHeader, rightGutterFooter);

      const hasVerticalSpace = vh >= MIN_VIEWPORT_HEIGHT_PX;

      const showLeftLamp = hasVerticalSpace && leftGutterTop >= MIN_LAMP_GUTTER_PX;
      const showLeftPlant = hasVerticalSpace && leftGutterBottom >= MIN_PLANT_GUTTER_PX;
      const showRightMascot = hasVerticalSpace && rightGutterBottom >= MIN_MASCOT_GUTTER_PX;

      // Chậu cây phóng to lên gấp 3 lần (tối đa 396px), vẫn đảm bảo không đè Header/Footer theo chiều ngang
      // và không chạm Đèn kéo dây ở phía trên theo chiều dọc (tỉ lệ ảnh 462/760 ≈ 0.608)
      const maxPlantHeightPx = showLeftLamp ? Math.max(140, vh - 242) : Math.max(180, vh - 32);
      const maxPlantWidthByHeight = Math.floor(maxPlantHeightPx * 0.608);
      const maxPlantWidthByGutter = Math.floor(leftGutterBottom - SAFE_GAP_PX);

      const plantWidthPx = showLeftPlant
        ? Math.max(76, Math.min(396, maxPlantWidthByGutter, maxPlantWidthByHeight))
        : 0;

      const mascotWidthPx = showRightMascot
        ? Math.max(84, Math.min(146, Math.floor(rightGutterBottom - SAFE_GAP_PX)))
        : 0;

      const lampLeftOffsetPx =
        leftGutterTop < 118 ? 2 : leftGutterTop < 160 ? 10 : 20;

      setState((prev) => {
        if (
          prev.showLeftLamp === showLeftLamp &&
          prev.showLeftPlant === showLeftPlant &&
          prev.showRightMascot === showRightMascot &&
          prev.plantWidthPx === plantWidthPx &&
          prev.mascotWidthPx === mascotWidthPx &&
          prev.lampLeftOffsetPx === lampLeftOffsetPx &&
          Math.abs(prev.leftGutterTop - leftGutterTop) < 2 &&
          Math.abs(prev.leftGutterBottom - leftGutterBottom) < 2 &&
          Math.abs(prev.rightGutterBottom - rightGutterBottom) < 2
        ) {
          return prev;
        }
        return {
          showLeftLamp,
          showLeftPlant,
          showRightMascot,
          leftGutterTop,
          leftGutterBottom,
          rightGutterBottom,
          plantWidthPx,
          mascotWidthPx,
          lampLeftOffsetPx,
        };
      });
    };

    const scheduleCompute = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(computeClearance);
    };

    computeClearance();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleCompute) : null;
    if (ro) {
      ro.observe(document.documentElement);
      const headerEl = document.getElementById('app-header');
      const footerEl = document.getElementById('app-footer');
      if (headerEl) ro.observe(headerEl);
      if (footerEl) ro.observe(footerEl);
    }

    const mo =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            if (ro) {
              const headerEl = document.getElementById('app-header');
              const footerEl = document.getElementById('app-footer');
              if (headerEl) ro.observe(headerEl);
              if (footerEl) ro.observe(footerEl);
            }
            scheduleCompute();
          })
        : null;

    if (mo && document.getElementById('website-root')) {
      mo.observe(document.getElementById('website-root') as Element, {
        childList: true,
        subtree: false,
      });
    }

    window.addEventListener('resize', scheduleCompute, { passive: true });
    window.addEventListener('orientationchange', scheduleCompute, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro?.disconnect();
      mo?.disconnect();
      window.removeEventListener('resize', scheduleCompute);
      window.removeEventListener('orientationchange', scheduleCompute);
    };
  }, [enabled]);

  return state;
}
