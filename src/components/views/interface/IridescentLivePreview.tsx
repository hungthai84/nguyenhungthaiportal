import React, { useMemo, useState } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  ThemeStudioConfig,
  hexToRgba,
  resolveWallpaperCss,
} from '@/config/ui/iridescentConfig';

export interface IridescentLivePreviewProps {
  config: ThemeStudioConfig;
  isEn?: boolean;
  onSwitchPreviewMode: (mode: 'light' | 'dark') => void;
  onResetPreview: () => void;
  onApplyTheme: () => void;
}

const SAMPLE_SEARCH_SUGGESTIONS = [
  'Iridescent Liquid Glass',
  'Chrome Rainbow Border',
  'Aurora Wallpaper Gradient',
  '3D Specular Glass Card',
  'Soft Glass Sound Theme',
];

export const IridescentLivePreview: React.FC<IridescentLivePreviewProps> = ({
  config,
  isEn = false,
  onSwitchPreviewMode,
  onResetPreview,
  onApplyTheme,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isToggled, setIsToggled] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'glass' | 'motion'>('overview');
  const [activeNav, setActiveNav] = useState<'home' | 'studio' | 'layers'>('studio');
  const [activeIconSet, setActiveIconSet] = useState<Record<string, boolean>>({
    sparkles: true,
    heart: false,
    bell: true,
  });
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [toastState, setToastState] = useState<{
    visible: boolean;
    kind: 'success' | 'warning' | 'error';
    message: string;
  }>({
    visible: true,
    kind: 'success',
    message: isEn
      ? 'Iridescent refraction synced across all tokens.'
      : 'Đã đồng bộ khúc xạ kính lỏng toàn hệ thống.',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tilt, setTilt] = useState<{ rx: number; ry: number; sx: number; sy: number }>({
    rx: 0,
    ry: 0,
    sx: 50,
    sy: 50,
  });
  const [rippleKey, setRippleKey] = useState(0);

  const isDark = config.mode === 'dark';
  const wallpaperBg = useMemo(() => resolveWallpaperCss(config), [config]);

  const cardAlpha = Math.max(
    0.2,
    Math.min(
      0.96,
      (config.cardBg.backgroundOpacity * (100 - config.cardBg.cardTransparency * 0.35)) / 10000
    )
  );
  const borderAlpha = Math.max(0.1, Math.min(1, config.cardBg.borderOpacity / 100));
  const glowAlpha = Math.max(0.08, Math.min(0.85, config.cardEffects.glowIntensity / 100));
  const shadowSpread = Math.round(12 + config.cardEffects.shadowDepth * 0.36);
  const shadowY = Math.round(6 + config.cardEffects.shadowDepth * 0.18);
  const shadowAlpha = (isDark ? 0.36 : 0.12) + (config.cardEffects.shadowDepth / 100) * 0.2;
  const durationMs =
    config.motion.level === 'off'
      ? 0
      : Math.round(
          config.motion.animationDuration /
            Math.max(0.4, Math.min(2.4, config.motion.animationSpeed / 100))
        );

  const glassCardStyle: React.CSSProperties = {
    background: hexToRgba(config.cardBg.backgroundColor, cardAlpha),
    backdropFilter: `blur(${config.cardBg.backdropBlur}px) saturate(${config.cardBg.saturation}%)`,
    WebkitBackdropFilter: `blur(${config.cardBg.backdropBlur}px) saturate(${config.cardBg.saturation}%)`,
    borderRadius: `${config.cardBg.borderRadius}px`,
    border: `${config.cardBg.borderWidth}px solid ${
      config.cardEffects.iridescentBorder
        ? hexToRgba(config.primary.primaryColor, Math.min(0.75, borderAlpha))
        : hexToRgba(config.cardBg.borderColor, borderAlpha)
    }`,
    boxShadow: [
      config.cardEffects.softShadow
        ? `0 ${shadowY}px ${shadowSpread}px rgba(15, 23, 42, ${shadowAlpha.toFixed(2)})`
        : '',
      config.cardEffects.outerGlow
        ? `0 0 ${Math.round(10 + config.cardEffects.glowIntensity * 0.28)}px ${hexToRgba(
            config.primary.glowColor,
            glowAlpha * 0.45
          )}`
        : '',
      config.cardEffects.innerGlow
        ? `inset 0 1px 0 rgba(255, 255, 255, ${(config.cardBg.innerHighlight / 100).toFixed(2)})`
        : '',
    ]
      .filter(Boolean)
      .join(', '),
    transition: `all ${durationMs}ms ${config.motion.easing}`,
    color: config.colors.textPrimary,
  };

  const primaryBtnStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${config.primary.gradientStart} 0%, ${config.primary.primaryColor} 48%, ${config.primary.accentColor} 100%)`,
    color: '#FFFFFF',
    boxShadow: config.interaction.buttonHoverGlow
      ? `0 10px 24px -6px ${hexToRgba(config.primary.glowColor, 0.52)}, inset 0 1.5px 0 rgba(255,255,255,0.68)`
      : 'inset 0 1px 0 rgba(255,255,255,0.5)',
    transition: `all ${durationMs}ms ${config.motion.easing}`,
  };

  const filteredSuggestions = SAMPLE_SEARCH_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const playPreviewSound = (
    evt:
      | 'buttonClick'
      | 'buttonHover'
      | 'toggleOn'
      | 'toggleOff'
      | 'tabChange'
      | 'cardSelect'
      | 'popupOpen'
      | 'popupClose'
      | 'notification'
      | 'success'
      | 'error'
  ) => {
    SoundEngine.configureStudioSound(config.sound);
    SoundEngine.playEvent(evt);
  };

  const handleCardPointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    const rx = config.interaction.cardTilt3D ? ((py - 50) / 50) * -7 : 0;
    const ry = config.interaction.cardTilt3D ? ((px - 50) / 50) * 7 : 0;
    setTilt({ rx, ry, sx: px, sy: py });
  };

  return (
    <div
      className="irid-studio-preview relative flex flex-col rounded-[20px] overflow-hidden border shadow-xl min-w-0"
      style={{
        borderColor: hexToRgba(config.cardBg.borderColor, isDark ? 0.25 : 0.72),
        backgroundColor: config.colors.websiteBg,
        color: config.colors.textPrimary,
      }}
    >
      {/* Preview Toolbar: Light / Dark / Reset / Apply */}
      <div
        className="relative z-20 flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border-b"
        style={{
          background: hexToRgba(config.colors.headerBg, isDark ? 0.86 : 0.88),
          backdropFilter: 'blur(18px)',
          borderColor: hexToRgba(config.colors.borderColor, 0.3),
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              background: `linear-gradient(135deg, ${config.primary.primaryColor}, ${config.primary.accentColor})`,
              boxShadow: `0 0 10px ${config.primary.glowColor}`,
            }}
          />
          <span className="text-[12px] font-bold tracking-tight truncate">
            {isEn ? 'Live Preview (14 Components)' : 'Xem trước trực tiếp (14 thành phần)'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div
            className="inline-flex items-center p-0.5 rounded-full border"
            style={{
              background: isDark ? 'rgba(15, 23, 42, 0.65)' : 'rgba(241, 245, 249, 0.9)',
              borderColor: hexToRgba(config.colors.borderColor, 0.35),
            }}
          >
            <button
              type="button"
              onClick={() => {
                playPreviewSound('tabChange');
                onSwitchPreviewMode('light');
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all border-0"
              style={
                !isDark
                  ? { background: '#FFFFFF', color: '#0F172A', boxShadow: '0 2px 6px rgba(15,23,42,0.12)' }
                  : { background: 'transparent', color: config.colors.textSecondary }
              }
            >
              {isEn ? 'Light' : 'Sáng'}
            </button>
            <button
              type="button"
              onClick={() => {
                playPreviewSound('tabChange');
                onSwitchPreviewMode('dark');
              }}
              className="px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all border-0"
              style={
                isDark
                  ? { background: '#0F172A', color: '#F8FAFC', boxShadow: '0 2px 8px rgba(0,0,0,0.45)' }
                  : { background: 'transparent', color: config.colors.textSecondary }
              }
            >
              {isEn ? 'Dark' : 'Tối'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              playPreviewSound('buttonClick');
              onResetPreview();
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-opacity hover:opacity-85"
            style={{
              background: hexToRgba(config.cardBg.backgroundColor, 0.6),
              borderColor: hexToRgba(config.colors.borderColor, 0.35),
              color: config.colors.textPrimary,
            }}
          >
            <WebIcon name="rotate-ccw" className="w-3 h-3" />
            <span>{isEn ? 'Reset' : 'Đặt lại'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playPreviewSound('success');
              onApplyTheme();
            }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer border-0 transition-transform active:scale-95"
            style={primaryBtnStyle}
          >
            <WebIcon name="check" className="w-3 h-3" />
            <span>{isEn ? 'Apply' : 'Áp dụng'}</span>
          </button>
        </div>
      </div>

      {/* Live Preview Canvas with Wallpaper + Filter + Overlay */}
      <div className="relative flex-1 p-3.5 sm:p-4 flex flex-col gap-3 overflow-hidden">
        {/* Wallpaper Backdrop Layer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: wallpaperBg,
            opacity: config.wallpaper.backgroundOpacity / 100,
            filter: `blur(${config.wallpaper.backgroundBlur}px) brightness(${config.wallpaper.brightness}%) contrast(${config.wallpaper.contrast}%)`,
            backgroundSize: config.wallpaper.backgroundSize,
            backgroundPosition: config.wallpaper.backgroundPosition,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundColor: hexToRgba(
              config.wallpaper.overlayColor,
              config.wallpaper.overlayOpacity / 100
            ),
          }}
        />

        <div className="relative z-10 flex flex-col gap-3 min-w-0">
          {/* 12. Mini Navigation Bar */}
          <nav
            aria-label="Preview Navigation"
            className="flex items-center justify-between gap-2 px-2.5 py-1.5"
            style={{
              ...glassCardStyle,
              borderRadius: '999px',
              background: hexToRgba(
                config.colors.headerBg,
                Math.max(0.35, config.cardBg.targets.navigationCard.opacity / 100)
              ),
            }}
          >
            <div className="flex items-center gap-1 min-w-0">
              {(
                [
                  { id: 'home', icon: 'home', label: isEn ? 'Home' : 'Trang chủ' },
                  { id: 'studio', icon: 'sparkles', label: 'Liquid UI' },
                  { id: 'layers', icon: 'layers', label: isEn ? 'Layers' : 'Lớp kính' },
                ] as const
              ).map((item) => {
                const active = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playPreviewSound('tabChange');
                      setActiveNav(item.id);
                    }}
                    className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer border-0 transition-all"
                    style={
                      active && config.interaction.navActiveIndicator
                        ? {
                            background: config.interaction.navSlidingHighlight
                              ? `linear-gradient(135deg, ${config.primary.primaryColor}, ${config.primary.secondaryColor})`
                              : hexToRgba(config.primary.primaryColor, 0.2),
                            color: config.interaction.navSlidingHighlight ? '#FFFFFF' : config.primary.primaryColor,
                          }
                        : { background: 'transparent', color: config.colors.textSecondary }
                    }
                  >
                    <WebIcon
                      name={item.icon}
                      className={`w-3.5 h-3.5 transition-transform ${
                        active && config.interaction.navIconAnimation ? 'scale-110' : ''
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 14. Tooltip Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsTooltipOpen(true)}
              onMouseLeave={() => setIsTooltipOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsTooltipOpen((prev) => !prev)}
                className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border"
                style={{
                  background: hexToRgba(config.cardBg.backgroundColor, 0.7),
                  borderColor: hexToRgba(config.primary.primaryColor, 0.4),
                  color: config.colors.iconColor,
                }}
                aria-label="Tooltip info"
              >
                <WebIcon name="info" className="w-3.5 h-3.5" />
              </button>
              {isTooltipOpen && (
                <div
                  role="tooltip"
                  className="absolute right-0 top-full mt-1.5 z-40 w-44 px-2.5 py-1.5 text-[11px] font-medium pointer-events-none"
                  style={{
                    ...glassCardStyle,
                    borderRadius: '10px',
                    background: hexToRgba(config.cardBg.backgroundColor, 0.92),
                  }}
                >
                  {isEn
                    ? 'Glossy glass tooltip with adaptive blur & refraction.'
                    : 'Tooltip kính lỏng tự thích ứng độ mờ & khúc xạ.'}
                </div>
              )}
            </div>
          </nav>

          {/* 4. Capsule Search Bar with Live Suggestions */}
          <div className="relative z-20">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-full transition-all"
              style={{
                ...glassCardStyle,
                borderRadius: '999px',
                borderColor:
                  isSearchFocused && config.interaction.inputAnimatedBorder
                    ? config.primary.primaryColor
                    : hexToRgba(config.cardBg.borderColor, borderAlpha),
                boxShadow:
                  isSearchFocused && config.interaction.inputFocusGlow
                    ? `0 0 0 3px ${hexToRgba(config.primary.glowColor, 0.28)}, ${glassCardStyle.boxShadow}`
                    : glassCardStyle.boxShadow,
              }}
            >
              <WebIcon
                name="search"
                className="w-3.5 h-3.5 shrink-0"
                style={{ color: config.colors.iconColor }}
              />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 160)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? 'Search iridescent tokens...' : 'Tìm kiếm hiệu ứng kính lỏng...'}
                className="w-full bg-transparent border-0 outline-none text-[12px]"
                style={{ color: config.colors.textPrimary }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border-0"
                  style={{
                    background: hexToRgba(config.primary.primaryColor, 0.16),
                    color: config.colors.textPrimary,
                  }}
                >
                  <WebIcon name="x" className="w-3 h-3" />
                </button>
              )}
            </div>

            {isSearchFocused && config.interaction.inputSearchSuggestions && filteredSuggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1.5 z-30 p-1.5 flex flex-col gap-0.5"
                style={{
                  ...glassCardStyle,
                  borderRadius: '14px',
                  background: hexToRgba(config.cardBg.backgroundColor, 0.92),
                }}
              >
                {filteredSuggestions.slice(0, 3).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={() => {
                      playPreviewSound('cardSelect');
                      setSearchQuery(item);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium flex items-center gap-2 cursor-pointer border-0 transition-colors hover:bg-white/20"
                    style={{ color: config.colors.textPrimary, background: 'transparent' }}
                  >
                    <WebIcon name="sparkles" className="w-3 h-3 shrink-0" style={{ color: config.primary.primaryColor }} />
                    <span className="truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1, 2, 3. Primary Button + Secondary Button + Icon Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              key={rippleKey}
              type="button"
              onMouseEnter={() => playPreviewSound('buttonHover')}
              onClick={() => {
                playPreviewSound('buttonClick');
                if (config.interaction.buttonRippleEffect) {
                  setRippleKey((k) => k + 1);
                }
                setToastState({
                  visible: true,
                  kind: 'success',
                  message: isEn ? 'Primary glossy button triggered!' : 'Đã nhấn nút chính kính bóng!',
                });
              }}
              className={`relative overflow-hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-bold cursor-pointer border-0 ${
                config.interaction.buttonPressDepth ? 'active:scale-95 active:translate-y-0.5' : ''
              }`}
              style={primaryBtnStyle}
            >
              {config.interaction.buttonLightReflection && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-2 top-0.5 h-[42%] rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0) 100%)',
                  }}
                />
              )}
              <WebIcon name="sparkles" className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{isEn ? 'Primary Action' : 'Nút chính'}</span>
            </button>

            <button
              type="button"
              onMouseEnter={() => playPreviewSound('buttonHover')}
              onClick={() => {
                playPreviewSound('popupOpen');
                setIsModalOpen(true);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold cursor-pointer ${
                config.interaction.buttonPressDepth ? 'active:scale-95' : ''
              }`}
              style={{
                ...glassCardStyle,
                borderRadius: '999px',
                padding: '7px 13px',
              }}
            >
              <WebIcon name="layers" className="w-3.5 h-3.5" style={{ color: config.colors.iconColor }} />
              <span>{isEn ? 'Open Modal' : 'Mở Popup'}</span>
            </button>

            <div className="flex items-center gap-1.5 ml-auto">
              {(
                [
                  { id: 'sparkles', icon: 'sparkles', label: 'Glow' },
                  { id: 'heart', icon: 'heart', label: 'Like' },
                  { id: 'bell', icon: 'bell', label: 'Alert' },
                ] as const
              ).map((btn) => {
                const on = activeIconSet[btn.id];
                return (
                  <button
                    key={btn.id}
                    type="button"
                    aria-label={btn.label}
                    aria-pressed={on}
                    onClick={() => {
                      playPreviewSound(on ? 'toggleOff' : 'toggleOn');
                      setActiveIconSet((prev) => ({ ...prev, [btn.id]: !prev[btn.id] }));
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-90"
                    style={
                      on
                        ? {
                            background: `linear-gradient(135deg, ${config.primary.primaryColor}, ${config.primary.accentColor})`,
                            color: '#FFFFFF',
                            border: '1px solid rgba(255,255,255,0.65)',
                            boxShadow: `0 6px 16px -4px ${hexToRgba(config.primary.glowColor, 0.55)}`,
                          }
                        : {
                            ...glassCardStyle,
                            borderRadius: '999px',
                            color: config.colors.iconColor,
                          }
                    }
                  >
                    <WebIcon name={btn.icon} className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5, 6, 7. Checkbox + Liquid Toggle Switch + Capsule Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              className="p-2.5 flex items-center justify-between gap-2"
              style={glassCardStyle}
            >
              {/* 5. Checkbox */}
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => {
                  playPreviewSound(isChecked ? 'toggleOff' : 'toggleOn');
                  setIsChecked((v) => !v);
                }}
                className="inline-flex items-center gap-2 cursor-pointer border-0 bg-transparent text-left"
                style={{ color: config.colors.textPrimary }}
              >
                <span
                  className="w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0"
                  style={
                    isChecked
                      ? {
                          background: `linear-gradient(135deg, ${config.primary.primaryColor}, ${config.primary.secondaryColor})`,
                          color: '#FFFFFF',
                          boxShadow: `0 4px 12px ${hexToRgba(config.primary.glowColor, 0.45)}`,
                        }
                      : {
                          background: hexToRgba(config.cardBg.backgroundColor, 0.5),
                          border: `1.5px solid ${hexToRgba(config.colors.borderColor, 0.6)}`,
                        }
                  }
                >
                  {isChecked && <WebIcon name="check" className="w-3 h-3" />}
                </span>
                <span className="text-[11.5px] font-semibold">
                  {isEn ? 'Chrome Edge' : 'Viền Chrome'}
                </span>
              </button>

              {/* 6. Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isToggled}
                onClick={() => {
                  playPreviewSound(isToggled ? 'toggleOff' : 'toggleOn');
                  setIsToggled((v) => !v);
                }}
                className="relative w-11 h-6 rounded-full p-0.5 cursor-pointer border transition-all shrink-0"
                style={{
                  background: isToggled
                    ? `linear-gradient(135deg, ${config.primary.primaryColor}, ${config.primary.accentColor})`
                    : hexToRgba(config.colors.borderColor, 0.35),
                  borderColor: isToggled ? 'rgba(255,255,255,0.65)' : hexToRgba(config.colors.borderColor, 0.4),
                  boxShadow:
                    isToggled && config.interaction.toggleGlowSwitch
                      ? `0 0 14px ${hexToRgba(config.primary.glowColor, 0.55)}`
                      : 'none',
                }}
              >
                <span
                  className="block w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform"
                  style={{
                    transform: isToggled ? 'translateX(20px)' : 'translateX(0px)',
                    transitionDuration: config.interaction.toggleSmoothSliding ? `${durationMs}ms` : '0ms',
                  }}
                />
              </button>
            </div>

            {/* 7. Capsule Tabs */}
            <div
              role="tablist"
              className="p-1 flex items-center gap-1"
              style={{ ...glassCardStyle, borderRadius: '999px' }}
            >
              {(
                [
                  { id: 'overview', label: isEn ? 'Glass' : 'Kính' },
                  { id: 'glass', label: isEn ? 'Prism' : 'Xà cừ' },
                  { id: 'motion', label: isEn ? 'Motion' : 'Động' },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      playPreviewSound('tabChange');
                      setActiveTab(tab.id);
                    }}
                    className="flex-1 py-1.5 px-2 rounded-full text-[11px] font-bold cursor-pointer border-0 transition-all truncate"
                    style={
                      active
                        ? {
                            background: config.interaction.tabsCapsuleHighlight
                              ? `linear-gradient(135deg, ${config.primary.gradientStart}, ${config.primary.gradientEnd})`
                              : hexToRgba(config.primary.primaryColor, 0.22),
                            color: config.interaction.tabsCapsuleHighlight ? '#FFFFFF' : config.primary.primaryColor,
                            boxShadow: config.interaction.tabsGlassActiveState
                              ? `0 4px 12px ${hexToRgba(config.primary.glowColor, 0.42)}`
                              : 'none',
                          }
                        : { background: 'transparent', color: config.colors.textSecondary }
                    }
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 9. Interactive 3D Glass Card + 13. Main Content Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* 9. Glass Card with 3D Tilt + Spotlight + Glossy Sheen */}
            <div
              onMouseMove={handleCardPointerMove}
              onMouseLeave={() => setTilt({ rx: 0, ry: 0, sx: 50, sy: 50 })}
              onClick={() => playPreviewSound('cardSelect')}
              className="relative overflow-hidden p-3 flex flex-col justify-between gap-2 cursor-pointer"
              style={{
                ...glassCardStyle,
                transform: config.interaction.cardTilt3D
                  ? `perspective(700px) rotateX(${tilt.rx.toFixed(1)}deg) rotateY(${tilt.ry.toFixed(1)}deg)`
                  : undefined,
              }}
            >
              {config.cardEffects.glossyReflection && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,${(
                      (config.cardEffects.reflectionIntensity / 100) *
                      (isDark ? 0.22 : 0.56)
                    ).toFixed(2)}) 0%, transparent 100%)`,
                  }}
                />
              )}
              {config.interaction.cardSpotlightFollow && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: `radial-gradient(circle 120px at ${tilt.sx}% ${tilt.sy}%, ${hexToRgba(
                      config.primary.chromeReflectionColor,
                      isDark ? 0.2 : 0.34
                    )}, transparent 72%)`,
                  }}
                />
              )}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="text-[12px] font-bold">
                  {isEn ? '3D Liquid Card' : 'Thẻ kính 3D'}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${config.primary.primaryColor}, ${config.primary.accentColor})`,
                  }}
                >
                  {config.cardBg.backdropBlur}px
                </span>
              </div>
              <p className="relative z-10 text-[11px] leading-relaxed" style={{ color: config.colors.textSecondary }}>
                {isEn
                  ? 'Hover to test specular reflection, chrome border & 3D tilt.'
                  : 'Di chuột để kiểm tra phản xạ bóng kính, viền xà cừ & nghiêng 3D.'}
              </p>
              {/* Progress Bar synced to Primary Gradient */}
              <div className="relative z-10 h-1.5 w-full rounded-full overflow-hidden bg-black/15">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.max(25, config.cardBg.backgroundOpacity)}%`,
                    background: `linear-gradient(90deg, ${config.primary.gradientStart}, ${config.primary.accentColor}, ${config.primary.gradientEnd})`,
                  }}
                />
              </div>
            </div>

            {/* 13. Main Content Card + 11. Input Field */}
            <div
              className="p-3 flex flex-col justify-between gap-2"
              style={{
                ...glassCardStyle,
                background: hexToRgba(
                  config.colors.mainContainerBg,
                  Math.max(0.28, config.cardBg.targets.mainCard.opacity / 100)
                ),
                borderRadius: `${config.cardBg.targets.mainCard.radius}px`,
              }}
            >
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[12px] font-bold">
                  {isEn ? 'Main Content & Input' : 'Khung chính & Ô nhập'}
                </span>
                <div className="flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    title="Success"
                    style={{ backgroundColor: config.colors.successColor }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    title="Warning"
                    style={{ backgroundColor: config.colors.warningColor }}
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    title="Error"
                    style={{ backgroundColor: config.colors.errorColor }}
                  />
                </div>
              </div>

              {/* 11. Input Field */}
              <input
                type="text"
                value={inputValue}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isEn ? 'Type to test glass input...' : 'Nhập thử ô kính...'}
                className="w-full px-2.5 py-1.5 rounded-xl text-[11.5px] outline-none transition-all"
                style={{
                  background: isInputFocused && config.interaction.inputGlassFocus
                    ? hexToRgba(config.cardBg.backgroundColor, 0.86)
                    : hexToRgba(config.cardBg.backgroundColor, 0.45),
                  border: `1px solid ${
                    isInputFocused && config.interaction.inputAnimatedBorder
                      ? config.primary.primaryColor
                      : hexToRgba(config.colors.borderColor, 0.45)
                  }`,
                  boxShadow:
                    isInputFocused && config.interaction.inputFocusGlow
                      ? `0 0 0 3px ${hexToRgba(config.primary.glowColor, 0.28)}`
                      : 'none',
                  color: config.colors.textPrimary,
                }}
              />

              <div className="flex items-center gap-1.5">
                {(['success', 'warning', 'error'] as const).map((kind) => (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => {
                      playPreviewSound(kind === 'error' ? 'error' : kind === 'success' ? 'success' : 'notification');
                      setToastState({
                        visible: true,
                        kind,
                        message:
                          kind === 'success'
                            ? isEn
                              ? 'Success state preview'
                              : 'Thông báo thành công'
                            : kind === 'warning'
                              ? isEn
                                ? 'Warning state preview'
                                : 'Thông báo cảnh báo'
                              : isEn
                                ? 'Error state preview'
                                : 'Thông báo lỗi',
                      });
                    }}
                    className="flex-1 py-1 rounded-lg text-[10px] font-bold text-white cursor-pointer border-0"
                    style={{
                      backgroundColor:
                        kind === 'success'
                          ? config.colors.successColor
                          : kind === 'warning'
                            ? config.colors.warningColor
                            : config.colors.errorColor,
                    }}
                  >
                    {kind === 'success' ? 'OK' : kind === 'warning' ? 'Warn' : 'Err'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 8. Toast Notification */}
          {toastState.visible && (
            <div
              role="status"
              className="flex items-center justify-between gap-2 px-3 py-2 text-[11.5px]"
              style={{
                ...glassCardStyle,
                borderRadius: '14px',
                backdropFilter: config.interaction.toastBlurBackground
                  ? `blur(${Math.max(12, config.cardBg.backdropBlur)}px)`
                  : 'none',
                borderColor:
                  toastState.kind === 'success'
                    ? config.colors.successColor
                    : toastState.kind === 'warning'
                      ? config.colors.warningColor
                      : config.colors.errorColor,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{
                    backgroundColor:
                      toastState.kind === 'success'
                        ? config.colors.successColor
                        : toastState.kind === 'warning'
                          ? config.colors.warningColor
                          : config.colors.errorColor,
                  }}
                />
                <span className="font-medium truncate">{toastState.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastState((prev) => ({ ...prev, visible: false }))}
                className="p-0.5 rounded-full cursor-pointer border-0 bg-transparent opacity-70 hover:opacity-100"
                style={{ color: config.colors.textPrimary }}
                aria-label="Dismiss toast"
              >
                <WebIcon name="x" className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* 10. Interactive Popup / Modal inside Preview */}
        {isModalOpen && (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center p-4"
            style={{ backgroundColor: isDark ? 'rgba(4, 8, 18, 0.56)' : 'rgba(15, 23, 42, 0.28)' }}
            onClick={() => {
              playPreviewSound('popupClose');
              setIsModalOpen(false);
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[300px] p-4 flex flex-col gap-3"
              style={{
                ...glassCardStyle,
                background: hexToRgba(
                  config.cardBg.backgroundColor,
                  Math.max(0.72, config.cardBg.targets.modalCard.opacity / 100)
                ),
                borderRadius: `${config.cardBg.targets.modalCard.radius}px`,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-bold">
                  {isEn ? 'Iridescent Glass Modal' : 'Cửa sổ kính lỏng'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playPreviewSound('popupClose');
                    setIsModalOpen(false);
                  }}
                  className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border-0"
                  style={{
                    background: hexToRgba(config.primary.primaryColor, 0.16),
                    color: config.colors.textPrimary,
                  }}
                >
                  <WebIcon name="x" className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11.5px] leading-relaxed" style={{ color: config.colors.textSecondary }}>
                {isEn
                  ? 'Modal surface inherits your Modal Card opacity, blur, and corner radius.'
                  : 'Cửa sổ nổi tự đồng bộ độ trong suốt, độ mờ nền và bo góc của Modal Card.'}
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playPreviewSound('popupClose');
                    setIsModalOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-full text-[11px] font-bold text-white cursor-pointer border-0"
                  style={primaryBtnStyle}
                >
                  {isEn ? 'Close Preview' : 'Đóng cửa sổ'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
