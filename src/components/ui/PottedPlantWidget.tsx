'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useLanguage } from '@/context/LanguageContext';

export interface PottedPlantWidgetProps {
  visible: boolean;
  widthPx: number;
  isDark?: boolean;
  onShowNotification?: (msg: string) => void;
}

export type PlantMode = 'seasonal' | 'static';

interface FallingLeaf {
  id: number;
  startX: number;
  startY: number;
  driftX: number;
  dropY: number;
  rotateStart: number;
  rotateEnd: number;
  scale: number;
  duration: number;
  delay: number;
  color: string;
}

interface SeasonalMonthProfile {
  month: number;
  seasonVi: string;
  seasonEn: string;
  foliageVi: string;
  foliageEn: string;
  filter: string;
  leafColors: string[];
}

const SEASONAL_MONTH_PROFILES: SeasonalMonthProfile[] = [
  {
    month: 1,
    seasonVi: 'Xuân non',
    seasonEn: 'Early Spring',
    foliageVi: 'lộc xanh tươi non',
    foliageEn: 'fresh spring bud green',
    filter: 'hue-rotate(10deg) saturate(1.14) brightness(1.05)',
    leafColors: ['#84cc16', '#a3e635', '#4ade80', '#65a30d'],
  },
  {
    month: 2,
    seasonVi: 'Xuân hoa',
    seasonEn: 'Blooming Spring',
    foliageVi: 'xanh mơn mởn sắc xuân',
    foliageEn: 'vibrant blossom spring',
    filter: 'hue-rotate(4deg) saturate(1.18) brightness(1.05)',
    leafColors: ['#4ade80', '#22c55e', '#f9a8d4', '#86efac'],
  },
  {
    month: 3,
    seasonVi: 'Cuối xuân',
    seasonEn: 'Lush Spring',
    foliageVi: 'xanh tươi tràn sức sống',
    foliageEn: 'lush emerald spring',
    filter: 'none',
    leafColors: ['#4f913d', '#63aa4c', '#84cc16', '#34d399'],
  },
  {
    month: 4,
    seasonVi: 'Đầu hạ',
    seasonEn: 'Early Summer',
    foliageVi: 'xanh ngọc đầu hạ',
    foliageEn: 'crisp early summer green',
    filter: 'hue-rotate(16deg) saturate(1.12) brightness(1.03)',
    leafColors: ['#22c55e', '#10b981', '#4ade80', '#16a34a'],
  },
  {
    month: 5,
    seasonVi: 'Nắng hạ',
    seasonEn: 'Radiant Summer',
    foliageVi: 'xanh lục rực rỡ ngày hè',
    foliageEn: 'radiant tropical summer',
    filter: 'hue-rotate(26deg) saturate(1.16) brightness(1.02)',
    leafColors: ['#10b981', '#14b8a6', '#22c55e', '#059669'],
  },
  {
    month: 6,
    seasonVi: 'Hạ ngọc',
    seasonEn: 'Midsummer Jade',
    foliageVi: 'xanh ngọc bích dịu mát',
    foliageEn: 'cool midsummer jade',
    filter: 'hue-rotate(38deg) saturate(1.12) brightness(1.04)',
    leafColors: ['#14b8a6', '#2dd4bf', '#10b981', '#0d9488'],
  },
  {
    month: 7,
    seasonVi: 'Chớm thu',
    seasonEn: 'Late Summer',
    foliageVi: 'xanh ánh vàng chớm thu',
    foliageEn: 'olive gold transition',
    filter: 'hue-rotate(-24deg) saturate(1.18) brightness(1.05)',
    leafColors: ['#a3e635', '#eab308', '#84cc16', '#facc15'],
  },
  {
    month: 8,
    seasonVi: 'Thu vàng',
    seasonEn: 'Golden Autumn',
    foliageVi: 'vàng thu ấm áp',
    foliageEn: 'warm autumn gold',
    filter: 'hue-rotate(-46deg) saturate(1.24) brightness(1.06)',
    leafColors: ['#eab308', '#f59e0b', '#fbbf24', '#d97706'],
  },
  {
    month: 9,
    seasonVi: 'Thu hổ phách',
    seasonEn: 'Amber Autumn',
    foliageVi: 'hổ phách nắng thu',
    foliageEn: 'amber autumn glow',
    filter: 'hue-rotate(-68deg) saturate(1.28) brightness(1.03)',
    leafColors: ['#f59e0b', '#f97316', '#fbbf24', '#ea580c'],
  },
  {
    month: 10,
    seasonVi: 'Thu lá đỏ',
    seasonEn: 'Crimson Maple',
    foliageVi: 'cam đỏ lá phong',
    foliageEn: 'maple sunset crimson',
    filter: 'hue-rotate(-92deg) saturate(1.3) brightness(1.02)',
    leafColors: ['#f97316', '#ef4444', '#fb923c', '#dc2626'],
  },
  {
    month: 11,
    seasonVi: 'Đầu đông',
    seasonEn: 'Early Winter',
    foliageVi: 'đồng trầm giao mùa đông',
    foliageEn: 'frosted copper breeze',
    filter: 'hue-rotate(-114deg) saturate(1.14) brightness(0.99)',
    leafColors: ['#ea580c', '#e11d48', '#f97316', '#be123c'],
  },
  {
    month: 12,
    seasonVi: 'Đông băng ngọc',
    seasonEn: 'Winter Frost',
    foliageVi: 'xanh thông tuyết mùa đông',
    foliageEn: 'cool winter pine teal',
    filter: 'hue-rotate(62deg) saturate(0.95) brightness(1.04)',
    leafColors: ['#0d9488', '#38bdf8', '#99f6e4', '#0f766e'],
  },
];

