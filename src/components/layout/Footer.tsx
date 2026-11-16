import React, { useState, useRef, useEffect } from 'react';
import { TABS_DATA } from '../../data/tabs';
import { WeatherCard } from '../common/WeatherCard';
import { WebIcon } from '../ui/WebIcon';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { CARD_STYLE_PRESETS_LIST, CARD_STYLE_GROUPS, getCardStyleConfig } from '@/config/ui/cardStyles';
import { useLanguage, LanguagePreference } from '@/context/LanguageContext';
import { SoundEngine } from '@/components/ui/SoundEngine';

interface FooterProps {
  currentTabIndex: number;
  onNavigate: (direction: number) => void;
  onSelectTab: (index: number) => void;
  onShowNotification: (msg: string) => void;
  onOpenAiAssistant: () => void;
  onOpenWallpaper?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentTabIndex,
  onNavigate,
  onSelectTab,
  onShowNotification,
  onOpenAiAssistant,
  onOpenWallpaper,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [hoveredRightBtn, setHoveredRightBtn] = useState<number | null>(null);
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsThemeMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsPdfModalOpen(false);
    setHoveredRightBtn(null);
  }, [currentTabIndex]);

  useEffect(() => {
    if (!isThemeMenuOpen && !isLangMenuOpen && !isPdfModalOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (isThemeMenuOpen && themeMenuRef.current && !themeMenuRef.current.contains(e.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (isLangMenuOpen && langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsThemeMenuOpen(false);
        setIsLangMenuOpen(false);
        setIsPdfModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemeMenuOpen, isLangMenuOpen, isPdfModalOpen]);

  const { language, languageMode, browserLocale, browserLanguage, setLanguageMode, t } = useLanguage();
  const isEn = language === 'en';

  const handleSelectLanguageMode = (mode: LanguagePreference) => {
    SoundEngine.playGlassChime();
    setLanguageMode(mode);
    setIsLangMenuOpen(false);
    if (mode === 'auto') {
      const resolvedLabel = browserLanguage === 'vi' ? 'Tiếng Việt' : 'English';
      onShowNotification(
        isEn
          ? `✓ Browser default language (${resolvedLabel} · ${browserLocale})`
          : `✓ Ngôn ngữ mặc định theo trình duyệt (${resolvedLabel} · ${browserLocale})`
      );
    } else if (mode === 'vi') {
      onShowNotification('✓ Đã chuyển ngôn ngữ sang Tiếng Việt');
    } else {
      onShowNotification('✓ Switched display language to English');
    }
  };

  const handleWallpaperClick = () => {
    if (onOpenWallpaper) {
      onOpenWallpaper();
    } else {
      onShowNotification(
        isEn ? 'Opening Wallpaper & Theme Settings!' : 'Mở trang Quản lý Hình Nền & Giao diện!'
      );
    }
  };

  const { cardStyle, setCardStyle, isDark, toggleLightDark } = useTheme();
  const footerCardStyle = getCardStyleProperties(cardStyle);
  const {
    border,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius: _,
    background: _fb,
    backgroundColor: _fbc,
    boxShadow: _fbs,
    backdropFilter: _fbf,
    WebkitBackdropFilter: _fwbf,
    ...cleanFooterStyle
  } = footerCardStyle as any;
  const glassBorderVal = '1px solid rgba(255, 255, 255, 0.1)';
  const activeThemeConfig = getCardStyleConfig(cardStyle);

  const getDeckItemStyle = (index: number, isPopupOpen = false) => {
    const isHovered = hoveredRightBtn === index;
    const isBeforeHovered = hoveredRightBtn !== null && index < hoveredRightBtn;
    return {
      transform: isBeforeHovered ? 'translateX(var(--footer-fan-x))' : 'translateX(0px)',
      zIndex: isPopupOpen ? 9999 : isHovered ? 150 : index + 10,
    };
  };

  const activeLangTitle = language === 'en' ? 'English' : 'Tiếng Việt';
  const activeLangSub =
    languageMode === 'auto'
      ? `${language.toUpperCase()} · ${isEn ? 'Browser' : 'Trình duyệt'}`
      : `${language.toUpperCase()} · ${isEn ? 'Selected' : 'Đã chọn'}`;

  const footerElement = (
    <footer
      id="app-footer"
      data-element-name="Thanh điều hướng Footer chính"
      data-element-type="card"
      data-element-page="global"
      data-element-parent="website-root"
      style={{
        ...cleanFooterStyle,
        maxWidth: '1250px',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderBottom: 'none',
        borderTop: glassBorderVal,
        borderLeft: glassBorderVal,
        borderRight: glassBorderVal,
        borderTopLeftRadius: '14px',
        borderTopRightRadius: '14px',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
      }}
      className="w-full max-w-[1250px] mx-auto h-auto min-h-[64px] py-1.5 sm:py-0 sm:h-[72px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-1.5 px-2.5 sm:px-4 z-50 relative flex-shrink-0 transition-all duration-300 rounded-b-none rounded-t-[14px] border-b-0 border-x border-t border-white/10 backdrop-blur-md mb-0 overflow-visible pointer-events-auto"
    >
      {/* Top highlight subtle */}
      <div className="absolute top-0 inset-x-8 h-[1px] pointer-events-none bg-gradient-to-r from-transparent via-white/25 dark:via-white/15 to-transparent"></div>

      {/* Area 1: Weather Widget co giãn tự động theo nội dung */}
      <div
        id="el-p0-div-109"
        className="w-auto max-w-[58%] sm:max-w-[40%] md:max-w-[calc(50%-88px)] h-auto sm:h-full flex items-center justify-start min-w-0 relative z-10 shrink-0"
        style={{
          paddingRight: '0px',
          paddingBottom: '0px',
          paddingTop: '0px',
        }}
      >
        <WeatherCard onShowNotification={onShowNotification} />
      </div>

      {/* Area 2: Navigation Capsule centered on md+, responsive flow on <md */}
      <div className="w-auto md:w-[160px] relative md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-auto flex items-center justify-center shrink-0">
        <div
          id="footer-nav-capsule"
          role="navigation"
          aria-label={isEn ? 'Page Navigation' : 'Điều hướng trang'}
          data-element-type="button"
          data-section-card="true"
          style={{ borderRadius: '999px' }}
          className="bento-card glass-card relative z-10 w-[118px] sm:w-[144px] md:w-[152px] h-[42px] sm:h-[44px] flex items-center justify-between px-1.5 py-1 !rounded-[999px] rounded-[999px] text-[var(--text-primary)] transition-all duration-300 hover:scale-[1.04] group font-play"
        >
          {/* Prev Button */}
          <span
            id="footer-prev-btn"
            role="button"
            tabIndex={0}
            aria-label={isEn ? 'Previous Page' : 'Trang trước'}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate(-1);
              }
            }}
            title={isEn ? 'Previous Page' : 'Trang trước'}
            className="theme-prev-next-btn w-8.5 h-8.5 rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 transition active:scale-95"
          >
            <WebIcon name="chevron-left" className="w-3.5 h-3.5" />
          </span>

          {/* Page Number with Active Page Icon */}
          <span className="flex-1 h-8 mx-1 flex items-center justify-center gap-1.5 select-none pointer-events-none">
            <WebIcon
              name={TABS_DATA[currentTabIndex]?.icon || 'grid'}
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            />
            <span
              id="footer-page-counter"
              className="typo-caption font-mono font-bold leading-none"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            >
              {String(currentTabIndex + 1).padStart(2, '0')}/{String(TABS_DATA.length).padStart(2, '0')}
            </span>
          </span>

          {/* Next Button */}
          <span
            id="footer-next-btn"
            role="button"
            tabIndex={0}
            aria-label={isEn ? 'Next Page' : 'Trang sau'}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate(1);
              }
            }}
            title={isEn ? 'Next Page' : 'Trang sau'}
            className="theme-prev-next-btn w-8.5 h-8.5 rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 transition active:scale-95"
          >
            <WebIcon name="chevron-right" className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Area 3: Utility Buttons (Ngôn ngữ + Giao diện + Hình Nền + AI Hỗ trợ) - Đúng format nút menu icon Header */}
      <div className="w-full sm:w-auto md:max-w-[calc(50%-88px)] h-auto sm:h-full flex items-center justify-center sm:justify-end overflow-visible sm:pl-2 min-w-0 relative z-20 shrink-0">
        <div
          onMouseLeave={() => setHoveredRightBtn(null)}
          className="relative flex items-center justify-center sm:justify-end flex-nowrap py-0.5 overflow-visible [--footer-fan-x:-28px] sm:[--footer-fan-x:-20px] md:[--footer-fan-x:-28px] lg:[--footer-fan-x:-72px] xl:[--footer-fan-x:-104px]"
        >
          {/* Button 0: Ngôn Ngữ (Format giống nút menu icon Header) */}
          {(() => {
            const isSelected = isLangMenuOpen;
            return (
              <div
                ref={langMenuRef}
                onMouseEnter={() => setHoveredRightBtn(0)}
                style={getDeckItemStyle(0, isLangMenuOpen)}
                className="relative pointer-events-auto shrink-0 ml-0 transition-all duration-300 ease-out"
              >
                <div
                  className={`nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-300 hover:scale-[1.05] w-[132px] md:w-[136px] xl:w-[150px] h-[40px] sm:h-[42px] overflow-hidden ${
                    isSelected ? 'p-[1.5px]' : 'shadow-[0_4px_14px_rgba(0,0,0,0.1)]'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 4px 16px rgba(16, 185, 129, 0.45)' : 'none',
                  }}
                >
                  {isSelected && (
                    <div
                      className="nav-pill-laser absolute -inset-[250%] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none z-0"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0 210deg, #ffffff 270deg, #10B981 300deg, transparent 360deg)',
                      }}
                    />
                  )}
                  <button
                    id="footer-lang-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsThemeMenuOpen(false);
                      setIsLangMenuOpen((prev) => !prev);
                    }}
                    title={
                      isEn
                        ? `Language: ${activeLangTitle} (${activeLangSub})`
                        : `Ngôn ngữ: ${activeLangTitle} (${activeLangSub})`
                    }
                    aria-expanded={isLangMenuOpen}
                    className={`nav-pill relative z-10 inline-flex items-center w-full h-full rounded-[999px] px-[10px] py-[2px] gap-1.5 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#10B981] border-white/80 active shadow-[0_0_25px_rgba(16,185,129,0.45)]'
                        : 'border-emerald-400/80 dark:border-emerald-400/70'
                    }`}
                    style={{
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      ...(isSelected
                        ? {
                            boxShadow:
                              '0 0 30px rgba(16, 185, 129, 0.45), inset 0 0 12px rgba(255,255,255,0.4)',
                          }
                        : {}),
                    }}
                  >
                    <div
                      className="nav-pill-icon-badge w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/40 transition-all duration-300 shadow-xs"
                      style={{
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#10B981',
                      }}
                    >
                      <WebIcon name="languages" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                    </div>
                    <div
                      className={`nav-pill-divider w-[1.5px] h-4 shrink-0 mx-0.5 rounded-[999px] transition-colors duration-300 ${
                        isSelected ? 'bg-white/50' : 'bg-[var(--divider-nav-pill)]'
                      }`}
                    />
                    <div className="flex flex-col text-left leading-none pr-1 min-w-0 flex-1">
                      <span
                        data-no-translate="true"
                        className={`nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-300 ${
                          isSelected ? 'text-white' : 'text-emerald-950 dark:text-emerald-100'
                        }`}
                      >
                        {activeLangTitle}
                      </span>
                      <span
                        className={`nav-pill-sub typo-label leading-none mt-0.5 truncate font-play transition-colors duration-300 ${
                          isSelected ? 'text-white/90' : 'text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {activeLangSub}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Popup Danh sách Ngôn Ngữ */}
                {isLangMenuOpen && (
                  <div
                    id="footer-lang-popup"
                    style={{ background: 'var(--bg-popup)' }}
                    className="theme-popup fixed inset-x-3 bottom-[84px] mx-auto w-[min(256px,calc(100vw-24px))] sm:absolute sm:inset-x-auto sm:bottom-[calc(100%+12px)] sm:left-auto sm:right-0 sm:w-64 rounded-[14px] p-2.5 z-[9999] flex flex-col gap-1.5 font-play text-left animate-slide-up pointer-events-auto"
                  >
                    <div
                      className="px-2.5 py-1 typo-label font-bold tracking-wide border-b flex items-center justify-between"
                      style={{ color: 'var(--text-link, var(--color-primary))', borderColor: 'var(--border-subcard)' }}
                    >
                      <span>{isEn ? 'Select Language' : 'Chọn ngôn ngữ'}</span>
                      <span className="typo-badge font-normal" style={{ color: 'var(--text-muted)' }}>
                        {browserLocale}
                      </span>
                    </div>

                    <button
                      type="button"
                      data-selected={languageMode === 'auto' ? 'true' : undefined}
                      onClick={() => handleSelectLanguageMode('auto')}
                      className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[12px] typo-body-sm font-bold transition cursor-pointer text-left ${
                        languageMode === 'auto' ? 'shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <WebIcon
                            name="globe"
                            className="w-3.5 h-3.5"
                            style={{ color: languageMode === 'auto' ? '#FFFFFF' : 'var(--accent-emerald, var(--color-primary))' }}
                          />
                        </div>
                        <div className="flex items-center min-w-0">
                          <span className="truncate whitespace-nowrap">
                            {isEn ? 'Default Browser Language' : 'Mặc định trình duyệt'}
                          </span>
                        </div>
                      </div>
                      {languageMode === 'auto' && <span className="shrink-0 text-white font-bold ml-2">✓</span>}
                    </button>

                    <button
                      type="button"
                      data-selected={languageMode === 'vi' ? 'true' : undefined}
                      onClick={() => handleSelectLanguageMode('vi')}
                      data-no-translate="true"
                      className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[12px] typo-body-sm font-bold transition cursor-pointer text-left ${
                        languageMode === 'vi' ? 'shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="typo-body-lg leading-none shrink-0">🇻🇳</span>
                        <div className="flex items-center min-w-0">
                          <span className="truncate whitespace-nowrap">Tiếng Việt</span>
                        </div>
                      </div>
                      {languageMode === 'vi' && <span className="shrink-0 text-white font-bold ml-2">✓</span>}
                    </button>

                    <button
                      type="button"
                      data-selected={languageMode === 'en' ? 'true' : undefined}
                      onClick={() => handleSelectLanguageMode('en')}
                      data-no-translate="true"
                      className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[12px] typo-body-sm font-bold transition cursor-pointer text-left ${
                        languageMode === 'en' ? 'shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="typo-body-lg leading-none shrink-0">🇬🇧</span>
                        <div className="flex items-center min-w-0">
                          <span className="truncate whitespace-nowrap">English</span>
                        </div>
                      </div>
                      {languageMode === 'en' && <span className="shrink-0 text-white font-bold ml-2">✓</span>}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Button 1: Giao diện (Format giống nút menu icon Header) */}
          {(() => {
            const isSelected = isThemeMenuOpen || currentTabIndex === 15;
            return (
              <div
                ref={themeMenuRef}
                onMouseEnter={() => setHoveredRightBtn(1)}
                style={getDeckItemStyle(1, isThemeMenuOpen)}
                className="relative pointer-events-auto shrink-0 -ml-[94px] md:-ml-[96px] xl:-ml-[104px] transition-all duration-300 ease-out"
              >
                <div
                  className={`nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-300 hover:scale-[1.05] w-[132px] md:w-[136px] xl:w-[150px] h-[40px] sm:h-[42px] overflow-hidden ${
                    isSelected ? 'p-[1.5px]' : 'shadow-[0_4px_14px_rgba(0,0,0,0.1)]'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 4px 16px rgba(99, 102, 241, 0.45)' : 'none',
                  }}
                >
                  {isSelected && (
                    <div
                      className="nav-pill-laser absolute -inset-[250%] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none z-0"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0 210deg, #ffffff 270deg, #6366F1 300deg, transparent 360deg)',
                      }}
                    />
                  )}
                  <button
                    id="footer-appearance-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playTap();
                      setIsLangMenuOpen(false);
                      setIsThemeMenuOpen((prev) => !prev);
                    }}
                    title={
                      isEn
                        ? `Theme (${t(activeThemeConfig.shortBadge)})`
                        : `Giao diện (${activeThemeConfig.shortBadge})`
                    }
                    aria-expanded={isThemeMenuOpen}
                    className={`nav-pill relative z-10 inline-flex items-center w-full h-full rounded-[999px] px-[10px] py-[2px] gap-1.5 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#4338CA] via-[#6366F1] to-[#818CF8] border-white/80 active shadow-[0_0_25px_rgba(99,102,241,0.45)]'
                        : 'border-indigo-400/80 dark:border-indigo-500/80'
                    }`}
                    style={{
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      ...(isSelected
                        ? {
                            boxShadow:
                              '0 0 30px rgba(99, 102, 241, 0.45), inset 0 0 12px rgba(255,255,255,0.4)',
                          }
                        : {}),
                    }}
                  >
                    <div
                      className="nav-pill-icon-badge w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/40 transition-all duration-300 shadow-xs"
                      style={{
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#6366F1',
                      }}
                    >
                      <WebIcon name="layers" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                    </div>
                    <div
                      className={`nav-pill-divider w-[1.5px] h-4 shrink-0 mx-0.5 rounded-[999px] transition-colors duration-300 ${
                        isSelected ? 'bg-white/50' : 'bg-[var(--divider-nav-pill)]'
                      }`}
                    />
                    <div className="flex flex-col text-left leading-none pr-1 min-w-0 flex-1">
                      <span
                        className={`nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-300 ${
                          isSelected ? 'text-white' : 'text-indigo-950 dark:text-indigo-100'
                        }`}
                      >
                        {isEn ? 'Theme' : 'Giao diện'}
                      </span>
                      <span
                        className={`nav-pill-sub typo-label leading-none mt-0.5 truncate font-play transition-colors duration-300 ${
                          isSelected ? 'text-white/90' : 'text-indigo-700 dark:text-cyan-300'
                        }`}
                      >
                        {t(activeThemeConfig.shortBadge)}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Popup Menu Danh Sách Giao Diện Tự Động từ Theme Registry */}
                {isThemeMenuOpen && (
                  <div
                    id="footer-theme-popup"
                    style={{ background: 'var(--bg-popup)' }}
                    className="theme-popup fixed inset-x-3 bottom-[84px] mx-auto w-[min(288px,calc(100vw-24px))] sm:absolute sm:inset-x-auto sm:bottom-[calc(100%+12px)] sm:left-auto sm:right-0 sm:w-72 rounded-[14px] p-2.5 z-[9999] flex flex-col gap-2 font-play text-left animate-slide-up pointer-events-auto"
                  >
                    <div
                      className="px-2.5 py-1 typo-label font-bold tracking-wide border-b flex items-center justify-between"
                      style={{ color: 'var(--text-link, var(--color-primary))', borderColor: 'var(--border-subcard)' }}
                    >
                      <span>
                        {isEn
                          ? `Theme Presets (${CARD_STYLE_PRESETS_LIST.length})`
                          : `Danh sách Giao diện (${CARD_STYLE_PRESETS_LIST.length})`}
                      </span>
                      <span className="typo-badge font-normal" style={{ color: 'var(--text-muted)' }}>
                        {isEn ? `${CARD_STYLE_GROUPS.length} Groups` : `${CARD_STYLE_GROUPS.length} Nhóm`}
                      </span>
                    </div>

                    {/* Nút trượt qua lại biến thể Sáng / Tối của giao diện đang kích hoạt */}
                    <div
                      className="relative grid grid-cols-2 p-1 rounded-full border items-center"
                      role="group"
                      aria-label={isEn ? 'Light and Dark mode switch' : 'Nút trượt chuyển đổi Sáng và Tối'}
                      style={{
                        background: 'var(--bg-subcard)',
                        borderColor: 'var(--border-subcard)',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out shadow-xs ${
                          isDark
                            ? 'translate-x-full bg-gradient-to-r from-[#182536] via-sky-700 to-indigo-700 border border-sky-400/40'
                            : 'translate-x-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 border border-white/60'
                        }`}
                      />
                      <button
                        type="button"
                        aria-pressed={!isDark}
                        onClick={() => {
                          SoundEngine.playGlassChime();
                          toggleLightDark(false);
                          onShowNotification(
                            isEn ? '✓ Switched to Light variation' : '✓ Đã chuyển sang biến thể Sáng'
                          );
                        }}
                        className={`theme-switch-btn relative z-10 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full typo-label font-bold transition-colors cursor-pointer ${
                          !isDark ? 'text-white' : 'hover:opacity-90'
                        }`}
                        style={isDark ? { color: 'var(--text-muted)' } : undefined}
                      >
                        <WebIcon name="sun" className="w-3.5 h-3.5 shrink-0" />
                        <span>{isEn ? 'Light' : 'Sáng'}</span>
                      </button>
                      <button
                        type="button"
                        aria-pressed={isDark}
                        onClick={() => {
                          SoundEngine.playGlassChime();
                          toggleLightDark(true);
                          onShowNotification(
                            isEn ? '✓ Switched to Dark variation' : '✓ Đã chuyển sang biến thể Tối'
                          );
                        }}
                        className={`theme-switch-btn relative z-10 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full typo-label font-bold transition-colors cursor-pointer ${
                          isDark ? 'text-white' : 'hover:opacity-90'
                        }`}
                        style={!isDark ? { color: 'var(--text-muted)' } : undefined}
                      >
                        <WebIcon name="moon" className="w-3.5 h-3.5 shrink-0" />
                        <span>{isEn ? 'Dark' : 'Tối'}</span>
                      </button>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto no-scrollbar flex flex-col gap-2.5 pr-0.5">
                      {CARD_STYLE_GROUPS.map((group) => (
                        <div key={group.id} className="flex flex-col gap-1">
                          <div
                            className="flex items-center justify-between px-2 py-0.5 typo-badge font-bold"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            <span className="flex items-center gap-1.5 min-w-0 truncate">
                              <WebIcon name={group.icon} className="w-3 h-3 shrink-0" />
                              <span className="truncate">{isEn ? group.labelEn : group.label}</span>
                            </span>
                            <span className="shrink-0 opacity-75">{group.presets.length}</span>
                          </div>

                          {group.presets.map((preset) => {
                            const isActive = cardStyle === preset.id;
                            const isLightGlass = preset.id === 'light-glassmorphism';
                            const isIceBlueNeu = preset.id === 'ice-blue-neumorphism';
                            const isDarkIceBlueNeu = preset.id === 'dark-ice-blue-neumorphism';
                            const isPastelLilac = preset.id === 'pastel-lilac-soft';
                            const isDarkPastelLilac = preset.id === 'dark-pastel-lilac-soft';
                            const isDarkGlass = preset.id === 'dark-glassmorphism';
                            const isLightLeather = preset.id === 'light-cowhide-leather';
                            const isLeather = preset.id === 'cowhide-leather';
                            const presetName = t(preset.name);
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => {
                                  SoundEngine.playGlassChime();
                                  setCardStyle(preset.id);
                                  setIsThemeMenuOpen(false);
                                  onShowNotification(
                                    isEn
                                      ? `✓ Applied theme: ${presetName}`
                                      : `✓ Đã áp dụng giao diện: ${preset.name}`
                                  );
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-body-sm font-bold transition cursor-pointer text-left group ${
                                  isActive
                                    ? isLightGlass
                                      ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border border-white/85 shadow-xs'
                                      : isIceBlueNeu
                                        ? 'bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#6366f1] text-white border border-white/85 shadow-xs'
                                        : isDarkIceBlueNeu
                                          ? 'bg-gradient-to-r from-[#182536] via-[#0e7490] to-[#4f46e5] text-[#f8fafc] border border-sky-300/35 shadow-xs'
                                          : isPastelLilac
                                            ? 'bg-gradient-to-r from-[#8b7ef8] to-[#aba2fc] text-white border border-white/85 shadow-xs'
                                            : isDarkPastelLilac
                                              ? 'bg-gradient-to-r from-[#8b7ef8] to-[#a78bfa] text-white border border-[#c4b5fd]/40 shadow-xs'
                                              : isDarkGlass
                                                ? 'bg-gradient-to-r from-slate-800 via-sky-700 to-indigo-700 text-[#f8fafc] border border-white/25 shadow-xs'
                                                : isLightLeather
                                                  ? 'bg-gradient-to-r from-[#B45309] to-[#8B4513] text-[#FFF8DC] border border-dashed border-[#F5DEB3]/75 shadow-xs'
                                                  : isLeather
                                                    ? 'bg-gradient-to-r from-[#8B5A2B] via-[#653A17] to-[#7A4A20] text-[#FFF8DC] border border-dashed border-[#F5DEB3]/70 shadow-xs'
                                                    : 'bg-indigo-600 text-white shadow-xs'
                                    : 'theme-dropdown-option'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    className={`w-6 h-6 rounded-[14px] flex items-center justify-center shrink-0 shadow-2xs ${
                                      isLightGlass || isIceBlueNeu
                                        ? 'text-[#0284C7]'
                                        : isPastelLilac
                                          ? 'text-[#6d5ce8]'
                                          : isDarkPastelLilac
                                            ? 'text-[#c4b5fd]'
                                            : isDarkIceBlueNeu
                                              ? 'text-[#38bdf8]'
                                              : isLightLeather
                                                ? 'text-[#7C2D12]'
                                                : 'text-white'
                                    }`}
                                    style={
                                      isLightGlass
                                        ? {
                                            background:
                                              'linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(224, 242, 254, 0.78) 100%)',
                                            border: '1px solid rgba(255, 255, 255, 0.95)',
                                            boxShadow:
                                              '0 4px 10px -2px rgba(15, 23, 42, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.95)',
                                            color: '#0284C7',
                                          }
                                        : isIceBlueNeu
                                          ? {
                                              background: 'linear-gradient(145deg, #edf4fa 0%, #e4eef7 100%)',
                                              border: '1px solid rgba(255, 255, 255, 0.9)',
                                              boxShadow:
                                                '3px 3px 6px rgba(176, 198, 219, 0.7), -3px -3px 6px rgba(255, 255, 255, 0.95)',
                                              color: '#0284C7',
                                            }
                                          : isDarkIceBlueNeu
                                            ? {
                                                background: 'linear-gradient(145deg, #182536 0%, #121c29 100%)',
                                                border: '1px solid rgba(148, 197, 248, 0.25)',
                                                boxShadow: '2px 2px 6px #0a1018, -2px -2px 5px #203147',
                                                color: '#38bdf8',
                                              }
                                            : isPastelLilac
                                              ? {
                                                  background: 'linear-gradient(165deg, #ffffff 0%, #f4f2fa 100%)',
                                                  border: '1px solid rgba(226, 222, 243, 0.95)',
                                                  boxShadow: '0 4px 10px -2px rgba(124, 114, 184, 0.24)',
                                                  color: '#6d5ce8',
                                                }
                                              : isDarkPastelLilac
                                                ? {
                                                    background: 'linear-gradient(165deg, #2d2748 0%, #1e1a30 100%)',
                                                    border: '1px solid rgba(196, 181, 253, 0.30)',
                                                    boxShadow: '0 4px 10px -2px rgba(6, 4, 16, 0.45)',
                                                    color: '#c4b5fd',
                                                  }
                                                : isDarkGlass
                                                  ? {
                                                      background: 'rgba(15, 23, 42, 0.88)',
                                                      border: '1px solid rgba(255, 255, 255, 0.25)',
                                                      boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                                                    }
                                                  : isLightLeather
                                                    ? {
                                                        background: 'linear-gradient(135deg, #FDF8F0 0%, #EBD4B4 100%)',
                                                        border: '1px dashed rgba(139, 90, 43, 0.65)',
                                                        color: '#7C2D12',
                                                      }
                                                    : isLeather
                                                      ? {
                                                          background: 'linear-gradient(135deg, #8B5A2B 0%, #522E10 100%)',
                                                          border: '1px dashed rgba(245, 222, 179, 0.6)',
                                                        }
                                                      : { backgroundColor: preset.color }
                                    }
                                  >
                                    <WebIcon name={preset.icon} className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="truncate typo-body-sm font-bold">{presetName}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                  <span
                                    className="typo-badge font-medium opacity-80"
                                    style={!isActive ? { color: 'var(--text-muted)' } : undefined}
                                  >
                                    {preset.isDark ? (isEn ? 'Dark' : 'Tối') : isEn ? 'Light' : 'Sáng'}
                                  </span>
                                  {isActive && <span className="text-white font-bold">✓</span>}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-1.5 mt-1" style={{ borderColor: 'var(--border-subcard)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsThemeMenuOpen(false);
                          onSelectTab(15);
                          onShowNotification(
                            isEn ? '✓ Switched to Theme Settings' : '✓ Chuyển đến trang Cấu hình Giao diện'
                          );
                        }}
                        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-button font-bold transition cursor-pointer text-left"
                        style={{ color: 'var(--text-link, var(--color-primary))' }}
                      >
                        <div className="flex items-center gap-2">
                          <WebIcon name="settings" className="w-3.5 h-3.5" />
                          <span>{isEn ? 'Theme Settings ⚙' : 'Cấu hình giao diện ⚙'}</span>
                        </div>
                        <WebIcon name="arrow-right" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Button 2: Hình Nền (Format giống nút menu icon Header) */}
          {(() => {
            const isSelected = currentTabIndex === 14;
            return (
              <div
                onMouseEnter={() => setHoveredRightBtn(2)}
                style={getDeckItemStyle(2)}
                className="relative pointer-events-auto shrink-0 -ml-[94px] md:-ml-[96px] xl:-ml-[104px] transition-all duration-300 ease-out"
              >
                <div
                  className={`nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-300 hover:scale-[1.05] w-[132px] md:w-[136px] xl:w-[150px] h-[40px] sm:h-[42px] overflow-hidden ${
                    isSelected ? 'p-[1.5px]' : 'shadow-[0_4px_14px_rgba(0,0,0,0.1)]'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 4px 16px rgba(244, 63, 94, 0.45)' : 'none',
                  }}
                >
                  {isSelected && (
                    <div
                      className="nav-pill-laser absolute -inset-[250%] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none z-0"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0 210deg, #ffffff 270deg, #F43F5E 300deg, transparent 360deg)',
                      }}
                    />
                  )}
                  <button
                    id="footer-wallpaper-btn"
                    type="button"
                    onClick={() => {
                      setIsLangMenuOpen(false);
                      setIsThemeMenuOpen(false);
                      handleWallpaperClick();
                    }}
                    title={isEn ? 'Wallpaper (Customize)' : 'Hình Nền (Tùy chỉnh)'}
                    className={`nav-pill relative z-10 inline-flex items-center w-full h-full rounded-[999px] px-[10px] py-[2px] gap-1.5 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#BE123C] via-[#E11D48] to-[#FB7185] border-white/80 active shadow-[0_0_25px_rgba(244,63,94,0.45)]'
                        : 'border-rose-400/80 dark:border-rose-500/80'
                    }`}
                    style={{
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      ...(isSelected
                        ? {
                            boxShadow:
                              '0 0 30px rgba(244, 63, 94, 0.45), inset 0 0 12px rgba(255,255,255,0.4)',
                          }
                        : {}),
                    }}
                  >
                    <div
                      className="nav-pill-icon-badge w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/40 transition-all duration-300 shadow-xs"
                      style={{
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#F43F5E',
                      }}
                    >
                      <WebIcon name="image" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                    </div>
                    <div
                      className={`nav-pill-divider w-[1.5px] h-4 shrink-0 mx-0.5 rounded-[999px] transition-colors duration-300 ${
                        isSelected ? 'bg-white/50' : 'bg-[var(--divider-nav-pill)]'
                      }`}
                    />
                    <div className="flex flex-col text-left leading-none pr-1 min-w-0 flex-1">
                      <span
                        className={`nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-300 ${
                          isSelected ? 'text-white' : 'text-rose-950 dark:text-rose-100'
                        }`}
                      >
                        {isEn ? 'Wallpaper' : 'Hình Nền'}
                      </span>
                      <span
                        className={`nav-pill-sub typo-label leading-none mt-0.5 truncate font-play transition-colors duration-300 ${
                          isSelected ? 'text-white/90' : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {isEn ? 'Customize' : 'Tùy chỉnh'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Button 3: AI Hỗ trợ (Format giống nút menu icon Header) */}
          {(() => {
            const isSelected = currentTabIndex === 13;
            return (
              <div
                onMouseEnter={() => setHoveredRightBtn(3)}
                style={getDeckItemStyle(3)}
                className="relative pointer-events-auto shrink-0 -ml-[94px] md:-ml-[96px] xl:-ml-[104px] transition-all duration-300 ease-out"
              >
                <div
                  className={`nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-300 hover:scale-[1.05] w-[132px] md:w-[136px] xl:w-[150px] h-[40px] sm:h-[42px] overflow-hidden ${
                    isSelected ? 'p-[1.5px]' : 'shadow-[0_4px_14px_rgba(0,0,0,0.1)]'
                  }`}
                  style={{
                    boxShadow: isSelected ? '0 4px 16px rgba(168, 85, 247, 0.5)' : 'none',
                  }}
                >
                  {isSelected && (
                    <div
                      className="nav-pill-laser absolute -inset-[250%] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none z-0"
                      style={{
                        background:
                          'conic-gradient(from 0deg, transparent 0 210deg, #ffffff 270deg, #A855F7 300deg, transparent 360deg)',
                      }}
                    />
                  )}
                  <button
                    id="footer-ai-btn"
                    type="button"
                    onClick={() => {
                      setIsLangMenuOpen(false);
                      setIsThemeMenuOpen(false);
                      onOpenAiAssistant();
                    }}
                    title={isEn ? 'AI Assistant (24/7 Support)' : 'AI hỗ trợ (Trợ lý 24/7)'}
                    className={`nav-pill relative z-10 inline-flex items-center w-full h-full rounded-[999px] px-[10px] py-[2px] gap-1.5 cursor-pointer transition-all duration-300 border-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#6B21A8] via-[#7E22CE] to-[#A855F7] border-white/80 active shadow-[0_0_25px_rgba(168,85,247,0.5)]'
                        : 'border-purple-400/80 dark:border-purple-500/80'
                    }`}
                    style={{
                      paddingTop: '2px',
                      paddingBottom: '2px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      ...(isSelected
                        ? {
                            boxShadow:
                              '0 0 30px rgba(168, 85, 247, 0.5), inset 0 0 12px rgba(255,255,255,0.4)',
                          }
                        : {}),
                    }}
                  >
                    <div
                      className="nav-pill-icon-badge w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/40 transition-all duration-300 shadow-xs"
                      style={{
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#A855F7',
                      }}
                    >
                      <img
                        src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550149/Avata_AI_h%E1%BB%97_tr%E1%BB%A3.gif"
                        alt={isEn ? 'AI Assistant' : 'AI hỗ trợ'}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div
                      className={`nav-pill-divider w-[1.5px] h-4 shrink-0 mx-0.5 rounded-[999px] transition-colors duration-300 ${
                        isSelected ? 'bg-white/50' : 'bg-[var(--divider-nav-pill)]'
                      }`}
                    />
                    <div className="flex flex-col text-left leading-none pr-1 min-w-0 flex-1">
                      <span
                        className={`nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-300 ${
                          isSelected ? 'text-white' : 'text-purple-950 dark:text-purple-100'
                        }`}
                      >
                        {isEn ? 'AI Assistant' : 'AI hỗ trợ'}
                      </span>
                      <span
                        className={`nav-pill-sub typo-label leading-none mt-0.5 truncate font-play transition-colors duration-300 ${
                          isSelected ? 'text-white/90' : 'text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {isEn ? '24/7 Support' : 'Trợ lý 24/7'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* PDF Download Modal */}
      {isPdfModalOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-md p-4 animate-fadeIn font-play pointer-events-auto"
          style={{ background: 'var(--bg-modal-backdrop, rgba(11, 18, 32, 0.72))' }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Download CV Resume — Nguyễn Hùng Thái' : 'Tải Hồ Sơ CV — Nguyễn Hùng Thái'}
            className="theme-modal-card rounded-[14px] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="theme-modal-header px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <WebIcon name="file-text" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="typo-popup-title card-title-synced" style={{ color: 'var(--accent-blue, #2563EB)' }}>
                    {isEn ? 'Download CV Resume — Nguyễn Hùng Thái' : 'Tải Hồ Sơ CV — Nguyễn Hùng Thái'}
                  </h3>
                  <p className="typo-caption opacity-80">
                    {isEn
                      ? 'PDF Format / Customer Service Operations & Digital Transformation Expert'
                      : 'Định dạng PDF / Chuyên gia Vận hành CSKH & Chuyển đổi số'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                aria-label={isEn ? 'Close' : 'Đóng'}
                className="theme-modal-close w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer"
              >
                <WebIcon name="x" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              <div className="theme-modal-subcard p-4 rounded-[14px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full typo-badge font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {isEn ? 'Official 2026 Edition' : 'Bản chính thức 2026'}
                  </span>
                  <h4 className="typo-h4 font-bold">
                    {isEn ? 'Capability Profile & Work Experience' : 'Hồ Sơ Năng Lực & Kinh Nghiệm Công Tác'}
                  </h4>
                  <p className="typo-caption" style={{ color: 'var(--text-secondary)' }}>
                    {isEn
                      ? 'Size: ~2.4 MB • Last updated: Nov 2026'
                      : 'Dung lượng: ~2.4 MB • Cập nhật lần cuối: Tháng 11/2026'}
                  </p>
                </div>
                <a
                  href="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793904186/Gemini_Generated_Image_o4fb9so4fb9so4fb.png"
                  download="Nguyen_Hung_Thai_CV.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onShowNotification(
                      isEn ? '✓ Downloading CV Resume file...' : '✓ Đang tải xuống file Hồ sơ CV...'
                    );
                  }}
                  style={{ background: 'var(--bg-button-primary)' }}
                  className="px-5 py-2.5 rounded-xl hover:opacity-90 text-white font-bold typo-button shadow-md inline-flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <WebIcon name="file-text" className="w-4 h-4 text-white" />
                  <span>{isEn ? 'Download PDF' : 'Tải Xuống PDF'}</span>
                </a>
              </div>

              {/* Overview content preview inside modal */}
              <div className="theme-modal-subcard rounded-[14px] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-current/15 pb-2">
                  <span className="typo-label font-bold opacity-80 uppercase">
                    {isEn ? 'Profile Summary' : 'Tóm tắt thông tin hồ sơ'}
                  </span>
                  <span className="typo-badge font-bold text-[#047857] dark:text-[#6EE7B7] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#047857] dark:bg-[#6EE7B7] animate-pulse"></span>
                    {isEn ? 'Verified' : 'Đã xác thực'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 typo-body-sm">
                  <div>
                    <span className="opacity-75 block typo-label">
                      {isEn ? 'Full Name:' : 'Họ & Tên:'}
                    </span>
                    <span className="font-bold typo-body-sm">Nguyễn Hùng Thái</span>
                  </div>
                  <div>
                    <span className="opacity-75 block typo-label">
                      {isEn ? 'Primary Title:' : 'Chức danh chính:'}
                    </span>
                    <span className="font-bold typo-body-sm">
                      {isEn ? 'Head of Customer Service Operations' : 'Trưởng Phòng Vận Hành CSKH'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-75 block typo-label">
                      {isEn ? 'Experience:' : 'Kinh nghiệm:'}
                    </span>
                    <span className="font-bold">
                      {isEn ? '22+ Years in CS Management' : '22+ Năm Quản Lý CSKH'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-75 block typo-label">
                      {isEn ? 'Education:' : 'Trình độ:'}
                    </span>
                    <span className="font-bold">
                      {isEn ? 'Master of Business Administration (MBA)' : 'Thạc Sĩ Quản Trị Kinh Doanh'}
                    </span>
                  </div>
                  <div>
                    <span className="opacity-75 block typo-label">
                      {isEn ? 'Contact Email:' : 'Email liên hệ:'}
                    </span>
                    <span className="font-bold" style={{ color: 'var(--text-link, var(--color-primary))' }}>hungthai84@gmail.com</span>
                  </div>
                  <div>
                    <span className="opacity-75 block typo-label">
                      {isEn ? 'Phone / Zalo:' : 'Điện thoại / Zalo:'}
                    </span>
                    <span className="font-bold" style={{ color: 'var(--text-link, var(--color-primary))' }}>+84 0909097882</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="theme-modal-footer px-6 py-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="theme-modal-close px-4 py-2 rounded-[999px] typo-button font-bold transition cursor-pointer flex items-center gap-2"
              >
                <WebIcon name="file-text" className="w-4 h-4" />
                <span>{isEn ? 'Print / Save PDF' : 'In PDF / Print'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                className="theme-modal-close px-5 py-2 rounded-[999px] typo-button font-bold transition cursor-pointer"
              >
                {isEn ? 'Close' : 'Đóng cửa sổ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );

  return footerElement;
};
