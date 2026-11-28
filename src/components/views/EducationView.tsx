 'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn, formatCardTitle } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';
import { VideoBanner } from '@/components/common/VideoBanner';
import { getDefaultBannerVideoConfig } from '@/data/driveBannerDefaults';
import { EducationBookView } from './education/EducationBookView';
import { EducationBookshelfView } from './education/EducationBookshelfView';
import { BlurUpImage } from '@/components/ui/BlurUpImage';

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

// Bảng màu sắc 14 khóa học đa dạng độc bản cho từng thẻ học vấn
const DISTINCT_COURSE_PALETTE = [
  '#2563EB', // 1. Sapphire Blue
  '#06B6D4', // 2. Glacial Aqua Cyan
  '#E11D48', // 3. Scarlet Crimson
  '#10B981', // 4. Pure Emerald Green
  '#8B5CF6', // 5. Royal Violet Amethyst
  '#F59E0B', // 6. Golden Amber
  '#EC4899', // 7. Fuchsia Rose
  '#6366F1', // 8. Midnight Indigo
  '#14B8A6', // 9. Oceanic Deep Teal
  '#84CC16', // 10. Forest Lime
  '#1E3A8A', // 11. Midnight Navy
  '#F97316', // 12. Tangerine Orange
  '#D946EF', // 13. Electric Orchid
  '#475569', // 14. Slate Charcoal
];

