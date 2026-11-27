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
    desktop: '36px',
    tablet: '31px',
    mobile: '26px',
    fluidClamp: 'clamp(26px, 2.8vw, 36px)',
    lineHeight: '1.16',
    letterSpacing: '-0.024em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h1: {
    token: 'H1 – Tiêu đề trang',
    cssVar: '--fs-h1',
    className: 'typo-h1',
    desktop: '30px',
    tablet: '26px',
    mobile: '22px',
    fluidClamp: 'clamp(22px, 2.2vw, 30px)',
    lineHeight: '1.22',
    letterSpacing: '-0.02em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h2: {
    token: 'H2 – Tiêu đề khu vực',
    cssVar: '--fs-h2',
    className: 'typo-h2',
    desktop: '24px',
    tablet: '21px',
    mobile: '19px',
    fluidClamp: 'clamp(19px, 1.8vw, 24px)',
    lineHeight: '1.26',
    letterSpacing: '-0.016em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h3: {
    token: 'H3 – Tiêu đề Card',
    cssVar: '--fs-h3',
    className: 'typo-h3',
    desktop: '20px',
    tablet: '18.5px',
    mobile: '17px',
    fluidClamp: 'clamp(17px, 1.45vw, 20px)',
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
    fontWeight: 700,
    textWrap: 'balance',
  },
  h4: {
    token: 'H4 – Tiêu đề Sub Card',
    cssVar: '--fs-h4',
    className: 'typo-h4',
    desktop: '17.5px',
    tablet: '16.5px',
    mobile: '15.5px',
    fluidClamp: 'clamp(15.5px, 1.25vw, 17.5px)',
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
    tablet: '15.5px',
    mobile: '15px',
    fluidClamp: 'clamp(15px, 1.15vw, 16px)',
    lineHeight: '1.35',
    letterSpacing: '-0.005em',
    fontWeight: 600,
    textWrap: 'balance',
  },
  bodyLarge: {
    token: 'Body Large',
    cssVar: '--fs-body-lg',
    className: 'typo-body-lg',
    desktop: '17.5px',
    tablet: '16.5px',
    mobile: '15.5px',
    fluidClamp: 'clamp(15.5px, 1.25vw, 17.5px)',
    lineHeight: '1.6',
    letterSpacing: '0.005em',
    fontWeight: 400,
    textWrap: 'pretty',
  },
  body: {
    token: 'Body Regular',
    cssVar: '--fs-body',
    className: 'typo-body',
    desktop: '15.5px',
    tablet: '15px',
    mobile: '14.5px',
    fluidClamp: 'clamp(14.5px, 1.1vw, 15.5px)',
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
    tablet: '14px',
    mobile: '13.5px',
    fluidClamp: 'clamp(13.5px, 1vw, 14px)',
    lineHeight: '1.56',
    letterSpacing: '0.005em',
    fontWeight: 400,
    textWrap: 'pretty',
  },
  caption: {
    token: 'Caption / Metadata',
    cssVar: '--fs-caption',
    className: 'typo-caption',
    desktop: '12.5px',
    tablet: '12.5px',
    mobile: '12px',
    fluidClamp: 'clamp(12px, 0.9vw, 12.5px)',
    lineHeight: '1.42',
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
    fluidClamp: 'clamp(11.5px, 0.85vw, 12px)',
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
    fluidClamp: 'clamp(11.5px, 0.85vw, 12px)',
    lineHeight: '1.38',
    letterSpacing: '0.025em',
    fontWeight: 600,
  },
  overline: {
    token: 'Overline – Nhãn phân loại',
    cssVar: '--fs-overline',
    className: 'typo-overline',
    desktop: '12px',
    tablet: '12px',
    mobile: '11.5px',
    fluidClamp: 'clamp(11.5px, 0.85vw, 12px)',
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
    mobile: '13.5px',
    fluidClamp: 'clamp(13.5px, 0.98vw, 14px)',
    lineHeight: '1.35',
    letterSpacing: '0.01em',
    fontWeight: 700,
  },
  nav: {
    token: 'Navigation',
    cssVar: '--fs-nav',
    className: 'typo-nav',
    desktop: '14.5px',
    tablet: '14px',
    mobile: '13.5px',
    fluidClamp: 'clamp(13.5px, 1vw, 14.5px)',
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
    fluidClamp: 'clamp(13.5px, 0.98vw, 14px)',
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
    desktop: '30px',
    tablet: '26px',
    mobile: '22px',
    fluidClamp: 'clamp(22px, 2.2vw, 30px)',
    lineHeight: '1.18',
    letterSpacing: '-0.02em',
    fontWeight: 700,
  },
  quote: {
    token: 'Banner Quote',
    cssVar: '--fs-quote',
    className: 'banner-quote',
    desktop: '20px',
    tablet: '18.5px',
    mobile: '17px',
    fluidClamp: 'clamp(17px, 1.5vw, 20px)',
    lineHeight: '1.35',
    letterSpacing: '0em',
    fontWeight: 700,
  },
  popupTitle: {
    token: 'Popup / Modal Title',
    cssVar: '--fs-popup-title',
    className: 'typo-popup-title',
    desktop: '20px',
    tablet: '18.5px',
    mobile: '17px',
    fluidClamp: 'clamp(17px, 1.5vw, 20px)',
    lineHeight: '1.28',
    letterSpacing: '-0.015em',
    fontWeight: 700,
    textWrap: 'balance',
  },
};

