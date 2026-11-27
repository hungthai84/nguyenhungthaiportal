import React, { useState, useRef, useEffect } from 'react';
import { TABS_DATA } from '../../data/tabs';
import { WeatherWidget } from '../common/WeatherWidget';
import { WebIcon } from '../ui/WebIcon';
import { useTheme, getCardStyleProperties } from '@/hooks/useTheme';
import { CARD_STYLE_GROUPS, THEME_FOUR_WORD_NAMES, getCardStyleConfig } from '@/config/ui/cardStyles';
import { useLanguage, LanguagePreference } from '@/context/LanguageContext';
import { SoundEngine } from '@/components/ui/SoundEngine';

const UNIFORM_RIGHT_PILL_WIDTH = 176;

const FAMILY_SWATCHES: Record<string, string[]> = {
  'liquid-glass': ['#6D28D9', '#4F46E5', '#0891B2'],
  'cowhide-leather': ['#8B5A2B', '#2B221E', '#E5B87E'],
  'walnut-wood': ['#F5C478', '#4E2F1B', '#2A190F'],
  'deep-ocean': ['#1951FC', '#38BDF8', '#0A1128'],
  'neumorphism-beyond': ['#4973FF', '#EE6AD2', '#2AD8E6'],
  'frost-ice-neu': ['#5B57E8', '#E0E8F2', '#94A3B8'],
  'flat-soft-ui': ['#4F46E5', '#3B82F6', '#2DD4BF'],
  'mica-fluent': ['#E84118', '#1C0708', '#525A65'],
  'gradient-dopamine': ['#FF2E93', '#7C3AED', '#00D2FF'],
  'iridescent-liquid-glass': ['#06B6D4', '#FB923C', '#8B5CF6', '#EC4899'],
};

interface FooterProps {
  currentTabIndex: number;
  onNavigate: (direction: number) => void;
  onSelectTab: (index: number) => void;
  onShowNotification: (msg: string) => void;
  onOpenAiAssistant: () => void;
  onOpenWallpaper?: () => void;
}