function getCourseColor(course: EducationCourse, idx: number): string {
  if (course.accentColor) return course.accentColor;
  return DISTINCT_COURSE_PALETTE[idx % DISTINCT_COURSE_PALETTE.length];
}
import {
  EDUCATION_COURSES,
  EducationCourse,
  CREDENTIAL_VERIFICATION_MAP,
} from '@/data/education';
import { SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';

export interface EducationViewProps {
  currentTheme?: SiteTheme;
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
  const { isDark: themeIsDark, cardStyle } = useTheme();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isDark =
    themeIsDark ||
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'walnut-wood' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  // Bộ lọc năm tốt nghiệp Timeline (2005 - 2026)
  const [maxYearFilter, setMaxYearFilter] = useState<number>(2026);
  const [exactYearFilter, setExactYearFilter] = useState<number | null>(null);

  const [selectedCourse, setSelectedCourse] = useState<EducationCourse | null>(null);
  const [autoFlipBookOnOpen, setAutoFlipBookOnOpen] = useState<boolean>(false);
  const [activeBookIdx, setActiveBookIdx] = useState<number>(0);
  const [verifyingCourse, setVerifyingCourse] = useState<EducationCourse | null>(null);
  const [copiedCredentialId, setCopiedCredentialId] = useState<string | null>(null);

  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string>('');
  const [lightboxTitle, setLightboxTitle] = useState<string>('');
  const educationBannerVideo = getDefaultBannerVideoConfig('education');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.key !== 'Escape') return;
      if (isLightboxOpen) {
        setIsLightboxOpen(false);
      } else if (verifyingCourse) {
        setVerifyingCourse(null);
      } else if (selectedCourse) {
        SoundEngine.playBookClose();
        setAutoFlipBookOnOpen(false);
        setSelectedCourse(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, verifyingCourse, selectedCourse]);

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

  const safeActiveBookIdx = Math.min(
    Math.max(0, activeBookIdx),
    Math.max(0, filteredCourses.length - 1)
  );

  useEffect(() => {
    if (activeBookIdx >= filteredCourses.length && filteredCourses.length > 0) {
      setActiveBookIdx(0);
    }
  }, [activeBookIdx, filteredCourses.length]);

  const handleOpenDetail = (
    course: EducationCourse,
    options?: { skipSound?: boolean; autoFlip?: boolean }
  ) => {
    if (!options?.skipSound) {
      SoundEngine.playBookOpen();
    }
    setAutoFlipBookOnOpen(Boolean(options?.autoFlip));
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

  const handleResetFilters = () => {
    SoundEngine.playTap();
    setActiveCategory('all');
    setMaxYearFilter(2026);
    setExactYearFilter(null);
  };

  const isBookshelfMode = !selectedCourse && filteredCourses.length > 0;

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
        data-floating-surface="main"
        data-detail-open={selectedCourse ? 'true' : 'false'}
        data-bookshelf-mode={isBookshelfMode ? 'true' : 'false'}
        data-element-name="Card học vấn"
        data-element-type="card"
        data-element-page="education"
        data-element-parent="education-cards-track"
        className={cn(
          'page-main-card floating-glass-surface floating-surface--main relative flex flex-col justify-start gap-0 rounded-[var(--radius-main,14px)] overflow-hidden font-play text-left box-border',
          isBookshelfMode ? 'pt-[10px] px-[12px] pb-[15px]' : 'p-[15px]'
        )}
      >
      <div
        id="education-main-scroll-viewport"
        className="main-card-scroll-viewport w-full max-w-full min-w-0 h-full flex-1 min-h-0 flex flex-col items-stretch justify-start gap-[15px] overflow-hidden no-scrollbar box-border"
      >
      <div
        id="education-main-wrapper"
        className={cn(
          'w-full max-w-full min-w-0 h-full max-h-full flex-1 min-h-0 flex flex-col gap-[15px] justify-start overflow-hidden box-border',
          selectedCourse && 'gap-0'
        )}
      >
      {selectedCourse ? (() => {
        const course = selectedCourse;
        const courseIdx = EDUCATION_COURSES.findIndex((c) => c.id === course.id);
        const courseColor = getCourseColor(course, courseIdx >= 0 ? courseIdx : 0);
        return (
          <EducationBookView
            course={course}
            courseColor={courseColor}
            categoryLabel={getShortCategoryLabel(course.category)}
            getCourseIcon={getEducationIconByTitle}
            isEn={isEn}
            isDark={isDark}
            getSkillTagIcon={getSkillTagIcon}
            autoFlipOnMount={autoFlipBookOnOpen}
            onClose={() => {
              setAutoFlipBookOnOpen(false);
              setSelectedCourse(null);
            }}
            onNavigateSkillToSwot={handleNavigateSkillToSwot}
            onOpenVerifyModal={handleOpenVerifyModal}
            onOpenLightbox={handleOpenLightbox}
            disableKeyboardNav={isLightboxOpen || Boolean(verifyingCourse)}
          />
        );
      })() : (() => {
        const shelfVideoFrame = (
          <figure
            id="education-wall-video-frame"
            className="edu-wall-video-frame edu-shelf-standing-frame m-0"
            aria-label={isEn ? 'Bookshelf study video frame' : 'Khung hình video đặt trên kệ sách trang Học vấn'}
          >
            <div className="edu-shelf-frame-3d">
              <span className="edu-shelf-frame-easel" aria-hidden="true" />
              <div className="edu-wall-frame-assembly">
                <div className="edu-wall-frame-outer">
                  <div className="edu-wall-frame-mat">
                    <div className="edu-wall-frame-canvas">
                      <VideoBanner
                        videoId={educationBannerVideo.videoId}
                        title={educationBannerVideo.title}
                        className="w-full h-full"
                      />
                      <div className="edu-wall-frame-glass" aria-hidden="true" />
                    </div>
                  </div>
                  <figcaption className="edu-wall-frame-plaque">
                    {isEn ? 'Academy Gallery' : 'Góc Tri Thức'}
                  </figcaption>
                </div>
              </div>
              <span className="edu-shelf-frame-stand" aria-hidden="true" />
            </div>
            <span className="edu-shelf-frame-shadow" aria-hidden="true" />
          </figure>
        );

        return filteredCourses.length === 0 ? (
          <div className="flex flex-col gap-[15px] w-full flex-1 min-h-0 items-center justify-center">
            <div className="theme-muted-surface w-full max-w-md p-6 sm:p-8 rounded-[14px] text-center space-y-2 backdrop-blur-md">
              <p className="typo-body font-semibold font-play" style={{ color: 'var(--text-primary)' }}>
                Không tìm thấy chứng chỉ nào khớp với bộ lọc hiện tại.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                style={{ background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }}
                className="px-4 py-1.5 rounded-full typo-button hover:opacity-90 transition cursor-pointer"
              >
                Hiển thị tất cả 14 chứng chỉ
              </button>
            </div>
          </div>
        ) : (
          <EducationBookshelfView
            courses={filteredCourses}
            getCourseColor={getCourseColor}
            getShortCategoryLabel={getShortCategoryLabel}
            getCourseIcon={getEducationIconByTitle}
            isEn={isEn}
            isDark={isDark}
            cardStyle={cardStyle}
            onSelectCourse={(course) => handleOpenDetail(course, { skipSound: true, autoFlip: true })}
            selectedBookIndex={safeActiveBookIdx}
            onSelectBookIndex={setActiveBookIdx}
            hideTopTimeline={true}
            shelfWallFrame={shelfVideoFrame}
          />
        );
      })()}
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

              <div className="theme-modal-subcard p-[15px] rounded-[14px] flex flex-col gap-[15px] typo-body-sm">
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
            <BlurUpImage
              src={lightboxImage}
              alt={lightboxTitle}
              priority="eager"
              variant="contain"
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