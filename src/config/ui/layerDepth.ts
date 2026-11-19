import { CardStyleMode, FontScaleMode } from './theme.types';

export interface LayerDepthPresetItem {
  value: number;
  labelVi: string;
  labelEn: string;
}

export const LAYER_DEPTH_PRESETS: LayerDepthPresetItem[] = [
  { value: 0, labelVi: '0% · Phẳng', labelEn: '0% · Flat' },
  { value: 60, labelVi: '60% · Nhẹ', labelEn: '60% · Soft' },
  { value: 100, labelVi: '100% · Chuẩn', labelEn: '100% · Standard' },
  { value: 150, labelVi: '150% · Sâu', labelEn: '150% · Deep' },
  { value: 200, labelVi: '200% · Nổi bật', labelEn: '200% · Elevated' },
];

export interface FontScaleOptionItem {
  id: FontScaleMode;
  multiplier: number;
  badge: string;
  labelVi: string;
  labelEn: string;
}

export const FONT_SCALE_OPTIONS: FontScaleOptionItem[] = [
  { id: 'normal', multiplier: 1, badge: '100%', labelVi: 'Chuẩn (100%)', labelEn: 'Normal (100%)' },
  { id: 'large', multiplier: 1.08, badge: '+8%', labelVi: 'Lớn (+8%)', labelEn: 'Large (+8%)' },
  { id: 'xlarge', multiplier: 1.16, badge: '+16%', labelVi: 'Rất lớn (+16%)', labelEn: 'Extra Large (+16%)' },
];

export function clampLayerDepth(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 100;
  return Math.max(0, Math.min(200, Math.round(num)));
}

export function normalizeFontScale(value: unknown): FontScaleMode {
  if (value === 'large' || value === 'xlarge') return value;
  return 'normal';
}

export function getFontScaleMultiplier(scale: FontScaleMode): number {
  if (scale === 'large') return 1.08;
  if (scale === 'xlarge') return 1.16;
  return 1;
}

function px(val: number): string {
  return `${Math.round(val * 10) / 10}px`;
}

