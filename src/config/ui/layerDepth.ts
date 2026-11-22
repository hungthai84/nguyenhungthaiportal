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
  'liquid-glass': 0,
  'dark-liquid-glass': 0,
  'cowhide-leather': 0,
  'black-cowhide-leather': 0,
  'deep-ocean': 0,
  'light-deep-ocean': 0,
  'neumorphism-beyond': 0,
  'dark-neumorphism-beyond': 0,
  'frost-ice-neu': 0,
  'dark-frost-ice-neu': 0,
  'multicolor-glass': 0,
  'dark-neon-glass': 0,
};

export function getLayerDepthForTheme(_styleId: CardStyleMode): number {
  return 0;
}

export function clampLayerDepth(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(num)) return 0;
  return Math.max(0, Math.min(200, Math.round(num)));
}

export function applyLayerDepthCssVariables(_depthRaw: number, _cardStyle: CardStyleMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.setAttribute('data-layer-depth', '0');
  root.setAttribute('data-surface-depth', 'flat');
  if (document.body) {
    document.body.setAttribute('data-layer-depth', '0');
    document.body.setAttribute('data-surface-depth', 'flat');
  }

  root.style.setProperty('--layer-depth-scale', '0.00');
  root.style.setProperty('--layer-l1-shadow', 'none');
  root.style.setProperty('--layer-l1-header-shadow', 'none');
  root.style.setProperty('--layer-l1-footer-shadow', 'none');
  root.style.setProperty('--layer-l2-shadow', 'none');
  root.style.setProperty('--layer-l2-shadow-hover', 'none');
  root.style.setProperty('--layer-l2-lift', '0px');
  root.style.setProperty('--layer-l3-shadow', 'none');
  root.style.setProperty('--layer-l3-shadow-hover', 'none');
  root.style.setProperty('--layer-l3-lift', '0px');
}
