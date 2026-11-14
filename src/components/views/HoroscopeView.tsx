'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ZODIAC_SIGNS,
  ZODIAC_BY_KEY,
  QUICK_YEARS,
  getCanChiInfo,
  getSignFromYear,
  SLIDE_1_IDENTITY,
  SLIDE_2_PILLARS,
  SLIDE_3_PRINCIPLES,
  SLIDE_3_PROOFS,
  ZodiacSignInfo,
} from '@/data/horoscope';
import { WebIcon } from '@/components/ui/WebIcon';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { stopActiveSpeech } from '@/utils/speechVoice';

// Video nút nổi giới thiệu Card 1 Bản đồ Tử Vi (tương đồng nút phát video trang Hệ Thống; có thể thay bằng link MP4 Tử Vi riêng nếu có)
const HOROSCOPE_FLOATING_IDLE_VIDEO_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793302150/M%C3%A0n_h%C3%ACnh_ch%E1%BB%9D_Ma_thu%C3%A2t_1.mp4';
const HOROSCOPE_FLOATING_INTRO_VIDEO_URL =
  'https://res.cloudinary.com/q5tpzaxk/video/upload/v1793541818/Chinh_sua.mp4';

export interface HoroscopeViewProps {
  currentTheme?: string;
}

export const HOROSCOPE_SLIDES = [
  { idx: 0, label: '01. Chân Dung & Bản Mệnh', shortLabel: 'Bản Mệnh' },
  { idx: 1, label: '02. Mô Hình Vận Hành', shortLabel: 'Vận Hành' },
  { idx: 2, label: '03. Nguyên Tắc & Bằng Chứng', shortLabel: 'Bằng Chứng' },
  { idx: 3, label: '04. Tra Cứu Tuổi Hợp Tác', shortLabel: 'Tra Cứu' },
];

