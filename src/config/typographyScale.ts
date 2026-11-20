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
  display: {
    token: 'Display – Tiêu đề nổi bật',
    cssVar: '--fs-display',
    className: 'typo-display',
    desktop: '56px',
    tablet: '44px',
    mobile: '32px',
    fluidClamp: 'clamp(32px, 3vw + 20px, 56px)',
    lineHeight: '1.16',
    letterSpacing: '-0.025em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h1: {
    token: 'H1 – Tiêu đề trang',
    cssVar: '--fs-h1',
    className: 'typo-h1',
    desktop: '48px',
    tablet: '36px',
    mobile: '26px',
    fluidClamp: 'clamp(26px, 2.2vw + 16px, 48px)',
    lineHeight: '1.25',
    letterSpacing: '-0.022em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h2: {
    token: 'H2 – Tiêu đề khu vực',
    cssVar: '--fs-h2',
    className: 'typo-h2',
    desktop: '32px',
    tablet: '26px',
    mobile: '20px',
    fluidClamp: 'clamp(20px, 1.4vw + 14px, 32px)',
    lineHeight: '1.28',
    letterSpacing: '-0.016em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h3: {
    token: 'H3 – Tiêu đề Card',
    cssVar: '--fs-h3',
    className: 'typo-h3',
    desktop: '24px',
    tablet: '20px',
    mobile: '17px',
    fluidClamp: 'clamp(17px, 0.8vw + 13.5px, 24px)',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  h4: {
    token: 'H4 – Tiêu đề Sub Card',
    cssVar: '--fs-h4',
    className: 'typo-h4',
    desktop: '20px',
    tablet: '18px',
    mobile: '15px',
    fluidClamp: 'clamp(15px, 0.6vw + 13px, 20px)',
    lineHeight: '1.32',
    letterSpacing: '-0.005em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  h5: {
    token: 'H5 – Tiêu đề nhỏ',
    cssVar: '--fs-h5',
    className: 'typo-h5',
    desktop: '18px',
    tablet: '16px',
    mobile: '14px',
    fluidClamp: 'clamp(14px, 0.5vw + 12px, 18px)',
    lineHeight: '1.35',
    letterSpacing: '-0.005em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  bodyLarge: {
    token: 'Body Large',
    cssVar: '--fs-body-lg',
    className: 'typo-body-lg',
    desktop: '18px',
    tablet: '16px',
    mobile: '15px',
    fluidClamp: 'clamp(15px, 0.4vw + 14px, 18px)',
    lineHeight: '1.6',
    letterSpacing: '0.005em',
    fontWeight: 400,
    textWrap: 'pretty',
  },
  body: {
    token: 'Body Regular',
    cssVar: '--fs-body',
    className: 'typo-body',
    desktop: '16px',
    tablet: '15px',
    mobile: '14px',
    fluidClamp: 'clamp(14px, 0.3vw + 13.5px, 16px)',
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
    desktop: '12px',
    tablet: '12px',
    mobile: '11.5px',
    fluidClamp: 'clamp(11.5px, 0.15vw + 11px, 12px)',
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
  overline: {
    token: 'Overline – Nhãn phân loại',
    cssVar: '--fs-overline',
    className: 'typo-overline',
    desktop: '10px',
    tablet: '10px',
    mobile: '10px',
    fluidClamp: 'clamp(10px, 0.1vw + 9.5px, 10px)',
    lineHeight: '1.35',
    letterSpacing: '0.03em',
    fontWeight: 600,
  },
  button: {
    token: 'Button',
    cssVar: '--fs-button',
    className: 'typo-button',
    desktop: '14px',
    tablet: '14px',
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
    desktop: '16px',
    tablet: '16px',
    // Mobile minimum 16px to prevent iOS Safari automatic zoom-in on focus
    mobile: '16px',
    fluidClamp: '16px',
    lineHeight: '1.45',
    letterSpacing: '0em',
    fontWeight: 400,
  },
  kpi: {
    token: 'KPI Value',
    cssVar: '--fs-kpi',
    className: 'typo-kpi',
    desktop: '36px',
    tablet: '30px',
    mobile: '24px',
    fluidClamp: 'clamp(24px, 1.5vw + 18px, 36px)',
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

// Breakpoint tham chiếu mặc định khi không có window
const VIEWPORT_DESKTOP_REF = 1280;

export interface LayoutTypographyEvaluation {
  containerWidth: number;
  containerHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  densityTier: 'compact' | 'balanced' | 'spacious';
  layoutFactor: number;
  optimalChMeasure: string;
}

/**
 * Đánh giá bố cục tổng thể (bề rộng & chiều cao Main Card thực tế, mật độ lưới cột/sub-card)
 * để suy ra hệ số cỡ chữ tương ứng, giúp văn bản vừa vặn theo tỷ lệ khung hình ở mọi kích thước.
 */
export function evaluateOverallLayoutTypography(
  targetEl?: HTMLElement | null
): LayoutTypographyEvaluation {
  const vw = typeof window !== 'undefined' ? window.innerWidth : VIEWPORT_DESKTOP_REF;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  let containerWidth = Math.min(1250, vw);
  let containerHeight = Math.max(360, vh * 0.76);
  let multiColCount = 1;

  if (typeof document !== 'undefined') {
    const activeMainCard =
      targetEl?.querySelector<HTMLElement>('.page-main-card[data-main-card="true"], [data-main-card="true"]') ||
      document.querySelector<HTMLElement>('#global-content-viewport .page-main-card') ||
      targetEl ||
      document.getElementById('global-content-viewport');

    if (activeMainCard) {
      const rect = activeMainCard.getBoundingClientRect();
      if (rect.width > 0) containerWidth = rect.width;
      if (rect.height > 0) containerHeight = rect.height;

      const grids = activeMainCard.querySelectorAll<HTMLElement>('.grid');
      grids.forEach((g) => {
        const cols = window.getComputedStyle(g).gridTemplateColumns;
        if (cols && cols !== 'none') {
          const trackCount = cols.trim().split(/\s+/).length;
          if (trackCount > multiColCount) multiColCount = trackCount;
        }
      });
    }
  }

  // Hệ số theo chiều rộng thực tế Main Card & chiều cao khả dụng (đặc biệt màn laptop thấp <= 720px)
  const widthFactor = containerWidth < 480 ? 0.94 : containerWidth < 768 ? 0.97 : containerWidth >= 1180 ? 1.02 : 1;
  const heightFactor = containerHeight < 480 ? 0.91 : containerHeight < 580 ? 0.95 : containerHeight >= 760 ? 1.02 : 1;
  const densityPenalty = multiColCount >= 4 ? 0.96 : multiColCount === 3 ? 0.98 : 1;

  const rawFactor = Math.min(widthFactor, heightFactor) * densityPenalty;
  const layoutFactor = Math.round(Math.max(0.88, Math.min(1.04, rawFactor)) * 1000) / 1000;

  const densityTier: LayoutTypographyEvaluation['densityTier'] =
    layoutFactor <= 0.94 ? 'compact' : layoutFactor >= 1.01 ? 'spacious' : 'balanced';

  const optimalChMeasure =
    containerWidth < 480 ? '50ch' : containerWidth < 768 ? '58ch' : multiColCount >= 3 ? '62ch' : '68ch';

  if (typeof document !== 'undefined') {
    const rootEl = document.documentElement;
    rootEl.setAttribute('data-layout-density', densityTier);
    rootEl.style.setProperty('--layout-typo-factor', String(layoutFactor));
    rootEl.style.setProperty('--layout-active-w', `${Math.round(containerWidth)}px`);
    rootEl.style.setProperty('--layout-active-h', `${Math.round(containerHeight)}px`);
    rootEl.style.setProperty('--ch-measure', optimalChMeasure);
  }

  return {
    containerWidth,
    containerHeight,
    viewportWidth: vw,
    viewportHeight: vh,
    densityTier,
    layoutFactor,
    optimalChMeasure,
  };
}

// Map tên key trong TYPOGRAPHY_SCALE sang biến CSS line-height & letter-spacing tương ứng
const SCALE_LINE_HEIGHT_VAR_MAP: Record<string, string> = {
  display: '--lh-display',
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
  overline: '--lh-overline',
  button: '--lh-button',
  nav: '--lh-nav',
  tab: '--lh-tab',
  input: '--lh-input',
  kpi: '--lh-kpi',
  popupTitle: '--lh-popup-title',
};

const SCALE_LETTER_SPACING_VAR_MAP: Record<string, string> = {
  display: '--ls-display',
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
  overline: '--ls-overline',
  kpi: '--ls-kpi',
  popupTitle: '--ls-popup-title',
};

// Global singleton flag to prevent duplicate event listeners
let isResizeListenerBound = false;

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

  // 1. Phông chữ chuẩn hệ thống (Play font) & Quote viết tay tiếng Việt (Dancing Script)
  rootStyle.setProperty('--font-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-heading', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-body', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-numeric', "'Play', sans-serif");
  rootStyle.setProperty('--font-quote', "'Dancing Script', cursive");

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

  // 6. Đưa toàn bộ kích thước font chữ về mặc định chuẩn ban đầu (100% fluid clamp, xóa sạch trạng thái phóng to chữ)
  try {
    localStorage.removeItem('hungthai_font_scale_v1');
  } catch {
    // ignore storage access issues
  }
  rootEl.removeAttribute('data-font-scale');
  if (document.body) {
    document.body.removeAttribute('data-font-scale');
  }
  rootStyle.setProperty('--font-scale', '1');

  Object.entries(TYPOGRAPHY_SCALE).forEach(([key, spec]) => {
    // Áp dụng trực tiếp giá trị fluid clamp() mặc định gốc (không nhân hệ số phóng to)
    const defaultFluidSize =
      key === 'input' && isMobile ? '16px' : spec.fluidClamp;

    rootStyle.setProperty(spec.cssVar, defaultFluidSize);
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

  // Đánh giá bố cục tổng thể hiện tại để đồng bộ --layout-typo-factor
  evaluateOverallLayoutTypography();

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
