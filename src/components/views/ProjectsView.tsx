// Lucian UX/UI Prompt #308 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#308
// Lucian UX/UI Prompt #050 · MIT License (c) 2026 Seokwoooo · https://lucianlabs.dev/uxui-prompt/#050
'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS_DATA } from '@/data/projects';
import { getProjectCloudinaryBanner } from '@/utils/projectBanner';
import { ProjectData, SiteTheme } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { ProjectDetailView } from './ProjectDetailView';
import { useTheme } from '@/hooks/useTheme';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';
import { SpringDropdownMenu, SpringTick } from '@/components/ui/SpringDropdown';
import { ViewState } from '@/components/common/ViewState';
import { ProjectFanGroupCard, ProjectFanGroup } from './projects/ProjectFanGroupCard';

let projectsUxStyleInjected = false;

const PROJECTS_UX_308_050_CSS = `
/* Lucian UX/UI Prompt #308 (Grid-to-list morph) & #050 (Spotlight-tilt news card) */
#projects-page-container {
  --ux-surface: var(--surface-secondary-bg, var(--bg-subcard, #FFFFFF));
  --ux-surface-2: var(--surface-tertiary-bg, #F5F3EF);
  --ux-surface-3: rgba(148, 163, 184, 0.16);
  --ux-ink: var(--text-primary, #16151B);
  --ux-ink-2: var(--text-secondary, #57535F);
  --ux-ink-3: var(--text-muted, #8E8A97);
  --ux-line: var(--border-subcard, rgba(22, 21, 27, 0.09));
  --ux-line-2: rgba(22, 21, 27, 0.17);
  --ux-accent: var(--color-primary, #6A57F2);
  --ux-accent-2: #2F8FE0;
  --ux-accent-soft: color-mix(in srgb, var(--color-primary, #6A57F2) 14%, transparent);
  --ux-mint: #119C72;
  --ux-ease: cubic-bezier(.2, .8, .2, 1);
  --ux-spring: cubic-bezier(.34, 1.45, .64, 1);
}

/* #308 View Switcher Pill */
.u308-vs {
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  background: var(--ux-surface-2);
  border: 1px solid var(--ux-line);
  gap: 2px;
}
.u308-v {
  height: 30px;
  padding: 0 11px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  color: var(--ux-ink-3);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  transition: background 200ms, color 200ms;
}
.u308-v svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 1.9;
  fill: none;
  flex-shrink: 0;
}
.u308-v[aria-pressed="true"] {
  background: var(--bg-button-primary, var(--ux-accent));
  color: var(--text-button-primary, #FFFFFF);
  box-shadow: 0 2px 6px rgba(0, 0, 0, .12);
}

/* #308 List Layout Morph */
#projects-grid[data-view="list"] {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}
#projects-grid[data-view="list"] .u308-it {
  display: grid !important;
  grid-template-columns: minmax(190px, 240px) 1fr !important;
  align-items: stretch !important;
  padding: 10px !important;
  gap: 14px !important;
}
@media (max-width: 640px) {
  #projects-grid[data-view="list"] .u308-it {
    grid-template-columns: 1fr !important;
  }
}
#projects-grid[data-view="list"] .u308-it .u308-ph {
  width: 100% !important;
  margin: 0 !important;
  aspect-ratio: 16 / 10 !important;
  border-radius: 12px !important;
  border-bottom: 0 !important;
}
#projects-grid[data-view="list"] .u308-it .u308-ph img,
#projects-grid[data-view="list"] .u308-it .u308-ph .project-card-banner-scrim {
  border-radius: 12px !important;
}
.u308-ph {
  transform-origin: 0 0;
  will-change: transform;
}
.u308-list-extra {
  display: none;
}
#projects-grid[data-view="list"] .u308-list-extra {
  display: flex;
}

/* #050 Spotlight-Tilt Card */
.u050 {
  --mx: 50%;
  --my: 50%;
  --rx: 0deg;
  --ry: 0deg;
  --tx: 0px;
  --ty: 0px;
  --spot: 0;
  transform: perspective(900px) rotateX(var(--rx)) rotateY(var(--ry)) translate3d(var(--tx), var(--ty), 0);
  transition: transform 260ms cubic-bezier(.2, .8, .2, 1), box-shadow 260ms, border-color 220ms;
  will-change: transform;
}
.u050:hover {
  --spot: 1;
}
.u050::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: radial-gradient(240px circle at var(--mx) var(--my), var(--u050-accent, var(--ux-accent)), transparent 65%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: var(--spot);
  transition: opacity 240ms;
  pointer-events: none;
  z-index: 25;
}
.u050-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(280px circle at var(--mx) var(--my), rgba(255, 255, 255, .18), transparent 60%);
  opacity: var(--spot);
  transition: opacity 240ms;
  mix-blend-mode: overlay;
  z-index: 24;
}
.u050-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--u050-accent, var(--ux-accent));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--u050-accent, var(--ux-accent)) 24%, transparent);
  display: inline-block;
  flex-shrink: 0;
  transition: transform 320ms var(--ux-spring), opacity 240ms;
}
.u050[data-read="1"] .u050-dot {
  transform: scale(0);
  opacity: 0;
  width: 0;
  margin-right: -4px;
}
.u050[data-read="1"] .u050-h {
  opacity: 0.56;
  transition: opacity 260ms;
}
.u050-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid var(--ux-line);
  background: var(--ux-surface-2);
  color: var(--ux-ink);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 200ms, border-color 200ms, color 200ms, transform 140ms;
}
.u050-btn:hover {
  border-color: var(--u050-accent, var(--ux-accent));
}
.u050-btn:active {
  transform: scale(.96);
}
.u050[data-read="1"] .u050-btn {
  background: color-mix(in srgb, var(--ux-mint) 15%, transparent);
  color: var(--ux-mint);
  border-color: color-mix(in srgb, var(--ux-mint) 36%, transparent);
}
.u050-btn svg {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  stroke-width: 2.2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
`;

export interface ProjectCardGroup {
  id: string;
  code: string;
  filterKey: string;
  badgeText: string;
  fourWordTitle: string;
  pillText: string;
  desc: string;
  visualId: string;
  illustrationSrc: string;
  iconName: string;
  projects: ProjectData[];
}

