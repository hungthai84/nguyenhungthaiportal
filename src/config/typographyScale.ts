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
    fluidClamp: 'clamp(15px, 0.2vw + 14px, 16px)',
    lineHeight: '1.4',
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

// Global singleton flag to prevent duplicate event listeners
let isResizeListenerBound = false;

/**
 * Cập nhật động kích thước phông chữ (Fluid Typography) theo chiều rộng màn hình thực tế,
 * đồng thời áp dụng cấu hình Better-Typography (line-height chuẩn, tối ưu 45-75 ký tự/dòng,
 * làm mịn phông chữ và chống mồ côi dòng text-wrap).
 */
export function applyTypographyScaleToDocument(forcedWidth?: number): void {
  if (typeof document === 'undefined') return;

  const width = forcedWidth || (typeof window !== 'undefined' ? window.innerWidth : 1280);
  const rootStyle = document.documentElement.style;

  // 1. Phông chữ chuẩn Play font
  rootStyle.setProperty('--font-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-heading', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-body', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-numeric', "'Play', sans-serif");

  // 2. Thuộc tính hiển thị & làm mịn cao cấp (Better-Typography Craft)
  rootStyle.setProperty('-webkit-font-smoothing', 'antialiased');
  rootStyle.setProperty('-moz-osx-font-smoothing', 'grayscale');
  rootStyle.setProperty('text-rendering', 'optimizeLegibility');

  // 3. Tỷ lệ ký tự tối ưu trên dòng (Character-per-line / Optimal Measure: 45 - 75ch)
  rootStyle.setProperty('--ch-measure', '68ch');
  rootStyle.setProperty('--ch-measure-compact', '52ch');
  rootStyle.setProperty('--ch-measure-wide', '75ch');

  // 4. Chiều cao dòng chuẩn thống nhất (Unitless Line Heights)
  rootStyle.setProperty('--lh-heading', '1.28');
  rootStyle.setProperty('--lh-body', '1.6');
  rootStyle.setProperty('--lh-compact', '1.38');
  rootStyle.setProperty('--lh-kpi', '1.18');

  // 5. Letter spacing vi điều chỉnh cho từng cấp độ chữ
  rootStyle.setProperty('--ls-h1', '-0.022em');
  rootStyle.setProperty('--ls-h2', '-0.016em');
  rootStyle.setProperty('--ls-h3', '-0.01em');
  rootStyle.setProperty('--ls-body', '0.005em');
  rootStyle.setProperty('--ls-caption', '0.01em');
  rootStyle.setProperty('--ls-label', '0.025em');

  // 6. Tính toán giá trị fluid font size mượt mà theo viewport
  // Nếu màn hình < 768px -> dùng mobile token; 768-1199px -> tablet token; >= 1200px -> desktop token
  // Đồng thời gán kèm fluid clamp để CSS tự động nội suy giữa các mốc
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1200;

  Object.values(TYPOGRAPHY_SCALE).forEach((spec) => {
    // Luôn ưu tiên dùng fluidClamp để CSS tự co giãn mượt mà không bị giật nấc
    if (spec.fluidClamp) {
      rootStyle.setProperty(spec.cssVar, spec.fluidClamp);
    } else {
      const activeSize = isMobile ? spec.mobile : isTablet ? spec.tablet : spec.desktop;
      rootStyle.setProperty(spec.cssVar, activeSize);
    }
  });

  // 7. Gắn listener lắng nghe thay đổi kích thước màn hình (chỉ 1 lần)
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
