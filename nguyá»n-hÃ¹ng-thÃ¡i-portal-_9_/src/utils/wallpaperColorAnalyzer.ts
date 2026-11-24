import { AdaptiveAccentPalette } from '@/config/ui/theme.types';
import { WallpaperPreset, getCleanImageUrl, getWallpaperThumbnailUrl } from '@/data/wallpapers';

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [clampByte(r), clampByte(g), clampByte(b)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

function hexToRgb(hex: string): RgbColor | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }
  if (clean.length === 6 || clean.length === 8) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }
  return null;
}

function relativeLuminance({ r, g, b }: RgbColor): number {
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

function colorSaturation({ r, g, b }: RgbColor): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === min) return 0;
  const l = (max + min) / 2;
  const d = max - min;
  return l > 0.5 ? d / (2 - max - min) : d / (max + min);
}

function adjustBrightness({ r, g, b }: RgbColor, factor: number): RgbColor {
  return {
    r: clampByte(r * factor),
    g: clampByte(g * factor),
    b: clampByte(b * factor),
  };
}

function mixColors(a: RgbColor, b: RgbColor, weightB: number): RgbColor {
  const w = Math.max(0, Math.min(1, weightB));
  return {
    r: clampByte(a.r * (1 - w) + b.r * w),
    g: clampByte(a.g * (1 - w) + b.g * w),
    b: clampByte(a.b * (1 - w) + b.b * w),
  };
}

function extractColorsFromCssString(input: string): RgbColor[] {
  const found: RgbColor[] = [];
  if (!input) return found;

  const hexMatches = input.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  for (const hex of hexMatches) {
    const parsed = hexToRgb(hex);
    if (parsed) found.push(parsed);
  }

  const rgbMatches = input.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi) || [];
  for (const m of rgbMatches) {
    const nums = m.match(/\d+/g);
    if (nums && nums.length >= 3) {
      found.push({
        r: clampByte(Number(nums[0])),
        g: clampByte(Number(nums[1])),
        b: clampByte(Number(nums[2])),
      });
    }
  }

  return found;
}

function buildPaletteFromSwatches(
  swatchesRgb: RgbColor[],
  avgLuminance: number
): AdaptiveAccentPalette {
  const valid = swatchesRgb.length > 0 ? swatchesRgb : [{ r: 79, g: 70, b: 229 }];
  // Pick most vibrant non-gray color for primary
  const sortedByVibrancy = [...valid].sort((a, b) => {
    const lumA = relativeLuminance(a);
    const lumB = relativeLuminance(b);
    const scoreA = colorSaturation(a) * (lumA > 0.04 && lumA < 0.92 ? 1.5 : 0.4);
    const scoreB = colorSaturation(b) * (lumB > 0.04 && lumB < 0.92 ? 1.5 : 0.4);
    return scoreB - scoreA;
  });

  const primaryRgb = sortedByVibrancy[0];
  const secondaryRgb = sortedByVibrancy[1] || adjustBrightness(primaryRgb, 1.22);

  // Calibrate primary so it stays punchy & accessible on buttons
  const pLum = relativeLuminance(primaryRgb);
  let buttonStart = primaryRgb;
  if (pLum > 0.72) {
    buttonStart = mixColors(primaryRgb, { r: 30, g: 41, b: 59 }, 0.35);
  } else if (pLum < 0.08) {
    buttonStart = mixColors(primaryRgb, { r: 99, g: 102, b: 241 }, 0.4);
  }

  const buttonEnd = mixColors(secondaryRgb, { r: 255, g: 255, b: 255 }, 0.14);
  const primaryHex = rgbToHex(buttonStart.r, buttonStart.g, buttonStart.b);
  const secondaryHex = rgbToHex(buttonEnd.r, buttonEnd.g, buttonEnd.b);

  // Determine recommended dark/light mode from background luminance
  const recommendedDark = avgLuminance < 0.46;

  // Link/text accent calibrated for good contrast
  const linkRgb = recommendedDark
    ? mixColors(buttonStart, { r: 248, g: 250, b: 252 }, 0.32)
    : mixColors(buttonStart, { r: 15, g: 23, b: 42 }, 0.22);
  const linkHex = rgbToHex(linkRgb.r, linkRgb.g, linkRgb.b);

  const uniqueSwatches = Array.from(
    new Set(
      sortedByVibrancy.slice(0, 4).map((c) => rgbToHex(c.r, c.g, c.b))
    )
  ).slice(0, 3);
  while (uniqueSwatches.length < 3) {
    uniqueSwatches.push(uniqueSwatches.length === 1 ? secondaryHex : linkHex);
  }

  return {
    primary: primaryHex,
    link: linkHex,
    gradient: `linear-gradient(135deg, ${primaryHex} 0%, ${secondaryHex} 100%)`,
    rgb: `${buttonStart.r}, ${buttonStart.g}, ${buttonStart.b}`,
    recommendedDark,
    contrastLabelVi: recommendedDark
      ? 'Nền tối · Gợi ý chữ sáng & nhấn nổi'
      : 'Nền sáng · Gợi ý chữ tối & nhấn đậm',
    contrastLabelEn: recommendedDark
      ? 'Dark backdrop · Light text & bright accent'
      : 'Light backdrop · Deep text & crisp accent',
    swatches: uniqueSwatches,
  };
}