const getByIds = (ids: string[]): ProjectData[] =>
  ids
    .map((id) => PROJECTS_DATA.find((p) => p.id === id))
    .filter((p): p is ProjectData => Boolean(p));

// Bảng màu sắc đa dạng độc bản cho từng thẻ dự án (đồng bộ với EducationView)
const DISTINCT_PROJECT_PALETTE = [
  '#10B981', // Emerald
  '#0EA5E9', // Sky Blue
  '#8B5CF6', // Violet
  '#F59E0B', // Amber
  '#EC4899', // Pink / Rose
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#A855F7', // Purple
  '#6366F1', // Indigo
  '#E11D48', // Crimson
];

function getProjectCardColor(idx: number): string {
  return DISTINCT_PROJECT_PALETTE[idx % DISTINCT_PROJECT_PALETTE.length];
}

function renderProjectCategoryIcon(categoryId: string, className = 'w-3.5 h-3.5 shrink-0') {
  switch (categoryId) {
    case 'strategy':
      return <WebIcon name="compass" className={className} />;
    case 'sop':
      return <WebIcon name="shield" className={className} />;
    case 'cx':
      return <WebIcon name="sparkles" className={className} />;
    case 'tech':
      return <WebIcon name="database" className={className} />;
    case 'learning':
      return <WebIcon name="graduation" className={className} />;
    case 'all':
    default:
      return <WebIcon name="grid" className={className} />;
  }
}

/**
 * Ánh xạ icon mô tả tương ứng dựa vào ID hoặc tên tiêu đề thẻ dự án
 */
export const getProjectIconByTitle = (proj: ProjectData): string => {
  switch (proj.id) {
    case 'p1_1':
      return 'building-2';
    case 'p1_2':
      return 'target';
    case 'p2_1':
      return 'clipboard-check';
    case 'p2_2':
      return 'share-2';
    case 'p2_3':
      return 'zap';
    case 'p2_4':
      return 'megaphone';
    case 'p3_1':
      return 'heart';
    case 'p3_2':
      return 'kanban';
    case 'p3_3':
      return 'lightbulb';
    case 'p3_4':
      return 'shield-alert';
    case 'p4_1':
      return 'database';
    case 'p4_2':
      return 'chart';
    case 'p4_3':
      return 'star';
    case 'p4_4':
      return 'bot';
    case 'p5_1':
      return 'graduation-cap';
    case 'p5_2':
      return 'trending-up';
    case 'p5_3':
      return 'headphones';
    case 'p5_4':
      return 'award';
    case 'p5_5':
      return 'refresh-cw';
    case 'p5_6':
      return 'brain';
  }

  const t = (proj.title || '').toLowerCase();
  if (t.includes('phòng dịch vụ khách hàng') || t.includes('xây dựng và vận hành phòng')) return 'building-2';
  if (t.includes('mục tiêu') || t.includes('okr') || t.includes('kpi')) return 'target';
  if (t.includes('chuẩn hóa') || t.includes('sop')) return 'clipboard-check';
  if (t.includes('kênh hỗ trợ') || t.includes('omnichannel')) return 'share-2';
  if (t.includes('tự động hóa') || t.includes('rpa')) return 'zap';
  if (t.includes('chiến dịch outbound') || t.includes('outbound')) return 'megaphone';
  if (t.includes('trải nghiệm') || t.includes('cjm')) return 'heart';
  if (t.includes('quản lý dự án') || t.includes('dự án dịch vụ')) return 'kanban';
  if (t.includes('cải tiến') || t.includes('voc')) return 'lightbulb';
  if (t.includes('khủng hoảng và giảm khách hàng rời bỏ') || t.includes('rời bỏ')) return 'shield-alert';
  if (t.includes('crm') || t.includes('quan hệ khách hàng')) return 'database';
  if (t.includes('phân tích') || t.includes('báo cáo')) return 'chart';
  if (t.includes('khảo sát') || t.includes('đánh giá')) return 'star';
  if (t.includes('ai bot') || t.includes('chatbot')) return 'bot';
  if (t.includes('đào tạo trực tuyến') || t.includes('lms')) return 'graduation-cap';
  if (t.includes('khung năng lực') || t.includes('lộ trình phát triển')) return 'trending-up';
  if (t.includes('trung tâm hỗ trợ') || t.includes('thành lập')) return 'headphones';
  if (t.includes('khách hàng làm trung tâm') || t.includes('tqa') || t.includes('copc')) return 'award';
  if (t.includes('quản trị sự thay đổi') || t.includes('khủng hoảng dịch vụ')) return 'refresh-cw';
  if (t.includes('trí tuệ nhân tạo') || t.includes('nâng cao hiệu suất')) return 'brain';

  return 'folder';
};

