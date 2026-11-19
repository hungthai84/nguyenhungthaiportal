import { FontScaleMode } from './ui/theme.types';
import { getFontScaleMultiplier, normalizeFontScale } from './ui/layerDepth';

export interface TypographyTokenSpec {
  token: string;
  cssVar: string;
  className: string;
  desktop: string;
  tablet: string;
  mobile: string;
  fluidClamp: string;
  lineHeight: string;
  letterSpacing?: string;
  fontWeight: number;
  textWrap?: 'balance' | 'pretty' | 'normal';
}

/**
 * Hệ thống Typography chuẩn thống nhất toàn website (Better-Typography Craft System)
 * Tối ưu hóa tính dễ đọc (readability), tỷ lệ ký tự trên dòng (character-per-line measure 45-75ch),
 * chiều cao dòng đồng bộ (consistent line-heights) và kích thước co giãn mượt mà theo viewport (fluid typography).
 */
export const TYPOGRAPHY_SCALE: Record<string, TypographyTokenSpec> = {
  h1: {
    token: 'H1 – Tiêu đề trang',
    cssVar: '--fs-h1',
    className: 'typo-h1',
    desktop: '28px',
    tablet: '26px',
    mobile: '23px',
    fluidClamp: 'clamp(23px, 1.6vw + 17px, 28px)',
    lineHeight: '1.25',
    letterSpacing: '-0.022em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h2: {
    token: 'H2 – Tiêu đề khu vực',
    cssVar: '--fs-h2',
    className: 'typo-h2',
    desktop: '23px',
    tablet: '21px',
    mobile: '19px',
    fluidClamp: 'clamp(19px, 1.1vw + 15px, 23px)',
    lineHeight: '1.28',
    letterSpacing: '-0.016em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h3: {
    token: 'H3 – Tiêu đề Card',
    cssVar: '--fs-h3',
    className: 'typo-h3',
    desktop: '19px',
    tablet: '18px',
    mobile: '17px',
    fluidClamp: 'clamp(17px, 0.7vw + 14px, 19px)',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  h4: {
    token: 'H4 – Tiêu đề Sub Card',
    cssVar: '--fs-h4',
    className: 'typo-h4',
    desktop: '17px',
    tablet: '16px',
    mobile: '15px',
    fluidClamp: 'clamp(15px, 0.5vw + 13.5px, 17px)',
    lineHeight: '1.32',
    letterSpacing: '-0.005em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  h5: {
    token: 'H5 – Tiêu đề nhỏ',
    cssVar: '--fs-h5',
    className: 'typo-h5',
    desktop: '16px',
    tablet: '15px',
    mobile: '14px',
    fluidClamp: 'clamp(14px, 0.4vw + 13px, 16px)',
    lineHeight: '1.35',
    letterSpacing: '-0.005em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  bodyLarge: {
    token: 'Body Large',
    cssVar: '--fs-body-lg',
    className: 'typo-body-lg',
    desktop: '16px',
    tablet: '15.5px',
    mobile: '15px',
    fluidClamp: 'clamp(15px, 0.3vw + 14px, 16px)',
    lineHeight: '1.6',
    letterSpacing: '0.005em',
    fontWeight: 400,
    textWrap: 'pretty',
  },
  body: {
    token: 'Body Regular',
    cssVar: '--fs-body',
    className: 'typo-body',
    desktop: '15px',
    tablet: '14.5px',
    mobile: '14px',
    fluidClamp: 'clamp(14px, 0.25vw + 13.5px, 15px)',
    lineHeight: '1.6',
    letterSpacing: '0.005em',
    fontWeight: 400,
    textWrap: 'pretty',
  },
  bodySmall: {
    token: 'Body Small',
    cssVar: '--fs-body-sm',
    className: 'typo-body-sm',
    desktop: '14px',
    tablet: '13.5px',
    mobile: '13px',
    fluidClamp: 'clamp(13px, 0.2vw + 12.5px, 14px)',
    lineHeight: '1.55',
    letterSpacing: '0.005em',
    fontWeight: 400,
    textWrap: 'pretty',
  },
  caption: {
    token: 'Caption / Metadata',
    cssVar: '--fs-caption',
    className: 'typo-caption',
    desktop: '13px',
    tablet: '12.5px',
    mobile: '12px',
    fluidClamp: 'clamp(12px, 0.15vw + 11.5px, 13px)',
    lineHeight: '1.4',
    letterSpacing: '0.01em',
    fontWeight: 400,
  },
  label: {
    token: 'Label / Tag',
    cssVar: '--fs-label',
    className: 'typo-label',
    desktop: '12px',
    tablet: '12px',
    mobile: '11.5px',
    fluidClamp: 'clamp(11.5px, 0.15vw + 11px, 12px)',
    lineHeight: '1.38',
    letterSpacing: '0.025em',
    fontWeight: 600,
  },
  badge: {
    token: 'Badge',
    cssVar: '--fs-badge',
    className: 'typo-badge',
    desktop: '12px',
    tablet: '12px',
    mobile: '11.5px',
    fluidClamp: 'clamp(11.5px, 0.15vw + 11px, 12px)',
    lineHeight: '1.38',
    letterSpacing: '0.025em',
    fontWeight: 600,
  },
  button: {
    token: 'Button',
    cssVar: '--fs-button',
    className: 'typo-button',
    desktop: '14px',
    tablet: '13.5px',
    mobile: '13px',
    fluidClamp: 'clamp(13px, 0.2vw + 12.5px, 14px)',
    lineHeight: '1.35',
    letterSpacing: '0.01em',
    fontWeight: 700,
  },
  nav: {
    token: 'Navigation',
    cssVar: '--fs-nav',
    className: 'typo-nav',
    desktop: '14px',
    tablet: '14px',
    mobile: '13.5px',
    fluidClamp: 'clamp(13.5px, 0.15vw + 13px, 14px)',
    lineHeight: '1.35',
    letterSpacing: '0.01em',
    fontWeight: 600,
  },
  tab: {
    token: 'Tab',
    cssVar: '--fs-tab',
    className: 'typo-tab',
    desktop: '14px',
    tablet: '14px',
    mobile: '13.5px',
    fluidClamp: 'clamp(13.5px, 0.15vw + 13px, 14px)',
    lineHeight: '1.35',
    letterSpacing: '0.01em',
    fontWeight: 600,
  },
  input: {
    token: 'Input',
    cssVar: '--fs-input',
    className: 'typo-input',
    desktop: '15px',
    tablet: '15px',
    // Mobile minimum 16px to prevent iOS Safari automatic zoom-in on focus
    mobile: '16px',
    fluidClamp: 'clamp(15px, 16px - 0.1vw, 16px)',
    lineHeight: '1.45',
    letterSpacing: '0em',
    fontWeight: 400,
  },
  kpi: {
    token: 'KPI Value',
    cssVar: '--fs-kpi',
    className: 'typo-kpi',
    desktop: '26px',
    tablet: '24px',
    mobile: '21px',
    fluidClamp: 'clamp(21px, 1.2vw + 17px, 26px)',
    lineHeight: '1.18',
    letterSpacing: '-0.02em',
    fontWeight: 700,
  },
  popupTitle: {
    token: 'Popup / Modal Title',
    cssVar: '--fs-popup-title',
    className: 'typo-popup-title',
    desktop: '20px',
    tablet: '19px',
    mobile: '17px',
    fluidClamp: 'clamp(17px, 0.7vw + 15px, 20px)',
    lineHeight: '1.28',
    letterSpacing: '-0.015em',
    fontWeight: 700,
    textWrap: 'balance',
  },
};

// Breakpoints dùng cho nội suy kích thước phông chữ mượt mà theo viewport
const VIEWPORT_MOBILE_MIN = 375;
const VIEWPORT_TABLET_REF = 768;
const VIEWPORT_DESKTOP_REF = 1280;

function parsePxValue(val: string): number {
  const num = parseFloat(val);
  return Number.isFinite(num) ? num : 14;
}

/**
 * Nội suy tuyến tính kích thước phông chữ theo chiều rộng viewport thực tế
 * giữa các mốc Mobile (375px) -> Tablet (768px) -> Desktop (1280px).
 * Làm tròn đến bước 0.25px để vừa mượt vừa tránh nhòe subpixel.
 */
function interpolateViewportFontSize(
  width: number,
  mobilePx: number,
  tabletPx: number,
  desktopPx: number
): string {
  const clampedW = Math.max(320, Math.min(1920, width));
  let result: number;

  if (clampedW <= VIEWPORT_MOBILE_MIN) {
    result = mobilePx;
  } else if (clampedW < VIEWPORT_TABLET_REF) {
    const progress = (clampedW - VIEWPORT_MOBILE_MIN) / (VIEWPORT_TABLET_REF - VIEWPORT_MOBILE_MIN);
    result = mobilePx + (tabletPx - mobilePx) * progress;
  } else if (clampedW < VIEWPORT_DESKTOP_REF) {
    const progress = (clampedW - VIEWPORT_TABLET_REF) / (VIEWPORT_DESKTOP_REF - VIEWPORT_TABLET_REF);
    result = tabletPx + (desktopPx - tabletPx) * progress;
  } else {
    result = desktopPx;
  }

  const roundedQuarter = Math.round(result * 4) / 4;
  return `${roundedQuarter}px`;
}

// Map tên key trong TYPOGRAPHY_SCALE sang biến CSS line-height & letter-spacing tương ứng
const SCALE_LINE_HEIGHT_VAR_MAP: Record<string, string> = {
  h1: '--lh-h1',
  h2: '--lh-h2',
  h3: '--lh-h3',
  h4: '--lh-h4',
  h5: '--lh-h5',
  bodyLarge: '--lh-body-lg',
  body: '--lh-body',
  bodySmall: '--lh-body-sm',
  caption: '--lh-caption',
  label: '--lh-label',
  badge: '--lh-badge',
  button: '--lh-button',
  nav: '--lh-nav',
  tab: '--lh-tab',
  input: '--lh-input',
  kpi: '--lh-kpi',
  popupTitle: '--lh-popup-title',
};

const SCALE_LETTER_SPACING_VAR_MAP: Record<string, string> = {
  h1: '--ls-h1',
  h2: '--ls-h2',
  h3: '--ls-h3',
  h4: '--ls-h4',
  h5: '--ls-h5',
  bodyLarge: '--ls-body',
  body: '--ls-body',
  bodySmall: '--ls-body',
  caption: '--ls-caption',
  label: '--ls-label',
  badge: '--ls-label',
  kpi: '--ls-kpi',
  popupTitle: '--ls-popup-title',
};

// Global singleton flag to prevent duplicate event listeners
let isResizeListenerBound = false;
let activeFontScaleMode: FontScaleMode = 'normal';

export function setTypographyFontScaleMultiplier(scale: FontScaleMode): void {
  activeFontScaleMode = normalizeFontScale(scale);
  applyTypographyScaleToDocument();
}

/**
 * Cập nhật động kích thước phông chữ (Fluid Typography) theo chiều rộng màn hình thực tế,
 * đồng thời áp dụng cấu hình Better-Typography toàn cục:
 * - Thuộc tính gốc (font-optical-sizing, font-kerning, text-rendering, font-variant-ligatures)
 * - Tỷ lệ ký tự trên dòng tối ưu (45–75ch) thích ứng theo viewport
 * - Chiều cao dòng không đơn vị (unitless line-height) đồng bộ cho từng cấp độ typo-h1 -> typo-caption
 */
export function applyTypographyScaleToDocument(forcedWidth?: number): void {
  if (typeof document === 'undefined') return;

  const width =
    typeof forcedWidth === 'number' && Number.isFinite(forcedWidth) && forcedWidth > 0
      ? forcedWidth
      : typeof window !== 'undefined'
        ? window.innerWidth
        : VIEWPORT_DESKTOP_REF;

  const rootEl = document.documentElement;
  const rootStyle = rootEl.style;

  // 1. Phông chữ chuẩn hệ thống (Play font)
  rootStyle.setProperty('--font-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-heading', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-body', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-numeric', "'Play', sans-serif");

  // 2. Better-Typography Native Properties (ưu tiên thuộc tính CSS gốc thay cho feature-settings thô)
  rootStyle.setProperty('font-optical-sizing', 'auto');
  rootStyle.setProperty('font-kerning', 'normal');
  rootStyle.setProperty('font-variant-ligatures', 'common-ligatures contextual');
  rootStyle.setProperty('font-synthesis-weight', 'none');
  rootStyle.setProperty('-webkit-font-smoothing', 'antialiased');
  rootStyle.setProperty('-moz-osx-font-smoothing', 'grayscale');
  rootStyle.setProperty('text-rendering', 'optimizeLegibility');

  // 3. Tỷ lệ ký tự tối ưu trên dòng (Optimal Character-per-line Measure: 45–75ch) thích ứng viewport
  const isSmallMobile = width < 480;
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1200;
  const tier = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
  rootEl.setAttribute('data-viewport-tier', tier);
  rootEl.setAttribute('data-typography-ready', 'true');

  rootStyle.setProperty('--ch-measure-compact', isSmallMobile ? '45ch' : '52ch');
  rootStyle.setProperty('--ch-measure', isSmallMobile ? '54ch' : isMobile ? '60ch' : isTablet ? '65ch' : '68ch');
  rootStyle.setProperty('--ch-measure-wide', isMobile ? '66ch' : '75ch');

  // 4. Chiều cao dòng không đơn vị chuẩn thống nhất (Unitless Line Heights)
  rootStyle.setProperty('--lh-heading', isMobile ? '1.25' : '1.28');
  rootStyle.setProperty('--lh-body', isMobile ? '1.58' : '1.6');
  rootStyle.setProperty('--lh-compact', '1.38');
  rootStyle.setProperty('--lh-kpi', '1.18');

  // 5. Letter spacing mặc định
  rootStyle.setProperty('--ls-h1', '-0.022em');
  rootStyle.setProperty('--ls-h2', '-0.016em');
  rootStyle.setProperty('--ls-h3', '-0.01em');
  rootStyle.setProperty('--ls-h4', '-0.005em');
  rootStyle.setProperty('--ls-h5', '-0.005em');
  rootStyle.setProperty('--ls-body', '0.005em');
  rootStyle.setProperty('--ls-caption', '0.01em');
  rootStyle.setProperty('--ls-label', '0.025em');

  // 6. Tính toán động kích thước phông chữ theo chiều rộng viewport thực tế cho toàn bộ token
  // Đảm bảo typo-h1 -> typo-caption luôn co giãn mượt mà và rõ nét trên mọi màn hình
  const fontScaleMult = getFontScaleMultiplier(activeFontScaleMode);
  rootEl.setAttribute('data-font-scale', activeFontScaleMode);
  rootStyle.setProperty('--font-scale', String(fontScaleMult));

  Object.entries(TYPOGRAPHY_SCALE).forEach(([key, spec]) => {
    const tokenMult = key === 'nav' ? 1 : fontScaleMult;
    const mobilePx = parsePxValue(spec.mobile) * tokenMult;
    const tabletPx = parsePxValue(spec.tablet) * tokenMult;
    const desktopPx = parsePxValue(spec.desktop) * tokenMult;

    // Đảm bảo input trên thiết bị cảm ứng/mobile tối thiểu 16px tránh auto-zoom iOS Safari
    const dynamicSize =
      key === 'input' && isMobile
        ? `${Math.max(16, Math.round(mobilePx * 4) / 4)}px`
        : interpolateViewportFontSize(width, mobilePx, tabletPx, desktopPx);

    rootStyle.setProperty(spec.cssVar, dynamicSize);
    rootStyle.setProperty(`${spec.cssVar}-fluid`, spec.fluidClamp);

    const lhVar = SCALE_LINE_HEIGHT_VAR_MAP[key];
    if (lhVar) {
      rootStyle.setProperty(lhVar, spec.lineHeight);
    }

    const lsVar = SCALE_LETTER_SPACING_VAR_MAP[key];
    if (lsVar && spec.letterSpacing) {
      rootStyle.setProperty(lsVar, spec.letterSpacing);
    }
  });

  // 7. Gắn listener lắng nghe thay đổi kích thước màn hình (chỉ gắn 1 lần duy nhất)
  if (typeof window !== 'undefined' && !isResizeListenerBound) {
    isResizeListenerBound = true;
    let rAFId: number | null = null;
    const handleResize = () => {
      if (rAFId) cancelAnimationFrame(rAFId);
      rAFId = requestAnimationFrame(() => {
        applyTypographyScaleToDocument(window.innerWidth);
      });
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
  }
}