const FooterComponent: React.FC<FooterProps> = ({
  currentTabIndex,
  onNavigate,
  onSelectTab: _onSelectTab,
  onShowNotification,
  onOpenAiAssistant,
  onOpenWallpaper,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [hoveredRightBtn, setHoveredRightBtn] = useState<number | null>(null);
  const [focusedRightBtn, setFocusedRightBtn] = useState<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const themePopupRef = useRef<HTMLDivElement>(null);
  const langPopupRef = useRef<HTMLDivElement>(null);
  const rightPillBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const themeLastClickTimeRef = useRef<number>(0);
  const themeDblHandledRef = useRef<boolean>(false);

  useEffect(() => {
    setIsThemeMenuOpen(false);
    setIsLangMenuOpen(false);
    setHoveredRightBtn(null);
    setFocusedRightBtn(null);
  }, [currentTabIndex]);

  useEffect(() => {
    if (!isThemeMenuOpen && !isLangMenuOpen) return;
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
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isThemeMenuOpen, isLangMenuOpen]);

  const { language, browserLocale, setLanguageMode, t } = useLanguage();
  const isEn = language === 'en';

  const handleSelectLanguageMode = (mode: LanguagePreference) => {
    SoundEngine.playGlassChime();
    setLanguageMode(mode);
    setIsLangMenuOpen(false);
    setHoveredRightBtn(null);
    setFocusedRightBtn(null);
    rightPillBtnRefs.current[0]?.blur();
    if (mode === 'vi') {
      onShowNotification('✓ Đã chuyển ngôn ngữ sang Tiếng Việt');
    } else {
      onShowNotification('✓ Switched display language to English');
    }
  };

  const handleWallpaperClick = () => {
    setIsLangMenuOpen(false);
    setIsThemeMenuOpen(false);
    setHoveredRightBtn(null);
    setFocusedRightBtn(null);
    rightPillBtnRefs.current[2]?.blur();
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
    setHoveredRightBtn(null);
    setFocusedRightBtn(null);
    rightPillBtnRefs.current[1]?.blur();
    _onSelectTab(15);
    onShowNotification(
      isEn ? '✓ Navigated to Interface Configuration' : '✓ Chuyển đến trang Cấu hình Giao diện'
    );
  };

  const { cardStyle, setCardStyle, isDark } = useTheme();
  const isWalnutTheme = cardStyle === 'walnut-wood';
  const isLeatherTheme = cardStyle === 'cowhide-leather';
  const isOceanTheme = cardStyle === 'deep-ocean';
  const leatherGoldAccent = isDark ? '#E5B87E' : '#D97706';
  const leatherTitleColor = isDark ? '#FFF8EE' : '#FDE68A';
  const walnutGoldAccent = '#F5C478';
  const walnutTitleColor = '#FFFBF4';
  const rightPillAccent = isWalnutTheme
    ? walnutGoldAccent
    : isLeatherTheme
      ? leatherGoldAccent
      : isOceanTheme
        ? '#38BDF8'
        : 'var(--nav-pill-accent, var(--color-primary))';
  const rightPillTitleColor = isWalnutTheme
    ? walnutGoldAccent
    : isLeatherTheme
      ? leatherTitleColor
      : isOceanTheme
        ? '#38BDF8'
        : isDark
          ? 'var(--text-heading, #E2E8F0)'
          : 'var(--text-heading, var(--color-primary))';
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
  } = footerCardStyle as unknown as Record<string, unknown>;
  const activeThemeConfig = getCardStyleConfig(cardStyle);

  // Theo dõi chiều rộng viewport tối ưu bằng requestAnimationFrame (không gây layout thrashing khi đổi trang)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let rafId: number | null = null;
    const handleResize = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const w = window.innerWidth;
        setViewportWidth((prev) => (prev !== w ? w : prev));
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isCompactMobile = viewportWidth < 768;
  const isSmallMobile = viewportWidth < 640;
  const pillWidthPx = isSmallMobile ? 32 : UNIFORM_RIGHT_PILL_WIDTH;
  const openUtilityIndex = isLangMenuOpen ? 0 : isThemeMenuOpen ? 1 : null;
  const activeRightIndex =
    hoveredRightBtn !== null
      ? hoveredRightBtn
      : focusedRightBtn !== null
        ? focusedRightBtn
        : openUtilityIndex;
  // Chỉ tạm ẩn thanh trang ở giữa trên tablet/desktop hẹp (768px–1199px) khi cụm nút phải bung ra; desktop rộng >= 1200px luôn giữ hiển thị
  const hideCenterNavCapsule =
    !isCompactMobile &&
    viewportWidth < 1200 &&
    (hoveredRightBtn !== null || focusedRightBtn !== null || openUtilityIndex !== null);

  const exposedRightWidth = viewportWidth < 768 ? 40 : viewportWidth < 1024 ? 36 : 46;
  const overlapRightPx = Math.max(0, pillWidthPx - exposedRightWidth);

  const handleRightBtnPointerEnter = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    setHoveredRightBtn(index);
    if (index === 0) SoundEngine.playPageSpecificSound(12);
    else if (index === 1) SoundEngine.playPageSpecificSound(15);
    else if (index === 2) SoundEngine.playPageSpecificSound(15);
    else if (index === 3) SoundEngine.playPageSpecificSound(14);
    else if (index === 4) SoundEngine.playPageSpecificSound(13);
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
      role="listbox"
      aria-label={isEn ? 'Select Language' : 'Chọn ngôn ngữ'}
      ref={langPopupRef}
      style={{
        background: 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 99%, var(--app-bg-base, var(--color-bg, #ffffff)))',
        backdropFilter: 'blur(24px) saturate(165%)',
        WebkitBackdropFilter: 'blur(24px) saturate(165%)',
      }}
      className={`theme-popup absolute bottom-[calc(100%+10px)] ${
        mobilePlacement
          ? 'left-1/2 -translate-x-1/2 right-auto w-[min(288px,calc(100vw-24px))]'
          : 'left-auto right-0 w-72'
      } rounded-[var(--radius-popup,20px)] p-2.5 z-[9999] flex flex-col gap-1.5 font-play text-left pointer-events-auto`}
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
        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-subcard,16px)] typo-body-sm font-bold cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="typo-body-lg leading-none shrink-0">🇻🇳</span>
          <span className="truncate whitespace-nowrap min-w-0 flex-1">Tiếng Việt</span>
        </div>
        {language === 'vi' && <span className="shrink-0 font-bold ml-2">✓</span>}
      </button>

      <button
        type="button"
        data-selected={language === 'en' ? 'true' : undefined}
        onClick={() => handleSelectLanguageMode('en')}
        data-no-translate="true"
        className="theme-dropdown-option w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-subcard,16px)] typo-body-sm font-bold cursor-pointer text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="typo-body-lg leading-none shrink-0">🇬🇧</span>
          <span className="truncate whitespace-nowrap min-w-0 flex-1">English</span>
        </div>
        {language === 'en' && <span className="shrink-0 font-bold ml-2">✓</span>}
      </button>
    </div>
  );

  const renderThemePopup = (mobilePlacement: boolean) => {
    const applyThemeFromPopup = (mode: typeof cardStyle) => {
      const targetName = isEn
        ? THEME_FOUR_WORD_NAMES[mode]?.en || t(getCardStyleConfig(mode).name)
        : THEME_FOUR_WORD_NAMES[mode]?.vi || getCardStyleConfig(mode).name;
      SoundEngine.playGlassChime();
      setCardStyle(mode);
      setIsThemeMenuOpen(false);
      setHoveredRightBtn(null);
      setFocusedRightBtn(null);
      rightPillBtnRefs.current[1]?.blur();
      onShowNotification(
        isEn
          ? `✓ Saved & applied: ${targetName}`
          : `✓ Đã lưu & áp dụng: ${targetName}`
      );
    };

    return (
      <div
        id="footer-theme-popup"
        role="listbox"
        aria-label={isEn ? 'Select Theme' : 'Chọn giao diện'}
        ref={themePopupRef}
        style={{
          background: 'color-mix(in srgb, var(--bg-popup, var(--bg-card, #ffffff)) 99%, var(--app-bg-base, var(--color-bg, #ffffff)))',
          borderColor: 'var(--surface-primary-border, var(--border-card, var(--border-color)))',
          boxShadow: 'var(--surface-primary-shadow, var(--shadow-card))',
          backdropFilter: 'blur(24px) saturate(165%)',
          WebkitBackdropFilter: 'blur(24px) saturate(165%)',
        }}
        className={`theme-popup absolute bottom-[calc(100%+10px)] ${
          mobilePlacement
            ? 'left-1/2 -translate-x-1/2 right-auto w-[min(348px,calc(100vw-24px))] max-w-[calc(100vw-24px)]'
            : 'left-auto right-0 w-[348px] max-w-[calc(100vw-32px)]'
        } rounded-[var(--radius-popup,16px)] border p-2 z-[9999] flex flex-col gap-1 font-play text-left pointer-events-auto`}
      >
        <div className="max-h-[min(70vh,460px)] overflow-y-auto no-scrollbar flex flex-col gap-1">
          {CARD_STYLE_GROUPS.map((group) => {
            const lightMode = group.lightMode || group.defaultMode || group.presets[0]?.id;
            const darkMode = group.darkMode;
            const hasDualModes = Boolean(lightMode && darkMode && darkMode !== lightMode);
            const isLightActive = Boolean(lightMode && cardStyle === lightMode);
            const isDarkActive = Boolean(hasDualModes && darkMode && cardStyle === darkMode);
            const isGroupActive = isLightActive || isDarkActive;
            const groupTitle = isEn ? group.labelEn : group.label;
            const itemColor = isGroupActive
              ? 'var(--text-link, var(--color-primary))'
              : 'var(--text-primary)';
            const swatches = FAMILY_SWATCHES[group.id] || [];

            return (
              <div
                key={group.id}
                data-selected={isGroupActive ? 'true' : undefined}
                className="footer-theme-group-row w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[12px] border border-transparent bg-transparent shadow-none min-w-0"
                style={{
                  background: 'transparent',
                  borderColor: 'transparent',
                  boxShadow: 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    const preferred = hasDualModes && isDark && darkMode ? darkMode : lightMode;
                    if (preferred) applyThemeFromPopup(preferred);
                  }}
                  className="footer-theme-group-title-btn flex items-center gap-2 min-w-0 flex-1 text-left cursor-pointer py-0.5 bg-transparent border-0 shadow-none"
                  style={{
                    color: itemColor,
                    background: 'transparent',
                    borderColor: 'transparent',
                    boxShadow: 'none',
                  }}
                >
                  <WebIcon
                    name={group.icon || 'layers'}
                    className="w-4 h-4 shrink-0 bg-transparent border-0 shadow-none"
                    style={{ color: itemColor, strokeWidth: 2.5, background: 'transparent' }}
                  />
                  <div className="flex flex-col min-w-0 flex-1 bg-transparent">
                    <span
                      className="typo-body-sm font-bold truncate min-w-0 bg-transparent"
                      style={{ color: itemColor, fontWeight: 700, background: 'transparent' }}
                    >
                      {groupTitle}
                    </span>
                    {swatches.length > 0 && (
                      <span className="inline-flex items-center gap-1 mt-0.5" aria-hidden="true">
                        {swatches.map((hex) => (
                          <span
                            key={hex}
                            className="w-2.5 h-2.5 rounded-full border border-white/50 shadow-2xs shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                </button>

                <div
                  role="group"
                  aria-label={`${groupTitle} ${isEn ? 'Theme Mode' : 'Chế độ giao diện'}`}
                  className="inline-flex items-center gap-0.5 p-0.5 rounded-full border shrink-0"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subcard)',
                  }}
                >
                  {lightMode && (
                    <button
                      type="button"
                      aria-pressed={isLightActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyThemeFromPopup(lightMode);
                      }}
                      title={
                        isEn
                          ? THEME_FOUR_WORD_NAMES[lightMode]?.en
                          : THEME_FOUR_WORD_NAMES[lightMode]?.vi
                      }
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-bold cursor-pointer whitespace-nowrap ${
                        isLightActive ? '' : 'opacity-75'
                      }`}
                      style={
                        isLightActive
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }
                          : { color: 'var(--text-secondary)' }
                      }
                    >
                      <WebIcon name="sun" className="w-3 h-3 shrink-0" />
                      <span>{isEn ? 'Light' : 'Sáng'}</span>
                    </button>
                  )}

                  {hasDualModes && darkMode && (
                    <button
                      type="button"
                      aria-pressed={isDarkActive}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyThemeFromPopup(darkMode);
                      }}
                      title={
                        isEn
                          ? THEME_FOUR_WORD_NAMES[darkMode]?.en
                          : THEME_FOUR_WORD_NAMES[darkMode]?.vi
                      }
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full typo-badge font-bold cursor-pointer whitespace-nowrap ${
                        isDarkActive ? '' : 'opacity-75'
                      }`}
                      style={
                        isDarkActive
                          ? {
                              background: 'var(--bg-button-primary)',
                              color: 'var(--text-button-primary, #FFFFFF)',
                            }
                          : { color: 'var(--text-secondary)' }
                      }
                    >
                      <WebIcon name="moon" className="w-3 h-3 shrink-0" />
                      <span>{isEn ? 'Dark' : 'Tối'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const footerElement = (
    <footer
      id="app-footer"
      data-element-name="Thanh điều hướng Footer chính"
      data-element-type="card"
      data-element-page="global"
      data-element-parent="website-root"
      style={{
        ...cleanFooterStyle,
        maxWidth: 'var(--main-card-target-w, 1050px)',
        width: '100%',
        height: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        boxSizing: 'border-box',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '0px',
        marginBottom: '0px',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: 'var(--shell-px, clamp(10px, 3vw, 45px))',
        paddingRight: 'var(--shell-px, clamp(10px, 3vw, 45px))',
        borderTopLeftRadius: 'var(--radius-primary-surface, var(--radius-main, 14px))',
        borderTopRightRadius: 'var(--radius-primary-surface, var(--radius-main, 14px))',
        borderBottomLeftRadius: '0px',
        borderBottomRightRadius: '0px',
        borderRadius: 'var(--radius-primary-surface, var(--radius-main, 14px)) var(--radius-primary-surface, var(--radius-main, 14px)) 0 0',
        boxShadow: 'none',
        filter: 'none',
        transform: 'none',
      }}
      className="mx-auto w-full h-full min-h-full flex flex-nowrap items-center justify-between px-2.5 sm:px-6 lg:px-[45px] z-50 relative flex-1 mb-0 overflow-visible pointer-events-auto"
    >
      <div
        className="w-full h-full relative flex flex-nowrap items-center justify-between gap-1 sm:gap-2 md:gap-0 overflow-visible"
      >
      {/* Area 1: Weather Widget */}
      <div
        id="el-p0-div-109"
        className="w-auto md:max-w-[calc(50%-92px)] h-auto flex items-center justify-start gap-2 min-w-0 relative z-10 shrink-0"
        style={{
          paddingRight: '0px',
          paddingBottom: '0px',
          paddingTop: '0px',
        }}
      >
        <WeatherWidget onShowNotification={onShowNotification} />
      </div>

      {/* Area 2: Navigation Capsule centered on md+, responsive flow on <md */}
      <div
        className={`w-auto h-auto relative md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 z-50 flex items-center justify-center shrink-0 transition-opacity duration-200 ease-out ${
          hideCenterNavCapsule
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100 pointer-events-auto'
        }`}
      >
        <div
          id="footer-nav-capsule"
          role="group"
          aria-label={isEn ? 'Page Navigation' : 'Điều hướng trang'}
          data-element-type="button"
          style={{
            borderRadius: '999px',
            width: isSmallMobile ? '100px' : '176px',
            height: isSmallMobile ? '36px' : '48px',
            minHeight: isSmallMobile ? '36px' : '48px',
            paddingTop: isSmallMobile ? '3px' : '4px',
            paddingBottom: isSmallMobile ? '3px' : '4px',
            paddingLeft: isSmallMobile ? '4px' : '6px',
            paddingRight: isSmallMobile ? '4px' : '6px',
          }}
          className="theme-capsule-btn nav-pill relative z-10 flex items-center justify-between text-[var(--text-primary)] border group font-play font-bold"
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
            className={`theme-prev-next-btn ${
              isSmallMobile ? 'min-w-[28px] min-h-[28px]' : 'min-w-[36px] min-h-[36px]'
            } h-full aspect-square rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 border-0 ${
              hideCenterNavCapsule ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <WebIcon name="chevron-left" strokeWidth={2.85} className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
          </button>

          {/* Page Number with Active Page Icon */}
          <span className="flex-1 h-full mx-0.5 sm:mx-1 flex items-center justify-center gap-1 sm:gap-1.5 select-none pointer-events-none">
            <WebIcon
              id="footer-page-icon"
              name={TABS_DATA[currentTabIndex]?.icon || 'grid'}
              strokeWidth={2.85}
              className="hidden sm:inline-block w-[18px] h-[18px] shrink-0"
              style={{ color: rightPillAccent }}
            />
            <span
              id="footer-page-counter"
              className="text-[13px] sm:text-[15px] font-play font-extrabold tracking-wide leading-none tabular-nums whitespace-nowrap"
              style={{
                color: rightPillAccent,
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
            className={`theme-prev-next-btn ${
              isSmallMobile ? 'min-w-[28px] min-h-[28px]' : 'min-w-[32px] min-h-[32px]'
            } h-full aspect-square rounded-[999px] flex items-center justify-center cursor-pointer shrink-0 border-0 ${
              hideCenterNavCapsule ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <WebIcon name="chevron-right" strokeWidth={2.85} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Area 3: Utility Buttons (Ngôn ngữ + Giao diện + Hình Nền + AI Hỗ trợ) */}
      <div
        id="el-p0-div-112"
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse') setHoveredRightBtn(null);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setFocusedRightBtn(null);
          }
        }}
        className="w-auto md:max-w-[calc(50%-88px)] h-auto flex items-center justify-end overflow-visible md:pl-2 min-w-0 relative z-20 shrink-0"
      >
        <div
          id="el-p0-div-113"
          className={`relative flex flex-nowrap items-center justify-end py-0 overflow-visible ${
            isCompactMobile ? 'gap-[3px] sm:gap-1.5' : ''
          }`}
        >
          {/* Button 0: Ngôn Ngữ */}
          <div
            ref={langMenuRef}
            onPointerEnter={(e) => handleRightBtnPointerEnter(0, e)}
            style={getDeckItemStyle(0, isLangMenuOpen)}
            className="relative pointer-events-auto shrink-0 transition-[margin] duration-250 ease-out"
          >
            <div
              className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none w-max h-auto p-0"
              style={{ width: `${pillWidthPx}px` }}
            >
              <button
                ref={(el) => {
                  rightPillBtnRefs.current[0] = el;
                }}
                id="footer-lang-btn"
                type="button"
                data-active={isLangMenuOpen ? 'true' : 'false'}
                aria-haspopup="listbox"
                aria-controls="footer-lang-popup"
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
                className="nav-pill relative z-10 inline-flex items-center justify-center sm:justify-start rounded-[999px] gap-0 sm:gap-[8px] cursor-pointer border"
                style={
                  {
                    '--nav-pill-accent': rightPillAccent,
                    width: `${pillWidthPx}px`,
                    height: isSmallMobile ? '36px' : '50px',
                    minHeight: isSmallMobile ? '36px' : '50px',
                    paddingTop: isSmallMobile ? '1px' : '4px',
                    paddingBottom: isSmallMobile ? '1px' : '4px',
                    paddingLeft: isSmallMobile ? '1px' : '12px',
                    paddingRight: isSmallMobile ? '1px' : '12px',
                    fontWeight: 'normal',
                    borderWidth: '1px',
                  } as React.CSSProperties
                }
              >
                <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                  <WebIcon name="languages" isActive={isLangMenuOpen} isHovered={hoveredRightBtn === 0} className="nav-pill-icon-svg w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] shrink-0" />
                </div>
                {!isSmallMobile && <div className="nav-pill-divider relative z-10 w-[1.5px] h-[22px] shrink-0 rounded-[999px]" />}
                {!isSmallMobile && (
                  <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                    <span
                      data-no-translate="true"
                      style={{
                        fontWeight: 'bold',
                        color:
                          isLangMenuOpen || hoveredRightBtn === 0
                            ? 'var(--pill-active-text, #ffffff)'
                            : rightPillTitleColor,
                      }}
                      className="nav-pill-title text-[15px] font-bold leading-tight font-play tracking-tight truncate"
                    >
                      {activeLangTitle}
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Popup Danh sách Ngôn Ngữ (Desktop/Tablet >= 768px gắn trực tiếp vào nút) */}
            {!isCompactMobile && isLangMenuOpen && renderLangPopup(false)}
          </div>

          {/* Button 1: Giao diện */}
          <div
            ref={themeMenuRef}
            onPointerEnter={(e) => handleRightBtnPointerEnter(1, e)}
            style={getDeckItemStyle(1, isThemeMenuOpen)}
            className="relative pointer-events-auto shrink-0 transition-[margin] duration-250 ease-out"
          >
            <div
              className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none w-max h-auto p-0"
              style={{ width: `${pillWidthPx}px` }}
            >
              <button
                ref={(el) => {
                  rightPillBtnRefs.current[1] = el;
                }}
                id="footer-appearance-btn"
                type="button"
                aria-haspopup="listbox"
                aria-controls="footer-theme-popup"
                    aria-current={currentTabIndex === 15 ? 'page' : undefined}
                    data-active={currentTabIndex === 15 || isThemeMenuOpen ? 'true' : 'false'}
                    onFocus={() => setFocusedRightBtn(1)}
                    onClick={(e) => {
                      setIsLangMenuOpen(false);
                      const now = Date.now();
                      const isRapidSecondClick =
                        e.detail >= 2 || now - themeLastClickTimeRef.current <= 320;
                      if (isRapidSecondClick) {
                        themeDblHandledRef.current = true;
                        themeLastClickTimeRef.current = 0;
                        e.currentTarget.blur();
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
                      e.currentTarget.blur();
                      if (themeDblHandledRef.current) {
                        themeDblHandledRef.current = false;
                        return;
                      }
                      themeLastClickTimeRef.current = 0;
                      handleOpenAppearancePage();
                    }}
                    title={
                      isEn
                        ? `Theme (${THEME_FOUR_WORD_NAMES[cardStyle]?.en || t(activeThemeConfig.shortBadge)}) · Click: List · Double-click: Theme page`
                        : `Giao diện (${THEME_FOUR_WORD_NAMES[cardStyle]?.vi || activeThemeConfig.shortBadge}) · Nhấn 1 lần: Danh sách · Nhấn đúp: Mở trang Giao diện`
                    }
                    aria-expanded={isThemeMenuOpen}
                    className="nav-pill relative z-10 inline-flex items-center justify-center sm:justify-start rounded-[999px] gap-0 sm:gap-[8px] cursor-pointer border"
                    style={
                      {
                        '--nav-pill-accent': rightPillAccent,
                        width: `${pillWidthPx}px`,
                        height: isSmallMobile ? '36px' : '50px',
                        minHeight: isSmallMobile ? '36px' : '50px',
                        paddingTop: isSmallMobile ? '1px' : '4px',
                        paddingBottom: isSmallMobile ? '1px' : '4px',
                        paddingLeft: isSmallMobile ? '1px' : '12px',
                        paddingRight: isSmallMobile ? '1px' : '12px',
                        fontWeight: 'normal',
                        borderWidth: '1px',
                      } as React.CSSProperties
                    }
                  >
                    <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                      <WebIcon name="layers" isActive={currentTabIndex === 15 || isThemeMenuOpen} isHovered={hoveredRightBtn === 1} className="nav-pill-icon-svg w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] shrink-0" />
                    </div>
                    {!isSmallMobile && <div className="nav-pill-divider relative z-10 w-[1.5px] h-[22px] shrink-0 rounded-[999px]" />}
                    {!isSmallMobile && (
                      <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                        <span
                          style={{
                            fontWeight: 'bold',
                            color:
                              currentTabIndex === 15 || isThemeMenuOpen || hoveredRightBtn === 1
                                ? 'var(--pill-active-text, #ffffff)'
                                : rightPillTitleColor,
                          }}
                          className="nav-pill-title text-[15px] font-bold leading-tight font-play tracking-tight truncate"
                        >
                          {isEn ? 'Theme' : 'Giao Diện'}
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Popup Menu Giao Diện (Desktop/Tablet >= 768px gắn trực tiếp vào nút) */}
                {!isCompactMobile && isThemeMenuOpen && renderThemePopup(false)}
              </div>

          {/* Button 2: Hình Nền */}
          <div
            onPointerEnter={(e) => handleRightBtnPointerEnter(2, e)}
            style={getDeckItemStyle(2)}
            className="relative pointer-events-auto shrink-0 transition-[margin] duration-250 ease-out"
          >
            <div
              className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none w-max h-auto p-0"
              style={{ width: `${pillWidthPx}px` }}
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
                  e.currentTarget.blur();
                  handleWallpaperClick();
                }}
                title={isEn ? 'Wallpaper (Customize)' : 'Hình Nền (Tùy chỉnh)'}
                className="nav-pill relative z-10 inline-flex items-center justify-center sm:justify-start rounded-[999px] gap-0 sm:gap-[8px] cursor-pointer border"
                style={
                  {
                    '--nav-pill-accent': rightPillAccent,
                    width: `${pillWidthPx}px`,
                    height: isSmallMobile ? '36px' : '50px',
                    minHeight: isSmallMobile ? '36px' : '50px',
                    paddingTop: isSmallMobile ? '1px' : '4px',
                    paddingBottom: isSmallMobile ? '1px' : '4px',
                    paddingLeft: isSmallMobile ? '1px' : '12px',
                    paddingRight: isSmallMobile ? '1px' : '12px',
                    fontWeight: 'normal',
                    borderWidth: '1px',
                  } as React.CSSProperties
                }
              >
                <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                  <WebIcon name="image" isActive={currentTabIndex === 14} isHovered={hoveredRightBtn === 2} className="nav-pill-icon-svg w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] shrink-0" />
                </div>
                {!isSmallMobile && <div className="nav-pill-divider relative z-10 w-[1.5px] h-[22px] shrink-0 rounded-[999px]" />}
                {!isSmallMobile && (
                  <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                    <span
                      style={{
                        fontWeight: 'bold',
                        color:
                          currentTabIndex === 14 || hoveredRightBtn === 2
                            ? 'var(--pill-active-text, #ffffff)'
                            : rightPillTitleColor,
                      }}
                      className="nav-pill-title text-[15px] font-bold leading-tight font-play tracking-tight truncate"
                    >
                      {isEn ? 'Wallpaper' : 'Hình Nền'}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Button 3: AI Hỗ trợ */}
          <div
            onPointerEnter={(e) => handleRightBtnPointerEnter(3, e)}
            style={getDeckItemStyle(3)}
            className="relative pointer-events-auto shrink-0 transition-[margin] duration-250 ease-out"
          >
            <div
              className="nav-pill-wrapper group/menu-btn relative inline-flex items-center justify-between rounded-[999px] select-none w-max h-auto p-0"
              style={{ width: `${pillWidthPx}px` }}
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
                  SoundEngine.playTap();
                  setIsLangMenuOpen(false);
                  setIsThemeMenuOpen(false);
                  setHoveredRightBtn(null);
                  setFocusedRightBtn(null);
                  e.currentTarget.blur();
                  onOpenAiAssistant();
                }}
                title={isEn ? 'AI Tri Nhan (24/7 Support)' : 'AI Trí Nhân (Hỗ trợ 24/7)'}
                className="nav-pill relative z-10 inline-flex items-center justify-center sm:justify-start rounded-[999px] gap-0 sm:gap-[8px] cursor-pointer border"
                style={
                  {
                    '--nav-pill-accent': rightPillAccent,
                    width: `${pillWidthPx}px`,
                    height: isSmallMobile ? '36px' : '50px',
                    minHeight: isSmallMobile ? '36px' : '50px',
                    paddingTop: isSmallMobile ? '1px' : '4px',
                    paddingBottom: isSmallMobile ? '1px' : '4px',
                    paddingLeft: isSmallMobile ? '1px' : '12px',
                    paddingRight: isSmallMobile ? '1px' : '12px',
                    fontWeight: 'normal',
                    borderWidth: '1px',
                  } as React.CSSProperties
                }
              >
                <div className="nav-pill-icon-badge relative z-10 w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] rounded-full flex items-center justify-center shrink-0 leading-none p-0 overflow-hidden ring-1 ring-white/30">
                  <WebIcon name="bot" isActive={currentTabIndex === 13} isHovered={hoveredRightBtn === 3} className="nav-pill-icon-svg w-[17px] h-[17px] sm:w-[19px] sm:h-[19px] shrink-0" />
                </div>
                {!isSmallMobile && <div className="nav-pill-divider relative z-10 w-[1.5px] h-[22px] shrink-0 rounded-[999px]" />}
                {!isSmallMobile && (
                  <div className="relative z-10 flex flex-col text-left justify-center min-w-0 flex-1 h-full">
                    <span
                      style={{
                        fontWeight: 'bold',
                        color:
                          currentTabIndex === 13 || hoveredRightBtn === 3
                            ? 'var(--pill-active-text, #ffffff)'
                            : rightPillTitleColor,
                      }}
                      className="nav-pill-title text-[15px] font-bold leading-tight font-play tracking-tight truncate"
                    >
                      {isEn ? 'AI Tri Nhan' : 'AI Trí Nhân'}
                    </span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile/Compact Popups (< 768px): gắn trực tiếp vào #app-footer để không bị cắt bởi thanh cuộn ngang */}
      {isCompactMobile && isLangMenuOpen && renderLangPopup(true)}
      {isCompactMobile && isThemeMenuOpen && renderThemePopup(true)}
    </footer>
  );

  return footerElement;
};

export const Footer = React.memo(FooterComponent);

