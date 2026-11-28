'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProjectData } from '@/types';
import { getProjectCloudinaryBanner } from '@/utils/projectBanner';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface ProjectFanGroup {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  accentColor: string;
  artIndex: number;
  projects: ProjectData[];
}

interface ProjectFanGroupCardProps {
  group: ProjectFanGroup;
  groupIdx: number;
  isDark?: boolean;
  onSelectProject: (proj: ProjectData) => void;
}

// 5 grainy mesh palettes from DesignBookmark Fan Cards study
const FAN_CARD_ARTS = [
  'radial-gradient(120% 90% at 15% 10%, #ff8a4c 0%, rgba(255,138,76,0) 58%), radial-gradient(110% 95% at 88% 18%, #e0457b 0%, rgba(224,69,123,0) 60%), radial-gradient(130% 110% at 50% 95%, #2b1748 0%, #12091f 78%)',
  'radial-gradient(115% 85% at 82% 12%, #66e3c4 0%, rgba(102,227,196,0) 55%), radial-gradient(120% 95% at 12% 28%, #2e7cf6 0%, rgba(46,124,246,0) 60%), radial-gradient(130% 110% at 55% 96%, #0b2238 0%, #07121e 80%)',
  'radial-gradient(110% 85% at 22% 14%, #ffd36e 0%, rgba(255,211,110,0) 55%), radial-gradient(115% 95% at 86% 24%, #49b870 0%, rgba(73,184,112,0) 60%), radial-gradient(130% 110% at 48% 95%, #0e2a23 0%, #071512 80%)',
  'radial-gradient(115% 90% at 20% 12%, #c9a5ff 0%, rgba(201,165,255,0) 56%), radial-gradient(120% 95% at 88% 22%, #ff6aa6 0%, rgba(255,106,166,0) 58%), radial-gradient(130% 110% at 50% 96%, #23113a 0%, #0f071c 80%)',
  'radial-gradient(115% 88% at 78% 12%, #ff9d5c 0%, rgba(255,157,92,0) 55%), radial-gradient(120% 95% at 14% 24%, #5ca9ff 0%, rgba(92,169,255,0) 58%), radial-gradient(130% 110% at 50% 96%, #181a30 0%, #0b0d19 80%)',
];

