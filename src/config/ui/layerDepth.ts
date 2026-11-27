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

export const THEME_LAYER_DEPTH_MAP: Record<CardStyleMode, number> = {
  'liquid-glass': 100,
  'dark-liquid-glass': 100,
  'cowhide-leather': 100,
  'dark-cowhide-leather': 100,
  'walnut-wood': 100,
  'deep-ocean': 100,
  'light-deep-ocean': 100,
  'neumorphism-beyond': 100,
  'dark-neumorphism-beyond': 100,
  'frost-ice-neu': 100,
  'dark-frost-ice-neu': 100,
  'multicolor-glass': 100,
  'dark-neon-glass': 100,
  'flat-soft-ui': 100,
  'dark-flat-soft-ui': 100,
  'mica-fluent': 100,
  'gradient-dopamine': 100,
  'dark-luxury': 100,
  'minimalism': 100,
};

export function getLayerDepthForTheme(styleId: CardStyleMode): number {
  return THEME_LAYER_DEPTH_MAP[styleId] ?? 100;
}

export function clampLayerDepth(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 100;
  return Math.max(0, Math.min(200, Math.round(num)));
}

export function applyLayerDepthCssVariables(depthRaw: number, _cardStyle: CardStyleMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const depth = clampLayerDepth(depthRaw);
  const surfaceMode = depth === 0 ? 'flat' : 'depth';

  root.setAttribute('data-layer-depth', String(depth));
  root.setAttribute('data-surface-depth', surfaceMode);
  if (document.body) {
    document.body.setAttribute('data-layer-depth', String(depth));
    document.body.setAttribute('data-surface-depth', surfaceMode);
  }

  if (depth === 0) {
    root.style.setProperty('--layer-depth-scale', '0.00');
    root.style.setProperty('--elevation-primary-surface', 'none');
    root.style.setProperty('--elevation-primary-surface-hover', 'none');
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

  const scale = depth / 100;
  const l2Lift = (-3 * Math.min(scale, 1.5)).toFixed(2);
  const l3Lift = (-1.5 * Math.min(scale, 1.5)).toFixed(2);

  root.style.removeProperty('--elevation-primary-surface');
  root.style.removeProperty('--elevation-primary-surface-hover');
  root.style.setProperty('--layer-depth-scale', scale.toFixed(2));
  root.style.setProperty('--layer-l1-shadow', 'var(--elevation-primary-surface, var(--surface-primary-shadow, var(--shadow-card)))');
  root.style.setProperty('--layer-l1-header-shadow', 'var(--elevation-primary-surface, var(--surface-primary-shadow, var(--shadow-card)))');
  root.style.setProperty('--layer-l1-footer-shadow', 'var(--elevation-primary-surface, var(--surface-primary-shadow, var(--shadow-card)))');
  root.style.setProperty('--layer-l2-shadow', 'var(--surface-secondary-shadow, var(--shadow-card))');
  root.style.setProperty('--layer-l2-shadow-hover', 'var(--shadow-card-hover, var(--surface-secondary-shadow, var(--shadow-card)))');
  root.style.setProperty('--layer-l2-lift', `${l2Lift}px`);
  root.style.setProperty('--layer-l3-shadow', 'var(--shadow-subcard, var(--surface-nested-shadow, var(--shadow-card)))');
  root.style.setProperty('--layer-l3-shadow-hover', 'var(--shadow-subcard-hover, var(--shadow-card-hover))');
  root.style.setProperty('--layer-l3-lift', `${l3Lift}px`);
}