const CURATED_PALETTES: RgbColor[][] = [
  [{ r: 37, g: 99, b: 235 }, { r: 14, g: 165, b: 233 }, { r: 79, g: 70, b: 229 }],
  [{ r: 13, g: 148, b: 136 }, { r: 56, g: 189, b: 248 }, { r: 16, g: 185, b: 129 }],
  [{ r: 225, g: 29, b: 72 }, { r: 249, g: 115, b: 22 }, { r: 168, g: 85, b: 247 }],
  [{ r: 124, g: 58, b: 237 }, { r: 236, g: 72, b: 153 }, { r: 59, g: 130, b: 246 }],
  [{ r: 217, g: 119, b: 6 }, { r: 245, g: 158, b: 11 }, { r: 180, g: 83, b: 9 }],
];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getInstantWallpaperAccent(wp: WallpaperPreset): AdaptiveAccentPalette {
  if (!wp || wp.id === 'none') {
    return buildPaletteFromSwatches(CURATED_PALETTES[0], 0.85);
  }

  if (wp.type === 'webgl' && wp.gravityConfig) {
    const colors: RgbColor[] = [];
    const candidates = [
      wp.gravityConfig.swatchColor,
      wp.gravityConfig.secondaryColor,
      ...(wp.gravityConfig.previewSpheres || []),
    ];
    for (const c of candidates) {
      const parsed = c ? hexToRgb(c) : null;
      if (parsed) colors.push(parsed);
    }
    const bgCss = String(wp.previewStyle?.background || wp.value || '');
    const bgColors = extractColorsFromCssString(bgCss);
    const avgLum =
      bgColors.length > 0
        ? bgColors.reduce((sum, c) => sum + relativeLuminance(c), 0) / bgColors.length
        : 0.7;
    return buildPaletteFromSwatches(colors.length > 0 ? colors : CURATED_PALETTES[0], avgLum);
  }

  if (wp.type === 'css' || wp.type === 'gradient') {
    const cssSource = [
      wp.value,
      wp.bg,
      wp.previewStyle?.background,
      wp.previewStyle?.backgroundColor,
      wp.previewStyle?.backgroundImage,
    ]
      .filter(Boolean)
      .join(' ');
    const colors = extractColorsFromCssString(cssSource);
    const avgLum =
      colors.length > 0
        ? colors.reduce((sum, c) => sum + relativeLuminance(c), 0) / colors.length
        : 0.5;
    return buildPaletteFromSwatches(colors.length > 0 ? colors : CURATED_PALETTES[3], avgLum);
  }

  // Fallback by semantic name + deterministic hash while image loads
  const lower = `${wp.id} ${wp.name}`.toLowerCase();
  let paletteIdx = hashString(wp.id) % CURATED_PALETTES.length;
  let estLum = 0.38;

  if (lower.includes('minimal') || lower.includes('trắng') || lower.includes('light') || lower.includes('sáng') || lower.includes('mica')) {
    estLum = 0.78;
    paletteIdx = 0;
  } else if (lower.includes('da bò') || lower.includes('leather') || lower.includes('vàng') || lower.includes('sunset')) {
    estLum = 0.25;
    paletteIdx = 4;
  } else if (lower.includes('ocean') || lower.includes('blue') || lower.includes('xanh') || lower.includes('arctic')) {
    estLum = 0.28;
    paletteIdx = 0;
  } else if (lower.includes('emerald') || lower.includes('lục') || lower.includes('lake') || lower.includes('aurora')) {
    estLum = 0.3;
    paletteIdx = 1;
  } else if (lower.includes('cyber') || lower.includes('space') || lower.includes('dark') || lower.includes('tối')) {
    estLum = 0.16;
    paletteIdx = 3;
  }

  return buildPaletteFromSwatches(CURATED_PALETTES[paletteIdx], estLum);
}

