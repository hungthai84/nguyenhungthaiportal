export type GravityPaletteId =
  | 'autoMorph'
  | 'roseGold'
  | 'pinkBlush'
  | 'voltLime'
  | 'arcticBlue';

export interface GravityPaletteSpec {
  id: Exclude<GravityPaletteId, 'autoMorph'>;
  name: string;
  accentColor: string;
  bgGradient: string;
  pastel: string;
  light: string;
  medium: string;
  deep: string;
  glass: string;
}

export const GRAVITY_PALETTES: Record<
  Exclude<GravityPaletteId, 'autoMorph'>,
  GravityPaletteSpec
> = {
  roseGold: {
    id: 'roseGold',
    name: 'Royal Blue & Pearl',
    accentColor: '#2F69FF',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #ecefff 35%, #c2d1ff 100%)',
    pastel: '#ECEFFF',
    light: '#A8C1FF',
    medium: '#2F69FF',
    deep: '#0A33BF',
    glass: '#4D80FF',
  },
  voltLime: {
    id: 'voltLime',
    name: 'Volt Lime & Slate',
    accentColor: '#E1FC03',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #fbffe5 38%, #e8ff9c 100%)',
    pastel: '#FBFFE2',
    light: '#EFFE69',
    medium: '#E1FC03',
    deep: '#B1E200',
    glass: '#DCFF32',
  },
  pinkBlush: {
    id: 'pinkBlush',
    name: 'Rose Blush & Crème',
    accentColor: '#FFC5C2',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #fff0f1 38%, #ffd1d5 100%)',
    pastel: '#FFF5F4',
    light: '#FFECEB',
    medium: '#FFA6B3',
    deep: '#FF4D6D',
    glass: '#FFA6B3',
  },
  arcticBlue: {
    id: 'arcticBlue',
    name: 'Arctic Sky & Crystal',
    accentColor: '#96E5FF',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #effaff 38%, #c9f1ff 100%)',
    pastel: '#F0F9FF',
    light: '#C9F1FF',
    medium: '#96E5FF',
    deep: '#2BA5FF',
    glass: '#98E4FF',
  },
};

const AUTO_MORPH_SEQUENCE: Array<Exclude<GravityPaletteId, 'autoMorph'>> = [
  'roseGold',
  'voltLime',
  'pinkBlush',
  'arcticBlue',
];

/**
 * Trả về bộ màu + gradient nền tương ứng với chế độ GRAVITY và trang/slide hiện tại.
 * - Khi chọn 'autoMorph': chuyển sắc qua 4 giai đoạn (Royal Blue -> Volt Lime -> Rose Blush -> Arctic Blue).
 * - Khi chọn 1 palette cố định + morphOnPageChange: giữ tông màu chính nhưng điều biến điểm sáng
 *   & sắc thái nhẹ theo trang để hiệu ứng qua trang luôn sinh động.
 */
export function resolveGravityStage(
  paletteId: GravityPaletteId,
  pageIndex: number,
  slideIndex: number,
  morphOnPageChange: boolean
): {
  palette: GravityPaletteSpec;
  bgGradient: string;
  stageIndex: number;
} {
  const step = Math.max(0, pageIndex + slideIndex);
  if (paletteId === 'autoMorph') {
    const stageIdx = step % AUTO_MORPH_SEQUENCE.length;
    const key = AUTO_MORPH_SEQUENCE[stageIdx];
    const spec = GRAVITY_PALETTES[key];
    return {
      palette: spec,
      bgGradient: spec.bgGradient,
      stageIndex: stageIdx,
    };
  }

  const baseSpec = GRAVITY_PALETTES[paletteId] || GRAVITY_PALETTES.roseGold;
  if (!morphOnPageChange) {
    return {
      palette: baseSpec,
      bgGradient: baseSpec.bgGradient,
      stageIndex: 0,
    };
  }

  // Khi chuyển trang ở chế độ palette đơn: dịch chuyển tâm ánh sáng radial gradient nhẹ nhàng
  const origins = [
    'circle at 50% 50%',
    'circle at 34% 38%',
    'circle at 68% 42%',
    'circle at 46% 64%',
  ];
  const origin = origins[step % origins.length];
  return {
    palette: baseSpec,
    bgGradient: baseSpec.bgGradient.replace('circle at center', origin),
    stageIndex: step % 4,
  };
}