export function applyLayerDepthCssVariables(depthRaw: number, cardStyle: CardStyleMode): void {
  if (typeof document === 'undefined') return;
  const depth = clampLayerDepth(depthRaw);
  const scale = depth / 100;
  const root = document.documentElement;
  const isFlat = depth === 0;

  root.setAttribute('data-layer-depth', String(depth));
  root.setAttribute('data-surface-depth', isFlat ? 'flat' : 'depth');
  if (document.body) {
    document.body.setAttribute('data-layer-depth', String(depth));
    document.body.setAttribute('data-surface-depth', isFlat ? 'flat' : 'depth');
  }

  root.style.setProperty('--layer-depth-scale', scale.toFixed(2));

  if (isFlat) {
    root.style.setProperty('--layer-l1-shadow', 'none');
    root.style.setProperty('--layer-l1-header-shadow', 'none');
    root.style.setProperty('--layer-l1-footer-shadow', 'none');
    root.style.setProperty('--layer-l2-shadow', 'none');
    root.style.setProperty('--layer-l2-shadow-hover', 'none');
    root.style.setProperty('--layer-l2-lift', '0px');
    root.style.setProperty('--layer-l3-shadow', 'none');
    root.style.setProperty('--layer-l3-shadow-hover', 'none');
    root.style.setProperty('--layer-l3-lift', '0px');
    return;
  }

  const isDarkTheme =
    cardStyle === 'dark-soft-indigo-fintech' ||
    cardStyle === 'dark-ice-blue-neu' ||
    cardStyle === 'black-cowhide-leather' ||
    cardStyle === 'cowhide-leather' ||
    cardStyle === 'dark-rainbow-glass' ||
    cardStyle === 'special-rainbow-glass';
  const isIceNeu = cardStyle === 'ice-blue-neu' || cardStyle === 'dark-ice-blue-neu';

  // Hover lift per level: restrained max 3px lift
  const l2Lift = -Math.max(1.5, Math.min(3, Math.round(3 * scale * 10) / 10));
  const l3Lift = -Math.max(1, Math.min(2, Math.round(2 * scale * 10) / 10));

  root.style.setProperty('--layer-l2-lift', `${l2Lift}px`);
  root.style.setProperty('--layer-l3-lift', `${l3Lift}px`);

  if (cardStyle === 'soft-indigo-fintech') {
    const pA = Math.min(0.22, 0.12 * scale).toFixed(2);
    const pHoverA = Math.min(0.28, 0.18 * scale).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(18 * scale)} ${px(42 * scale)} rgba(94, 72, 232, ${pA}), inset 0 1px 0 rgba(255, 255, 255, 0.85)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(10 * scale)} ${px(28 * scale)} rgba(94, 72, 232, ${pA}), inset 0 1px 0 rgba(255, 255, 255, 0.90)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(10 * scale)} ${px(28 * scale)} rgba(94, 72, 232, ${pA}), inset 0 1px 0 rgba(255, 255, 255, 0.90)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(10 * scale)} ${px(26 * scale)} -${px(4 * scale)} rgba(94, 72, 232, ${pA}), 5px 0 0 -1px rgba(94, 72, 232, 0.18), 9px 0 0 -3px rgba(56, 189, 248, 0.14)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(16 * scale)} ${px(34 * scale)} -${px(4 * scale)} rgba(94, 72, 232, ${pHoverA}), 6px 0 0 -1px rgba(94, 72, 232, 0.26), 11px 0 0 -3px rgba(56, 189, 248, 0.20)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} -${px(2 * scale)} rgba(94, 72, 232, ${(0.09 * scale).toFixed(2)}), 3px 0 0 -1px rgba(94, 72, 232, 0.14)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(10 * scale)} ${px(22 * scale)} -${px(2 * scale)} rgba(94, 72, 232, ${pA}), 4px 0 0 -1px rgba(94, 72, 232, 0.22)`
    );
    return;
  }

  if (cardStyle === 'dark-soft-indigo-fintech') {
    const dA = Math.min(0.56, 0.36 * scale).toFixed(2);
    const pGlow = Math.min(0.28, 0.16 * scale).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(20 * scale)} ${px(44 * scale)} rgba(5, 8, 22, ${dA}), 0 0 ${px(24 * scale)} rgba(108, 76, 230, ${pGlow})`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(12 * scale)} ${px(30 * scale)} rgba(5, 8, 22, ${dA}), inset 0 1px 0 rgba(196, 181, 253, 0.18)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(12 * scale)} ${px(30 * scale)} rgba(5, 8, 22, ${dA}), inset 0 1px 0 rgba(196, 181, 253, 0.18)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(12 * scale)} ${px(28 * scale)} -${px(4 * scale)} rgba(5, 8, 22, ${dA}), 5px 0 0 -1px rgba(108, 76, 230, 0.30), 9px 0 0 -3px rgba(56, 189, 248, 0.22)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(18 * scale)} ${px(38 * scale)} -${px(4 * scale)} rgba(5, 8, 22, 0.65), 0 0 ${px(20 * scale)} rgba(108, 76, 230, 0.26), 6px 0 0 -1px rgba(139, 123, 255, 0.42)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(5, 8, 22, 0.34), 3px 0 0 -1px rgba(108, 76, 230, 0.22)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(10 * scale)} ${px(22 * scale)} rgba(5, 8, 22, 0.48), 4px 0 0 -1px rgba(139, 123, 255, 0.32)`
    );
    return;
  }

  if (cardStyle === 'ice-blue-neu') {
    const a1 = Math.min(0.45, 0.22 * scale + 0.04).toFixed(2);
    const a2 = Math.min(0.95, 0.68 * Math.min(1.25, scale) + 0.08).toFixed(2);
    const aSub = Math.min(0.35, 0.16 * scale + 0.03).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `${px(8 * scale)} ${px(8 * scale)} ${px(20 * scale)} rgba(163, 184, 209, ${a1}), -${px(6 * scale)} -${px(6 * scale)} ${px(16 * scale)} rgba(255, 255, 255, ${a2}), 0 ${px(18 * scale)} ${px(44 * scale)} rgba(15, 23, 42, ${(0.1 * scale).toFixed(2)})`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(12 * scale)} ${px(30 * scale)} rgba(163, 184, 209, ${a1}), inset 0 -1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(12 * scale)} ${px(30 * scale)} rgba(163, 184, 209, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `${px(7 * scale)} ${px(7 * scale)} ${px(16 * scale)} rgba(163, 184, 209, ${(0.24 * scale + 0.04).toFixed(2)}), -${px(6 * scale)} -${px(6 * scale)} ${px(14 * scale)} rgba(255, 255, 255, ${a2})`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `${px(11 * scale)} ${px(12 * scale)} ${px(26 * scale)} rgba(124, 152, 184, ${(0.30 * scale + 0.05).toFixed(2)}), -${px(8 * scale)} -${px(8 * scale)} ${px(18 * scale)} rgba(255, 255, 255, 0.96)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `${px(3 * scale)} ${px(4 * scale)} ${px(10 * scale)} rgba(163, 184, 209, ${aSub}), inset ${px(2 * scale)} ${px(2 * scale)} ${px(6 * scale)} rgba(182, 198, 214, ${(0.26 * scale).toFixed(2)}), inset -${px(2 * scale)} -${px(2 * scale)} ${px(5 * scale)} rgba(255, 255, 255, 0.85)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `${px(6 * scale)} ${px(8 * scale)} ${px(18 * scale)} rgba(124, 152, 184, ${(0.24 * scale + 0.04).toFixed(2)}), -${px(4 * scale)} -${px(4 * scale)} ${px(10 * scale)} rgba(255, 255, 255, 0.92)`
    );
    return;
  }

  if (cardStyle === 'dark-ice-blue-neu') {
    const darkA = Math.min(0.88, 0.45 * scale + 0.1).toFixed(2);
    const glowA = Math.min(0.28, 0.12 * scale).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `${px(10 * scale)} ${px(10 * scale)} ${px(26 * scale)} rgba(6, 11, 20, ${darkA}), -${px(5 * scale)} -${px(5 * scale)} ${px(16 * scale)} rgba(41, 61, 88, ${(0.34 * scale).toFixed(2)}), 0 0 ${px(28 * scale)} rgba(56, 189, 248, ${glowA})`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(14 * scale)} ${px(32 * scale)} rgba(5, 9, 17, ${darkA}), inset 0 -1px 0 rgba(148, 163, 184, 0.22)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(14 * scale)} ${px(32 * scale)} rgba(5, 9, 17, ${darkA}), inset 0 1px 0 rgba(148, 163, 184, 0.22)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `${px(8 * scale)} ${px(8 * scale)} ${px(20 * scale)} rgba(6, 11, 20, ${darkA}), -${px(4 * scale)} -${px(4 * scale)} ${px(12 * scale)} rgba(41, 61, 88, ${(0.30 * scale).toFixed(2)})`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `${px(12 * scale)} ${px(14 * scale)} ${px(30 * scale)} rgba(3, 7, 15, 0.82), 0 0 ${px(22 * scale)} rgba(56, 189, 248, ${(0.20 * scale).toFixed(2)})`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `${px(4 * scale)} ${px(5 * scale)} ${px(12 * scale)} rgba(5, 9, 17, ${(0.42 * scale).toFixed(2)}), inset ${px(2 * scale)} ${px(2 * scale)} ${px(6 * scale)} rgba(6, 11, 20, ${(0.55 * scale).toFixed(2)}), inset -1px -1px 4px rgba(51, 75, 108, 0.24)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `${px(7 * scale)} ${px(9 * scale)} ${px(20 * scale)} rgba(4, 8, 16, 0.72), 0 0 ${px(14 * scale)} rgba(56, 189, 248, ${(0.18 * scale).toFixed(2)})`
    );
    return;
  }

  if (cardStyle === 'rainbow-glass') {
    const a1 = Math.min(0.24, 0.14 * scale).toFixed(2);
    const a2 = Math.min(0.20, 0.10 * scale).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(18 * scale)} ${px(40 * scale)} rgba(50, 40, 80, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.65)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(10 * scale)} ${px(28 * scale)} rgba(50, 40, 80, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.68)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(10 * scale)} ${px(28 * scale)} rgba(50, 40, 80, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.68)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(12 * scale)} ${px(28 * scale)} rgba(50, 40, 80, ${(0.09 * scale + 0.02).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.72)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(18 * scale)} ${px(38 * scale)} rgba(50, 40, 80, ${(0.15 * scale + 0.02).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.85)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(50, 40, 80, ${(0.06 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.68)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(10 * scale)} ${px(22 * scale)} rgba(50, 40, 80, ${(0.11 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.80)`
    );
    return;
  }

  if (cardStyle === 'dark-rainbow-glass' || cardStyle === 'special-rainbow-glass') {
    const a1 = Math.min(0.48, 0.32 * scale).toFixed(2);
    const a2 = Math.min(0.36, 0.24 * scale).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(18 * scale)} ${px(40 * scale)} rgba(0, 0, 0, ${a1}), inset 0 1px 0 rgba(225, 235, 255, 0.14)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(12 * scale)} ${px(30 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1px 0 rgba(225, 235, 255, 0.16)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(12 * scale)} ${px(30 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1px 0 rgba(225, 235, 255, 0.16)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(10 * scale)} ${px(26 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1px 0 rgba(225, 235, 255, 0.14)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(16 * scale)} ${px(36 * scale)} rgba(0, 0, 0, ${a1}), inset 0 1px 0 rgba(194, 183, 243, 0.26)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(0, 0, 0, ${(0.20 * scale).toFixed(2)}), inset 0 1px 0 rgba(225, 235, 255, 0.10)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(10 * scale)} ${px(22 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1px 0 rgba(194, 183, 243, 0.20)`
    );
    return;
  }

  // Leather & general themes
  if (isDarkTheme && !isIceNeu) {
    const a1 = Math.min(0.92, 0.56 * scale + 0.12).toFixed(2);
    const a2 = Math.min(0.68, 0.36 * scale + 0.08).toFixed(2);
    const warmRim = cardStyle === 'cowhide-leather' ? 'rgba(255, 220, 180, 0.20)' : 'rgba(255, 255, 255, 0.16)';
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(22 * scale)} ${px(48 * scale)} -${px(6 * scale)} rgba(0, 0, 0, ${a1}), inset 0 1.5px 3px ${warmRim}`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(16 * scale)} ${px(36 * scale)} rgba(0, 0, 0, ${a1}), inset 0 1px 2px ${warmRim}`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(16 * scale)} ${px(36 * scale)} rgba(0, 0, 0, ${a1}), inset 0 1px 2px ${warmRim}`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(14 * scale)} ${px(28 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1.5px 3px ${warmRim}, inset 0 -2px 4px rgba(0, 0, 0, 0.55)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(22 * scale)} ${px(42 * scale)} rgba(0, 0, 0, ${a1}), inset 0 2px 4px ${warmRim}, inset 0 -2px 5px rgba(0, 0, 0, 0.65)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(8 * scale)} ${px(18 * scale)} rgba(0, 0, 0, ${(0.38 * scale).toFixed(2)}), inset 0 1px 2px ${warmRim}`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(13 * scale)} ${px(26 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1.5px 3px ${warmRim}`
    );
    return;
  }

  // Light Cowhide Leather
  const la1 = Math.min(0.28, 0.14 * scale + 0.03).toFixed(2);
  const la2 = Math.min(0.18, 0.08 * scale + 0.02).toFixed(2);
  root.style.setProperty(
    '--layer-l1-shadow',
    `0 ${px(20 * scale)} ${px(46 * scale)} -${px(8 * scale)} rgba(15, 23, 42, ${la1}), 0 ${px(6 * scale)} ${px(16 * scale)} rgba(15, 23, 42, ${la2})`
  );
  root.style.setProperty(
    '--layer-l1-header-shadow',
    `0 ${px(14 * scale)} ${px(32 * scale)} -${px(6 * scale)} rgba(15, 23, 42, ${la1})`
  );
  root.style.setProperty(
    '--layer-l1-footer-shadow',
    `0 -${px(14 * scale)} ${px(32 * scale)} -${px(6 * scale)} rgba(15, 23, 42, ${la1})`
  );
  root.style.setProperty(
    '--layer-l2-shadow',
    `0 ${px(12 * scale)} ${px(26 * scale)} -${px(4 * scale)} rgba(15, 23, 42, ${la1}), inset 0 1px 2px rgba(255, 255, 255, 0.92)`
  );
  root.style.setProperty(
    '--layer-l2-shadow-hover',
    `0 ${px(18 * scale)} ${px(38 * scale)} -${px(4 * scale)} rgba(15, 23, 42, ${Math.min(0.34, 0.20 * scale + 0.03).toFixed(2)}), inset 0 1.5px 3px #ffffff`
  );
  root.style.setProperty(
    '--layer-l3-shadow',
    `0 ${px(6 * scale)} ${px(14 * scale)} -${px(2 * scale)} rgba(15, 23, 42, ${la2}), inset 0 1px 1px rgba(255, 255, 255, 0.90)`
  );
  root.style.setProperty(
    '--layer-l3-shadow-hover',
    `0 ${px(11 * scale)} ${px(22 * scale)} -${px(3 * scale)} rgba(15, 23, 42, ${la1}), inset 0 1.5px 2px #ffffff`
  );
}

export function applyFontScaleCssVariables(scale: FontScaleMode): void {
  if (typeof document === 'undefined') return;
  const normalized = normalizeFontScale(scale);
  const mult = getFontScaleMultiplier(normalized);
  const root = document.documentElement;
  root.setAttribute('data-font-scale', normalized);
  root.style.setProperty('--font-scale', String(mult));
  if (document.body) {
    document.body.setAttribute('data-font-scale', normalized);
  }
}
