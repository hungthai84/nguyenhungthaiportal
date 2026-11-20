import { CardStyleMode } from './theme.types';

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

export function clampLayerDepth(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 100;
  return Math.max(0, Math.min(200, Math.round(num)));
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
    cardStyle === 'dark-ice-blue-neu' ||
    cardStyle === 'black-cowhide-leather' ||
    cardStyle === 'cowhide-leather' ||
    cardStyle === 'dark-rainbow-glass' ||
    cardStyle === 'special-rainbow-glass' ||
    cardStyle === 'deep-ocean';
  const isIceNeu = cardStyle === 'ice-blue-neu' || cardStyle === 'dark-ice-blue-neu';

  // Hover lift per level: restrained max 3px lift
  const l2Lift = -Math.max(1.5, Math.min(3, Math.round(3 * scale * 10) / 10));
  const l3Lift = -Math.max(1, Math.min(2, Math.round(2 * scale * 10) / 10));

  root.style.setProperty('--layer-l2-lift', `${l2Lift}px`);
  root.style.setProperty('--layer-l3-lift', `${l3Lift}px`);

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
      `${px(7 * scale)} ${px(7 * scale)} ${px(16 * scale)} rgba(163, 184, 209, ${(0.24 * scale + 0.04).toFixed(2)}), -${px(6 * scale)} -${px(6 * scale)} ${px(14 * scale)} rgba(255, 255, 255, ${a2})`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `${px(3 * scale)} ${px(4 * scale)} ${px(10 * scale)} rgba(163, 184, 209, ${aSub}), inset ${px(2 * scale)} ${px(2 * scale)} ${px(6 * scale)} rgba(182, 198, 214, ${(0.26 * scale).toFixed(2)}), inset -${px(2 * scale)} -${px(2 * scale)} ${px(5 * scale)} rgba(255, 255, 255, 0.85)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `${px(3 * scale)} ${px(4 * scale)} ${px(10 * scale)} rgba(163, 184, 209, ${aSub}), inset ${px(2 * scale)} ${px(2 * scale)} ${px(6 * scale)} rgba(182, 198, 214, ${(0.26 * scale).toFixed(2)}), inset -${px(2 * scale)} -${px(2 * scale)} ${px(5 * scale)} rgba(255, 255, 255, 0.85)`
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
      `${px(8 * scale)} ${px(8 * scale)} ${px(20 * scale)} rgba(6, 11, 20, ${darkA}), -${px(4 * scale)} -${px(4 * scale)} ${px(12 * scale)} rgba(41, 61, 88, ${(0.30 * scale).toFixed(2)})`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `${px(4 * scale)} ${px(5 * scale)} ${px(12 * scale)} rgba(5, 9, 17, ${(0.42 * scale).toFixed(2)}), inset ${px(2 * scale)} ${px(2 * scale)} ${px(6 * scale)} rgba(6, 11, 20, ${(0.55 * scale).toFixed(2)}), inset -1px -1px 4px rgba(51, 75, 108, 0.24)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `${px(4 * scale)} ${px(5 * scale)} ${px(12 * scale)} rgba(5, 9, 17, ${(0.42 * scale).toFixed(2)}), inset ${px(2 * scale)} ${px(2 * scale)} ${px(6 * scale)} rgba(6, 11, 20, ${(0.55 * scale).toFixed(2)}), inset -1px -1px 4px rgba(51, 75, 108, 0.24)`
    );
    return;
  }

  if (cardStyle === 'deep-ocean') {
    const a1 = Math.min(0.84, 0.56 * scale + 0.14).toFixed(2);
    const a2 = Math.min(0.68, 0.42 * scale + 0.10).toFixed(2);
    const glow = Math.min(0.32, 0.16 * scale).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(20 * scale)} ${px(44 * scale)} rgba(2, 6, 16, ${a1}), 0 0 ${px(26 * scale)} rgba(6, 182, 212, ${glow}), inset 0 1px 0 rgba(56, 189, 248, 0.22)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(12 * scale)} ${px(32 * scale)} rgba(2, 6, 16, ${a2}), inset 0 -1px 0 rgba(56, 189, 248, 0.24)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(12 * scale)} ${px(32 * scale)} rgba(2, 6, 16, ${a2}), inset 0 1px 0 rgba(56, 189, 248, 0.24)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(14 * scale)} ${px(32 * scale)} rgba(2, 6, 16, ${a2}), inset 0 1px 0 rgba(56, 189, 248, 0.20)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(14 * scale)} ${px(32 * scale)} rgba(2, 6, 16, ${a2}), inset 0 1px 0 rgba(56, 189, 248, 0.20)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(8 * scale)} ${px(18 * scale)} rgba(2, 6, 16, ${(0.42 * scale).toFixed(2)}), inset 0 1px 0 rgba(56, 189, 248, 0.14)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(8 * scale)} ${px(18 * scale)} rgba(2, 6, 16, ${(0.42 * scale).toFixed(2)}), inset 0 1px 0 rgba(56, 189, 248, 0.14)`
    );
    return;
  }

  if (cardStyle === 'mica-fluent') {
    const a1 = Math.min(0.18, 0.10 * scale + 0.02).toFixed(2);
    const a2 = Math.min(0.14, 0.07 * scale + 0.02).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(16 * scale)} ${px(40 * scale)} rgba(15, 23, 42, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.90)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(8 * scale)} ${px(24 * scale)} rgba(15, 23, 42, ${a2}), inset 0 -1px 0 rgba(0, 0, 0, 0.06)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(8 * scale)} ${px(24 * scale)} rgba(15, 23, 42, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.85)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(8 * scale)} ${px(24 * scale)} rgba(15, 23, 42, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(8 * scale)} ${px(24 * scale)} rgba(15, 23, 42, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(4 * scale)} ${px(14 * scale)} rgba(15, 23, 42, ${(0.05 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.82)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(4 * scale)} ${px(14 * scale)} rgba(15, 23, 42, ${(0.05 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.82)`
    );
    return;
  }

  if (cardStyle === 'glass-flat') {
    const a1 = Math.min(0.16, 0.09 * scale + 0.02).toFixed(2);
    const a2 = Math.min(0.18, 0.11 * scale + 0.02).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(14 * scale)} ${px(34 * scale)} -${px(6 * scale)} rgba(15, 23, 42, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(8 * scale)} ${px(22 * scale)} rgba(14, 165, 233, ${a1})`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(8 * scale)} ${px(22 * scale)} rgba(14, 165, 233, ${a1})`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(8 * scale)} ${px(24 * scale)} -${px(4 * scale)} rgba(15, 23, 42, ${a1})`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(8 * scale)} ${px(24 * scale)} -${px(4 * scale)} rgba(15, 23, 42, ${a1})`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(4 * scale)} ${px(12 * scale)} rgba(15, 23, 42, ${(0.05 * scale + 0.01).toFixed(2)})`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(4 * scale)} ${px(12 * scale)} rgba(15, 23, 42, ${(0.05 * scale + 0.01).toFixed(2)})`
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
      `0 ${px(12 * scale)} ${px(28 * scale)} rgba(50, 40, 80, ${(0.09 * scale + 0.02).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.72)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(50, 40, 80, ${(0.06 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.68)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(50, 40, 80, ${(0.06 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.68)`
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
      `0 ${px(10 * scale)} ${px(26 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1px 0 rgba(225, 235, 255, 0.14)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(0, 0, 0, ${(0.20 * scale).toFixed(2)}), inset 0 1px 0 rgba(225, 235, 255, 0.10)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(0, 0, 0, ${(0.20 * scale).toFixed(2)}), inset 0 1px 0 rgba(225, 235, 255, 0.10)`
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
      `0 ${px(14 * scale)} ${px(28 * scale)} rgba(0, 0, 0, ${a2}), inset 0 1.5px 3px ${warmRim}, inset 0 -2px 4px rgba(0, 0, 0, 0.55)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(8 * scale)} ${px(18 * scale)} rgba(0, 0, 0, ${(0.38 * scale).toFixed(2)}), inset 0 1px 2px ${warmRim}`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(8 * scale)} ${px(18 * scale)} rgba(0, 0, 0, ${(0.38 * scale).toFixed(2)}), inset 0 1px 2px ${warmRim}`
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
    `0 ${px(12 * scale)} ${px(26 * scale)} -${px(4 * scale)} rgba(15, 23, 42, ${la1}), inset 0 1px 2px rgba(255, 255, 255, 0.92)`
  );
  root.style.setProperty(
    '--layer-l3-shadow',
    `0 ${px(6 * scale)} ${px(14 * scale)} -${px(2 * scale)} rgba(15, 23, 42, ${la2}), inset 0 1px 1px rgba(255, 255, 255, 0.90)`
  );
  root.style.setProperty(
    '--layer-l3-shadow-hover',
    `0 ${px(6 * scale)} ${px(14 * scale)} -${px(2 * scale)} rgba(15, 23, 42, ${la2}), inset 0 1px 1px rgba(255, 255, 255, 0.90)`
  );
}
