'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { CARD_STYLES_MAP, getThemeForMechanism } from '@/config/ui/cardStyles';
import { ThemeMechanismMode } from '@/config/ui/theme.types';

interface SpringState {
  x: number;
  v: number;
  t: number;
  k: number;
  c: number;
}

interface BulbColorStop {
  name: string;
  core: string;
  shadow: string;
  ring: string;
  haloInner: string;
  haloMid: string;
}

const COLOR_MODE_BULB_PALETTE: BulbColorStop[] = [
  {
    name: 'Vàng ấm',
    core: '#FBBF24',
    shadow: '0 0 18px rgba(251, 191, 36, 0.92)',
    ring: 'rgba(253, 224, 71, 0.7)',
    haloInner: 'rgba(251, 191, 36, 0.5)',
    haloMid: 'rgba(245, 158, 11, 0.24)',
  },
  {
    name: 'Hồng ngọc',
    core: '#F472B6',
    shadow: '0 0 18px rgba(244, 114, 182, 0.92)',
    ring: 'rgba(249, 168, 212, 0.7)',
    haloInner: 'rgba(244, 114, 182, 0.5)',
    haloMid: 'rgba(236, 72, 153, 0.24)',
  },
  {
    name: 'Tím thạch anh',
    core: '#A78BFA',
    shadow: '0 0 18px rgba(167, 139, 250, 0.92)',
    ring: 'rgba(196, 181, 253, 0.7)',
    haloInner: 'rgba(167, 139, 250, 0.5)',
    haloMid: 'rgba(139, 92, 246, 0.24)',
  },
  {
    name: 'Xanh thiên thanh',
    core: '#38BDF8',
    shadow: '0 0 18px rgba(56, 189, 248, 0.92)',
    ring: 'rgba(125, 211, 252, 0.7)',
    haloInner: 'rgba(56, 189, 248, 0.5)',
    haloMid: 'rgba(14, 165, 233, 0.24)',
  },
  {
    name: 'Xanh ngọc lục',
    core: '#34D399',
    shadow: '0 0 18px rgba(52, 211, 153, 0.92)',
    ring: 'rgba(110, 231, 183, 0.7)',
    haloInner: 'rgba(52, 211, 153, 0.5)',
    haloMid: 'rgba(16, 185, 129, 0.24)',
  },
  {
    name: 'Cam rực rỡ',
    core: '#FB923C',
    shadow: '0 0 18px rgba(251, 146, 60, 0.92)',
    ring: 'rgba(253, 186, 116, 0.7)',
    haloInner: 'rgba(251, 146, 60, 0.5)',
    haloMid: 'rgba(249, 115, 22, 0.24)',
  },
];

const NEXT_MECHANISM_MAP: Record<ThemeMechanismMode, ThemeMechanismMode> = {
  light: 'dark',
  dark: 'color',
  color: 'light',
};

interface PullCordThemeVisual {
  bracketBg: string;
  bracketBorder: string;
  wireStroke: string;
  capBg: string;
  capBorder: string;
  shadeBg: string;
  shadeBorder: string;
  shadeShadow: string;
  shadeStitchColor?: string;
  cordStroke: string;
  beadBg: string;
  beadBorder: string;
  beadShadow: string;
  unlitBulbBg: string;
  unlitBulbShadow: string;
  accentDotColor: string;
}

