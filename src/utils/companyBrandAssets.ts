export type CompanyBrandId =
  | 'mobifone'
  | 'v247'
  | 'lbc'
  | 'htvc'
  | 'ved'
  | 'garena'
  | 'gcafe'
  | 'shopeepay'
  | 'shopee'
  | 'prudential'
  | 'momo'
  | 'finviet'
  | 'powerservice';

export interface CompanyBrandSpec {
  id: CompanyBrandId;
  name: string;
  monogram: string;
  bgStart: string;
  bgEnd: string;
  accent: string;
  textColor: string;
  subLabel?: string;
}

export const COMPANY_BRAND_SPECS: Record<CompanyBrandId, CompanyBrandSpec> = {
  mobifone: {
    id: 'mobifone',
    name: 'MobiFone',
    monogram: 'MF',
    bgStart: '#0062B8',
    bgEnd: '#0095DA',
    accent: '#E11D48',
    textColor: '#FFFFFF',
    subLabel: '4G',
  },
  v247: {
    id: 'v247',
    name: 'V247',
    monogram: 'V247',
    bgStart: '#EA580C',
    bgEnd: '#F59E0B',
    accent: '#FEF3C7',
    textColor: '#FFFFFF',
  },
  lbc: {
    id: 'lbc',
    name: 'LBC',
    monogram: 'LBC',
    bgStart: '#0F766E',
    bgEnd: '#14B8A6',
    accent: '#CCFBF1',
    textColor: '#FFFFFF',
  },
  htvc: {
    id: 'htvc',
    name: 'HTVC',
    monogram: 'HTVC',
    bgStart: '#1D4ED8',
    bgEnd: '#0EA5E9',
    accent: '#FACC15',
    textColor: '#FFFFFF',
  },
  ved: {
    id: 'ved',
    name: 'VED',
    monogram: 'VED',
    bgStart: '#1E293B',
    bgEnd: '#DC2626',
    accent: '#F87171',
    textColor: '#FFFFFF',
  },
  garena: {
    id: 'garena',
    name: 'Garena',
    monogram: 'G',
    bgStart: '#B91C1C',
    bgEnd: '#EF4444',
    accent: '#FCA5A5',
    textColor: '#FFFFFF',
  },
  gcafe: {
    id: 'gcafe',
    name: 'GCafe',
    monogram: 'GC',
    bgStart: '#1E40AF',
    bgEnd: '#3B82F6',
    accent: '#93C5FD',
    textColor: '#FFFFFF',
  },
  shopeepay: {
    id: 'shopeepay',
    name: 'ShopeePay',
    monogram: 'SP',
    bgStart: '#C2410C',
    bgEnd: '#F97316',
    accent: '#FED7AA',
    textColor: '#FFFFFF',
  },
  shopee: {
    id: 'shopee',
    name: 'Shopee',
    monogram: 'S',
    bgStart: '#D9381E',
    bgEnd: '#FB5533',
    accent: '#FFEDD5',
    textColor: '#FFFFFF',
  },
  prudential: {
    id: 'prudential',
    name: 'Prudential',
    monogram: 'PRU',
    bgStart: '#991B1B',
    bgEnd: '#DC2626',
    accent: '#FEE2E2',
    textColor: '#FFFFFF',
  },
  momo: {
    id: 'momo',
    name: 'MoMo',
    monogram: 'MoMo',
    bgStart: '#A50064',
    bgEnd: '#D82D8B',
    accent: '#FBCFE8',
    textColor: '#FFFFFF',
  },
  finviet: {
    id: 'finviet',
    name: 'Finviet ECO',
    monogram: 'ECO',
    bgStart: '#B45309',
    bgEnd: '#F59E0B',
    accent: '#FEF08A',
    textColor: '#FFFFFF',
  },
  powerservice: {
    id: 'powerservice',
    name: 'Power Service',
    monogram: 'PS',
    bgStart: '#0369A1',
    bgEnd: '#38BDF8',
    accent: '#BAE6FD',
    textColor: '#FFFFFF',
  },
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildCompanyLogoSvgDataUri(spec: CompanyBrandSpec): string {
  const fontSize =
    spec.monogram.length >= 4 ? 22 : spec.monogram.length === 3 ? 25 : spec.monogram.length === 2 ? 32 : 40;
  const safeId = escapeXml(spec.id);
  const safeMonogram = escapeXml(spec.monogram);

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">`,
    `<defs>`,
    `<linearGradient id="g-${safeId}" x1="0%" y1="0%" x2="100%" y2="100%">`,
    `<stop offset="0%" stop-color="${spec.bgStart}"/>`,
    `<stop offset="100%" stop-color="${spec.bgEnd}"/>`,
    `</linearGradient>`,
    `</defs>`,
    `<circle cx="48" cy="48" r="46" fill="url(#g-${safeId})"/>`,
    `<circle cx="48" cy="48" r="42" fill="none" stroke="${spec.accent}" stroke-opacity="0.45" stroke-width="2.5"/>`,
    `<text x="48" y="49" text-anchor="middle" dominant-baseline="central" fill="${spec.textColor}" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" font-weight="800" font-size="${fontSize}" letter-spacing="-0.5">${safeMonogram}</text>`,
    `</svg>`,
  ].join('');

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const COMPANY_LOGOS: Record<CompanyBrandId, string> = {
  mobifone: 'https://i.postimg.cc/J0f8691x/Mobifone.webp',
  v247: 'https://i.postimg.cc/zvsNt9J6/V247.webp',
  lbc: 'https://i.postimg.cc/hvknyHSr/LBC.webp',
  htvc: 'https://i.postimg.cc/C5BY4FVP/HTVC.webp',
  ved: 'https://i.postimg.cc/cCpW9Vsz/VED.webp',
  garena: 'https://i.postimg.cc/gjXdKYPT/Garena.webp',
  gcafe: 'https://i.postimg.cc/3N47ZKHf/GCafe.webp',
  shopeepay: 'https://i.postimg.cc/kG0C1knp/Shopee-Paye.webp',
  shopee: 'https://i.postimg.cc/zvsNt9Jt/Shopee.webp',
  prudential: 'https://i.postimg.cc/D09hjt2Y/Prudential.webp',
  momo: 'https://i.postimg.cc/90628vWg/Momo.webp',
  finviet: 'https://i.postimg.cc/3N47ZKHb/Finviet.webp',
  powerservice: 'https://i.postimg.cc/0jTvWL8Z/Power-Service.webp',
};

const MATCHERS: Array<{ pattern: RegExp; id: CompanyBrandId }> = [
  { pattern: /mobifone/i, id: 'mobifone' },
  { pattern: /v247|viễn\s*liên/i, id: 'v247' },
  { pattern: /htvc/i, id: 'htvc' },
  { pattern: /lbc|băng\s*thông\s*rộng/i, id: 'lbc' },
  { pattern: /shopeepay|shopee-paye|airpay/i, id: 'shopeepay' },
  { pattern: /shopee/i, id: 'shopee' },
  { pattern: /gcafe/i, id: 'gcafe' },
  { pattern: /garena/i, id: 'garena' },
  { pattern: /\bved\b|vietnam\s*esport/i, id: 'ved' },
  { pattern: /prudential/i, id: 'prudential' },
  { pattern: /momo|mservice/i, id: 'momo' },
  { pattern: /finviet|\beco\b/i, id: 'finviet' },
  { pattern: /power\s*service|sẵn\s*sàng/i, id: 'powerservice' },
];

export function matchCompanyBrandId(hint: string | undefined | null): CompanyBrandId {
  const input = (hint || '').trim();
  for (const { pattern, id } of MATCHERS) {
    if (pattern.test(input)) return id;
  }
  return 'powerservice';
}

export function resolveCompanyLogo(hint: string | undefined | null): string {
  return COMPANY_LOGOS[matchCompanyBrandId(hint)];
}
