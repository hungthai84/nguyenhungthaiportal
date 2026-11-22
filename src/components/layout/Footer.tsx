import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { TABS_DATA } from '../../data/tabs';
import { WeatherCard } from '../common/WeatherCard';
import { WebIcon } from '../ui/WebIcon';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { UNIFIED_INTERFACE_THEMES, THEME_FOUR_WORD_NAMES, getCardStyleConfig } from '@/config/ui/cardStyles';
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
  onSelectTab: _onSelectTab,
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
  const [pillRipples, setPillRipples] = useState<Record<string, { id: number; x: number; y: number }>>({});
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themePopupRef = useRef<HTMLDivElement>(null);
  const langPopupRef = useRef<HTMLDivElement>(null);
  const rightPillWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightPillBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const themeLastClickTimeRef = useRef<number>(0);
  const themeDblHandledRef = useRef<boolean>(false);

  const triggerPillRipple = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX > 0 ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY > 0 ? e.clientY - rect.top : rect.height / 2;
    const rippleId = Date.now() + Math.random();
    setPillRipples((prev) => ({ ...prev, [key]: { id: rippleId, x, y } }));
    window.setTimeout(() => {
      setPillRipples((prev) => {
        if (prev[key]?.id !== rippleId) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }, 620);
  };

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
      const target = e.target as Node;
      if (
        isThemeMenuOpen &&
        !themeMenuRef.current?.contains(target) &&
        !themePopupRef.current?.contains(target)
      ) {
        setIsThemeMenuOpen(false);
      }
      if (
        isLangMenuOpen &&
        !langMenuRef.current?.contains(target) &&
        !langPopupRef.current?.contains(target)
      ) {
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

  const handleOpenAppearancePage = () => {
    SoundEngine.playGlassChime();
    setIsLangMenuOpen(false);
    setIsThemeMenuOpen(false);
    _onSelectTab(15);
    onShowNotification(
      isEn ? '✓ Navigated to Interface Configuration' : '✓ Chuyển đến trang Cấu hình Giao diện'
    );
  };

  const {
    cardStyle,
    setCardStyle,
    isDark,
  } = useTheme();
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
  const selectedUtilityPageIndex =
    currentTabIndex === 15
      ? 1
      : currentTabIndex === 14
        ? 2
        : currentTabIndex === 13
          ? 3
          : null;
  const activeRightIndex =
    hoveredRightBtn !== null
      ? hoveredRightBtn
      : focusedRightBtn !== null
        ? focusedRightBtn
        : openUtilityIndex !== null
          ? openUtilityIndex
          : selectedUtilityPageIndex;
  const hideCenterNavCapsule =
    !isCompactMobile &&
    (hoveredRightBtn !== null ||
      focusedRightBtn !== null ||
      openUtilityIndex !== null ||
      (selectedUtilityPageIndex !== null && viewportWidth < 1100));

  const exposedRightWidth = viewportWidth < 768 ? 46 : viewportWidth < 1024 ? 38 : 52;
  const overlapRightPx = uniformRightWidth
    ? Math.max(0, uniformRightWidth - exposedRightWidth)
    : viewportWidth >= 1280
      ? 110
      : 102;
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

  const renderLangPopup = (mobilePlacement: boolean) => (
    <div
      id="footer-lang-popup"
      ref={langPopupRef}
      style={{ background: 'var(--bg-popup)' }}
      className={`theme-popup absolute bottom-[calc(100%+12px)] ${
        mobilePlacement
          ? 'inset-x-3 mx-auto w-[min(288px,calc(100vw-24px))] sm:inset-x-auto sm:right-3'
          : 'left-auto right-0 w-72'
      } rounded-[var(--radius-popup,20px)] p-2.5 z-[9999] flex flex-col gap-1.5 font-play text-left animate-slide-up pointer-events-auto`}
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
        className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-subcard,16px)] typo-body-sm font-bold transition cursor-pointer text-left ${
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
        className={`theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-subcard,16px)] typo-body-sm font-bold transition cursor-pointer text-left ${
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
    </div>
  );

  const renderThemePopup = (mobilePlacement: boolean) => (
    <div
      id="footer-theme-popup"
      ref={themePopupRef}
      style={{ background: 'var(--bg-popup)' }}
      className={`theme-popup absolute bottom-[calc(100%+12px)] ${
        mobilePlacement
          ? 'inset-x-3 mx-auto w-[min(264px,calc(100vw-24px))] max-w-[calc(100vw-24px)] sm:inset-x-auto sm:right-3'
          : 'left-auto right-0 w-[264px] max-w-[calc(100vw-32px)]'
      } rounded-[var(--radius-popup,16px)] p-2 z-[9999] flex flex-col gap-1 font-play text-left animate-slide-up pointer-events-auto`}
    >
      <div className="max-h-[380px] overflow-y-auto no-scrollbar flex flex-col gap-1">
        {UNIFIED_INTERFACE_THEMES.map((preset) => {
          const isSelected = cardStyle === preset.id;
          const shortName = isEn
            ? THEME_FOUR_WORD_NAMES[preset.id]?.en || t(preset.name)
            : THEME_FOUR_WORD_NAMES[preset.id]?.vi || preset.name;
          const itemColor = isSelected
            ? 'var(--text-link, var(--color-primary))'
            : 'var(--text-primary)';

          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                SoundEngine.playGlassChime();
                setCardStyle(preset.id);
                setIsThemeMenuOpen(false);
                onShowNotification(
                  isEn
                    ? `✓ Saved & applied: ${shortName}`
                    : `✓ Đã lưu & áp dụng: ${shortName}`
                );
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[12px] border transition-colors cursor-pointer text-left min-w-0 ${
                isSelected ? 'shadow-xs' : 'theme-dropdown-option border-transparent'
              }`}
              style={{
                background: isSelected ? 'var(--bg-subcard)' : undefined,
                borderColor: isSelected ? 'var(--color-primary)' : 'transparent',
                color: itemColor,
              }}
            >
              <WebIcon
                name={preset.icon || 'layers'}
                className="w-4 h-4 shrink-0"
                style={{ color: itemColor, strokeWidth: 2.75 }}
              />
              <span
                className="typo-body-sm font-bold truncate min-w-0 flex-1"
                style={{ color: itemColor, fontWeight: 700 }}
              >
                {shortName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const footerElement = (
    <footer
      id="app-footer"
      data-layer-level="1"
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
        borderRadius: 'var(--radius-footer, 24px 24px 0 0)',
      }}
      className="mx-auto h-full min-h-0 py-0.5 flex flex-nowrap items-center justify-between px-2 sm:px-4 z-50 relative flex-shrink-0 border-b-0 border-x border-t mb-0 overflow-visible pointer-events-auto"
    >
      <div
        className={`w-full h-full flex flex-nowrap items-center justify-between gap-2 md:gap-0 ${
          isCompactMobile
            ? 'overflow-x-auto overflow-y-hidden horizontal-scroll-smooth'
            : 'overflow-visible'
        }`}
      >
      {/* Area 1: Weather Widget */}
      <div
        id="el-p0-div-109"
        className="w-auto md:max-w-[calc(50%-92px)] h-full flex items-center justify-start gap-1.5 min-w-0 relative z-10 shrink-0"
        style={{
          paddingRight: '0px',
          paddingBottom: '0px',
          paddingTop: '0px',
        }}
      >
        <WeatherCard onShowNotification={onShowNotification} />
      </div>

      {/* Area 2: Navigation Capsule centered on md+, responsive flow on <md (tạm ẩn trên desktop khi nút bên phải bung ra) */}
      <div
        className={`w-auto h-full relative md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 pointer-events-auto flex items-center justify-center shrink-0 transition-all duration-300 ease-out ${
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
            width: '168px',
            height: '46px',
            minHeight: '46px',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingLeft: '5px',
            paddingRight: '5px',
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
            className={`theme-prev-next-btn min-w-[36px] min-h-[36px] h-full aspect-square rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 transition-all duration-200 border-0 ${
              hideCenterNavCapsule ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <WebIcon name="chevron-left" strokeWidth={2.8} className="w-[17px] h-[17px]" />
          </button>

          {/* Page Number with Active Page Icon */}
          <span className="flex-1 h-full mx-1 flex items-center justify-center gap-1.5 select-none pointer-events-none">
            <WebIcon
              id="footer-page-icon"
              name={TABS_DATA[currentTabIndex]?.icon || 'grid'}
              strokeWidth={2.75}
              className="w-[17px] h-[17px] shrink-0"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            />
            <span
              id="footer-page-counter"
              className="typo-body-sm font-play font-extrabold tracking-wide leading-none tabular-nums whitespace-nowrap"
              style={{
                color: 'var(--text-link, var(--color-primary))',
                fontWeight: 800,
                letterSpacing: '0.03em',
                WebkitTextStroke: '0.28px currentColor',
              }}
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
            className={`theme-prev-next-btn min-w-[36px] min-h-[36px] h-full aspect-square rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 transition-all duration-200 border-0 ${
              hideCenterNavCapsule ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <WebIcon name="chevron-right" strokeWidth={2.8} className="w-[17px] h-[17px]" />
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
        className="w-auto md:max-w-[calc(50%-88px)] h-full flex items-center justify-end overflow-visible md:pl-2 min-w-0 relative z-20 shrink-0"
      >
        <div
          id="el-p0-div-113"
          onMouseLeave={() => setHoveredRightBtn(null)}
          className={`relative flex flex-nowrap items-center justify-end py-0.5 overflow-visible ${
            isCompactMobile ? 'gap-1.5' : ''
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
                    data-active={isLangMenuOpen ? 'true' : 'false'}
                    onFocus={() => setFocusedRightBtn(0)}
                    onClick={(e) => {
                      triggerPillRipple('lang', e);
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
                    className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer transition-colors duration-200 border"
                    style={
                      {
                        '--nav-pill-accent': '#10B981',
                        width: '162px',
                        height: '46px',
                        paddingTop: '9px',
                        paddingBottom: '9px',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        fontWeight: 'normal',
                        borderWidth: '1px',
                      } as React.CSSProperties
                    }
                  >
                    <span className="nav-pill-ripple-layer" aria-hidden="true">
                      {pillRipples['lang'] && (
                        <span
                          key={pillRipples['lang'].id}
                          className="nav-pill-ripple-wave"
                          style={{
                            left: `${pillRipples['lang'].x}px`,
                            top: `${pillRipples['lang'].y}px`,
                          }}
                        />
                      )}
                    </span>
                    <div
                      className="nav-pill-icon-badge relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                      style={{
                        backgroundColor: '#10B981',
                      }}
                    >
                      <WebIcon name="languages" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                    </div>
                    <div className="nav-pill-divider relative z-10 w-[1.5px] h-5 shrink-0 rounded-[999px] transition-colors duration-200" />
                    <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
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

                {/* Popup Danh sách Ngôn Ngữ (Desktop/Tablet >= 768px gắn trực tiếp vào nút) */}
                {!isCompactMobile && isLangMenuOpen && renderLangPopup(false)}
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
                    data-active={currentTabIndex === 15 || isThemeMenuOpen ? 'true' : 'false'}
                    onFocus={() => setFocusedRightBtn(1)}
                    onClick={(e) => {
                      triggerPillRipple('theme', e);
                      setIsLangMenuOpen(false);
                      const now = Date.now();
                      const isRapidSecondClick =
                        e.detail >= 2 || now - themeLastClickTimeRef.current <= 320;
                      if (isRapidSecondClick) {
                        themeDblHandledRef.current = true;
                        themeLastClickTimeRef.current = 0;
                        handleOpenAppearancePage();
                        return;
                      }
                      themeDblHandledRef.current = false;
                      themeLastClickTimeRef.current = now;
                      SoundEngine.playTap();
                      setIsThemeMenuOpen((prev) => !prev);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (themeDblHandledRef.current) {
                        themeDblHandledRef.current = false;
                        return;
                      }
                      themeLastClickTimeRef.current = 0;
                      handleOpenAppearancePage();
                    }}
                    title={
                      isEn
                        ? `Theme (${t(activeThemeConfig.shortBadge)}) · Click: List · Double-click: Theme page`
                        : `Giao diện (${activeThemeConfig.shortBadge}) · Click 1 lần: Danh sách · Double-click: Mở trang Giao diện`
                    }
                    aria-expanded={isThemeMenuOpen}
                    className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer transition-colors duration-200 border"
                    style={
                      {
                        '--nav-pill-accent': '#6366F1',
                        width: '162px',
                        height: '46px',
                        paddingTop: '9px',
                        paddingBottom: '9px',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        fontWeight: 'normal',
                        borderWidth: '1px',
                      } as React.CSSProperties
                    }
                  >
                    <span className="nav-pill-ripple-layer" aria-hidden="true">
                      {pillRipples['theme'] && (
                        <span
                          key={pillRipples['theme'].id}
                          className="nav-pill-ripple-wave"
                          style={{
                            left: `${pillRipples['theme'].x}px`,
                            top: `${pillRipples['theme'].y}px`,
                          }}
                        />
                      )}
                    </span>
                    <div
                      className="nav-pill-icon-badge relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                      style={{
                        backgroundColor: '#6366F1',
                      }}
                    >
                      <WebIcon name="layers" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                    </div>
                    <div className="nav-pill-divider relative z-10 w-[1.5px] h-5 shrink-0 rounded-[999px] transition-colors duration-200" />
                    <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                      <span
                        style={{ fontWeight: 'bold' }}
                        className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-200"
                      >
                        {isEn ? 'Theme' : 'Giao Diện'}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Popup Menu Giao Diện (Desktop/Tablet >= 768px gắn trực tiếp vào nút) */}
                {!isCompactMobile && isThemeMenuOpen && renderThemePopup(false)}
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
                data-active={currentTabIndex === 14 ? 'true' : 'false'}
                onFocus={() => setFocusedRightBtn(2)}
                onClick={(e) => {
                  triggerPillRipple('wallpaper', e);
                  setIsLangMenuOpen(false);
                  setIsThemeMenuOpen(false);
                  handleWallpaperClick();
                }}
                title={isEn ? 'Wallpaper (Customize)' : 'Hình Nền (Tùy chỉnh)'}
                className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer transition-colors duration-200 border"
                style={
                  {
                    '--nav-pill-accent': '#F43F5E',
                    width: '162px',
                    height: '46px',
                    paddingTop: '9px',
                    paddingBottom: '9px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    fontWeight: 'normal',
                    borderWidth: '1px',
                  } as React.CSSProperties
                }
              >
                <span className="nav-pill-ripple-layer" aria-hidden="true">
                  {pillRipples['wallpaper'] && (
                    <span
                      key={pillRipples['wallpaper'].id}
                      className="nav-pill-ripple-wave"
                      style={{
                        left: `${pillRipples['wallpaper'].x}px`,
                        top: `${pillRipples['wallpaper'].y}px`,
                      }}
                    />
                  )}
                </span>
                <div
                  className="nav-pill-icon-badge relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                  style={{
                    backgroundColor: '#F43F5E',
                  }}
                >
                  <WebIcon name="image" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                </div>
                <div className="nav-pill-divider relative z-10 w-[1.5px] h-5 shrink-0 rounded-[999px] transition-colors duration-200" />
                <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
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
                data-active={currentTabIndex === 13 ? 'true' : 'false'}
                aria-label={isEn ? 'Open AI Tri Nhan (24/7 Support)' : 'Mở AI Trí Nhân (Hỗ trợ 24/7)'}
                onFocus={() => setFocusedRightBtn(3)}
                onClick={(e) => {
                  triggerPillRipple('ai', e);
                  SoundEngine.playTap();
                  setIsLangMenuOpen(false);
                  setIsThemeMenuOpen(false);
                  onOpenAiAssistant();
                }}
                title={isEn ? 'AI Tri Nhan (24/7 Support)' : 'AI Trí Nhân (Hỗ trợ 24/7)'}
                className="nav-pill relative z-10 inline-flex items-center rounded-[999px] gap-[8px] cursor-pointer transition-colors duration-200 border"
                style={
                  {
                    '--nav-pill-accent': '#0EA5E9',
                    width: '162px',
                    height: '46px',
                    paddingTop: '9px',
                    paddingBottom: '9px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    fontWeight: 'normal',
                    borderWidth: '1px',
                  } as React.CSSProperties
                }
              >
                <span className="nav-pill-ripple-layer" aria-hidden="true">
                  {pillRipples['ai'] && (
                    <span
                      key={pillRipples['ai'].id}
                      className="nav-pill-ripple-wave"
                      style={{
                        left: `${pillRipples['ai'].x}px`,
                        top: `${pillRipples['ai'].y}px`,
                      }}
                    />
                  )}
                </span>
                <div
                  className="nav-pill-icon-badge relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30 transition-colors duration-200"
                  style={{
                    backgroundColor: '#0EA5E9',
                  }}
                >
                  {aiAvatarError ? (
                    <WebIcon name="bot" className="nav-pill-icon-svg w-4 h-4 text-white shrink-0" />
                  ) : (
                    <img
                      src="https://lh3.googleusercontent.com/d/1gY_ln5UNMGbqeLu5Sh6AQF-7Ymu7tIxJ"
                      alt={isEn ? 'AI Tri Nhan' : 'AI Trí Nhân'}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setAiAvatarError(true)}
                    />
                  )}
                </div>
                <div className="nav-pill-divider relative z-10 w-[1.5px] h-5 shrink-0 rounded-[999px] transition-colors duration-200" />
                <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                  <span
                    style={{ fontWeight: 'bold' }}
                    className="nav-pill-title typo-nav leading-tight font-play tracking-tight truncate transition-colors duration-200"
                  >
                    {isEn ? 'AI Tri Nhan' : 'AI Trí Nhân'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile/Compact Popups (< 768px): gắn trực tiếp vào #app-footer để không bị cắt bởi thanh cuộn ngang */}
      {isCompactMobile && isLangMenuOpen && renderLangPopup(true)}
      {isCompactMobile && isThemeMenuOpen && renderThemePopup(true)}

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
            className="theme-modal-card rounded-[var(--radius-modal,24px)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="theme-modal-header px-6 py-4 flex items-center justify-between gap-3">
              <div className="card-header-sync flex items-center gap-2.5 min-w-0">
                <WebIcon
                  name="file-text"
                  className="w-5 h-5 shrink-0"
                  style={{ color: 'var(--accent-blue, #2563EB)' }}
                />
                <h3
                  className="typo-popup-title card-title-synced truncate"
                  data-card-title="true"
                  style={{ color: 'var(--accent-blue, #2563EB)' }}
                >
                  {isEn ? 'Download CV Resume — Nguyễn Hùng Thái' : 'Tải Hồ Sơ CV — Nguyễn Hùng Thái'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(false)}
                aria-label={isEn ? 'Close' : 'Đóng'}
                className="theme-modal-close w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer shrink-0"
              >
                <WebIcon name="x" className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-left">
              <p className="typo-caption opacity-85" style={{ color: 'var(--text-secondary)' }}>
                {isEn
                  ? 'PDF Format / Customer Service Operations & Digital Transformation Expert'
                  : 'Định dạng PDF / Chuyên gia Vận hành CSKH & Chuyển đổi số'}
              </p>
              <div className="theme-modal-subcard p-4 rounded-[var(--radius-subcard,16px)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full typo-badge font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    {isEn ? 'Official 2026 Edition' : 'Bản chính thức 2026'}
                  </span>
                  <h4 className="typo-h4 font-bold flex items-center gap-2">
                    <WebIcon name="award" className="w-4 h-4 shrink-0 text-blue-600 dark:text-sky-400" />
                    <span>{isEn ? 'Capability Profile & Work Experience' : 'Hồ Sơ Năng Lực & Kinh Nghiệm Công Tác'}</span>
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
                  className="px-5 py-2.5 rounded-full hover:opacity-90 text-white font-bold typo-button shadow-md inline-flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <WebIcon name="file-text" className="w-4 h-4 text-white" />
                  <span>{isEn ? 'Download PDF' : 'Tải Xuống PDF'}</span>
                </a>
              </div>

              {/* Overview content preview inside modal */}
              <div className="theme-modal-subcard rounded-[var(--radius-subcard,16px)] p-4 space-y-3">
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
