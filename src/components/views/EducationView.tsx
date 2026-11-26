 'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SkillsView } from './SkillsView';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { EducationBookView } from './education/EducationBookView';
import { EducationBookshelfView } from './education/EducationBookshelfView';
import { CompactBannerMenu } from '@/components/ui/CompactBannerMenu';

// Helper map skill tag to appropriate icon
const getSkillTagIcon = (tag: string): string => {
  const norm = (tag || '').toLowerCase();
  if (norm.includes('ai') || norm.includes('trí tuệ')) return 'bot';
  if (norm.includes('code') || norm.includes('lập trình') || norm.includes('dev') || norm.includes('web') || norm.includes('cntt') || norm.includes('itil')) return 'cpu';
  if (norm.includes('quản trị') || norm.includes('management') || norm.includes('lãnh đạo') || norm.includes('copc') || norm.includes('vận hành')) return 'briefcase';
  if (norm.includes('dữ liệu') || norm.includes('data') || norm.includes('sql') || norm.includes('bi')) return 'database';
  if (norm.includes('bảo mật') || norm.includes('security') || norm.includes('chuẩn') || norm.includes('iso')) return 'shield';
  if (norm.includes('kỹ năng') || norm.includes('skill') || norm.includes('tư duy')) return 'brain';
  if (norm.includes('giao tiếp') || norm.includes('cskh') || norm.includes('khách hàng') || norm.includes('cx')) return 'heart';
  if (norm.includes('tiếng anh') || norm.includes('ngôn ngữ') || norm.includes('quốc tế')) return 'globe';
  if (norm.includes('chiến lược') || norm.includes('kpi') || norm.includes('mục tiêu')) return 'target';
  if (norm.includes('thời gian') || norm.includes('tiến độ')) return 'clock';
  return 'sparkles';
};

// Map kỹ năng đầu ra khóa học sang ID kỹ năng tương ứng trong Ma trận SWOT (SkillsView)
const mapEducationSkillToSwot = (skill: string): { skillId: string; quadrant: 'S' | 'W' | 'O' | 'T' } => {
  const norm = (skill || '').toLowerCase();
  if (norm.includes('ui/ux') || norm.includes('web dev') || norm.includes('responsive')) {
    return { skillId: 'w-6', quadrant: 'W' };
  }
  if (norm.includes('ai agent')) {
    return { skillId: 'o-1', quadrant: 'O' };
  }
  if (norm.includes('data analytics') || norm.includes('power bi') || norm.includes('dashboard')) {
    return { skillId: 'o-5', quadrant: 'O' };
  }
  if (norm.includes('kpi') || norm.includes('sla') || norm === 'operations') {
    return { skillId: 's-3', quadrant: 'S' };
  }
  if (norm.includes('risk') || norm.includes('crisis')) {
    return { skillId: 's-6', quadrant: 'S' };
  }
  if (norm.includes('sop')) {
    return { skillId: 's-5', quadrant: 'S' };
  }
  if (norm.includes('project management') || norm === 'wbs') {
    return { skillId: 'w-4', quadrant: 'W' };
  }
  if (norm.includes('cross-functional')) {
    return { skillId: 't-6', quadrant: 'T' };
  }
  if (norm.includes('executive') || norm.includes('strategy')) {
    return { skillId: 'w-3', quadrant: 'W' };
  }
  if (norm.includes('change management')) {
    return { skillId: 'o-2', quadrant: 'O' };
  }
  if (
    norm.includes('organization') ||
    norm.includes('management') ||
    norm.includes('team') ||
    norm.includes('delegation') ||
    norm.includes('train') ||
    norm.includes('sư phạm') ||
    norm.includes('giảng dạy') ||
    norm.includes('onboarding') ||
    norm.includes('evaluation') ||
    norm.includes('recruit') ||
    norm.includes('talent') ||
    norm.includes('sourcing') ||
    norm.includes('cost-per-hire') ||
    norm.includes('employer')
  ) {
    return { skillId: 's-4', quadrant: 'S' };
  }
  if (
    norm.includes('presentation') ||
    norm.includes('speaking') ||
    norm.includes('pitch') ||
    norm.includes('storytelling') ||
    norm.includes('interview') ||
    norm.includes('star')
  ) {
    return { skillId: 'w-2', quadrant: 'W' };
  }
  if (
    norm.includes('software') ||
    norm.includes('database') ||
    norm.includes('network') ||
    norm.includes('architecture') ||
    norm.includes('ccna') ||
    norm.includes('routing') ||
    norm.includes('switching') ||
    norm.includes('mcsa') ||
    norm.includes('windows') ||
    norm.includes('active directory') ||
    norm.includes('system admin') ||
    norm.includes('infrastructure')
  ) {
    return { skillId: 'o-6', quadrant: 'O' };
  }
  if (norm.includes('call center') || norm.includes('voip') || norm.includes('complaint') || norm.includes('crm')) {
    return { skillId: 's-2', quadrant: 'S' };
  }
  if (norm.includes('empathy')) {
    return { skillId: 'w-1', quadrant: 'W' };
  }
  return { skillId: 's-1', quadrant: 'S' };
};