export const PROJECT_CARD_GROUPS: ProjectCardGroup[] = [
  {
    id: 'group-strategy',
    code: 'Nhóm 1',
    filterKey: 'strategy',
    badgeText: 'Nhóm Chiến lược & Cấu trúc Vận hành CSKH',
    fourWordTitle: 'Chiến Lược Vận Hành',
    pillText: '3 Dự án · 1.1 – 1.3',
    desc: 'Xây dựng và vận hành Phòng CSKH chuyên nghiệp (1.1), Thiết lập mục tiêu phòng ban theo OKR/KPI (1.2) và Quản trị dự án cải tiến vận hành (1.3).',
    visualId: '01',
    illustrationSrc: '/images/skills/ill-01.png',
    iconName: 'compass',
    projects: getByIds(['p1_1', 'p1_2', 'p3_2']),
  },
  {
    id: 'group-sop',
    code: 'Nhóm 2',
    filterKey: 'sop',
    badgeText: 'Nhóm Chuẩn hóa Quy trình & Vận hành Xuất sắc (SOP & Operational Excellence)',
    fourWordTitle: 'Chuẩn Hóa Quy Trình',
    pillText: '5 Dự án · 2.1 – 2.5',
    desc: 'Chuẩn hóa quy trình CSKH Visual SOP (2.1), Tối ưu hóa kênh hỗ trợ Omnichannel (2.2), Điều hành chiến dịch Outbound (2.3), Quản trị chất lượng đối tác BPO (2.4) và Quản trị thay đổi & ứng phó khủng hoảng (2.5).',
    visualId: '03',
    illustrationSrc: '/images/skills/ill-03.png',
    iconName: 'shield',
    projects: getByIds(['p2_1', 'p2_2', 'p2_4', 'p2_5', 'p5_5']),
  },
  {
    id: 'group-cx',
    code: 'Nhóm 3',
    filterKey: 'cx',
    badgeText: 'Nhóm Thiết kế Trải nghiệm Khách hàng (CX Design)',
    fourWordTitle: 'Trải Nghiệm Khách Hàng',
    pillText: '5 Dự án · 3.1 – 3.5',
    desc: 'Thiết kế hành trình khách hàng CJM (3.1), Phân tích phản hồi thúc đẩy cải tiến sản phẩm VoC (3.2), Ứng phó khủng hoảng & kiểm soát rời bỏ (3.3), Đo lường CSAT/NPS/CES (3.4) và Xây dựng văn hóa Customer-Centric COPC (3.5).',
    visualId: '02',
    illustrationSrc: '/images/skills/ill-02.png',
    iconName: 'sparkles',
    projects: getByIds(['p3_1', 'p3_3', 'p3_4', 'p4_3', 'p5_4']),
  },
  {
    id: 'group-tech',
    code: 'Nhóm 4',
    filterKey: 'tech',
    badgeText: 'Nhóm Công nghệ, Dữ liệu & AI CSKH (CS Tech, Data & AI)',
    fourWordTitle: 'Công Nghệ Data AI',
    pillText: '5 Dự án · 4.1 – 4.5',
    desc: 'Xây dựng nền tảng CRM & hồ sơ 360 (4.1), Phân tích dữ liệu báo cáo BI (4.2), Tự động hóa quy trình RPA (4.3), Phát triển Chatbot/Voicebot AI (4.4) và Ứng dụng AI Copilot/Auto-QA (4.5).',
    visualId: '04',
    illustrationSrc: '/images/skills/ill-04.png',
    iconName: 'database',
    projects: getByIds(['p4_1', 'p4_2', 'p2_3', 'p4_4', 'p5_6']),
  },
  {
    id: 'group-learning',
    code: 'Nhóm 5',
    filterKey: 'learning',
    badgeText: 'Nhóm Đào tạo, Phát triển & Văn hóa Dịch vụ (CS Learning & Culture)',
    fourWordTitle: 'Đào Tạo Văn Hóa',
    pillText: '3 Dự án · 5.1 – 5.3',
    desc: 'Phát triển CS Academy & đào tạo trực tuyến (5.1), Khung năng lực ASK & lộ trình nghề nghiệp (5.2) và Xây dựng Trung tâm hỗ trợ tự phục vụ (5.3).',
    visualId: '06',
    illustrationSrc: '/images/skills/ill-06.png',
    iconName: 'graduation',
    projects: getByIds(['p5_1', 'p5_2', 'p5_3']),
  },
];

export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'Tất cả dự án' },
  { id: 'strategy', label: 'Chiến lược vận hành' },
  { id: 'sop', label: 'Chuẩn hóa quy trình' },
  { id: 'cx', label: 'Trải nghiệm khách hàng' },
  { id: 'tech', label: 'Công nghệ trí tuệ' },
  { id: 'learning', label: 'Đào tạo phát triển' },
];