export const HoroscopeView: React.FC<HoroscopeViewProps> = ({ currentTheme = 'light-glass' }) => {
  const { showToast } = useToast();
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;
  const isDark = themeIsDark || currentTheme === 'dark-neon';
  const isLight = !isDark;

  // Active Slide State: 0..3 (4 slides only)
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);



  // Floating Circle Video Intro Player (Card 1 Tử Vi - giống trang Hệ Thống)
  const circleVideoRef = useRef<HTMLVideoElement>(null);
  const introStageVideoRef = useRef<HTMLVideoElement>(null);
  const [isCircleVideoPlaying, setIsCircleVideoPlaying] = useState<boolean>(false);
  const [isIntroStageMuted, setIsIntroStageMuted] = useState<boolean>(false);
  const [isClientMounted, setIsClientMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  useEffect(() => {
    if (!isCircleVideoPlaying) return;
    const video = introStageVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.muted = false;
    setIsIntroStageMuted(false);
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (introStageVideoRef.current) {
          introStageVideoRef.current.muted = true;
          setIsIntroStageMuted(true);
          introStageVideoRef.current.play().catch(() => {});
        }
      });
    }
  }, [isCircleVideoPlaying]);

  const handleCloseIntroVideo = useCallback(() => {
    SoundEngine.playTap();
    if (introStageVideoRef.current) {
      introStageVideoRef.current.pause();
      introStageVideoRef.current.currentTime = 0;
    }
    setIsCircleVideoPlaying(false);
    showToast('Đã đóng video giới thiệu — Hiển thị lại nội dung Bản đồ tử vi');
  }, [showToast]);

  const handleToggleCircleVideo = useCallback(() => {
    SoundEngine.playTap();
    if (isCircleVideoPlaying) {
      handleCloseIntroVideo();
      return;
    }

    stopActiveSpeech();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsCircleVideoPlaying(true);
    showToast('Đang phát video giới thiệu Bản đồ tử vi 🔊');
  }, [isCircleVideoPlaying, handleCloseIntroVideo, showToast]);

  const handleIntroVideoEnded = useCallback(() => {
    setIsCircleVideoPlaying(false);
    showToast('Đã phát xong video giới thiệu Bản đồ tử vi');
  }, [showToast]);

  // Zodiac Lookup State for Slide 4
  const [selectedZodiacKey, setSelectedZodiacKey] = useState<string>('monkey'); // Default to Thân (Tam Hợp)
  const [searchYear, setSearchYear] = useState<string>('1992');
  const [activeYearResult, setActiveYearResult] = useState<number | null>(1992);

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

  // Handle Zodiac search by year
  const handleYearSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    SoundEngine.playTap();
    const yr = parseInt(searchYear.trim(), 10);
    if (!isNaN(yr) && yr >= 1900 && yr <= 2100) {
      const sign = getSignFromYear(yr);
      setSelectedZodiacKey(sign.key);
      setActiveYearResult(yr);
      const info = getCanChiInfo(yr);
      showToast(`Đối chiếu năm ${yr} (${info.canChi}) · Tuổi ${sign.name} (${info.elementRelation})`);
    } else {
      showToast('Vui lòng nhập năm sinh từ 1900 đến 2100.');
    }
  };

  const handleSelectQuickYear = (yr: number) => {
    SoundEngine.playPop();
    setSearchYear(String(yr));
    const sign = getSignFromYear(yr);
    setSelectedZodiacKey(sign.key);
    setActiveYearResult(yr);
  };

  const handleSelectZodiacSign = (key: string) => {
    SoundEngine.playPop();
    setSelectedZodiacKey(key);
    setActiveYearResult(null);
  };

  const currentZodiacInfo: ZodiacSignInfo = useMemo(() => {
    return ZODIAC_BY_KEY[selectedZodiacKey] || ZODIAC_SIGNS[0];
  }, [selectedZodiacKey]);

  const canChiData = useMemo(() => {
    if (activeYearResult) {
      return getCanChiInfo(activeYearResult);
    }
    return null;
  }, [activeYearResult]);

  void currentTheme;

  // =========================================================================
  // SLIDE 1: DANH TÍNH & BẢN MỆNH NGHỀ NGHIỆP
  // =========================================================================
  const renderSlide1Identity = () => {
    const data = SLIDE_1_IDENTITY;
    return (
      <div
        id="horoscope-destiny-card"
        data-element-type="card"
        data-section-card="true"
        style={{
          borderRadius: '14px',
          padding: '0px',
          gap: '15px',
          backgroundColor: 'transparent',
          background: 'transparent',
          backgroundImage: 'none',
          border: 'none',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        className="w-full h-full max-w-full max-h-full flex-shrink-0 overflow-y-auto no-scrollbar flex flex-col justify-start rounded-[14px] p-0 gap-[15px] text-left font-play transition-all relative !bg-transparent !border-0 !shadow-none"
      >



        {/* Nội dung Card 1 hoặc Sân khấu Video Giới Thiệu (khi bấm nút phát video) */}
        {isCircleVideoPlaying ? (
          <motion.div
            id="horoscope-intro-video-stage-wrap"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full min-h-[260px] flex items-center justify-center py-1"
          >
            <div
              id="horoscope-intro-video-stage"
              data-element-type="card"
              data-section-card="true"
              className="bento-card glass-card w-full max-w-[740px] flex flex-col rounded-[14px] overflow-hidden border border-slate-300/80 dark:border-white/20 shadow-2xl bg-slate-950/95 backdrop-blur-xl"
              style={{ borderRadius: '14px' }}
            >
              <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-slate-900/90 border-b border-white/10 text-white shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  <span className="text-xs sm:text-sm font-bold font-play text-cyan-300 truncate">
                    Video giới thiệu Bản đồ tử vi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const v = introStageVideoRef.current;
                      if (!v) return;
                      const nextMuted = !v.muted;
                      v.muted = nextMuted;
                      setIsIntroStageMuted(nextMuted);
                      showToast(nextMuted ? 'Đã tắt âm thanh video' : 'Đã bật âm thanh video 🔊');
                    }}
                    title={isIntroStageMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                  >
                    <WebIcon
                      name={isIntroStageMuted ? 'volume-x' : 'volume-2'}
                      className="w-4 h-4 text-cyan-300"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseIntroVideo}
                    title="Đóng video và hiện lại nội dung Bản đồ tử vi"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-play transition cursor-pointer shadow-sm active:scale-95"
                  >
                    <WebIcon name="cancel" className="w-3.5 h-3.5" />
                    <span>Đóng video</span>
                  </button>
                </div>
              </div>

              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={introStageVideoRef}
                  src={HOROSCOPE_FLOATING_INTRO_VIDEO_URL}
                  controls
                  autoPlay
                  playsInline
                  muted={isIntroStageMuted}
                  onEnded={handleIntroVideoEnded}
                  className="w-full h-full object-contain bg-black"
                >
                  Trình duyệt của bạn không hỗ trợ phát video HTML5.
                </video>
              </div>
            </div>
          </motion.div>
        ) : (
        /* 2-Column Multicolor Bento Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] flex-1 min-h-0 items-stretch">
          {/* CỘT TRÁI (7/12): Danh tính + 3 Thẻ Đặc tính cốt lõi */}
          <div className="lg:col-span-7 flex flex-col gap-[15px] min-h-0 justify-between">
            {/* Card Danh tính & Tổng quan */}
            <div
              data-multicolor-bento="true"
              className="bento-tone-indigo p-[15px] rounded-[14px] flex flex-col justify-between gap-3 min-w-0"
            >
              {/* Profile list 4 ô đa sắc */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {data.profileItems.map((item, idx) => {
                  const subTones = [
                    'bg-white/85 dark:bg-slate-900/75 border-indigo-200/80 dark:border-indigo-500/30',
                    'bg-cyan-50/85 dark:bg-cyan-950/40 border-cyan-200/80 dark:border-cyan-500/30',
                    'bg-purple-50/85 dark:bg-purple-950/40 border-purple-200/80 dark:border-purple-500/30',
                    'bg-amber-50/85 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-500/30',
                  ];
                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-[12px] border shadow-2xs min-w-0 ${subTones[idx % subTones.length]}`}
                    >
                      <span className="text-[10px] uppercase font-bold text-[#475569] dark:text-[#94A3B8] block tracking-wider truncate">
                        {item.label}
                      </span>
                      <b className="text-xs sm:text-[13px] text-slate-900 dark:text-white font-bold block mt-0.5 break-words">
                        {item.value}
                      </b>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3 Thẻ Đặc tính cốt lõi (Bento đa màu sắc 3 cột) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[15px] flex-1 items-stretch">
              {data.traits.map((trait) => {
                const traitTone =
                  trait.id === 'depth'
                    ? 'bento-tone-amber'
                    : trait.id === 'tenacity'
                    ? 'bento-tone-pink'
                    : 'bento-tone-teal';
                return (
                  <div
                    key={trait.id}
                    data-multicolor-bento="true"
                    className={`${traitTone} p-[15px] rounded-[14px] h-full flex flex-col justify-between gap-2 min-w-0`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="w-8 h-8 rounded-[12px] bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-2xs shrink-0"
                        style={{ color: trait.iconColor }}
                      >
                        <WebIcon name={trait.icon} className="w-4 h-4" />
                      </div>
                      {trait.id !== 'tenacity' && (
                        <span
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-white/90 dark:bg-slate-800/95 shadow-2xs truncate"
                          style={{ color: trait.tagColor }}
                        >
                          {trait.tag}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="card-title text-slate-900 dark:text-white mt-1">
                        {trait.title}
                      </h3>
                      <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed mt-1">
                        {trait.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI (5/12): Triết lý lãnh đạo & Định vị Bento Card */}
          <div
            data-multicolor-bento="true"
            className="bento-tone-purple lg:col-span-5 p-[15px] rounded-[14px] h-full flex flex-col justify-between gap-3 min-w-0"
          >
            <div>
              <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 text-[11px] font-bold uppercase tracking-wider">
                <WebIcon name="compass" className="w-4 h-4 text-purple-600 dark:text-purple-300 shrink-0" />
                <span>{data.philosophy.sectionLabel}</span>
              </div>
              <div className="text-[16px] font-bold text-slate-900 dark:text-white leading-relaxed mt-2.5 relative pl-4 border-l-3 border-purple-500 dark:border-purple-400">
                {data.philosophy.quote}
              </div>
              <p className="text-[15px] text-slate-700 dark:text-purple-100/90 mt-2.5 leading-relaxed font-normal">
                {data.philosophy.desc}
              </p>
            </div>

            {/* Khối cam kết định vị */}
            <div className="p-3 rounded-[14px] bg-cyan-50/85 dark:bg-cyan-950/45 border border-cyan-200/80 dark:border-cyan-500/30 backdrop-blur-md">
              <div className="text-[16px] font-bold text-cyan-800 dark:text-cyan-300 tracking-wider flex items-center gap-1.5">
                <WebIcon name="target" className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300 shrink-0" />
                <span>{data.philosophy.commitmentLabel}</span>
              </div>
              <p className="text-[15px] text-slate-800 dark:text-slate-100 mt-1 leading-relaxed">
                {data.philosophy.commitmentDesc}
              </p>
            </div>

            {/* Pill row đa sắc */}
            <div className="flex flex-wrap gap-2 pt-1">
              {data.philosophy.pills.map((p, idx) => {
                const pillTones = [
                  'bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-200 border-indigo-200/80 dark:border-indigo-500/35',
                  'bg-teal-100/90 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200 border-teal-200/80 dark:border-teal-500/35',
                  'bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-200/80 dark:border-amber-500/35',
                ];
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] text-[11px] font-bold border backdrop-blur-md ${pillTones[idx % pillTones.length]}`}
                  >
                    <WebIcon name={p.icon} className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.label}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        )}

      </div>
    );
  };

  // =========================================================================
  // SLIDE 2: MÔ HÌNH QUẢN TRỊ VẬN HÀNH TOÀN DIỆN (NĂM TRỤ CỘT & LỤC CUNG)
  // =========================================================================
  const renderSlide2Operations = () => {
    const pillarToneMap: Record<string, string> = {
      kim: 'bento-tone-blue',
      thuy: 'bento-tone-cyan',
      moc: 'bento-tone-emerald',
      hoa: 'bento-tone-pink',
      tho: 'bento-tone-amber',
    };

    return (
      <div
        id="horoscope-pillars-container"
        data-element-type="card"
        data-section-card="true"
        style={{
          ...cardSampleStyle,
          borderRadius: '14px',
          padding: '0px',
          gap: '15px',
          backgroundColor: 'transparent',
          background: 'transparent',
          backgroundImage: 'none',
          border: 'none',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          width: '100%',
          height: '100%',
        }}
        className="w-full h-full flex-shrink-0 overflow-y-auto no-scrollbar flex flex-col justify-start rounded-[14px] p-0 gap-[15px] text-left font-play transition-all bg-transparent border-0 shadow-none"
      >
        {/* 3 Cột x 2 Hàng (6 Multicolor Bento Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] flex-1 min-h-0 items-stretch">
          {SLIDE_2_PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              id={
                pillar.id === 'kim' ? 'horoscope-metal-card' :
                pillar.id === 'thuy' ? 'horoscope-water-card' :
                pillar.id === 'moc' ? 'horoscope-wood-card' :
                pillar.id === 'hoa' ? 'horoscope-fire-card' :
                pillar.id === 'tho' ? 'horoscope-earth-card' :
                `horoscope-pillar-${pillar.id}`
              }
              data-multicolor-bento="true"
              className={`${pillarToneMap[pillar.id] || 'bento-tone-indigo'} p-[15px] rounded-[14px] flex flex-col justify-between gap-2.5 min-w-0`}
            >
              <div>
                <div className="flex items-center justify-between pb-1.5 border-b border-black/10 dark:border-white/10">
                  <span className="text-xl font-bold font-serif leading-none" style={{ color: pillar.symbolColor }}>
                    {pillar.symbol}
                  </span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-white/90 dark:bg-slate-800/95 shadow-2xs font-mono"
                    style={{ color: pillar.tagColor }}
                  >
                    {pillar.palaceTag}
                  </span>
                </div>

                <h3 className="card-title text-slate-900 dark:text-white mt-2">
                  <WebIcon name={pillar.icon} className="w-4 h-4 shrink-0" style={{ color: pillar.symbolColor }} />
                  <span>{pillar.title}</span>
                </h3>

                <p className="text-[15px] text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed">
                  {pillar.desc}
                </p>

                {/* Focus box */}
                <div className="mt-2.5 p-2.5 rounded-[12px] bg-white/80 dark:bg-slate-900/70 border border-white/90 dark:border-white/10">
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: pillar.tagColor }}>
                    {pillar.focusLabel}
                  </div>
                  <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold mt-0.5 leading-snug">
                    {pillar.focusText}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold px-2.5 py-1 rounded-[12px] bg-white/80 dark:bg-slate-900/75 text-slate-700 dark:text-slate-200 border border-white/90 dark:border-white/10 my-1 truncate">
                  {pillar.styleTag}
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/60 dark:bg-slate-800 overflow-hidden mt-1.5">
                  <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: pillar.barColor }} />
                </div>
              </div>
            </article>
          ))}

          {/* Card 6: Khối kết luận mô hình điều hành tích hợp (3 cột 2 hàng hoàn chỉnh) */}
          <article
            data-multicolor-bento="true"
            className="bento-tone-purple p-[15px] rounded-[14px] flex flex-col justify-between gap-2.5 min-w-0"
          >
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-black/10 dark:border-white/10">
                <span className="text-xl font-bold font-serif leading-none text-purple-600 dark:text-purple-300">
                  合
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[14px] bg-white/90 dark:bg-purple-950/90 text-purple-700 dark:text-purple-200 shadow-2xs font-mono">
                  NGŨ HÀNH TOÀN DIỆN
                </span>
              </div>

              <h3 className="card-title text-slate-900 dark:text-white mt-2">
                <WebIcon name="sparkles" className="w-4 h-4 shrink-0 text-purple-600 dark:text-purple-300" />
                <span>Mô hình điều hành tích hợp</span>
              </h3>

              <p className="text-[15px] text-slate-700 dark:text-slate-200 mt-1.5 leading-relaxed">
                Quy trình (Kim) tạo chuẩn mực · Công nghệ (Thủy) tạo hiệu suất · Con người (Mộc) tạo nội lực · Trải nghiệm (Hỏa) tạo giá trị · Nền tảng (Thổ) tạo sự trường tồn.
              </p>

              <div className="mt-2.5 p-2.5 rounded-[12px] bg-white/80 dark:bg-slate-900/70 border border-white/90 dark:border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  Triết lý cốt lõi:
                </div>
                <div className="text-xs text-slate-800 dark:text-slate-100 font-semibold mt-0.5 leading-snug">
                  Thuận tự nhiên để quản trị bền vững &amp; chuẩn hóa xuất sắc
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold px-2.5 py-1 rounded-[12px] bg-white/80 dark:bg-slate-900/75 text-slate-700 dark:text-slate-200 border border-white/90 dark:border-white/10 my-1 truncate">
                Đồng bộ 5 Trụ Cột Vận Hành
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/60 dark:bg-slate-800 overflow-hidden mt-1.5">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-purple-500" style={{ width: '100%' }} />
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  };

  // =========================================================================
  // SLIDE 3: NGUYÊN TẮC HÀNH ĐỘNG & BẰNG CHỨNG NĂNG LỰC
  // =========================================================================
  const renderSlide3Principles = () => {
    const principleCardStyles = [
      'bg-blue-50/90 dark:bg-blue-950/35 border-blue-200/80 dark:border-blue-500/30',
      'bg-amber-50/90 dark:bg-amber-950/35 border-amber-200/80 dark:border-amber-500/30',
      'bg-pink-50/90 dark:bg-pink-950/35 border-pink-200/80 dark:border-pink-500/30',
      'bg-purple-50/90 dark:bg-purple-950/35 border-purple-200/80 dark:border-purple-500/30',
      'bg-orange-50/90 dark:bg-orange-950/35 border-orange-200/80 dark:border-orange-500/30',
      'bg-teal-50/90 dark:bg-teal-950/35 border-teal-200/80 dark:border-teal-500/30',
    ];
    const proofToneMap: Record<string, string> = {
      'proof-system': 'bento-tone-blue',
      'proof-cx': 'bento-tone-emerald',
      'proof-ai': 'bento-tone-purple',
      'proof-cost': 'bento-tone-amber',
    };

    return (
      <div
        id="horoscope-slide-3"
        data-element-type="card"
        data-section-card="true"
        style={{
          ...cardSampleStyle,
          borderRadius: '14px',
          padding: '0px',
          gap: '15px',
          backgroundColor: 'transparent',
          background: 'transparent',
          backgroundImage: 'none',
          border: 'none',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          width: '100%',
          height: '100%',
        }}
        className="w-full h-full flex-shrink-0 overflow-y-auto no-scrollbar flex flex-col justify-start rounded-[14px] p-0 gap-[15px] text-left font-play transition-all bg-transparent border-0 shadow-none"
      >
        {/* Multicolor Bento Hero Grid (Left 7/12, Right 5/12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] flex-1 min-h-0 items-stretch">
          {/* CỘT TRÁI (7/12): 6 Nguyên tắc hành động + 2 Thẻ Bento Bổ trợ hợp tác */}
          <div className="lg:col-span-7 flex flex-col gap-[15px] min-h-0 justify-between">
            <div
              data-multicolor-bento="true"
              className="bento-tone-indigo p-[15px] rounded-[14px] flex-1 flex flex-col justify-between gap-3 min-w-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-indigo-200/70 dark:border-white/10">
                <span className="text-xs font-bold uppercase text-indigo-800 dark:text-indigo-200 tracking-wider">
                  Hệ quy chiếu quản trị thực tế
                </span>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-[14px] bg-white/90 dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-white/10 flex items-center gap-1">
                  <WebIcon name="award" className="w-3 h-3 text-amber-500" />
                  <span>6 NGUYÊN TẮC HÀNH ĐỘNG</span>
                </span>
              </div>

              {/* 6 Nguyên tắc 2 cột x 3 hàng đa màu sắc */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1">
                {SLIDE_3_PRINCIPLES.map((item, idx) => (
                  <div
                    key={item.num}
                    className={`p-3 rounded-[12px] border shadow-2xs flex flex-col justify-between min-w-0 transition-transform hover:scale-[1.01] ${principleCardStyles[idx % principleCardStyles.length]}`}
                  >
                    <div
                      className="text-[17px] font-bold font-play text-slate-900 dark:text-white flex items-center gap-1.5"
                      style={{ color: item.color, fontWeight: 700 }}
                    >
                      <WebIcon name={item.icon} className="w-4 h-4 shrink-0" />
                      <span className="break-words">{item.title}</span>
                    </div>
                    <p className="text-[15px] text-slate-700 dark:text-slate-200 mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2 Khối bổ trợ hợp tác dạng 2 Bento Card độc lập đa sắc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px]">
              <div
                data-multicolor-bento="true"
                className="bento-tone-purple p-[15px] rounded-[14px] flex flex-col justify-between gap-1 min-w-0"
              >
                <span className="text-xs font-bold text-purple-800 dark:text-purple-200 flex items-center gap-1.5">
                  <WebIcon name="puzzle" className="w-3.5 h-3.5 text-purple-600 dark:text-purple-300 shrink-0" />
                  <span>Tam Hợp Thân–Tý–Thìn</span>
                </span>
                <p className="text-[13px] text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
                  Hợp tác bổ trợ thế mạnh: Tầm nhìn (Thìn) · Tổ chức (Tý) · Sáng kiến (Thân).
                </p>
              </div>

              <div
                data-multicolor-bento="true"
                className="bento-tone-teal p-[15px] rounded-[14px] flex flex-col justify-between gap-1 min-w-0"
              >
                <span className="text-xs font-bold text-teal-800 dark:text-teal-200 flex items-center gap-1.5">
                  <WebIcon name="building" className="w-3.5 h-3.5 text-teal-600 dark:text-teal-300 shrink-0" />
                  <span>Môi trường lý tưởng</span>
                </span>
                <p className="text-[13px] text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
                  Định hướng khách hàng, số hóa quy trình và văn hóa trao quyền minh bạch.
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (5/12): 4 Thẻ Bằng chứng đối chiếu + Leadership Statement */}
          <div className="lg:col-span-5 flex flex-col gap-[15px] min-h-0 justify-between">
            {/* 4 Thẻ Bằng chứng Bento đa sắc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[15px] flex-1 items-stretch">
              {SLIDE_3_PROOFS.map((proof) => (
                <div
                  key={proof.id}
                  data-multicolor-bento="true"
                  className={`${proofToneMap[proof.id] || 'bento-tone-blue'} p-[15px] rounded-[14px] flex flex-col justify-between gap-2 min-w-0`}
                >
                  <div>
                    <h3 className="card-title mt-0.5" style={{ color: proof.color }}>
                      <WebIcon name={proof.icon} className="w-4 h-4 shrink-0" />
                      <span>{proof.title}</span>
                    </h3>
                    <p className="text-[15px] text-slate-700 dark:text-slate-200 mt-1 leading-snug">
                      {proof.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-[14px] bg-white/90 dark:bg-slate-900/90 border border-white/90 dark:border-white/10 text-slate-800 dark:text-slate-100 mt-1 block w-fit max-w-full truncate">
                    {proof.proofTag}
                  </span>
                </div>
              ))}
            </div>

            {/* Leadership Statement Bento Card */}
            <div
              data-multicolor-bento="true"
              className="bento-tone-cyan p-[15px] rounded-[14px] flex flex-col justify-between gap-2 min-w-0"
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 dark:text-cyan-300 flex items-center gap-1">
                  <WebIcon name="quote" className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-300 shrink-0" />
                  <span>Leadership Statement</span>
                </div>
                <h3 className="card-title text-slate-900 dark:text-white mt-1">
                  Kỷ luật trong hệ thống · Thấu cảm trong con người · Hiệu quả trong kết quả.
                </h3>
                <p className="text-[15px] text-slate-700 dark:text-cyan-50/90 mt-1 leading-relaxed">
                  Hơn 22 năm tập trung xây dựng hệ thống vận hành vững chắc, phát triển đội ngũ kế thừa và kiến tạo giá trị khách hàng bền vững.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-200/70 dark:border-white/15 text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white">Nguyễn Hùng Thái</span>
                <span className="text-cyan-800 dark:text-cyan-200 font-mono uppercase tracking-wider">Customer Operations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // =========================================================================
  // SLIDE 4: TRA CỨU TUỔI HỢP TÁC (CÔNG CỤ TƯƠNG HỢP CAN CHI & NGŨ HÀNH)
  // =========================================================================
  const renderSlide4ZodiacTool = () => {
    const sign = currentZodiacInfo;
    const toneClass =
      sign.tone === 'positive'
        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
        : sign.tone === 'caution'
        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
        : 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700';

    return (
      <div
        id="horoscope-lookup-card"
        data-element-type="card"
        data-section-card="true"
        style={{
          borderRadius: '14px',
          padding: '0px',
          gap: '15px',
          backgroundColor: 'transparent',
          background: 'transparent',
          backgroundImage: 'none',
          border: 'none',
          boxShadow: 'none',
          backdropFilter: 'none',
          WebkitBackdropFilter: 'none',
          width: '100%',
          height: '100%',
        }}
        className="w-full h-full flex-shrink-0 overflow-y-auto no-scrollbar flex flex-col justify-start rounded-[14px] p-0 gap-[15px] text-left font-play transition-all bg-transparent border-0 shadow-none"
      >
        {/* 2-Column Zodiac Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0 items-stretch">
          {/* CỘT TRÁI (6/12): Bộ chọn tuổi & Tìm kiếm */}
          <div
            style={{
              ...cardSampleStyle,
              borderRadius: '14px',
              padding: '15px',
            }}
            className="bento-card glass-card lg:col-span-6 p-[15px] rounded-[14px] shadow-sm flex flex-col justify-between gap-2.5"
          >
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-blue-200/60 dark:border-white/10">
                <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 tracking-wider">
                  Tra cứu tuổi làm việc chung
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-[14px] bg-white/90 dark:bg-slate-800 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-white/10">
                  GIÁP TÝ 1984 · KIM
                </span>
              </div>

              {/* Quick suggest chips */}
              <div className="mt-2">
                <span className="text-[9.5px] font-bold uppercase text-[#475569] dark:text-[#94A3B8] block mb-1">
                  Năm sinh thường gặp:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_YEARS.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleSelectQuickYear(yr)}
                      className={`px-3 py-1 rounded-[999px] text-[10.5px] font-bold border transition-all cursor-pointer ${
                        activeYearResult === yr
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-white/10 hover:bg-white'
                      }`}
                    >
                      {yr} · {getSignFromYear(yr).name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleYearSubmit} className="flex items-center gap-2 mt-2.5">
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={searchYear}
                  onChange={(e) => setSearchYear(e.target.value)}
                  placeholder="Ví dụ: 1988, 1992, 1995..."
                  className="flex-1 px-3.5 py-1.5 rounded-[999px] text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[999px] text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1"
                >
                  <WebIcon name="search" className="w-3.5 h-3.5" />
                  <span>Tra Cứu</span>
                </button>
              </form>
            </div>

            {/* Quick 12 Zodiac signs buttons */}
            <div>
              <span className="text-[9.5px] font-bold uppercase text-[#475569] dark:text-[#94A3B8] block mb-1">
                Hoặc chọn nhanh 12 con giáp:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-1.5">
                {ZODIAC_SIGNS.map((z) => {
                  const isSelected = selectedZodiacKey === z.key;
                  return (
                    <button
                      key={z.key}
                      type="button"
                      onClick={() => handleSelectZodiacSign(z.key)}
                      className={`p-1.5 rounded-[999px] border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-blue-600 shadow-md scale-105'
                          : 'bg-white/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700'
                      }`}
                      title={`Tuổi ${z.name}: ${z.type}`}
                    >
                      <span className="text-base leading-none drop-shadow-xs">{z.icon}</span>
                      <span className="text-[10px] font-bold leading-tight">{z.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-[#475569] dark:text-[#94A3B8] leading-snug">
              Nhấp vào một con giáp hoặc nhập năm sinh để phân tích chi tiết mức độ hòa hợp trong công việc.
            </p>
          </div>

          {/* CỘT PHẢI (6/12): Kết quả đối chiếu phân tích sâu */}
          <div
            style={{
              ...cardSampleStyle,
              borderRadius: '14px',
              padding: '15px',
            }}
            className="bento-card glass-card lg:col-span-6 p-[15px] rounded-[14px] bg-gradient-to-br from-white/95 via-blue-50/40 to-indigo-50/50 dark:from-slate-900/95 dark:via-blue-950/25 dark:to-slate-900/95 border border-blue-200/80 dark:border-blue-700/50 shadow-sm flex flex-col justify-between gap-3 overflow-y-auto no-scrollbar"
          >
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-white/10">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wide">
                  Kết quả đối chiếu với Giáp Tý 1984
                </span>
                {canChiData && (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-[14px] bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Mệnh {canChiData.element}
                  </span>
                )}
              </div>

              {/* Main title banner */}
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 rounded-[14px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/15 flex items-center justify-center text-2xl shadow-sm shrink-0">
                  {sign.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="card-title text-slate-900 dark:text-white" style={{ fontSize: '18px' }}>
                    Tuổi {sign.name} {activeYearResult ? `(${activeYearResult} · ${canChiData?.canChi})` : ''}
                  </h3>
                  <p className="text-[15px] text-slate-600 dark:text-slate-300 mt-0.5">
                    {activeYearResult ? `Ngũ hành: ${canChiData?.elementRelation}` : `Nhóm địa chi ${sign.name} · Vai trò: ${sign.role}`}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[14px] text-[10.5px] font-bold border shadow-2xs ${toneClass}`}>
                  <WebIcon name="zap" className="w-3 h-3" />
                  <span>{sign.type}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-[14px] text-[10.5px] font-bold bg-white/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                  Vai trò: {sign.role}
                </span>
              </div>

              {/* Detail paragraph */}
              <p className="text-[15px] text-slate-700 dark:text-slate-200 mt-2.5 leading-relaxed">
                {sign.detail}
              </p>

              {/* 2 Comparison boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                <div className="p-2.5 rounded-[14px] bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50">
                  <b className="text-[16px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <WebIcon name="check-circle" className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Điểm mạnh kết hợp</span>
                  </b>
                  <p className="text-[15px] text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                    {sign.strength}
                  </p>
                </div>

                <div className="p-2.5 rounded-[14px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50">
                  <b className="text-[16px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                    <WebIcon name="alert-triangle" className="w-3.5 h-3.5 text-amber-600" />
                    <span>Điểm nghẽn chú ý</span>
                  </b>
                  <p className="text-[15px] text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                    {sign.caution}
                  </p>
                </div>
              </div>

              {/* Advice box */}
              <div className="p-2.5 rounded-[14px] bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 mt-2">
                <b className="text-[16px] font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1">
                  <WebIcon name="target" className="w-3.5 h-3.5 text-blue-600" />
                  <span>Gợi ý điều phối</span>
                </b>
                <p className="text-[15px] text-slate-800 dark:text-slate-200 mt-1 leading-snug">
                  {sign.advice}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  useEffect(() => {
    if (activeCardIndex !== 0 && isCircleVideoPlaying) {
      if (introStageVideoRef.current) {
        introStageVideoRef.current.pause();
        introStageVideoRef.current.currentTime = 0;
      }
      setIsCircleVideoPlaying(false);
    }
  }, [activeCardIndex, isCircleVideoPlaying]);

  const HOROSCOPE_CARDS = [
    { id: 0, title: 'Bản Mệnh', icon: 'compass', render: renderSlide1Identity },
    { id: 1, title: 'Vận Hành', icon: 'settings', render: renderSlide2Operations },
    { id: 2, title: 'Bằng Chứng', icon: 'award', render: renderSlide3Principles },
    { id: 3, title: 'Tra Cứu', icon: 'search', render: renderSlide4ZodiacTool },
  ];

  return (
    <div
      id="horoscope-page-container"
      data-element-name="Trang Tử Vi & Phong Thủy"
      data-element-type="card"
      data-section-card="true"
      data-element-page="horoscope"
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card relative w-full h-full flex flex-col justify-between p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
    >
      {/* Nội dung Card hiển thị trực tiếp trong container */}
      {HOROSCOPE_CARDS[activeCardIndex].render()}

      {/* Nút LÙI TRANG (Chevron Left) hình tròn nổi ở chính giữa cạnh trái trực tiếp của #horoscope-page-container */}
      <button
        id="el-horoscope-button-prev"
        data-element-id="el-horoscope-button-prev"
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          setActiveCardIndex((prev) => (prev - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length);
        }}
        title={`Lùi trang (${((activeCardIndex - 1 + HOROSCOPE_CARDS.length) % HOROSCOPE_CARDS.length) + 1}/${HOROSCOPE_CARDS.length})`}
        aria-label="Lùi trang"
        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:-translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto"
        style={{
          background: 'var(--bg-header)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-popup)',
          backdropFilter: 'blur(var(--bg-blur))',
          WebkitBackdropFilter: 'blur(var(--bg-blur))',
        }}
      >
        <WebIcon
          name="chevron-left"
          className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
          style={{ color: 'var(--color-primary)' }}
        />
      </button>

      {/* Nút TỚI TRANG (Chevron Right) hình tròn nổi ở chính giữa cạnh phải trực tiếp của #horoscope-page-container */}
      <button
        id="el-horoscope-button-next"
        data-element-id="el-horoscope-button-next"
        type="button"
        onClick={() => {
          SoundEngine.playTap();
          setActiveCardIndex((prev) => (prev + 1) % HOROSCOPE_CARDS.length);
        }}
        title={`Tới trang (${((activeCardIndex + 1) % HOROSCOPE_CARDS.length) + 1}/${HOROSCOPE_CARDS.length})`}
        aria-label="Tới trang"
        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-11 sm:h-11 rounded-full aspect-square backdrop-blur-xl border flex items-center justify-center hover:scale-110 hover:translate-x-0.5 transition-all duration-300 cursor-pointer group active:scale-95 pointer-events-auto"
        style={{
          background: 'var(--bg-header)',
          borderColor: 'var(--border-color)',
          boxShadow: 'var(--shadow-popup)',
          backdropFilter: 'blur(var(--bg-blur))',
          WebkitBackdropFilter: 'blur(var(--bg-blur))',
        }}
      >
        <WebIcon
          name="chevron-right"
          className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform"
          style={{ color: 'var(--color-primary)' }}
        />
      </button>

      {/* ========================================================================= */}
      {/* VÒNG TRÒN NỔI AVATAR VIDEO VÀ BONG BÓNG LỜI NHẮC Ở GÓC TRÊN BÊN PHẢI (CARD 1) */}
      {/* ========================================================================= */}
      {isClientMounted &&
        activeCardIndex === 0 &&
        createPortal(
          <div
            className="fixed top-[78px] sm:top-[88px] right-3 sm:right-6 md:right-8 z-50 flex items-center gap-2 sm:gap-3 select-none pointer-events-auto max-w-[calc(100vw-24px)]"
            role="region"
            aria-label="Video Giới Thiệu Bản Đồ Tử Vi Nổi"
          >
            {/* Bong bóng tin nhắn xanh dương bên trái với đuôi nhọn hướng sang vòng tròn avatar */}
            <div
              onClick={handleToggleCircleVideo}
              className="hidden sm:flex cursor-pointer group/bubble relative items-center bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 sm:px-5 py-2 sm:py-3 rounded-[14px] shadow-[0_8px_24px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border border-blue-300/40"
              title={
                isCircleVideoPlaying
                  ? 'Bấm để đóng video và hiện lại thẻ tử vi'
                  : 'Bấm vào để xem video giới thiệu bản đồ tử vi!'
              }
            >
              <p className="text-[12.5px] sm:text-[14px] font-bold font-play leading-snug tracking-tight text-white m-0 text-left">
                {isCircleVideoPlaying ? (
                  <>
                    Đang phát giới thiệu<br />Bấm để quay lại thẻ!
                  </>
                ) : (
                  <>
                    Bấm vào để xem video<br />giới thiệu bản đồ tử vi!
                  </>
                )}
              </p>

              {/* Đuôi nhọn của bubble hướng về avatar (bên phải) */}
              <div
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[7px] sm:border-y-[8px] border-y-transparent border-l-[9px] sm:border-l-[10px] border-l-[#2563eb] pointer-events-none drop-shadow-xs"
              />
            </div>

            {/* Vòng tròn Avatar video chờ phát sáng rực rỡ & nút Play/Close đè ở chính giữa cạnh dưới */}
            <div className="relative group/circle cursor-pointer" onClick={handleToggleCircleVideo}>
              {/* Vòng sáng Laser Glow Aura bao quanh phát sáng & chuyển động */}
              <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-80 blur-md animate-pulse pointer-events-none" />

              {/* Vòng tròn avatar video chờ lấp đầy 100% */}
              <div
                className={cn(
                  'relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden transition-all duration-300 group-hover/circle:scale-110 border-[3px] shadow-[0_0_25px_rgba(6,182,212,0.8),0_0_45px_rgba(37,99,235,0.6)]',
                  isCircleVideoPlaying
                    ? 'border-cyan-300 ring-4 ring-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.95),0_0_60px_rgba(37,99,235,0.8)]'
                    : 'border-blue-400 dark:border-cyan-400 hover:border-cyan-300'
                )}
                style={{ backgroundColor: '#1e3a5f' }}
              >
                <video
                  ref={circleVideoRef}
                  src={HOROSCOPE_FLOATING_IDLE_VIDEO_URL}
                  autoPlay
                  loop
                  playsInline
                  muted
                  className="w-full h-full min-w-full min-h-full object-cover object-center pointer-events-none scale-[1.08] rounded-full"
                />

                {isCircleVideoPlaying && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-black/85 backdrop-blur-xs text-[8px] sm:text-[9px] font-mono text-cyan-300 font-bold border border-cyan-400/50 pointer-events-none shadow-xs whitespace-nowrap z-10">
                    Đang phát 🔊
                  </div>
                )}
              </div>

              {/* Nút Play / Đóng hình tròn màu đỏ NẰM CHÍNH GIỮA CẠNH DƯỚI HÌNH TRÒN */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleCircleVideo();
                }}
                className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#ef4444] hover:bg-[#dc2626] active:scale-95 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(239,68,68,0.7),0_0_14px_rgba(239,68,68,0.9)] border-2 border-white dark:border-slate-900 transition-all duration-300 z-20 cursor-pointer group-hover/circle:scale-110"
                title={isCircleVideoPlaying ? 'Đóng video & hiện lại thẻ tử vi' : 'Xem video giới thiệu bản đồ tử vi'}
              >
                {isCircleVideoPlaying ? (
                  <WebIcon name="cancel" className="w-4 h-4 text-white" />
                ) : (
                  <WebIcon name="play" className="w-4 h-4 fill-white text-white ml-0.5" />
                )}
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};