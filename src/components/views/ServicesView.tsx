'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { motion, AnimatePresence } from 'motion/react';
import { DOMAINS_DATA, DOMAINS_INTRO } from '@/data/domains';
import { DomainData, SiteTheme } from '@/types';
import { TechStackExplorerModal } from '@/components/domains/TechStackExplorerModal';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { formatCardTitle, formatSentenceFourWords } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/context/LanguageContext';

export interface ServicesViewProps {
  currentTheme?: SiteTheme;
}

const DOMAIN_DETAIL_ACCENTS: Record<string, { light: string; dark: string }> = {
  '01': { light: '#0284c7', dark: '#38bdf8' },
  '02': { light: '#ea580c', dark: '#fb923c' },
  '03': { light: '#e11d48', dark: '#fb7185' },
  '04': { light: '#7c3aed', dark: '#c084fc' },
  '05': { light: '#4338ca', dark: '#818cf8' },
  '06': { light: '#059669', dark: '#34d399' },
};

export const ServicesView: React.FC<ServicesViewProps> = ({ currentTheme = 'light-glass' }) => {
  const { cardStyle, isDark: themeIsDark } = useTheme();
  const { language, t } = useLanguage();
  const isDark = themeIsDark || currentTheme === 'dark-glassmorphism';
  const isLight = !isDark;

  const isEn = language === 'en';
  const [selectedDomain, setSelectedDomain] = useState<DomainData | null>(null);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFilterOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isFilterOpen) {
        setIsFilterOpen(false);
      } else if (selectedDomain && !isTechModalOpen) {
        setSelectedDomain(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFilterOpen, selectedDomain, isTechModalOpen]);

  // Danh sách bộ lọc phân hệ dịch vụ (6.1 - 6.6)
  const filterCategories = [
    { id: 'ALL', label: isEn ? 'All (6)' : 'Tất cả (6)', icon: 'grid' },
    { id: '01', label: isEn ? '6.1 · Telecom Services' : '6.1 · Dịch vụ viễn thông', icon: 'phone' },
    { id: '02', label: isEn ? '6.2 · E-Commerce' : '6.2 · Thương mại điện tử', icon: 'shopping-cart' },
    { id: '03', label: isEn ? '6.3 · Finance & Insurance' : '6.3 · Tài chính bảo hiểm', icon: 'shield-check' },
    { id: '04', label: isEn ? '6.4 · Esports & Gaming' : '6.4 · Thể thao điện tử', icon: 'gamepad-2' },
    { id: '05', label: isEn ? '6.5 · Digital Payments' : '6.5 · Thanh toán điện tử', icon: 'credit-card' },
    { id: '06', label: isEn ? '6.6 · System Architecture' : '6.6 · Xây dựng hệ thống', icon: 'layers' },
  ];

  const filteredDomains =
    activeCategory === 'ALL'
      ? DOMAINS_DATA
      : DOMAINS_DATA.filter((d) => d.id === activeCategory);

  const handleOpenDetail = (domain: DomainData) => {
    SoundEngine.playTap();
    setSelectedDomain(domain);
  };

  // Bộ cấu hình màu sắc & hình ảnh dịch vụ cho 6 thẻ (6.1 - 6.6)
  const getCardVisualConfig = (id: string) => {
    switch (id) {
      case '01': // 6.1. Dịch vụ viễn thông - Blue / Sky
        return {
          accentColor: isLight ? '#0284c7' : '#38bdf8',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f0f7fe 0%, #ddf0fd 30%, #c4e2fa 65%, #beddf9 100%)'
            : 'linear-gradient(135deg, rgba(12, 74, 110, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#93c5fd]/90 hover:border-[#38bdf8]'
            : 'border-sky-400/45 hover:border-sky-300',
          titleColor: isLight ? 'text-[#0284c7]' : 'text-sky-300',
          pillBg: isLight
            ? 'bg-sky-100/90 border-sky-200/90 text-[#0369a1]'
            : 'bg-sky-950/80 border-sky-500/40 text-sky-200',
          arrowBg: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
          arrowShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
          illustrationSrc: 'https://i.ibb.co/4RYYfBvx/D-ch-v-vi-n-th-ng-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069236/Gemini_Generated_Image_9y00s39y00s39y00.png',
          pillText: 'SLA > 98% · CSAT 96,5% · 24/7/365',
        };
      case '02': // 6.2. Thương mại điện tử - Orange / Warm Amber
        return {
          accentColor: isLight ? '#ea580c' : '#fb923c',
          cardBg: isLight
            ? 'linear-gradient(135deg, #fffcf7 0%, #fef1e2 30%, #fccc9b 65%, #fbd2a6 100%)'
            : 'linear-gradient(135deg, rgba(124, 45, 18, 0.52) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#fdba74]/90 hover:border-[#fb923c]'
            : 'border-orange-400/45 hover:border-orange-300',
          titleColor: isLight ? 'text-[#ea580c]' : 'text-orange-300',
          pillBg: isLight
            ? 'bg-orange-100/80 border-orange-200/90 text-[#c2410c]'
            : 'bg-orange-950/80 border-orange-500/40 text-orange-200',
          arrowBg: 'linear-gradient(135deg, #fbbf24 0%, #ea580c 100%)',
          arrowShadow: '0 4px 12px rgba(234, 88, 12, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542367/Th%C6%B0%C6%A1ng_m%E1%BA%A1i_%C4%91i%E1%BB%87n_t%E1%BB%AD-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069235/Gemini_Generated_Image_6g07kh6g07kh6g07.png',
          pillText: 'Chat < 30s · CSAT 96,5% · Mega-Sale',
        };
      case '03': // 6.3. Tài chính bảo hiểm - Rose / Ruby
        return {
          accentColor: isLight ? '#e11d48' : '#fb7185',
          cardBg: isLight
            ? 'linear-gradient(135deg, #fff7f6 0%, #feeae5 30%, #fdd8cf 65%, #f9b3b1 100%)'
            : 'linear-gradient(135deg, rgba(136, 19, 55, 0.52) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#fca5a5]/90 hover:border-[#f43f5e]'
            : 'border-rose-400/45 hover:border-rose-300',
          titleColor: isLight ? 'text-[#e11d48]' : 'text-rose-300',
          pillBg: isLight
            ? 'bg-rose-100/80 border-rose-200/90 text-[#be123c]'
            : 'bg-rose-950/80 border-rose-500/40 text-rose-200',
          arrowBg: 'linear-gradient(135deg, #fb7185 0%, #e11d48 100%)',
          arrowShadow: '0 4px 12px rgba(225, 29, 72, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542365/D%E1%BB%8Bch_v%E1%BB%A5_b%E1%BA%A3o_hi%E1%BB%83m-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069237/Gemini_Generated_Image_r1a3t4r1a3t4r1a3.png',
          pillText: 'FCR > 92% · SLA 95% · Retention +15%',
        };
      case '04': // 6.4. Thể thao điện tử - Purple / Violet
        return {
          accentColor: isLight ? '#7c3aed' : '#c084fc',
          cardBg: isLight
            ? 'linear-gradient(135deg, #faf8fe 0%, #ede8fe 30%, #d9d0fb 65%, #c5b5f9 100%)'
            : 'linear-gradient(135deg, rgba(88, 28, 135, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#c4b5fd]/90 hover:border-[#a855f7]'
            : 'border-purple-400/45 hover:border-purple-300',
          titleColor: isLight ? 'text-[#7c3aed]' : 'text-purple-300',
          pillBg: isLight
            ? 'bg-purple-100/80 border-purple-200/90 text-[#5b21b6]'
            : 'bg-purple-950/80 border-purple-500/40 text-purple-200',
          arrowBg: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
          arrowShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542366/Game_eSports-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069238/Gemini_Generated_Image_s1e5xks1e5xks1e5.png',
          pillText: '> 50.000 Ticket/ngày · CSAT 96%',
        };
      case '05': // 6.5. Thanh toán điện tử - Indigo / Royal Blue
        return {
          accentColor: isLight ? '#4f46e5' : '#818cf8',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f3f7fe 0%, #e0ebfd 30%, #c1d8fb 65%, #9ec1f7 100%)'
            : 'linear-gradient(135deg, rgba(49, 46, 129, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#a5b4fc]/90 hover:border-[#6366f1]'
            : 'border-indigo-400/45 hover:border-indigo-300',
          titleColor: isLight ? 'text-[#4338ca]' : 'text-indigo-300',
          pillBg: isLight
            ? 'bg-indigo-100/80 border-indigo-200/90 text-[#3730a3]'
            : 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200',
          arrowBg: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
          arrowShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542372/Thanh_to%C3%A1n_%C4%91i%E1%BB%87n_t%E1%BB%AD-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069234/Gemini_Generated_Image_3b9s6n3b9s6n3b9s.png',
          pillText: 'RPA 90 giây · CSAT 98,2% · SLA 98,6%',
        };
      case '06': // 6.6. Xây dựng hệ thống - Mint / Teal Emerald
      default:
        return {
          accentColor: isLight ? '#059669' : '#34d399',
          cardBg: isLight
            ? 'linear-gradient(135deg, #f3fbfa 0%, #dff4f2 30%, #b1dfdd 65%, #abd9d6 100%)'
            : 'linear-gradient(135deg, rgba(6, 78, 59, 0.56) 0%, rgba(15, 23, 42, 0.88) 100%)',
          cardBorder: isLight
            ? 'border-[#6ee7b7]/90 hover:border-[#10b981]'
            : 'border-emerald-400/45 hover:border-emerald-300',
          titleColor: isLight ? 'text-[#059669]' : 'text-emerald-300',
          pillBg: isLight
            ? 'bg-emerald-100/80 border-emerald-200/90 text-[#047857]'
            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
          arrowBg: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
          arrowShadow: '0 4px 12px rgba(5, 150, 105, 0.4)',
          illustrationSrc:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793542368/X%C3%A2y_d%E1%BB%B1ng_h%E1%BB%87_th%E1%BB%91ng-removebg-preview.png',
          fallbackIllustration:
            'https://res.cloudinary.com/q5tpzaxk/image/upload/v1793069236/Gemini_Generated_Image_i12r2fi12r2fi12r.png',
          pillText: '100% SOP/KPI · Onboarding -65% · Hiệu suất +40%',
        };
    }
  };

  return (
    <div
      id="services-page-container"
      data-element-name="Trang Dịch Vụ & Giải Pháp"
      data-element-type="container"
      data-element-page="services"
      data-element-parent="global-content-viewport"
      style={{ padding: '25px' }}
      className="main-card w-full min-w-0 h-full mx-auto block p-[25px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px] text-[var(--text-primary)] box-border"
    >
      <div
        id="services-main-content"
        className={
          selectedDomain
            ? 'w-full h-full min-h-0 flex flex-col justify-start gap-[15px] min-w-0'
            : 'w-full min-h-full flex flex-col justify-between gap-[15px] min-w-0'
        }
      >
      {/* 1. HERO BANNER ĐẦU TRANG DỊCH VỤ */}
      {!selectedDomain && (
        <motion.div
          data-element-type="section"
          data-section-card="true"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="banner-card hero-banner w-full max-w-full min-h-[156px] h-auto lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-visible relative border border-white/80 dark:border-white/20 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between gap-2 p-[15px] z-30 backdrop-blur-xl"
          style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: '14px' }}
        >
        <div
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #0d9488 50%, #0f172a 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1794041058/Gemini_Generated_Image_lpt3fplpt3fplpt3.png"
            alt="Banner Dịch vụ trọng tâm"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-110 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1220]/75 via-[#0B1220]/25 to-[#0B1220]/55 pointer-events-none" />
        </div>

        {/* Vùng Tiêu Đề */}
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <WebIcon
              name="layers"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#38bdf8]"
              style={{ color: '#38bdf8', width: '22px', height: '22px' }}
            />
            <h1
              className="typo-h1 font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#38bdf8] truncate"
              style={{
                color: '#38bdf8',
                textTransform: 'none',
                fontStyle: 'normal',
                transform: 'none',
              }}
            >
              Dịch vụ trọng tâm
            </h1>
          </div>
          <p
            className="font-handwriting font-italianno not-italic text-[20px] sm:text-[24px] lg:text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left sm:text-right sm:ml-auto whitespace-normal sm:whitespace-nowrap overflow-hidden text-ellipsis max-w-full sm:max-w-[65%]"
            style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontWeight: 700, fontStyle: 'normal' }}
          >
            &quot;{DOMAINS_INTRO.quote} ♡&quot;
          </p>
        </div>

        {/* Nhóm các nút lại thành 1 filter icon ở bên dưới banner bên trái */}
        <div className="relative z-30 flex items-center justify-between mt-auto pt-2 gap-2" ref={filterMenuRef}>
          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setIsFilterOpen((prev) => !prev);
              }}
              className="banner-control-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full transition-all cursor-pointer typo-button font-play active:scale-95 group"
              title={isEn ? 'Filter' : 'Bộ lọc'}
              aria-label="Bộ lọc dịch vụ"
              aria-expanded={isFilterOpen}
              aria-haspopup="listbox"
            >
              <WebIcon
                name="sliders"
                className="w-4 h-4 text-[var(--color-primary)] transition-transform group-hover:rotate-45 shrink-0"
              />
              <span>{isEn ? 'Filter' : 'Bộ lọc'}</span>
              {activeCategory !== 'ALL' && (
                <span className="banner-count-pill px-2 py-0.5 rounded-full border typo-badge font-mono">
                  {DOMAINS_DATA.find((d) => d.id === activeCategory)?.serviceCode || activeCategory}
                </span>
              )}
              <WebIcon
                name="chevron-down"
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                  isFilterOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16 }}
                  id="services-filter-dropdown"
                  role="listbox"
                  className="banner-dropdown-menu bento-card glass-card absolute left-0 top-[calc(100%+8px)] w-72 rounded-[14px] py-2 px-2 z-50 flex flex-col gap-1"
                >
                  {filterCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        data-selected={isActive ? 'true' : 'false'}
                        onClick={() => {
                          SoundEngine.playTap();
                          if (cat.id === 'ALL') {
                            setActiveCategory('ALL');
                            setSelectedDomain(null);
                          } else {
                            setActiveCategory(cat.id);
                            const found = DOMAINS_DATA.find((d) => d.id === cat.id);
                            if (found) setSelectedDomain(found);
                          }
                          setIsFilterOpen(false);
                        }}
                        className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play transition-all cursor-pointer text-left ${
                          isActive ? 'font-bold shadow-xs' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <WebIcon name={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{cat.label}</span>
                        </span>
                        {isActive && <WebIcon name="check" className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}

                  <div className="h-[1px] bg-[var(--border-subcard)] my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsFilterOpen(false);
                      setIsTechModalOpen(true);
                    }}
                    className="theme-dropdown-option w-full flex items-center justify-between px-3 py-1.5 rounded-[14px] typo-nav font-play text-[var(--text-link,var(--color-primary))] transition-all cursor-pointer text-left"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <WebIcon name="cpu" className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Hệ Sinh Thái Công Nghệ</span>
                    </span>
                    <WebIcon name="chevron-right" className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {selectedDomain && (
            <button
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                setSelectedDomain(null);
              }}
              className="banner-control-pill inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full typo-button font-play cursor-pointer transition active:scale-95"
            >
              <WebIcon name="chevron-left" className="w-3.5 h-3.5" />
              <span>Quay lại 6 thẻ dịch vụ</span>
            </button>
          )}
        </div>
      </motion.div>
      )}

      {/* 2. VÙNG NỘI DUNG: KHI CHƯA CHỌN -> 6 THẺ DẠNG 3 CỘT 2 HÀNG; KHI CLICK XEM CHI TIẾT -> THẺ CHI TIẾT BẰNG KÍCH THƯỚC 6 THẺ CỘNG & VIEW 3 CỘT 2 HÀNG */}
        {!selectedDomain ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch w-full flex-1" style={{ gap: '15px' }}>
            {filteredDomains.map((domain, idx) => {
              const cfg = getCardVisualConfig(domain.id);
              const bullets = (domain.details || domain.experienceItems || []).slice(0, 3);
              const rawServiceImg = domain.customIllustrationUrl || cfg.illustrationSrc;
              const serviceImage = rawServiceImg;

              return (
                <motion.div
                  key={domain.id}
                  id={domain.id === '01' ? 'service-card-telecom' : domain.id === '02' ? 'service-card-ecommerce' : domain.id === '03' ? 'service-card-insurance' : domain.id === '05' ? 'service-card-ewallet' : domain.id === '04' ? 'service-card-esports' : 'service-card-cx-ops'}
                  data-element-type="card"
                  data-section-card="true"
                  role="button"
                  tabIndex={0}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, delay: idx * 0.04 }}
                  onClick={() => handleOpenDetail(domain)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenDetail(domain);
                    }
                  }}
                  style={{
                    borderRadius: '14px',
                    padding: '15px',
                  }}
                  className="service-card bento-card glass-card layered-card group relative rounded-[14px] p-[15px] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between min-h-[230px] shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                >
                  {/* 1. TOP: Tiêu đề tên dịch vụ và icon dịch vụ */}
                  <div className="service-divider relative z-20 flex items-center justify-between pb-2 border-b border-[var(--border-subcard)] shrink-0">
                    <div className="card-header-sync flex items-center gap-2.5 min-w-0 flex-1" style={{ color: cfg.accentColor }}>
                      <span
                        className="shrink-0 flex items-center justify-center bg-transparent border-0 p-0 shadow-none"
                        style={{ color: cfg.accentColor }}
                      >
                        <WebIcon name={domain.icon?.toLowerCase() || 'briefcase'} className="w-[18px] h-[18px] stroke-[2.2]" style={{ width: '18px', height: '18px', color: cfg.accentColor }} />
                      </span>
                      <h3
                        className="service-title-text card-title-synced typo-h3 font-play tracking-tight transition-colors truncate"
                        data-card-title="true"
                        style={{ color: cfg.accentColor }}
                        title={domain.titleEn && language === 'en' ? domain.titleEn : domain.title}
                      >
                        {language === 'en' && domain.titleEn ? domain.titleEn : domain.title}
                      </h3>
                    </div>
                  </div>

                  {/* 2. CENTER: Chứa mô tả và hình dịch vụ */}
                  <div className="relative z-20 flex flex-col sm:flex-row items-center gap-3 py-2.5 flex-1 min-h-0">
                    <div className="flex-1 min-w-0">
                      <p
                        id={`service-card-desc-${domain.id}`}
                        className="card-body-text typo-body line-clamp-4 text-[var(--text-secondary)]"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                        title={(language === 'en' && domain.subtitleEn ? domain.subtitleEn : domain.subtitle) || domain.desc || domain.professionalMessage}
                      >
                        {(language === 'en' && domain.subtitleEn ? domain.subtitleEn : domain.subtitle) || domain.desc || domain.professionalMessage}
                      </p>
                    </div>
                    <div className="w-24 h-20 sm:w-28 sm:h-24 shrink-0 flex items-center justify-center relative bg-transparent">
                      <motion.img
                        src={serviceImage}
                        alt={domain.title}
                        onError={(e) => {
                          if (e.currentTarget.src !== cfg.fallbackIllustration) {
                            e.currentTarget.src = cfg.fallbackIllustration;
                          }
                        }}
                        className="w-full h-full object-contain bg-transparent drop-shadow-[0_8px_14px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* 3. BOTTOM: Logo công ty nền trong suốt, căn giữa gọn gàng */}
                  <div className="service-divider relative z-20 pt-2 border-t border-[var(--border-subcard)] flex items-center justify-center shrink-0">
                    {domain.companyLogos && domain.companyLogos.length > 0 ? (
                      <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        {domain.companyLogos
                          .slice(0, 5)
                          .map((partner, pIdx) => (
                          <div
                            key={pIdx}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-transparent border-0 p-0 shadow-none flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-110"
                            title={partner.name}
                          >
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="w-full h-full object-contain bg-transparent"
                              onError={(e) => {
                                if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                                  e.currentTarget.src = partner.fallbackLogo;
                                } else {
                                  e.currentTarget.style.display = 'none';
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="typo-badge font-mono opacity-80">
                        {cfg.pillText}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* 3. KHUNG XEM CHI TIẾT DỊCH VỤ: BENTO RESPONSIVE GRID CARD, ĐỌC TRỰC TIẾP TỪ DOMAINS_DATA (6.1 - 6.6) */
          (() => {
            const cfg = getCardVisualConfig(selectedDomain.id);
            const accentPair = DOMAIN_DETAIL_ACCENTS[selectedDomain.id] || DOMAIN_DETAIL_ACCENTS['01'];
            const accentColor =
              cardStyle === 'cowhide-leather'
                ? '#FDE68A'
                : cardStyle === 'light-cowhide-leather'
                  ? '#0F172A'
                  : isLight
                    ? accentPair.light
                    : accentPair.dark;
            const domainAccentKeyMap: Record<string, string> = {
              '01': 'sky',
              '02': 'orange',
              '03': 'rose',
              '04': 'purple',
              '05': 'indigo',
              '06': 'emerald',
            };
            const domainAccentKey = domainAccentKeyMap[selectedDomain.id] || 'sky';
            const serviceTitle = isEn && selectedDomain.titleEn ? selectedDomain.titleEn : selectedDomain.title;
            const detailImageSrc = selectedDomain.customIllustrationUrl || cfg.illustrationSrc;
            const professionalMsg =
              (isEn && selectedDomain.subtitleEn ? selectedDomain.subtitleEn : selectedDomain.professionalMessage) ||
              selectedDomain.subtitle ||
              selectedDomain.desc;
            const challengeHeading =
              selectedDomain.id === '06'
                ? isEn
                  ? 'Core Strategic Transformation Challenges'
                  : 'Bài toán chiến lược'
                : isEn
                  ? 'Key Operational Challenges Faced'
                  : 'Thách thức vận hành';
            const toolIcons = ['cpu', 'layers', 'database', 'sparkles', 'shield-check', 'settings'];
            const toolAccents = ['sky', 'indigo', 'emerald', 'purple', 'orange', 'teal'];

            return (
              <motion.div
                id={`services-detail-panel-${selectedDomain.id}`}
                key={`services-detail-${selectedDomain.id}`}
                layoutId={`services-card-${selectedDomain.id}`}
                data-element-type="card"
                data-section-card="true"
                initial={{ opacity: 0.95, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="bento-card glass-card w-full flex-1 min-h-0 overflow-y-auto max-h-full rounded-[14px] p-4 sm:p-5 gap-3.5 sm:gap-4 relative flex flex-col justify-start text-left font-play transition-all duration-300 text-[var(--text-primary)]"
                style={{
                  borderRadius: '14px',
                }}
              >
                {/* 1. TOP HEADER BAR: Icon + Tiêu đề 4 từ đồng màu icon + Nút tròn đóng (X) */}
                <div className="flex items-center justify-between gap-3 sm:gap-4 pb-3 border-b border-[var(--border-subcard)] shrink-0">
                  <div
                    className="card-header-sync flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1"
                    data-card-accent={domainAccentKey}
                    style={{ color: accentColor }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center bg-transparent border-0 p-0 shadow-none"
                      style={{ color: accentColor }}
                    >
                      <WebIcon
                        name={selectedDomain.icon?.toLowerCase() || 'shield-check'}
                        className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]"
                        style={{ width: '1.5em', height: '1.5em', color: accentColor }}
                      />
                    </div>
                    <h2
                      className="typo-h2 card-title-synced font-play tracking-tight min-w-0 break-words"
                      data-card-title="true"
                      style={{ color: accentColor }}
                      title={serviceTitle}
                    >
                      {formatSentenceFourWords(serviceTitle)}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setSelectedDomain(null);
                    }}
                    className="w-8 h-8 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-subcard)] hover:bg-[var(--bg-button-primary)] hover:text-white text-[var(--text-secondary)] flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                    title={isEn ? "Close details" : "Đóng chi tiết"}
                    aria-label={isEn ? "Close details" : "Đóng chi tiết dịch vụ"}
                  >
                    <WebIcon name="x" className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. BENTO RESPONSIVE GRID VIEW (12 CỘT DESKTOP / 2 CỘT TABLET / 1 CỘT MOBILE) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-stretch shrink-0 pb-1">
                  {/* BENTO CARD 1: Thông điệp chuyên môn & Hình ảnh dịch vụ (Cùng hàng với Đối tác tiêu biểu) */}
                  <div
                    data-subcard="true"
                    className="exp-detail-subcard md:col-span-7 p-4 sm:p-5 rounded-[14px] border-l-4 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-4 min-w-0"
                    style={{ borderLeftColor: accentColor }}
                  >
                    <div className="relative z-10 flex-1 min-w-0 flex flex-col justify-between gap-2.5 w-full">
                      <div
                        className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                        data-subcard-accent={domainAccentKey}
                      >
                        <WebIcon name="sparkles" className="w-4.5 h-4.5 shrink-0" />
                        <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                          {isEn ? 'Core Professional Service Message' : 'Thông điệp chuyên môn'}
                        </h3>
                      </div>
                      {professionalMsg && (
                        <p className="typo-body-sm sm:typo-body text-[var(--text-primary)] leading-relaxed break-words">
                          {professionalMsg}
                        </p>
                      )}
                      {selectedDomain.valueDelivered && (
                        <p className="typo-caption text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subcard)]/60 break-words">
                          {selectedDomain.valueDelivered}
                        </p>
                      )}
                    </div>

                    <div className="relative z-10 w-full lg:w-[190px] xl:w-[220px] shrink-0 flex items-center justify-center">
                      <img
                        src={detailImageSrc}
                        alt={serviceTitle}
                        onError={(e) => {
                          if (e.currentTarget.src !== cfg.fallbackIllustration) {
                            e.currentTarget.src = cfg.fallbackIllustration;
                          }
                        }}
                        className="w-full max-w-[170px] sm:max-w-[200px] h-28 sm:h-32 object-contain bg-transparent drop-shadow-[0_10px_18px_rgba(0,0,0,0.16)]"
                      />
                    </div>
                  </div>

                  {/* BENTO CARD 3: Đối tác tiêu biểu (Cùng hàng với Thông điệp chuyên môn) */}
                  <div data-subcard="true" className="exp-detail-subcard md:col-span-5 p-4 sm:p-5 rounded-[14px] flex flex-col justify-between gap-3 min-w-0">
                    <div
                      className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                      data-subcard-accent="teal"
                    >
                      <WebIcon name="users" className="w-4.5 h-4.5 shrink-0" />
                      <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                        {isEn ? 'Key Ecosystem Strategic Partners' : 'Đối tác tiêu biểu'}
                      </h3>
                    </div>
                    {(() => {
                      const logoList = selectedDomain.companyLogos || [];
                      const companyList = selectedDomain.companies || [];

                      return (
                        <div className="flex-1 w-full flex items-center justify-start min-w-0 py-1">
                          <div
                            className="flex flex-row flex-wrap items-center justify-start gap-2.5 sm:gap-3 min-w-0"
                            role="group"
                            aria-label={isEn ? 'Partner logos' : 'Nhóm logo đối tác tiêu biểu'}
                          >
                            {logoList.length > 0
                              ? logoList.map((partner, i) => (
                                  <div
                                    key={partner.name || i}
                                    title={partner.name}
                                    className="relative w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-full flex items-center justify-center overflow-hidden shrink-0 select-none transition-transform duration-200 hover:-translate-y-0.5"
                                  >
                                    <img
                                      src={partner.logo}
                                      alt={partner.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover rounded-full bg-transparent"
                                      onError={(e) => {
                                        if (partner.fallbackLogo && e.currentTarget.src !== partner.fallbackLogo) {
                                          e.currentTarget.src = partner.fallbackLogo;
                                        } else {
                                          e.currentTarget.style.display = 'none';
                                          const fallbackSpan = e.currentTarget.nextElementSibling as HTMLElement | null;
                                          if (fallbackSpan) fallbackSpan.style.display = 'inline';
                                        }
                                      }}
                                    />
                                    <span style={{ display: 'none' }} className="typo-badge font-bold text-slate-900 text-center px-1 break-words leading-tight">
                                      {partner.name}
                                    </span>
                                  </div>
                                ))
                              : companyList.map((companyName, i) => (
                                  <div
                                    key={companyName || i}
                                    title={companyName}
                                    className="relative w-14 h-14 sm:w-16 sm:h-16 aspect-square rounded-full bg-white/90 flex items-center justify-center overflow-hidden shrink-0 select-none"
                                  >
                                    <span className="typo-badge font-bold text-slate-900 text-center leading-tight truncate px-1">
                                      {companyName}
                                    </span>
                                  </div>
                                ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* BENTO CARD 2: Kết quả vận hành (Subcard Grid) */}
                  {selectedDomain.operationalResults && selectedDomain.operationalResults.length > 0 && (
                    <div
                      data-subcard="true"
                      className="exp-detail-subcard md:col-span-12 lg:col-span-7 p-4 rounded-[14px] flex flex-col justify-between gap-3 min-w-0"
                    >
                      <div
                        className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                        data-subcard-accent={domainAccentKey}
                      >
                        <WebIcon name="chart" className="w-4.5 h-4.5 shrink-0" />
                        <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                          {isEn ? 'Key Operational Performance Results' : 'Kết quả vận hành'}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedDomain.operationalResults.map((row, rIdx) => {
                          const topColors = ['#FFDF25', '#E64C72', '#3BB8E6', '#A78BFA'];
                          return (
                            <div
                              key={rIdx}
                              data-subcard="true"
                              className="exp-detail-subcard relative overflow-hidden p-3.5 rounded-[14px] flex flex-col justify-between gap-1.5 min-w-0 transition-transform duration-200 hover:-translate-y-0.5"
                            >
                              <div
                                className="absolute top-0 left-0 right-0 h-1"
                                style={{ backgroundColor: topColors[rIdx % 4] }}
                              />
                              <span
                                className="typo-h3 font-bold break-words mt-0.5"
                                style={{ color: accentColor }}
                              >
                                {row.outcome}
                              </span>
                              <span className="typo-body-sm text-[var(--text-secondary)] break-words">
                                {row.indicator}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {selectedDomain.summaryNote && (
                        <p className="typo-body-sm text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subcard)]/70 break-words">
                          {selectedDomain.summaryNote}
                        </p>
                      )}
                    </div>
                  )}

                  {/* BENTO CARD 4: Vai trò đảm nhiệm */}
                  <div
                    data-subcard="true"
                    className={`exp-detail-subcard ${
                      selectedDomain.operationalResults && selectedDomain.operationalResults.length > 0
                        ? 'md:col-span-12 lg:col-span-5'
                        : 'md:col-span-12'
                    } p-4 rounded-[14px] flex flex-col justify-between gap-2 min-w-0`}
                  >
                    <div
                      className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                      data-subcard-accent="purple"
                    >
                      <WebIcon name="award" className="w-4.5 h-4.5 shrink-0" />
                      <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                        {isEn ? 'Key Leadership Roles Held' : 'Vai trò đảm nhiệm'}
                      </h3>
                    </div>
                    {selectedDomain.rolesHeld && selectedDomain.rolesHeld.length > 0 ? (
                      <ul className="space-y-1.5 my-auto">
                        {selectedDomain.rolesHeld.map((roleName, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2 typo-body-sm font-semibold text-[var(--text-primary)] break-words">
                            <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: accentColor }} />
                            <span>{roleName}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="typo-body-sm text-[var(--text-secondary)] break-words">
                        {selectedDomain.typicalRolesLine}
                      </p>
                    )}
                  </div>

                  {/* BENTO CARD 5: Kinh nghiệm chuyên môn */}
                  {selectedDomain.experienceItems && selectedDomain.experienceItems.length > 0 && (
                    <div data-subcard="true" className="exp-detail-subcard md:col-span-6 p-4 rounded-[14px] space-y-2.5 min-w-0">
                      <div
                        className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                        data-subcard-accent="sky"
                      >
                        <WebIcon name="briefcase" className="w-4.5 h-4.5 shrink-0" />
                        <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                          {isEn ? 'Domain Experience And Expertise' : 'Kinh nghiệm chuyên môn'}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedDomain.experienceItems.map((exp, eIdx) => (
                          <li key={eIdx} className="flex items-start gap-2 typo-body-sm text-[var(--text-primary)] break-words">
                            <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: accentColor }} />
                            <span>{exp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* BENTO CARD 6: Quy mô vận hành */}
                  {selectedDomain.scaleAndScope && selectedDomain.scaleAndScope.length > 0 && (
                    <div data-subcard="true" className="exp-detail-subcard md:col-span-6 p-4 rounded-[14px] space-y-2.5 min-w-0">
                      <div
                        className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                        data-subcard-accent="indigo"
                      >
                        <WebIcon name="layers" className="w-4.5 h-4.5 shrink-0" />
                        <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                          {isEn ? 'Operational Scale And Scope' : 'Quy mô vận hành'}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {selectedDomain.scaleAndScope.map((item, sIdx) => (
                          <div key={sIdx} className="typo-body-sm text-[var(--text-primary)] break-words">
                            <span className="font-semibold" style={{ color: accentColor }}>
                              {item.label}:{' '}
                            </span>
                            <span className="text-[var(--text-secondary)]">{item.content}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BENTO CARD 7: Thách thức vận hành / Bài toán chiến lược */}
                  {selectedDomain.operationalChallenges && selectedDomain.operationalChallenges.length > 0 && (
                    <div
                      data-subcard="true"
                      className={`exp-detail-subcard ${
                        (selectedDomain.tools || []).length > 0
                          ? 'md:col-span-12 lg:col-span-5'
                          : 'md:col-span-12'
                      } p-4 rounded-[14px] space-y-2.5 min-w-0`}
                    >
                      <div
                        className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                        data-subcard-accent="orange"
                      >
                        <WebIcon name="target" className="w-4.5 h-4.5 shrink-0" />
                        <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                          {challengeHeading}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {selectedDomain.operationalChallenges.map((ch, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2 typo-body-sm text-[var(--text-primary)] break-words">
                            <span className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ backgroundColor: accentColor }} />
                            <span>{ch}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* BENTO CARD 8: Nền tảng công cụ (Cùng hàng cân đối với Thách thức vận hành) */}
                  {(selectedDomain.tools || []).length > 0 && (
                    <div
                      data-subcard="true"
                      className={`exp-detail-subcard ${
                        selectedDomain.operationalChallenges && selectedDomain.operationalChallenges.length > 0
                          ? 'md:col-span-12 lg:col-span-7'
                          : 'md:col-span-12'
                      } p-4 rounded-[14px] flex flex-col justify-between gap-3.5 min-w-0`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2.5 min-w-0">
                        <div
                          className="subcard-header-sync flex items-center gap-2 typo-h4 min-w-0"
                          data-subcard-accent="cyan"
                        >
                          <WebIcon name="settings" className="w-4.5 h-4.5 shrink-0" />
                          <h3 className="subcard-title-synced typo-h4 break-words" data-subcard-title="true">
                            {isEn ? 'Core Platforms And Tools' : 'Nền tảng công cụ'}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            SoundEngine.playTap();
                            setIsTechModalOpen(true);
                          }}
                          className="banner-control-pill py-1.5 px-3.5 rounded-full typo-button inline-flex items-center justify-center gap-1.5 cursor-pointer transition hover:opacity-90 shrink-0"
                        >
                          <WebIcon name="cpu" className="w-3.5 h-3.5 shrink-0" />
                          <span>{isEn ? 'Open Tech Ecosystem' : 'Xem hệ sinh thái công nghệ'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-auto">
                        {(selectedDomain.tools || []).map((tech, i) => {
                          const toolIcon = toolIcons[i % toolIcons.length];
                          const toolAccent = toolAccents[i % toolAccents.length];
                          return (
                            <div
                              key={i}
                              data-subcard="true"
                              data-subcard-accent={toolAccent}
                              className="exp-detail-subcard !p-2.5 rounded-[14px] flex items-center gap-2.5 min-w-0 transition-transform duration-200 hover:-translate-y-0.5"
                            >
                              <span
                                className="w-7 h-7 rounded-[14px] shrink-0 flex items-center justify-center border border-[var(--border-subcard)]/70"
                                style={{
                                  backgroundColor:
                                    cardStyle === 'cowhide-leather'
                                      ? 'rgba(61, 33, 11, 0.72)'
                                      : cardStyle === 'light-cowhide-leather'
                                        ? 'rgba(15, 23, 42, 0.08)'
                                        : 'rgba(255, 255, 255, 0.14)',
                                  color: `var(--accent-${toolAccent})`,
                                }}
                              >
                                <WebIcon name={toolIcon} className="w-3.5 h-3.5 shrink-0" />
                              </span>
                              <span className="typo-body-sm font-semibold text-[var(--text-primary)] break-words min-w-0 flex-1 leading-snug">
                                {tech}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })()
        )}

      {/* 4. MODAL KHÁM PHÁ TECH STACK */}
      <TechStackExplorerModal
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />
      </div>
    </div>
  );
};

export default ServicesView;
