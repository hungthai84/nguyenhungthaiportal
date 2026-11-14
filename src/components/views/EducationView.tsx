 'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SkillsView } from './SkillsView';
import { cn } from '@/lib/utils';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
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

// Icon tiêu đề dựa theo tên tiêu đề bài học / bằng cấp
function getCourseTitleIcon(title: string, category: string): string {
  const norm = (title || '').toLowerCase();
  if (norm.includes('cử nhân') || norm.includes('đại học') || norm.includes('thạc sĩ') || norm.includes('bằng cử nhân')) return 'graduation';
  if (norm.includes('pmp') || norm.includes('quản lý dự án') || norm.includes('dự án') || norm.includes('project')) return 'target';
  if (norm.includes('copc') || norm.includes('contact center') || norm.includes('cskh') || norm.includes('chăm sóc') || norm.includes('khách hàng') || norm.includes('cx')) return 'heart';
  if (norm.includes('itil') || norm.includes('công nghệ') || norm.includes('ai') || norm.includes('cntt') || norm.includes('lập trình') || norm.includes('dev')) return 'cpu';
  if (norm.includes('iso') || norm.includes('bảo mật') || norm.includes('kiểm toán') || norm.includes('chuẩn')) return 'shield';
  if (norm.includes('tiếng anh') || norm.includes('toeic') || norm.includes('ngôn ngữ') || norm.includes('english') || norm.includes('giao tiếp')) return 'globe';
  if (norm.includes('lãnh đạo') || norm.includes('quản trị') || norm.includes('giám đốc') || norm.includes('điều hành') || norm.includes('executive')) return 'briefcase';
  if (norm.includes('tài chính') || norm.includes('kế toán') || norm.includes('phân tích')) return 'chart';
  if (norm.includes('kỹ năng') || norm.includes('tư duy') || norm.includes('đào tạo')) return 'brain';

  if (category === 'degree') return 'graduation';
  if (category === 'management') return 'briefcase';
  if (category === 'tech') return 'cpu';
  return 'award';
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
  { id: 'all', label: 'Tất cả hình thức' },
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
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isDark = themeIsDark || currentTheme === 'dark-neon';

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

  const cardSampleStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cleanCardStyle } = cardSampleStyle as any;

  return (
    <div
      id="education-page-container"
      data-element-name="Trang Học Vấn & Bằng Cấp"
      data-element-type="card"
      data-section-card="true"
      data-element-page="education"
      style={{
        ...cleanCardStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card w-full h-full flex flex-col justify-between p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
    >
      {/* Banner trang Học Vấn (Format đồng bộ chuẩn banner Hình Nền h-200px, p-[15px], bo cong 14px) */}
      {!selectedCourse && (
        <section
          id="education-hero-banner"
          data-element-name="Banner card"
          data-element-type="banner-card"
          data-element-page="education"
          data-section-card="true"
          className="banner-card hero-banner w-full max-w-full h-[200px] min-h-[200px] max-h-[200px] mx-auto rounded-[14px] overflow-hidden relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-30 backdrop-blur-xl"
          style={{ padding: '15px', width: '100%', maxWidth: '100%', height: '200px', minHeight: '200px', maxHeight: '200px', borderRadius: '14px' }}
        >
        <div
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 50%, #0f172a 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793042016/H%E1%BB%8Dc_v%E1%BA%A5n.png"
            alt="Banner Học vấn"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/25 to-slate-950/55 pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2 shrink-0">
            <WebIcon
              name="graduation"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
              style={{ color: '#38bdf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
            />
            <h1
              className="text-[22px] font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] whitespace-nowrap"
              style={{ color: '#38bdf8', fontSize: '22px', fontWeight: 700, textTransform: 'none', fontStyle: 'normal', transform: 'none' }}
            >
              Học vấn & Bằng cấp
            </h1>
          </div>
          <p
            className="font-handwriting font-italianno not-italic text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-right ml-auto whitespace-nowrap overflow-hidden text-ellipsis max-w-[65%]"
            style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontSize: '28px', fontWeight: 700, fontStyle: 'normal' }}
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
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#111827]/95 hover:bg-white dark:hover:bg-[#1F2937] text-cyan-900 dark:text-cyan-200 border border-cyan-300 dark:border-cyan-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all cursor-pointer text-xs font-bold font-play active:scale-95 group"
              title="Bộ lọc danh mục"
              aria-expanded={isFilterDropdownOpen}
              aria-haspopup="listbox"
            >
              <WebIcon name="sliders" className="w-4 h-4 text-cyan-700 dark:text-cyan-400 transition-transform group-hover:rotate-45 shrink-0" />
              <span>Bộ lọc hình thức</span>
              {activeCategory !== 'all' && (
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-300 dark:border-cyan-500/50 text-[10px] font-mono text-cyan-900 dark:text-cyan-200 font-bold">
                  {TRAINING_TYPE_CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}
                </span>
              )}
              <WebIcon
                name="chevron-down"
                className={cn(
                  'w-3.5 h-3.5 text-cyan-700 dark:text-cyan-400 transition-transform duration-200 shrink-0',
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
                  className="bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-64 rounded-[14px] bg-white/98 dark:bg-[#111827]/96 border border-cyan-200/90 dark:border-[#334155] shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.65)] backdrop-blur-2xl py-2 px-2 z-50 flex flex-col gap-1 text-slate-900 dark:text-[#E2E8F0]"
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
                        onClick={() => {
                          SoundEngine.playTap();
                          setActiveCategory(cat.id);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] text-xs font-bold font-play transition-all cursor-pointer text-left',
                          isActive
                            ? 'bg-cyan-100/90 dark:bg-cyan-500/20 text-cyan-950 dark:text-cyan-200 font-extrabold border border-cyan-300/90 dark:border-cyan-400/50 shadow-xs'
                            : 'text-slate-700 dark:text-[#E2E8F0] hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-white border border-transparent font-semibold'
                        )}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors',
                              isActive ? 'bg-cyan-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            )}
                          >
                            {renderTrainingTypeIcon(cat.id, 'w-3 h-3')}
                          </span>
                          <span className="truncate">{cat.label}</span>
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold',
                              isActive
                                ? 'bg-cyan-200/90 dark:bg-cyan-500/30 text-cyan-950 dark:text-cyan-100 border border-cyan-300 dark:border-cyan-400/50'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700'
                            )}
                          >
                            {count}
                          </span>
                          {isActive && <WebIcon name="check" className="w-3.5 h-3.5 text-cyan-700 dark:text-cyan-300 stroke-[2.5] shrink-0" />}
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
          <SkillsView currentTheme={currentTheme} />
        </div>
      ) : (
        <>


      {/* 4. NỘI DUNG CHÍNH: DẠNG LƯỚI HOẶC CHI TIẾT (NỀN TRONG SUỐT 50%) */}
      {filteredCourses.length === 0 ? (
        <div
          className="w-full p-8 rounded-[14px] border border-slate-300/60 dark:border-slate-700/60 text-center space-y-2"
          style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <p className="text-sm font-bold font-play">Không tìm thấy chứng chỉ nào khớp với bộ lọc hiện tại.</p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
          >
            Hiển thị tất cả 14 chứng chỉ
          </button>
        </div>
      ) : selectedCourse ? (
        /* Rendered below as a conditional block to maintain clean logic */
        null
      ) : (
        /* CHẾ ĐỘ LƯỚI (GRID VIEW) - NỀN TRONG SUỐT 50%, CÁC CARD CÁCH NHAU 15PX Ở MỌI KÍCH THƯỚC THIẾT BỊ */
        <div
          id="education-courses-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[15px] items-stretch"
          style={{ gap: '15px', rowGap: '15px', columnGap: '15px' }}
        >
          {filteredCourses.map((course, idx) => {
            const localizedCourseTitle = t(course.title);
            const displayTitle = formatFourWordTitle(localizedCourseTitle);
            const cardColor = getCourseColor(course, idx);
            const titleIcon = getCourseTitleIcon(course.title, course.category);

            return (
              <motion.article
                id={`education-card-${course.id}`}
                key={course.id}
                layoutId={`education-card-${course.id}`}
                data-element-type="card"
                data-section-card="true"
                onClick={() => handleOpenDetail(course)}
                className={`education-card bento-card glass-card bento-view-card group relative rounded-[14px] overflow-hidden p-[10px] flex flex-col justify-between border select-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/85 border-slate-700/70 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-slate-100'
                    : 'bg-white/95 border-slate-200/90 shadow-md text-slate-800'
                }`}
                style={{
                  borderColor: `${cardColor}45`,
                  padding: '10px',
                  borderRadius: '14px',
                }}
              >
                {/* 1. Ảnh bìa khuôn viên/chứng nhận tỷ lệ 16:9 kèm nhãn niên khóa */}
                <div className="relative w-full aspect-[16/9] rounded-[10px] overflow-hidden bg-slate-950/50 shrink-0 border-0 shadow-xs mb-3 group/img">
                  <img
                    src={course.image}
                    alt={localizedCourseTitle}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* 2. Tiêu đề bằng cấp/chuyên ngành có icon học thuật đặt ngay phía trước cùng hàng */}
                <div className="flex-1 flex flex-col justify-start space-y-4 text-left">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <WebIcon
                        name={titleIcon}
                        className="w-5 h-5 shrink-0"
                        style={{ color: cardColor }}
                      />
                      <h3
                        className="education-card-title text-[17px] font-bold font-play leading-tight tracking-tight truncate flex-1 min-w-0"
                        style={{ color: cardColor }}
                      >
                        {displayTitle}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold shrink-0 px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${cardColor}20`, color: cardColor }}>
                      {isEn ? `Year ${course.year}` : `Năm ${course.year}`}
                    </span>
                  </div>

                  {/* 3. Nhóm thông tin Đào tạo tại và Hình thức đào tạo với nhãn đậm dễ quét mắt */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-1.5 text-[12px] font-play">
                      <span className="text-slate-500 dark:text-slate-400 font-black shrink-0">Đào tạo tại:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{course.issuer}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-play">
                      <span className="text-slate-500 dark:text-slate-400 font-black shrink-0">Hình thức:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{course.type}</span>
                    </div>
                  </div>

                  {/* 4. Thanh thông số thành tích/GPA hợp nhất vào một sub-card duy nhất */}
                  {course.result && (
                    <div 
                      className="mt-auto p-2.5 rounded-[12px] border flex items-center gap-2 transition-colors shadow-xs"
                      style={{
                        backgroundColor: `${cardColor}10`,
                        borderColor: `${cardColor}30`,
                      }}
                    >
                      <WebIcon name="award" className="w-4 h-4 shrink-0" style={{ color: cardColor }} />
                      <p className="text-[11px] font-extrabold font-play line-clamp-1" style={{ color: cardColor }}>
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

      {/* 5. POPUP KIỂM TRA MÃ CHỨNG CHỈ & TRA CỨU TRỰC TUYẾN (CREDENTIAL VERIFICATION MODAL) */}
      {verifyingCourse && (() => {
        const verifyInfo = CREDENTIAL_VERIFICATION_MAP[verifyingCourse.id];
        if (!verifyInfo) return null;
        const isCopied = copiedCredentialId === verifyInfo.credentialId;

        return (
          <div
            onClick={() => setVerifyingCourse(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              data-element-type="card"
              className={`bento-card glass-card relative w-full max-w-md rounded-[14px] border p-5 shadow-2xl space-y-4 ${
                isDark
                  ? 'bg-slate-900/95 border-cyan-400/50 text-white shadow-[0_0_45px_rgba(6,182,212,0.25)]'
                  : 'bg-white/95 border-cyan-300 text-slate-900 shadow-2xl'
              }`}
              style={{ backdropFilter: 'blur(20px)' }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <WebIcon name="shield-check" className="w-6 h-6 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Chứng chỉ xác thực số • Digital Credential
                    </span>
                    <h3 className="text-base font-black font-play text-emerald-600 dark:text-emerald-400">
                      {formatCardTitle(verifyingCourse.title)}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setVerifyingCourse(null)}
                  className="p-1 rounded-[14px] bg-slate-100 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                >
                  <WebIcon name="cancel" className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-[14px] bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Mã chứng chỉ số:</span>
                    <div className="flex items-center gap-1.5">
                      <code className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono font-black text-xs border border-emerald-400/30">
                        {verifyInfo.credentialId}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyCredential(verifyInfo.credentialId)}
                        className="p-1 rounded-[14px] bg-white dark:bg-slate-700 hover:bg-emerald-500 hover:text-white border border-slate-300 dark:border-slate-600 transition cursor-pointer"
                        title="Sao chép mã chứng chỉ"
                      >
                        {isCopied ? <WebIcon name="check" className="w-3.5 h-3.5 text-emerald-500" /> : <WebIcon name="copy" className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Tổ chức cấp:</span>
                    <span className="font-bold text-right">{verifyInfo.organization}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Hệ thống đăng ký:</span>
                    <span className="font-semibold text-cyan-600 dark:text-cyan-300 text-right">{verifyInfo.registryName}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Năm cấp &amp; Mã hồ sơ:</span>
                    <span className="font-mono font-bold">Năm {verifyingCourse.year} ({verifyingCourse.code})</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/5 dark:border-white/10">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Trạng thái xác thực:</span>
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                      <WebIcon name="check-circle-02" className="w-3.5 h-3.5" />
                      <span>{verifyInfo.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={verifyInfo.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => SoundEngine.playTap()}
                  className="flex-1 py-2 px-3 rounded-[14px] text-xs font-bold font-play text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 shadow-md transition flex items-center justify-center gap-1.5"
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
                  className="py-2 px-3 rounded-[14px] text-xs font-bold font-play border border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
                >
                  <WebIcon name="maximize" className="w-3.5 h-3.5" />
                  <span>Xem bản gốc</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 6. EXPANDED COURSE DETAIL CARD (BENTO RESPONSIVE GRID, KÍCH THƯỚC SUB CARD BẰNG NỘI DUNG BÊN TRONG, CÁCH NHAU 15PX) */}
      {selectedCourse && (() => {
        const course = selectedCourse;
        return (
          <motion.div
            id={`education-detail-panel-${course.id}`}
            key={`education-detail-${course.id}`}
            layoutId={`education-card-${course.id}`}
            data-element-type="card"
            data-section-card="true"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{
              duration: 0.45,
              ease: [0.25, 1, 0.5, 1],
            }}
            className={`bento-card glass-card theme-pastel-card w-full h-full min-h-0 overflow-y-auto max-h-full rounded-[14px] border p-[10px] gap-[15px] shadow-[0_16px_40px_-6px_rgba(15,23,42,0.18),0_6px_16px_-2px_rgba(15,23,42,0.08),inset_0_1px_2px_rgba(255,255,255,0.95)] dark:shadow-[0_24px_50px_-8px_rgba(0,0,0,0.85),0_0_32px_rgba(16,185,129,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.18)] relative flex flex-col justify-start text-left font-play transition-all duration-300 ${
              isDark ? 'bg-slate-900 border-emerald-400/50 text-white' : 'bg-white border-emerald-300 text-slate-900'
            }`}
            style={{ padding: '10px', gap: '15px' }}
          >
            {/* Soft ambient background glows */}
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full pointer-events-none opacity-80 blur-3xl bg-emerald-500/20" />
            <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-white/40 dark:bg-white/5 blur-2xl pointer-events-none" />

            {/* Header Bar: Huy hiệu tròn + Tiêu đề + Mũi tên > + Nút Quay lại & Đóng X */}
            <div className="w-full flex items-center justify-between gap-3 shrink-0 pb-3 border-b border-black/10 dark:border-white/10 relative z-10 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap">
                <WebIcon name="graduation" className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />

                <motion.h3
                  layoutId={`education-title-${course.id}`}
                  className="text-[18px] sm:text-[20px] font-black font-play leading-snug tracking-tight truncate flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                  title={t(course.title)}
                >
                  <span>{formatCardTitle(t(course.title))}</span>
                  <WebIcon name="chevron-right" className="w-4 h-4 opacity-70 shrink-0" />
                </motion.h3>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border shadow-2xs bg-emerald-100/90 dark:bg-slate-800/90 border-emerald-300/80 dark:border-white/15 text-emerald-800 dark:text-emerald-300 shrink-0">
                  <span>{isEn ? `Year ${course.year}` : `Năm ${course.year}`} • {course.code}</span>
                </span>
              </div>

              {/* Right: Close button */}
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playTap();
                  setSelectedCourse(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-200/80 dark:bg-white/10 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 dark:hover:text-white text-slate-700 dark:text-slate-200 transition-all flex items-center justify-center cursor-pointer active:scale-95 shrink-0 border border-slate-300/60 dark:border-white/15"
                title="Đóng thẻ (Esc)"
              >
                <WebIcon name="cancel" className="w-4 h-4" />
              </button>
            </div>

            {/* Body of detail view - Responsive Multi-Color Bento Grid */}
            <div className="w-full relative z-10 flex-1 min-h-0 overflow-y-auto glass-scrollbar">
              <div
                id="education-detail-bento-grid"
                className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-[15px] items-stretch content-start w-full"
                style={{ gap: '15px' }}
              >
                {/* 1. THẺ THÔNG TIN KHÓA HỌC (Chỉ chứa 4 Sub-card thông tin: Tên, Năm & Mã, Đơn vị đào tạo, Hình thức đào tạo) */}
                <div
                  id="education-school-card"
                  data-element-type="card"
                  data-section-card="true"
                  className={`bento-card glass-card bento-view-card col-span-1 md:col-span-8 lg:col-span-12 h-auto p-[10px] rounded-[14px] border shadow-sm flex flex-col justify-between gap-3.5 transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-br from-blue-950/70 via-slate-900/90 to-indigo-950/60 border-blue-500/40 text-blue-100 shadow-[0_8px_24px_rgba(30,58,138,0.25)]'
                      : 'bg-gradient-to-br from-blue-50/90 via-sky-50/75 to-indigo-50/80 border-blue-200/90 text-blue-950 shadow-[0_6px_20px_rgba(59,130,246,0.08)]'
                  }`}
                  style={{ borderRadius: '14px', padding: '10px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-blue-200/70 dark:border-blue-500/30">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                      <WebIcon name="info" className="w-5 h-5 shrink-0 text-blue-600 dark:text-sky-400" />
                      <h3 className="card-title text-[16px] font-bold font-play text-blue-600 dark:text-sky-400 m-0 p-0">
                        Thông tin khóa học
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600/15 dark:bg-blue-400/20 text-blue-700 dark:text-sky-300 text-[11px] font-bold border border-blue-300/70 dark:border-blue-400/30">
                      Hồ sơ đào tạo
                    </span>
                  </div>

                  {/* 4 Metadata Sub-cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm my-auto">
                    {/* Sub-card 1: Tên khóa học */}
                    <div className="h-full flex flex-col justify-between gap-1.5 p-3 rounded-[14px] bg-white/85 dark:bg-slate-900/75 border border-blue-200/80 dark:border-blue-500/30 shadow-2xs transition-all hover:border-blue-400">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-sky-400">
                        <WebIcon name="graduation" className="w-4 h-4 shrink-0 text-blue-600 dark:text-sky-400" />
                        <span className="text-[12px] font-bold tracking-normal text-blue-600 dark:text-sky-400">Tên khóa học</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-[14px] sm:text-[15px] leading-snug break-words">
                        {course.title}
                      </span>
                    </div>

                    {/* Sub-card 2: Năm học và mã */}
                    <div className="h-full flex flex-col justify-between gap-1.5 p-3 rounded-[14px] bg-sky-50/90 dark:bg-sky-950/45 border border-sky-200/80 dark:border-sky-500/30 shadow-2xs transition-all hover:border-sky-400">
                      <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                        <WebIcon name="clock" className="w-4 h-4 shrink-0 text-sky-600 dark:text-sky-400" />
                        <span className="text-[12px] font-bold tracking-normal text-sky-600 dark:text-sky-400">Năm học và mã</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sky-700 dark:text-sky-300 text-[15px]">
                          Năm {course.year}
                        </span>
                        {course.code && (
                          <span className="px-2 py-0.5 rounded-[14px] bg-sky-200/80 dark:bg-sky-900/70 text-sky-900 dark:text-sky-200 text-[11px] font-mono font-bold">
                            {course.code}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sub-card 3: Đơn vị đào tạo */}
                    <div className="h-full flex flex-col justify-between gap-1.5 p-3 rounded-[14px] bg-indigo-50/90 dark:bg-indigo-950/45 border border-indigo-200/80 dark:border-indigo-500/30 shadow-2xs transition-all hover:border-indigo-400">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                        <WebIcon name="building" className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-[12px] font-bold tracking-normal text-indigo-600 dark:text-indigo-400">Đơn vị đào tạo</span>
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-[13px] sm:text-[14px] leading-snug break-words">
                        {course.issuer}
                      </span>
                    </div>

                    {/* Sub-card 4: Hình thức đào tạo */}
                    <div className="h-full flex flex-col justify-between gap-1.5 p-3 rounded-[14px] bg-teal-50/90 dark:bg-teal-950/45 border border-teal-200/80 dark:border-teal-500/30 shadow-2xs transition-all hover:border-teal-400">
                      <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                        <WebIcon name="sparkles" className="w-4 h-4 shrink-0 text-teal-600 dark:text-teal-400" />
                        <span className="text-[12px] font-bold tracking-normal text-teal-600 dark:text-teal-400">Hình thức đào tạo</span>
                      </div>
                      <span className="font-bold text-teal-700 dark:text-teal-300 text-[13px] sm:text-[14px] leading-snug break-words">
                        {course.type || 'Chuyên sâu thực chiến'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. THẺ HÌNH ẢNH KHÓA HỌC ĐỘC LẬP (Đã tách khỏi thẻ Thông tin khóa học) */}
                <div
                  id="education-photo-card"
                  data-element-type="card"
                  data-section-card="true"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenLightbox(course.courseImg || course.image, `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${t(course.title)}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenLightbox(course.courseImg || course.image, `${isEn ? 'Course photo' : 'Hình ảnh khóa học'}: ${t(course.title)}`);
                    }
                  }}
                  className={`bento-card glass-card bento-view-card col-span-1 md:col-span-4 lg:col-span-6 h-full p-[10px] rounded-[14px] border shadow-sm flex flex-col justify-between gap-3 transition-all duration-300 cursor-pointer group/photo ${
                    isDark
                      ? 'bg-gradient-to-br from-purple-950/70 via-slate-900/90 to-fuchsia-950/60 border-purple-500/40 text-purple-100 hover:border-purple-400'
                      : 'bg-gradient-to-br from-purple-50/90 via-fuchsia-50/70 to-indigo-50/80 border-purple-200/90 text-purple-950 hover:border-purple-400'
                  }`}
                  style={{ borderRadius: '14px', padding: '10px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-purple-200/70 dark:border-purple-500/30">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                      <WebIcon name="image" className="w-5 h-5 shrink-0 text-purple-600 dark:text-purple-400" />
                      <h3 className="card-title text-[16px] font-bold font-play text-purple-600 dark:text-purple-400 m-0 p-0">
                        Hình ảnh khóa học
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 group-hover/photo:underline">
                      Phóng to 🔍
                    </span>
                  </div>
                  <div className="relative aspect-[16/9] w-full rounded-[12px] overflow-hidden bg-slate-950 border border-purple-200/40 my-auto">
                    <img
                      src={course.courseImg || course.image}
                      alt={course.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/photo:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* 3. THẺ VĂN BẰNG CHỨNG NHẬN ĐỘC LẬP (Đã tách khỏi thẻ Thông tin khóa học) */}
                <div
                  id="education-diploma-card"
                  data-element-type="card"
                  data-section-card="true"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleOpenLightbox(course.certImg || course.image, `${isEn ? 'Credential' : 'Bằng cấp'}: ${t(course.title)}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenLightbox(course.certImg || course.image, `${isEn ? 'Credential' : 'Bằng cấp'}: ${t(course.title)}`);
                    }
                  }}
                  className={`bento-card glass-card bento-view-card col-span-1 md:col-span-4 lg:col-span-6 h-full p-[10px] rounded-[14px] border shadow-sm flex flex-col justify-between gap-3 transition-all duration-300 cursor-pointer group/cert ${
                    isDark
                      ? 'bg-gradient-to-br from-rose-950/70 via-slate-900/90 to-pink-950/60 border-rose-500/40 text-rose-100 hover:border-rose-400'
                      : 'bg-gradient-to-br from-rose-50/90 via-pink-50/70 to-orange-50/70 border-rose-200/90 text-rose-950 hover:border-rose-400'
                  }`}
                  style={{ borderRadius: '14px', padding: '10px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-200/70 dark:border-rose-500/30">
                    <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                      <WebIcon name="shield" className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
                      <h3 className="card-title text-[16px] font-bold font-play text-rose-600 dark:text-rose-400 m-0 p-0">
                        Văn bằng chứng nhận
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 group-hover/cert:underline">
                      Xem bằng 🔍
                    </span>
                  </div>
                  <div className="relative aspect-[16/9] w-full rounded-[12px] overflow-hidden bg-slate-950 border border-rose-200/40 my-auto">
                    <img
                      src={course.certImg || course.image}
                      alt="Chứng nhận bằng cấp"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/cert:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* 4. THẺ KẾT QUẢ ĐẠT ĐƯỢC (Nền Xanh Ngọc Emerald - Thành tựu, Ứng dụng thực tế & Kỹ năng bồi dưỡng) */}
                <div
                  id="education-major-card"
                  data-element-type="card"
                  data-section-card="true"
                  className={`bento-card glass-card bento-view-card col-span-1 md:col-span-4 lg:col-span-5 h-full p-[10px] rounded-[14px] border shadow-sm flex flex-col justify-between gap-3.5 transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900/90 to-teal-950/60 border-emerald-500/40 text-emerald-100 shadow-[0_8px_24px_rgba(6,78,59,0.25)]'
                      : 'bg-gradient-to-br from-emerald-50/90 via-teal-50/75 to-green-50/80 border-emerald-200/90 text-emerald-950 shadow-[0_6px_20px_rgba(16,185,129,0.08)]'
                  }`}
                  style={{ borderRadius: '14px', padding: '10px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-emerald-200/70 dark:border-emerald-500/30">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <WebIcon name="award" className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="card-title text-[16px] font-bold font-play text-emerald-600 dark:text-emerald-400 m-0 p-0">
                        Kết quả đạt được
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-600/15 dark:bg-emerald-400/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300/70 dark:border-emerald-400/30">
                      Thành tựu đầu ra
                    </span>
                  </div>

                  {/* Sub-cards */}
                  <div className="space-y-2.5 my-auto">
                    <div className="h-fit p-3 rounded-[14px] bg-white/85 dark:bg-slate-900/75 border border-emerald-200/80 dark:border-emerald-500/30 shadow-2xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <WebIcon name="check-circle-02" className="w-4 h-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
                        <span className="text-[12px] font-bold tracking-normal text-emerald-700 dark:text-emerald-400">Chứng nhận đánh giá</span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-100 leading-snug break-words">
                        {course.result || 'Đã hoàn thành xuất sắc toàn diện khóa học'}
                      </p>
                    </div>

                    {course.application && (
                      <div className="h-fit p-3 rounded-[14px] bg-teal-50/90 dark:bg-teal-950/45 border border-teal-200/80 dark:border-teal-500/30 shadow-2xs space-y-1">
                        <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400">
                          <WebIcon name="target" className="w-4 h-4 shrink-0 text-teal-700 dark:text-teal-400" />
                          <span className="text-[12px] font-bold tracking-normal text-teal-700 dark:text-teal-400">Ứng dụng thực tiễn</span>
                        </div>
                        <p className="text-[12px] sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                          {course.application}
                        </p>
                      </div>
                    )}

                    {course.skills && course.skills.length > 0 && (
                      <div className="h-fit pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {course.skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[14px] text-[12px] font-bold border bg-white/90 dark:bg-slate-800/90 border-emerald-300/80 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 shadow-2xs"
                            >
                              <WebIcon name={getSkillTagIcon(skill)} className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>{skill}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. THẺ DANH SÁCH CHUYÊN ĐỀ (Hiển thị dạng danh sách dọc List View chuẩn mực) */}
                <div
                  id="education-certificates-card"
                  data-element-type="card"
                  data-section-card="true"
                  className={`bento-card glass-card bento-view-card col-span-1 md:col-span-4 lg:col-span-7 h-full p-[10px] rounded-[14px] border shadow-sm flex flex-col justify-between gap-3.5 transition-all duration-300 ${
                    isDark
                      ? 'bg-gradient-to-br from-amber-950/60 via-slate-900/90 to-orange-950/50 border-amber-500/40 text-amber-100 shadow-[0_8px_24px_rgba(180,83,9,0.2)]'
                      : 'bg-gradient-to-br from-amber-50/90 via-orange-50/75 to-yellow-50/70 border-amber-200/90 text-amber-950 shadow-[0_6px_20px_rgba(245,158,11,0.08)]'
                  }`}
                  style={{ borderRadius: '14px', padding: '10px' }}
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-200/70 dark:border-amber-500/30 flex-wrap">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <WebIcon name="book" className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                      <h3 className="card-title text-[16px] font-bold font-play text-amber-600 dark:text-amber-400 m-0 p-0">
                        Danh sách chuyên đề
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full bg-amber-600 text-white text-[12px] font-bold shadow-xs">
                        {course.modules.length} {isEn ? 'Modules' : 'Chuyên đề'}
                      </span>
                    </div>
                  </div>

                  {(course.focus || course.orientation) && (
                    <div className="h-fit p-3 rounded-[14px] bg-white/75 dark:bg-slate-900/65 border border-amber-200/80 dark:border-amber-500/25 text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      <span className="font-bold text-amber-800 dark:text-amber-300 mr-1.5">Trọng tâm:</span>
                      {course.focus || course.orientation}
                    </div>
                  )}

                  <ul className="flex flex-col gap-2 my-auto list-none p-0 m-0">
                    {course.modules.map((mod, idx) => (
                      <li
                        key={idx}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[14px] bg-white/90 dark:bg-slate-800/85 border border-amber-200/80 dark:border-amber-500/25 shadow-2xs transition-all hover:border-amber-400 hover:shadow-xs group/mod"
                      >
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-[11px] font-mono font-black shrink-0 group-hover/mod:bg-amber-500 group-hover/mod:text-white transition-colors">
                          {idx + 1}
                        </span>
                        <span className="text-[13px] sm:text-[14px] leading-snug font-semibold text-slate-800 dark:text-slate-100 break-words flex-1 min-w-0">
                          {mod}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </motion.div>
        );
      })()}

      {/* 7. LIGHTBOX PHÓNG TO ẢNH BẰNG CẤP FULL MÀN HÌNH */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl animate-in zoom-in-95 duration-200 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[92vh] flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 hover:bg-rose-600 text-white transition cursor-pointer"
              title="Đóng Lightbox"
            >
              <WebIcon name="cancel" className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt={lightboxTitle}
              className="max-w-full max-h-[82vh] object-contain rounded-[14px] shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/20 select-none pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="mt-3 text-sm font-play font-bold text-white/90 drop-shadow-md text-center">
              {lightboxTitle}
            </p>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default EducationView;