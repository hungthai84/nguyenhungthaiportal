'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { CARD_STYLES_MAP, getThemeForMechanism, VALID_CARD_STYLES } from '@/config/ui/cardStyles';
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

export const PullCord: React.FC = () => {
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

  // Left pull cord refs
  const cordPathLeftRef = useRef<SVGPathElement>(null);
  const beadLeftRef = useRef<HTMLElement>(null);
  const grabLeftRef = useRef<HTMLButtonElement>(null);

  const [isHeld, setIsHeld] = useState(false);
  const [isHeldLeft, setIsHeldLeft] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showTooltipLeft, setShowTooltipLeft] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  // Constants based on design tokens & geometry
  const WIRE = 76;
  const SHADE_H = 42;
  const AX = 22; // Offset right where right cord leaves shade
  const AX_LEFT = -22; // Offset left where left cord leaves shade
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
    HXLeft: SpringState;
    HYLeft: SpringState;
    K: SpringState;
    KLeft: SpringState;
  }>({
    TH: { x: 0, v: 0, t: 0, k: 46, c: 3 },
    TUG: { x: 0, v: 0, t: 0, k: 300, c: 13 },
    R: { x: isLit ? 1 : 0, v: 0, t: isLit ? 1 : 0, k: 120, c: 21 },
    BP: { x: 1, v: 0, t: 1, k: 420, c: 13 },
    HX: { x: 0, v: 0, t: 0, k: 210, c: 22 },
    HY: { x: 0, v: 0, t: 0, k: 210, c: 22 },
    HXLeft: { x: 0, v: 0, t: 0, k: 210, c: 22 },
    HYLeft: { x: 0, v: 0, t: 0, k: 210, c: 22 },
    K: { x: 1, v: 0, t: 1, k: 300, c: 17 },
    KLeft: { x: 1, v: 0, t: 1, k: 300, c: 17 },
  });

  const stateRef = useRef<{
    pts: Array<{ x: number; y: number; vx: number; vy: number }>;
    ptsLeft: Array<{ x: number; y: number; vx: number; vy: number }>;
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
    heldLeft: {
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
    ghostLeft: boolean;
    armed: boolean;
    armedLeft: boolean;
    side: number;
    sideLeft: number;
    clock: number;
    userUntil: number;
    originX: number;
    originY: number;
  }>({
    pts: [],
    ptsLeft: [],
    held: null,
    heldLeft: null,
    ghost: false,
    ghostLeft: false,
    armed: true,
    armedLeft: true,
    side: 1,
    sideLeft: -1,
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

  // Color-changing bulb cycle every 3s when Color mode is active
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

  // Spring step function
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

  const getAnchorLeft = useCallback(() => {
    const { TH, TUG } = springsRef.current;
    const { originX, originY } = stateRef.current;
    const c = Math.cos(TH.x);
    const s = Math.sin(TH.x);
    const y = WIRE + TUG.x + AY;
    return [originX + AX_LEFT * c - y * s, originY + AX_LEFT * s + y * c];
  }, [AY, WIRE]);

  // Trigger simulated pull (right cord: light/dark/color mechanism)
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

  // Trigger simulated pull (left cord: cycle theme)
  const triggerPullLeft = useCallback(() => {
    const s = stateRef.current;
    if (s.ghostLeft || s.heldLeft || s.ptsLeft.length < N + 1) return;
    const b = s.ptsLeft[N];
    const { HXLeft, HYLeft } = springsRef.current;
    s.ghostLeft = true;
    s.armedLeft = true;
    s.sideLeft = -s.sideLeft;
    HXLeft.x = b.x;
    HYLeft.x = b.y;
    HXLeft.v = b.vx;
    HYLeft.v = b.vy;
    const [ax, ay] = getAnchorLeft();
    HXLeft.t = ax + s.sideLeft * 20;
    HYLeft.t = ay + L + 48;

    setTimeout(() => {
      s.ghostLeft = false;
    }, 950);
  }, [getAnchorLeft, L, N]);

  // Flip light switch & cycle theme mechanism
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

  // Cycle theme style for left cord
  const cycleTheme = useCallback(() => {
    const { TUG } = springsRef.current;
    TUG.v += 120;
    SoundEngine.playPop();
    const currentIndex = VALID_CARD_STYLES.indexOf(cardStyleRef.current);
    const nextIndex = (currentIndex + 1) % VALID_CARD_STYLES.length;
    const nextStyle = VALID_CARD_STYLES[nextIndex];
    setCardStyleRef.current(nextStyle);
  }, []);

  // Main animation frame loop
  useEffect(() => {
    const s = stateRef.current;
    const sp = springsRef.current;

    // Init rope points if empty
    if (!s.pts.length) {
      const [ax, ay] = getAnchor();
      for (let i = 0; i <= N; i++) {
        s.pts.push({ x: ax, y: ay + i * SEG, vx: 0, vy: 0 });
      }
    }
    if (!s.ptsLeft.length) {
      const [axL, ayL] = getAnchorLeft();
      for (let i = 0; i <= N; i++) {
        s.ptsLeft.push({ x: axL, y: ayL + i * SEG, vx: 0, vy: 0 });
      }
    }

    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      s.clock += dt;

      // Step springs
      stepSpring(sp.TH, dt);
      stepSpring(sp.TUG, dt);
      stepSpring(sp.R, dt);
      stepSpring(sp.BP, dt);
      stepSpring(sp.HX, dt);
      stepSpring(sp.HY, dt);
      stepSpring(sp.HXLeft, dt);
      stepSpring(sp.HYLeft, dt);
      stepSpring(sp.K, dt);
      stepSpring(sp.KLeft, dt);

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

      // Left cord math
      const [axL, ayL] = getAnchorLeft();
      const pL = s.heldLeft ? [s.heldLeft.x, s.heldLeft.y] : s.ghostLeft ? [sp.HXLeft.x, sp.HYLeft.x] : null;
      const bL = s.ptsLeft[N];

      let pxL = 0;
      let pyL = 0;
      let stretchL = 0;
      let leanL = 0;

      if (pL) {
        const dx = pL[0] - axL;
        const dy = pL[1] - ayL;
        const d = Math.hypot(dx, dy) || 1;
        const over = Math.max(0, d - L);
        const give = MAXS * (1 - Math.exp(-over / 65));
        const r = Math.min(d, L) + give;
        pxL = axL + (dx / d) * r;
        pyL = ayL + (dy / d) * r;
        stretchL = give;
        leanL = over > 0 ? dx / d : 0;

        if (over > 0) {
          sp.KLeft.x = sp.KLeft.t = r / L;
          sp.KLeft.v = 0;
        }

        if (s.armedLeft && give > CLICK) {
          s.armedLeft = false;
          cycleTheme();
          if (s.heldLeft) {
            s.heldLeft.flipped = true;
          } else {
            setTimeout(() => {
              s.ghostLeft = false;
            }, 100);
          }
        }
      }

      if (!pL || !stretchL) {
        sp.KLeft.t = 1;
      }

      const totalStretch = Math.max(stretch, stretchL);
      const totalLean = lean - leanL;

      const seg = SEG * Math.max(1, sp.K.x);
      const segL = SEG * Math.max(1, sp.KLeft.x);

      sp.TUG.t = totalStretch * 0.22;
      sp.TH.t = clamp((-totalLean * totalStretch) / MAXS * 0.45, -0.28, 0.28);

      // Right rope physics
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

      // Left rope physics
      const prevL = s.ptsLeft.map((q) => [q.x, q.y]);
      for (let i = 1; i <= N; i++) {
        const q = s.ptsLeft[i];
        const k = Math.exp(-(i === N ? 1.1 : 2.4) * dt);
        q.vy += 2600 * dt;
        q.vx *= k;
        q.vy *= k;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
      }

      for (let it = 0; it < 8; it++) {
        s.ptsLeft[0].x = axL;
        s.ptsLeft[0].y = ayL;
        if (pL) {
          bL.x = pxL;
          bL.y = pyL;
        }
        for (let i = 0; i < N; i++) {
          const a = s.ptsLeft[i];
          const c = s.ptsLeft[i + 1];
          const dx = c.x - a.x;
          const dy = c.y - a.y;
          const d = Math.hypot(dx, dy) || 1e-6;
          const f = ((d - segL) / d) * 0.5;
          const wa = i === 0 ? 0 : 1;
          const wc = i + 1 === N ? (pL ? 0 : 0.3) : 1;
          const sum = wa + wc || 1;
          a.x += (dx * f * wa) / sum * 2;
          a.y += (dy * f * wa) / sum * 2;
          c.x -= (dx * f * wc) / sum * 2;
          c.y -= (dy * f * wc) / sum * 2;
        }
      }

      s.ptsLeft[0].x = axL;
      s.ptsLeft[0].y = ayL;
      if (pL) {
        bL.x = pxL;
        bL.y = pyL;
      }

      for (let i = 1; i <= N; i++) {
        s.ptsLeft[i].vx = (s.ptsLeft[i].x - prevL[i][0]) / dt;
        s.ptsLeft[i].vy = (s.ptsLeft[i].y - prevL[i][1]) / dt;
      }

      // Render transforms to DOM elements
      const th = sp.TH.x;
      const tug = sp.TUG.x;
      const lastPt = s.pts[N];
      const secondLastPt = s.pts[N - 1];

      // Build smooth Bezier SVG paths
      let d = `M${s.pts[0].x.toFixed(1)} ${s.pts[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) {
        const mx = ((s.pts[i].x + s.pts[i + 1].x) / 2).toFixed(1);
        const my = ((s.pts[i].y + s.pts[i + 1].y) / 2).toFixed(1);
        d += `Q${s.pts[i].x.toFixed(1)} ${s.pts[i].y.toFixed(1)} ${mx} ${my}`;
      }
      d += `L${lastPt.x.toFixed(1)} ${lastPt.y.toFixed(1)}`;

      const lastPtL = s.ptsLeft[N];
      const secondLastPtL = s.ptsLeft[N - 1];
      let dL = `M${s.ptsLeft[0].x.toFixed(1)} ${s.ptsLeft[0].y.toFixed(1)}`;
      for (let i = 1; i < N; i++) {
        const mx = ((s.ptsLeft[i].x + s.ptsLeft[i + 1].x) / 2).toFixed(1);
        const my = ((s.ptsLeft[i].y + s.ptsLeft[i + 1].y) / 2).toFixed(1);
        dL += `Q${s.ptsLeft[i].x.toFixed(1)} ${s.ptsLeft[i].y.toFixed(1)} ${mx} ${my}`;
      }
      dL += `L${lastPtL.x.toFixed(1)} ${lastPtL.y.toFixed(1)}`;

      const ang = Math.atan2(secondLastPt.x - lastPt.x, lastPt.y - secondLastPt.y);
      const angL = Math.atan2(secondLastPtL.x - lastPtL.x, lastPtL.y - secondLastPtL.y);

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

      if (cordPathLeftRef.current) {
        cordPathLeftRef.current.setAttribute('d', dL);
      }
      if (beadLeftRef.current) {
        beadLeftRef.current.style.transform = `translate(${lastPtL.x.toFixed(2)}px, ${lastPtL.y.toFixed(2)}px) rotate(${angL.toFixed(4)}rad)`;
      }
      if (grabLeftRef.current) {
        grabLeftRef.current.style.transform = `translate(${lastPtL.x.toFixed(2)}px, ${lastPtL.y.toFixed(2)}px)`;
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
  }, [cycleTheme, flip, getAnchor, getAnchorLeft]);

  // Pointer drag events on right grab handle
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

  // Pointer drag events on left grab handle
  const handlePointerDownLeft = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = stateRef.current;
    if (s.ptsLeft.length < N + 1) return;
    const b = s.ptsLeft[N];

    s.heldLeft = {
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
    s.ghostLeft = false;
    s.armedLeft = true;
    setIsHeldLeft(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMoveLeft = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = stateRef.current;
    if (!s.heldLeft || e.pointerId !== s.heldLeft.id || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    s.heldLeft.x = x + s.heldLeft.ox;
    s.heldLeft.y = y + s.heldLeft.oy;
    s.heldLeft.moved = Math.max(s.heldLeft.moved, Math.hypot(x - s.heldLeft.sx, y - s.heldLeft.sy));
  };

  const handlePointerUpLeft = (e: React.PointerEvent<HTMLButtonElement>) => {
    const s = stateRef.current;
    if (!s.heldLeft || e.pointerId !== s.heldLeft.id) return;
    const tap = s.heldLeft.moved < 6 && !s.heldLeft.flipped;
    s.heldLeft = null;
    setIsHeldLeft(false);

    if (tap) {
      triggerPullLeft();
    }
  };

  const handleKeyDownLeft = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      triggerPullLeft();
    }
  };

  const activeBulbStop = isColorMode
    ? COLOR_MODE_BULB_PALETTE[colorIndex]
    : COLOR_MODE_BULB_PALETTE[0];

  const glowBackground = isLit
    ? `radial-gradient(circle, ${activeBulbStop.haloInner} 0%, ${activeBulbStop.haloMid} 50%, transparent 80%)`
    : 'radial-gradient(circle, rgba(251, 191, 36, 0.12) 0%, transparent 70%)';

  const bulbInlineStyle: React.CSSProperties = isLit
    ? {
        display: 'block',
        transformOrigin: '50% 50%',
        backgroundColor: activeBulbStop.core,
        boxShadow: `${activeBulbStop.shadow}, 0 0 0 2px ${activeBulbStop.ring}`,
        transition: 'background-color 900ms ease, box-shadow 900ms ease, opacity 300ms ease',
      }
    : {
        display: 'block',
        transformOrigin: '50% 50%',
        backgroundColor: isDark ? 'rgba(100, 116, 139, 0.8)' : 'rgba(148, 163, 184, 0.8)',
        boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4)',
        transition: 'background-color 300ms ease, box-shadow 300ms ease, opacity 300ms ease',
      };

  const shadeBackground = isColorMode
    ? 'linear-gradient(180deg, rgba(248, 250, 252, 0.96) 0%, rgba(224, 231, 255, 0.88) 100%)'
    : isDark
      ? 'linear-gradient(180deg, #334155 0%, #1e293b 100%)'
      : 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)';

  const beadBackground = isColorMode
    ? 'linear-gradient(180deg, #fbbf24 0%, #f472b6 50%, #38bdf8 100%)'
    : isDark
      ? 'linear-gradient(180deg, #fbbf24 0%, #d97706 100%)'
      : 'linear-gradient(180deg, #475569 0%, #1e293b 100%)';

  const beadLeftBackground = isColorMode
    ? 'linear-gradient(180deg, #38bdf8 0%, #34d399 50%, #fbbf24 100%)'
    : isDark
      ? 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)'
      : 'linear-gradient(180deg, #0284c7 0%, #1e3a8a 100%)';

  const nextModeHint =
    activeMechanism === 'light'
      ? 'Tắt đèn tối'
      : activeMechanism === 'dark'
        ? 'Bật đèn màu'
        : 'Bật đèn sáng';

  const currentModeLabel =
    activeMechanism === 'light'
      ? 'Chế độ Sáng'
      : activeMechanism === 'dark'
        ? 'Chế độ Tối'
        : `Chế độ Màu (${activeBulbStop.name})`;

  const currentThemeName =
    CARD_STYLES_MAP[cardStyle]?.name || cardStyle;

  return (
    <div
      ref={containerRef}
      id="db-pull-cord-container"
      data-element-name="Công tắc Đèn Kéo Dây (Đôi)"
      data-element-type="widget"
      data-pull-cord-mode={activeMechanism}
      className="fixed top-0 left-2 sm:left-4 lg:left-6 z-[60] pointer-events-none select-none"
      style={{
        width: '140px',
        height: '240px',
      }}
      aria-hidden="false"
    >
      {/* Ceiling Mount Bracket */}
      <div
        className="absolute top-0 left-[41px] w-[14px] h-[5px] rounded-b-[4px] bg-slate-400 dark:bg-slate-600 shadow-xs z-10"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.3)',
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
          stroke="currentColor"
          className="text-slate-500 dark:text-slate-400"
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
          {/* Bulb Radiant Glow Halo */}
          <div
            ref={glowCircleRef}
            className="absolute left-[-42px] top-[14px] w-[84px] h-[84px] rounded-full pointer-events-none blur-md"
            style={{
              background: glowBackground,
              opacity: isLit ? 1 : 0,
              transition: 'background 900ms ease, opacity 300ms ease',
            }}
          />

          {/* Glowing Light Bulb */}
          <i
            ref={bulbRef}
            className="absolute left-[-11px] top-[28px] w-[22px] h-[22px] rounded-full shadow-sm will-change-transform"
            style={bulbInlineStyle}
          />

          {/* Lamp Shade */}
          <i
            className="absolute left-[-34px] top-0 w-[68px] h-[36px] shadow-md transition-colors duration-300 backdrop-blur-md"
            style={{
              display: 'block',
              borderRadius: '34px 34px 8px 8px / 32px 32px 8px 8px',
              background: shadeBackground,
              border: '1px solid rgba(255, 255, 255, 0.35)',
              boxShadow: isDark
                ? '0 6px 14px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)'
                : '0 6px 14px rgba(100,116,139,0.2), inset 0 1px 1px rgba(255,255,255,0.8)',
            }}
          />

          {/* Cap above shade */}
          <i
            className="absolute left-[-5px] top-[-6px] w-[10px] h-[8px] rounded-t-[3px] bg-slate-400 dark:bg-slate-600 shadow-xs"
            style={{ display: 'block' }}
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
          stroke="currentColor"
          className="text-amber-700/80 dark:text-amber-500/80"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Right Bead at the end of cord */}
      <i
        ref={beadRef}
        className="absolute left-[-5px] top-[-2px] w-[10px] h-[20px] rounded-full shadow-sm will-change-transform z-40 transition-colors pointer-events-none"
        style={{
          display: 'block',
          transformOrigin: '5px 2px',
          background: beadBackground,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
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
        aria-label={`Công tắc đèn phải - Kéo dây chuyển chế độ Sáng / Tối / Màu (Hiện tại: ${currentModeLabel})`}
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
        title="Kéo dây phải để đổi Bật/Tắt đèn"
      />

      {/* Left Rope SVG path hanging from the left shade rim */}
      <svg
        className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-30"
        aria-hidden="true"
      >
        <path
          ref={cordPathLeftRef}
          fill="none"
          stroke="currentColor"
          className="text-sky-700/80 dark:text-sky-400/80"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Left Bead at the end of cord */}
      <i
        ref={beadLeftRef}
        className="absolute left-[-5px] top-[-2px] w-[10px] h-[20px] rounded-full shadow-sm will-change-transform z-40 transition-colors pointer-events-none"
        style={{
          display: 'block',
          transformOrigin: '5px 2px',
          background: beadLeftBackground,
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}
      />

      {/* Left Grab interactive button */}
      <button
        ref={grabLeftRef}
        id="db-pull-cord-grab-left"
        type="button"
        role="button"
        aria-label={`Công tắc dây trái - Kéo dây để đổi giao diện (Hiện tại: ${currentThemeName})`}
        onPointerDown={handlePointerDownLeft}
        onPointerMove={handlePointerMoveLeft}
        onPointerUp={handlePointerUpLeft}
        onPointerCancel={handlePointerUpLeft}
        onKeyDown={handleKeyDownLeft}
        onMouseEnter={() => setShowTooltipLeft(true)}
        onMouseLeave={() => setShowTooltipLeft(false)}
        className={`absolute left-[-16px] top-[-8px] w-[32px] h-[36px] rounded-[10px] bg-transparent border-0 z-50 pointer-events-auto select-none ${
          isHeldLeft ? 'cursor-grabbing' : 'cursor-grab'
        } focus-visible:outline-2 focus-visible:outline-sky-500 focus-visible:outline-offset-2`}
        style={{
          touchAction: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
        title="Kéo dây trái để đổi giao diện / theme"
      />

      {/* Right Hover Tooltip / Hint */}
      <div
        className={`absolute left-[30px] top-[140px] whitespace-nowrap px-2.5 py-1 rounded-[8px] text-[11px] font-play font-medium shadow-md transition-all duration-300 pointer-events-none z-[70] ${
          showTooltip || isHeld
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2'
        } ${
          isDark
            ? 'bg-slate-800/90 text-amber-300 border border-slate-700/80 backdrop-blur-md'
            : 'bg-white/95 text-slate-800 border border-slate-200/90 backdrop-blur-md'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-700"
            style={{ backgroundColor: isLit ? activeBulbStop.core : '#FBBF24' }}
          />
          <span>
            {currentModeLabel} · Kéo phải: {nextModeHint}
          </span>
        </span>
      </div>

      {/* Left Hover Tooltip / Hint */}
      <div
        className={`absolute left-[30px] top-[180px] whitespace-nowrap px-2.5 py-1 rounded-[8px] text-[11px] font-play font-medium shadow-md transition-all duration-300 pointer-events-none z-[70] ${
          showTooltipLeft || isHeldLeft
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2'
        } ${
          isDark
            ? 'bg-slate-800/90 text-sky-300 border border-slate-700/80 backdrop-blur-md'
            : 'bg-white/95 text-slate-800 border border-slate-200/90 backdrop-blur-md'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          <span>
            Giao diện: {currentThemeName} · Kéo trái: Đổi giao diện
          </span>
        </span>
      </div>
    </div>
  );
};