// Bảng màu sắc đa dạng độc bản cho từng thẻ học vấn
const DISTINCT_COURSE_PALETTE = [
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

function getCourseColor(course: EducationCourse, idx: number): string {
  if (course.accentColor && course.accentColor !== '#10B981') return course.accentColor;
  return DISTINCT_COURSE_PALETTE[idx % DISTINCT_COURSE_PALETTE.length];
}
import {
  EDUCATION_COURSES,
  EducationCourse,
  CREDENTIAL_VERIFICATION_MAP,
  ACADEMIC_COMPETENCY_RADAR,
  AcademicRadarAxis,
} from '@/data/education';
import { SiteTheme } from '@/types';
import { formatCardTitle } from '@/lib/utils';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface EducationViewProps {
  currentTheme?: SiteTheme;
}

// Phân loại hình thức đào tạo chuẩn: Đào tạo nội bộ / Đào tạo bên ngoài / Đào tạo chính quy / Đào tạo học nghề / Tự học phát triển
const TRAINING_TYPE_CATEGORIES = [
  { id: 'all', label: 'Tất cả khóa học' },
  { id: 'Đào tạo nội bộ', label: 'Đào tạo nội bộ' },
  { id: 'Đào tạo bên ngoài', label: 'Đào tạo bên ngoài' },
  { id: 'Đào tạo chính quy', label: 'Đào tạo chính quy' },
  { id: 'Đào tạo học nghề', label: 'Đào tạo học nghề' },
  { id: 'Tự học phát triển', label: 'Tự học phát triển' },
] as const;

// Helper render icon hình thức đào tạo
function renderTrainingTypeIcon(typeId: string, className = 'w-3.5 h-3.5 shrink-0') {
  switch (typeId) {
    case 'Đào tạo chính quy': return <WebIcon name="graduation" className={className} />;
    case 'Đào tạo nội bộ': return <WebIcon name="building" className={className} />;
    case 'Đào tạo bên ngoài': return <WebIcon name="briefcase" className={className} />;
    case 'Đào tạo học nghề': return <WebIcon name="cpu" className={className} />;
    case 'Tự học phát triển': return <WebIcon name="sparkles" className={className} />;
    case 'all': default: return <WebIcon name="grid" className={className} />;
  }
}

// Các mốc năm tốt nghiệp thực tế từ 2005 đến 2026
const GRADUATION_YEARS = [2005, 2006, 2007, 2013, 2014, 2015, 2016, 2017, 2019, 2026] as const;

// Rút gọn tiêu đề thành đúng 2 chữ súc tích khi ở chế độ Dạng view tiêu đề 2 chữ
function formatTwoWordTitle(course: EducationCourse): string {
  const verifyInfo = CREDENTIAL_VERIFICATION_MAP[course.id];
  if (verifyInfo?.twoWordTitle) return verifyInfo.twoWordTitle;
  const cleaned = formatCardTitle(course.title);
  return cleaned.split(/\s+/).slice(0, 2).join(' ');
}

// Thu gọn tên khóa học / bằng cấp tối đa 4 từ
function formatFourWordTitle(title: string): string {
  const cleaned = formatCardTitle(title);
  const words = cleaned.trim().split(/\s+/);
  if (words.length <= 4) return cleaned;
  return words.slice(0, 4).join(' ');
}

// Nhãn danh mục 2 chữ trên từng thẻ (loại bỏ hoàn toàn dấu &)
function getShortCategoryLabel(category: EducationCourse['category']): string {
  switch (category) {
    case 'degree':
      return 'Cử nhân';
    case 'management':
      return 'Quản trị';
    case 'tech':
      return 'Công nghệ';
    case 'skills':
    default:
      return 'Kỹ năng';
  }
}

function renderCategoryIcon(category: string, className = 'w-3.5 h-3.5 shrink-0') {
  let name = 'grid';
  switch (category) {
    case 'degree': name = 'graduation'; break;
    case 'management': name = 'briefcase'; break;
    case 'tech': name = 'cpu'; break;
    case 'skills': name = 'sparkles'; break;
    case 'all': default: name = 'grid';
  }
  return <WebIcon name={name} className={className} />;
}

// Phân tích tiêu đề khóa học để chọn icon đại diện tương ứng
function getEducationIconByTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('web') || t.includes('lập trình') || t.includes('frontend')) return 'code';
  if (t.includes('dữ liệu') || t.includes('data')) return 'chart';
  if (t.includes('rủi ro') || t.includes('risk')) return 'shield';
  if (t.includes('dự án') || t.includes('project') || t.includes('pmp')) return 'target';
  if (t.includes('cấp cao') || t.includes('lãnh đạo')) return 'award';
  if (t.includes('cấp trung')) return 'users';
  if (t.includes('đào tạo') || t.includes('train')) return 'graduation';
  if (t.includes('thuyết trình')) return 'presentation';
  if (t.includes('phỏng vấn')) return 'message-square';
  if (t.includes('tuyển dụng')) return 'user-plus';
  if (t.includes('cử nhân') || t.includes('cntt') || t.includes('đại học')) return 'graduation';
  if (t.includes('tổng đài') || t.includes('call') || t.includes('contact center')) return 'headset';
  if (t.includes('mạng') || t.includes('ccna') || t.includes('network')) return 'network';
  if (t.includes('máy chủ') || t.includes('mcsa') || t.includes('server')) return 'server';
  return 'book';
}

