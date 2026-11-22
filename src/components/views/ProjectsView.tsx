'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS_DATA, getProjectCloudinaryBanner } from '@/data/projects';
import { ProjectData, SiteTheme } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { ProjectDetailView } from './ProjectDetailView';
import { useTheme } from '@/hooks/useTheme';
import { useBannerVideo } from '@/context/BannerVideoContext';
import { DriveAwareBannerMedia } from '@/components/common/DriveAwareBannerMedia';

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
  const { bannerAssignments } = useBannerVideo();
  const driveProjectsBanner = bannerAssignments.projects;
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'deep-ocean';
  const isLight = !isDark;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<ProjectCardGroup | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ProjectData | null>(null);
  const [mindmapProject, setMindmapProject] = useState<ProjectData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('sec-mindmap');
  const [isBannerMuted, setIsBannerMuted] = useState<boolean>(true);
  const [heroVideoFailed, setHeroVideoFailed] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  const bannerVideoRef = useRef<HTMLVideoElement | null>(null);

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
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-text text-left animate-fadeIn rounded-none text-[var(--text-primary)] box-border"
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
          data-detail-open={selectedArticle ? 'true' : 'false'}
          data-element-name="Thẻ chính Trang Dự Án"
          data-element-type="card"
          data-element-page="projects"
          data-element-parent="projects-cards-track"
          className={cn(
            'page-main-card flex flex-col justify-start rounded-[var(--radius-main,30px)] overflow-x-hidden glass-scrollbar font-play select-none text-left text-[var(--text-primary)] box-border',
            selectedArticle ? 'p-0 gap-0 overflow-hidden' : 'p-[15px] gap-[15px] overflow-y-auto'
          )}
        >
      {/* Khi chưa chọn xem chi tiết dự án: Hiển thị Hero Banner và Danh sách thẻ dự án */}
      {!selectedGroup && !selectedArticle ? (
        <>
          {onReturnToOrigin && (
            <div className="flex items-center justify-start shrink-0">
              <button
                id="projects-list-return-btn"
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  onReturnToOrigin();
                }}
                className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-bold font-play transition-colors duration-200 active:scale-95 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
                title="Quay lại trang đang xem"
              >
                <WebIcon name="arrow-left" className="w-4 h-4 shrink-0" />
                <span>Quay lại trang đang xem</span>
              </button>
            </div>
          )}
          {/* BANNER DỰ ÁN: Đồng bộ chuẩn banner Học vấn (h-200px desktop, p-[15px], rounded-banner) */}
          <section
            id="projects-hero-banner"
            data-element-name="Banner card"
            data-element-type="banner-card"
            data-element-page="projects"
            data-section-card="true"
            className="banner-card hero-banner group w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[var(--radius-banner,24px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300"
            style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 24px)' }}
          >
            <div
              className="project-detail-banner-media absolute inset-0 z-0 rounded-[var(--radius-banner,24px)] overflow-hidden pointer-events-none"
              style={{
                borderRadius: 'var(--radius-banner, 24px)',
              }}
            >
              {driveProjectsBanner ? (
                <DriveAwareBannerMedia
                  directVideoUrl={driveProjectsBanner.directStreamUrl}
                  iframeFallbackUrl={driveProjectsBanner.previewIframeUrl}
                  posterUrl="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794035567/D%E1%BB%B1_%C3%A1n.png"
                  title={driveProjectsBanner.fileName}
                />
              ) : !heroVideoFailed ? (
                <video
                  src="https://res.cloudinary.com/q5tpzaxk/video/upload/v1794027145/Banner.mp4"
                  poster="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794035567/D%E1%BB%B1_%C3%A1n.png"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls={false}
                  disablePictureInPicture
                  controlsList="nodownload nofullscreen noremoteplayback"
                  preload="auto"
                  onEnded={(e) => {
                    const v = e.currentTarget;
                    v.currentTime = 0;
                    v.play().catch(() => {});
                  }}
                  onError={() => setHeroVideoFailed(true)}
                  style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
                  className="w-full h-full min-w-full min-h-full object-cover object-center rounded-[inherit] banner-video-sharp transition-all duration-700"
                />
              ) : (
                <img
                  src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794035567/D%E1%BB%B1_%C3%A1n.png"
                  alt="Banner Dự án"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="w-full h-full object-cover object-center rounded-[inherit] transition-all duration-700"
                />
              )}
            </div>
            <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

            <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full">
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
            </div>

            <div
              id="projects-hero-banner-controls"
              ref={filterMenuRef}
              className="relative z-30 flex flex-wrap items-center justify-between gap-2.5 mt-auto w-full"
            >
              <div className="relative inline-block text-left">
                <button
                  id="projects-filter-toggle-btn"
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    setIsFilterDropdownOpen((prev) => !prev);
                  }}
                  className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play active:scale-95 group"
                  title="Bộ lọc dự án"
                  aria-label="Bộ lọc dự án"
                  aria-expanded={isFilterDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <WebIcon name="sliders" className="w-4 h-4 shrink-0" />
                  <span>Bộ lọc dự án</span>
                  {activeCategory !== 'all' && (
                    <span className="banner-count-pill px-1.5 py-0.2 rounded-full border typo-badge font-mono font-bold">
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
                        const count =
                          cat.id === 'all'
                            ? PROJECTS_DATA.length
                            : PROJECTS_DATA.filter((p) => p.groupKey === cat.id).length;

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
                              'theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
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

              <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end ml-auto max-w-full sm:max-w-[300px]">
                <div className="relative flex-1 sm:w-52">
                  <WebIcon
                    name="search"
                    className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên, mã dự án..."
                    aria-label="Tìm kiếm dự án"
                    className="banner-search-input h-9 w-full pl-8 pr-7 py-0 rounded-full typo-button font-bold font-play focus:outline-none"
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

          {/* NỘI DUNG CHÍNH: RESPONSIVE CARD GRID ĐỒNG BỘ HOÀN TOÀN VỚI VIEW THẺ HỌC VẤN */}
          {filteredProjects.length === 0 ? (
            <div
              className="theme-muted-surface w-full p-8 rounded-[14px] text-center space-y-2 backdrop-blur-md"
            >
              <p className="typo-body font-semibold font-play" style={{ color: 'var(--text-primary)' }}>
                Không tìm thấy dự án nào khớp với bộ lọc hiện tại.
              </p>
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setActiveCategory('all');
                  setSearchQuery('');
                }}
                style={{ background: 'var(--bg-button-primary)' }}
                className="px-4 py-1.5 rounded-full typo-button text-white hover:opacity-90 transition cursor-pointer"
              >
                Hiển thị tất cả {PROJECTS_DATA.length} dự án
              </button>
            </div>
          ) : (
          <div
            id="projects-grid"
            className="projects-responsive-grid education-responsive-grid w-full min-w-0 items-stretch"
            style={{ gap: '15px', rowGap: '15px', columnGap: '15px' }}
          >
            {filteredProjects.map((proj, idx) => {
              const parentGroup = getParentGroupForProject(proj);
              const bannerInfo = getProjectCloudinaryBanner(proj);
              const cleanedTitle = proj.title.replace(/^[\d.]+\s*·\s*/, '').trim();
              const orderNumber = proj.code || proj.number || (proj.title.match(/^[\d.]+/)?.[0]) || '';
              const cardColor = getProjectCardColor(idx);
              const highlightText = proj.star?.results?.[0] || proj.description;
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
                    document.getElementById('projects-main-card')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onKeyDown={(e) => {
                    if (e.target !== e.currentTarget) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenGroup(parentGroup, proj);
                      document.getElementById('projects-main-card')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="project-card education-course-card bento-card glass-card layered-card group relative rounded-[14px] p-[10px] flex flex-col justify-between gap-[10px] border select-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer font-play min-w-0"
                  style={{
                    borderColor: `${cardColor}45`,
                    padding: '10px',
                  }}
                >
                  {/* 1. Ảnh bìa thẻ Dự án 16:10: phân hệ nhóm + mã dự án + thanh thông tin vai trò & giai đoạn */}
                  <div
                    data-media-card="image"
                    style={{ borderRadius: 'var(--radius-card, 14px)' }}
                    className="project-card-banner education-card-banner themed-image-frame relative w-full aspect-[16/10] overflow-hidden bg-[var(--surface-tertiary-bg,var(--bg-subcard))] shrink-0 group/img m-0 p-0"
                  >
                    <img
                      src={bannerInfo.primaryUrl}
                      alt={cleanedTitle}
                      title={bannerInfo.imageName}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (bannerInfo.fallbackUrl && e.currentTarget.src !== bannerInfo.fallbackUrl) {
                          e.currentTarget.src = bannerInfo.fallbackUrl;
                        } else {
                          e.currentTarget.src =
                            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1794035567/D%E1%BB%B1_%C3%A1n.png';
                        }
                      }}
                      className="w-full h-full object-cover object-center rounded-[inherit] block m-0 p-0 transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[inherit]"
                      style={{
                        background:
                          'linear-gradient(180deg, rgba(15, 23, 42, 0.34) 0%, rgba(15, 23, 42, 0.04) 42%, rgba(15, 23, 42, 0.82) 100%)',
                      }}
                    />
                    <span
                      className="absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full typo-badge font-semibold text-white bg-slate-950/60 border border-white/25 backdrop-blur-md max-w-[58%] truncate pointer-events-none"
                    >
                      <WebIcon name="layers" className="w-3 h-3 shrink-0" style={{ color: '#38BDF8' }} />
                      <span className="truncate">{parentGroup.fourWordTitle}</span>
                    </span>
                    {orderNumber && (
                      <span
                        className="project-card-code-badge education-year-badge banner-control-pill absolute top-2.5 right-2.5 z-20 typo-badge font-mono px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-semibold"
                      >
                        <WebIcon name="folder" className="w-3 h-3 shrink-0" style={{ color: 'var(--text-link, var(--color-primary))' }} />
                        <span>Dự án {orderNumber}</span>
                      </span>
                    )}
                    <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="inline-flex items-center gap-1 typo-caption font-semibold text-white/95 truncate drop-shadow-xs">
                        <WebIcon name="briefcase" className="w-3 h-3 shrink-0 text-sky-300" />
                        <span className="truncate">{proj.role}</span>
                      </span>
                      <span className="shrink-0 typo-badge font-mono font-semibold px-2 py-0.5 rounded-full bg-white/15 border border-white/20 text-white backdrop-blur-sm">
                        {proj.phase}
                      </span>
                    </div>
                  </div>

                  {/* 2. Thân thẻ Dự án: Tiêu đề đồng đều 2 dòng · Vai trò/Giai đoạn · Phạm vi & Kết quả STAR */}
                  <div className="project-card-body education-card-body flex-1 flex flex-col justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex flex-col gap-1.5">
                      <div className="card-header-sync flex items-start gap-2 min-w-0 min-h-[2.85em]" style={{ color: cardColor }}>
                        <WebIcon name={getProjectIconByTitle(proj)} className="w-4 h-4 shrink-0 mt-1" style={{ color: cardColor }} />
                        <h3
                          className="typo-h4 card-title-synced font-play font-bold line-clamp-2 leading-snug break-words m-0 p-0 flex-1 min-w-0"
                          data-card-title="true"
                          style={{ color: cardColor }}
                          title={cleanedTitle}
                        >
                          {cleanedTitle}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap pb-1.5 border-b border-[var(--border-subcard)] typo-caption font-semibold min-w-0">
                        <span className="truncate max-w-full text-[var(--text-primary)]">
                          Vai trò: {proj.role}
                        </span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span className="shrink-0 font-mono" style={{ color: cardColor }}>
                          {proj.phase}
                        </span>
                      </div>

                      <p className="typo-caption text-[var(--text-secondary)] leading-relaxed line-clamp-2 break-words m-0">
                        {proj.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 min-w-0 pt-0.5">
                      {highlightText && (
                        <div
                          className="p-2 rounded-[10px] border flex items-start gap-1.5 transition-colors min-w-0"
                          style={{
                            backgroundColor: `${cardColor}10`,
                            borderColor: `${cardColor}30`,
                          }}
                        >
                          <WebIcon name="award" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: cardColor }} />
                          <p className="typo-caption font-semibold font-play whitespace-normal break-words min-w-0 line-clamp-2 leading-snug" style={{ color: cardColor }}>
                            {highlightText}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2.5 pt-1 border-t border-[var(--border-subcard)] min-w-0">
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
              className="theme-modal-close absolute top-6 right-6 z-50 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 shrink-0"
            >
              <WebIcon name="x" className="w-4 h-4" />
            </button>

            <ProjectDetailView
              selectedArticle={selectedArticle}
              selectedGroup={selectedGroup}
              onSelectProject={(proj) => setSelectedArticle(proj)}
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
              className="themed-image-frame bg-[var(--surface-tertiary-bg,var(--bg-subcard))] p-3 sm:p-5 flex items-center justify-center overflow-auto horizontal-scroll-smooth max-h-[75vh]"
            >
              <img
                src={mindmapProject.mindmap || mindmapProject.image}
                alt="Sơ đồ tư duy"
                className="max-w-full max-h-[70vh] object-contain rounded-[inherit] shadow-lg"
              />
            </div>
            <div className="flex items-center justify-between typo-caption text-[var(--text-secondary)] pt-1">
              <span>{mindmapProject.groupTitle}</span>
              <a
                href={mindmapProject.mindmap || mindmapProject.image}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: 'var(--bg-button-primary)' }}
                className="px-3.5 py-1.5 rounded-full text-white font-bold typo-button hover:opacity-90 transition inline-flex items-center gap-1.5"
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