const PULL_CORD_THEME_VISUALS: Record<string, PullCordThemeVisual> = {
  'liquid-glass': {
    bracketBg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.85) 0%, rgba(224, 242, 254, 0.72) 100%)',
    bracketBorder: '1px solid rgba(255, 255, 255, 0.88)',
    wireStroke: '#0284C7',
    capBg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(224, 242, 254, 0.78) 100%)',
    capBorder: '1px solid rgba(255, 255, 255, 0.92)',
    shadeBg: 'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(240, 249, 255, 0.74) 100%)',
    shadeBorder: '1px solid rgba(255, 255, 255, 0.88)',
    shadeShadow:
      '0 10px 26px rgba(14, 116, 144, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    cordStroke: '#0284C7',
    beadBg: 'linear-gradient(180deg, #0EA5E9 0%, #4F46E5 100%)',
    beadBorder: '1px solid rgba(255, 255, 255, 0.88)',
    beadShadow: '0 4px 12px rgba(2, 132, 199, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
    unlitBulbBg: 'rgba(148, 163, 184, 0.72)',
    unlitBulbShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.68)',
    accentDotColor: '#0284C7',
  },
  'dark-liquid-glass': {
    bracketBg: 'linear-gradient(145deg, rgba(15, 23, 42, 0.86) 0%, rgba(8, 20, 42, 0.92) 100%)',
    bracketBorder: '1px solid rgba(56, 189, 248, 0.32)',
    wireStroke: '#38BDF8',
    capBg: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.94) 100%)',
    capBorder: '1px solid rgba(56, 189, 248, 0.36)',
    shadeBg: 'linear-gradient(145deg, rgba(15, 23, 42, 0.86) 0%, rgba(12, 34, 62, 0.88) 100%)',
    shadeBorder: '1px solid rgba(56, 189, 248, 0.28)',
    shadeShadow:
      '0 12px 28px rgba(0, 0, 0, 0.44), inset 0 1px 0 rgba(255, 255, 255, 0.16)',
    cordStroke: '#38BDF8',
    beadBg: 'linear-gradient(180deg, #38BDF8 0%, #818CF8 100%)',
    beadBorder: '1px solid rgba(186, 230, 253, 0.55)',
    beadShadow: '0 4px 12px rgba(56, 189, 248, 0.38)',
    unlitBulbBg: 'rgba(56, 189, 248, 0.38)',
    unlitBulbShadow: '0 0 10px rgba(56, 189, 248, 0.25), inset 0 1px 2px rgba(186, 230, 253, 0.35)',
    accentDotColor: '#38BDF8',
  },
  'cowhide-leather': {
    bracketBg: 'linear-gradient(145deg, #8B5A2B 0%, #522E10 100%)',
    bracketBorder: '1px solid rgba(245, 222, 179, 0.45)',
    wireStroke: '#d97706',
    capBg: 'linear-gradient(145deg, #9a6532 0%, #5c3413 100%)',
    capBorder: '1px solid rgba(245, 222, 179, 0.5)',
    shadeBg: 'linear-gradient(145deg, #8B5A2B 0%, #653A17 55%, #7A4A20 100%)',
    shadeBorder: '1.5px solid #522E10',
    shadeShadow:
      '0 10px 22px rgba(0, 0, 0, 0.45), inset 0 2px 3px rgba(255, 220, 180, 0.28), inset 0 -2px 5px rgba(0, 0, 0, 0.55)',
    shadeStitchColor: 'rgba(245, 222, 179, 0.58)',
    cordStroke: '#d97706',
    beadBg: 'linear-gradient(180deg, #fbbf24 0%, #92400e 100%)',
    beadBorder: '1px solid rgba(255, 248, 220, 0.6)',
    beadShadow: '0 3px 9px rgba(82, 46, 16, 0.55)',
    unlitBulbBg: 'rgba(180, 130, 80, 0.8)',
    unlitBulbShadow: 'inset 0 1px 3px rgba(255, 248, 220, 0.4)',
    accentDotColor: '#f59e0b',
  },
  'dark-cowhide-leather': {
    bracketBg: 'linear-gradient(145deg, #2B221E 0%, #140F0D 100%)',
    bracketBorder: '1px solid rgba(245, 222, 179, 0.42)',
    wireStroke: '#E5B87E',
    capBg: 'linear-gradient(145deg, #3A2E28 0%, #1C1613 100%)',
    capBorder: '1px solid rgba(245, 222, 179, 0.46)',
    shadeBg: 'linear-gradient(145deg, #2B221E 0%, #1C1613 55%, #241C18 100%)',
    shadeBorder: '1.5px solid #3E3028',
    shadeShadow:
      '0 10px 22px rgba(0, 0, 0, 0.65), inset 0 1px 2px rgba(255, 232, 200, 0.20), inset 0 -2px 5px rgba(0, 0, 0, 0.78)',
    cordStroke: '#E5B87E',
    beadBg: 'linear-gradient(180deg, #E5B87E 0%, #B7793B 100%)',
    beadBorder: '1px solid rgba(253, 230, 138, 0.70)',
    beadShadow: '0 3px 9px rgba(0, 0, 0, 0.70)',
    unlitBulbBg: 'rgba(229, 184, 126, 0.72)',
    unlitBulbShadow: 'inset 0 1px 3px rgba(255, 248, 238, 0.45)',
    accentDotColor: '#E5B87E',
  },
  'walnut-wood': {
    bracketBg: 'linear-gradient(145deg, #3A2214 0%, #1B1009 100%)',
    bracketBorder: '1px solid rgba(245, 196, 120, 0.42)',
    wireStroke: '#F5C478',
    capBg: 'linear-gradient(145deg, #472B1A 0%, #24150C 100%)',
    capBorder: '1px solid rgba(245, 196, 120, 0.48)',
    shadeBg: 'linear-gradient(145deg, #3A2214 0%, #24150C 55%, #2D1A0F 100%)',
    shadeBorder: '1.5px solid #4E2F1B',
    shadeShadow:
      '0 10px 22px rgba(10, 5, 2, 0.65), inset 0 1px 2px rgba(245, 196, 120, 0.22), inset 0 -2px 5px rgba(10, 5, 2, 0.78)',
    cordStroke: '#F5C478',
    beadBg: 'linear-gradient(180deg, #F5C478 0%, #B45309 100%)',
    beadBorder: '1px solid rgba(253, 230, 138, 0.72)',
    beadShadow: '0 3px 9px rgba(10, 5, 2, 0.70)',
    unlitBulbBg: 'rgba(245, 196, 120, 0.72)',
    unlitBulbShadow: 'inset 0 1px 3px rgba(255, 251, 244, 0.45)',
    accentDotColor: '#F5C478',
  },
  'deep-ocean': {
    bracketBg: 'linear-gradient(145deg, #0D1631 0%, #070C1C 100%)',
    bracketBorder: '1px solid rgba(56, 189, 248, 0.35)',
    wireStroke: '#38BDF8',
    capBg: 'linear-gradient(145deg, #101C38 0%, #070C1C 100%)',
    capBorder: '1px solid rgba(56, 189, 248, 0.4)',
    shadeBg: 'linear-gradient(145deg, #101C38 0%, #0A1128 100%)',
    shadeBorder: '1.5px solid rgba(56, 189, 248, 0.35)',
    shadeShadow:
      '0 12px 28px rgba(0, 0, 0, 0.52), inset 0 1px 0 rgba(56, 189, 248, 0.22)',
    cordStroke: '#38BDF8',
    beadBg: 'linear-gradient(180deg, #06B6D4 0%, #0284C7 100%)',
    beadBorder: '1px solid rgba(186, 230, 253, 0.5)',
    beadShadow: '0 4px 12px rgba(6, 182, 212, 0.42)',
    unlitBulbBg: 'rgba(56, 189, 248, 0.36)',
    unlitBulbShadow: '0 0 10px rgba(56, 189, 248, 0.25), inset 0 1px 2px rgba(186, 230, 253, 0.3)',
    accentDotColor: '#38BDF8',
  },
  'neumorphism-beyond': {
    bracketBg: 'linear-gradient(145deg, #EAEFF6 0%, #E0E7F1 100%)',
    bracketBorder: '1px solid rgba(196, 209, 226, 0.74)',
    wireStroke: '#4973FF',
    capBg: 'linear-gradient(145deg, #EAEFF6 0%, #DFE6F0 100%)',
    capBorder: '1px solid rgba(196, 209, 226, 0.74)',
    shadeBg: 'linear-gradient(145deg, rgba(235, 240, 247, 0.94) 0%, rgba(226, 232, 241, 0.90) 100%)',
    shadeBorder: '1px solid rgba(196, 209, 226, 0.74)',
    shadeShadow:
      '0 4px 10px rgba(148, 163, 184, 0.18), 2px 3px 8px rgba(163, 177, 198, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.34)',
    cordStroke: '#4973FF',
    beadBg: 'linear-gradient(180deg, #EE6AD2 0%, #4973FF 55%, #2AD8E6 100%)',
    beadBorder: '1px solid rgba(196, 209, 226, 0.78)',
    beadShadow: '0 3px 8px rgba(148, 163, 184, 0.22), 2px 3px 6px rgba(163, 177, 198, 0.28)',
    unlitBulbBg: 'rgba(148, 163, 184, 0.65)',
    unlitBulbShadow: 'inset 1px 1px 2px rgba(163, 177, 198, 0.45), inset -1px -1px 2px rgba(255, 255, 255, 0.38)',
    accentDotColor: '#EE6AD2',
  },
  'dark-neumorphism-beyond': {
    bracketBg: 'linear-gradient(145deg, #1E2635 0%, #151B26 100%)',
    bracketBorder: '1px solid rgba(71, 85, 105, 0.50)',
    wireStroke: '#64B6FF',
    capBg: 'linear-gradient(145deg, #222B3C 0%, #171D29 100%)',
    capBorder: '1px solid rgba(71, 85, 105, 0.50)',
    shadeBg: 'linear-gradient(145deg, rgba(30, 38, 53, 0.94) 0%, rgba(21, 27, 38, 0.92) 100%)',
    shadeBorder: '1px solid rgba(71, 85, 105, 0.50)',
    shadeShadow:
      '5px 6px 14px rgba(4, 7, 15, 0.65), -3px -3px 10px rgba(40, 51, 72, 0.36), inset 0 1px 0 rgba(148, 163, 184, 0.14)',
    cordStroke: '#64B6FF',
    beadBg: 'linear-gradient(180deg, #EE6AD2 0%, #4973FF 55%, #2AD8E6 100%)',
    beadBorder: '1px solid rgba(100, 182, 255, 0.40)',
    beadShadow: '3px 4px 10px rgba(4, 7, 15, 0.62), -2px -2px 6px rgba(40, 51, 72, 0.35)',
    unlitBulbBg: 'rgba(100, 116, 139, 0.55)',
    unlitBulbShadow: 'inset 1px 1px 3px rgba(4, 7, 15, 0.68), inset -1px -1px 2px rgba(46, 59, 82, 0.38)',
    accentDotColor: '#64B6FF',
  },
  'frost-ice-neu': {
    bracketBg: '#E0E8F2',
    bracketBorder: '1px solid transparent',
    wireStroke: '#5B57E8',
    capBg: '#E0E8F2',
    capBorder: '1px solid transparent',
    shadeBg: '#E0E8F2',
    shadeBorder: '1px solid transparent',
    shadeShadow:
      '-6px -6px 14px rgba(255, 255, 255, 0.86), 6px 6px 14px rgba(163, 179, 199, 0.58)',
    cordStroke: '#5B57E8',
    beadBg: '#5B57E8',
    beadBorder: '1px solid transparent',
    beadShadow: '-3px -3px 7px rgba(255, 255, 255, 0.80), 3px 3px 8px rgba(91, 87, 232, 0.34)',
    unlitBulbBg: '#C8D4E3',
    unlitBulbShadow: 'inset 2px 2px 5px rgba(163, 179, 199, 0.58), inset -2px -2px 5px rgba(255, 255, 255, 0.86)',
    accentDotColor: '#5B57E8',
  },
  'flat-soft-ui': {
    bracketBg: '#FFFFFF',
    bracketBorder: '1px solid rgba(226, 232, 240, 0.95)',
    wireStroke: '#4F46E5',
    capBg: '#F8FAFC',
    capBorder: '1px solid rgba(226, 232, 240, 0.95)',
    shadeBg: '#FFFFFF',
    shadeBorder: '1px solid rgba(226, 232, 240, 0.95)',
    shadeShadow:
      '0 6px 18px -2px rgba(15, 23, 42, 0.08), 0 12px 28px -6px rgba(15, 23, 42, 0.06)',
    cordStroke: '#4F46E5',
    beadBg: 'linear-gradient(180deg, #4F46E5 0%, #3B82F6 100%)',
    beadBorder: '1px solid rgba(255, 255, 255, 0.92)',
    beadShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
    unlitBulbBg: '#CBD5E1',
    unlitBulbShadow: 'inset 0 1px 2px rgba(15, 23, 42, 0.12)',
    accentDotColor: '#4F46E5',
  },
  'dark-flat-soft-ui': {
    bracketBg: '#131B2A',
    bracketBorder: '1px solid rgba(148, 163, 184, 0.22)',
    wireStroke: '#818CF8',
    capBg: '#161F30',
    capBorder: '1px solid rgba(148, 163, 184, 0.22)',
    shadeBg: '#131B2A',
    shadeBorder: '1px solid rgba(148, 163, 184, 0.22)',
    shadeShadow:
      '0 10px 26px rgba(0, 0, 0, 0.50), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
    cordStroke: '#818CF8',
    beadBg: 'linear-gradient(180deg, #6366F1 0%, #4F46E5 100%)',
    beadBorder: '1px solid rgba(165, 180, 252, 0.45)',
    beadShadow: '0 4px 12px rgba(99, 102, 241, 0.36)',
    unlitBulbBg: '#334155',
    unlitBulbShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.45)',
    accentDotColor: '#818CF8',
  },
};