export interface ProjectsViewProps {
  currentTheme?: SiteTheme;
  requestedProject?: {
    projectId: string | null;
    returnTabIndex: number | null;
    nonce: number;
  } | null;
  onReturnToOrigin?: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  currentTheme = 'liquid-glass',
  requestedProject,
  onReturnToOrigin,
}) => {
  const { isDark: themeIsDark } = useTheme();
  const projectsBannerVideo = getDefaultBannerVideoConfig('projects');
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond';
  const isLight = !isDark;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<ProjectCardGroup | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ProjectData | null>(null);
  const [mindmapProject, setMindmapProject] = useState<ProjectData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('sec-mindmap');
  const [isBannerMuted, setIsBannerMuted] = useState<boolean>(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  // Lucian UX/UI #308 Grid-to-list morph state & #050 Spotlight-tilt read state
  const [viewLayoutMode, setViewLayoutMode] = useState<'grid' | 'list' | 'fan'>('grid');
  const [readProjectIds, setReadProjectIds] = useState<Record<string, boolean>>({});

  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const bannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const projectsGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined' && !projectsUxStyleInjected) {
      const styleEl = document.createElement('style');
      styleEl.id = 'lucian-ux-308-050-projects-styles';
      styleEl.textContent = PROJECTS_UX_308_050_CSS;
      document.head.appendChild(styleEl);
      projectsUxStyleInjected = true;
    }
  }, []);

  // Lucian UX/UI #308 Web Animations API FLIP morphing between Grid and List
  const handleSwitchViewLayout = useCallback(
    (nextMode: 'grid' | 'list' | 'fan') => {
      if (nextMode === viewLayoutMode) return;
      SoundEngine.playTap();
      if (nextMode === 'fan') {
        setViewLayoutMode('fan');
        return;
      }
      const gridEl = projectsGridRef.current;
      if (!gridEl) {
        setViewLayoutMode(nextMode);
        return;
      }
      const photos = Array.from(gridEl.querySelectorAll<HTMLElement>('.u308-ph'));
      const firstRects = photos.map((p) => p.getBoundingClientRect());

      setViewLayoutMode(nextMode);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const currentGrid = projectsGridRef.current;
          if (!currentGrid) return;
          const nextPhotos = Array.from(currentGrid.querySelectorAll<HTMLElement>('.u308-ph'));
          nextPhotos.forEach((p, i) => {
            const first = firstRects[i];
            if (!first || first.width === 0 || first.height === 0) return;
            const last = p.getBoundingClientRect();
            if (last.width === 0 || last.height === 0) return;
            const dx = first.left - last.left;
            const dy = first.top - last.top;
            const sx = first.width / last.width;
            const sy = first.height / last.height;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) {
              return;
            }
            p.animate(
              [
                { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
                { transform: 'translate(0, 0) scale(1, 1)' },
              ],
              {
                duration: 560,
                delay: i * 25,
                easing: 'cubic-bezier(.3,1.15,.4,1)',
              }
            );
          });

          if (nextMode === 'list') {
            const texts = Array.from(currentGrid.querySelectorAll<HTMLElement>('.u308-tx'));
            texts.forEach((t, i) => {
              t.animate(
                [
                  { opacity: 0, transform: 'translateX(-8px)' },
                  { opacity: 1, transform: 'translateX(0)' },
                ],
                {
                  duration: 320,
                  delay: 300 + i * 30,
                  easing: 'cubic-bezier(.2,.8,.2,1)',
                  fill: 'both',
                }
              );
            });
          }
        });
      });
    },
    [viewLayoutMode]
  );

  // Lucian UX/UI #050 Pointer tilt & radial spotlight handler
  const handleCardPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const px = x / r.width - 0.5;
    const py = y / r.height - 0.5;
    el.style.setProperty('--mx', `${x.toFixed(1)}px`);
    el.style.setProperty('--my', `${y.toFixed(1)}px`);
    el.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-py * 9).toFixed(2)}deg`);
    el.style.setProperty('--tx', `${(px * 4).toFixed(2)}px`);
    el.style.setProperty('--ty', `${(py * 4).toFixed(2)}px`);
  }, []);

  const handleCardPointerLeave = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.style.setProperty('--tx', '0px');
    el.style.setProperty('--ty', '0px');
  }, []);

  const handleToggleProjectRead = useCallback((e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    SoundEngine.playTap();
    setReadProjectIds((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (mindmapProject) {
        setMindmapProject(null);
      } else if (isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
      } else if (selectedArticle || selectedGroup) {
        setSelectedArticle(null);
        setSelectedGroup(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mindmapProject, isFilterDropdownOpen, selectedArticle, selectedGroup]);

  // Tự động kiểm tra URL / Hash để mở trang chi tiết dự án tương ứng
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const projParam = urlParams.get('project') || urlParams.get('duan');
      const hashParam = window.location.hash.replace('#', '').replace('project-', '');
      const searchKey = projParam || hashParam;

      if (searchKey) {
        const allSearchableProjects = PROJECTS_DATA;
        const foundProj = allSearchableProjects.find(
          (p) =>
            p.id.toLowerCase() === searchKey.toLowerCase() ||
            p.code.toLowerCase() === searchKey.toLowerCase() ||
            p.number.toLowerCase() === searchKey.toLowerCase()
        );
        if (foundProj) {
          const parentGroup = getParentGroupForProject(foundProj);
          setSelectedGroup(parentGroup);
          setSelectedArticle(foundProj);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Mở trực tiếp dự án khi điều hướng từ Chi tiết công việc (ExperienceView)
  useEffect(() => {
    if (!requestedProject) return;
    if (!requestedProject.projectId) {
      setSelectedGroup(null);
      setSelectedArticle(null);
      return;
    }
    const foundProj = PROJECTS_DATA.find(
      (p) =>
        p.id.toLowerCase() === requestedProject.projectId!.toLowerCase() ||
        p.code.toLowerCase() === requestedProject.projectId!.toLowerCase()
    );
    if (foundProj) {
      const parentGroup = getParentGroupForProject(foundProj);
      setSelectedGroup(parentGroup);
      setSelectedArticle(foundProj);
    }
  }, [requestedProject]);

  useEffect(() => {
    if (selectedArticle) {
      setActiveSection('sec-mindmap');
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('project', selectedArticle.code);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    } else {
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('project');
        url.searchParams.delete('duan');
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }
  }, [selectedArticle]);

  // Bộ màu trực quan theo phân hệ (tương thích DomainsView & SkillsView)
  const getCardVisualConfig = (visualId: string) => {
    switch (visualId) {
      case '01': // Chiến lược - Sky Blue
        return {
          accentColor: isLight ? '#0284c7' : '#38bdf8',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f0f7fe 0%, #ddf0fd 30%, #c4e2fa 65%, #beddf9 100%)'
            : 'linear-gradient(135deg, rgba(12, 74, 110, 0.52) 0%, rgba(15, 23, 42, 0.86) 100%)',
          cardBorder: isLight
            ? 'border-[#93c5fd]/90 hover:border-[#38bdf8]'
            : 'border-sky-400/45 hover:border-sky-300',
          ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(190, 221, 249, 0.95) 0%, rgba(196, 226, 250, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#0284c7]' : 'text-sky-300',
          pillBg: isLight
            ? 'bg-sky-100/90 border-sky-200/90 text-[#0369a1]'
            : 'bg-sky-950/80 border-sky-500/40 text-sky-200',
          arrowBg: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          arrowShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
        };
      case '02': // CX Design - Warm Orange / Amber
        return {
          accentColor: isLight ? '#ea580c' : '#fb923c',
          cardBg: isLight
            ? 'linear-gradient(135deg, #fffcf7 0%, #fef1e2 30%, #fccc9b 65%, #fbd2a6 100%)'
            : 'linear-gradient(135deg, rgba(124, 45, 18, 0.48) 0%, rgba(15, 23, 42, 0.86) 100%)',
          cardBorder: isLight
            ? 'border-[#fdba74]/90 hover:border-[#fb923c]'
            : 'border-orange-400/45 hover:border-orange-300',
          ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(251, 210, 166, 0.95) 0%, rgba(252, 204, 155, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#ea580c]' : 'text-orange-300',
          pillBg: isLight
            ? 'bg-orange-100/80 border-orange-200/90 text-[#c2410c]'
            : 'bg-orange-950/80 border-orange-500/40 text-orange-200',
          arrowBg: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
          arrowShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
        };
      case '03': // SOP & BPO - Rose / Ruby
        return {
          accentColor: isLight ? '#e11d48' : '#fb7185',
          cardBg: isLight
            ? 'linear-gradient(135deg, #fff7f6 0%, #feeae5 30%, #fdd8cf 65%, #f9b3b1 100%)'
            : 'linear-gradient(135deg, rgba(136, 19, 55, 0.48) 0%, rgba(15, 23, 42, 0.86) 100%)',
          cardBorder: isLight
            ? 'border-[#fca5a5]/90 hover:border-[#f43f5e]'
            : 'border-rose-400/45 hover:border-rose-300',
          ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(253, 216, 207, 0.95) 0%, rgba(249, 179, 177, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#e11d48]' : 'text-rose-300',
          pillBg: isLight
            ? 'bg-rose-100/80 border-rose-200/90 text-[#be123c]'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200',
          arrowBg: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
          arrowShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
        };
      case '04': // Tech & AI - Purple / Violet
        return {
          accentColor: isLight ? '#7c3aed' : '#c084fc',
          cardBg: isLight
            ? 'linear-gradient(135deg, #faf8fe 0%, #ede8fe 30%, #d9d0fb 65%, #c5b5f9 100%)'
            : 'linear-gradient(135deg, rgba(88, 28, 135, 0.52) 0%, rgba(15, 23, 42, 0.86) 100%)',
          cardBorder: isLight
            ? 'border-[#c4b5fd]/90 hover:border-[#a855f7]'
            : 'border-purple-400/45 hover:border-purple-300',
          ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(217, 208, 251, 0.95) 0%, rgba(157, 126, 243, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#7c3aed]' : 'text-purple-300',
          pillBg: isLight
            ? 'bg-purple-100/80 border-purple-200/90 text-[#5b21b6]'
            : 'bg-purple-950/80 border-purple-500/40 text-purple-200',
          arrowBg: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
          arrowShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
        };
      case '06': // Learning & Culture - Mint / Emerald
      default:
        return {
          accentColor: isLight ? '#059669' : '#34d399',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f3fbfa 0%, #dff4f2 30%, #b1dfdd 65%, #abd9d6 100%)'
            : 'linear-gradient(135deg, rgba(6, 78, 59, 0.52) 0%, rgba(15, 23, 42, 0.86) 100%)',
          cardBorder: isLight
            ? 'border-[#6ee7b7]/90 hover:border-[#10b981]'
            : 'border-emerald-400/45 hover:border-emerald-300',
          ambientGlow: 'radial-gradient(circle at 75% 50%, rgba(171, 217, 214, 0.95) 0%, rgba(177, 223, 221, 0.5) 55%, transparent 75%)',
          titleColor: isLight ? 'text-[#059669]' : 'text-emerald-300',
          pillBg: isLight
            ? 'bg-emerald-100/80 border-emerald-200/90 text-[#047857]'
            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
          arrowBg: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
          arrowShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
        };
    }
  };

  const getVisualConfigForProject = (proj: ProjectData) => {
    if (proj.groupKey === 'strategy') return getCardVisualConfig('01');
    if (proj.groupKey === 'sop') return getCardVisualConfig('03');
    if (proj.groupKey === 'cx') return getCardVisualConfig('02');
    if (proj.groupKey === 'tech') return getCardVisualConfig('04');
    if (proj.groupKey === 'learning') return getCardVisualConfig('06');
    return getCardVisualConfig('01');
  };

  const getParentGroupForProject = (proj: ProjectData): ProjectCardGroup => {
    return (
      PROJECT_CARD_GROUPS.find((g) => g.projects.some((p) => p.id === proj.id)) ||
      PROJECT_CARD_GROUPS[0]
    );
  };

  // Lọc danh sách dự án theo danh mục & từ khóa tìm kiếm
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PROJECTS_DATA.filter((p) => {
      const matchCat = activeCategory === 'all' || p.groupKey === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = `${p.title} ${p.code} ${p.role} ${p.description} ${(p.hashtags || []).join(' ')}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, searchQuery]);

  const handleOpenGroup = (group: ProjectCardGroup, initialProject?: ProjectData) => {
    SoundEngine.playTap();
    setSelectedGroup(group);
    setSelectedArticle(initialProject || group.projects[0] || null);
  };

  const handleCloseDetail = () => {
    SoundEngine.playTap();
    setSelectedArticle(null);
    setSelectedGroup(null);
  };

  const handleToggleBannerMute = () => {
    const video = bannerVideoRef.current;
    if (!video) return;
    const next = !isBannerMuted;
    setIsBannerMuted(next);
    video.muted = next;
  };

  return (
    <div
      id="projects-page-container"
      data-element-name="Trang Dự Án & Sản Phẩm"
      data-element-type="container"
      data-element-page="projects"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-text text-left rounded-none text-[var(--text-primary)] box-border"
    >
      <div
        id="projects-cards-track"
        data-element-name="Track căn giữa Dự Án"
        data-element-type="container"
        data-element-page="projects"
        data-element-parent="projects-page-container"
        className="page-cards-track"
      >
        <div
          id="projects-main-card"
          data-main-card="true"
          data-floating-surface="main"
          data-detail-open={selectedArticle ? 'true' : 'false'}
          data-detail-overlay="true"
          data-element-name="Thẻ chính Trang Dự Án"
          data-element-type="card"
          data-element-page="projects"
          data-element-parent="projects-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[var(--space-main-padding,20px)] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play select-none text-left text-[var(--text-primary)] box-border"
        >
          <div
            id="projects-main-scroll-viewport"
            className={cn(
              'main-card-scroll-viewport w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[var(--space-card-gap,16px)] overflow-x-hidden no-scrollbar box-border',
              selectedGroup || selectedArticle ? 'overflow-hidden' : 'overflow-y-auto'
            )}
          >
          <div
            id="projects-main-wrapper"
            className={cn(
              'w-full max-w-full min-w-0 flex-1 flex flex-col gap-[var(--space-card-gap,16px)] justify-start box-border',
              (selectedGroup || selectedArticle) && 'h-full flex-1 min-h-0 gap-0'
            )}
          >
      {/* Khi chưa chọn xem chi tiết dự án: Hiển thị Hero Banner và Danh sách thẻ dự án */}
      {!selectedGroup && !selectedArticle ? (
        <>
          {onReturnToOrigin && (
            <button
              id="projects-list-return-btn"
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                onReturnToOrigin();
              }}
              className="banner-control-pill self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-bold font-play transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
              title="Quay lại trang đang xem"
            >
              <WebIcon name="arrow-left" className="w-4 h-4 shrink-0" />
              <span>Quay lại trang đang xem</span>
            </button>
          )}
          {/* BANNER DỰ ÁN: Đồng bộ chuẩn banner Học vấn (h-200px desktop, master padding token, rounded-banner) */}
          <section
            id="projects-hero-banner"
            data-element-name="Banner card"
            data-element-type="banner-card"
            data-element-page="projects"
            data-section-card="true"
            data-has-compact-menu="true"
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-0 rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[var(--space-card-padding,16px)] z-30 transition-all duration-300 box-border"
            style={{ padding: 'var(--space-card-padding, 16px)', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 14px)', boxSizing: 'border-box' }}
          >
            <div
              className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
            >
              <VideoBanner
                videoId={projectsBannerVideo.videoId}
                title={projectsBannerVideo.title}
                className="rounded-[inherit]"
              />
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            <div className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
              <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                <WebIcon name="folder" className="w-[22px] h-[22px] shrink-0" />
                <h1
                  className="typo-h3 card-title-synced font-bold font-play not-italic tracking-tight truncate"
                  data-card-title="true"
                  style={{ fontWeight: 700, textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
                >
                  Danh sách dự án
                </h1>
              </div>
              <p
                className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
                style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 600, fontStyle: 'normal' }}
              >
                &quot;Khát vọng đổi mới, ghi dấu giá trị thực tiễn ♡&quot;
              </p>

              <CompactBannerMenu
                id="projects-compact-menu-btn"
                label="Điều khiển"
                ariaLabel="Bộ lọc và tìm kiếm dự án"
                activeCount={(activeCategory !== 'all' ? 1 : 0) + (searchQuery.trim() ? 1 : 0)}
              >
                {(closeMenu) => (
                  <>
                    <div className="relative w-full">
                      <WebIcon
                        name="search"
                        className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                      <input
                        id="projects-compact-search-input"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm tên, mã dự án..."
                        aria-label="Tìm kiếm dự án"
                        className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-input font-normal font-play focus:outline-none"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          aria-label="Xóa từ khóa tìm kiếm"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                        >
                          <WebIcon name="cancel" className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="typo-label text-[var(--text-muted)] px-1">Nhóm dự án</span>
                      {PROJECT_CATEGORIES.map((cat) => {
                        const isSelected = activeCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            data-selected={isSelected ? 'true' : undefined}
                            onClick={() => {
                              SoundEngine.playTap();
                              setActiveCategory(cat.id);
                              closeMenu();
                            }}
                            className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                          >
                            <span className="flex items-center gap-2 truncate">
                              {renderProjectCategoryIcon(cat.id, 'w-3.5 h-3.5 shrink-0')}
                              <span className="truncate">{cat.label}</span>
                            </span>
                            {isSelected && <WebIcon name="check" className="w-3.5 h-3.5 text-current shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </CompactBannerMenu>
            </div>

            <div
              id="projects-hero-banner-controls"
              ref={filterMenuRef}
              className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto w-full"
            >
              <div className="relative inline-block text-left">
                <button
                  id="projects-filter-toggle-btn"
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setIsFilterDropdownOpen((prev) => !prev);
                  }}
                  className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play group"
                  title="Bộ lọc dự án"
                  aria-label="Bộ lọc dự án"
                  aria-expanded={isFilterDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <WebIcon name="sliders" className="w-4 h-4 shrink-0" />
                  <span>Bộ lọc dự án</span>
                  {activeCategory !== 'all' && (
                    <span className="banner-count-pill px-2 py-0.5 rounded-full border typo-badge font-play font-semibold">
                      {PROJECT_CATEGORIES.find((c) => c.id === activeCategory)?.label}
                    </span>
                  )}
                  <WebIcon
                    name="chevron-down"
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
                      isFilterDropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isFilterDropdownOpen && (
                    <SpringDropdownMenu
                      id="projects-filter-listbox"
                      data-element-type="card"
                      placement="down"
                      origin="0% 0%"
                      role="listbox"
                      className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                    >
                      {PROJECT_CATEGORIES.map((cat) => {
                        const isSelected = activeCategory === cat.id;

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            data-selected={isSelected ? 'true' : undefined}
                            onClick={() => {
                              SoundEngine.playTap();
                              setActiveCategory(cat.id);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={cn(
                              'theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-semibold font-play transition-all cursor-pointer text-left',
                              isSelected ? 'shadow-xs font-bold' : ''
                            )}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
                                style={{
                                  background: isSelected ? 'var(--color-primary)' : 'var(--bg-button-secondary)',
                                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                                }}
                              >
                                {renderProjectCategoryIcon(cat.id, 'w-3 h-3')}
                              </span>
                              <span className="truncate">{cat.label}</span>
                            </span>
                            <span className="flex items-center gap-1.5 shrink-0">
                              {isSelected && <SpringTick active={isSelected} />}
                            </span>
                          </button>
                        );
                      })}
                    </SpringDropdownMenu>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end ml-auto max-w-full">
                <div className="relative flex-1 sm:w-52 sm:flex-initial min-w-[160px]">
                  <WebIcon
                    name="search"
                    className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    id="projects-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên, mã dự án..."
                    aria-label="Tìm kiếm dự án"
                    className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-input font-normal font-play focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Xóa từ khóa tìm kiếm"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-75 hover:opacity-100 cursor-pointer"
                    >
                      <WebIcon name="cancel" className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Lucian UX/UI #308 Grid-to-list morph switcher */}
                <div
                  className="u308-vs shrink-0"
                  role="group"
                  aria-label="Chuyển đổi chế độ hiển thị Lưới hoặc Danh sách"
                >
                  <button
                    id="projects-view-grid-btn"
                    type="button"
                    className="u308-v"
                    data-v="grid"
                    aria-pressed={viewLayoutMode === 'grid'}
                    aria-label="Chế độ dạng lưới (Grid view)"
                    title="Hiển thị dạng lưới (Grid)"
                    onClick={() => handleSwitchViewLayout('grid')}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <rect x="2" y="2" width="5" height="5" rx="1.2" />
                      <rect x="9" y="2" width="5" height="5" rx="1.2" />
                      <rect x="2" y="9" width="5" height="5" rx="1.2" />
                      <rect x="9" y="9" width="5" height="5" rx="1.2" />
                    </svg>
                    <span className="hidden sm:inline">Lưới</span>
                  </button>
                  <button
                    id="projects-view-list-btn"
                    type="button"
                    className="u308-v"
                    data-v="list"
                    aria-pressed={viewLayoutMode === 'list'}
                    aria-label="Chế độ dạng danh sách (List view)"
                    title="Hiển thị dạng danh sách (List)"
                    onClick={() => handleSwitchViewLayout('list')}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <rect x="2" y="2.5" width="3.5" height="3.5" rx="1" />
                      <path d="M8 4.2h6" />
                      <rect x="2" y="10" width="3.5" height="3.5" rx="1" />
                      <path d="M8 11.7h6" />
                    </svg>
                    <span className="hidden sm:inline">Danh sách</span>
                  </button>
                  <button
                    id="projects-view-fan-btn"
                    type="button"
                    className="u308-v"
                    data-v="fan"
                    aria-pressed={viewLayoutMode === 'fan'}
                    aria-label="Giai đoạn / Nhóm theo chiến dịch (Fan Card)"
                    title="Giai đoạn / Nhóm theo chiến dịch (Fan Card)"
                    onClick={() => handleSwitchViewLayout('fan')}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true">
                      <path d="M2 12l4-8 4 8M6 8h8" />
                    </svg>
                    <span className="hidden sm:inline">Giai đoạn / Nhóm theo chiến dịch</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* NỘI DUNG CHÍNH: DẠNG LƯỚI, DANH SÁCH HOẶC FAN CARD */}
          {viewLayoutMode === 'fan' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full py-4">
              {PROJECT_CARD_GROUPS.map((group, idx) => {
                const fanGroup: ProjectFanGroup = {
                  id: group.id,
                  title: group.fourWordTitle,
                  subtitle: group.badgeText,
                  badge: group.code,
                  accentColor: getCardVisualConfig(group.visualId).accentColor,
                  artIndex: (idx % 12) + 1,
                  projects: group.projects,
                };
                return (
                  <ProjectFanGroupCard
                    key={group.id}
                    group={fanGroup}
                    groupIdx={idx}
                    isDark={isDark}
                    onSelectProject={(proj) => {
                      const parentGroup = PROJECT_CARD_GROUPS.find((g) => g.projects.some((p) => p.id === proj.id)) || null;
                      setSelectedGroup(parentGroup);
                      setSelectedArticle(proj);
                    }}
                  />
                );
              })}
            </div>
          ) : filteredProjects.length === 0 ? (
            <ViewState
              variant="empty"
              icon="folder-kanban"
              title="Không tìm thấy dự án nào khớp với bộ lọc hiện tại."
              actionLabel={`Hiển thị tất cả ${PROJECTS_DATA.length} dự án`}
              onAction={() => {
                SoundEngine.playTap();
                setActiveCategory('all');
                setSearchQuery('');
              }}
            />
          ) : (
          <div
            id="projects-grid"
            ref={projectsGridRef}
            data-view={viewLayoutMode}
            className="unified-cards-grid projects-grid projects-responsive-grid card-grid u308-list w-full min-w-0 items-stretch"
          >
            {filteredProjects.map((proj, idx) => {
              const parentGroup = getParentGroupForProject(proj);
              const bannerInfo = getProjectCloudinaryBanner(proj);
              const cleanedTitle = proj.title.replace(/^[\d.]+\s*·\s*/, '').trim();
              const orderNumber = proj.code || proj.number || (proj.title.match(/^[\d.]+/)?.[0]) || '';
              const cardColor = getProjectCardColor(idx);
              const progressPct = typeof proj.progressPercent === 'number' ? proj.progressPercent : 100;
              const isRead = Boolean(readProjectIds[proj.id]);

              return (
                <motion.article
                  id={`project-card-${proj.id}`}
                  key={proj.id}
                  data-element-type="card"
                  data-section-card="true"
                  data-read={isRead ? '1' : '0'}
                  role="button"
                  tabIndex={0}
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={handleCardPointerLeave}
                  onClick={() => {
                    handleOpenGroup(parentGroup, proj);
                    document.getElementById('projects-main-scroll-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenGroup(parentGroup, proj);
                      document.getElementById('projects-main-scroll-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="project-card card-item bento-card glass-card u050 u308-it group relative h-full p-0 flex flex-col justify-between border select-none cursor-pointer font-play min-w-0 overflow-hidden"
                  style={
                    {
                      borderColor: `${cardColor}45`,
                      padding: 0,
                      '--u050-accent': cardColor,
                    } as React.CSSProperties
                  }
                >
                  {/* Lucian UX/UI #050 Radial Surface Glare */}
                  <div className="u050-glare" aria-hidden="true" />

                  {/* 1. Ảnh bìa thẻ Dự án (.u308-ph cho FLIP morphing giữa Grid và List) */}
                  <div
                    data-media-card="image"
                    className="project-card-banner u308-ph relative w-[calc(100%-4px)] m-[2px] mb-0 aspect-[16/10] overflow-hidden bg-[var(--surface-tertiary-bg,var(--bg-subcard))] shrink-0 group/img p-0 box-border rounded-bl-none rounded-br-none border-0 border-b border-[var(--border-subcard)]"
                  >
                    <img
                      src={bannerInfo.primaryUrl}
                      alt={cleanedTitle}
                      title={bannerInfo.imageName}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (bannerInfo.fallbackUrl && e.currentTarget.src !== bannerInfo.fallbackUrl) {
                          e.currentTarget.src = bannerInfo.fallbackUrl;
                        } else {
                          e.currentTarget.src =
                            'https://i.postimg.cc/fRLM4D4K/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.webp';
                        }
                      }}
                      className="w-full h-full object-cover object-center rounded-bl-none rounded-br-none block m-0 p-0 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="project-card-banner-scrim absolute inset-0 pointer-events-none rounded-bl-none rounded-br-none"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(15, 23, 42, 0.38) 0%, rgba(15, 23, 42, 0.04) 45%, rgba(15, 23, 42, 0.6) 100%)',
                      }}
                    />
                    <span
                      className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-badge font-semibold text-white bg-slate-950/60 border border-white/25 backdrop-blur-md max-w-[64%] truncate pointer-events-none"
                    >
                      <span className="u050-dot" aria-hidden="true" />
                      <WebIcon name="layers" className="w-3 h-3 shrink-0" style={{ color: '#38BDF8' }} />
                      <span className="truncate">{parentGroup.fourWordTitle}</span>
                    </span>
                    <span
                      className="project-card-code-badge education-year-badge banner-control-pill absolute top-2.5 right-2.5 z-20 typo-badge font-mono px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-semibold"
                    >
                      <WebIcon name="folder" className="w-3 h-3 shrink-0" style={{ color: 'var(--text-link, var(--color-primary))' }} />
                      <span>Giai đoạn</span>
                    </span>
                  </div>

                  {/* 2. Thân thẻ Dự án (.u308-tx cho hiệu ứng trượt chữ khi sang List) */}
                  <div className="project-card-body project-card__content u308-tx flex-1 flex flex-col justify-between gap-[var(--space-subcard-gap,12px)] p-[var(--grid-cards-padding,var(--space-card-padding,16px))] min-w-0">
                    <div className="min-w-0 flex flex-col gap-1.5">
                      <div className="card-header-sync w-full min-w-0 min-h-[2.85em]" style={{ color: cardColor }}>
                        <h3
                          className={cn(
                            'u050-h typo-h4 card-title-synced font-play font-bold leading-snug m-0 p-0 w-full min-w-0 text-left block',
                            viewLayoutMode === 'grid' ? 'line-clamp-2' : 'line-clamp-none'
                          )}
                          data-card-title="true"
                          style={{
                            color: cardColor,
                            display: 'block',
                            textWrap: 'wrap',
                            wordBreak: 'normal',
                            overflowWrap: 'break-word',
                          }}
                          title={`${orderNumber ? `${orderNumber} · ` : ''}${cleanedTitle}`}
                        >
                          {orderNumber && (
                            <span className="font-mono font-bold mr-1.5 opacity-90 inline">
                              {orderNumber}
                            </span>
                          )}
                          <WebIcon
                            name={getProjectIconByTitle(proj)}
                            className="w-4 h-4 inline align-[-2px] mr-1.5 shrink-0"
                            style={{ color: cardColor }}
                          />
                          <span className="inline">{cleanedTitle}</span>
                        </h3>
                      </div>

                      <p
                        className={cn(
                          'typo-caption text-[var(--text-secondary)] leading-relaxed break-words m-0',
                          viewLayoutMode === 'grid' ? 'line-clamp-2' : 'line-clamp-3'
                        )}
                      >
                        {proj.description}
                      </p>

                      {/* Thông tin mở rộng chỉ hiển thị ở chế độ Danh sách (List view #308) */}
                      <div className="u308-list-extra flex-wrap items-center gap-1.5 pt-1">
                        {proj.role && (
                          <span className="px-2.5 py-0.5 rounded-full typo-badge font-semibold bg-[var(--bg-subcard)] border border-[var(--border-subcard)] text-[var(--text-primary)]">
                            Vai trò: {proj.role}
                          </span>
                        )}
                        {(proj.hashtags || []).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full typo-badge font-mono text-[var(--text-secondary)] bg-[var(--bg-subcard)]/70 border border-[var(--border-subcard)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="project-card__actions mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-subcard)] min-w-0">
                      <div className="flex items-center gap-2 min-w-[90px] flex-1">
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--pillar-progress-track,rgba(148,163,184,0.28))] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%`, backgroundColor: cardColor }}
                          />
                        </div>
                        <span className="typo-badge font-mono font-bold tabular-nums shrink-0" style={{ color: cardColor }}>
                          {progressPct}%
                        </span>
                      </div>

                      {/* Lucian UX/UI #050 Mark as read toggle button */}
                      <button
                        type="button"
                        className="u050-btn shrink-0"
                        aria-pressed={isRead}
                        title={isRead ? 'Bấm để hoàn tác trạng thái chưa xem' : 'Đánh dấu đã xem dự án này'}
                        onClick={(e) => handleToggleProjectRead(e, proj.id)}
                      >
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          {isRead ? (
                            <path d="M3 8.5l3.2 3.2L13 5" />
                          ) : (
                            <circle cx="8" cy="8" r="5" />
                          )}
                        </svg>
                        <span>{isRead ? 'Đã xem' : 'Đánh dấu xem'}</span>
                      </button>

                      <span
                        className="inline-flex items-center gap-1 typo-caption font-bold shrink-0 group-hover:translate-x-0.5 transition-transform"
                        style={{ color: cardColor }}
                      >
                        <span>Chi tiết</span>
                        <WebIcon name="arrow-right" className="w-3.5 h-3.5 shrink-0" style={{ color: cardColor }} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
          )}
        </>
      ) : (
        /* 3. CHI TIẾT DỰ ÁN & HỒ SƠ STAR TOÀN DIỆN */
        selectedArticle && (
          <div className="w-full h-full min-h-full max-h-full flex-1 min-h-0 relative flex flex-col overflow-hidden rounded-[inherit]">
            <button
              id="project-detail-close-btn"
              type="button"
              onClick={handleCloseDetail}
              title="Đóng bài viết"
              aria-label="Đóng bài viết chi tiết dự án"
              className="theme-modal-close absolute top-3 right-3 z-50 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-105 shrink-0"
            >
              <WebIcon name="x" className="w-4 h-4" />
            </button>

            <ProjectDetailView
              selectedArticle={selectedArticle}
              onClose={handleCloseDetail}
              onOpenMindmap={(proj) => setMindmapProject(proj)}
              getCardVisualConfig={getCardVisualConfig}
              isLight={isLight}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        )
      )}
          </div>
        </div>
      </div>
      </div>

      {/* Mindmap Lightbox Modal */}
      {mindmapProject && (
        <Modal
          isOpen={!!mindmapProject}
          onClose={() => setMindmapProject(null)}
          title={`Sơ đồ tư duy: ${mindmapProject.title} (${mindmapProject.code})`}
          maxWidth="5xl"
        >
          <div className="p-4 sm:p-5 flex flex-col gap-3">
            <div
              style={{ borderRadius: 'var(--radius-card, 14px)' }}
              className="themed-image-frame bg-[var(--surface-tertiary-bg,var(--bg-subcard))] p-3 sm:p-5 flex items-center justify-center overflow-auto horizontal-scroll-smooth no-scrollbar max-h-[75vh]"
            >
              <img
                src={mindmapProject.mindmap || mindmapProject.image}
                alt="Sơ đồ tư duy"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[70vh] object-contain rounded-[inherit] shadow-lg"
              />
            </div>
            <div className="flex items-center justify-between typo-caption text-[var(--text-secondary)] pt-1">
              <span>{mindmapProject.groupTitle}</span>
              <a
                href={mindmapProject.mindmap || mindmapProject.image}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                className="px-3.5 py-1.5 rounded-full font-bold typo-button hover:opacity-90 transition inline-flex items-center gap-1.5"
              >
                <span>Mở ảnh gốc trong tab mới</span>
                <WebIcon name="external-link" className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};