export const ProjectFanGroupCard: React.FC<ProjectFanGroupCardProps> = ({
  group,
  groupIdx,
  onSelectProject,
}) => {
  const [fanned, setFanned] = useState(false);
  const [hotIdx, setHotIdx] = useState<number>(-1);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number>(0);

  // Fan spring state (exact port of DesignBookmark Fan Cards spring solver)
  const fanSpringRef = useRef({ x: 0, v: 0 });
  const liftSpringsRef = useRef<Array<{ x: number; v: number }>>([]);
  const scSpringsRef = useRef<Array<{ x: number; v: number }>>([]);
  const cardElsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const userTouchedRef = useRef(false);
  const fannedRef = useRef(fanned);
  const hotIdxRef = useRef(hotIdx);

  fannedRef.current = fanned;
  hotIdxRef.current = hotIdx;

  // Up to 5 cards rendered in the physical fan stack
  const fanCards = group.projects.slice(0, 5);
  const count = fanCards.length;

  if (liftSpringsRef.current.length !== count) {
    liftSpringsRef.current = Array.from({ length: count }, () => ({ x: 0, v: 0 }));
    scSpringsRef.current = Array.from({ length: count }, () => ({ x: 1, v: 0 }));
  }

  // Subtle idle demo fan cycle until viewer interacts
  useEffect(() => {
    const startDelay = 1200 + groupIdx * 350;
    let demoTimer: number | null = null;
    const initTimeout = window.setTimeout(() => {
      if (userTouchedRef.current) return;
      let demoState = false;
      demoTimer = window.setInterval(() => {
        if (userTouchedRef.current) {
          if (demoTimer !== null) window.clearInterval(demoTimer);
          return;
        }
        demoState = !demoState;
        setFanned(demoState);
        setHotIdx(-1);
      }, 2800);
    }, startDelay);

    return () => {
      window.clearTimeout(initTimeout);
      if (demoTimer !== null) window.clearInterval(demoTimer);
    };
  }, [groupIdx]);

  // Continuous spring animation loop (stiffness/damping from DesignBookmark Fan Cards)
  useEffect(() => {
    let rafId = 0;
    let lastTime = performance.now();

    const stepSpring = (
      s: { x: number; v: number },
      target: number,
      k: number,
      d: number,
      dt: number
    ) => {
      const f = -k * (s.x - target) - d * s.v;
      s.v += f * dt;
      s.x += s.v * dt;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - lastTime) / 1000 || 0.016);
      lastTime = now;

      const isFanned = fannedRef.current;
      const currentHot = hotIdxRef.current;

      // --fan-open: 220 19, --fan-close: 300 26
      stepSpring(
        fanSpringRef.current,
        isFanned ? 1 : 0,
        isFanned ? 220 : 300,
        isFanned ? 19 : 26,
        dt
      );

      const p = fanSpringRef.current.x;
      const mid = (count - 1) / 2;

      for (let i = 0; i < count; i++) {
        const el = cardElsRef.current[i];
        if (!el) continue;

        const d = i - mid;
        const hot = isFanned && currentHot === i;

        // --fan-lift: 420 24
        stepSpring(liftSpringsRef.current[i], hot ? -14 : 0, 420, 24, dt);
        stepSpring(scSpringsRef.current[i], hot ? 1.045 : 1, 420, 24, dt);

        // Collapsed stack: slight organic offset; Fanned: clean arc
        const stackRot = (i - mid) * 1.1;
        const stackY = (count - 1 - i) * -2;
        const fanRot = d * 10;
        const fanX = d * 32;
        const fanY = Math.abs(d) * 7;

        const rot = stackRot * (1 - p) + fanRot * p;
        const x = fanX * p;
        const y = stackY * (1 - p) + fanY * p + liftSpringsRef.current[i].x;
        const sc = scSpringsRef.current[i].x;

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        el.style.zIndex = String(hot ? 20 : i + 1);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [count]);

  const activeProject = group.projects[activeProjectIdx] || group.projects[0];

  return (
    <article
      id={`project-fan-group-${group.id}`}
      data-element-type="card"
      data-section-card="true"
      className="project-fan-group-card bento-card glass-card group relative flex flex-col justify-between rounded-[var(--radius-card,18px)] border p-4 transition-all duration-300 select-none overflow-hidden min-h-[380px]"
      style={{
        borderColor: `${group.accentColor}42`,
      }}
      onPointerEnter={() => {
        userTouchedRef.current = true;
        setFanned(true);
      }}
      onPointerLeave={() => {
        setFanned(false);
        setHotIdx(-1);
      }}
    >
      {/* Top Group Header */}
      <div className="relative z-20 flex items-start justify-between gap-2.5 w-full min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide"
              style={{
                background: `${group.accentColor}20`,
                color: group.accentColor,
                border: `1px solid ${group.accentColor}40`,
              }}
            >
              {group.badge}
            </span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">
              {group.projects.length} dự án
            </span>
          </div>
          <h3
            className="typo-h4 card-title-synced font-bold font-play text-[var(--text-primary)] leading-snug truncate"
            data-card-title="true"
            title={group.title}
          >
            {group.title}
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)] line-clamp-1">
            {group.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            SoundEngine.playTap();
            userTouchedRef.current = true;
            setFanned((prev) => !prev);
            setHotIdx(-1);
          }}
          title={fanned ? 'Thu gọn bộ thẻ' : 'Xòe bộ thẻ (Fan Cards)'}
          aria-label={fanned ? 'Thu gọn bộ thẻ' : 'Xòe bộ thẻ'}
          className="h-8 px-2.5 rounded-full inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer border transition-colors shrink-0"
          style={{
            background: fanned ? group.accentColor : 'var(--bg-button-secondary, rgba(148,163,184,0.14))',
            color: fanned ? '#ffffff' : 'var(--text-primary)',
            borderColor: fanned ? group.accentColor : 'var(--border-subcard, rgba(148,163,184,0.26))',
          }}
        >
          <WebIcon name="layers" className="w-3.5 h-3.5" />
          <span>{fanned ? 'Thu thẻ' : 'Xòe thẻ'}</span>
        </button>
      </div>

      {/* Center Stage: DesignBookmark Fan Cards Interactive Stack */}
      <div
        className="db-fan-stage relative w-full h-[196px] my-2 flex items-center justify-center overflow-visible"
        role="region"
        aria-label={`Bộ thẻ ${group.title}`}
      >
        <div className="relative w-[138px] h-[168px]">
          {fanCards.map((proj, idx) => {
            const artGradient = FAN_CARD_ARTS[(group.artIndex + idx) % FAN_CARD_ARTS.length];
            const bannerInfo = getProjectCloudinaryBanner(proj);
            const cleanedTitle = proj.title.replace(/^[\d.]+\s*·\s*/, '').trim();
            const orderCode = proj.code || proj.number || `#${idx + 1}`;
            const isHot = fanned && hotIdx === idx;

            return (
              <button
                key={proj.id}
                ref={(el) => {
                  cardElsRef.current[idx] = el;
                }}
                type="button"
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  userTouchedRef.current = true;
                  if (!fannedRef.current) setFanned(true);
                  setHotIdx(idx);
                  setActiveProjectIdx(idx);
                }}
                onFocus={() => {
                  userTouchedRef.current = true;
                  setFanned(true);
                  setHotIdx(idx);
                  setActiveProjectIdx(idx);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  SoundEngine.playTap();
                  userTouchedRef.current = true;
                  if (!fannedRef.current) {
                    setFanned(true);
                    setHotIdx(idx);
                    setActiveProjectIdx(idx);
                    return;
                  }
                  onSelectProject(proj);
                }}
                style={{
                  transformOrigin: '50% 100%',
                  background: artGradient,
                  willChange: 'transform',
                  boxShadow: isHot
                    ? `0 16px 32px -8px rgba(0,0,0,0.55), 0 0 0 1.5px ${group.accentColor}`
                    : '0 10px 24px -10px rgba(0,0,0,0.48), inset 0 0 0 1px rgba(255,255,255,0.22)',
                }}
                className="db-fan-card absolute inset-0 w-[138px] h-[168px] rounded-[18px] p-3 flex flex-col justify-between text-left text-white overflow-hidden cursor-pointer select-none focus:outline-none"
                title={`${orderCode} · ${cleanedTitle} (Nhấn để mở chi tiết)`}
              >
                {/* Project Banner Image overlay with grainy mesh fallback */}
                {bannerInfo?.primaryUrl && (
                  <img
                    src={bannerInfo.primaryUrl}
                    alt={cleanedTitle}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity pointer-events-none"
                  />
                )}

                {/* Grainy SVG noise & bottom vignette matching DesignBookmark Fan Cards */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-90"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.22) 48%, rgba(0,0,0,0.74) 100%)',
                  }}
                />

                {/* Top Badge Row */}
                <div className="relative z-10 flex items-center justify-between gap-1 w-full">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-black/35 backdrop-blur-md border border-white/20 text-white/95">
                    {orderCode}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white/90">
                    <WebIcon name="arrow-up-right" className="w-3 h-3" />
                  </span>
                </div>

                {/* Bottom Title & Sub */}
                <div className="relative z-10 flex flex-col gap-0.5 min-w-0">
                  <span className="text-[12.5px] font-bold leading-tight tracking-tight text-white line-clamp-2 drop-shadow-xs">
                    {cleanedTitle}
                  </span>
                  <span className="text-[10.5px] font-medium text-white/75 truncate">
                    {proj.role || group.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Interactive Project Selector List */}
      <div className="relative z-20 flex flex-col gap-1.5 pt-2 border-t border-[var(--border-subcard,rgba(148,163,184,0.2))]">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: group.accentColor }}
            />
            <span className="text-[12.5px] font-bold text-[var(--text-primary)] truncate">
              {activeProject
                ? `${activeProject.code || activeProject.number} · ${activeProject.title.replace(/^[\d.]+\s*·\s*/, '').trim()}`
                : group.title}
            </span>
          </div>
          {activeProject && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playTap();
                onSelectProject(activeProject);
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 shrink-0"
              style={{
                background: `${group.accentColor}22`,
                color: group.accentColor,
                border: `1px solid ${group.accentColor}45`,
              }}
            >
              <span>Chi tiết</span>
              <WebIcon name="chevron-right" className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick project pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {group.projects.map((proj, pIdx) => {
            const isCurrent = pIdx === activeProjectIdx;
            const code = proj.code || proj.number || `#${pIdx + 1}`;
            return (
              <button
                key={proj.id}
                type="button"
                onPointerEnter={() => {
                  userTouchedRef.current = true;
                  setFanned(true);
                  if (pIdx < count) setHotIdx(pIdx);
                  setActiveProjectIdx(pIdx);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  SoundEngine.playTap();
                  onSelectProject(proj);
                }}
                className="px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 border"
                style={{
                  background: isCurrent
                    ? group.accentColor
                    : 'var(--bg-subcard, rgba(148,163,184,0.12))',
                  color: isCurrent ? '#ffffff' : 'var(--text-secondary)',
                  borderColor: isCurrent
                    ? group.accentColor
                    : 'var(--border-subcard, rgba(148,163,184,0.22))',
                }}
                title={proj.title}
              >
                {code}
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
};
