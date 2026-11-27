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
import { ViewState } from '@/components/common/ViewState';

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
  const [viewMode, setViewMode] = useState<'grid' | 'slider' | 'stack'>('slider');
  const [selectedGroup, setSelectedGroup] = useState<ProjectCardGroup | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ProjectData | null>(null);
  const [mindmapProject, setMindmapProject] = useState<ProjectData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('sec-mindmap');
  const [isBannerMuted, setIsBannerMuted] = useState<boolean>(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(0);
  const [hoveredSlotIdx, setHoveredSlotIdx] = useState<number | null>(null);
  const [disableTrackTransition, setDisableTrackTransition] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [slideWidth, setSlideWidth] = useState<number>(0);
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isDraggingTrack, setIsDraggingTrack] = useState<boolean>(false);

  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const bannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrpRef = useRef<HTMLDivElement>(null);
  const slotSlideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slotItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragStartXRef = useRef<number | null>(null);
  const dragDeltaXRef = useRef<number>(0);
  const didDragRef = useRef<boolean>(false);
  const wheelCooldownRef = useRef<number>(0);
  const wheelAccumRef = useRef<number>(0);
  const snapTimerRef = useRef<number | null>(null);

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

  const totalProjects = filteredProjects.length;
  const useLoopClones = totalProjects >= 3;
  const clonePad = useLoopClones ? 3 : 0;

  const extendedSlides = useMemo(() => {
    if (totalProjects === 0) return [];
    if (!useLoopClones) {
      return filteredProjects.map((proj, idx) => ({
        proj,
        origIdx: idx,
        slotKey: `real-${proj.id}`,
        isClone: false,
      }));
    }
    const pre3Idx = (totalProjects - 3 + totalProjects) % totalProjects;
    const pre2Idx = totalProjects - 2;
    const pre1Idx = totalProjects - 1;
    const post2Idx = 2 % totalProjects;
    return [
      {
        proj: filteredProjects[pre3Idx],
        origIdx: pre3Idx,
        slotKey: `clone-pre-3-${filteredProjects[pre3Idx].id}`,
        isClone: true,
      },
      {
        proj: filteredProjects[pre2Idx],
        origIdx: pre2Idx,
        slotKey: `clone-pre-2-${filteredProjects[pre2Idx].id}`,
        isClone: true,
      },
      {
        proj: filteredProjects[pre1Idx],
        origIdx: pre1Idx,
        slotKey: `clone-pre-1-${filteredProjects[pre1Idx].id}`,
        isClone: true,
      },
      ...filteredProjects.map((proj, idx) => ({
        proj,
        origIdx: idx,
        slotKey: `real-${proj.id}`,
        isClone: false,
      })),
      {
        proj: filteredProjects[0],
        origIdx: 0,
        slotKey: `clone-post-0-${filteredProjects[0].id}`,
        isClone: true,
      },
      {
        proj: filteredProjects[1],
        origIdx: 1,
        slotKey: `clone-post-1-${filteredProjects[1].id}`,
        isClone: true,
      },
      {
        proj: filteredProjects[post2Idx],
        origIdx: post2Idx,
        slotKey: `clone-post-2-${filteredProjects[post2Idx].id}`,
        isClone: true,
      },
    ];
  }, [filteredProjects, totalProjects, useLoopClones]);

  const [visualTrackIdx, setVisualTrackIdx] = useState<number>(() => (useLoopClones ? 3 : 0));

  useEffect(() => {
    if (snapTimerRef.current !== null) {
      window.clearTimeout(snapTimerRef.current);
      snapTimerRef.current = null;
    }
    setActiveCarouselIdx(0);
    setVisualTrackIdx(totalProjects >= 3 ? 3 : 0);
    setHoveredSlotIdx(null);
    setDisableTrackTransition(true);
    const rafId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDisableTrackTransition(false));
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [activeCategory, searchQuery, totalProjects]);

  const isSliderMode =
    !selectedGroup &&
    !selectedArticle &&
    viewMode === 'slider' &&
    filteredProjects.length > 0;

  const measureSliderGeometry = useCallback(() => {
    if (!isSliderMode) return;
    const containerEl = containerRef.current;
    const firstSlideEl = slotSlideRefs.current[0];
    if (containerEl) {
      const cw = containerEl.clientWidth;
      if (cw > 0) setContainerWidth(cw);
    }
    if (firstSlideEl) {
      const sw = firstSlideEl.offsetWidth;
      if (sw > 0) setSlideWidth(sw);
    }
  }, [isSliderMode]);

  useEffect(() => {
    if (!isSliderMode) return;
    measureSliderGeometry();
    const containerEl = containerRef.current;
    const firstSlideEl = slotSlideRefs.current[0];
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measureSliderGeometry());
      if (containerEl) ro.observe(containerEl);
      if (firstSlideEl) ro.observe(firstSlideEl);
    }
    window.addEventListener('resize', measureSliderGeometry);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measureSliderGeometry);
    };
  }, [isSliderMode, extendedSlides.length, measureSliderGeometry]);

  const baseTrackX = useMemo(() => {
    if (containerWidth <= 0 || slideWidth <= 0) return 0;
    return containerWidth / 2 - (visualTrackIdx * slideWidth + slideWidth / 2);
  }, [containerWidth, slideWidth, visualTrackIdx]);

  const currentTrackX = baseTrackX + dragDeltaX;

  const activeHighlightSlotIdx =
    hoveredSlotIdx !== null ? hoveredSlotIdx : visualTrackIdx;

  const syncItemBg = useCallback(() => {
    if (!isSliderMode) return;
    const bgEl = bgRef.current;
    const wrpEl = wrpRef.current;
    const slideEl = slotSlideRefs.current[activeHighlightSlotIdx];
    const itemEl = slotItemRefs.current[activeHighlightSlotIdx];
    if (!bgEl || !wrpEl || !slideEl || !itemEl) return;

    const x = wrpEl.offsetLeft + currentTrackX + slideEl.offsetLeft + itemEl.offsetLeft;
    const y = wrpEl.offsetTop + slideEl.offsetTop + itemEl.offsetTop;
    const w = itemEl.offsetWidth;
    const h = itemEl.offsetHeight;

    if (w > 0 && h > 0) {
      bgEl.style.width = `${w}px`;
      bgEl.style.height = `${h}px`;
      bgEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      bgEl.classList.add('active');
    }
  }, [isSliderMode, activeHighlightSlotIdx, currentTrackX]);

  useEffect(() => {
    syncItemBg();
  }, [syncItemBg, extendedSlides.length, containerWidth, slideWidth]);

  useEffect(() => {
    if (!isSliderMode) return;
    const activeItemEl = slotItemRefs.current[activeHighlightSlotIdx];
    const containerEl = containerRef.current;
    const wrpEl = wrpRef.current;
    if ((!activeItemEl && !containerEl && !wrpEl) || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(() => syncItemBg());
    });
    if (activeItemEl) ro.observe(activeItemEl);
    if (containerEl) ro.observe(containerEl);
    if (wrpEl) ro.observe(wrpEl);
    return () => ro.disconnect();
  }, [isSliderMode, activeHighlightSlotIdx, syncItemBg]);

  const scheduleLoopSnapIfNeeded = useCallback(
    (targetTrackIdx: number) => {
      if (!useLoopClones) return;
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
        snapTimerRef.current = null;
      }
      if (targetTrackIdx < clonePad || targetTrackIdx >= clonePad + totalProjects) {
        const canonicalTrackIdx =
          targetTrackIdx < clonePad
            ? targetTrackIdx + totalProjects
            : targetTrackIdx - totalProjects;
        snapTimerRef.current = window.setTimeout(() => {
          setDisableTrackTransition(true);
          setVisualTrackIdx(canonicalTrackIdx);
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              setDisableTrackTransition(false);
            });
          });
        }, 430);
      }
    },
    [useLoopClones, clonePad, totalProjects]
  );

  useEffect(() => {
    return () => {
      if (snapTimerRef.current !== null) {
        window.clearTimeout(snapTimerRef.current);
      }
    };
  }, []);

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

  const handlePrevCarousel = useCallback(() => {
    if (totalProjects <= 1) return;
    SoundEngine.playTap();
    setHoveredSlotIdx(null);
    const currentOrig = Math.min(activeCarouselIdx, totalProjects - 1);
    const nextOrig = currentOrig > 0 ? currentOrig - 1 : totalProjects - 1;
    setActiveCarouselIdx(nextOrig);

    if (!useLoopClones) {
      setVisualTrackIdx(nextOrig);
      return;
    }

    const baseTrack =
      visualTrackIdx < clonePad
        ? visualTrackIdx + totalProjects
        : visualTrackIdx >= clonePad + totalProjects
          ? visualTrackIdx - totalProjects
          : visualTrackIdx;
    const nextTrack = Math.max(0, baseTrack - 1);
    if (baseTrack !== visualTrackIdx) {
      setDisableTrackTransition(true);
      setVisualTrackIdx(baseTrack);
      window.requestAnimationFrame(() => {
        setDisableTrackTransition(false);
        setVisualTrackIdx(nextTrack);
        scheduleLoopSnapIfNeeded(nextTrack);
      });
    } else {
      setVisualTrackIdx(nextTrack);
      scheduleLoopSnapIfNeeded(nextTrack);
    }
  }, [activeCarouselIdx, clonePad, scheduleLoopSnapIfNeeded, totalProjects, useLoopClones, visualTrackIdx]);

  const handleNextCarousel = useCallback(() => {
    if (totalProjects <= 1) return;
    SoundEngine.playTap();
    setHoveredSlotIdx(null);
    const currentOrig = Math.min(activeCarouselIdx, totalProjects - 1);
    const nextOrig = currentOrig < totalProjects - 1 ? currentOrig + 1 : 0;
    setActiveCarouselIdx(nextOrig);

    if (!useLoopClones) {
      setVisualTrackIdx(nextOrig);
      return;
    }

    const baseTrack =
      visualTrackIdx < clonePad
        ? visualTrackIdx + totalProjects
        : visualTrackIdx >= clonePad + totalProjects
          ? visualTrackIdx - totalProjects
          : visualTrackIdx;
    const nextTrack = Math.min(extendedSlides.length - 1, baseTrack + 1);
    if (baseTrack !== visualTrackIdx) {
      setDisableTrackTransition(true);
      setVisualTrackIdx(baseTrack);
      window.requestAnimationFrame(() => {
        setDisableTrackTransition(false);
        setVisualTrackIdx(nextTrack);
        scheduleLoopSnapIfNeeded(nextTrack);
      });
    } else {
      setVisualTrackIdx(nextTrack);
      scheduleLoopSnapIfNeeded(nextTrack);
    }
  }, [activeCarouselIdx, clonePad, extendedSlides.length, scheduleLoopSnapIfNeeded, totalProjects, useLoopClones, visualTrackIdx]);

  const handleSelectBullet = useCallback(
    (origIdx: number) => {
      SoundEngine.playTap();
      setHoveredSlotIdx(null);
      setActiveCarouselIdx(origIdx);
      setVisualTrackIdx(useLoopClones ? origIdx + clonePad : origIdx);
    },
    [clonePad, useLoopClones]
  );

  useEffect(() => {
    if (!isSliderMode || mindmapProject || isFilterDropdownOpen) return;
    const onArrowKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCarousel();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCarousel();
      }
    };
    window.addEventListener('keydown', onArrowKey);
    return () => window.removeEventListener('keydown', onArrowKey);
  }, [isSliderMode, mindmapProject, isFilterDropdownOpen, handlePrevCarousel, handleNextCarousel]);

  useEffect(() => {
    if (!isSliderMode) return;
    const el = containerRef.current;
    if (!el) return;

    const onNativeWheel = (e: WheelEvent) => {
      if (e.ctrlKey || totalProjects <= 1) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absX < 0.5 && absY < 0.5) return;

      const delta = absX >= absY ? e.deltaX : e.deltaY;
      e.preventDefault();
      e.stopPropagation();

      const now = Date.now();
      if (now - wheelCooldownRef.current < 240) return;

      wheelAccumRef.current += delta;
      if (Math.abs(wheelAccumRef.current) >= 20) {
        wheelCooldownRef.current = now;
        const dir = wheelAccumRef.current;
        wheelAccumRef.current = 0;
        if (dir > 0) {
          handleNextCarousel();
        } else {
          handlePrevCarousel();
        }
      }
    };

    el.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onNativeWheel);
    };
  }, [isSliderMode, totalProjects, handleNextCarousel, handlePrevCarousel]);

  const finishSliderDrag = useCallback(() => {
    if (dragStartXRef.current === null) return;
    const dx = dragDeltaXRef.current;
    dragStartXRef.current = null;
    dragDeltaXRef.current = 0;
    setIsDraggingTrack(false);
    setDragDeltaX(0);
    if (dx <= -24) {
      handleNextCarousel();
    } else if (dx >= 24) {
      handlePrevCarousel();
    }
    window.setTimeout(() => {
      didDragRef.current = false;
    }, 60);
  }, [handleNextCarousel, handlePrevCarousel]);

  useEffect(() => {
    if (!isDraggingTrack) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (dragStartXRef.current === null) return;
      const dx = e.clientX - dragStartXRef.current;
      if (Math.abs(dx) > 6) {
        didDragRef.current = true;
      }
      dragDeltaXRef.current = dx;
      setDragDeltaX(dx);
    };

    const handleWindowPointerEnd = () => {
      finishSliderDrag();
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerEnd);
    window.addEventListener('pointercancel', handleWindowPointerEnd);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerEnd);
      window.removeEventListener('pointercancel', handleWindowPointerEnd);
    };
  }, [isDraggingTrack, finishSliderDrag]);

  const handleSliderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || totalProjects <= 1) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest('.news-slider-arrow, .news-slider-bullet')) return;
    dragStartXRef.current = e.clientX;
    dragDeltaXRef.current = 0;
    didDragRef.current = false;
    setIsDraggingTrack(true);
    setDragDeltaX(0);
  };

  const safeCarouselIndex = filteredProjects.length > 0 ? Math.min(activeCarouselIdx, filteredProjects.length - 1) : 0;

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
          data-slider-mode={isSliderMode ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Dự Án"
          data-element-type="card"
          data-element-page="projects"
          data-element-parent="projects-cards-track"
          className="page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play select-none text-left text-[var(--text-primary)] box-border"
        >
          <div
            id="projects-main-scroll-viewport"
            className={cn(
              'main-card-scroll-viewport w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[15px] overflow-x-hidden no-scrollbar box-border',
              selectedGroup || selectedArticle || isSliderMode ? 'overflow-hidden' : 'overflow-y-auto'
            )}
          >
          <div
            id="projects-main-wrapper"
            className={cn(
              'w-full max-w-full min-w-0 flex-1 flex flex-col gap-[15px] justify-start box-border',
              (selectedGroup || selectedArticle) && 'h-full flex-1 min-h-0 gap-0',
              isSliderMode && 'h-full max-h-full flex-1 min-h-0 overflow-hidden'
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
          {/* BANNER DỰ ÁN: Đồng bộ chuẩn banner Học vấn (h-200px desktop, p-[15px], rounded-banner) */}
          <section
            id="projects-hero-banner"
            data-element-name="Banner card"
            data-element-type="banner-card"
            data-element-page="projects"
            data-section-card="true"
            data-has-compact-menu="true"
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-0 rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300 box-border"
            style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 14px)', boxSizing: 'border-box' }}
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
                ariaLabel="Bộ lọc, dạng xem và tìm kiếm dự án"
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

                    <div className="flex flex-col gap-1.5">
                      <span className="typo-label text-[var(--text-muted)] px-1">Dạng hiển thị</span>
                      <div className="banner-control-pill w-full inline-flex items-center gap-1 p-0.5 rounded-full">
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setViewMode('grid');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'grid'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'grid' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <WebIcon name="layout-grid" className="w-3.5 h-3.5 shrink-0" />
                          <span>Dạng lưới</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setViewMode('slider');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'slider'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'slider' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <WebIcon name="layers" className="w-3.5 h-3.5 shrink-0" />
                          <span>Slider Card</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setViewMode('stack');
                            closeMenu();
                          }}
                          style={
                            viewMode === 'stack'
                              ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                              : undefined
                          }
                          className={cn(
                            'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                            viewMode === 'stack' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                          )}
                        >
                          <WebIcon name="copy" className="w-3.5 h-3.5 shrink-0" />
                          <span>Xếp chồng</span>
                        </button>
                      </div>
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
                    <motion.div
                      id="projects-filter-listbox"
                      data-element-type="card"
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
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
                              {isSelected && <WebIcon name="check" className="w-3.5 h-3.5 text-current stroke-[2.5] shrink-0" />}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end ml-auto max-w-full">
                <div
                  id="projects-view-mode-switcher"
                  role="group"
                  aria-label="Dạng view dự án"
                  className="banner-control-pill h-auto min-h-9 max-w-full min-w-0 inline-flex items-center gap-1 p-0.5 rounded-full box-border shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setViewMode('grid');
                    }}
                    style={
                      viewMode === 'grid'
                        ? {
                            background: 'var(--bg-button-primary)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                          }
                        : undefined
                    }
                    className={cn(
                      'h-full px-2.5 py-1 rounded-full typo-button font-semibold font-play flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap min-w-0',
                      viewMode === 'grid'
                        ? 'shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    )}
                    title="Dạng lưới"
                  >
                    <WebIcon name="layout-grid" className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Dạng lưới</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setViewMode('slider');
                    }}
                    style={
                      viewMode === 'slider'
                        ? {
                            background: 'var(--bg-button-primary)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                          }
                        : undefined
                    }
                    className={cn(
                      'h-full px-2.5 py-1 rounded-full typo-button font-semibold font-play flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap min-w-0',
                      viewMode === 'slider'
                        ? 'shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    )}
                    title="Slider Card"
                  >
                    <WebIcon name="layers" className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Slider Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setViewMode('stack');
                    }}
                    style={
                      viewMode === 'stack'
                        ? {
                            background: 'var(--bg-button-primary)',
                            color: 'var(--text-button-primary, #FFFFFF)',
                          }
                        : undefined
                    }
                    className={cn(
                      'h-full px-2.5 py-1 rounded-full typo-button font-semibold font-play flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap min-w-0',
                      viewMode === 'stack'
                        ? 'shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    )}
                    title="Xếp chồng (Stacked Cards)"
                  >
                    <WebIcon name="copy" className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Xếp chồng</span>
                  </button>
                </div>

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
              </div>
            </div>
          </section>

          {/* NỘI DUNG CHÍNH: DẠNG LƯỚI HOẶC SLIDER CARD (CODEPEN NEWS SLIDER LAYOUT + EFFECT, KHÔNG ĐỔI DATA) */}
          {filteredProjects.length === 0 ? (
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
          ) : viewMode === 'slider' ? (
            <div
              data-section-card="true"
              data-element-type="card"
              className="news-slider-wrapper-container projects-themed-slider bento-card glass-card relative w-full h-full max-h-full flex-1 min-h-0 flex flex-col justify-center overflow-hidden"
              onMouseLeave={() => setHoveredSlotIdx(null)}
            >
              <div className="news-slider-bg" aria-hidden="true" />

              <div ref={containerRef} className="news-slider-container">
                <div
                  className={cn('news-slider-stage', isDraggingTrack && 'is-dragging')}
                  onPointerDown={handleSliderPointerDown}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div ref={bgRef} className="news-item-bg projects-themed-item-bg" aria-hidden="true" />

                  <div
                    ref={wrpRef}
                    style={{
                      transform: `translate3d(${currentTrackX}px, 0, 0)`,
                      transition:
                        disableTrackTransition || isDraggingTrack
                          ? 'none'
                          : 'transform 0.43s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                    className="news-slider-wrp"
                  >
                    {extendedSlides.map((slideItem, slotIdx) => {
                      const { proj, origIdx, slotKey } = slideItem;
                      const parentGroup = getParentGroupForProject(proj);
                      const bannerInfo = getProjectCloudinaryBanner(proj);
                      const cleanedTitle = proj.title.replace(/^[\d.]+\s*·\s*/, '').trim();
                      const orderNumber =
                        proj.code || proj.number || proj.title.match(/^[\d.]+/)?.[0] || '';
                      const isActiveCenter = slotIdx === visualTrackIdx;
                      const isPrevSlide = slotIdx === visualTrackIdx - 1;
                      const isNextSlide = slotIdx === visualTrackIdx + 1;
                      const isPeekSlide = Math.abs(slotIdx - visualTrackIdx) === 2;
                      const isHighlighted =
                        hoveredSlotIdx !== null
                          ? slotIdx === hoveredSlotIdx
                          : isActiveCenter;

                      return (
                        <div
                          key={slotKey}
                          ref={(el) => {
                            slotSlideRefs.current[slotIdx] = el;
                          }}
                          className={cn(
                            'news-slider-slide',
                            isActiveCenter && 'active-slide swiper-slide-active',
                            isPrevSlide && 'swiper-slide-prev',
                            isNextSlide && 'swiper-slide-next',
                            isPeekSlide && 'swiper-slide-peek'
                          )}
                        >
                          <div
                            ref={(el) => {
                              slotItemRefs.current[slotIdx] = el;
                            }}
                            role="button"
                            tabIndex={isPrevSlide || isActiveCenter || isNextSlide ? 0 : -1}
                            onMouseEnter={() => {
                              if (typeof window !== 'undefined' && window.innerWidth > 800) {
                                setHoveredSlotIdx(slotIdx);
                              }
                            }}
                            onMouseLeave={() => {
                              if (typeof window !== 'undefined' && window.innerWidth > 800) {
                                setHoveredSlotIdx((prev) => (prev === slotIdx ? null : prev));
                              }
                            }}
                            onClick={() => {
                              if (didDragRef.current) return;
                              setActiveCarouselIdx(origIdx);
                              if (useLoopClones) {
                                setVisualTrackIdx(origIdx + clonePad);
                              } else {
                                setVisualTrackIdx(origIdx);
                              }
                              handleOpenGroup(parentGroup, proj);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setActiveCarouselIdx(origIdx);
                                handleOpenGroup(parentGroup, proj);
                              }
                            }}
                            className={cn('news-card-item', isHighlighted && 'active')}
                          >
                            <div className="news-card-date">
                              <span className="news-card-date-title">{orderNumber}</span>
                              <span className="news-card-date-txt">{parentGroup.fourWordTitle}</span>
                            </div>
                            <div className="news-card-title" title={cleanedTitle}>
                              {cleanedTitle}
                            </div>
                            <p className="news-card-txt" title={proj.description}>
                              {proj.description}
                            </p>
                            <div className="news-card-img">
                              <img
                                src={bannerInfo.primaryUrl}
                                alt={cleanedTitle}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                draggable={false}
                                onError={(e) => {
                                  if (
                                    bannerInfo.fallbackUrl &&
                                    e.currentTarget.src !== bannerInfo.fallbackUrl
                                  ) {
                                    e.currentTarget.src = bannerInfo.fallbackUrl;
                                  } else {
                                    e.currentTarget.src =
                                      'https://i.postimg.cc/LXdY8nrR/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.png';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handlePrevCarousel}
                    disabled={totalProjects <= 1}
                    className="news-slider-arrow news-slider-prev absolute no-theme-btn"
                    aria-label="Dự án trước"
                  >
                    <span className="icon-font">
                      <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                        <path d="M0.704 17.696l9.856 9.856c0.896 0.896 2.432 0.896 3.328 0s0.896-2.432 0-3.328l-5.792-5.856h21.568c1.312 0 2.368-1.056 2.368-2.368s-1.056-2.368-2.368-2.368h-21.568l5.824-5.824c0.896-0.896 0.896-2.432 0-3.328-0.48-0.48-1.088-0.704-1.696-0.704s-1.216 0.224-1.696 0.704l-9.824 9.824c-0.448 0.448-0.704 1.056-0.704 1.696s0.224 1.248 0.704 1.696z" />
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextCarousel}
                    disabled={totalProjects <= 1}
                    className="news-slider-arrow news-slider-next absolute no-theme-btn"
                    aria-label="Dự án tiếp theo"
                  >
                    <span className="icon-font">
                      <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                        <path d="M31.296 14.336l-9.888-9.888c-0.896-0.896-2.432-0.896-3.328 0s-0.896 2.432 0 3.328l5.824 5.856h-21.536c-1.312 0-2.368 1.056-2.368 2.368s1.056 2.368 2.368 2.368h21.568l-5.856 5.824c-0.896 0.896-0.896 2.432 0 3.328 0.48 0.48 1.088 0.704 1.696 0.704s1.216-0.224 1.696-0.704l9.824-9.824c0.448-0.448 0.704-1.056 0.704-1.696s-0.224-1.248-0.704-1.696z" />
                      </svg>
                    </span>
                  </button>
                </div>

                <div className="news-slider-ctr">
                  <div className="news-slider-pagination">
                    {filteredProjects.map((proj, idx) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => handleSelectBullet(idx)}
                        className={cn('news-slider-bullet', idx === safeCarouselIndex && 'active-bullet')}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : viewMode === 'stack' ? (
            <div
              id="projects-stack-stage"
              data-section-card="true"
              data-element-type="card"
              className="project-stack-stage bento-card glass-card relative w-full h-full max-w-full max-h-full flex-1 min-h-0 flex flex-col justify-center overflow-x-auto overflow-y-visible no-scrollbar py-8 px-6"
            >
              <div className="project-stack-container w-full h-full max-w-full max-h-full flex items-center justify-center">
                {filteredProjects.map((proj, idx) => {
                  const parentGroup = getParentGroupForProject(proj);
                  const bannerInfo = getProjectCloudinaryBanner(proj);
                  const cleanedTitle = proj.title.replace(/^[\d.]+\s*·\s*/, '').trim();
                  const orderNumber =
                    proj.code || proj.number || proj.title.match(/^[\d.]+/)?.[0] || `${idx + 1}`;
                  const cardColor = getProjectCardColor(idx);

                  return (
                    <div
                      key={proj.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        handleOpenGroup(parentGroup, proj);
                        document
                          .getElementById('projects-main-scroll-viewport')
                          ?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenGroup(parentGroup, proj);
                          document
                            .getElementById('projects-main-scroll-viewport')
                            ?.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      style={{ '--stack-accent': cardColor, borderColor: `${cardColor}45` } as React.CSSProperties}
                      className="card project-stack-card cursor-pointer select-none flex flex-col justify-between overflow-hidden border p-0"
                      title={`${orderNumber} · ${cleanedTitle}`}
                    >
                      <div className="relative w-full h-[120px] overflow-hidden bg-[var(--surface-tertiary-bg,var(--bg-subcard))] shrink-0 border-b border-[var(--border-subcard)]">
                        <img
                          src={bannerInfo.primaryUrl}
                          alt={cleanedTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-black/60 text-white backdrop-blur-md">
                          {orderNumber} · {parentGroup.fourWordTitle}
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">{cleanedTitle}</h3>
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">{proj.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-[var(--border-subcard)] text-[11px] text-[var(--text-tertiary)]">
                          <span>Tiến độ: {proj.progressPercent ?? 100}%</span>
                          <span className="font-medium text-[var(--accent-color)]">Chi tiết →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
          <div
            id="projects-grid"
            className="projects-responsive-grid card-grid w-full min-w-0 items-stretch"
            style={{ gap: '15px', rowGap: '15px', columnGap: '15px' }}
          >
            {filteredProjects.map((proj, idx) => {
              const parentGroup = getParentGroupForProject(proj);
              const bannerInfo = getProjectCloudinaryBanner(proj);
              const cleanedTitle = proj.title.replace(/^[\d.]+\s*·\s*/, '').trim();
              const orderNumber = proj.code || proj.number || (proj.title.match(/^[\d.]+/)?.[0]) || '';
              const cardColor = getProjectCardColor(idx);
              const progressPct = typeof proj.progressPercent === 'number' ? proj.progressPercent : 100;

              return (
                <motion.article
                  id={`project-card-${proj.id}`}
                  key={proj.id}
                  data-element-type="card"
                  data-section-card="true"
                  role="button"
                  tabIndex={0}
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
                  className="project-card card-item bento-card glass-card group relative h-full p-0 flex flex-col justify-between border select-none transition-all duration-300 cursor-pointer font-play min-w-0 overflow-hidden"
                  style={{
                    borderColor: `${cardColor}45`,
                    padding: 0,
                  }}
                >
                  {/* 1. Ảnh bìa thẻ Dự án: Không bo cong 4 góc, chỉ bo góc trên trái & trên phải theo Tùy chỉnh chung Bo cong 4 góc */}
                  <div
                    data-media-card="image"
                    className="project-card-banner relative w-[calc(100%-4px)] m-[2px] mb-0 aspect-[16/10] overflow-hidden bg-[var(--surface-tertiary-bg,var(--bg-subcard))] shrink-0 group/img p-0 box-border rounded-bl-none rounded-br-none border-0 border-b border-[var(--border-subcard)]"
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
                            'https://i.postimg.cc/LXdY8nrR/1-1-Xay-dung-Phong-Dich-vu-Khach-hang.png';
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
                      className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-semibold text-white bg-slate-950/60 border border-white/25 backdrop-blur-md max-w-[58%] truncate pointer-events-none"
                    >
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

                  {/* 2. Thân thẻ Dự án: Tiêu đề đồng đều · Số thứ tự, icon, tên dự án chạy hết dòng mới xuống dòng */}
                  <div className="project-card-body flex-1 flex flex-col justify-between gap-3 p-[15px] min-w-0">
                    <div className="min-w-0 flex flex-col gap-1.5">
                      <div className="card-header-sync w-full min-w-0 min-h-[2.85em]" style={{ color: cardColor }}>
                        <h3
                          className="typo-h4 card-title-synced font-play font-bold line-clamp-2 leading-snug m-0 p-0 w-full min-w-0 text-left block"
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

                      <p className="typo-caption text-[var(--text-secondary)] leading-relaxed line-clamp-2 break-words m-0">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2.5 pt-1.5 mt-0.5 border-t border-[var(--border-subcard)] min-w-0">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
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
                      <span
                        className="inline-flex items-center gap-1 typo-caption font-bold shrink-0 group-hover:translate-x-0.5 transition-transform"
                        style={{ color: cardColor }}
                      >
                        <span>Chi tiết Case Study</span>
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