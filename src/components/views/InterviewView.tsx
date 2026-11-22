'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INTERVIEW_QUESTIONS,
  INTERVIEW_TABS,
  INTERVIEW_VIDEO_1_URL,
  INTERVIEW_VIDEO_2_URL,
} from '@/data/interview';
import { useToast } from '@/components/ui/Toast';
import { WebIcon } from '@/components/ui/WebIcon';
import { cn } from '@/lib/utils';
import { SmartFaceVideo } from '@/components/ui/SmartFaceVideo';
import { BannerBackgroundVideo } from '@/components/common/BannerBackgroundVideo';

export interface InterviewViewProps {
  currentTheme?: string;
  onShowNotification?: (msg: string) => void;
}

export const InterviewView: React.FC<InterviewViewProps> = ({ currentTheme = 'liquid-glass' }) => {
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const pendingSeekSecRef = useRef<number | null>(null);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);
  const [progressPct, setProgressPct] = useState<number>(0);

  const currentQ = INTERVIEW_QUESTIONS[currentQIdx] || INTERVIEW_QUESTIONS[0];

  useEffect(() => {
    if (!isVideoPlaying) return;
    const video = videoRef.current;
    if (!video) return;

    const targetSec = pendingSeekSecRef.current ?? currentQ.startSec;
    pendingSeekSecRef.current = null;

    const applySeekAndPlay = () => {
      try {
        video.currentTime = targetSec;
      } catch {
        // Ignore seek error before metadata loads
      }
      video.muted = !isAudioOn;
      video.play().catch(() => {});
    };

    if (video.readyState >= 1) {
      applySeekAndPlay();
    } else {
      const handleLoaded = () => {
        applySeekAndPlay();
      };
      video.addEventListener('loadedmetadata', handleLoaded, { once: true });
      return () => video.removeEventListener('loadedmetadata', handleLoaded);
    }
  }, [isVideoPlaying]);

  const filteredQuestions = INTERVIEW_QUESTIONS.filter((q) => {
    if (activeFilter === 'all') return true;
    return q.categoryKey === activeFilter;
  });

  const selectQuestion = (idx: number) => {
    const clamped = Math.max(0, Math.min(INTERVIEW_QUESTIONS.length - 1, idx));
    setCurrentQIdx(clamped);
    setProgressPct(0);
    const q = INTERVIEW_QUESTIONS[clamped];

    const video = videoRef.current;
    if (!isVideoPlaying || !video) {
      pendingSeekSecRef.current = q.startSec;
      setIsVideoPlaying(true);
    } else {
      video.muted = !isAudioOn;
      try {
        video.currentTime = q.startSec;
      } catch {
        // Seek after metadata
      }
      if (video.paused) {
        video.play().catch(() => {});
      }
    }
    showToast(`Đã chọn Câu ${String(q.stt).padStart(2, '0')}: ${q.categoryVi}`);
  };

  const togglePlay = () => {
    if (isVideoPlaying) {
      const video = videoRef.current;
      if (video) {
        video.pause();
      }
      pendingSeekSecRef.current = null;
      setIsVideoPlaying(false);
    } else {
      pendingSeekSecRef.current = currentQ.startSec;
      setIsVideoPlaying(true);
    }
  };

  const toggleAudio = () => {
    const nextAudio = !isAudioOn;
    setIsAudioOn(nextAudio);
    const video = videoRef.current;
    if (video) {
      video.muted = !nextAudio;
    }
    showToast(nextAudio ? 'Đã bật tiếng video phỏng vấn' : 'Đã tắt tiếng video phỏng vấn');
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const time = video.currentTime;

    if (isVideoPlaying) {
      const matchedIdx = INTERVIEW_QUESTIONS.findIndex(
        (item) => time >= item.startSec && time < item.endSec
      );
      if (matchedIdx !== -1 && matchedIdx !== currentQIdx) {
        setCurrentQIdx(matchedIdx);
      }
    }

    const qDuration = Math.max(1, currentQ.endSec - currentQ.startSec);
    const elapsed = Math.max(0, Math.min(qDuration, time - currentQ.startSec));
    const pct = isVideoPlaying ? (elapsed / qDuration) * 100 : 0;
    setProgressPct(pct);
  };

  const handleEnded = () => {
    if (isVideoPlaying) {
      togglePlay();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFilterDropdownOpen) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFilterDropdownOpen]);

  void currentTheme;

  return (
    <div
      id="interview-page-container"
      data-element-name="Trang Phỏng Vấn"
      data-element-type="container"
      data-element-page="interview"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar select-none text-[var(--text-primary)] font-play text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="interview-cards-track"
        data-element-name="Track căn giữa Phỏng Vấn"
        data-element-type="container"
        data-element-page="interview"
        data-element-parent="interview-page-container"
        className="page-cards-track"
      >
        <div
          id="interview-main-card"
          data-main-card="true"
          data-layer-level="1"
          data-element-name="Thẻ chính Trang Phỏng Vấn"
          data-element-type="card"
          data-element-page="interview"
          data-element-parent="interview-cards-track"
          className="page-main-card flex flex-col p-[15px] rounded-[var(--radius-main,28px)] gap-[15px] justify-start select-none text-[var(--text-primary)] overflow-hidden glass-scrollbar font-play text-left box-border"
        >
      {/* Main Content Row: Video + Answer Detail always on 1 row & equal height at all sizes */}
      <div
        id="interview-main-content"
        className="w-full max-w-full min-w-0 flex-1 h-full grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] grid-rows-[minmax(0,1fr)] items-stretch gap-[15px] min-h-0 overflow-hidden rounded-[var(--radius-card,24px)]"
      >
        
        {/* 1. VIDEO BANNER SECTION (Equal height & same single row with Chi tiết trả lời at all sizes) */}
        <section
          id="interview-questions-card"
          data-element-name="Card Video Phỏng Vấn"
          data-element-type="banner-card"
          data-section-card="true"
          data-layer-level="2"
          className="banner-card hero-banner w-full h-full min-h-0 max-h-full self-stretch rounded-[var(--radius-card,24px)] relative overflow-visible bento-card glass-card text-[var(--text-primary)] min-w-0 z-30 flex flex-col justify-between border group p-[15px]"
        >
          {/* Nền Hình chờ / Video phỏng vấn trực tiếp lấp đầy banner-card & đồng bộ bo cong theo giao diện */}
          <div className="project-detail-banner-media absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit] w-full h-full z-0">
            {isVideoPlaying ? (
              <SmartFaceVideo
                videoRef={videoRef}
                autoPlay
                loop={true}
                alwaysCover={true}
                muted={!isAudioOn}
                playsInline
                preload="auto"
                controls={false}
                disablePictureInPicture
                controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
                aria-hidden="true"
                tabIndex={-1}
                poster={INTERVIEW_VIDEO_1_URL}
                src={INTERVIEW_VIDEO_2_URL}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                faceAnchor={{ x: 50, y: 18 }}
                maxCropDistortion={1.6}
                wrapperClassName="w-full h-full rounded-[inherit] pointer-events-none"
                className="opacity-100 banner-video-sharp transition-all duration-500 select-none pointer-events-none"
              />
            ) : (
              <BannerBackgroundVideo
                src={INTERVIEW_VIDEO_2_URL}
                poster={INTERVIEW_VIDEO_1_URL}
                alt="Phỏng vấn & Đối thoại"
                objectPosition="50% 18%"
              />
            )}
          </div>
          <div className="project-detail-banner-scrim absolute inset-0 pointer-events-none rounded-[inherit] z-0" />

          {/* Hàng trên: Icon + Tiêu đề bên trái, Câu nói chữ ký bên phải */}
          <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full">
            <div className="card-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--text-link, var(--color-primary))' }}>
              <WebIcon name="mic" className="w-[22px] h-[22px] shrink-0" />
              <h1
                id="interview-hero-banner-title"
                className="typo-h3 card-title-synced font-play not-italic tracking-tight truncate"
                data-card-title="true"
                style={{
                  textTransform: 'none',
                  fontStyle: 'normal',
                  transform: 'none',
                }}
              >
                Phỏng vấn &amp; Đối thoại
              </h1>
            </div>
            <p
              className="banner-quote typo-h3 font-handwriting font-quote not-italic font-bold select-none text-left sm:text-right sm:ml-auto whitespace-normal break-words overflow-visible max-w-full sm:max-w-[65%]"
              style={{ color: 'var(--text-secondary)', fontFamily: "var(--font-quote, 'Dancing Script', cursive)", fontWeight: 700, fontStyle: 'normal' }}
            >
              &quot;Giao lưu cởi mở để thấu hiểu và sẻ chia ♡&quot;
            </p>
          </div>

          {/* Hàng dưới: Bộ lọc câu hỏi bên trái & Nút Phát Video bên dưới bên phải banner */}
          <div id="interview-video-banner-controls" className="relative z-30 flex flex-wrap items-center justify-between gap-2 mt-auto w-full min-w-0">
            {/* Nhóm các câu hỏi ở banner vào 1 nút filter với menu xổ xuống */}
            <div className="relative inline-block text-left max-w-full" ref={filterDropdownRef}>
              <button
                id="interview-question-filter-btn"
                type="button"
                onClick={() => {
                  setIsFilterDropdownOpen((prev) => !prev);
                }}
                className="banner-control-pill h-9 inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-0 rounded-full transition-all cursor-pointer typo-button font-bold font-play active:scale-95 group max-w-full shrink-0"
                title="Bộ lọc câu hỏi"
                aria-label="Bộ lọc câu hỏi phỏng vấn"
                aria-expanded={isFilterDropdownOpen}
                aria-haspopup="listbox"
              >
                <WebIcon
                  name="sliders"
                  className="w-4 h-4 text-[var(--color-primary)] shrink-0"
                />
                <span className="truncate">Bộ lọc câu hỏi</span>
                {activeFilter !== 'all' && (
                  <span className="banner-count-pill hidden sm:inline-flex px-2 py-0.2 rounded-full border typo-badge font-mono font-bold shrink-0">
                    {INTERVIEW_TABS.find((t) => t.key === activeFilter)?.labelVi}
                  </span>
                )}
                <WebIcon
                  name="chevron-down"
                  className={cn(
                    'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
                    isFilterDropdownOpen ? 'rotate-180' : ''
                  )}
                />
              </button>

              <AnimatePresence>
                {isFilterDropdownOpen && (
                  <motion.div
                    id="interview-question-filter-listbox"
                    data-element-type="card"
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    role="listbox"
                    className="banner-dropdown-menu bento-card glass-card absolute left-0 bottom-[calc(100%+8px)] w-[min(22rem,calc(100cqi-30px))] max-w-[calc(100vw-48px)] max-h-72 overflow-y-auto no-scrollbar rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                  >
                    <div className="px-2 py-1.5 border-b border-[var(--border-subcard)] flex flex-col gap-1.5 sticky top-0 bg-[var(--bg-popup)] z-10 rounded-t-[10px]">
                      <div className="flex items-center justify-between typo-label font-mono text-[var(--text-muted)]">
                        <span className="font-bold text-[var(--text-heading,var(--color-primary))] font-play typo-body-sm inline-flex items-center gap-1.5">
                          <WebIcon name="sliders" className="w-3.5 h-3.5 shrink-0" />
                          <span>Bộ lọc</span>
                        </span>
                      </div>
                    <div className="flex flex-wrap gap-1">
                      {INTERVIEW_TABS.map((tab) => {
                        const isTabActive = activeFilter === tab.key;
                        return (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveFilter(tab.key)}
                            style={isTabActive ? { background: 'var(--bg-button-primary)' } : undefined}
                            className={cn(
                              'px-2.5 py-0.5 rounded-full typo-tab transition-all cursor-pointer border',
                              isTabActive
                                ? 'text-white border-transparent shadow-2xs'
                                : 'bg-[var(--bg-subcard)] text-[var(--text-secondary)] border-[var(--border-subcard)] hover:bg-[var(--bg-subcard-hover)]'
                            )}
                          >
                            {tab.labelVi}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {filteredQuestions.map((q) => {
                    const origIdx = INTERVIEW_QUESTIONS.findIndex((item) => item.stt === q.stt);
                    const isSelected = origIdx === currentQIdx;
                    return (
                      <button
                        key={q.stt}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        data-selected={isSelected ? 'true' : 'false'}
                        onClick={() => {
                          selectQuestion(origIdx !== -1 ? origIdx : 0);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={cn(
                          'theme-dropdown-option w-full text-left px-3 py-2 rounded-[14px] transition-all cursor-pointer flex items-center justify-between gap-2 typo-nav font-play',
                          isSelected ? 'shadow-xs' : ''
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center typo-badge font-mono shrink-0',
                              isSelected
                                ? 'bg-white/25 text-white'
                                : 'bg-[var(--bg-nested-badge)] text-[var(--text-link,var(--color-primary))]'
                            )}
                          >
                            {String(q.stt).padStart(2, '0')}
                          </span>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-semibold">{q.categoryVi}</span>
                            <span className={cn('typo-label truncate', isSelected ? 'text-white/85' : 'text-[var(--text-muted)]')}>
                              {q.questionVi.replace(/^Câu hỏi\s*\d+:\s*/i, '')}
                            </span>
                          </div>
                        </div>
                        {isSelected && <WebIcon name="check" className="w-3.5 h-3.5 text-white shrink-0" />}
                      </button>
                    );
                  })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cụm phải: Nút Phát Video bên dưới bên phải banner */}
            <div className="flex items-center justify-end gap-3 pointer-events-auto ml-auto shrink-0">
              <div
                id="interview-play-video-capsule"
                onClick={() => togglePlay()}
                style={{ borderRadius: '999px' }}
                className={`theme-video-capsule video-play-btn video-play-btn--interview ${isVideoPlaying ? 'is-playing' : ''} inline-flex items-center gap-2.5 px-3 py-1.5 !rounded-[999px] rounded-[999px] transition-all duration-300 cursor-pointer pointer-events-auto active:scale-98 select-none`}
              >
                {/* Speaker Toggle Button */}
                <button
                  type="button"
                  id="interview-btn-sound-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio();
                  }}
                  className={`video-play-btn__sound w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 ${
                    isAudioOn
                      ? 'text-current shadow-xs'
                      : 'is-muted text-white shadow-md'
                  }`}
                  title={isAudioOn ? 'Tắt tiếng video phỏng vấn' : 'Bật âm thanh video phỏng vấn'}
                  aria-label={isAudioOn ? 'Tắt tiếng video phỏng vấn' : 'Bật âm thanh video phỏng vấn'}
                >
                  <span className="flex items-center justify-center">
                    {isAudioOn ? (
                      <WebIcon name="volume-2" className="w-3.5 h-3.5 text-current" />
                    ) : (
                      <WebIcon name="volume-x" className="w-3.5 h-3.5 text-white" />
                    )}
                  </span>
                </button>

                {/* Vertical Divider */}
                <div className="w-[1px] h-4 bg-current opacity-25 shrink-0 mx-0.5" />

                {/* Play / Cancel Button */}
                {!isVideoPlaying ? (
                  <button
                    type="button"
                    id="interview-btn-play-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    style={{ borderRadius: '999px' }}
                    className="inline-flex items-center justify-center gap-2 pr-1.5 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                    title="Bấm để phát video phỏng vấn"
                  >
                    <span className="flex items-center justify-center">
                      <WebIcon
                        name="play"
                        className="w-4 h-4 fill-current text-current shrink-0"
                        style={{ height: '16px', width: '16px' }}
                      />
                    </span>
                    <span
                      className="typo-button text-current truncate font-play text-left"
                      style={{ textAlign: 'left' }}
                    >
                      Phát Video
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="interview-btn-play-toggle"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    style={{ borderRadius: '999px' }}
                    className="inline-flex items-center justify-center gap-2 pr-1.5 py-1 !rounded-[999px] rounded-[999px] bg-transparent text-current typo-button tracking-wide transition-all duration-200 cursor-pointer active:scale-95 font-play"
                    title="Bấm để hủy phát video"
                  >
                    <span className="flex items-center justify-center">
                      <WebIcon
                        name="cancel"
                        className="w-4 h-4 stroke-[2.8] text-current shrink-0"
                        style={{ height: '16px', width: '16px' }}
                      />
                    </span>
                    <span
                      className="typo-button text-current truncate font-play text-left"
                      style={{ textAlign: 'left' }}
                    >
                      Hủy Phát
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 2. THẺ CHI TIẾT CÂU TRẢ LỜI (Always same 1 row & equal height with Video card) */}
        <div
          id="interview-answers-card"
          data-element-name="Thẻ Chi Tiết Trả Lời Phỏng Vấn"
          data-element-type="card"
          data-section-card="true"
          data-layer-level="2"
          className="w-full h-full min-h-0 max-h-full min-w-0 self-stretch flex flex-col rounded-[var(--radius-card,24px)] bento-card glass-card border p-[15px] transition-all duration-300 text-left justify-start gap-3 relative overflow-hidden"
        >
          {/* Header Tiêu đề thẻ (Pinned) */}
          <div className="space-y-2 shrink-0 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
              <h3 className="card-title card-header-sync card-title-synced typo-h3 flex items-center gap-2 text-pink-600 dark:text-pink-400 min-w-0" data-card-title="true">
                <WebIcon name="message-square" className="w-5 h-5 shrink-0" />
                <span className="truncate">Chi tiết trả lời</span>
              </h3>
              <span className="typo-caption font-semibold text-[var(--text-secondary)] shrink-0 tabular-nums whitespace-nowrap">
                {String(currentQ.stt).padStart(2, '0')}/{String(INTERVIEW_QUESTIONS.length).padStart(2, '0')}
                <span aria-hidden="true" className="mx-1 opacity-60">·</span>
                <span className="text-[var(--text-link,var(--color-primary))]">{currentQ.categoryVi}</span>
              </span>
            </div>

            <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 shadow-2xs" />
          </div>

          {/* Segment Progress Bar (Pinned) */}
          <div
            id="interview-progress-card"
            data-element-type="card"
            data-subcard="true"
            className="exp-detail-subcard flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-[var(--radius-subcard,16px)] border shrink-0 typo-label"
          >
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-mono typo-label shrink-0 tabular-nums">
              <WebIcon name="clock" className="interview-meta-accent w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>{currentQ.timestamp}</span>
            </div>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-full h-1.5 rounded-full bg-[var(--pillar-progress-track)] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="typo-badge font-mono tabular-nums text-[var(--text-muted)] shrink-0">
                {Math.round(currentQ.endSec - currentQ.startSec)}s
              </span>
            </div>
          </div>

          {/* Scrollable Body (Asker + Answer + Insights) */}
          <div
            data-scrollable="true"
            data-no-wheel-horizontal="true"
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden glass-scrollbar flex flex-col gap-3 pr-0.5"
          >
            {/* Asker (Hiển thị Câu hỏi số ở đầu câu hỏi) */}
            <div
              id="interview-asker-card"
              data-element-type="card"
              data-subcard="true"
              className="exp-detail-subcard p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2 shrink-0"
            >
              <div className="interview-asker-heading subcard-header-sync typo-h4 flex items-center gap-2 flex-wrap text-indigo-600 dark:text-indigo-400">
                <WebIcon name="circle-help" className="w-4 h-4 shrink-0" />
                <span className="subcard-title-synced tracking-wide text-indigo-600 dark:text-indigo-400 break-words" data-subcard-title="true">
                  Câu hỏi {String(currentQ.stt).padStart(2, '0')}: {currentQ.askerVi}
                </span>
              </div>
              <h3
                id="interview-question-title"
                className="typo-body font-semibold text-[var(--text-heading)] m-0 leading-relaxed break-words"
              >
                {currentQ.questionVi.replace(/^Câu hỏi\s*\d+:\s*/, '')}
              </h3>
            </div>

            {/* Answerer */}
            <div
              id="interview-answerer-card"
              data-element-type="card"
              data-subcard="true"
              className="exp-detail-subcard p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2 shrink-0"
            >
              <div className="interview-answerer-heading subcard-header-sync typo-h4 flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <WebIcon name="user-round" className="w-4 h-4 shrink-0" />
                <span className="subcard-title-synced tracking-wide text-emerald-700 dark:text-emerald-400" data-subcard-title="true">
                  Trả lời: {currentQ.answererVi}
                </span>
              </div>
              <p className="typo-body text-[var(--text-secondary)] leading-relaxed break-words m-0">
                {currentQ.answerVi}
              </p>
            </div>

            {/* Takeaway */}
            <div
              id="interview-insights-card"
              data-element-type="card"
              data-subcard="true"
              className="exp-detail-subcard p-[15px] rounded-[var(--radius-subcard,16px)] border flex flex-col gap-2 shrink-0"
            >
              <div className="interview-insights-heading subcard-header-sync typo-h4 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <WebIcon name="target" className="w-4 h-4 shrink-0" />
                <span className="subcard-title-synced tracking-wide text-amber-700 dark:text-amber-400" data-subcard-title="true">
                  Trọng tâm
                </span>
              </div>
              <p className="typo-body text-[var(--text-secondary)] leading-relaxed break-words m-0">
                {currentQ.keyTakeawayVi}
              </p>
            </div>
          </div>

          {/* Navigation Footer (Pinned) */}
          <div className="pt-2.5 border-t border-[var(--pillar-divider)] flex items-center justify-between gap-1.5 sm:gap-2 shrink-0 relative z-10 min-w-0">
            <button
              type="button"
              disabled={currentQIdx === 0}
              onClick={() => selectQuestion(currentQIdx - 1)}
              className="theme-prev-next-btn typo-button disabled:opacity-35 disabled:pointer-events-none cursor-pointer inline-flex items-center justify-center gap-1 transition-all min-h-[34px] sm:min-h-[36px] py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-full border active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>‹ Trước</span>
            </button>

            <button
              type="button"
              onClick={() => selectQuestion(currentQIdx)}
              title="Phát lại câu hỏi hiện tại"
              className="typo-button text-[var(--text-link,var(--color-primary))] hover:bg-[var(--bg-subcard)] inline-flex items-center justify-center gap-1 cursor-pointer min-h-[34px] sm:min-h-[36px] py-1 sm:py-1.5 px-2 sm:px-3 rounded-full transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <WebIcon name="refresh" className="w-3.5 h-3.5 shrink-0" />
              <span>Lại</span>
            </button>

            <button
              type="button"
              disabled={currentQIdx === INTERVIEW_QUESTIONS.length - 1}
              onClick={() => selectQuestion(currentQIdx + 1)}
              className="theme-prev-next-btn typo-button disabled:opacity-35 disabled:pointer-events-none cursor-pointer inline-flex items-center justify-center gap-1 transition-all min-h-[34px] sm:min-h-[36px] py-1 sm:py-1.5 px-2 sm:px-3.5 rounded-full border active:scale-95 whitespace-nowrap shrink-0"
            >
              <span>Tiếp ›</span>
            </button>
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};