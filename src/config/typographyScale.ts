export interface TypographyTokenSpec {
  token: string;
  cssVar: string;
  className: string;
  desktop: string;
  tablet: string;
  mobile: string;
  lineHeight: string;
  fontWeight: number;
}

/**
 * Hệ thống Typography chuẩn thống nhất toàn website (One Global Typography System)
 * Nguồn sự thật duy nhất đồng bộ 100% với CSS variables trong src/styles/tokens.css
 */
export const TYPOGRAPHY_SCALE: Record<string, TypographyTokenSpec> = {
  h1: {
    token: 'H1 – Tiêu đề trang',
    cssVar: '--fs-h1',
    className: 'typo-h1',
    desktop: '28px',
    tablet: '26px',
    mobile: '24px',
    lineHeight: '1.3',
    fontWeight: 700,
  },
  h2: {
    token: 'H2 – Tiêu đề khu vực',
    cssVar: '--fs-h2',
    className: 'typo-h2',
    desktop: '23px',
    tablet: '22px',
    mobile: '20px',
    lineHeight: '1.3',
    fontWeight: 700,
  },
  h3: {
    token: 'H3 – Tiêu đề Card',
    cssVar: '--fs-h3',
    className: 'typo-h3',
    desktop: '19px',
    tablet: '18px',
    mobile: '18px',
    lineHeight: '1.3',
    fontWeight: 600,
  },
  h4: {
    token: 'H4 – Tiêu đề Sub Card',
    cssVar: '--fs-h4',
    className: 'typo-h4',
    desktop: '17px',
    tablet: '16px',
    mobile: '16px',
    lineHeight: '1.3',
    fontWeight: 600,
  },
  h5: {
    token: 'H5 – Tiêu đề nhỏ',
    cssVar: '--fs-h5',
    className: 'typo-h5',
    desktop: '16px',
    tablet: '16px',
    mobile: '15px',
    lineHeight: '1.3',
    fontWeight: 600,
  },
  bodyLarge: {
    token: 'Body Large',
    cssVar: '--fs-body-lg',
    className: 'typo-body-lg',
    desktop: '16px',
    tablet: '15px',
    mobile: '15px',
    lineHeight: '1.6',
    fontWeight: 400,
  },
  body: {
    token: 'Body Regular',
    cssVar: '--fs-body',
    className: 'typo-body',
    desktop: '15px',
    tablet: '15px',
    mobile: '15px',
    lineHeight: '1.6',
    fontWeight: 400,
  },
  bodySmall: {
    token: 'Body Small',
    cssVar: '--fs-body-sm',
    className: 'typo-body-sm',
    desktop: '14px',
    tablet: '14px',
    mobile: '14px',
    lineHeight: '1.6',
    fontWeight: 400,
  },
  caption: {
    token: 'Caption / Metadata',
    cssVar: '--fs-caption',
    className: 'typo-caption',
    desktop: '13px',
    tablet: '13px',
    mobile: '13px',
    lineHeight: '1.4',
    fontWeight: 400,
  },
  label: {
    token: 'Label / Tag',
    cssVar: '--fs-label',
    className: 'typo-label',
    desktop: '12px',
    tablet: '12px',
    mobile: '12px',
    lineHeight: '1.4',
    fontWeight: 600,
  },
  badge: {
    token: 'Badge',
    cssVar: '--fs-badge',
    className: 'typo-badge',
    desktop: '12px',
    tablet: '12px',
    mobile: '12px',
    lineHeight: '1.4',
    fontWeight: 600,
  },
  button: {
    token: 'Button',
    cssVar: '--fs-button',
    className: 'typo-button',
    desktop: '14px',
    tablet: '14px',
    mobile: '14px',
    lineHeight: '1.4',
    fontWeight: 700,
  },
  nav: {
    token: 'Navigation',
    cssVar: '--fs-nav',
    className: 'typo-nav',
    desktop: '14px',
    tablet: '14px',
    mobile: '14px',
    lineHeight: '1.4',
    fontWeight: 600,
  },
  tab: {
    token: 'Tab',
    cssVar: '--fs-tab',
    className: 'typo-tab',
    desktop: '14px',
    tablet: '14px',
    mobile: '14px',
    lineHeight: '1.4',
    fontWeight: 600,
  },
  input: {
    token: 'Input',
    cssVar: '--fs-input',
    className: 'typo-input',
    desktop: '15px',
    tablet: '15px',
    mobile: '16px',
    lineHeight: '1.4',
    fontWeight: 400,
  },
  kpi: {
    token: 'KPI Value',
    cssVar: '--fs-kpi',
    className: 'typo-kpi',
    desktop: '26px',
    tablet: '24px',
    mobile: '22px',
    lineHeight: '1.2',
    fontWeight: 700,
  },
  popupTitle: {
    token: 'Popup / Modal Title',
    cssVar: '--fs-popup-title',
    className: 'typo-popup-title',
    desktop: '20px',
    tablet: '19px',
    mobile: '18px',
    lineHeight: '1.3',
    fontWeight: 700,
  },
};

export function applyTypographyScaleToDocument(): void {
  if (typeof document === 'undefined') return;
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--font-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-primary', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-heading', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-body', "'Play', sans-serif");
  rootStyle.setProperty('--font-family-numeric', "'Play', sans-serif");
}
