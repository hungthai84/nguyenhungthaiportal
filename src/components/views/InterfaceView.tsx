import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import {
  useTheme,
  getCardStyleProperties,
  getCardStyleConfig,
  getLightDarkCounterpart,
  UNIFIED_INTERFACE_THEMES,
  CARD_STYLE_GROUPS,
} from '@/hooks/useTheme';
import { CardStyleMode } from '@/config/ui/theme.types';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

export interface InterfaceViewProps {
  onShowNotification?: (msg: string) => void;
}

export const InterfaceView: React.FC<InterfaceViewProps> = ({ onShowNotification }) => {
  const { cardStyle, setCardStyle, isDark, toggleLightDark } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const activePreset = getCardStyleConfig(cardStyle);
  const counterpartPreset = getCardStyleConfig(getLightDarkCounterpart(cardStyle));

  const handleSelectTheme = (mode: CardStyleMode, label: string) => {
    SoundEngine.playGlassChime();
    setCardStyle(mode);
    if (onShowNotification) {
      onShowNotification(
        isEn ? `✓ Applied style: ${t(label)}` : `✓ Đã áp dụng phong cách: ${label}`
      );
    }
  };

  const handleToggleLightDark = (targetDark?: boolean) => {
    const nextIsDark = typeof targetDark === 'boolean' ? targetDark : !isDark;
    if (nextIsDark === isDark) return;
    const nextPreset = getCardStyleConfig(getLightDarkCounterpart(cardStyle, nextIsDark));
    SoundEngine.playGlassChime();
    toggleLightDark(nextIsDark);
    if (onShowNotification) {
      onShowNotification(
        isEn
          ? `✓ Switched to ${t(nextPreset.name)} (${nextIsDark ? 'Dark' : 'Light'})`
          : `✓ Đã chuyển sang ${nextPreset.name} (${nextIsDark ? 'Chế độ Tối' : 'Chế độ Sáng'})`
      );
    }
  };

  return (
    <div
      id="interface-page-container"
      data-element-name="Trang Cấu Hình Giao Diện & Kiểu Thẻ"
      data-element-type="card"
      data-section-card="true"
      data-element-page="interface"
      className="main-card bento-card glass-card w-full min-w-0 h-full mx-auto flex flex-col justify-start p-[25px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px] box-border"
    >
      {/* Header + Nút trượt qua lại Sáng / Tối theo đúng họ giao diện đang kích hoạt */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--border-subcard)' }}
      >
        <div className="min-w-0 flex flex-col gap-0.5">
          <h3 className="typo-h3 font-bold tracking-tight">
            {isEn
              ? `Unified Interface Themes (${UNIFIED_INTERFACE_THEMES.length} Themes)`
              : `Danh sách ${UNIFIED_INTERFACE_THEMES.length} giao diện phân loại theo nhóm`}
          </h3>
          <p className="typo-body-sm" style={{ color: 'var(--text-muted)' }}>
            {isEn
              ? `Active: ${t(activePreset.name)} (${isDark ? 'Dark' : 'Light'}) · Counterpart: ${t(counterpartPreset.name)}`
              : `Đang dùng: ${activePreset.name} (${isDark ? 'Tối' : 'Sáng'}) · Biến thể đối ứng: ${counterpartPreset.name}`}
          </p>
        </div>

        {/* Nút trượt qua lại Sáng / Tối */}
        <div
          role="group"
          aria-label={isEn ? 'Light and Dark sliding switch' : 'Thanh trượt chuyển đổi Sáng và Tối'}
          className="relative inline-grid grid-cols-2 p-1 rounded-full border shrink-0 self-start sm:self-auto min-w-[216px]"
          style={{
            background: 'var(--bg-subcard)',
            borderColor: 'var(--border-subcard)',
          }}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out shadow-sm ${
              isDark
                ? 'translate-x-full bg-gradient-to-r from-[#182536] via-sky-700 to-indigo-700 border border-sky-300/40'
                : 'translate-x-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 border border-white/70'
            }`}
          />
          <button
            type="button"
            aria-pressed={!isDark}
            onClick={() => handleToggleLightDark(false)}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full typo-button font-bold transition-colors cursor-pointer whitespace-nowrap ${
              !isDark ? 'text-white' : 'hover:opacity-90'
            }`}
            style={isDark ? { color: 'var(--text-muted)' } : undefined}
          >
            <WebIcon name="sun" className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Light' : 'Sáng'}</span>
          </button>
          <button
            type="button"
            aria-pressed={isDark}
            onClick={() => handleToggleLightDark(true)}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full typo-button font-bold transition-colors cursor-pointer whitespace-nowrap ${
              isDark ? 'text-white' : 'hover:opacity-90'
            }`}
            style={!isDark ? { color: 'var(--text-muted)' } : undefined}
          >
            <WebIcon name="moon" className="w-4 h-4 shrink-0" />
            <span>{isEn ? 'Dark' : 'Tối'}</span>
          </button>
        </div>
      </div>

      {/* Danh sách các giao diện nhóm cùng loại */}
      <div className="flex flex-col gap-6">
        {CARD_STYLE_GROUPS.map((group) => {
          const lightPreset = group.presets.find((p) => !p.isDark);
          const darkPreset = group.presets.find((p) => p.isDark);
          const groupActive = group.presets.some((p) => p.id === cardStyle);
          const isDarkSelected = groupActive && darkPreset && cardStyle === darkPreset.id;

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
                  <div
                    className="w-10 h-10 rounded-[14px] border flex items-center justify-center shrink-0 shadow-xs"
                    style={{
                      background: 'var(--bg-card)',
                      borderColor: 'var(--border-subcard)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <WebIcon name={group.icon} className="w-5 h-5" />
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
                        {isEn ? 'Light & Dark Variants' : 'Biến thể Sáng & Tối'}
                      </span>
                    </div>
                    <p className="typo-label" style={{ color: 'var(--text-muted)' }}>
                      {isEn ? group.descriptionEn : group.description}
                    </p>
                  </div>
                </div>

                {lightPreset && darkPreset && (
                  <div
                    role="group"
                    aria-label={isEn ? `Toggle ${group.label} light and dark` : `Thanh trượt chuyển đổi ${group.label} Sáng/Tối`}
                    className="relative inline-grid grid-cols-2 p-1 rounded-full border shrink-0 min-w-[210px] shadow-xs"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subcard)' }}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-out shadow-sm ${
                        isDarkSelected
                          ? 'translate-x-full bg-gradient-to-r from-slate-800 via-sky-800 to-indigo-900 text-white border border-sky-400/30'
                          : 'translate-x-0 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white border border-white/70'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleSelectTheme(lightPreset.id, lightPreset.name)}
                      className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full typo-label font-bold cursor-pointer transition-colors ${
                        !isDarkSelected ? 'text-white font-bold' : 'hover:opacity-90'
                      }`}
                      style={isDarkSelected ? { color: 'var(--text-muted)' } : undefined}
                    >
                      <WebIcon name="sun" className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? 'Light' : 'Sáng'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTheme(darkPreset.id, darkPreset.name)}
                      className={`relative z-10 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full typo-label font-bold cursor-pointer transition-colors ${
                        isDarkSelected ? 'text-white font-bold' : 'hover:opacity-90'
                      }`}
                      style={!isDarkSelected ? { color: 'var(--text-muted)' } : undefined}
                    >
                      <WebIcon name="moon" className="w-3.5 h-3.5 shrink-0" />
                      <span>{isEn ? 'Dark' : 'Tối'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] items-stretch">
                {group.presets.map((preset) => {
                  const isActive = cardStyle === preset.id;
                  const sampleProps = getCardStyleProperties(preset.id);
                  const isLightGlass = preset.id === 'light-glassmorphism';
                  const isLightMulticolorGlass = preset.id === 'light-multicolor-glass';
                  const isLightMulticolorGlassDark = preset.id === 'light-multicolor-glass-dark';
                  const isDarkGlass = preset.id === 'dark-glassmorphism';
                  const isDarkNeonMulticolorLight = preset.id === 'dark-neon-multicolor-glass-light';
                  const isDarkNeonMulticolor = preset.id === 'dark-neon-multicolor-glass';
                  const isIceBlueNeu = preset.id === 'ice-blue-neumorphism';
                  const isDarkIceBlueNeu = preset.id === 'dark-ice-blue-neumorphism';
                  const isPastelLilac = preset.id === 'pastel-lilac-soft';
                  const isDarkPastelLilac = preset.id === 'dark-pastel-lilac-soft';
                  const isLightLeather = preset.id === 'light-cowhide-leather';
                  const isLeather = preset.id === 'cowhide-leather';
                  const cardRadius = '14px';

                  return (
                    <motion.div
                      key={preset.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isActive}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectTheme(preset.id, preset.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectTheme(preset.id, preset.name);
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
                          : isLightLeather
                            ? {
                                outline: isActive
                                  ? '2px dashed #0F172A'
                                  : '1.5px dashed rgba(15, 23, 42, 0.78)',
                                outlineOffset: '-6px',
                              }
                            : {}),
                        ...(isActive
                          ? {
                              boxShadow: isIceBlueNeu
                                ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #0284C7`
                                : isDarkIceBlueNeu
                                  ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #38BDF8`
                                  : isPastelLilac
                                    ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #8B7EF8`
                                    : isDarkPastelLilac
                                      ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #A78BFA`
                                      : isLightMulticolorGlass
                                        ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #DD4E9E`
                                        : isLightMulticolorGlassDark
                                          ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #A78BFA`
                                          : isDarkNeonMulticolorLight
                                            ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #0E7490`
                                            : isDarkNeonMulticolor
                                              ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #00E5FF, 0 0 24px rgba(0, 229, 255, 0.35)`
                                              : isLightGlass
                                                ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #0284C7`
                                                : isDarkGlass
                                                  ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #38BDF8`
                                                  : isLightLeather
                                                    ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #0F172A`
                                                    : isLeather
                                                      ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #F5DEB3`
                                                      : `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px var(--color-indigo)`,
                            }
                          : {}),
                      }}
                      className={`relative flex flex-col justify-between p-[15px] cursor-pointer transition-all duration-300 border ${preset.cardClassName} ${
                        isIceBlueNeu
                          ? isActive
                            ? 'border-sky-500/90'
                            : 'border-white/85 hover:border-sky-400/80'
                          : isDarkIceBlueNeu
                            ? isActive
                              ? 'border-sky-400/80'
                              : 'border-[#94c5f8]/15 hover:border-sky-400/45'
                            : isPastelLilac
                              ? isActive
                                ? 'border-[#8b7ef8]'
                                : 'border-white/95 hover:border-[#aba2fc]'
                              : isDarkPastelLilac
                                ? isActive
                                  ? 'border-[#a78bfa]'
                                  : 'border-[#d8ceff]/20 hover:border-[#a78bfa]/60'
                                : isLightMulticolorGlass
                                  ? isActive
                                    ? 'border-pink-500'
                                    : 'border-white/95 hover:border-pink-300'
                                  : isLightMulticolorGlassDark
                                    ? isActive
                                      ? 'border-violet-400'
                                      : 'border-violet-400/30 hover:border-pink-400/60'
                                    : isDarkNeonMulticolorLight
                                      ? isActive
                                        ? 'border-cyan-700'
                                        : 'border-cyan-600/30 hover:border-cyan-600'
                                      : isDarkNeonMulticolor
                                        ? isActive
                                          ? 'border-[#00E5FF]'
                                          : 'border-cyan-400/35 hover:border-[#00E5FF]'
                                        : isLightGlass
                                          ? isActive
                                            ? 'border-sky-500/90'
                                            : 'border-white/85 hover:border-white'
                                          : isDarkGlass
                                            ? isActive
                                              ? 'border-sky-400/90'
                                              : 'border-white/20 hover:border-sky-400/70'
                                            : isLightLeather
                                              ? isActive
                                                ? 'border-[#0F172A]'
                                                : 'border-slate-900/35 hover:border-[#0F172A]'
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
                                ? isIceBlueNeu
                                  ? 'bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#6366f1] text-white border-white/85'
                                  : isDarkIceBlueNeu
                                    ? 'bg-gradient-to-r from-[#06b6d4] via-[#6366f1] to-[#ec4899] text-white border-sky-300/60'
                                    : isPastelLilac
                                      ? 'bg-gradient-to-r from-[#8b7ef8] to-[#aba2fc] text-white border-white/85'
                                      : isDarkPastelLilac
                                        ? 'bg-gradient-to-r from-[#8b7ef8] to-[#a78bfa] text-white border-[#c4b5fd]/40'
                                        : isLightMulticolorGlass || isLightMulticolorGlassDark
                                          ? 'bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#DD4E9E] text-white border-white/85'
                                          : isDarkNeonMulticolorLight
                                            ? 'bg-gradient-to-r from-[#0E7490] via-[#2979FF] to-[#7E22CE] text-white border-white/85'
                                            : isDarkNeonMulticolor
                                              ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white border-cyan-300/70'
                                              : isLightGlass
                                                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-white/80'
                                                : isDarkGlass
                                                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-300/80'
                                                  : isLightLeather
                                                    ? 'bg-[#0F172A] text-white border-slate-900'
                                                    : isLeather
                                                      ? 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] border-[#F5DEB3]/80'
                                                      : 'bg-indigo-600 text-white border-indigo-700'
                                : preset.badgeColorClass
                            }`}
                          >
                            {isActive ? 'Đang sử dụng ✓' : preset.shortBadge}
                          </span>
                          <div
                            className="w-9 h-9 flex items-center justify-center text-white shadow-sm rounded-[14px] shrink-0"
                            style={
                              isIceBlueNeu
                                ? {
                                    background: 'linear-gradient(145deg, #edf4fa 0%, #e4eef7 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.9)',
                                    boxShadow:
                                      '5px 5px 12px rgba(176, 198, 219, 0.72), -4px -4px 10px rgba(255, 255, 255, 0.95)',
                                    color: '#0284C7',
                                  }
                                : isDarkIceBlueNeu
                                  ? {
                                      background: 'linear-gradient(145deg, #182536 0%, #121c29 100%)',
                                      border: '1px solid rgba(148, 197, 248, 0.22)',
                                      boxShadow: '5px 5px 12px #0a1018, -4px -4px 10px #203147',
                                      color: '#38BDF8',
                                    }
                                  : isPastelLilac
                                    ? {
                                        background: 'linear-gradient(135deg, #8b7ef8 0%, #aba2fc 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.9)',
                                        boxShadow: '0 8px 18px -4px rgba(139, 126, 248, 0.5)',
                                        color: '#FFFFFF',
                                      }
                                    : isDarkPastelLilac
                                      ? {
                                          background: 'linear-gradient(135deg, #8b7ef8 0%, #a78bfa 100%)',
                                          border: '1px solid rgba(216, 206, 255, 0.35)',
                                          boxShadow: '0 8px 18px -4px rgba(139, 126, 248, 0.45)',
                                          color: '#FFFFFF',
                                        }
                                      : isLightMulticolorGlass || isLightMulticolorGlassDark
                                        ? {
                                            background: 'linear-gradient(135deg, #1480C0 0%, #6353B5 52%, #DD4E9E 100%)',
                                            border: '1px solid rgba(255, 255, 255, 0.85)',
                                            boxShadow: '0 8px 18px -4px rgba(221, 78, 158, 0.35)',
                                            color: '#FFFFFF',
                                          }
                                        : isDarkNeonMulticolorLight
                                          ? {
                                              background: 'linear-gradient(135deg, #0E7490 0%, #2979FF 52%, #7E22CE 100%)',
                                              border: '1px solid rgba(255, 255, 255, 0.85)',
                                              boxShadow: '0 8px 18px -4px rgba(41, 121, 255, 0.32)',
                                              color: '#FFFFFF',
                                            }
                                          : isDarkNeonMulticolor
                                            ? {
                                                background: 'linear-gradient(135deg, #00E5FF 0%, #9D4EDD 52%, #FF3CAC 100%)',
                                                border: '1px solid rgba(0, 229, 255, 0.65)',
                                                boxShadow: '0 0 14px rgba(0, 229, 255, 0.45)',
                                                color: '#FFFFFF',
                                              }
                                            : isLightGlass
                                              ? {
                                                  background:
                                                    'linear-gradient(145deg, rgba(255, 255, 255, 0.90) 0%, rgba(224, 242, 254, 0.78) 100%)',
                                                  border: '1px solid rgba(255, 255, 255, 0.95)',
                                                  boxShadow:
                                                    '0 10px 24px -6px rgba(15, 23, 42, 0.18), inset 0 1.5px 1px rgba(255, 255, 255, 0.98)',
                                                  color: '#0284C7',
                                                }
                                              : isDarkGlass
                                                ? {
                                                    background: 'linear-gradient(135deg, #0EA5E9 0%, #4F46E5 100%)',
                                                    border: '1px solid rgba(255, 255, 255, 0.24)',
                                                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                                                  }
                                                : isLightLeather
                                                  ? {
                                                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                                                      border: '1.5px dashed rgba(255, 255, 255, 0.72)',
                                                      color: '#FFFFFF',
                                                    }
                                                  : isLeather
                                                    ? {
                                                        background: 'linear-gradient(135deg, #8B5A2B 0%, #522E10 100%)',
                                                        border: '1.5px dashed rgba(245, 222, 179, 0.65)',
                                                        color: '#FFF8DC',
                                                      }
                                                    : { backgroundColor: preset.color }
                            }
                          >
                            <WebIcon name={preset.icon} className="w-4 h-4" />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h3
                              className={`typo-h3 card-title-synced leading-snug ${
                                isIceBlueNeu || isLightGlass || isLightMulticolorGlass || isDarkNeonMulticolorLight || isPastelLilac || isLightLeather
                                  ? 'text-[#000000]'
                                  : isDarkIceBlueNeu || isDarkGlass || isDarkNeonMulticolor || isLightMulticolorGlassDark || isDarkPastelLilac
                                    ? 'text-[#FFFFFF]'
                                    : isLeather
                                      ? 'text-[#FFF8DC]'
                                      : ''
                              }`}
                              data-card-title="true"
                            >
                              {preset.name}
                            </h3>
                            <span
                              className={`typo-badge font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                                isIceBlueNeu
                                  ? 'bg-[#e5eff8] text-[#0284c7] border-white/90'
                                  : isDarkIceBlueNeu
                                    ? 'bg-[#131d2b] text-[#38bdf8] border-[#94c5f8]/25'
                                    : isPastelLilac
                                      ? 'bg-[#f4f2fa] text-[#6d5ce8] border-[#e2def3]'
                                      : isDarkPastelLilac
                                        ? 'bg-[#2a2442] text-[#c4b5fd] border-[#c4b5fd]/25'
                                        : isLightMulticolorGlass
                                          ? 'bg-white/90 text-[#000000] border-pink-200'
                                          : isLightMulticolorGlassDark
                                            ? 'bg-indigo-950/85 text-violet-200 border-violet-400/35'
                                            : isDarkNeonMulticolorLight
                                              ? 'bg-cyan-50/90 text-cyan-800 border-cyan-600/30'
                                              : isDarkNeonMulticolor
                                                ? 'bg-slate-950/85 text-[#00E5FF] border-cyan-400/40'
                                                : isLightGlass
                                                  ? 'bg-white/80 text-[#000000] border-white/95'
                                                  : isDarkGlass
                                                    ? 'bg-slate-800/80 text-white border-white/20'
                                                    : isLightLeather
                                                      ? 'bg-slate-100 text-[#000000] border-slate-900/35'
                                                      : isLeather
                                                        ? 'bg-[#522E10]/85 text-[#F5DEB3] border-[#F5DEB3]/45'
                                                        : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                              }`}
                            >
                              {preset.modeLabel}
                            </span>
                          </div>
                          <p
                            className={`typo-body-sm leading-relaxed font-medium ${
                              isIceBlueNeu || isLightGlass || isLightMulticolorGlass || isDarkNeonMulticolorLight || isPastelLilac || isLightLeather
                                ? 'text-[#000000]'
                                : isDarkIceBlueNeu || isDarkGlass || isDarkNeonMulticolor || isLightMulticolorGlassDark || isDarkPastelLilac
                                  ? 'text-[#FFFFFF]'
                                  : isLeather
                                    ? 'text-[#F5DEB3]'
                                    : 'text-slate-600'
                            }`}
                          >
                            {preset.desc}
                          </p>
                        </div>
                      </div>

                      {/* Mẫu hiển thị trực quan mini card / module */}
                      <div
                        style={preset.miniPreviewWrapStyle}
                        className={`my-3 p-2.5 flex flex-col gap-2 transition-all shadow-2xs rounded-[14px] border ${
                          isIceBlueNeu
                            ? 'ice-neu-inset border-white/85 rounded-[14px]'
                            : isDarkIceBlueNeu
                              ? 'dark-ice-neu-inset border-[#94c5f8]/15 rounded-[14px]'
                              : isPastelLilac
                                ? 'lilac-soft-module border-[#e2def3]/80'
                                : isDarkPastelLilac
                                  ? 'dark-lilac-soft-module border-[#c4b5fd]/15'
                                  : isLightMulticolorGlass
                                    ? 'border-white/95'
                                    : isLightMulticolorGlassDark
                                      ? 'border-violet-400/28'
                                      : isDarkNeonMulticolorLight
                                        ? 'border-cyan-600/25'
                                        : isDarkNeonMulticolor
                                          ? 'border-cyan-400/35'
                                          : isLightGlass
                                            ? 'border-white/90'
                                            : isDarkGlass
                                              ? 'border-white/20'
                                              : isLightLeather
                                                ? 'border-[#0F172A]/70 border-dashed'
                                                : isLeather
                                                  ? 'border-[#F5DEB3]/45 border-dashed'
                                                  : 'bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-between typo-label font-bold ${
                            isIceBlueNeu || isLightGlass || isLightMulticolorGlass || isDarkNeonMulticolorLight || isPastelLilac || isLightLeather
                              ? 'text-[#000000]'
                              : isDarkIceBlueNeu || isDarkGlass || isDarkNeonMulticolor || isLightMulticolorGlassDark || isDarkPastelLilac
                                ? 'text-[#FFFFFF]'
                                : isLeather
                                  ? 'text-[#FFF8DC]'
                                  : 'text-[#334155]'
                          }`}
                        >
                          <span>Mẫu hiển thị</span>
                          <span
                            className={`font-mono typo-label ${
                              isIceBlueNeu || isLightGlass
                                ? 'text-[#0284c7]'
                                : isLightMulticolorGlass
                                  ? 'text-[#db2777]'
                                  : isLightMulticolorGlassDark
                                    ? 'text-[#A78BFA]'
                                    : isDarkNeonMulticolorLight
                                      ? 'text-[#0E7490]'
                                      : isDarkNeonMulticolor
                                        ? 'text-[#00E5FF]'
                                        : isDarkIceBlueNeu || isDarkGlass
                                          ? 'text-sky-300'
                                          : isPastelLilac
                                            ? 'text-[#6d5ce8]'
                                            : isDarkPastelLilac
                                              ? 'text-[#c4b5fd]'
                                              : isLightLeather
                                                ? 'text-[#0F172A]'
                                                : isLeather
                                                  ? 'text-[#F5DEB3]'
                                                  : 'text-[#475569]'
                            }`}
                          >
                            {preset.shortBadge}
                          </span>
                        </div>
                        {(isIceBlueNeu || isDarkIceBlueNeu) && (
                          <div className="grid grid-cols-4 gap-1.5 py-0.5">
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkIceBlueNeu ? 'bg-[#0e1622]' : 'bg-[#dce8f3]'
                              }`}
                            >
                              <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#06b6d4] to-[#22d3ee] shadow-[0_0_8px_rgba(34,211,238,0.75)]" />
                            </div>
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkIceBlueNeu ? 'bg-[#0e1622]' : 'bg-[#dce8f3]'
                              }`}
                            >
                              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] shadow-[0_0_8px_rgba(168,85,247,0.75)]" />
                            </div>
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkIceBlueNeu ? 'bg-[#0e1622]' : 'bg-[#dce8f3]'
                              }`}
                            >
                              <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#f97316] to-[#fb923c] shadow-[0_0_8px_rgba(251,146,60,0.75)]" />
                            </div>
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkIceBlueNeu ? 'bg-[#0e1622]' : 'bg-[#dce8f3]'
                              }`}
                            >
                              <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-[#ec4899] to-[#f472b6] shadow-[0_0_8px_rgba(244,114,182,0.75)]" />
                            </div>
                          </div>
                        )}
                        {(isLightMulticolorGlass || isLightMulticolorGlassDark || isDarkNeonMulticolor || isDarkNeonMulticolorLight) && (
                          <div className="grid grid-cols-5 gap-1.5 py-0.5">
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#9D4EDD] to-[#DD4E9E]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#FF3CAC] to-[#EC7D21]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#50B347] to-[#3BB8E6]" />
                            <div className="h-2 rounded-full bg-gradient-to-r from-[#FFDF25] to-[#A3D43A]" />
                          </div>
                        )}
                        {(isPastelLilac || isDarkPastelLilac) && (
                          <div className="grid grid-cols-3 gap-1.5 py-0.5">
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkPastelLilac ? 'bg-[#1a162b]' : 'bg-[#ebe7f7]'
                              }`}
                            >
                              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-[#8b7ef8] to-[#aba2fc]" />
                            </div>
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkPastelLilac ? 'bg-[#1a162b]' : 'bg-[#ebe7f7]'
                              }`}
                            >
                              <div className="h-full w-[74%] rounded-full bg-gradient-to-r from-[#fb923c] to-[#fdba74]" />
                            </div>
                            <div
                              className={`h-2 rounded-full p-[1px] overflow-hidden ${
                                isDarkPastelLilac ? 'bg-[#1a162b]' : 'bg-[#ebe7f7]'
                              }`}
                            >
                              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-[#f472b6] to-[#f9a8d4]" />
                            </div>
                          </div>
                        )}
                        {isLightGlass && (
                          <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent my-0.5" />
                        )}
                        {isDarkGlass && (
                          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent my-0.5" />
                        )}
                        {isLightLeather && (
                          <div className="w-full border-t border-dashed border-[#0F172A]/80 my-0.5" />
                        )}
                        {isLeather && (
                          <div className="w-full border-t border-dashed border-[#F5DEB3]/55 my-0.5" />
                        )}
                        <div className="flex items-center gap-1.5">
                          <span
                            style={preset.miniTabStyle}
                            className={`px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] border ${
                              isIceBlueNeu || isLightGlass || isLightMulticolorGlass || isDarkNeonMulticolorLight || isPastelLilac || isLightLeather
                                ? 'text-[#000000]'
                                : isDarkIceBlueNeu || isDarkGlass || isDarkNeonMulticolor || isLightMulticolorGlassDark || isDarkPastelLilac
                                  ? 'text-[#FFFFFF] border-white/20'
                                  : isLeather
                                    ? 'text-[#FFF8DC] border-[#F5DEB3]/45'
                                    : 'bg-white/95 text-slate-800 border-slate-200/70'
                            }`}
                          >
                            Tab Mẫu
                          </span>
                          <span
                            style={preset.miniBtnStyle}
                            className={`px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] text-white ${
                              isPastelLilac
                                ? 'lilac-soft-btn'
                                : isDarkPastelLilac
                                  ? 'dark-lilac-soft-btn'
                                  : ''
                            }`}
                          >
                            Nút Áp Dụng
                          </span>
                        </div>
                      </div>

                      <div
                        className={`mt-auto pt-2 flex items-center justify-between border-t ${
                          isIceBlueNeu || isLightGlass || isLightMulticolorGlass
                            ? 'border-white/75'
                            : isDarkIceBlueNeu
                              ? 'border-[#94c5f8]/15'
                              : isLightMulticolorGlassDark
                                ? 'border-violet-400/25'
                                : isDarkNeonMulticolorLight
                                  ? 'border-cyan-600/25'
                                  : isDarkNeonMulticolor
                                    ? 'border-cyan-400/25'
                                    : isPastelLilac
                                      ? 'border-[#e2def3]'
                                      : isDarkPastelLilac
                                        ? 'border-[#c4b5fd]/20'
                                        : isDarkGlass
                                          ? 'border-white/15'
                                          : isLightLeather
                                            ? 'border-[#0F172A]/45 border-dashed'
                                            : isLeather
                                              ? 'border-[#F5DEB3]/30 border-dashed'
                                              : 'border-slate-200/80'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectTheme(preset.id, preset.name);
                          }}
                          className={`typo-button font-bold px-3 py-1.5 transition-all rounded-[14px] border flex items-center gap-1 cursor-pointer ${
                            isIceBlueNeu
                              ? 'bg-[#e6f0f8] text-[#000000] border-white/90 hover:bg-white shadow-2xs'
                              : isDarkIceBlueNeu
                                ? 'bg-[#131d2b] text-[#FFFFFF] border-[#94c5f8]/25 hover:bg-[#1e2e43]'
                                : isPastelLilac
                                  ? 'bg-[#f4f2fa] text-[#000000] border-[#e2def3] hover:bg-white shadow-2xs'
                                  : isDarkPastelLilac
                                    ? 'bg-[#2a2442] text-[#FFFFFF] border-[#c4b5fd]/25 hover:bg-[#332c50]'
                                    : isLightMulticolorGlass
                                      ? 'bg-white/90 text-[#000000] border-white hover:bg-white shadow-2xs'
                                      : isLightMulticolorGlassDark
                                        ? 'bg-indigo-950/90 text-[#FFFFFF] border-violet-400/35 hover:bg-indigo-900'
                                        : isDarkNeonMulticolorLight
                                          ? 'bg-white/90 text-[#0E7490] border-cyan-600/30 hover:bg-white shadow-2xs'
                                          : isDarkNeonMulticolor
                                            ? 'bg-slate-900/90 text-[#00E5FF] border-cyan-400/40 hover:bg-slate-800'
                                            : isDarkGlass
                                              ? 'bg-slate-800/80 text-white border-white/20 hover:bg-slate-700'
                                              : isLightGlass
                                                ? 'bg-white/80 text-[#000000] border-white/95 hover:bg-white shadow-2xs'
                                                : isLightLeather
                                                  ? 'bg-slate-100 text-[#000000] border-slate-900/40 hover:bg-white'
                                                  : isLeather
                                                    ? 'bg-[#522E10]/85 text-[#FFF8DC] border-[#F5DEB3]/40 hover:bg-[#3D210B]'
                                                    : 'bg-slate-100 text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          <WebIcon name="eye" className="w-3.5 h-3.5" />
                          <span>Xem thử</span>
                        </button>

                        <span
                          style={{ borderRadius: '999px' }}
                          className={`typo-button font-bold px-3.5 py-1.5 transition-all rounded-full ${
                            isActive
                              ? isIceBlueNeu
                                ? 'bg-gradient-to-r from-[#0284c7] to-[#6366f1] text-white shadow-xs border border-white/85'
                                : isDarkIceBlueNeu
                                  ? 'bg-gradient-to-r from-[#06b6d4] to-[#6366f1] text-white shadow-xs border border-sky-300/40'
                                  : isPastelLilac
                                    ? 'lilac-soft-btn text-white border border-white/85'
                                    : isDarkPastelLilac
                                      ? 'dark-lilac-soft-btn text-white border border-[#c4b5fd]/35'
                                      : isLightMulticolorGlass || isLightMulticolorGlassDark
                                        ? 'bg-gradient-to-r from-[#1480C0] via-[#6353B5] to-[#DD4E9E] text-white shadow-xs border border-white/85'
                                        : isDarkNeonMulticolorLight
                                          ? 'bg-gradient-to-r from-[#0E7490] via-[#2979FF] to-[#7E22CE] text-white shadow-xs border border-white/85'
                                          : isDarkNeonMulticolor
                                            ? 'bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-xs border border-cyan-300/60'
                                            : isLightGlass
                                              ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs border border-white/85'
                                              : isDarkGlass
                                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs border border-white/25'
                                                : isLightLeather
                                                  ? 'bg-[#0F172A] text-white shadow-xs border border-slate-900'
                                                  : isLeather
                                                    ? 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] shadow-xs border border-[#F5DEB3]/60'
                                                    : 'bg-indigo-600 text-white shadow-xs'
                              : isIceBlueNeu
                                ? 'bg-[#e5eff8] text-[#000000] hover:bg-white border border-white/90'
                                : isDarkIceBlueNeu
                                  ? 'bg-[#131d2b] text-[#FFFFFF] hover:bg-[#1e2e43] border border-[#94c5f8]/20'
                                  : isPastelLilac
                                    ? 'bg-[#f4f2fa] text-[#000000] hover:bg-white border border-[#e2def3]'
                                    : isDarkPastelLilac
                                      ? 'bg-[#2a2442] text-[#FFFFFF] hover:bg-[#332c50] border border-[#c4b5fd]/20'
                                      : isLightMulticolorGlass
                                        ? 'bg-white/90 text-[#000000] hover:bg-white border border-white'
                                        : isLightMulticolorGlassDark
                                          ? 'bg-indigo-950/90 text-[#FFFFFF] hover:bg-indigo-900 border border-violet-400/30'
                                          : isDarkNeonMulticolorLight
                                            ? 'bg-white/90 text-[#000000] hover:bg-white border border-cyan-600/30'
                                            : isDarkNeonMulticolor
                                              ? 'bg-slate-900/90 text-[#FFFFFF] hover:bg-slate-800 border border-cyan-400/35'
                                              : isDarkGlass
                                                ? 'bg-slate-800/90 text-white hover:bg-slate-700 border border-white/15'
                                                : isLightGlass
                                                  ? 'bg-white/75 text-[#000000] hover:bg-white border border-white/90'
                                                  : isLightLeather
                                                    ? 'bg-slate-100 text-[#000000] hover:bg-white border border-slate-900/35'
                                                    : isLeather
                                                      ? 'bg-[#522E10]/90 text-[#FFF8DC] hover:bg-[#3D210B] border border-[#F5DEB3]/35'
                                                      : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
                          }`}
                        >
                          {isActive ? 'Đang dùng' : 'Chọn'}
                        </span>
                        {isActive && (
                          <div
                            className={`w-6 h-6 rounded-full text-white flex items-center justify-center typo-label font-bold shadow-xs ${
                              isIceBlueNeu || isLightGlass
                                ? 'bg-sky-600'
                                : isDarkIceBlueNeu || isDarkGlass
                                  ? 'bg-sky-500'
                                  : isLightMulticolorGlass || isLightMulticolorGlassDark
                                    ? 'bg-pink-600'
                                    : isDarkNeonMulticolorLight
                                      ? 'bg-cyan-700'
                                      : isDarkNeonMulticolor
                                        ? 'bg-cyan-500 text-slate-950'
                                        : isPastelLilac || isDarkPastelLilac
                                          ? 'bg-[#8b7ef8]'
                                          : isLightLeather
                                            ? 'bg-[#0F172A] text-white'
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
  );
};

export default InterfaceView;