export function resolveViewportTier(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (!Number.isFinite(width) || width < 768) return 'mobile';
  if (width < 1200) return 'tablet';
  return 'desktop';
}

export function resolveTokenSizeForWidth(spec: TypographyTokenSpec, width: number): string {
  const tier = resolveViewportTier(width);
  return spec[tier] || spec.desktop;
}

// Breakpoint tham chiếu mặc định khi không có window
const VIEWPORT_DESKTOP_REF = 1280;

export interface LayoutTypographyEvaluation {
  containerWidth: number;
  containerHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  maxGridCols: number;
  minColWidth: number;
  subcardCount: number;
  isSplitLayout: boolean;
  densityTier: 'compact' | 'balanced' | 'spacious';
  layoutFactor: number;
  colFactor: number;
  optimalChMeasure: string;
}

/**
 * Giữ nguyên tỷ lệ bố cục & cỡ chữ ở mức chuẩn mặc định 100% (1:1).
 * Không tự động phóng to hay thu nhỏ nội dung khi thay đổi kích thước khung.
 */
export function evaluateOverallLayoutTypography(
  targetEl?: HTMLElement | null
): LayoutTypographyEvaluation {
  const vw = typeof window !== 'undefined' ? window.innerWidth : VIEWPORT_DESKTOP_REF;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  let containerWidth = Math.min(1380, vw);
  let containerHeight = Math.max(360, vh * 0.8);
  let maxGridCols = 1;
  let minColWidth = containerWidth;
  let subcardCount = 0;
  let isSplitLayout = false;

  let activeMainCard: HTMLElement | null = null;

  if (typeof document !== 'undefined') {
    const searchRoot = targetEl || document.getElementById('global-content-viewport') || document.body;
    const allMainCards = Array.from(
      searchRoot.querySelectorAll<HTMLElement>('.page-main-card, [data-main-card="true"]')
    );

    if (allMainCards.length === 1) {
      activeMainCard = allMainCards[0];
    } else if (allMainCards.length > 1) {
      const viewportCenterY = vh / 2;
      let bestDist = Infinity;
      for (const card of allMainCards) {
        const r = card.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const cardCenterY = r.top + r.height / 2;
        const dist = Math.abs(cardCenterY - viewportCenterY);
        if (dist < bestDist) {
          bestDist = dist;
          activeMainCard = card;
        }
      }
    }

    if (!activeMainCard) {
      activeMainCard = targetEl || document.getElementById('global-content-viewport');
    }

    if (activeMainCard) {
      const rect = activeMainCard.getBoundingClientRect();
      if (rect.width > 0) containerWidth = rect.width;
      if (rect.height > 0) containerHeight = rect.height;
      minColWidth = containerWidth;

      const splitContainer = activeMainCard.querySelector<HTMLElement>(
        '#project-detail-layout, #interview-main-content, #about-intro-grid-1'
      );
      if (splitContainer) {
        isSplitLayout = true;
      }

      const grids = activeMainCard.querySelectorAll<HTMLElement>('.grid');
      grids.forEach((g) => {
        const style = window.getComputedStyle(g);
        const cols = style.gridTemplateColumns;
        if (cols && cols !== 'none') {
          const tracks = cols
            .trim()
            .split(/\s+/)
            .filter((t) => t && t !== '0px');
          const trackCount = tracks.length;
          if (trackCount > 1) {
            const gRect = g.getBoundingClientRect();
            const gWidth = gRect.width > 0 ? gRect.width : containerWidth;
            const colGap = parseFloat(style.columnGap || '16') || 16;
            const effectiveColW = (gWidth - colGap * (trackCount - 1)) / trackCount;
            if (trackCount > maxGridCols) maxGridCols = trackCount;
            if (effectiveColW > 80 && effectiveColW < minColWidth) {
              minColWidth = effectiveColW;
            }
          }
        }
      });

      const subcards = activeMainCard.querySelectorAll<HTMLElement>(
        '[data-subcard="true"], .sub-card, .exp-detail-subcard, .skill-swot-subcard, .project-card, .service-card'
      );
      subcardCount = subcards.length;
    }
  }

  const layoutFactor = 1;
  const colFactor = 1;
  const densityTier: LayoutTypographyEvaluation['densityTier'] = 'balanced';
  const optimalChMeasure = '68ch';

  if (typeof document !== 'undefined') {
    const rootEl = document.documentElement;
    rootEl.setAttribute('data-layout-density', densityTier);
    rootEl.setAttribute('data-layout-cols', maxGridCols >= 4 ? '4+' : String(maxGridCols));
    rootEl.style.setProperty('--layout-typo-factor', '1');
    rootEl.style.setProperty('--layout-col-factor', '1');
    rootEl.style.setProperty('--layout-active-w', `${Math.round(containerWidth)}px`);
    rootEl.style.setProperty('--layout-active-h', `${Math.round(containerHeight)}px`);
    rootEl.style.setProperty('--ch-measure', optimalChMeasure);

    if (activeMainCard) {
      activeMainCard.setAttribute('data-layout-density', densityTier);
      activeMainCard.setAttribute('data-layout-cols', maxGridCols >= 4 ? '4+' : String(maxGridCols));
    }
  }

  return {
    containerWidth,
    containerHeight,
    viewportWidth: vw,
    viewportHeight: vh,
    maxGridCols,
    minColWidth: Math.round(minColWidth),
    subcardCount,
    isSplitLayout,
    densityTier,
    layoutFactor,
    colFactor,
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
 * Áp dụng hệ thống phông chữ chuẩn mặc định 100% (1:1) lên tài liệu:
 * - Cố định cỡ chữ 100% chuẩn trên mọi kích thước trình duyệt, không phóng to thu nhỏ
 * - Chỉ ngắt cột lưới và xuống dòng tự nhiên khi thu hẹp cửa sổ
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

  // 2. Better-Typography Native Properties
  rootStyle.setProperty('font-optical-sizing', 'auto');
  rootStyle.setProperty('font-kerning', 'normal');
  rootStyle.setProperty('font-variant-ligatures', 'common-ligatures contextual');
  rootStyle.setProperty('font-synthesis-weight', 'none');
  rootStyle.setProperty('-webkit-font-smoothing', 'antialiased');
  rootStyle.setProperty('-moz-osx-font-smoothing', 'grayscale');
  rootStyle.setProperty('text-rendering', 'optimizeLegibility');

  const tier = resolveViewportTier(width);
  rootEl.setAttribute('data-viewport-tier', tier);
  rootEl.setAttribute('data-typography-ready', 'true');

  rootStyle.setProperty('--ch-measure-compact', '52ch');
  rootStyle.setProperty('--ch-measure', '68ch');
  rootStyle.setProperty('--ch-measure-wide', '75ch');

  // 4. Chiều cao dòng không đơn vị chuẩn thống nhất
  rootStyle.setProperty('--lh-heading', '1.26');
  rootStyle.setProperty('--lh-body', '1.6');
  rootStyle.setProperty('--lh-compact', '1.38');
  rootStyle.setProperty('--lh-kpi', '1.18');

  // 5. Letter spacing mặc định
  rootStyle.setProperty('--ls-display', '-0.024em');
  rootStyle.setProperty('--ls-h1', '-0.02em');
  rootStyle.setProperty('--ls-h2', '-0.016em');
  rootStyle.setProperty('--ls-h3', '-0.01em');
  rootStyle.setProperty('--ls-h4', '-0.005em');
  rootStyle.setProperty('--ls-h5', '-0.005em');
  rootStyle.setProperty('--ls-body', '0.005em');
  rootStyle.setProperty('--ls-caption', '0.01em');
  rootStyle.setProperty('--ls-label', '0.025em');

  // 6. Khóa hệ số thu phóng về đúng 1 (100% mặc định) và áp dụng fluid clamp() chuẩn theo từng viewport
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
  rootStyle.setProperty('--layout-typo-factor', '1');
  rootStyle.setProperty('--layout-col-factor', '1');

  Object.entries(TYPOGRAPHY_SCALE).forEach(([key, spec]) => {
    const resolvedFluid = spec.fluidClamp || spec.desktop;

    rootStyle.setProperty(spec.cssVar, resolvedFluid);
    rootStyle.setProperty(`${spec.cssVar}-fluid`, resolvedFluid);

    const lhVar = SCALE_LINE_HEIGHT_VAR_MAP[key];
    if (lhVar) {
      rootStyle.setProperty(lhVar, spec.lineHeight);
    }

    const lsVar = SCALE_LETTER_SPACING_VAR_MAP[key];
    if (lsVar && spec.letterSpacing) {
      rootStyle.setProperty(lsVar, spec.letterSpacing);
    }
  });

  evaluateOverallLayoutTypography();

  // 7. Gắn listener cập nhật tier viewport khi resize (cỡ chữ vẫn giữ cố định 100%)
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