export interface PullCordProps {
  visible?: boolean;
  leftOffsetPx?: number;
}

export const PullCord: React.FC<PullCordProps> = ({
  visible = true,
  leftOffsetPx,
}) => {
  const { isDark, cardStyle, setCardStyle } = useTheme();

  const activeMechanism: ThemeMechanismMode =
    CARD_STYLES_MAP[cardStyle]?.mechanism || (isDark ? 'dark' : 'light');
  const isColorMode = activeMechanism === 'color';
  const isLit = activeMechanism !== 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);
  const wirePathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bulbRef = useRef<HTMLElement>(null);
  const cordPathRef = useRef<SVGPathElement>(null);
  const beadRef = useRef<HTMLElement>(null);
  const grabRef = useRef<HTMLButtonElement>(null);
  const glowCircleRef = useRef<HTMLDivElement>(null);

  const [isHeld, setIsHeld] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  // Constants based on design tokens & geometry
  const WIRE = 76;
  const SHADE_H = 42;
  const AX = 22; // Offset right where right cord leaves shade
  const AY = SHADE_H - 4;
  const N = 12; // 12 links Verlet rope
  const SEG = 7.5;
  const L = N * SEG; // 90px rope length
  const CLICK = 22; // Stretch needed to trigger switch
  const MAXS = 52; // Max stretch

  // Springs
  const springsRef = useRef<{
    TH: SpringState;
    TUG: SpringState;
    R: SpringState;
    BP: SpringState;
    HX: SpringState;
    HY: SpringState;
    K: SpringState;
  }>({
    TH: { x: 0, v: 0, t: 0, k: 46, c: 3 },
    TUG: { x: 0, v: 0, t: 0, k: 300, c: 13 },
    R: { x: isLit ? 1 : 0, v: 0, t: isLit ? 1 : 0, k: 120, c: 21 },
    BP: { x: 1, v: 0, t: 1, k: 420, c: 13 },
    HX: { x: 0, v: 0, t: 0, k: 210, c: 22 },
    HY: { x: 0, v: 0, t: 0, k: 210, c: 22 },
    K: { x: 1, v: 0, t: 1, k: 300, c: 17 },
  });

  const stateRef = useRef<{
    pts: Array<{ x: number; y: number; vx: number; vy: number }>;
    held: {
      id: number;
      x: number;
      y: number;
      ox: number;
      oy: number;
      moved: number;
      sx: number;
      sy: number;
      flipped: boolean;
    } | null;
    ghost: boolean;
    armed: boolean;
    side: number;
    clock: number;
    userUntil: number;
    originX: number;
    originY: number;
  }>({
    pts: [],
    held: null,
    ghost: false,
    armed: true,
    side: 1,
    clock: 0,
    userUntil: 0,
    originX: 48,
    originY: 0,
  });

  const setCardStyleRef = useRef(setCardStyle);
  useEffect(() => {
    setCardStyleRef.current = setCardStyle;
  }, [setCardStyle]);

  const cardStyleRef = useRef(cardStyle);
  useEffect(() => {
    cardStyleRef.current = cardStyle;
  }, [cardStyle]);

  const activeMechanismRef = useRef(activeMechanism);
  useEffect(() => {
    activeMechanismRef.current = activeMechanism;
    const { R } = springsRef.current;
    const nextLit = activeMechanism !== 'dark';
    R.t = nextLit ? 1 : 0;
    R.k = nextLit ? 120 : 170;
    R.c = nextLit ? 21 : 27;
  }, [activeMechanism]);

  useEffect(() => {
    if (!isColorMode) {
      setColorIndex(0);
      return;
    }
    setColorIndex(0);
    const intervalId = window.setInterval(() => {
      setColorIndex((prev) => (prev + 1) % COLOR_MODE_BULB_PALETTE.length);
    }, 3000);
    return () => window.clearInterval(intervalId);
  }, [isColorMode]);

  const stepSpring = (s: SpringState, dt: number) => {
    const a = -s.k * (s.x - s.t) - s.c * s.v;
    s.v += a * dt;
    s.x += s.v * dt;
  };

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const getAnchor = useCallback(() => {
    const { TH, TUG } = springsRef.current;
    const { originX, originY } = stateRef.current;
    const c = Math.cos(TH.x);
    const s = Math.sin(TH.x);
    const y = WIRE + TUG.x + AY;
    return [originX + AX * c - y * s, originY + AX * s + y * c];
  }, [AY, AX, WIRE]);

  const triggerPull = useCallback(() => {
    const s = stateRef.current;
    if (s.ghost || s.held || s.pts.length < N + 1) return;
    const b = s.pts[N];
    const { HX, HY } = springsRef.current;
    s.ghost = true;
    s.armed = true;
    s.side = -s.side;
    HX.x = b.x;
    HY.x = b.y;
    HX.v = b.vx;
    HY.v = b.vy;
    const [ax, ay] = getAnchor();
    HX.t = ax + s.side * 20;
    HY.t = ay + L + 48;

    setTimeout(() => {
      s.ghost = false;
    }, 950);
  }, [getAnchor, L, N]);

  const flip = useCallback(() => {
    const { BP, TUG } = springsRef.current;
    const currentMech = activeMechanismRef.current;
    const nextMech = NEXT_MECHANISM_MAP[currentMech] || 'light';

    BP.x = nextMech === 'dark' ? 0.85 : 1.35;
    TUG.v += 140;

    SoundEngine.playPop();
    const nextStyle = getThemeForMechanism(cardStyleRef.current, nextMech);
    setCardStyleRef.current(nextStyle);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const s = stateRef.current;
    const sp = springsRef.current;

    if (!s.pts.length) {
      const [ax, ay] = getAnchor();
      for (let i = 0; i <= N; i++) {
        s.pts.push({ x: ax, y: ay + i * SEG, vx: 0, vy: 0 });
      }
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      s.clock += dt;

      stepSpring(sp.TH, dt);
      stepSpring(sp.TUG, dt);
      stepSpring(sp.R, dt);
      stepSpring(sp.BP, dt);
      stepSpring(sp.HX, dt);
      stepSpring(sp.HY, dt);
      stepSpring(sp.K, dt);

      const [ax, ay] = getAnchor();
      const p = s.held ? [s.held.x, s.held.y] : s.ghost ? [sp.HX.x, sp.HY.x] : null;
      const b = s.pts[N];

      let px = 0;
      let py = 0;
      let stretch = 0;
      let lean = 0;

      if (p) {
        const dx = p[0] - ax;
        const dy = p[1] - ay;
        const d = Math.hypot(dx, dy) || 1;
        const over = Math.max(0, d - L);
        const give = MAXS * (1 - Math.exp(-over / 65));
        const r = Math.min(d, L) + give;
        px = ax + (dx / d) * r;
        py = ay + (dy / d) * r;
        stretch = give;
        lean = over > 0 ? dx / d : 0;

        if (over > 0) {
          sp.K.x = sp.K.t = r / L;
          sp.K.v = 0;
        }

        if (s.armed && give > CLICK) {
          s.armed = false;
          flip();
          if (s.held) {
            s.held.flipped = true;
          } else {
            setTimeout(() => {
              s.ghost = false;
            }, 100);
          }
        }
      }

      if (!p || !stretch) {
        sp.K.t = 1;
      }

      const seg = SEG * Math.max(1, sp.K.x);
      sp.TUG.t = stretch * 0.22;
      sp.TH.t = clamp((-lean * stretch) / MAXS * 0.45, -0.28, 0.28);

      const prev = s.pts.map((q) => [q.x, q.y]);
      for (let i = 1; i <= N; i++) {
        const q = s.pts[i];
        const k = Math.exp(-(i === N ? 1.1 : 2.4) * dt);
        q.vy += 2600 * dt;
        q.vx *= k;
        q.vy *= k;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
      }

      for (let it = 0; it < 8; it++) {
        s.pts[0].x = ax;
        s.pts[0].y = ay;
        if (p) {
          b.x = px;
          b.y = py;
        }
        for (let i = 0; i < N; i++) {
          const a = s.pts[i];
          const c = s.pts[i + 1];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const d = Math.hypot(dx, dy) || 1e-6;
          const f = ((d - seg) / d) * 0.5;
          const wa = i === 0 ? 0 : 1;
          const wc = i + 1 === N ? (p ? 0 : 0.3) : 1;
          const sum = wa + wc || 1;
          a.x += (dx * f * wa) / sum * 2;
          a.y += (dy * f * wa) / sum * 2;
          c.x -= (dx * f * wc) / sum * 2;
          c.y -= (dy * f * wc) / sum * 2;
        }
      }

      s.pts[0].x = ax;
      s.pts[0].y = ay;
      if (p) {
        b.x = px;
        b.y = py;
      }

      for (let i = 1; i <= N; i++) {
        s.pts[i].vx = (s.pts[i].x - prev[i][0]) / dt;
        s.pts[i].vy = (s.pts[i].y - prev[i][1]) / dt;
      }

      const th = sp.TH.x;
      const tug = sp.TUG.x;
      const lastPt = s.pts[N];
      const secondLastPt = s.pts[N - 1];

      let d = `M${s.pts[0].x.toFixed(1)} ${s.pts[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) {
        const mx = ((s.pts[i].x + s.pts[i + 1].x) / 2).toFixed(1);
        const my = ((s.pts[i].y + s.pts[i + 1].y) / 2).toFixed(1);
        d += `Q${s.pts[i].x.toFixed(1)} ${s.pts[i].y.toFixed(1)} ${mx} ${my}`;
      }
      d += `L${lastPt.x.toFixed(1)} ${lastPt.y.toFixed(1)}`;

      const ang = Math.atan2(secondLastPt.x - lastPt.x, lastPt.y - secondLastPt.y);
      const wl = WIRE + tug - 2;
      const wireD = `M${s.originX} 0 L${(s.originX - Math.sin(th) * wl).toFixed(2)} ${(Math.cos(th) * wl).toFixed(2)}`;

      if (lampRef.current) {
        lampRef.current.style.transform = `rotate(${th.toFixed(4)}rad)`;
      }
      if (wirePathRef.current) {
        wirePathRef.current.setAttribute('d', wireD);
      }
      if (headRef.current) {
        headRef.current.style.transform = `translateY(${(WIRE + tug).toFixed(2)}px)`;
      }
      if (bulbRef.current) {
        bulbRef.current.style.transform = `scale(${sp.BP.x.toFixed(4)})`;
      }
      if (cordPathRef.current) {
        cordPathRef.current.setAttribute('d', d);
      }
      if (beadRef.current) {
        beadRef.current.style.transform = `translate(${lastPt.x.toFixed(2)}px, ${lastPt.y.toFixed(2)}px) rotate(${ang.toFixed(4)}rad)`;
      }
      if (grabRef.current) {
        grabRef.current.style.transform = `translate(${lastPt.x.toFixed(2)}px, ${lastPt.y.toFixed(2)}px)`;
      }

      if (glowCircleRef.current) {
        const rVal = Math.max(0, sp.R.x);
        glowCircleRef.current.style.opacity = rVal.toFixed(3);
        glowCircleRef.current.style.transform = `scale(${Math.max(0.2, rVal * 1.5).toFixed(3)})`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [flip, getAnchor, visible]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = stateRef.current;
    if (s.pts.length < N + 1) return;
    const b = s.pts[N];

    s.held = {
      id: e.pointerId,
      x: b.x,
      y: b.y,
      ox: b.x - x,
      oy: b.y - y,
      moved: 0,
      sx: x,
      sy: y,
      flipped: false,
    };
    s.ghost = false;
    s.armed = true;
    s.userUntil = s.clock + 7;
    setIsHeld(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = stateRef.current;
    if (!s.held || e.pointerId !== s.held.id || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    s.held.x = x + s.held.ox;
    s.held.y = y + s.held.oy;
    s.held.moved = Math.max(s.held.moved, Math.hypot(x - s.held.sx, y - s.held.sy));
    s.userUntil = s.clock + 7;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = stateRef.current;
    if (!s.held || e.pointerId !== s.held.id) return;
    const tap = s.held.moved < 6 && !s.held.flipped;
    s.held = null;
    setIsHeld(false);

    if (tap) {
      triggerPull();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      triggerPull();
    }
  };

  const themeVisual = PULL_CORD_THEME_VISUALS[cardStyle] || PULL_CORD_THEME_VISUALS['liquid-glass'];
  const activeThemeLabel = CARD_STYLES_MAP[cardStyle]?.shortBadge || 'Kính lỏng';

  const isGlowDisabledTheme =
    cardStyle === 'neumorphism-beyond' ||
    cardStyle === 'dark-neumorphism-beyond' ||
    cardStyle === 'frost-ice-neu';

  const activeBulbStop = isColorMode
    ? COLOR_MODE_BULB_PALETTE[colorIndex]
    : COLOR_MODE_BULB_PALETTE[0];

  const glowBackground = isGlowDisabledTheme
    ? 'none'
    : isLit
      ? `radial-gradient(circle, ${activeBulbStop.haloInner} 0%, ${activeBulbStop.haloMid} 50%, transparent 80%)`
      : 'radial-gradient(circle, rgba(148, 197, 248, 0.14) 0%, transparent 70%)';

  const bulbInlineStyle: React.CSSProperties = isLit
    ? {
        display: 'block',
        transformOrigin: '50% 50%',
        backgroundColor:
          cardStyle === 'frost-ice-neu'
            ? '#5B57E8'
            : isGlowDisabledTheme
              ? '#4973FF'
              : activeBulbStop.core,
        boxShadow: isGlowDisabledTheme
          ? cardStyle === 'frost-ice-neu'
            ? '-2px -2px 5px rgba(255, 255, 255, 0.85), 3px 3px 7px rgba(91, 87, 232, 0.38)'
            : '2px 2px 5px rgba(148, 163, 184, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.34)'
          : `${activeBulbStop.shadow}, 0 0 0 2px ${activeBulbStop.ring}`,
        transition: 'background-color 900ms ease, box-shadow 900ms ease, opacity 300ms ease',
      }
    : {
        display: 'block',
        transformOrigin: '50% 50%',
        backgroundColor: themeVisual.unlitBulbBg,
        boxShadow: themeVisual.unlitBulbShadow,
        transition: 'background-color 300ms ease, box-shadow 300ms ease, opacity 300ms ease',
      };

  const nextModeHint =
    activeMechanism === 'light'
      ? 'Tắt đèn tối'
      : activeMechanism === 'dark'
        ? 'Bật đèn màu'
        : 'Bật đèn sáng';

  const currentModeLabel =
    activeMechanism === 'light'
      ? `Sáng · ${activeThemeLabel}`
      : activeMechanism === 'dark'
        ? `Tối · ${activeThemeLabel}`
        : `Màu (${activeBulbStop.name}) · ${activeThemeLabel}`;

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      id="db-pull-cord-container"
      data-element-name="Công tắc Đèn Kéo Dây"
      data-element-type="widget"
      data-pull-cord-mode={activeMechanism}
      data-pull-cord-theme={cardStyle}
      className="absolute top-0 z-[60] pointer-events-none select-none"
      style={{
        left: leftOffsetPx !== undefined ? `${leftOffsetPx}px` : undefined,
        width: '124px',
        height: '240px',
      }}
      aria-hidden="false"
    >
      {/* Ceiling Mount Bracket */}
      <div
        id="db-pull-cord-bracket"
        className="absolute top-0 left-[41px] w-[14px] h-[5px] rounded-b-[4px] shadow-xs z-10 transition-all duration-300"
        style={{
          background: themeVisual.bracketBg,
          borderBottom: themeVisual.bracketBorder,
        }}
      />

      {/* Wire from ceiling to lamp head */}
      <svg
        className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-10"
        aria-hidden="true"
      >
        <path
          ref={wirePathRef}
          fill="none"
          stroke={themeVisual.wireStroke}
          className="transition-colors duration-300"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Swinging Lamp Assembly */}
      <div
        ref={lampRef}
        className="absolute top-0 left-[48px] w-0 h-0 will-change-transform z-20"
        style={{ transformOrigin: '0 0' }}
      >
        <div ref={headRef} className="absolute left-0 top-0 will-change-transform">
          {/* Bulb Radiant Glow Halo (Disabled on zero-glow themes) */}
          {!isGlowDisabledTheme && (
            <div
              ref={glowCircleRef}
              className="absolute left-[-42px] top-[14px] w-[84px] h-[84px] rounded-full pointer-events-none blur-md"
              style={{
                background: glowBackground,
                opacity: isLit ? 1 : 0,
                transition: 'background 900ms ease, opacity 300ms ease',
              }}
            />
          )}

          {/* Glowing Light Bulb */}
          <i
            ref={bulbRef}
            className="absolute left-[-11px] top-[28px] w-[22px] h-[22px] rounded-full shadow-sm will-change-transform"
            style={bulbInlineStyle}
          />

          {/* Lamp Shade */}
          <i
            id="db-pull-cord-shade"
            className="absolute left-[-34px] top-0 w-[68px] h-[36px] transition-all duration-300 backdrop-blur-md"
            style={{
              display: 'block',
              borderRadius: '34px 34px 8px 8px / 32px 32px 8px 8px',
              background: themeVisual.shadeBg,
              border: themeVisual.shadeBorder,
              boxShadow: themeVisual.shadeShadow,
            }}
          >
            {themeVisual.shadeStitchColor && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-[3px]"
                style={{
                  borderRadius: '30px 30px 6px 6px / 28px 28px 6px 6px',
                  border: `1px dashed ${themeVisual.shadeStitchColor}`,
                }}
              />
            )}
          </i>

          {/* Cap above shade */}
          <i
            id="db-pull-cord-cap"
            className="absolute left-[-5px] top-[-6px] w-[10px] h-[8px] rounded-t-[3px] shadow-xs transition-all duration-300"
            style={{
              display: 'block',
              background: themeVisual.capBg,
              border: themeVisual.capBorder,
            }}
          />
        </div>
      </div>

      {/* Right Rope SVG path hanging from the shade rim */}
      <svg
        className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-30"
        aria-hidden="true"
      >
        <path
          ref={cordPathRef}
          fill="none"
          stroke={themeVisual.cordStroke}
          className="transition-colors duration-300"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Right Bead at the end of cord */}
      <i
        ref={beadRef}
        id="db-pull-cord-bead"
        className="absolute left-[-5px] top-[-2px] w-[10px] h-[20px] rounded-full will-change-transform z-40 transition-all duration-300 pointer-events-none"
        style={{
          display: 'block',
          transformOrigin: '5px 2px',
          background: themeVisual.beadBg,
          border: themeVisual.beadBorder,
          boxShadow: themeVisual.beadShadow,
        }}
      />

      {/* Right Grab interactive button */}
      <button
        ref={grabRef}
        id="db-pull-cord-grab"
        type="button"
        role="switch"
        aria-checked={isLit}
        aria-valuetext={currentModeLabel}
        aria-label={`Công tắc đèn - Kéo dây chuyển chế độ Sáng / Tối / Màu (Hiện tại: ${currentModeLabel})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`absolute left-[-16px] top-[-8px] w-[32px] h-[36px] rounded-[10px] bg-transparent border-0 z-50 pointer-events-auto select-none ${
          isHeld ? 'cursor-grabbing' : 'cursor-grab'
        } focus-visible:outline-2 focus-visible:outline-amber-500 focus-visible:outline-offset-2`}
        style={{
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        title="Kéo dây để đổi giao diện Sáng / Tối / Màu"
      />

      {/* Hover Tooltip / Hint */}
      <div
        id="db-pull-cord-tooltip"
        style={{
          background: 'var(--bg-popup)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-card)',
        }}
        className={`absolute left-[30px] top-[140px] whitespace-nowrap px-2.5 py-1 rounded-[10px] typo-label font-play font-medium shadow-md backdrop-blur-md transition-all duration-300 pointer-events-none z-[70] ${
          showTooltip || isHeld
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-700"
            style={{ backgroundColor: isLit ? activeBulbStop.core : themeVisual.accentDotColor }}
          />
          <span>
            {currentModeLabel} · Kéo đổi: {nextModeHint}
          </span>
        </span>
      </div>
    </div>
  );
};