function getProfileForMonth(month: number): SeasonalMonthProfile {
  const safeIdx = ((month - 1) % 12 + 12) % 12;
  return SEASONAL_MONTH_PROFILES[safeIdx] || SEASONAL_MONTH_PROFILES[0];
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(mq.matches);
    handleChange();
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleChange);
      return () => mq.removeEventListener('change', handleChange);
    }
    mq.addListener(handleChange);
    return () => mq.removeListener(handleChange);
  }, []);

  return reduced;
}

export const PottedPlantWidget: React.FC<PottedPlantWidgetProps> = ({
  visible,
  widthPx,
  isDark = false,
  onShowNotification,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const prefersReducedMotion = usePrefersReducedMotion();

  const [mode] = useState<PlantMode>('seasonal');
  const [simulatedMonth, setSimulatedMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [isLeafFalling, setIsLeafFalling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [fallingLeaves, setFallingLeaves] = useState<FallingLeaf[]>([]);
  const [imgFailed, setImgFailed] = useState(false);

  const sequenceTimerRef = useRef<number | null>(null);
  const cleanupTimersRef = useRef<number[]>([]);
  const leafIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current !== null) {
        window.clearTimeout(sequenceTimerRef.current);
      }
      cleanupTimersRef.current.forEach((t) => window.clearTimeout(t));
      cleanupTimersRef.current = [];
    };
  }, []);

  if (!visible || widthPx <= 0) {
    return null;
  }

  const activeProfile =
    mode === 'seasonal' ? getProfileForMonth(simulatedMonth) : getProfileForMonth(3);

  const handlePlantClick = () => {
    SoundEngine.playTap();

    const nextMonth = (simulatedMonth % 12) + 1;
    const nextProfile = mode === 'seasonal' ? getProfileForMonth(nextMonth) : activeProfile;
    if (mode === 'seasonal') {
      setSimulatedMonth(nextMonth);
    }

    setIsLeafFalling(true);
    if (sequenceTimerRef.current !== null) {
      window.clearTimeout(sequenceTimerRef.current);
    }
    sequenceTimerRef.current = window.setTimeout(() => {
      setIsLeafFalling(false);
    }, 1850);

    if (!prefersReducedMotion) {
      const leafCount = 7;
      const batch: FallingLeaf[] = Array.from({ length: leafCount }, (_, idx) => {
        leafIdRef.current += 1;
        const spreadAngle = (idx / (leafCount - 1) - 0.5) * 2;
        return {
          id: leafIdRef.current,
          startX: 20 + Math.random() * 58,
          startY: 12 + Math.random() * 26,
          driftX: spreadAngle * (18 + Math.random() * 22) + (Math.random() - 0.5) * 14,
          dropY: Math.max(92, Math.round(widthPx * (0.44 + Math.random() * 0.24))),
          rotateStart: (Math.random() - 0.5) * 60,
          rotateEnd: (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 140),
          scale: 0.8 + Math.random() * 0.45,
          duration: 1.4 + Math.random() * 0.55,
          delay: idx * 0.055,
          color: nextProfile.leafColors[idx % nextProfile.leafColors.length],
        };
      });

      setFallingLeaves((prev) => [...prev.slice(-12), ...batch]);

      const batchIds = new Set(batch.map((l) => l.id));
      const cleanupTimer = window.setTimeout(() => {
        setFallingLeaves((prev) => prev.filter((l) => !batchIds.has(l.id)));
      }, 2350);
      cleanupTimersRef.current.push(cleanupTimer);
    }

    if (onShowNotification) {
      onShowNotification(
        isEn
          ? `Month ${nextProfile.month} (${nextProfile.seasonEn}): leaves fall gently & shift to ${nextProfile.foliageEn}`
          : `Tháng ${nextProfile.month} (${nextProfile.seasonVi}): lá rơi nhẹ và chuyển sắc ${nextProfile.foliageVi}`
      );
    }
  };

  const label = isEn
    ? `Seasonal potted plant (Month ${activeProfile.month}: ${activeProfile.seasonEn}) — Click to trigger leaf-falling & change season`
    : `Chậu cây theo mùa (Tháng ${activeProfile.month}: ${activeProfile.seasonVi}) — Nhấn để rụng lá và đổi sắc lá theo tháng`;

  return (
    <div
      id="peripheral-potted-plant-wrapper"
      data-element-name="Chậu cây góc dưới bên trái"
      data-element-type="widget"
      data-element-page="global"
      className="fixed bottom-1.5 left-1.5 z-40 pointer-events-none select-none flex items-end justify-center overflow-visible"
      style={{
        width: `${widthPx}px`,
        maxWidth: `${widthPx}px`,
        contain: 'layout style',
      }}
    >
      <button
        id="peripheral-potted-plant-btn"
        type="button"
        onClick={handlePlantClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        data-plant-mode={mode}
        data-simulated-month={simulatedMonth}
        data-animation={isLeafFalling ? 'leaf-falling' : 'idle'}
        aria-label={label}
        title={label}
        style={{
          transformOrigin: '50% 92%',
          filter: isDark
            ? 'drop-shadow(0 12px 18px rgba(0, 0, 0, 0.52))'
            : 'drop-shadow(0 10px 16px rgba(45, 56, 80, 0.18))',
        }}
        className="plant-widget-btn pointer-events-auto relative flex flex-col items-center justify-end w-full bg-transparent border-0 p-0 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2 group overflow-visible"
      >
        {/* Nhãn tháng / mùa tinh gọn khi hover */}
        <span
          className={`pointer-events-none mb-1 px-2.5 py-1 rounded-full typo-label font-play font-semibold whitespace-nowrap shadow-sm backdrop-blur-md transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
          }`}
          style={{
            background: 'var(--bg-popup)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-card)',
          }}
        >
          {isEn
            ? `Month ${activeProfile.month} · ${activeProfile.seasonEn}`
            : `Tháng ${activeProfile.month} · ${activeProfile.seasonVi}`}
        </span>

        {/* Container cố định tỷ lệ để không gây Layout Shift khi lá rơi hoặc tải ảnh */}
        <span
          className="relative block w-full overflow-visible pointer-events-none"
          style={{
            aspectRatio: '100 / 130',
            contain: 'layout style',
          }}
        >
          {/* Chuỗi animation rụng lá (leaf-falling sequence) thuần GPU CSS */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-visible z-20 block"
          >
            {fallingLeaves.map((leaf) => {
              const leafVars: React.CSSProperties = {
                position: 'absolute',
                left: `${leaf.startX}%`,
                top: `${leaf.startY}%`,
                width: '18px',
                height: '18px',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
                animationDuration: `${leaf.duration}s`,
                animationDelay: `${leaf.delay}s`,
                ['--leaf-drift-x' as string]: `${leaf.driftX}px`,
                ['--leaf-drop-y' as string]: `${leaf.dropY}px`,
                ['--leaf-rot-start' as string]: `${leaf.rotateStart}deg`,
                ['--leaf-rot-end' as string]: `${leaf.rotateStart + leaf.rotateEnd}deg`,
                ['--leaf-scale' as string]: String(leaf.scale),
              };
              return (
                <svg
                  key={leaf.id}
                  viewBox="0 0 24 24"
                  data-animation="leaf-falling"
                  className="plant-falling-leaf leaf-falling"
                  style={leafVars}
                >
                  <path
                    d="M12 2C7 5.5 4 10.5 6.5 16.5C8.5 19.8 11.2 21.5 12 22C12.8 21.5 15.5 19.8 17.5 16.5C20 10.5 17 5.5 12 2Z"
                    fill={leaf.color}
                  />
                  <path
                    d="M12 4.5V20.5"
                    stroke="rgba(255,255,255,0.45)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              );
            })}
          </span>

          <span
            className={`block w-full h-full pointer-events-none select-none ${
              isLeafFalling && !prefersReducedMotion ? 'plant-canopy-breeze' : ''
            }`}
          >
            {!imgFailed ? (
              <img
                src="/assets/widgets/potted-plant.png"
                alt={isEn ? 'Seasonal indoor potted plant' : 'Chậu cây xanh theo mùa'}
                draggable={false}
                decoding="async"
                onError={() => setImgFailed(true)}
                style={{
                  filter: activeProfile.filter,
                  transition: 'filter 450ms ease, transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                className="w-full h-full object-contain block pointer-events-none select-none group-hover:brightness-[1.03]"
              />
            ) : (
              <svg
                viewBox="0 0 100 130"
                className="w-full h-full block pointer-events-none"
                aria-hidden="true"
                style={{
                  filter: activeProfile.filter,
                  transition: 'filter 450ms ease',
                }}
              >
                <path d="M50 78 C36 62, 18 44, 24 22 C38 28, 48 48, 50 78 Z" fill="#4f913d" />
                <path d="M50 78 C64 60, 82 44, 76 20 C62 28, 52 48, 50 78 Z" fill="#63aa4c" />
                <path d="M50 78 C42 52, 42 28, 50 8 C58 28, 58 52, 50 78 Z" fill="#3e7b2e" />
                <rect x="28" y="76" width="44" height="44" rx="12" fill="#ebe3cf" stroke="#d5cbb4" strokeWidth="2" />
              </svg>
            )}
          </span>
        </span>
      </button>
    </div>
  );
};
