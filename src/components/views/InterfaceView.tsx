import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  useTheme,
  getCardStyleProperties,
  getCardStyleConfig,
  getLightDarkCounterpart,
  getThemeForMechanism,
  UNIFIED_INTERFACE_THEMES,
  CARD_STYLE_GROUPS,
  ThemeMechanismMode,
} from '@/hooks/useTheme';
import { CardStyleMode } from '@/config/ui/theme.types';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

export interface InterfaceViewProps {
  onShowNotification?: (msg: string) => void;
}

export const InterfaceView: React.FC<InterfaceViewProps> = ({ onShowNotification }) => {
  const {
    cardStyle,
    setCardStyle,
    isDark,
    surfaceDepth,
    setSurfaceDepth,
  } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const activePreset = getCardStyleConfig(cardStyle);
  const activeMechanism: ThemeMechanismMode = activePreset.mechanism || (isDark ? 'dark' : 'light');

  const getMechanismLabel = (mech: ThemeMechanismMode) => {
    if (mech === 'light') return isEn ? 'Light' : 'Sáng';
    if (mech === 'dark') return isEn ? 'Dark' : 'Tối';
    return isEn ? 'Color' : 'Màu';
  };

  const handleSelectTheme = (mode: CardStyleMode, label: string) => {
    SoundEngine.playGlassChime();
    setCardStyle(mode);
    if (onShowNotification) {
      onShowNotification(
        isEn ? `✓ Applied style: ${t(label)}` : `✓ Đã áp dụng phong cách: ${label}`
      );
    }
  };

  const handleSwitchMechanism = (mechanism: ThemeMechanismMode) => {
    const nextMode = getThemeForMechanism(cardStyle, mechanism);
    if (nextMode === cardStyle) return;
    const nextPreset = getCardStyleConfig(nextMode);
    SoundEngine.playGlassChime();
    setCardStyle(nextMode);
    if (onShowNotification) {
      onShowNotification(
        isEn
          ? `✓ Switched to ${t(nextPreset.name)} (${getMechanismLabel(mechanism)})`
          : `✓ Đã chuyển sang ${nextPreset.name} (Cơ chế ${getMechanismLabel(mechanism)})`
      );
    }
  };

  const handleSelectSurfaceDepth = (mode: 'flat' | 'depth') => {
    if (mode === surfaceDepth) return;
    SoundEngine.playGlassChime();
    setSurfaceDepth(mode);
    if (onShowNotification) {
      onShowNotification(
        mode === 'flat'
          ? isEn
            ? '✓ Switched to Minimalist Flat (No Shadow)'
            : '✓ Đã bật Giao diện phẳng tối giản (không bóng)'
          : isEn
            ? '✓ Switched to Layered Depth (Elevated Shadows)'
            : '✓ Đã bật Giao diện có chiều sâu'
      );
    }
  };



  const displayedThemesCount = UNIFIED_INTERFACE_THEMES.length;
  const getThemeDemoVideo = (presetId: string) => {
    switch (presetId) {
      case 'light-multicolor-glass':
      case 'light-multicolor-glass-color':
        return 'https://cdn.dribbble.com/userupload/13498087/file/original-b120f6a1a15d71e493f8d4b2d13b0296.mp4';
      case 'light-multicolor-glass-dark':
        return 'https://cdn.dribbble.com/userupload/18230475/file/original-d7ab36998c2277e97c1996d837a4673c.mp4';
      case 'light-cowhide-leather':
        return 'https://cdn.scena.ai/project/10223/cc5a8e558d2380dc8bfb96fd26cd877e444d63b6a7036a8530abd823d6d6da63.mp4';
      case 'black-cowhide-leather':
      case 'cowhide-leather':
      default:
        return 'https://cdn.scena.ai/project/10223/50b7b30031d4b9124af4948a069cdf530ca8f0942767f6e6b713c350cb8bd6b2.mp4';
    }
  };

  return (
    <div
      id="interface-page-container"
      data-element-name="Trang Cấu Hình Giao Diện & Kiểu Thẻ"
      data-element-type="container"
      data-element-page="interface"
      data-element-parent="global-content-viewport"
      className="main-card relative w-full max-w-full min-w-0 h-full mx-0 flex-1 flex flex-row items-stretch justify-start p-0 gap-[15px] overflow-x-auto overflow-y-hidden no-scrollbar font-play select-none text-left animate-fadeIn rounded-none box-border"
    >
      <div
        id="interface-cards-track"
        data-element-name="Track căn giữa Giao Diện"
        data-element-type="container"
        data-element-page="interface"
        data-element-parent="interface-page-container"
        className="page-cards-track"
      >
        <div
          id="interface-main-card"
          data-main-card="true"
          data-element-name="Thẻ chính Trang Giao Diện"
          data-element-type="card"
          data-element-page="interface"
          data-element-parent="interface-cards-track"
          className="page-main-card flex flex-col justify-start p-[15px] gap-[15px] rounded-[14px] overflow-y-auto overflow-x-hidden glass-scrollbar font-play select-none text-left box-border"
        >
      {/* Header + Bộ chuyển đổi 3 cơ chế: Sáng / Tối / Màu */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--border-subcard)' }}
      >
        <div className="min-w-0 flex flex-col gap-0.5">
          <h3 className="typo-h3 font-bold tracking-tight">
            {isEn
              ? `Unified Interface Themes (${displayedThemesCount} Themes)`
              : `Danh sách ${displayedThemesCount} giao diện phân loại theo nhóm`}
          </h3>
          <p className="typo-body-sm" style={{ color: 'var(--text-muted)' }}>
            {isEn
              ? `Active: ${t(activePreset.name)} · Mode: ${getMechanismLabel(activeMechanism)} (Light / Dark / Color)`
              : `Đang dùng: ${activePreset.name} · Cơ chế: ${getMechanismLabel(activeMechanism)} (Sáng / Tối / Màu)`}
          </p>
        </div>

        {/* Nút trượt 3 cơ chế: Sáng / Tối / Màu */}
        <div
          role="group"
          aria-label={isEn ? 'Light, Dark and Color theme mode switch' : 'Thanh chuyển đổi 3 cơ chế Sáng, Tối và Màu'}
          className="relative inline-grid grid-cols-3 p-1 rounded-full border shrink-0 self-start sm:self-auto w-full sm:w-auto sm:min-w-[270px] max-w-full"
          style={{
            background: 'var(--bg-subcard)',
            borderColor: 'var(--border-subcard)',
          }}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full transition-transform duration-300 ease-out shadow-sm ${
              activeMechanism === 'color'
                ? 'translate-x-[200%] bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#78350F] border border-amber-200/55'
                : activeMechanism === 'dark'
                  ? 'translate-x-full bg-gradient-to-r from-[#182536] via-sky-700 to-indigo-700 border border-sky-300/40'
                  : 'translate-x-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 border border-white/70'
            }`}
          />
          <button
            type="button"
            aria-pressed={activeMechanism === 'light'}
            onClick={() => handleSwitchMechanism('light')}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full typo-button font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeMechanism === 'light' ? 'text-white' : 'hover:opacity-90'
            }`}
            style={activeMechanism !== 'light' ? { color: 'var(--text-muted)' } : undefined}
          >
            <WebIcon name="sun" className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Light' : 'Sáng'}</span>
          </button>
          <button
            type="button"
            aria-pressed={activeMechanism === 'dark'}
            onClick={() => handleSwitchMechanism('dark')}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full typo-button font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeMechanism === 'dark' ? 'text-white' : 'hover:opacity-90'
            }`}
            style={activeMechanism !== 'dark' ? { color: 'var(--text-muted)' } : undefined}
          >
            <WebIcon name="moon" className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Dark' : 'Tối'}</span>
          </button>
          <button
            type="button"
            aria-pressed={activeMechanism === 'color'}
            onClick={() => handleSwitchMechanism('color')}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full typo-button font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeMechanism === 'color' ? 'text-white' : 'hover:opacity-90'
            }`}
            style={activeMechanism !== 'color' ? { color: 'var(--text-muted)' } : undefined}
          >
            <WebIcon name="palette" className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Color' : 'Màu'}</span>
          </button>
        </div>
      </div>

      {/* Bộ chuyển nhanh Độ phẳng giao diện & Thu gọn thanh điều hướng khi cuộn */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[15px]">
        {/* 1. Chế độ chuyển nhanh độ phẳng giao diện */}
        <div
          id="interface-surface-depth-card"
          data-subcard="true"
          className="sub-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-[15px] rounded-[14px] border"
          style={{
            background: 'var(--bg-subcard)',
            borderColor: 'var(--border-subcard)',
          }}
        >
          <div className="min-w-0 flex items-start gap-2.5">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 border"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subcard)',
                color: 'var(--color-primary)',
              }}
            >
              <WebIcon name="layers" className="w-4 h-4 shrink-0" />
            </div>
            <div className="min-w-0">
              <h4 className="typo-body font-bold tracking-tight">
                {isEn ? 'Interface Surface Depth' : 'Độ phẳng & chiều sâu giao diện'}
              </h4>
              <p className="typo-caption" style={{ color: 'var(--text-muted)' }}>
                {surfaceDepth === 'flat'
                  ? isEn
                    ? 'Minimalist flat surfaces without drop shadows'
                    : 'Đang bật: Giao diện phẳng tối giản (không bóng)'
                  : isEn
                    ? 'Layered depth with soft shadows and gentle hover lift'
                    : 'Đang bật: Giao diện có chiều sâu (đổ bóng & nổi nhẹ)'}
              </p>
            </div>
          </div>

          <div
            role="group"
            aria-label={isEn ? 'Switch between Flat Minimalist and Layered Depth' : 'Chuyển đổi giữa Giao diện phẳng tối giản và Giao diện có chiều sâu'}
            className="inline-grid grid-cols-2 p-1 rounded-full border shrink-0 w-full sm:w-auto"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subcard)',
            }}
          >
            <button
              id="btn-surface-depth-flat"
              type="button"
              aria-pressed={surfaceDepth === 'flat'}
              onClick={() => handleSelectSurfaceDepth('flat')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full typo-label font-bold transition-colors cursor-pointer whitespace-nowrap ${
                surfaceDepth === 'flat'
                  ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'
                  : 'hover:opacity-90'
              }`}
              style={surfaceDepth !== 'flat' ? { color: 'var(--text-muted)' } : undefined}
            >
              <WebIcon name="square" className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Flat Minimal' : 'Giao diện phẳng tối giản'}</span>
            </button>
            <button
              id="btn-surface-depth-layered"
              type="button"
              aria-pressed={surfaceDepth === 'depth'}
              onClick={() => handleSelectSurfaceDepth('depth')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full typo-label font-bold transition-colors cursor-pointer whitespace-nowrap ${
                surfaceDepth === 'depth'
                  ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white'
                  : 'hover:opacity-90'
              }`}
              style={surfaceDepth !== 'depth' ? { color: 'var(--text-muted)' } : undefined}
            >
              <WebIcon name="sparkles" className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? 'Layered Depth' : 'Giao diện có chiều sâu'}</span>
            </button>
          </div>
        </div>


      </div>

      {/* Danh sách các giao diện nhóm cùng loại */}
      <div className="flex flex-col gap-[15px]">
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
          const groupActive = group.presets.some((p) => p.id === cardStyle);
          const groupModes = [
            lightPreset && {
              key: 'light' as ThemeMechanismMode,
              preset: lightPreset,
              label: isEn ? 'Light' : 'Sáng',
              icon: 'sun',
            },
            darkPreset && {
              key: 'dark' as ThemeMechanismMode,
              preset: darkPreset,
              label: isEn ? 'Dark' : 'Tối',
              icon: 'moon',
            },
            colorPreset && {
              key: 'color' as ThemeMechanismMode,
              preset: colorPreset,
              label: isEn ? 'Color' : 'Màu',
              icon: 'palette',
            },
          ].filter((item): item is { key: ThemeMechanismMode; preset: NonNullable<typeof lightPreset>; label: string; icon: string } => Boolean(item));
          const activeGroupModeIdx = groupModes.findIndex((m) => m.preset.id === cardStyle);
          const presetsToRender = group.presets;

          return (
            <section
              key={group.id}
              className="flex flex-col gap-[15px] p-[15px] rounded-[14px] border transition-all duration-300"
              style={{
                background: 'var(--bg-subcard)',
                borderColor: groupActive ? 'var(--color-primary)' : 'var(--border-subcard)',
                boxShadow: groupActive ? '0 10px 30px -8px rgba(2, 132, 199, 0.15)' : undefined,
              }}
            >
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
                style={{ borderColor: 'var(--border-subcard)' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center shrink-0" style={{ color: 'var(--color-primary)' }}>
                    <WebIcon name={group.icon} className="w-6 h-6 shrink-0" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="typo-h5 font-bold tracking-tight">
                        {isEn ? group.labelEn : group.label}
                      </h4>
                      <span
                        className="typo-badge font-semibold px-2.5 py-0.5 rounded-full border"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: 'var(--border-subcard)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        {colorPreset
                          ? isEn
                            ? 'Light · Dark · Color Variants'
                            : 'Cơ chế Sáng · Tối · Màu'
                          : isEn
                            ? 'Light & Dark Variants'
                            : 'Biến thể Sáng & Tối'}
                      </span>
                    </div>
                    <p className="typo-label" style={{ color: 'var(--text-muted)' }}>
                      {isEn ? group.descriptionEn : group.description}
                    </p>
                  </div>
                </div>

                {groupModes.length > 0 && (
                  <div
                    role="group"
                    aria-label={isEn ? `Switch ${group.label} mode` : `Chuyển chế độ ${group.label}`}
                    className={`relative inline-grid p-1 rounded-full border shrink-0 shadow-xs w-full sm:w-auto max-w-full ${
                      groupModes.length === 3 ? 'grid-cols-3 sm:min-w-[264px]' : 'grid-cols-2 sm:min-w-[200px]'
                    }`}
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
                  >
                    {activeGroupModeIdx >= 0 && (
                      <span
                        aria-hidden="true"
                        style={{
                          width: `calc((100% - 8px) / ${groupModes.length})`,
                          transform: `translateX(${activeGroupModeIdx * 100}%)`,
                        }}
                        className={`pointer-events-none absolute top-1 bottom-1 left-1 rounded-full transition-transform duration-300 ease-out shadow-sm ${
                          groupModes[activeGroupModeIdx].key === 'color'
                            ? 'bg-gradient-to-r from-[#D97706] via-[#B45309] to-[#78350F] border border-amber-200/55'
                            : groupModes[activeGroupModeIdx].key === 'dark'
                              ? 'bg-gradient-to-r from-slate-800 via-sky-800 to-indigo-900 border border-sky-400/30'
                              : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 border border-white/70'
                        }`}
                      />
                    )}
                    {groupModes.map((modeItem) => {
                      const isModeSelected = cardStyle === modeItem.preset.id;
                      return (
                        <button
                          key={modeItem.key}
                          type="button"
                          aria-pressed={isModeSelected}
                          onClick={() => handleSelectTheme(modeItem.preset.id, modeItem.preset.name)}
                          className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full typo-label font-bold cursor-pointer transition-colors whitespace-nowrap ${
                            isModeSelected ? 'text-white font-bold' : 'hover:opacity-90'
                          }`}
                          style={!isModeSelected ? { color: 'var(--text-muted)' } : undefined}
                        >
                          <WebIcon name={modeItem.icon} className="w-3.5 h-3.5 shrink-0" />
                          <span>{modeItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch">
                {presetsToRender.map((preset) => {
                  const isActive = cardStyle === preset.id;
                  const displayPresetName = t(preset.name);
                  const displayModeLabel = t(preset.modeLabel);
                  const displayShortBadge = t(preset.shortBadge);
                  const sampleProps = getCardStyleProperties(preset.id).cardSampleStyle;
                  const isLightMulticolorGlass = preset.id === 'light-multicolor-glass';
                  const isLightMulticolorGlassColor = preset.id === 'light-multicolor-glass-color';
                  const isLightMulticolorGlassDark = preset.id === 'light-multicolor-glass-dark';
                  const isLightLeather = preset.id === 'light-cowhide-leather';
                  const isBlackLeather = preset.id === 'black-cowhide-leather';
                  const isLeather = preset.id === 'cowhide-leather';
                  const cardRadius = (isLightMulticolorGlass || isLightMulticolorGlassDark) ? '16px' : '14px';

                  return (
                    <motion.div
                      key={preset.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isActive}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTheme(preset.id, displayPresetName)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectTheme(preset.id, displayPresetName);
                        }
                      }}
                      style={{
                        ...sampleProps,
                        borderRadius: cardRadius,
                        padding: '15px',
                        ...(isLeather
                          ? {
                              outline: isActive
                                ? '2px dashed #FFF8DC'
                                : '1.5px dashed rgba(245, 222, 179, 0.58)',
                              outlineOffset: '-6px',
                            }
                          : isBlackLeather
                            ? {
                                outline: isActive
                                  ? '2px dashed #E2E8F0'
                                  : '1.5px dashed rgba(226, 232, 240, 0.48)',
                                outlineOffset: '-6px',
                              }
                            : isLightLeather
                              ? {
                                  outline: isActive
                                    ? '2px dashed #111827'
                                    : '1.5px dashed rgba(17, 24, 39, 0.65)',
                                  outlineOffset: '-6px',
                                }
                              : {}),
                        ...(isActive
                          ? {
                              boxShadow: isLightMulticolorGlass
                                ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #0F172A`
                                : isLightMulticolorGlassColor
                                  ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #DD4E9E`
                                  : isLightMulticolorGlassDark
                                    ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #A78BFA`
                                    : isLightLeather
                                      ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #111827`
                                      : isBlackLeather
                                        ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #E2E8F0`
                                        : isLeather
                                          ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #F5DEB3`
                                          : `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px var(--color-indigo)`,
                            }
                          : {}),
                      }}
                      className={`relative flex flex-col justify-between p-[15px] cursor-pointer transition-all duration-300 border ${preset.cardClassName} ${
                        isLightMulticolorGlass
                          ? isActive
                            ? 'border-slate-900'
                            : 'border-white/95 hover:border-slate-400'
                          : isLightMulticolorGlassColor
                            ? isActive
                              ? 'border-pink-500'
                              : 'border-white/95 hover:border-pink-300'
                            : isLightMulticolorGlassDark
                              ? isActive
                                ? 'border-violet-400'
                                : 'border-violet-400/30 hover:border-pink-400/60'
                              : isLightLeather
                                ? isActive
                                  ? 'border-[#111827]'
                                  : 'border-[#d1d5db] hover:border-[#9ca3af]'
                                : isBlackLeather
                                  ? isActive
                                    ? 'border-[#E2E8F0]'
                                    : 'border-[#090a0d] hover:border-[#94A3B8]'
                                  : isLeather
                                    ? isActive
                                      ? 'border-[#F5DEB3]'
                                      : 'border-[#522E10] hover:border-[#D4A373]'
                                    : isActive
                                      ? 'border-indigo-600 shadow-xl'
                                      : 'border-white/80 hover:border-indigo-400'
                      }`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`typo-badge font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                              isActive
                                ? isLightMulticolorGlass
                                  ? 'bg-[#0F172A] text-white border-white/85'
                                  : isLightMulticolorGlassColor || isLightMulticolorGlassDark
                                    ? 'bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#DD4E9E] text-white border-white/85'
                                    : isLightLeather
                                      ? 'bg-[#0F172A] text-white border-slate-900'
                                      : isBlackLeather
                                        ? 'bg-gradient-to-r from-[#334155] to-[#0f172a] text-white border-[#E2E8F0]/60'
                                        : isLeather
                                          ? 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] border-[#F5DEB3]/80'
                                          : 'bg-indigo-600 text-white border-indigo-700'
                                : preset.badgeColorClass
                            }`}
                          >
                            {isActive ? t('Đang sử dụng ✓') : displayShortBadge}
                          </span>
                          <div className="flex items-center justify-center shrink-0">
                            <WebIcon
                              name={preset.icon}
                              className="w-5 h-5 shrink-0"
                              style={{
                                color: isLightMulticolorGlass
                                  ? '#0F172A'
                                  : isLightMulticolorGlassColor || isLightMulticolorGlassDark
                                    ? '#DD4E9E'
                                    : isLightLeather
                                      ? '#111827'
                                      : isBlackLeather
                                        ? '#E2E8F0'
                                        : isLeather
                                          ? '#D97706'
                                          : preset.color || 'var(--color-primary)',
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          {(() => {
                            const isFamilyActive = group.presets.some((p) => p.id === cardStyle);
                            const isToggleDark = isFamilyActive ? activePreset.isDark : preset.isDark;
                            const lightTargetId: CardStyleMode =
                              group.lightMode || getLightDarkCounterpart(preset.id, false);
                            const darkTargetId: CardStyleMode =
                              group.darkMode || getLightDarkCounterpart(preset.id, true);
                            const nextToggleTarget: CardStyleMode = isToggleDark
                              ? lightTargetId
                              : darkTargetId;
                            const nextToggleConfig = getCardStyleConfig(nextToggleTarget);
                            const toggleLabelText = isToggleDark
                              ? isEn
                                ? 'Dark'
                                : 'Tối'
                              : isEn
                                ? 'Light'
                                : 'Sáng';

                            const trackToneClass = isLightMulticolorGlass
                              ? isToggleDark
                                ? 'bg-slate-900/95 border-slate-400/60'
                                : 'bg-slate-200/95 border-slate-400/75'
                              : isLightMulticolorGlassColor
                                ? isToggleDark
                                  ? 'bg-indigo-950/90 border-violet-300/60'
                                  : 'bg-sky-100/95 border-pink-300/80'
                                : isLightMulticolorGlassDark
                                  ? isToggleDark
                                    ? 'bg-slate-900/95 border-violet-400/55'
                                    : 'bg-sky-100/90 border-sky-300/80'
                                  : isLightLeather
                                    ? isToggleDark
                                      ? 'bg-[#111827] border-[#334155]'
                                      : 'bg-slate-200/95 border-slate-400/70'
                                    : isBlackLeather
                                      ? isToggleDark
                                        ? 'bg-[#090a0d] border-[#E2E8F0]/45'
                                        : 'bg-slate-200 border-slate-400'
                                      : isLeather
                                        ? isToggleDark
                                          ? 'bg-[#3D210B] border-[#F5DEB3]/55'
                                          : 'bg-[#FEF3C7] border-[#D97706]/60'
                                        : isToggleDark
                                          ? 'bg-slate-800 border-indigo-400/50'
                                          : 'bg-sky-100 border-indigo-300';

                            const thumbToneClass = isToggleDark
                              ? isLeather
                                ? 'bg-gradient-to-br from-[#FDE68A] to-[#D97706] text-[#3D210B]'
                                : isBlackLeather || isLightLeather || isLightMulticolorGlass
                                  ? 'bg-slate-100 text-slate-900'
                                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                              : isLeather
                                ? 'bg-gradient-to-br from-[#D97706] to-[#92400E] text-white'
                                : isLightLeather || isBlackLeather || isLightMulticolorGlass
                                  ? 'bg-[#0F172A] text-white'
                                  : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white';

                            const toggleTextClass =
                              isLightMulticolorGlass || isLightMulticolorGlassColor || isLightLeather
                                ? 'text-[#000000]'
                                : isLightMulticolorGlassDark || isBlackLeather
                                  ? 'text-[#FFFFFF]'
                                  : isLeather
                                    ? 'text-[#FFF8DC]'
                                    : 'text-slate-700';

                            return (
                              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap sm:flex-nowrap">
                                <h3
                                  className={`typo-h3 card-title-synced leading-snug min-w-0 ${
                                    isLightMulticolorGlass || isLightMulticolorGlassColor || isLightLeather
                                      ? 'text-[#000000]'
                                      : isLightMulticolorGlassDark || isBlackLeather
                                        ? 'text-[#FFFFFF]'
                                        : isLeather
                                          ? 'text-[#FFF8DC]'
                                          : ''
                                  }`}
                                  data-card-title="true"
                                >
                                  {displayPresetName}
                                </h3>
                                <button
                                  type="button"
                                  role="switch"
                                  aria-checked={isToggleDark}
                                  aria-label={
                                    isEn
                                      ? `Toggle Light/Dark mode for ${displayPresetName} (current: ${toggleLabelText})`
                                      : `Chuyển chế độ Sáng/Tối cho ${displayPresetName} (hiện tại: ${toggleLabelText})`
                                  }
                                  title={
                                    isEn
                                      ? `Switch to ${t(nextToggleConfig.name)}`
                                      : `Chuyển nhanh sang ${nextToggleConfig.name}`
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectTheme(nextToggleTarget, nextToggleConfig.name);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSelectTheme(nextToggleTarget, nextToggleConfig.name);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 shrink-0 cursor-pointer group/toggle focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-full"
                                >
                                  <span
                                    className={`typo-badge font-bold select-none transition-colors ${toggleTextClass}`}
                                  >
                                    {toggleLabelText}
                                  </span>
                                  <span
                                    className={`relative inline-flex items-center w-[46px] h-[24px] p-[2px] rounded-full border transition-all duration-300 shadow-inner group-hover/toggle:scale-105 ${trackToneClass}`}
                                  >
                                    <WebIcon
                                      name="sun"
                                      className={`w-2.5 h-2.5 ml-1 transition-opacity duration-200 ${
                                        isToggleDark ? 'opacity-50 text-amber-300' : 'opacity-0'
                                      }`}
                                    />
                                    <WebIcon
                                      name="moon"
                                      className={`w-2.5 h-2.5 ml-auto mr-1 transition-opacity duration-200 ${
                                        isToggleDark ? 'opacity-0' : 'opacity-55 text-slate-600'
                                      }`}
                                    />
                                    <span
                                      className={`absolute left-[2px] top-[2px] w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm transition-transform duration-300 ease-out ${thumbToneClass} ${
                                        isToggleDark ? 'translate-x-[22px]' : 'translate-x-0'
                                      }`}
                                    >
                                      <WebIcon
                                        name={isToggleDark ? 'moon' : 'sun'}
                                        className="w-2.5 h-2.5 shrink-0"
                                      />
                                    </span>
                                  </span>
                                </button>
                              </div>
                            );
                          })()}
                          <p
                            className={`typo-body-sm leading-relaxed font-medium ${
                              isLightMulticolorGlass || isLightMulticolorGlassColor || isLightLeather
                                ? 'text-[#000000]'
                                : isLightMulticolorGlassDark || isBlackLeather
                                  ? 'text-[#FFFFFF]'
                                  : isLeather
                                    ? 'text-[#F5DEB3]'
                                    : 'text-slate-600'
                            }`}
                          >
                            {t(preset.desc)}
                          </p>
                        </div>
                      </div>

                      {/* Mẫu hiển thị trực quan mini card / module */}
                      <div
                        style={preset.miniPreviewWrapStyle}
                        className={`my-3 p-2.5 flex flex-col gap-2 transition-all shadow-2xs rounded-[14px] border ${
                          isLightMulticolorGlass || isLightMulticolorGlassColor
                            ? 'border-white/95'
                            : isLightMulticolorGlassDark
                              ? 'border-violet-400/28'
                              : isLightLeather
                                ? 'white-leather-stitch'
                                : isBlackLeather
                                  ? 'border-[#E2E8F0]/35 border-dashed'
                                  : isLeather
                                    ? 'border-[#F5DEB3]/45 border-dashed'
                                    : 'bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between typo-label font-bold ${
                            isLightMulticolorGlass || isLightMulticolorGlassColor || isLightLeather
                              ? 'text-[#000000]'
                              : isLightMulticolorGlassDark || isBlackLeather
                                ? 'text-[#FFFFFF]'
                                : isLeather
                                  ? 'text-[#FFF8DC]'
                                  : 'text-[#334155]'
                          }`}
                        >
                          <span>{t('Mẫu hiển thị & Video Demo')}</span>
                          <span
                            className={`font-mono typo-label ${
                              isLightMulticolorGlass
                                ? 'text-[#0F172A]'
                                : isLightMulticolorGlassColor
                                  ? 'text-[#db2777]'
                                  : isLightMulticolorGlassDark
                                    ? 'text-[#A78BFA]'
                                    : isLightLeather
                                      ? 'text-[#0F172A]'
                                      : isBlackLeather
                                        ? 'text-[#E2E8F0]'
                                        : isLeather
                                          ? 'text-[#F5DEB3]'
                                          : 'text-[#475569]'
                            }`}
                          >
                            {displayShortBadge}
                          </span>
                        </div>

                        {/* Video Demo trước 1 phần giao diện trong danh sách */}
                        <div className="relative w-full h-[120px] sm:h-[135px] rounded-[14px] overflow-hidden my-1 bg-black/40 group/video border border-white/20 shadow-inner">
                          <video
                            src={getThemeDemoVideo(preset.id)}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover rounded-[14px] brightness-105 contrast-105 transition-transform duration-700 group-hover/video:scale-105 pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white typo-badge">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{isEn ? 'Video Demo' : 'Video Demo Giao Diện'}</span>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white typo-badge font-mono">
                            {displayShortBadge}
                          </div>
                        </div>
                        {isLightMulticolorGlass && (
                          <div className="grid grid-cols-5 gap-1.5 py-0.5">
                            <div className="h-2 rounded-full bg-gradient-to-r from-slate-200 to-slate-300" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-slate-300 to-slate-400" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-slate-400 to-slate-600" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-slate-600 to-slate-800" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-slate-800 to-slate-950" />
                          </div>
                        )}
                        {(isLightMulticolorGlassColor || isLightMulticolorGlassDark) && (
                          <div className="grid grid-cols-5 gap-1.5 py-0.5">
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#9D4EDD] to-[#DD4E9E]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#FF3CAC] to-[#EC7D21]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#50B347] to-[#3BB8E6]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#FFDF25] to-[#A3D43A]" />
                          </div>
                        )}
                        {isLightLeather && (
                          <div className="w-full border-t-[1.5px] border-dashed border-[#111827]/65 my-0.5" />
                        )}
                        {isBlackLeather && (
                          <div className="w-full border-t border-dashed border-[#E2E8F0]/45 my-0.5" />
                        )}
                        {isLeather && (
                          <div className="w-full border-t border-dashed border-[#F5DEB3]/55 my-0.5" />
                        )}
                        <div className="flex items-center gap-1.5">
                          <span
                            style={preset.miniTabStyle}
                            className={`px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] border ${
                              isLightMulticolorGlass || isLightMulticolorGlassColor || isLightLeather
                                ? 'text-[#000000]'
                                : isLightMulticolorGlassDark || isBlackLeather
                                  ? 'text-[#FFFFFF] border-white/20'
                                  : isLeather
                                    ? 'text-[#FFF8DC] border-[#F5DEB3]/45'
                                    : 'bg-white/95 text-slate-800 border-slate-200/70'
                            }`}
                          >
                            {t('Tab Mẫu')}
                          </span>
                          <span
                            style={preset.miniBtnStyle}
                            className="px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] text-white"
                          >
                            {t('Nút Áp Dụng')}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`mt-auto pt-2 flex items-center justify-between border-t ${
                          isLightMulticolorGlass || isLightMulticolorGlassColor
                            ? 'border-white/75'
                            : isLightMulticolorGlassDark
                              ? 'border-violet-400/25'
                              : isLightLeather
                                ? 'border-[#0F172A]/45 border-dashed'
                                : isBlackLeather
                                  ? 'border-[#E2E8F0]/25 border-dashed'
                                  : isLeather
                                    ? 'border-[#F5DEB3]/30 border-dashed'
                                    : 'border-slate-200/80'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTheme(preset.id, displayPresetName);
                          }}
                          className={`typo-button font-bold px-3 py-1.5 transition-all rounded-[14px] border flex items-center gap-1 cursor-pointer ${
                            isLightMulticolorGlass || isLightMulticolorGlassColor
                              ? 'bg-white/90 text-[#000000] border-white hover:bg-white shadow-2xs'
                              : isLightMulticolorGlassDark
                                ? 'bg-indigo-950/90 text-[#FFFFFF] border-violet-400/35 hover:bg-indigo-900'
                                : isLightLeather
                                  ? 'bg-slate-100 text-[#000000] border-slate-900/40 hover:bg-white'
                                  : isBlackLeather
                                    ? 'bg-[#1b1e25] text-[#FFFFFF] border-[#E2E8F0]/35 hover:bg-[#252830]'
                                    : isLeather
                                      ? 'bg-[#522E10]/85 text-[#FFF8DC] border-[#F5DEB3]/40 hover:bg-[#3D210B]'
                                      : 'bg-slate-100 text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          <WebIcon name="eye" className="w-3.5 h-3.5" />
                          <span>{t('Xem thử')}</span>
                        </button>

                        <span
                          className={`typo-button font-bold px-3.5 py-1.5 transition-all rounded-full ${
                            isActive
                              ? isLightMulticolorGlass
                                ? 'bg-[#0F172A] text-white shadow-xs border border-white/85'
                                : isLightMulticolorGlassColor || isLightMulticolorGlassDark
                                  ? 'bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#DD4E9E] text-white shadow-xs border border-white/85'
                                  : isLightLeather
                                    ? 'bg-[#0F172A] text-white shadow-xs border border-slate-900'
                                    : isBlackLeather
                                      ? 'bg-gradient-to-r from-[#334155] to-[#0f172a] text-white shadow-xs border border-[#E2E8F0]/55'
                                      : isLeather
                                        ? 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] shadow-xs border border-[#F5DEB3]/60'
                                        : 'bg-indigo-600 text-white shadow-xs'
                              : isLightMulticolorGlass || isLightMulticolorGlassColor
                                ? 'bg-white/90 text-[#000000] hover:bg-white border border-white'
                                : isLightMulticolorGlassDark
                                  ? 'bg-indigo-950/90 text-[#FFFFFF] hover:bg-indigo-900 border border-violet-400/30'
                                  : isLightLeather
                                    ? 'bg-slate-100 text-[#000000] hover:bg-white border border-slate-900/35'
                                    : isBlackLeather
                                      ? 'bg-[#1b1e25] text-[#FFFFFF] hover:bg-[#252830] border border-[#E2E8F0]/30'
                                      : isLeather
                                        ? 'bg-[#522E10]/90 text-[#FFF8DC] hover:bg-[#3D210B] border border-[#F5DEB3]/35'
                                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
                          }`}
                        >
                          {isActive ? t('Đang dùng') : t('Chọn')}
                        </span>
                        {isActive && (
                          <div
                            className={`w-6 h-6 rounded-full text-white flex items-center justify-center typo-label font-bold shadow-xs ${
                              isLightMulticolorGlass
                                ? 'bg-[#0F172A]'
                                : isLightMulticolorGlassColor || isLightMulticolorGlassDark
                                  ? 'bg-pink-600'
                                  : isLightLeather
                                    ? 'bg-[#0F172A] text-white'
                                    : isBlackLeather
                                      ? 'bg-[#334155] text-white border border-[#E2E8F0]/60'
                                      : isLeather
                                        ? 'bg-[#D97706] text-[#FFF8DC]'
                                        : 'bg-indigo-600'
                            }`}
                          >
                            ✓
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
        </div>
      </div>
    </div>
  );
};

export default InterfaceView;
