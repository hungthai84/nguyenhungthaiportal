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
  maxGridCols: number;
  minColWidth: number;
  subcardCount: number;
  isSplitLayout: boolean;
  densityTier: 'compact' | 'balanced' | 'spacious';
  layoutFactor: number;
  colFactor: number;
  optimalChMeasure: string;
}

const clampNum = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const lerpFactor = (val: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  if (inMax <= inMin) return outMin;
  const t = clampNum((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

/**
 * Đánh giá bố cục tổng thể (kích thước Main Card đang hiển thị, chiều rộng từng cột lưới,
 * bố cục chia đôi/sidebar, và mật độ sub-card) để tự động suy ra hệ số kích thước chữ tương ứng.
 */
export function evaluateOverallLayoutTypography(
  targetEl?: HTMLElement | null
): LayoutTypographyEvaluation {
  const vw = typeof window !== 'undefined' ? window.innerWidth : VIEWPORT_DESKTOP_REF;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  let containerWidth = Math.min(1250, vw);
  let containerHeight = Math.max(360, vh * 0.76);
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
      // Với các trang có nhiều Main Card nằm ngang (Thư ngỏ, Giới thiệu, Tử vi),
      // chọn Main Card đang nằm gần tâm ngang màn hình nhất để đánh giá chính xác.
      const viewportCenterX = vw / 2;
      let bestDist = Infinity;
      for (const card of allMainCards) {
        const r = card.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const cardCenterX = r.left + r.width / 2;
        const dist = Math.abs(cardCenterX - viewportCenterX);
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

      // Kiểm tra các bố cục chia đôi (Project Detail + Sidebar Banner, Interview Video 70% + Detail 30%, Contact/AI Sidebar)
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
            const colGap = parseFloat(style.columnGap || '15') || 15;
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

  // 1. Đánh giá liên tục theo bề rộng thực tế của Main Card (320px -> 1250px)
  let widthFactor = 1;
  if (containerWidth < 420) {
    widthFactor = lerpFactor(containerWidth, 300, 420, 0.89, 0.94);
  } else if (containerWidth < 768) {
    widthFactor = lerpFactor(containerWidth, 420, 768, 0.94, 0.985);
  } else if (containerWidth < 1120) {
    widthFactor = lerpFactor(containerWidth, 768, 1120, 0.985, 1.015);
  } else {
    widthFactor = lerpFactor(containerWidth, 1120, 1250, 1.015, 1.035);
  }

  // 2. Đánh giá theo chiều cao khả dụng (đặc biệt màn laptop thấp <= 720px hoặc mobile landscape)
  let heightFactor = 1;
  if (containerHeight < 460) {
    heightFactor = lerpFactor(containerHeight, 320, 460, 0.88, 0.93);
  } else if (containerHeight < 640) {
    heightFactor = lerpFactor(containerHeight, 460, 640, 0.93, 0.985);
  } else if (containerHeight < 780) {
    heightFactor = lerpFactor(containerHeight, 640, 780, 0.985, 1.01);
  } else {
    heightFactor = 1.025;
  }

  // 3. Hệ số mật độ theo bề rộng thực tế mỗi cột & số lượng subcard trong trang
  let colDensityFactor = 1;
  if (minColWidth < 210) {
    colDensityFactor = 0.93;
  } else if (minColWidth < 260) {
    colDensityFactor = 0.96;
  } else if (minColWidth < 320 && maxGridCols >= 3) {
    colDensityFactor = 0.98;
  }
  if (subcardCount >= 18) {
    colDensityFactor *= 0.97;
  } else if (subcardCount >= 12) {
    colDensityFactor *= 0.985;
  }
  if (isSplitLayout && containerWidth < 680) {
    colDensityFactor *= 0.97;
  }

  // Kết hợp trọng số chiều rộng + chiều cao + mật độ cột/subcard
  const combinedBase = widthFactor * 0.58 + heightFactor * 0.42;
  const rawLayoutFactor = Math.min(combinedBase, heightFactor + 0.03) * (0.94 + colDensityFactor * 0.06);
  const layoutFactor = Math.round(clampNum(rawLayoutFactor, 0.87, 1.04) * 1000) / 1000;
  const colFactor = Math.round(clampNum(colDensityFactor, 0.9, 1.02) * 1000) / 1000;

  const densityTier: LayoutTypographyEvaluation['densityTier'] =
    layoutFactor <= 0.945 || colFactor <= 0.95
      ? 'compact'
      : layoutFactor >= 1.005 && colFactor >= 0.985
        ? 'spacious'
        : 'balanced';

  const optimalChMeasure =
    containerWidth < 460
      ? '48ch'
      : containerWidth < 720
        ? '56ch'
        : maxGridCols >= 3 || minColWidth < 360
          ? '60ch'
          : '68ch';

  if (typeof document !== 'undefined') {
    const rootEl = document.documentElement;
    rootEl.setAttribute('data-layout-density', densityTier);
    rootEl.setAttribute('data-layout-cols', maxGridCols >= 4 ? '4+' : String(maxGridCols));
    rootEl.style.setProperty('--layout-typo-factor', String(layoutFactor));
    rootEl.style.setProperty('--layout-col-factor', String(colFactor));
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
 * Cập nhật động kích thước phông chữ (Fluid Typography + Layout Evaluation) theo chiều rộng màn hình
 * và cấu trúc bố cục tổng thể thực tế:
 * - Thuộc tính gốc (font-optical-sizing, font-kerning, text-rendering, font-variant-ligatures)
 * - Tỷ lệ ký tự trên dòng tối ưu (45–75ch) thích ứng theo bố cục
 * - Chiều cao dòng không đơn vị đồng bộ cho từng cấp độ typo-h1 -> typo-caption
 * - Nhân đồng bộ mọi token với --layout-typo-factor từ hàm đánh giá bố cục
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

  // 6. Đặt hệ số mặc định và liên kết toàn bộ token cỡ chữ với --layout-typo-factor
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
    const isLockedMobileInput = key === 'input' && isMobile;
    const derivedFluidSize = isLockedMobileInput
      ? '16px'
      : `calc(${spec.fluidClamp} * var(--layout-typo-factor, 1))`;

    rootStyle.setProperty(spec.cssVar, derivedFluidSize);
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

  // Đánh giá bố cục tổng thể hiện tại để suy ra --layout-typo-factor & --layout-col-factor thực tế
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