function sampleImagePixels(srcUrl: string): Promise<{ swatches: RgbColor[]; avgLuminance: number } | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !srcUrl) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    let settled = false;
    const timeout = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, 2600);

    img.onload = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const size = 24;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let lumSum = 0;
        let pixelCount = 0;
        const buckets = new Map<string, { r: number; g: number; b: number; weight: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 128) continue;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const rgb = { r, g, b };
          const lum = relativeLuminance(rgb);
          lumSum += lum;
          pixelCount += 1;

          const sat = colorSaturation(rgb);
          // Quantize into 32-step buckets to cluster dominant colors
          const qr = Math.round(r / 32) * 32;
          const qg = Math.round(g / 32) * 32;
          const qb = Math.round(b / 32) * 32;
          const key = `${qr}-${qg}-${qb}`;
          const weight = 1 + sat * 3.5;
          const existing = buckets.get(key);
          if (existing) {
            existing.r = (existing.r * existing.weight + r * weight) / (existing.weight + weight);
            existing.g = (existing.g * existing.weight + g * weight) / (existing.weight + weight);
            existing.b = (existing.b * existing.weight + b * weight) / (existing.weight + weight);
            existing.weight += weight;
          } else {
            buckets.set(key, { r, g, b, weight });
          }
        }

        if (pixelCount === 0) {
          resolve(null);
          return;
        }

        const topBuckets = Array.from(buckets.values())
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 8)
          .map((item) => ({
            r: clampByte(item.r),
            g: clampByte(item.g),
            b: clampByte(item.b),
          }));

        resolve({
          swatches: topBuckets,
          avgLuminance: lumSum / pixelCount,
        });
      } catch {
        // SecurityError on CORS-restricted hosts
        resolve(null);
      }
    };

    img.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      resolve(null);
    };

    img.src = srcUrl;
  });
}

export async function analyzeWallpaperColors(wp: WallpaperPreset): Promise<AdaptiveAccentPalette> {
  const instant = getInstantWallpaperAccent(wp);
  if (!wp || wp.id === 'none' || wp.type === 'webgl' || wp.type === 'css' || wp.type === 'gradient') {
    return instant;
  }

  let candidateImg = '';
  if (wp.type === 'image') {
    candidateImg = getWallpaperThumbnailUrl(wp.value || wp.bg || '') || getCleanImageUrl(wp.value || wp.bg || '');
  } else if (wp.type === 'video' && wp.previewStyle?.backgroundImage) {
    candidateImg = getCleanImageUrl(String(wp.previewStyle.backgroundImage));
  }

  if (!candidateImg) return instant;

  const sampled = await sampleImagePixels(candidateImg);
  if (!sampled || sampled.swatches.length === 0) {
    return instant;
  }

  return buildPaletteFromSwatches(sampled.swatches, sampled.avgLuminance);
}

export function applyAdaptiveAccentVariables(
  palette: AdaptiveAccentPalette | null,
  enabled: boolean,
  currentThemeIsDark: boolean
) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (!enabled || !palette) {
    root.removeAttribute('data-adaptive-accent');
    root.style.removeProperty('--color-primary');
    root.style.removeProperty('--text-link');
    root.style.removeProperty('--text-accent');
    root.style.removeProperty('--bg-button-primary');
    root.style.removeProperty('--color-primary-rgb');
    return;
  }

  const baseRgb = hexToRgb(palette.primary) || { r: 79, g: 70, b: 229 };
  const calibratedLink = currentThemeIsDark
    ? mixColors(baseRgb, { r: 255, g: 255, b: 255 }, 0.42)
    : mixColors(baseRgb, { r: 15, g: 23, b: 42 }, 0.18);
  const calibratedPrimary = currentThemeIsDark
    ? mixColors(baseRgb, { r: 255, g: 255, b: 255 }, 0.22)
    : mixColors(baseRgb, { r: 15, g: 23, b: 42 }, 0.08);

  const primaryHex = rgbToHex(calibratedPrimary.r, calibratedPrimary.g, calibratedPrimary.b);
  const linkHex = rgbToHex(calibratedLink.r, calibratedLink.g, calibratedLink.b);

  root.setAttribute('data-adaptive-accent', 'true');
  root.style.setProperty('--color-primary', primaryHex);
  root.style.setProperty('--text-link', linkHex);
  root.style.setProperty('--text-accent', primaryHex);
  root.style.setProperty('--bg-button-primary', palette.gradient);
  root.style.setProperty('--color-primary-rgb', `${calibratedPrimary.r}, ${calibratedPrimary.g}, ${calibratedPrimary.b}`);
}