export const EducationView: React.FC<EducationViewProps> = ({ currentTheme }) => {
  const { isDark: themeIsDark } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'dark-cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-frost-ice-neu';

  const [mainSection, setMainSection] = useState<'education' | 'skills'>('education');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  // Chế độ xem: 'grid' (Lưới chuẩn) hoặc 'bookshelf' (Kệ sách 3D)
  const [viewMode, setViewMode] = useState<'grid' | 'bookshelf'>('bookshelf');
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  // Bộ lọc năm tốt nghiệp Timeline (2005 - 2026)
  const [maxYearFilter, setMaxYearFilter] = useState<number>(2026);
  const [exactYearFilter, setExactYearFilter] = useState<number | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<EducationCourse | null>(null);
  const [verifyingCourse, setVerifyingCourse] = useState<EducationCourse | null>(null);
  const [copiedCredentialId, setCopiedCredentialId] = useState<string | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>('');
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const [isBannerMuted, setIsBannerMuted] = useState<boolean>(true);
  const educationBannerVideo = getDefaultBannerVideoConfig('education');

  const bannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const [matchedControlWidth, setMatchedControlWidth] = useState<number | null>(null);

  useEffect(() => {
    const syncControlSize = () => {
      const btn = filterButtonRef.current;
      const row = filterMenuRef.current;
      if (!btn || !row) return;
      const rowW = Math.floor(row.getBoundingClientRect().width);
      const w = Math.ceil(btn.getBoundingClientRect().width);
      if (rowW <= 0) return;
      if (rowW < 450) {
        setMatchedControlWidth(null);
        return;
      }
      if (w > 0) {
        const maxPerControl = Math.max(160, Math.floor((rowW - 12) / 2));
        setMatchedControlWidth(Math.min(Math.max(w, 200), maxPerControl));
      }
    };
    syncControlSize();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(syncControlSize);
      if (filterButtonRef.current) ro.observe(filterButtonRef.current);
      if (filterMenuRef.current) ro.observe(filterMenuRef.current);
    }
    window.addEventListener('resize', syncControlSize);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', syncControlSize);
    };
  }, [activeCategory, isEn, selectedCourse]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isLightboxOpen) {
        setIsLightboxOpen(false);
      } else if (verifyingCourse) {
        setVerifyingCourse(null);
      } else if (isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
      } else if (selectedCourse) {
        SoundEngine.playBookClose();
        setSelectedCourse(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, verifyingCourse, isFilterDropdownOpen, selectedCourse]);

  // Lọc danh sách theo hình thức đào tạo / danh mục + năm tốt nghiệp
  const filteredCourses = useMemo(() => {
    return EDUCATION_COURSES.filter((c) => {
      const courseYear = parseInt(c.year, 10) || 2024;
      const matchCategory =
        activeCategory === 'all' ||
        c.type === activeCategory ||
        c.category === activeCategory;
      const matchYear = exactYearFilter !== null ? courseYear === exactYearFilter : courseYear <= maxYearFilter;
      return matchCategory && matchYear;
    });
  }, [activeCategory, maxYearFilter, exactYearFilter]);

  const handleOpenDetail = (course: EducationCourse) => {
    SoundEngine.playBookOpen();
    setSelectedCourse(course);
    document.getElementById('education-main-scroll-viewport')?.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('education-main-card')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateSkillToSwot = (skill: string) => {
    SoundEngine.playTap();
    const target = mapEducationSkillToSwot(skill);
    try {
      sessionStorage.setItem('hungthai_focus_swot_skill', JSON.stringify(target));
    } catch {
      // ignore storage errors
    }
    window.dispatchEvent(new CustomEvent('app:navigate-tab', { detail: 6 }));
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('app:focus-swot-skill', { detail: target }));
    }, 80);
  };

  const handleOpenVerifyModal = (course: EducationCourse, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEngine.playTap();
    setVerifyingCourse(course);
  };

  const handleCopyCredential = async (credId: string) => {
    SoundEngine.playTap();
    try {
      await navigator.clipboard.writeText(credId);
      setCopiedCredentialId(credId);
      setTimeout(() => setCopiedCredentialId(null), 2000);
    } catch {
      // Fallback ignore
    }
  };

  const handleOpenLightbox = (imgSrc: string, title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    SoundEngine.playTap();
    setLightboxImage(imgSrc);
    setLightboxTitle(title);
    setIsLightboxOpen(true);
  };

  const handleToggleBannerMute = () => {
    const video = bannerVideoRef.current;
    if (!video) return;
    const next = !isBannerMuted;
    setIsBannerMuted(next);
    video.muted = next;
  };

  const handleResetFilters = () => {
    SoundEngine.playTap();
    setActiveCategory('all');
    setMaxYearFilter(2026);
    setExactYearFilter(null);
  };

  // Tính toán tọa độ đa giác cho Biểu đồ Radar 6 trục
  const radarGeometry = useMemo(() => {
    const cx = 150;
    const cy = 150;
    const maxR = 102;
    const axes = ACADEMIC_COMPETENCY_RADAR;
    const total = axes.length;

    const getPoint = (idx: number, radiusRatio: number) => {
      const angle = (Math.PI * 2 * idx) / total - Math.PI / 2;
      const r = maxR * radiusRatio;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        labelX: cx + (maxR + 30) * Math.cos(angle),
        labelY: cy + (maxR + 24) * Math.sin(angle),
      };
    };

    const gridLevels = [0.25, 0.5, 0.75, 1].map((lvl) => {
      const pts = axes.map((_, idx) => {
        const p = getPoint(idx, lvl);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      });
      return pts.join(' ');
    });

    const dataPoints = axes.map((axis, idx) => {
      const p = getPoint(idx, axis.score / 100);
      const outer = getPoint(idx, 1);
      return {
        axis,
        x: p.x,
        y: p.y,
        outerX: outer.x,
        outerY: outer.y,
        labelX: outer.labelX,
        labelY: outer.labelY,
      };
    });

    const polygonPoints = dataPoints.map((d) => `${d.x.toFixed(1)},${d.y.toFixed(1)}`).join(' ');

    return { cx, cy, maxR, gridLevels, dataPoints, polygonPoints };
  }, []);

  const isBookshelfMode =
    !selectedCourse &&
    mainSection === 'education' &&
    viewMode === 'bookshelf' &&
    filteredCourses.length > 0;

  return (
    <div
      id="education-page-container"
      data-element-name="Trang Học Vấn & Bằng Cấp"
      data-element-type="container"
      data-element-page="education"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-hidden no-scrollbar font-play select-none text-left rounded-none box-border"
    >
      {/* ========================================================================= */}
      {/* CARD HỌC VẤN: CHỨA TOÀN BỘ NỘI DUNG TRANG, FORMAT NHƯ CARD GIỚI THIỆU 1   */}
      {/* ========================================================================= */}
      <div
        id="education-cards-track"
        data-element-name="Track căn giữa Học Vấn"
        data-element-type="container"
        data-element-page="education"
        data-element-parent="education-page-container"
        className="page-cards-track min-w-0 max-w-full"
      >
      <div
        id="education-main-card"
        data-main-card="true"
        data-detail-open={selectedCourse ? 'true' : 'false'}
        data-bookshelf-mode={isBookshelfMode ? 'true' : 'false'}
        data-element-name="Card học vấn"
        data-element-type="card"
        data-element-page="education"
        data-element-parent="education-cards-track"
        className="page-main-card relative flex flex-col justify-start p-[15px] gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play text-left box-border"
      >
      <div
        id="education-main-scroll-viewport"
        className={cn(
          'main-card-scroll-viewport w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[15px] overflow-x-hidden no-scrollbar box-border',
          selectedCourse || isBookshelfMode ? 'overflow-hidden' : 'overflow-y-auto'
        )}
      >
      <div
        id="education-main-wrapper"
        className={cn(
          'w-full max-w-full min-w-0 flex-1 flex flex-col gap-[15px] justify-start box-border',
          selectedCourse && 'h-full flex-1 min-h-0 gap-0',
          isBookshelfMode && 'h-full max-h-full flex-1 min-h-0 overflow-hidden'
        )}
      >
      {/* Banner trang Học Vấn (Kích thước đồng bộ chuẩn banner Kỹ năng) */}
      {!selectedCourse && (
        <section
          id="education-hero-banner"
          data-element-name="Banner card"
          data-element-type="banner-card"
          data-element-page="education"
          data-section-card="true"
          data-has-compact-menu="true"
          className="banner-card hero-banner group w-full max-w-full min-w-0 min-h-[140px] h-auto lg:min-h-[200px] mx-auto rounded-[var(--radius-banner,14px)] overflow-visible relative border text-[var(--text-primary)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 transition-all duration-300 box-border"
          style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: 'var(--radius-banner, 14px)' }}
        >
        <div
          id="education-hero-banner-bg"
          className="project-detail-banner-media absolute inset-0 z-0 rounded-[inherit] overflow-hidden pointer-events-none"
        >
          <VideoBanner
            videoId={educationBannerVideo.videoId}
            title={educationBannerVideo.title}
            className="rounded-[inherit]"
          />
        </div>
        <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

        <div id="education-hero-banner-header" className="banner-header-row relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
            <WebIcon name="graduation-cap" className="w-[22px] h-[22px] shrink-0" />
            <h1
              id="education-hero-banner-title"
              className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
              data-card-title="true"
              style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
            >
              Học vấn bằng cấp
            </h1>
          </div>
          <p
            id="education-hero-banner-quote"
            className="banner-quote typo-h3 font-handwriting font-quote not-italic font-semibold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
            style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 600, fontStyle: 'normal' }}
          >
            &quot;Tri thức mở đường, tư duy định hình tương lai ♡&quot;
          </p>

          <CompactBannerMenu
            id="education-compact-menu-btn"
            label={isEn ? 'Controls' : 'Điều khiển'}
            ariaLabel={isEn ? 'Course filters and view mode' : 'Bộ lọc và dạng xem khóa học'}
            activeCount={activeCategory !== 'all' ? 1 : 0}
          >
            {(closeMenu) => (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="typo-label text-[var(--text-muted)] px-1">
                    {isEn ? 'View mode' : 'Dạng hiển thị'}
                  </span>
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
                      <span>{isEn ? 'Grid' : 'Dạng lưới'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        SoundEngine.playTap();
                        setViewMode('bookshelf');
                        closeMenu();
                      }}
                      style={
                        viewMode === 'bookshelf'
                          ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                          : undefined
                      }
                      className={cn(
                        'flex-1 px-2.5 py-1 rounded-full typo-button font-play flex items-center justify-center gap-1 transition-all cursor-pointer',
                        viewMode === 'bookshelf' ? 'shadow-xs' : 'text-[var(--text-secondary)]'
                      )}
                    >
                      <WebIcon name="book-open" className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? 'Bookshelf' : 'Kệ sách'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="typo-label text-[var(--text-muted)] px-1">
                    {isEn ? 'Training type' : 'Hình thức đào tạo'}
                  </span>
                  {TRAINING_TYPE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        data-selected={isActive ? 'true' : undefined}
                        onClick={() => {
                          SoundEngine.playTap();
                          setActiveCategory(cat.id);
                          closeMenu();
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[12px] typo-nav font-play transition-all cursor-pointer text-left"
                      >
                        <span className="flex items-center gap-2 truncate">
                          {renderTrainingTypeIcon(cat.id, 'w-3.5 h-3.5 shrink-0')}
                          <span className="truncate">{cat.label}</span>
                        </span>
                        {isActive && <WebIcon name="check" className="w-3.5 h-3.5 text-current shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </CompactBannerMenu>
        </div>

        <div id="education-hero-banner-filter-row" className="banner-desktop-controls relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full min-w-0" ref={filterMenuRef}>
          <div className="relative inline-block max-w-full min-w-0 text-left">
            <button
              id="education-filter-toggle-btn"
              ref={filterButtonRef}
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterDropdownOpen((prev) => !prev);
              }}
              style={matchedControlWidth ? { minWidth: `${matchedControlWidth}px`, maxWidth: '100%' } : { maxWidth: '100%' }}
              className="banner-control-pill h-auto min-h-9 max-w-full min-w-0 inline-flex items-center justify-center gap-2 px-3.5 py-1 rounded-full transition-colors cursor-pointer typo-button font-bold font-play group box-border"
              title={isEn ? 'Course Filter' : 'Bộ lọc khóa học'}
              aria-label="Bộ lọc khóa học"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="listbox"
            >
              <WebIcon name="sliders" className="w-4 h-4 text-[var(--text-primary)] shrink-0" />
              <span className="truncate">{isEn ? 'Course Filter' : 'Bộ lọc khóa học'}</span>
              {activeCategory !== 'all' && (
                <span className="banner-count-pill px-1.5 py-0.5 rounded-full typo-badge font-mono truncate max-w-[140px]">
                  {TRAINING_TYPE_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}
                </span>
              )}
              <WebIcon
                name="chevron-down"
                className={cn(
                  'w-3.5 h-3.5 text-[var(--text-primary)] transition-transform duration-200 shrink-0',
                  isFilterDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Drop menu list chứa các hình thức phân loại đào tạo */}
            <AnimatePresence>
              {isFilterDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  role="listbox"
                  className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[min(14rem,calc(100vw-48px))] max-w-[min(22rem,calc(100vw-48px))] rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                >
                  {TRAINING_TYPE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        data-selected={isActive ? 'true' : undefined}
                        onClick={() => {
                          SoundEngine.playTap();
                          setActiveCategory(cat.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left',
                          isActive
                            ? 'shadow-xs font-bold'
                            : ''
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
                            style={{
                              background: isActive ? 'var(--color-primary)' : 'var(--bg-button-secondary)',
                              color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            }}
                          >
                            {renderTrainingTypeIcon(cat.id, 'w-3 h-3')}
                          </span>
                          <span className="truncate">{cat.label}</span>
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          {isActive && <WebIcon name="check" className="w-3.5 h-3.5 text-current stroke-[2.5] shrink-0" />}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Nút chuyển chế độ xem (Dạng view): đồng bộ kích thước cùng nút Bộ lọc khóa học */}
          <div
            id="education-view-mode-switcher"
            role="group"
            aria-label={isEn ? 'View mode' : 'Dạng view'}
            style={
              matchedControlWidth
                ? { minWidth: `${matchedControlWidth}px`, maxWidth: '100%' }
                : { maxWidth: '100%' }
            }
            className="banner-control-pill h-auto min-h-9 max-w-full min-w-0 inline-flex flex-wrap sm:flex-nowrap items-center gap-1 p-0.5 rounded-full box-border shrink"
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
                'flex-1 h-full px-2.5 py-1 rounded-full typo-button font-semibold font-play flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap min-w-0',
                viewMode === 'grid'
                  ? 'shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
              title={isEn ? 'Grid View' : 'Dạng lưới'}
            >
              <WebIcon name="layout-grid" className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{isEn ? 'Grid' : 'Dạng lưới'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setViewMode('bookshelf');
              }}
              style={
                viewMode === 'bookshelf'
                  ? {
                      background: 'var(--bg-button-primary)',
                      color: 'var(--text-button-primary, #FFFFFF)',
                    }
                  : undefined
              }
              className={cn(
                'flex-1 h-full px-2.5 py-1 rounded-full typo-button font-semibold font-play flex items-center justify-center gap-1 transition-all cursor-pointer whitespace-nowrap min-w-0',
                viewMode === 'bookshelf'
                  ? 'shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              )}
              title={isEn ? 'Bookshelf View' : 'Kệ sách'}
            >
              <WebIcon name="book-open" className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{isEn ? 'Bookshelf' : 'Kệ sách'}</span>
            </button>
          </div>
        </div>
      </section>
      )}


      {selectedCourse ? (() => {
        const course = selectedCourse;
        const courseIdx = EDUCATION_COURSES.findIndex((c) => c.id === course.id);
        const courseColor = getCourseColor(course, courseIdx >= 0 ? courseIdx : 0);
        return (
          <EducationBookView
            course={course}
            courseColor={courseColor}
            categoryLabel={getShortCategoryLabel(course.category)}
            isEn={isEn}
            isDark={isDark}
            getSkillTagIcon={getSkillTagIcon}
            onClose={() => setSelectedCourse(null)}
            onNavigateSkillToSwot={handleNavigateSkillToSwot}
            onOpenVerifyModal={handleOpenVerifyModal}
            onOpenLightbox={handleOpenLightbox}
            disableKeyboardNav={isLightboxOpen || Boolean(verifyingCourse)}
          />
        );
      })() : mainSection === 'skills' ? (
        <div className="w-full max-w-full min-w-0 flex-1 min-h-0">
          <SkillsView currentTheme={currentTheme} embedded />
        </div>
      ) : (
        <>


      {/* 4. NỘI DUNG CHÍNH: DẠNG LƯỚI HOẶC KỆ SÁCH (KHÔNG ĐỔI DATA) */}
      {filteredCourses.length === 0 ? (
        <div
          className="theme-muted-surface w-full p-8 rounded-[14px] text-center space-y-2 backdrop-blur-md"
        >
          <p className="typo-body font-semibold font-play" style={{ color: 'var(--text-primary)' }}>Không tìm thấy chứng chỉ nào khớp với bộ lọc hiện tại.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
            className="px-4 py-1.5 rounded-full typo-button hover:opacity-90 transition cursor-pointer"
          >
            Hiển thị tất cả 14 chứng chỉ
          </button>
        </div>
      ) : viewMode === 'bookshelf' ? (
        <EducationBookshelfView
          courses={filteredCourses}
          getCourseColor={getCourseColor}
          getShortCategoryLabel={getShortCategoryLabel}
          isEn={isEn}
          isDark={isDark}
          onSelectCourse={handleOpenDetail}
        />
      ) : (
        /* Grid View */
        <div
          id="education-courses-grid"
          className="education-responsive-grid card-grid w-full min-w-0 items-stretch"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px' }}
        >
          {filteredCourses.map((course, idx) => {
            const localizedCourseTitle = t(course.title);
            const displayTitle = localizedCourseTitle;
            const cardColor = getCourseColor(course, idx);

            return (
              <motion.article
                id={`education-card-${course.id}`}
                key={course.id}
                layoutId={`education-card-${course.id}`}
                data-element-type="card"
                data-distinct-bg="true"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDetail(course)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDetail(course);
                  }
                }}
                className="education-course-card card card-item bento-card glass-card group relative select-none font-play min-w-0 cursor-pointer border-l-0 p-[10px] flex flex-col justify-between rounded-[var(--radius-card,14px)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
                style={
                  {
                    borderColor: isDark
                      ? 'rgba(56, 189, 248, 0.32)'
                      : 'rgba(255, 255, 255, 0.85)',
                    background: isDark
                      ? `linear-gradient(155deg, ${cardColor}38 0%, ${cardColor}18 42%, rgba(15, 23, 42, 0.95) 100%)`
                      : `linear-gradient(155deg, ${cardColor}28 0%, ${cardColor}10 40%, rgba(255, 255, 255, 0.96) 100%)`,
                    boxShadow: isDark
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(56, 189, 248, 0.15)'
                      : '0 10px 25px -5px rgba(30, 58, 138, 0.08), 0 0 15px -3px rgba(56, 189, 248, 0.12)',
                  } as React.CSSProperties
                }
              >
                <div
                  data-media-card="image"
                  style={{ borderRadius: 'var(--radius-image, 14px)', padding: '0px' }}
                  className="education-card-banner themed-image-frame relative w-full overflow-hidden bg-[var(--surface-tertiary-bg,var(--bg-subcard))] shrink-0 group/img border border-[var(--border-subcard)] m-0 p-0 shadow-xs aspect-[16/10] rounded-[var(--radius-image,14px)]"
                >
                  <img
                    src={course.image}
                    alt={localizedCourseTitle}
                    style={{ borderRadius: 'var(--radius-image, 14px)' }}
                    className="w-full h-full object-cover object-center rounded-[inherit] block m-0 p-0"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
                  <div className="absolute bottom-2 left-2.5 right-2.5 z-20 flex items-center justify-between gap-2 text-white">
                    <span className="typo-badge font-semibold truncate drop-shadow-xs max-w-[62%]">
                      {course.issuer}
                    </span>
                    <span className="typo-badge font-mono font-semibold shrink-0 tabular-nums drop-shadow-xs">
                      Năm {course.year}
                    </span>
                  </div>
                </div>

                <div className="card-heading flex flex-col justify-start items-start text-left gap-1 min-w-0 w-full flex-1">
                  <h3
                    className="typo-h4 card-title-synced font-play font-bold line-clamp-2 leading-snug break-words m-0 p-0 flex items-start justify-start text-left gap-1.5 w-full"
                    data-card-title="true"
                    style={{ color: cardColor, textAlign: 'left' }}
                    title={displayTitle}
                  >
                    <WebIcon
                      name={getEducationIconByTitle(displayTitle)}
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: cardColor }}
                    />
                    <span className="text-left">{displayTitle}</span>
                  </h3>

                  {course.desc && (
                    <p className="typo-caption leading-relaxed line-clamp-2 m-0 text-left text-[var(--text-secondary)] w-full">
                      {course.desc}
                    </p>
                  )}

                  {course.result && (
                    <div
                      className="mt-1 px-2.5 py-1 rounded-[10px] border flex items-start gap-1.5 min-w-0 max-w-full shadow-xs self-start text-left"
                      style={{
                        backgroundColor: `${cardColor}12`,
                        borderColor: `${cardColor}35`,
                      }}
                    >
                      <p className="typo-caption font-semibold font-play whitespace-normal break-words min-w-0 line-clamp-1 m-0 text-left" style={{ color: cardColor }}>
                        {course.result}
                      </p>
                    </div>
                  )}
                </div>

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 right-0 w-0 h-0 group-hover:w-7 group-hover:h-7 transition-all duration-300 ease-out rounded-tl-[8px] z-20"
                  style={{
                    background: `linear-gradient(135deg, ${cardColor}45 0%, ${cardColor}20 48%, transparent 52%)`,
                    boxShadow: '-2px -2px 6px rgba(15, 23, 42, 0.14)',
                  }}
                />
              </motion.article>
            );
          })}
        </div>
      )}
        </>
      )}
      </div>
      </div>
      </div>
      </div>

      {/* 5. POPUP KIỂM TRA MÃ CHỨNG CHỈ & TRA CỨU TRỰC TUYẾN (CREDENTIAL VERIFICATION MODAL) */}
      {verifyingCourse && (() => {
        const verifyInfo = CREDENTIAL_VERIFICATION_MAP[verifyingCourse.id];
        if (!verifyInfo) return null;
        const isCopied = copiedCredentialId === verifyInfo.credentialId;

        return (
          <div
            onClick={() => setVerifyingCourse(null)}
            style={{
              background: 'var(--bg-modal-backdrop)',
              backdropFilter: 'blur(var(--blur-modal, 6px))',
              WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={formatCardTitle(verifyingCourse.title)}
              onClick={(e) => e.stopPropagation()}
              data-element-type="card"
              className="theme-modal-card relative w-full max-w-md rounded-[14px] p-[15px] shadow-2xl flex flex-col gap-[15px]"
            >
              <div className="flex items-start justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--border-subcard)' }}>
                <div className="card-header-sync flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                  <WebIcon name="shield-check" className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="typo-label font-mono tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Chứng chỉ xác thực số • Digital Credential
                    </span>
                    <h3 className="typo-popup-title card-title-synced font-play text-emerald-600 dark:text-emerald-400" data-card-title="true">
                      {formatCardTitle(verifyingCourse.title)}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setVerifyingCourse(null)}
                  aria-label="Đóng"
                  className="theme-modal-close p-1 rounded-full transition cursor-pointer"
                >
                  <WebIcon name="cancel" className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-[15px] typo-body-sm">
                <div className="theme-modal-subcard p-[15px] rounded-[14px] flex flex-col gap-[15px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Mã chứng chỉ số:</span>
                    <div className="flex items-center gap-1.5">
                      <code className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono typo-badge border border-emerald-400/30">
                        {verifyInfo.credentialId}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyCredential(verifyInfo.credentialId)}
                        className="theme-modal-close p-1 rounded-[14px] transition cursor-pointer"
                        title="Sao chép mã chứng chỉ"
                      >
                        {isCopied ? <WebIcon name="check" className="w-3.5 h-3.5 text-emerald-500" /> : <WebIcon name="copy" className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Tổ chức cấp:</span>
                    <span className="font-semibold text-right">{verifyInfo.organization}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Hệ thống đăng ký:</span>
                    <span className="font-semibold text-right" style={{ color: 'var(--accent-cyan, var(--color-primary))' }}>{verifyInfo.registryName}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Năm cấp &amp; Mã hồ sơ:</span>
                    <span className="font-mono font-semibold">Năm {verifyingCourse.year} ({verifyingCourse.code})</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t" style={{ borderColor: 'var(--border-subcard)' }}>
                    <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Trạng thái xác thực:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <WebIcon name="check-circle-02" className="w-3.5 h-3.5" />
                      <span>{verifyInfo.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={verifyInfo.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => SoundEngine.playTap()}
                  className="flex-1 py-2 px-3 rounded-full typo-button font-play text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <span>Tra cứu trực tuyến</span>
                  <WebIcon name="external-link" className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const img = verifyingCourse.image;
                    const title = verifyingCourse.title;
                    setVerifyingCourse(null);
                    handleOpenLightbox(img, title);
                  }}
                  className="theme-modal-close py-2 px-3 rounded-full typo-button font-play transition cursor-pointer flex items-center gap-1"
                >
                  <WebIcon name="maximize" className="w-3.5 h-3.5" />
                  <span>Xem bản gốc</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 7. LIGHTBOX PHÓNG TO ẢNH BẰNG CẤP FULL MÀN HÌNH */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightboxTitle}
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-200 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Đóng Lightbox"
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 hover:bg-rose-600 text-white transition cursor-pointer"
              title="Đóng Lightbox"
            >
              <WebIcon name="cancel" className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              decoding="async"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[82vh] object-contain rounded-[var(--radius-card,14px)] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/20 select-none pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 typo-body font-play font-semibold text-white/90 drop-shadow-md text-center">
              {lightboxTitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationView;