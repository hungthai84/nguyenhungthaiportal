 'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SkillsView } from './SkillsView';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';

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

export const EducationView: React.FC<EducationViewProps> = ({ currentTheme }) => {
  const { isDark: themeIsDark } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'deep-ocean';

  const [mainSection, setMainSection] = useState<'education' | 'skills'>('education');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  // Chế độ xem: cố định duy nhất 'grid'
  const [viewMode] = useState<'grid'>('grid');
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
  const [heroVideoFailed, setHeroVideoFailed] = useState<boolean>(false);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState<number>(0);

  const bannerVideoRef = useRef<HTMLVideoElement | null>(null);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

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
    SoundEngine.playTap();
    setSelectedCourse(course);
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

  const handlePrevCarousel = () => {
    SoundEngine.playTap();
    setActiveCarouselIdx((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredCourses.length - 1)));
  };

  const handleNextCarousel = () => {
    SoundEngine.playTap();
    setActiveCarouselIdx((prev) => (prev < filteredCourses.length - 1 ? prev + 1 : 0));
  };

  const handleResetFilters = () => {
    SoundEngine.playTap();
    setActiveCategory('all');
    setMaxYearFilter(2026);
    setExactYearFilter(null);
    setActiveCarouselIdx(0);
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

  const safeCarouselIndex = filteredCourses.length > 0 ? Math.min(activeCarouselIdx, filteredCourses.length - 1) : 0;

  return (
    <div
      id="education-page-container"
      data-element-name="Trang Học Vấn & Bằng Cấp"
      data-element-type="container"
      data-element-page="education"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none box-border"
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
        className="page-cards-track"
      >
      <div
        id="education-main-card"
        data-main-card="true"
        data-detail-open={selectedCourse ? 'true' : 'false'}
        data-element-name="Card học vấn"
        data-element-type="card"
        data-element-page="education"
        data-element-parent="education-cards-track"
        className={cn(
          'page-main-card flex flex-col justify-start rounded-[var(--radius-main,30px)] overflow-x-hidden glass-scrollbar box-border',
          selectedCourse ? 'p-0 gap-0 overflow-hidden' : 'p-[15px] gap-[15px] overflow-y-auto'
        )}
      >
      {/* Banner trang Học Vấn (Format đồng bộ chuẩn banner Hình Nền h-200px desktop, responsive mobile) */}
      {!selectedCourse && (
        <section
          id="education-hero-banner"
          data-element-name="Banner card"
          data-element-type="banner-card"
          data-element-page="education"
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
          {!heroVideoFailed ? (
            <video
              src="https://res.cloudinary.com/q5tpzaxk/video/upload/v1795204142/H%E1%BB%8Dc_v%E1%BA%A5n.mp4"
              poster="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042016/H%E1%BB%8Dc_v%E1%BA%A5n.png"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onError={() => setHeroVideoFailed(true)}
              className="w-full h-full object-cover object-center rounded-[inherit] transition-all duration-700"
            />
          ) : (
            <img
              src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042016/H%E1%BB%8Dc_v%E1%BA%A5n.png"
              alt="Banner Học vấn"
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
            <h1
              className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
              data-card-title="true"
              style={{ textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
            >
              Học vấn &amp; Bằng cấp
            </h1>
          </div>
          <p
            className="banner-quote typo-h3 font-handwriting font-quote not-italic font-bold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[60%]"
            style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 700, fontStyle: 'normal' }}
          >
            &quot;Tri thức mở đường, tư duy định hình tương lai ♡&quot;
          </p>
        </div>

        <div className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto" ref={filterMenuRef}>
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterDropdownOpen((prev) => !prev);
              }}
              className="banner-control-pill h-9 inline-flex items-center gap-2 px-3.5 py-0 rounded-full transition-colors cursor-pointer typo-button font-bold font-play active:scale-95 group"
              title={isEn ? 'Course Filter' : 'Bộ lọc khóa học'}
              aria-label="Bộ lọc khóa học"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="listbox"
            >
              <WebIcon name="sliders" className="w-4 h-4 text-[var(--text-primary)] shrink-0" />
              <span>{isEn ? 'Course Filter' : 'Bộ lọc khóa học'}</span>
              {activeCategory !== 'all' && (
                <span className="banner-count-pill px-1.5 py-0.5 rounded-full typo-badge font-mono">
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
                  className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-max min-w-[14rem] max-w-full rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                >
                  {TRAINING_TYPE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const count =
                      cat.id === 'all'
                        ? EDUCATION_COURSES.length
                        : EDUCATION_COURSES.filter((c) => c.type === cat.id).length;

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
        </div>
      </section>
      )}


      {mainSection === 'skills' ? (
        <div className="w-full flex-1 min-h-0">
          <SkillsView currentTheme={currentTheme} embedded />
        </div>
      ) : (
        <>


      {/* 4. NỘI DUNG CHÍNH: DẠNG LƯỚI HOẶC CHI TIẾT (NỀN TRONG SUỐT 50%) */}
      {filteredCourses.length === 0 ? (
        <div
          className="theme-muted-surface w-full p-8 rounded-[14px] text-center space-y-2 backdrop-blur-md"
        >
          <p className="typo-body font-semibold font-play" style={{ color: 'var(--text-primary)' }}>Không tìm thấy chứng chỉ nào khớp với bộ lọc hiện tại.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{ background: 'var(--bg-button-primary)' }}
            className="px-4 py-1.5 rounded-full typo-button text-white hover:opacity-90 transition cursor-pointer"
          >
            Hiển thị tất cả 14 chứng chỉ
          </button>
        </div>
      ) : selectedCourse ? (
        /* Rendered below as a conditional block to maintain clean logic */
        null
      ) : (
        /* CHẾ ĐỘ LƯỚI (GRID VIEW) - RESPONSIVE GRID TỰ ĐỘNG THÍCH ỨNG Ở MỌI KÍCH THƯỚC MÀN HÌNH */
        <div
          id="education-courses-grid"
          className="education-responsive-grid w-full min-w-0 items-stretch"
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
                data-section-card="true"
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDetail(course)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDetail(course);
                  }
                }}
                className="education-course-card bento-card glass-card layered-card group relative rounded-[14px] p-[10px] flex flex-col justify-between gap-[10px] border select-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer font-play min-w-0"
                style={{
                  borderColor: `${cardColor}45`,
                  padding: '10px',
                }}
              >
                {/* 1. Ảnh bìa banner tỷ lệ 16:10 nằm gọn trong card padding 1px */}
                <div
                  data-media-card="image"
                  style={{ borderRadius: 'var(--radius-card, 14px)' }}
                  className="education-card-banner themed-image-frame relative w-full aspect-[16/10] overflow-hidden bg-[var(--surface-tertiary-bg,var(--bg-subcard))] shrink-0 group/img rounded-[var(--radius-card,14px)] m-0 p-[1px]"
                >
                  <img
                    src={course.image}
                    alt={localizedCourseTitle}
                    style={{ borderRadius: 'var(--radius-card, 14px)' }}
                    className="w-full h-full object-cover object-center rounded-[inherit] block m-0 p-0"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <span
                    className="education-year-badge banner-control-pill absolute top-2.5 right-2.5 z-20 typo-badge font-mono px-2.5 py-1 rounded-full inline-flex items-center gap-1 font-semibold"
                  >
                    <WebIcon name="calendar" className="w-3 h-3 shrink-0" style={{ color: 'var(--text-link, var(--color-primary))' }} />
                    <span>Năm {course.year}</span>
                  </span>
                </div>

                {/* 2. Thân Card: nội dung bên trong cách mép thẻ học vấn 10px */}
                <div className="education-card-body flex-1 flex flex-col justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="card-header-sync flex items-start gap-2 min-w-0" style={{ color: cardColor }}>
                      <h3
                        className="typo-h4 card-title-synced font-play font-bold line-clamp-2 leading-snug break-words m-0 p-0 flex-1 min-w-0"
                        data-card-title="true"
                        style={{ color: cardColor }}
                        title={displayTitle}
                      >
                        {displayTitle}
                      </h3>
                    </div>

                    <div className="space-y-1.5 mt-2 min-w-0">
                      <div className="flex items-start gap-1.5 font-play min-w-0">
                        <span className="typo-label shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>Đào tạo:</span>
                        <span className="typo-body-sm font-semibold whitespace-normal break-words line-clamp-2" style={{ color: 'var(--text-primary)' }}>{course.issuer}</span>
                      </div>
                      <div className="flex items-start gap-1.5 font-play min-w-0">
                        <span className="typo-label shrink-0 pt-0.5" style={{ color: 'var(--text-muted)' }}>Hình thức:</span>
                        <span className="typo-body-sm font-semibold whitespace-normal break-words line-clamp-2" style={{ color: 'var(--text-primary)' }}>{course.type}</span>
                      </div>
                    </div>
                  </div>

                  {course.result && (
                    <div
                      className="mt-1 p-2.5 rounded-[14px] border flex items-start gap-2 transition-colors shadow-xs min-w-0"
                      style={{
                        backgroundColor: `${cardColor}10`,
                        borderColor: `${cardColor}30`,
                      }}
                    >
                      <WebIcon name="award" className="w-4 h-4 shrink-0 mt-0.5" style={{ color: cardColor }} />
                      <p className="typo-caption font-semibold font-play whitespace-normal break-words min-w-0 line-clamp-2" style={{ color: cardColor }}>
                        {course.result}
                      </p>
                    </div>
                  )}
                </div>

              </motion.article>
            );
          })}
        </div>
      )}

      {/* 6. EXPANDED COURSE DETAIL CARDS (ĐƯA TRỰC TIẾP RA THẺ CHÍNH, KHÔNG LỒNG KHUNG WRAPPER PHỤ) */}
      {selectedCourse && (() => {
        const course = selectedCourse;
        return (
          <motion.div
            id="el-p3-div-87"
            key={`education-detail-${course.id}`}
            layoutId={`education-card-${course.id}`}
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{
              duration: 0.45,
              ease: [0.25, 1, 0.5, 1],
            }}
            data-element-type="card"
            data-section-card="true"
            className="w-full h-full flex-1 min-h-0 overflow-y-auto overflow-x-hidden glass-scrollbar flex flex-col gap-[15px] text-left font-play bg-transparent border-0 shadow-none p-[15px] rounded-[inherit] box-border"
            style={{
              background: 'transparent',
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              padding: '15px',
            }}
          >
            {/* Master Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[var(--border-subcard)] min-w-0">
              <div className="card-header-sync flex items-center gap-2.5 min-w-0 text-blue-600 dark:text-sky-400" data-card-accent="blue">
                <div className="min-w-0">
                  <h3 className="card-title card-title-synced typo-h3 font-play font-bold whitespace-normal break-words text-blue-600 dark:text-sky-400 m-0" data-card-title="true">
                    {course.title}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setSelectedCourse(null);
                }}
                className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] hover:bg-[var(--bg-button-primary)] hover:text-white text-[var(--text-secondary)] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                title={isEn ? "Close details" : "Đóng chi tiết"}
                aria-label={isEn ? "Close details" : "Đóng chi tiết khóa học"}
              >
                <WebIcon name="x" className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Content Grid grouping the detail cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-[15px] items-start content-start min-w-0">
                {/* 1. THÔNG TIN KHÓA HỌC (#el-p3-div-90) */}
                <div
                  id="el-p3-div-90"
                  className="col-span-1 md:col-span-8 lg:col-span-12 p-[15px] rounded-[var(--radius-card,24px)] border shadow-sm flex flex-col gap-[15px] min-w-0 bg-[var(--surface-primary-bg,var(--bg-card))] h-auto"
                  style={{ borderRadius: 'var(--radius-card, 24px)', padding: '15px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] flex-wrap">
                    <div className="card-header-sync flex items-center gap-2 text-blue-600 dark:text-sky-400 min-w-0" data-card-accent="blue">
                      <h3 className="card-title card-title-synced typo-h3 font-play text-blue-600 dark:text-sky-400 m-0 p-0 whitespace-normal break-words" data-card-title="true">
                        {course.title}
                      </h3>
                    </div>
                  </div>
                  <div className="education-detail-meta-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch min-w-0">
                    {/* Mục 1: Năm học và mã */}
                    <div className="flex flex-col justify-between gap-2 min-w-0">
                      <div className="subcard-header-sync flex items-center gap-1.5 text-sky-600 dark:text-sky-400" data-subcard-accent="sky">
                        <span className="subcard-title-synced typo-h4 tracking-normal text-sky-600 dark:text-sky-400" data-subcard-title="true">Năm học và mã</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="typo-body font-semibold text-sky-700 dark:text-sky-300">
                          Năm {course.year}
                        </span>
                        {course.code && (
                          <span className="px-2 py-0.5 rounded-[var(--radius-subcard,16px)] bg-sky-200/80 dark:bg-sky-900/70 text-sky-900 dark:text-sky-200 typo-badge font-mono">
                            {course.code}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Mục 2: Đơn vị đào tạo */}
                    <div className="flex flex-col justify-between gap-2 min-w-0">
                      <div className="subcard-header-sync flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400" data-subcard-accent="indigo">
                        <span className="subcard-title-synced typo-h4 tracking-normal text-indigo-600 dark:text-indigo-400" data-subcard-title="true">Đơn vị đào tạo</span>
                      </div>
                      <span className="typo-body-sm font-semibold break-words" style={{ color: 'var(--text-primary)' }}>
                        {course.issuer}
                      </span>
                    </div>

                    {/* Mục 3: Hình thức đào tạo */}
                    <div className="flex flex-col justify-between gap-2 min-w-0">
                      <div className="subcard-header-sync flex items-center gap-1.5 text-teal-600 dark:text-teal-400" data-subcard-accent="teal">
                        <span className="subcard-title-synced typo-h4 tracking-normal text-teal-600 dark:text-teal-400" data-subcard-title="true">Hình thức đào tạo</span>
                      </div>
                      <span className="typo-body-sm font-semibold text-teal-700 dark:text-teal-300 break-words">
                        {course.type || 'Chuyên sâu thực chiến'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. THẺ DANH MỤC KHÓA HỌC */}
                <div
                  id="education-certificates-card"
                  data-element-type="card"
                  data-section-card="true"
                  className="bento-card glass-card bento-view-card exp-detail-card col-span-1 md:col-span-8 lg:col-span-6 h-auto p-[15px] rounded-[var(--radius-card,24px)] border shadow-sm flex flex-col justify-start gap-[12px] transition-all duration-300 min-w-0"
                  style={{ padding: '15px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)] flex-wrap">
                    <div className="card-header-sync flex items-center gap-2 text-amber-600 dark:text-amber-400" data-card-accent="amber">
                      <h3 className="card-title card-title-synced typo-h3 font-play text-amber-600 dark:text-amber-400 m-0 p-0" data-card-title="true">
                        Danh mục khóa học
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[12px] mt-0 w-full justify-start">
                    {/* Danh sách các chuyên đề */}
                    <ul id="el-p3-ul-1" className="flex flex-col gap-[10px] list-none p-0 m-0 w-full">
                      {course.modules.map((mod, idx) => (
                        <li
                          key={idx}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-[12px] transition-all group/mod min-w-0 bg-[var(--surface-secondary-bg,rgba(255,255,255,0.04))] border border-[var(--border-subcard)]"
                        >
                          <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center typo-badge font-mono shrink-0 group-hover/mod:bg-amber-500 group-hover/mod:text-white transition-colors">
                            {idx + 1}
                          </span>
                          <span
                            title={mod}
                            className={`typo-body-sm font-semibold flex-1 min-w-0 ${
                              course.id === 1 ? 'truncate whitespace-nowrap' : 'break-words'
                            }`}
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {mod}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Từ khóa kỹ năng */}
                    <div className="h-fit py-1 flex flex-col gap-2 min-w-0">
                      <div className="subcard-header-sync flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400" data-subcard-accent="emerald">
                        <span className="subcard-title-synced typo-h4 tracking-normal text-emerald-700 dark:text-emerald-400" data-subcard-title="true">Từ khóa kỷ năng</span>
                      </div>
                      {course.skills && course.skills.length > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          {course.skills.map((skill, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleNavigateSkillToSwot(skill)}
                              title={isEn ? `View ${skill} in Core Skills SWOT` : `Xem kỹ năng "${skill}" trong Ma trận Kỹ năng SWOT`}
                              className="education-skill-chip inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full typo-badge cursor-pointer transition-all hover:shadow-xs active:scale-95"
                            >
                              <WebIcon name={getSkillTagIcon(skill)} className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{skill}</span>
                              <WebIcon name="arrow-right" className="w-2.5 h-2.5 opacity-60 shrink-0" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="typo-body-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                          Thông tin chưa được cung cấp.
                        </span>
                      )}
                    </div>

                    {/* Hình ảnh khóa học */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenLightbox(course.courseImg || course.image, `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${t(course.title)}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenLightbox(course.courseImg || course.image, `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${t(course.title)}`);
                        }
                      }}
                      className="h-fit py-1 transition-all cursor-pointer group/photo flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
                        <div className="subcard-header-sync flex items-center gap-1.5 text-purple-600 dark:text-purple-400" data-subcard-accent="purple">
                          <span className="subcard-title-synced typo-h4 tracking-normal text-purple-600 dark:text-purple-400" data-subcard-title="true">
                            Hình ảnh khóa học
                          </span>
                        </div>
                        <span className="typo-label text-purple-700 dark:text-purple-300 group-hover/photo:underline flex items-center gap-1">
                          <span>Phóng to</span>
                        </span>
                      </div>
                      <div
                        data-media-card="image"
                        style={{ borderRadius: 'var(--radius-card, 14px)' }}
                        className="education-card-banner themed-image-frame relative aspect-[16/9] w-full rounded-[var(--radius-card,14px)] overflow-hidden bg-slate-950 border border-[var(--border-subcard)] p-[1px]"
                      >
                        <img
                          src={course.courseImg || course.image}
                          alt={course.title}
                          style={{ borderRadius: 'var(--radius-card, 14px)' }}
                          className="w-full h-full object-cover object-top rounded-[inherit] block"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Trọng tâm */}
                    {(course.focus || course.orientation) && (
                      <div className="h-fit py-1 typo-body-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-semibold text-amber-700 dark:text-amber-300 mr-1.5">Trọng tâm:</span>
                        {course.focus || course.orientation}
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. THẺ KẾT QUẢ ĐẠT ĐƯỢC */}
                <div
                  id="education-major-card"
                  data-element-type="card"
                  data-section-card="true"
                  className="bento-card glass-card bento-view-card exp-detail-card col-span-1 md:col-span-8 lg:col-span-6 h-auto p-[15px] rounded-[var(--radius-card,24px)] border shadow-sm flex flex-col justify-start gap-[12px] transition-all duration-300 min-w-0"
                  style={{ padding: '15px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subcard)]">
                    <div className="card-header-sync flex items-center gap-2 text-emerald-600 dark:text-emerald-400" data-card-accent="emerald">
                      <h3 className="card-title card-title-synced typo-h3 font-play text-emerald-600 dark:text-emerald-400 m-0 p-0" data-card-title="true">
                        Kết quả đạt được
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[12px] mt-0 w-full justify-start">
                    {/* Chứng nhận đánh giá */}
                    <div className="h-fit py-1 flex flex-col gap-2">
                      <div className="subcard-header-sync flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400" data-subcard-accent="emerald">
                        <span className="subcard-title-synced typo-h4 tracking-normal text-emerald-700 dark:text-emerald-400" data-subcard-title="true">Chứng nhận đánh giá</span>
                      </div>
                      <p className="typo-body-sm font-semibold break-words" style={{ color: 'var(--text-primary)' }}>
                        {course.result || 'Đã hoàn thành xuất sắc toàn diện khóa học'}
                      </p>
                    </div>

                    {/* Ứng dụng thực tiễn */}
                    {course.application && (
                      <div className="h-fit py-1 flex flex-col gap-2">
                        <div className="subcard-header-sync flex items-center gap-1.5 text-teal-700 dark:text-teal-400" data-subcard-accent="teal">
                          <span className="subcard-title-synced typo-h4 tracking-normal text-teal-700 dark:text-teal-400" data-subcard-title="true">Ứng dụng thực tiễn</span>
                        </div>
                        <p className="typo-body-sm break-words" style={{ color: 'var(--text-secondary)' }}>
                          {course.application}
                        </p>
                      </div>
                    )}

                    {/* Văn bằng chứng nhận */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleOpenLightbox(course.certImg || course.image, `${isEn ? 'Credential' : 'Bằng cấp'}: ${t(course.title)}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenLightbox(course.certImg || course.image, `${isEn ? 'Credential' : 'Bằng cấp'}: ${t(course.title)}`);
                        }
                      }}
                      className="h-fit py-1 transition-all cursor-pointer group/cert flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between text-rose-600 dark:text-rose-400">
                        <div className="subcard-header-sync flex items-center gap-1.5 text-rose-600 dark:text-rose-400" data-subcard-accent="rose">
                          <span className="subcard-title-synced typo-h4 tracking-normal text-rose-600 dark:text-rose-400" data-subcard-title="true">
                            Văn bằng chứng nhận
                          </span>
                        </div>
                        <span className="typo-label text-rose-700 dark:text-rose-300 group-hover/cert:underline flex items-center gap-1">
                          <span>Xem bằng</span>
                        </span>
                      </div>
                      <div
                        data-media-card="image"
                        style={{ borderRadius: 'var(--radius-card, 14px)' }}
                        className="relative aspect-[16/9] w-full rounded-[var(--radius-card,14px)] overflow-hidden bg-slate-950 border border-[var(--border-subcard)] p-[1px]"
                      >
                        <img
                          src={course.certImg || course.image}
                          alt="Chứng nhận bằng cấp"
                          style={{ borderRadius: 'var(--radius-card, 14px)' }}
                          className="w-full h-full object-cover object-top rounded-[inherit] block"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>

            </div>
          </motion.div>
        );
      })()}
        </>
      )}
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