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
    cardStyle === 'dark-soft-indigo-fintech' ||
    cardStyle === 'dark-liquid-glass' ||
    cardStyle === 'cowhide-leather' ||
    cardStyle === 'deep-ocean';

  // Hover lift per level: restrained max 3px lift
  const l2Lift = -Math.max(1.5, Math.min(3, Math.round(3 * scale * 10) / 10));
  const l3Lift = -Math.max(1, Math.min(2, Math.round(2 * scale * 10) / 10));

  root.style.setProperty('--layer-l2-lift', `${l2Lift}px`);
  root.style.setProperty('--layer-l3-lift', `${l3Lift}px`);

  if (cardStyle === 'soft-indigo-fintech') {
    const a1 = Math.min(0.18, 0.10 * scale + 0.03).toFixed(2);
    const a2 = Math.min(0.16, 0.09 * scale + 0.03).toFixed(2);
    const aHover = Math.min(0.24, 0.14 * scale + 0.04).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(16 * scale)} ${px(40 * scale)} -${px(10 * scale)} rgba(94, 72, 232, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.96)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(8 * scale)} ${px(24 * scale)} rgba(94, 72, 232, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.94)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(8 * scale)} ${px(24 * scale)} rgba(94, 72, 232, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.94)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(10 * scale)} ${px(26 * scale)} -${px(6 * scale)} rgba(94, 72, 232, ${a2}), ${px(4 * scale)} 0 0 -${px(1 * scale)} rgba(165, 180, 252, 0.45)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(16 * scale)} ${px(34 * scale)} -${px(6 * scale)} rgba(94, 72, 232, ${aHover}), ${px(5 * scale)} 0 0 -${px(1 * scale)} rgba(94, 72, 232, 0.28)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(5 * scale)} ${px(14 * scale)} -${px(4 * scale)} rgba(94, 72, 232, ${(0.07 * scale + 0.02).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(9 * scale)} ${px(20 * scale)} -${px(4 * scale)} rgba(94, 72, 232, ${(0.11 * scale + 0.03).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.96)`
    );
    return;
  }

  if (cardStyle === 'dark-soft-indigo-fintech') {
    const a1 = Math.min(0.65, 0.42 * scale + 0.10).toFixed(2);
    const a2 = Math.min(0.50, 0.30 * scale + 0.08).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(18 * scale)} ${px(44 * scale)} -${px(10 * scale)} rgba(4, 7, 20, ${a1}), 0 0 ${px(22 * scale)} rgba(108, 76, 230, 0.14), inset 0 1px 0 rgba(165, 180, 252, 0.16)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(10 * scale)} ${px(26 * scale)} rgba(4, 7, 20, ${a2}), inset 0 1px 0 rgba(165, 180, 252, 0.14)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(10 * scale)} ${px(26 * scale)} rgba(4, 7, 20, ${a2}), inset 0 1px 0 rgba(165, 180, 252, 0.14)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(12 * scale)} ${px(28 * scale)} -${px(6 * scale)} rgba(4, 7, 20, ${a2}), ${px(4 * scale)} 0 0 -${px(1 * scale)} rgba(108, 76, 230, 0.34)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(16 * scale)} ${px(36 * scale)} -${px(6 * scale)} rgba(4, 7, 20, ${a1}), 0 ${px(8 * scale)} ${px(24 * scale)} rgba(108, 76, 230, 0.24), ${px(5 * scale)} 0 0 -${px(1 * scale)} rgba(139, 123, 255, 0.44)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} -${px(4 * scale)} rgba(4, 7, 20, ${(0.30 * scale).toFixed(2)}), inset 0 1px 0 rgba(165, 180, 252, 0.10)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(10 * scale)} ${px(22 * scale)} -${px(4 * scale)} rgba(4, 7, 20, ${(0.40 * scale).toFixed(2)}), inset 0 1px 0 rgba(165, 180, 252, 0.18)`
    );
    return;
  }

  if (cardStyle === 'liquid-glass' || cardStyle === 'multicolor-glass') {
    const isMulticolor = cardStyle === 'multicolor-glass';
    const shadowRgb = isMulticolor ? '79, 70, 229' : '30, 41, 59';
    const a1 = Math.min(0.22, 0.12 * scale + 0.03).toFixed(2);
    const a2 = Math.min(0.16, 0.08 * scale + 0.02).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(20 * scale)} ${px(46 * scale)} -${px(10 * scale)} rgba(${shadowRgb}, ${a1}), inset 0 1.5px 0 rgba(255, 255, 255, 0.94)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(10 * scale)} ${px(28 * scale)} rgba(${shadowRgb}, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(10 * scale)} ${px(28 * scale)} rgba(${shadowRgb}, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(12 * scale)} ${px(28 * scale)} -${px(6 * scale)} rgba(${shadowRgb}, ${(0.09 * scale + 0.02).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.92)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(16 * scale)} ${px(34 * scale)} -${px(8 * scale)} rgba(${shadowRgb}, ${(0.12 * scale + 0.03).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.98)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} -${px(4 * scale)} rgba(${shadowRgb}, ${(0.06 * scale + 0.01).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.88)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(8 * scale)} ${px(20 * scale)} -${px(4 * scale)} rgba(${shadowRgb}, ${(0.09 * scale + 0.02).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.95)`
    );
    return;
  }

  if (cardStyle === 'dark-liquid-glass') {
    const a1 = Math.min(0.68, 0.44 * scale + 0.12).toFixed(2);
    const a2 = Math.min(0.52, 0.34 * scale + 0.08).toFixed(2);
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(22 * scale)} ${px(48 * scale)} -${px(10 * scale)} rgba(2, 6, 23, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.22)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(12 * scale)} ${px(30 * scale)} rgba(2, 6, 23, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.20)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(12 * scale)} ${px(30 * scale)} rgba(2, 6, 23, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.20)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(12 * scale)} ${px(28 * scale)} -${px(6 * scale)} rgba(2, 6, 23, ${a2}), inset 0 1px 0 rgba(255, 255, 255, 0.14)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(16 * scale)} ${px(34 * scale)} -${px(6 * scale)} rgba(2, 6, 23, ${a1}), inset 0 1px 0 rgba(255, 255, 255, 0.22)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} -${px(4 * scale)} rgba(2, 6, 23, ${(0.28 * scale).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.10)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(8 * scale)} ${px(20 * scale)} -${px(4 * scale)} rgba(2, 6, 23, ${(0.36 * scale).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.16)`
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

  if (cardStyle === 'neumorphism-beyond') {
    const slateAlpha = Math.min(0.36, 0.20 * scale + 0.06).toFixed(2);
    const ambientAlpha = Math.min(0.24, 0.13 * scale + 0.04).toFixed(2);
    const l1Dist = 8 * scale;
    const l1Blur = 20 * scale;
    const l2Dist = 5 * scale;
    const l2Blur = 14 * scale;
    const l3Dist = 3.5 * scale;
    const l3Blur = 10 * scale;
    root.style.setProperty(
      '--layer-l1-shadow',
      `0 ${px(l1Dist * 1.1)} ${px(l1Blur)} rgba(148, 163, 184, ${ambientAlpha}), ${px(l1Dist * 0.55)} ${px(l1Dist * 0.65)} ${px(l1Blur * 0.75)} rgba(163, 177, 198, ${slateAlpha}), inset 0 1px 0 rgba(255, 255, 255, 0.36)`
    );
    root.style.setProperty(
      '--layer-l1-header-shadow',
      `0 ${px(6 * scale)} ${px(16 * scale)} rgba(148, 163, 184, ${ambientAlpha}), inset 0 1px 0 rgba(255, 255, 255, 0.34)`
    );
    root.style.setProperty(
      '--layer-l1-footer-shadow',
      `0 -${px(6 * scale)} ${px(16 * scale)} rgba(148, 163, 184, ${ambientAlpha}), inset 0 1px 0 rgba(255, 255, 255, 0.34)`
    );
    root.style.setProperty(
      '--layer-l2-shadow',
      `0 ${px(l2Dist)} ${px(l2Blur)} rgba(148, 163, 184, ${ambientAlpha}), ${px(l2Dist * 0.55)} ${px(l2Dist * 0.65)} ${px(l2Blur * 0.75)} rgba(163, 177, 198, ${slateAlpha}), inset 0 1px 0 rgba(255, 255, 255, 0.34)`
    );
    root.style.setProperty(
      '--layer-l2-shadow-hover',
      `0 ${px(l2Dist * 1.15)} ${px(l2Blur * 1.1)} rgba(148, 163, 184, ${ambientAlpha}), ${px(l2Dist * 0.6)} ${px(l2Dist * 0.7)} ${px(l2Blur * 0.8)} rgba(163, 177, 198, ${slateAlpha}), inset 0 1px 0 rgba(255, 255, 255, 0.40)`
    );
    root.style.setProperty(
      '--layer-l3-shadow',
      `0 ${px(l3Dist)} ${px(l3Blur)} rgba(148, 163, 184, ${(0.11 * scale + 0.04).toFixed(2)}), ${px(l3Dist * 0.5)} ${px(l3Dist * 0.6)} ${px(l3Blur * 0.7)} rgba(163, 177, 198, ${(0.18 * scale + 0.05).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.30)`
    );
    root.style.setProperty(
      '--layer-l3-shadow-hover',
      `0 ${px(l3Dist * 1.1)} ${px(l3Blur * 1.1)} rgba(148, 163, 184, ${(0.13 * scale + 0.04).toFixed(2)}), ${px(l3Dist * 0.55)} ${px(l3Dist * 0.65)} ${px(l3Blur * 0.75)} rgba(163, 177, 198, ${(0.20 * scale + 0.06).toFixed(2)}), inset 0 1px 0 rgba(255, 255, 255, 0.36)`
    );
    return;
  }

  // Cowhide Leather & general fallback
  if (isDarkTheme) {
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
  }
}
