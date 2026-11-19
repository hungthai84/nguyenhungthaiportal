import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { TABS_DATA } from '../../data/tabs';
import { WeatherCard } from '../common/WeatherCard';
import { WebIcon } from '../ui/WebIcon';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { CARD_STYLE_GROUPS, getCardStyleConfig } from '@/config/ui/cardStyles';
import { FONT_SCALE_OPTIONS, LAYER_DEPTH_PRESETS } from '@/config/ui/layerDepth';
import { useLanguage, LanguagePreference } from '@/context/LanguageContext';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { TtsVoiceSelector } from '@/components/ui/TtsVoiceSelector';

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
  const [focusedRightBtn, setFocusedRightBtn] = useState<number | null>(null);
  const [aiAvatarError, setAiAvatarError] = useState(false);
  const [uniformRightWidth, setUniformRightWidth] = useState<number | null>(null);
  const [uniformRightBtnSize, setUniformRightBtnSize] = useState<{ width: number; height: number } | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const rightPillWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightPillBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setIsThemeMenuOpen(false);
    setIsLangMenuOpen(false);
    setIsPdfModalOpen(false);
    setHoveredRightBtn(null);
    setFocusedRightBtn(null);
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

  const { language, browserLocale, setLanguageMode, t } = useLanguage();
  const isEn = language === 'en';

  const handleSelectLanguageMode = (mode: LanguagePreference) => {
    SoundEngine.playGlassChime();
    setLanguageMode(mode);
    setIsLangMenuOpen(false);
    if (mode === 'vi') {
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

  const {
    cardStyle,
    setCardStyle,
    isDark,
    layerDepth,
    setLayerDepth,
    fontScale,
    setFontScale,
    cycleFontScale,
  } = useTheme();
  const fontScaleOption =
    FONT_SCALE_OPTIONS.find((opt) => opt.id === fontScale) || FONT_SCALE_OPTIONS[0];
  const handleCycleFontScale = () => {
    SoundEngine.playTap();
    const currentIdx = FONT_SCALE_OPTIONS.findIndex((o) => o.id === fontScale);
    const nextOption = FONT_SCALE_OPTIONS[(currentIdx + 1) % FONT_SCALE_OPTIONS.length];
    cycleFontScale();
    if (nextOption) {
      onShowNotification(
        isEn
          ? `✓ Text size: ${nextOption.labelEn} (${nextOption.badge})`
          : `✓ Cỡ chữ: ${nextOption.labelVi} (${nextOption.badge})`
      );
    }
  };
  const footerCardStyle = getCardStyleProperties(cardStyle);
  const {
    border: _b,
    borderColor: _bc,
    borderWidth: _bw,
    borderStyle: _bs,
    borderRadius: _br,
    background: _fb,
    backgroundColor: _fbc,
    boxShadow: _fbs,
    backdropFilter: _fbf,
    WebkitBackdropFilter: _fwbf,
    ...cleanFooterStyle
  } = footerCardStyle as any;
  const glassBorderVal = '1px solid var(--surface-primary-border, rgba(255, 255, 255, 0.86))';
  const activeThemeConfig = getCardStyleConfig(cardStyle);

  // Đo chiều ngang nội dung tự nhiên của 4 nút bên phải Footer và đồng bộ chiều ngang bằng nút rộng nhất
  useLayoutEffect(() => {
    const measureRightPills = () => {
      if (typeof window !== 'undefined') {
        setViewportWidth(window.innerWidth);
      }
      rightPillWrapperRefs.current = rightPillWrapperRefs.current.slice(0, 4);
      rightPillBtnRefs.current = rightPillBtnRefs.current.slice(0, 4);
      const wrappers = rightPillWrapperRefs.current.filter(Boolean) as HTMLDivElement[];
      const btns = rightPillBtnRefs.current.filter(Boolean) as HTMLButtonElement[];
      if (wrappers.length === 0 || btns.length === 0) return;

      wrappers.forEach((w) => {
        w.style.width = 'max-content';
      });

      let maxW = 0;
      wrappers.forEach((w) => {
        const rectW = Math.ceil(w.getBoundingClientRect().width);
        if (rectW > maxW) maxW = rectW;
      });

      wrappers.forEach((w) => {
        w.style.width = maxW > 0 ? `${maxW}px` : '';
      });

      if (maxW > 0) {
        setUniformRightWidth((prev) => (prev !== maxW ? maxW : prev));
      }

      let maxBtnW = 0;
      let maxBtnH = 0;
      btns.forEach((b) => {
        const rect = b.getBoundingClientRect();
        const bw = Math.ceil(rect.width);
        const bh = Math.ceil(rect.height);
        if (bw > maxBtnW) maxBtnW = bw;
        if (bh > maxBtnH) maxBtnH = bh;
      });
      if (maxBtnW > 0 && maxBtnH > 0) {
        setUniformRightBtnSize((prev) =>
          prev && prev.width === maxBtnW && prev.height === maxBtnH
            ? prev
            : { width: maxBtnW, height: maxBtnH }
        );
      }
    };

    measureRightPills();
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measureRightPills();
      });
    }
    window.addEventListener('resize', measureRightPills);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', measureRightPills);
    };
  }, [language, cardStyle, isDark, currentTabIndex]);

  const isCompactMobile = viewportWidth < 768;
  const openUtilityIndex = isLangMenuOpen
    ? 0
    : isThemeMenuOpen
      ? 1
      : null;
  const activeRightIndex =
    hoveredRightBtn !== null
      ? hoveredRightBtn
      : focusedRightBtn !== null
        ? focusedRightBtn
        : openUtilityIndex;
  const hideCenterNavCapsule = !isCompactMobile && activeRightIndex !== null;

  const exposedRightWidth = viewportWidth < 768 ? 40 : viewportWidth < 1024 ? 42 : 46;
  const overlapRightPx = uniformRightWidth
    ? Math.max(0, uniformRightWidth - exposedRightWidth)
    : viewportWidth >= 1280
      ? 104
      : 94;
  const handleRightBtnMouseEnter = (index: number) => {
    setHoveredRightBtn(index);
    if (index === 0) SoundEngine.playPageSpecificSound(12);
    else if (index === 1) SoundEngine.playPageSpecificSound(15);
    else if (index === 2) SoundEngine.playPageSpecificSound(14);
    else if (index === 3) SoundEngine.playPageSpecificSound(13);
  };

  const getDeckItemStyle = (index: number, isPopupOpen = false): React.CSSProperties => {
    const isHighlighted = activeRightIndex === index;
    if (isCompactMobile) {
      return {
        marginLeft: '0px',
        zIndex: isPopupOpen ? 9999 : isHighlighted ? 150 : index + 10,
      };
    }
    const isAfterActive = activeRightIndex !== null && index === activeRightIndex + 1;
    return {
      marginLeft: index === 0 ? '0px' : isAfterActive ? '-10px' : `-${overlapRightPx}px`,
      zIndex: isPopupOpen ? 9999 : index + 10,
    };
  };

  const activeLangTitle = language === 'en' ? 'English' : 'Tiếng Việt';
  const activeLangSub = `${language === 'en' ? 'En' : 'Vi'} · ${isEn ? 'Active' : 'Đang dùng'}`;

  const footerElement = (
    <footer
      id="app-footer"
      data-element-name="Thanh điều hướng Footer chính"
      data-element-type="card"
      data-element-page="global"
      data-element-parent="website-root"
      style={{
        ...cleanFooterStyle,
        maxWidth: 'var(--container-max-w, 1250px)',
        width: 'var(--shared-frame-w, 100%)',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderBottom: 'none',
        borderTop: glassBorderVal,
        borderLeft: glassBorderVal,
        borderRight: glassBorderVal,
        borderRadius: 'var(--radius-footer, 14px 14px 0 0)',
      }}
      className="mx-auto h-auto min-h-[64px] py-1.5 sm:min-h-[72px] sm:h-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-1.5 px-2.5 sm:px-4 z-50 relative flex-shrink-0 border-b-0 border-x border-t backdrop-blur-md mb-0 overflow-visible pointer-events-auto"
    >

      {/* Area 1: Weather Widget + Nút chuyển đổi cỡ chữ hỗ trợ đọc */}
      <div
        id="el-p0-div-109"
        className="w-auto max-w-[64%] sm:max-w-[44%] md:max-w-[calc(50%-92px)] h-auto sm:h-full flex items-center justify-start gap-1.5 min-w-0 relative z-10 shrink-0"
        style={{
          paddingRight: '0px',
          paddingBottom: '0px',
          paddingTop: '0px',
        }}
      >
        <WeatherCard onShowNotification={onShowNotification} />
        <button
          id="footer-font-size-btn"
          type="button"
          onClick={handleCycleFontScale}
          aria-label={
            isEn
              ? `Adjust reading text size (${fontScaleOption.labelEn} ${fontScaleOption.badge})`
              : `Đổi cỡ chữ toàn trang (${fontScaleOption.labelVi} ${fontScaleOption.badge})`
          }
          title={
            isEn
              ? `Reading text size: ${fontScaleOption.labelEn} (${fontScaleOption.badge}) — Click to cycle`
              : `Cỡ chữ đọc trang: ${fontScaleOption.labelVi} (${fontScaleOption.badge}) — Nhấn để đổi`
          }
          style={{
            height: '36px',
            borderRadius: '999px',
            borderColor: 'var(--border-card)',
            background: 'var(--bg-subcard)',
            color: fontScale === 'normal' ? 'var(--text-primary)' : 'var(--text-link, var(--color-primary))',
          }}
          className="inline-flex items-center gap-1 px-2.5 rounded-full border shrink-0 cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95 shadow-2xs"
        >
          <WebIcon name="type" className="w-3.5 h-3.5 shrink-0" />
          <span className="typo-badge font-bold leading-none tabular-nums">
            {fontScaleOption.badge}
          </span>
        </button>
      </div>

      {/* Area 2: Navigation Capsule centered on md+, responsive flow on <md (tạm ẩn trên desktop khi nút bên phải bung ra) */}
      <div
        className={`w-auto relative md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-auto flex items-center justify-center shrink-0 transition-all duration-300 ease-out ${
          hideCenterNavCapsule
            ? 'opacity-0 pointer-events-none scale-90 -translate-y-1'
            : 'opacity-100 pointer-events-auto scale-100 translate-y-0'
        }`}
      >
        <div
          id="footer-nav-capsule"
          role="group"
          aria-label={isEn ? 'Page Navigation' : 'Điều hướng trang'}
          data-element-type="button"
          style={{
            borderRadius: '999px',
            width: '150px',
            height: '40px',
            minHeight: '40px',
            paddingTop: '8px',
            paddingBottom: '8px',
            paddingLeft: '10px',
            paddingRight: '10px',
          }}
          className={`theme-capsule-btn nav-pill relative z-10 flex items-center justify-between text-[var(--text-primary)] border transition-all duration-200 group font-play font-bold ${
            hideCenterNavCapsule ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100'
          }`}
        >
          {/* Prev Button */}
          <button
            id="footer-prev-btn"
            type="button"
            tabIndex={hideCenterNavCapsule ? -1 : 0}
            aria-hidden={hideCenterNavCapsule}
            aria-label={isEn ? 'Previous Page' : 'Trang trước'}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(-1);
            }}
            title={isEn ? 'Previous Page' : 'Trang trước'}
            className={`theme-prev-next-btn min-w-[34px] min-h-[34px] h-full aspect-square rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 transition-all duration-200 border-0 ${
              hideCenterNavCapsule ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <WebIcon name="chevron-left" className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>

          {/* Page Number with Active Page Icon */}
          <span className="flex-1 h-full mx-1 flex items-center justify-center gap-1.5 select-none pointer-events-none">
            <WebIcon
              name={TABS_DATA[currentTabIndex]?.icon || 'grid'}
              className="w-3.5 h-3.5 shrink-0 stroke-[2.5]"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            />
            <span
              id="footer-page-counter"
              className="typo-caption font-mono font-bold tracking-wider leading-none"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            >
              {String(currentTabIndex + 1).padStart(2, '0')}/{String(TABS_DATA.length).padStart(2, '0')}
            </span>
          </span>

          {/* Next Button */}
          <button
            id="footer-next-btn"
            type="button"
            tabIndex={hideCenterNavCapsule ? -1 : 0}
            aria-hidden={hideCenterNavCapsule}
            aria-label={isEn ? 'Next Page' : 'Trang sau'}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(1);
            }}
            title={isEn ? 'Next Page' : 'Trang sau'}
            className={`theme-prev-next-btn min-w-[34px] min-h-[34px] h-full aspect-square rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 transition-all duration-200 border-0 ${
              hideCenterNavCapsule ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <WebIcon name="chevron-right" className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Area 3: Utility Buttons (Ngôn ngữ + Giao diện + Hình Nền + AI Hỗ trợ) */}
      <div
        id="el-p0-div-112"
        onMouseLeave={() => setHoveredRightBtn(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setFocusedRightBtn(null);
          }
        }}
        className="w-full sm:w-auto md:max-w-[calc(50%-88px)] h-auto sm:h-full flex items-center justify-center sm:justify-end overflow-visible sm:pl-2 min-w-0 relative z-20 shrink-0"
      >
        <div
          id="el-p0-div-113"
          onMouseLeave={() => setHoveredRightBtn(null)}
          className={`relative flex items-center justify-center sm:justify-end py-0.5 overflow-visible ${
            isCompactMobile ? 'flex-wrap gap-2' : 'flex-nowrap'
          }`}
        >
          {/* Button 0: Ngôn Ngữ */}
          <div
                ref={langMenuRef}
                onMouseEnter={() => handleRightBtnMouseEnter(0)}
                style={getDeckItemStyle(0, isLangMenuOpen)}
                className="relative pointer-events-auto shrink-0 transition-[margin] duration-300 ease-out"
              >
                <div
                  ref={(el) => {
                    rightPillWrapperRefs.current[0] = el;
                  }}
                  className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-200 w-max h-auto p-[1.5px]"
                  style={{
                    width: uniformRightWidth ? `${uniformRightWidth}px` : undefined,
                  }}
                >
                  <button
                    ref={(el) => {
                      rightPillBtnRefs.current[0] = el;
                    }}
                    id="footer-lang-btn"
                    type="button"
                    onFocus={() => setFocusedRightBtn(0)}
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
                    className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[6px] cursor-pointer transition-colors duration-200 border"
                    style={{
                      width: '150px',
                      height: '40px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      fontWeight: 'normal',
                      borderWidth: '1px',
                    }}
                  >
                    <div
                      className="nav-pill-icon-badge w-6 h-6 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                      style={{
                        backgroundColor: '#10B981',
                      }}
                    >
                      <WebIcon name="languages" className="nav-pill-icon-svg w-3.5 h-3.5 text-white shrink-0" />
                    </div>
                    <div className="nav-pill-divider w-[1.5px] h-4 shrink-0 rounded-[999px] transition-colors duration-200" />
                    <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                      <span
                        data-no-translate="true"
                        style={{ fontWeight: 'bold' }}
                        className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-200"
                      >
                        {activeLangTitle}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Popup Danh sách Ngôn Ngữ (Ẩn mặc định trình duyệt — chỉ hiển thị Tiếng Việt & English) */}
                {isLangMenuOpen && (
                  <div
                    id="footer-lang-popup"
                    style={{ background: 'var(--bg-popup)' }}
                    className="theme-popup fixed inset-x-3 bottom-[84px] mx-auto w-[min(288px,calc(100vw-24px))] sm:absolute sm:inset-x-auto sm:bottom-[calc(100%+12px)] sm:left-auto sm:right-0 sm:w-72 rounded-[14px] p-2.5 z-[9999] flex flex-col gap-1.5 font-play text-left animate-slide-up pointer-events-auto"
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
                      data-selected={language === 'vi' ? 'true' : undefined}
                      onClick={() => handleSelectLanguageMode('vi')}
                      data-no-translate="true"
                      className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-body-sm font-bold transition cursor-pointer text-left ${
                        language === 'vi' ? 'shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="typo-body-lg leading-none shrink-0">🇻🇳</span>
                        <div className="flex items-center min-w-0">
                          <span className="truncate whitespace-nowrap">Tiếng Việt</span>
                        </div>
                      </div>
                      {language === 'vi' && <span className="shrink-0 font-bold ml-2">✓</span>}
                    </button>

                    <button
                      type="button"
                      data-selected={language === 'en' ? 'true' : undefined}
                      onClick={() => handleSelectLanguageMode('en')}
                      data-no-translate="true"
                      className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[14px] typo-body-sm font-bold transition cursor-pointer text-left ${
                        language === 'en' ? 'shadow-xs' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="typo-body-lg leading-none shrink-0">🇬🇧</span>
                        <div className="flex items-center min-w-0">
                          <span className="truncate whitespace-nowrap">English</span>
                        </div>
                      </div>
                      {language === 'en' && <span className="shrink-0 font-bold ml-2">✓</span>}
                    </button>

                    <TtsVoiceSelector isEn={isEn} variant="popup-list" />
                  </div>
                )}
              </div>

          {/* Button 1: Giao diện */}
          <div
                ref={themeMenuRef}
                onMouseEnter={() => handleRightBtnMouseEnter(1)}
                style={getDeckItemStyle(1, isThemeMenuOpen)}
                className="relative pointer-events-auto shrink-0 transition-[margin] duration-300 ease-out"
              >
                <div
                  ref={(el) => {
                    rightPillWrapperRefs.current[1] = el;
                  }}
                  className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-200 w-max h-auto p-[1.5px]"
                  style={{
                    width: uniformRightWidth ? `${uniformRightWidth}px` : undefined,
                  }}
                >
                  <button
                    ref={(el) => {
                      rightPillBtnRefs.current[1] = el;
                    }}
                    id="footer-appearance-btn"
                    type="button"
                    aria-current={currentTabIndex === 15 ? 'page' : undefined}
                    onFocus={() => setFocusedRightBtn(1)}
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
                    className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[6px] cursor-pointer transition-colors duration-200 border"
                    style={{
                      width: '150px',
                      height: '40px',
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      paddingLeft: '10px',
                      paddingRight: '10px',
                      fontWeight: 'normal',
                      borderWidth: '1px',
                    }}
                  >
                    <div
                      className="nav-pill-icon-badge w-6 h-6 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                      style={{
                        backgroundColor: '#6366F1',
                      }}
                    >
                      <WebIcon name="layers" className="nav-pill-icon-svg w-3.5 h-3.5 text-white shrink-0" />
                    </div>
                    <div className="nav-pill-divider w-[1.5px] h-4 shrink-0 rounded-[999px] transition-colors duration-200" />
                    <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                      <span
                        style={{ fontWeight: 'bold' }}
                        className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-200"
                      >
                        {isEn ? 'Theme' : 'Giao diện'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Popup Menu Danh Sách Giao Diện Nhóm Theo 1 Tên + Nút Trượt Sáng / Tối Bên Cạnh */}
                {isThemeMenuOpen && (
                  <div
                    id="footer-theme-popup"
                    style={{ background: 'var(--bg-popup)' }}
                    className="theme-popup fixed inset-x-3 bottom-[84px] mx-auto w-[min(320px,calc(100vw-24px))] max-w-[calc(100vw-24px)] h-auto sm:absolute sm:inset-x-auto sm:bottom-[calc(100%+12px)] sm:left-auto sm:right-0 sm:w-[336px] sm:max-w-[calc(100vw-32px)] rounded-[14px] p-2.5 z-[9999] flex flex-col gap-2 font-play text-left animate-slide-up pointer-events-auto"
                  >
                    <div
                      className="px-2.5 py-1 typo-label font-bold tracking-wide border-b flex items-center justify-between"
                      style={{ color: 'var(--text-link, var(--color-primary))', borderColor: 'var(--border-subcard)' }}
                    >
                      <span>
                        {isEn
                          ? `Themes (${CARD_STYLE_GROUPS.length})`
                          : `Danh sách Giao diện (${CARD_STYLE_GROUPS.length})`}
                      </span>
                      <span className="typo-badge font-normal" style={{ color: 'var(--text-muted)' }}>
                        {isEn ? 'Light / Dark / Color' : 'Sáng / Tối / Màu'}
                      </span>
                    </div>

                    <div className="max-h-[380px] overflow-y-auto no-scrollbar flex flex-col gap-2 pr-0.5">
                      {CARD_STYLE_GROUPS.map((group) => {
                        const lightPreset =
                          (group.lightMode && group.presets.find((p) => p.id === group.lightMode)) ||
                          undefined;
                        const darkPreset =
                          (group.darkMode && group.presets.find((p) => p.id === group.darkMode)) ||
                          undefined;
                        const colorPreset =
                          (group.colorMode && group.presets.find((p) => p.id === group.colorMode)) ||
                          undefined;
                        const hasLight = Boolean(lightPreset);
                        const hasDark = Boolean(darkPreset);
                        const hasColor = Boolean(colorPreset);
                        const groupActive = group.presets.some((p) => p.id === cardStyle);
                        const fallbackPreset =
                          (activeThemeConfig.mechanism === 'color'
                            ? colorPreset
                            : activeThemeConfig.isDark
                              ? darkPreset
                              : lightPreset) ||
                          lightPreset ||
                          darkPreset ||
                          colorPreset ||
                          group.presets[0];
                        const activeGroupPreset = groupActive
                          ? activeThemeConfig
                          : fallbackPreset;
                        const groupTitle = isEn ? group.labelEn : group.label;
                        const isLightSelected = Boolean(lightPreset && cardStyle === lightPreset.id);
                        const isDarkSelected = Boolean(darkPreset && cardStyle === darkPreset.id);
                        const isColorSelected = Boolean(colorPreset && cardStyle === colorPreset.id);

                        const getModeLabel = (mech: 'light' | 'dark' | 'color') => {
                          if (mech === 'light') return isEn ? 'Light' : 'Sáng';
                          if (mech === 'dark') return isEn ? 'Dark' : 'Tối';
                          return isEn ? 'Color' : 'Màu';
                        };

                        const handleApplyPreset = (preset: NonNullable<typeof fallbackPreset>) => {
                          SoundEngine.playGlassChime();
                          setCardStyle(preset.id);
                          const modeText = getModeLabel(preset.mechanism || (preset.isDark ? 'dark' : 'light'));
                          onShowNotification(
                            isEn
                              ? `✓ Applied theme: ${groupTitle} (${modeText})`
                              : `✓ Đã áp dụng giao diện: ${groupTitle} (${modeText})`
                          );
                        };

                        const groupTitleColor = groupActive
                          ? 'var(--text-link, var(--color-primary))'
                          : 'var(--text-primary)';
                        const previewVariants = [
                          lightPreset && {
                            key: 'light' as const,
                            label: isEn ? 'Light' : 'Sáng',
                            preset: lightPreset,
                            isSelected: isLightSelected,
                          },
                          darkPreset && {
                            key: 'dark' as const,
                            label: isEn ? 'Dark' : 'Tối',
                            preset: darkPreset,
                            isSelected: isDarkSelected,
                          },
                          colorPreset && {
                            key: 'color' as const,
                            label: isEn ? 'Color' : 'Màu',
                            preset: colorPreset,
                            isSelected: isColorSelected,
                          },
                        ].filter(
                          (
                            item
                          ): item is {
                            key: 'light' | 'dark' | 'color';
                            label: string;
                            preset: NonNullable<typeof fallbackPreset>;
                            isSelected: boolean;
                          } => Boolean(item)
                        );

                        return (
                          <div
                            key={group.id}
                            className={`w-full flex flex-col gap-2 px-2.5 py-2.5 rounded-[14px] border transition-all ${
                              groupActive ? 'shadow-xs' : 'theme-dropdown-option'
                            }`}
                            style={{
                              background: groupActive ? 'var(--bg-subcard)' : undefined,
                              borderColor: groupActive ? 'var(--color-primary)' : 'var(--border-subcard)',
                            }}
                          >
                            {/* Tên 1 giao diện theo nhóm: Icon & Tiêu đề cùng màu, font in đậm */}
                            <div className="w-full flex items-center justify-between gap-2 min-w-0">
                              <button
                                type="button"
                                onClick={() => handleApplyPreset(fallbackPreset)}
                                className="flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer bg-transparent border-0 px-1 py-0.5 rounded-[10px]"
                              >
                                <div className="flex items-center justify-center shrink-0" style={{ color: groupTitleColor }}>
                                  <WebIcon
                                    name={group.icon}
                                    className="w-4 h-4 shrink-0"
                                    style={{ color: groupTitleColor, strokeWidth: 2.35 }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1 flex items-center gap-1.5">
                                  <span
                                    className="typo-body-sm font-bold truncate"
                                    style={{ color: groupTitleColor, fontWeight: 700 }}
                                  >
                                    {groupTitle}
                                  </span>
                                  {groupActive && (
                                    <span
                                      className="shrink-0 typo-badge font-bold"
                                      style={{ color: groupTitleColor, fontWeight: 700 }}
                                    >
                                      ✓
                                    </span>
                                  )}
                                </div>
                              </button>
                            </div>

                            {/* Demo xem trước dạng giao diện */}
                            {previewVariants.length > 0 && (
                              <div className="grid grid-cols-3 gap-1.5 w-full">
                                {previewVariants.map(({ label, preset, isSelected }) => {
                                  const isBrownLeather = preset.id === 'cowhide-leather';
                                  const isBlackLeather = preset.id === 'black-cowhide-leather';
                                  const isWhiteLeather = preset.id === 'light-cowhide-leather';
                                  const isIceBlueNeu = preset.id === 'ice-blue-neu' || preset.id === 'dark-ice-blue-neu';
                                  const demoTextColor = isBrownLeather
                                    ? '#FFF8DC'
                                    : preset.isDark
                                      ? '#F8FAFC'
                                      : '#0F172A';
                                  const demoOutline = isBrownLeather
                                    ? '1px dashed rgba(245, 222, 179, 0.58)'
                                    : isBlackLeather
                                      ? '1px dashed rgba(226, 232, 240, 0.48)'
                                      : isWhiteLeather
                                        ? '1px dashed rgba(17, 24, 39, 0.58)'
                                        : undefined;

                                  return (
                                    <button
                                      key={preset.id}
                                      type="button"
                                      aria-pressed={isSelected}
                                      title={isEn ? `Preview & apply ${t(preset.name)}` : `Xem demo & chọn ${preset.name}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApplyPreset(preset);
                                      }}
                                      style={{
                                        ...(preset.cardSampleStyle || {}),
                                        borderRadius: isIceBlueNeu ? '14px' : '10px',
                                        padding: '6px 7px',
                                        outline: demoOutline,
                                        outlineOffset: demoOutline ? '-3px' : undefined,
                                        boxShadow: isSelected
                                          ? '0 0 0 2px var(--color-primary), 0 4px 10px rgba(0,0,0,0.12)'
                                          : '0 2px 6px rgba(0,0,0,0.08)',
                                      }}
                                      className="flex flex-col justify-between gap-1.5 cursor-pointer transition-transform duration-200 hover:scale-[1.03] min-w-0 select-none text-left border-0"
                                    >
                                      <div className="flex items-center justify-between gap-1 min-w-0 w-full">
                                        <span
                                          className="typo-badge font-bold leading-none truncate"
                                          style={{ color: demoTextColor, fontWeight: 700 }}
                                        >
                                          {label}
                                        </span>
                                        <span className="flex items-center gap-0.5 shrink-0">
                                          {isIceBlueNeu ? (
                                            <>
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#fb923c]" />
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]" />
                                            </>
                                          ) : (
                                            <span
                                              className="w-2 h-2 rounded-full"
                                              style={{ background: preset.miniBtnStyle?.background || preset.color }}
                                            />
                                          )}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-1 w-full">
                                        <span
                                          style={preset.miniTabStyle}
                                          className="h-2.5 flex-1 rounded-[4px] border"
                                        />
                                        <span
                                          style={preset.miniBtnStyle}
                                          className="h-2.5 w-6 rounded-[4px] shrink-0"
                                        />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Nút Sáng / Tối / Màu kế bên dưới phần demo (chỉ hiển thị dạng có hỗ trợ) */}
                            {(hasLight || hasDark || hasColor) && (
                              <div
                                role="group"
                                aria-label={
                                  isEn
                                    ? `${groupTitle} appearance mode`
                                    : `Chế độ giao diện cho ${groupTitle}`
                                }
                                className="inline-flex items-center justify-between gap-1 p-0.5 rounded-full border w-full"
                                style={{
                                  background: 'var(--bg-subcard)',
                                  borderColor: 'var(--border-subcard)',
                                }}
                              >
                                {hasLight && lightPreset && (
                                  <button
                                    type="button"
                                    data-mode="light"
                                    aria-pressed={isLightSelected}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApplyPreset(lightPreset);
                                    }}
                                    title={isEn ? `${groupTitle} - Light` : `${groupTitle} - Sáng`}
                                    className={`theme-switch-btn flex-1 justify-center inline-flex items-center gap-1 px-2 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap ${
                                      isLightSelected ? 'is-active' : ''
                                    }`}
                                  >
                                    <WebIcon name="sun" className="w-3 h-3 shrink-0" />
                                    <span>{isEn ? 'Light' : 'Sáng'}</span>
                                  </button>
                                )}

                                {hasDark && darkPreset && (
                                  <button
                                    type="button"
                                    data-mode="dark"
                                    aria-pressed={isDarkSelected}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApplyPreset(darkPreset);
                                    }}
                                    title={isEn ? `${groupTitle} - Dark` : `${groupTitle} - Tối`}
                                    className={`theme-switch-btn flex-1 justify-center inline-flex items-center gap-1 px-2 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap ${
                                      isDarkSelected ? 'is-active' : ''
                                    }`}
                                  >
                                    <WebIcon name="moon" className="w-3 h-3 shrink-0" />
                                    <span>{isEn ? 'Dark' : 'Tối'}</span>
                                  </button>
                                )}

                                {hasColor && colorPreset && (
                                  <button
                                    type="button"
                                    data-mode="color"
                                    aria-pressed={isColorSelected}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApplyPreset(colorPreset);
                                    }}
                                    title={isEn ? `${groupTitle} - Color` : `${groupTitle} - Màu`}
                                    className={`theme-switch-btn flex-1 justify-center inline-flex items-center gap-1 px-2 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap ${
                                      isColorSelected ? 'is-active' : ''
                                    }`}
                                  >
                                    <WebIcon name="palette" className="w-3 h-3 shrink-0" />
                                    <span>{isEn ? 'Color' : 'Màu'}</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Điều chỉnh nhanh Cỡ chữ & Độ sâu Layer */}
                    <div
                      className="border-t pt-2 mt-1 flex flex-col gap-2 px-1"
                      style={{ borderColor: 'var(--border-subcard)' }}
                    >
                      {/* Cỡ chữ đọc trang */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="typo-label font-bold flex items-center gap-1.5">
                            <WebIcon name="type" className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                            <span>{isEn ? 'Reading Text Size' : 'Cỡ chữ hỗ trợ đọc'}</span>
                          </span>
                          <span className="typo-badge font-mono" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                            {fontScaleOption.badge}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {FONT_SCALE_OPTIONS.map((opt) => {
                            const isSelected = fontScale === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundEngine.playTap();
                                  setFontScale(opt.id);
                                }}
                                className={`theme-switch-btn justify-center inline-flex items-center gap-1 px-2 py-1 rounded-full typo-badge font-bold transition-all cursor-pointer whitespace-nowrap ${
                                  isSelected ? 'is-active' : ''
                                }`}
                              >
                                <span>{isEn ? opt.labelEn : opt.labelVi}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Độ sâu Layer trực tiếp */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="typo-label font-bold flex items-center gap-1.5">
                            <WebIcon name="layers" className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                            <span>{isEn ? 'Layer Depth' : 'Độ sâu Layer'}</span>
                          </span>
                          <span className="typo-badge font-mono tabular-nums" style={{ color: 'var(--text-link, var(--color-primary))' }}>
                            {layerDepth}%
                          </span>
                        </div>
                        <input
                          id="footer-layer-depth-slider"
                          type="range"
                          min={0}
                          max={200}
                          step={10}
                          value={layerDepth}
                          aria-label={isEn ? 'Adjust Layer Card depth percentage' : 'Điều chỉnh độ sâu Layer Card trực tiếp'}
                          onChange={(e) => setLayerDepth(Number(e.target.value))}
                          className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
                        />
                        <div className="grid grid-cols-4 gap-1">
                          {LAYER_DEPTH_PRESETS.filter((p) => p.value !== 60).map((preset) => {
                            const isSelected = layerDepth === preset.value;
                            return (
                              <button
                                key={preset.value}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  SoundEngine.playTap();
                                  setLayerDepth(preset.value);
                                }}
                                className={`theme-switch-btn justify-center inline-flex items-center px-1.5 py-0.5 rounded-full typo-badge font-bold transition-all cursor-pointer tabular-nums ${
                                  isSelected ? 'is-active' : ''
                                }`}
                              >
                                {preset.value}%
                              </button>
                            );
                          })}
                        </div>
                      </div>
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

          {/* Button 2: Hình Nền */}
          <div
            onMouseEnter={() => handleRightBtnMouseEnter(2)}
            style={getDeckItemStyle(2)}
            className="relative pointer-events-auto shrink-0 transition-[margin] duration-300 ease-out"
          >
            <div
              ref={(el) => {
                rightPillWrapperRefs.current[2] = el;
              }}
              className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-200 w-max h-auto p-[1.5px]"
              style={{
                width: uniformRightWidth ? `${uniformRightWidth}px` : undefined,
              }}
            >
              <button
                ref={(el) => {
                  rightPillBtnRefs.current[2] = el;
                }}
                id="footer-wallpaper-btn"
                type="button"
                aria-current={currentTabIndex === 14 ? 'page' : undefined}
                onFocus={() => setFocusedRightBtn(2)}
                onClick={() => {
                  setIsLangMenuOpen(false);
                  setIsThemeMenuOpen(false);
                  handleWallpaperClick();
                }}
                title={isEn ? 'Wallpaper (Customize)' : 'Hình Nền (Tùy chỉnh)'}
                className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[6px] cursor-pointer transition-colors duration-200 border"
                style={{
                  width: '150px',
                  height: '40px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  fontWeight: 'normal',
                  borderWidth: '1px',
                }}
              >
                <div
                  className="nav-pill-icon-badge w-6 h-6 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                  style={{
                    backgroundColor: '#F43F5E',
                  }}
                >
                  <WebIcon name="image" className="nav-pill-icon-svg w-3.5 h-3.5 text-white shrink-0" />
                </div>
                <div className="nav-pill-divider w-[1.5px] h-4 shrink-0 rounded-[999px] transition-colors duration-200" />
                <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                  <span
                    style={{ fontWeight: 'bold' }}
                    className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-200"
                  >
                    {isEn ? 'Wallpaper' : 'Hình Nền'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Button 3: AI Hỗ trợ */}
          <div
            onMouseEnter={() => handleRightBtnMouseEnter(3)}
            style={getDeckItemStyle(3)}
            className="relative pointer-events-auto shrink-0 transition-[margin] duration-300 ease-out"
          >
            <div
              ref={(el) => {
                rightPillWrapperRefs.current[3] = el;
              }}
              className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none transition-all duration-200 w-max h-auto p-[1.5px]"
              style={{
                width: uniformRightWidth ? `${uniformRightWidth}px` : undefined,
              }}
            >
              <button
                ref={(el) => {
                  rightPillBtnRefs.current[3] = el;
                }}
                id="footer-ai-btn"
                type="button"
                aria-current={currentTabIndex === 13 ? 'page' : undefined}
                aria-label={isEn ? 'Open AI Assistant (24/7 Support)' : 'Mở AI hỗ trợ (Trợ lý 24/7)'}
                onFocus={() => setFocusedRightBtn(3)}
                onClick={() => {
                  SoundEngine.playTap();
                  setIsLangMenuOpen(false);
                  setIsThemeMenuOpen(false);
                  onOpenAiAssistant();
                }}
                title={isEn ? 'AI Assistant (24/7 Support)' : 'AI hỗ trợ (Trợ lý 24/7)'}
                className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[6px] cursor-pointer transition-colors duration-200 border"
                style={{
                  width: '150px',
                  height: '40px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  fontWeight: 'normal',
                  borderWidth: '1px',
                }}
              >
                <div
                  className="nav-pill-icon-badge w-6 h-6 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                  style={{
                    backgroundColor: '#A855F7',
                  }}
                >
                  {aiAvatarError ? (
                    <WebIcon name="bot" className="nav-pill-icon-svg w-3.5 h-3.5 text-white shrink-0" />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793550149/Avata_AI_h%E1%BB%97_tr%E1%BB%A3.gif"
                      alt={isEn ? 'AI Assistant' : 'AI hỗ trợ'}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover rounded-full scale-[1.28]"
                      onError={() => setAiAvatarError(true)}
                    />
                  )}
                </div>
                <div className="nav-pill-divider w-[1.5px] h-4 shrink-0 rounded-[999px] transition-colors duration-200" />
                <div className="flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                  <span
                    style={{ fontWeight: 'bold' }}
                    className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-200"
                  >
                    {isEn ? 'AI Assistant' : 'AI hỗ trợ'}
                  </span>
                </div>
              </button>
            </div>
          </div>
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
                  className="px-5 py-2.5 rounded-[14px] hover:opacity-90 text-white font-bold typo-button shadow-md inline-flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <WebIcon name="file-text" className="w-4 h-4 text-white" />
                  <span>{isEn ? 'Download PDF' : 'Tải Xuống PDF'}</span>
                </a>
              </div>

              {/* Overview content preview inside modal */}
              <div className="theme-modal-subcard rounded-[14px] p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-current/15 pb-2">
                  <span className="typo-label font-bold opacity-80">
                    {isEn ? 'Profile Summary' : 'Tóm tắt thông tin hồ sơ'}
                  </span>
                  <span className="typo-badge font-bold text-[#047857] dark:text-[#6EE7B7] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#047857] dark:bg-[#6EE7B7]"></span>
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
