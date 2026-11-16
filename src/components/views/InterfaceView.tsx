import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme, getCardStyleProperties, CARD_STYLE_PRESETS_LIST } from '@/hooks/useTheme';
import { CardStyleMode } from '@/config/ui/theme.types';
import { motion } from 'motion/react';
import { useLanguage } from '@/context/LanguageContext';

export interface InterfaceViewProps {
  onShowNotification?: (msg: string) => void;
}

export const InterfaceView: React.FC<InterfaceViewProps> = ({ onShowNotification }) => {
  const { cardStyle, setCardStyle } = useTheme();
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const handleSelectTheme = (mode: CardStyleMode, label: string) => {
    SoundEngine.playGlassChime();
    setCardStyle(mode);
    if (onShowNotification) {
      onShowNotification(
        isEn ? `✓ Applied style: ${t(label)}` : `✓ Đã áp dụng phong cách: ${label}`
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
      className="main-card bento-card glass-card w-full min-w-0 h-full mx-auto flex flex-col justify-start p-[25px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[20px] box-border"
    >
      {/* Danh sách các giao diện độc lập */}
      <div className="flex flex-col gap-3">
        <h3 className="typo-h3 font-bold tracking-tight">
          {isEn
            ? `Available Theme Presets (${CARD_STYLE_PRESETS_LIST.length} Themes)`
            : `Danh sách ${CARD_STYLE_PRESETS_LIST.length} phong cách giao diện hệ thống`}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] items-stretch">
          {CARD_STYLE_PRESETS_LIST.map((preset) => {
            const isActive = cardStyle === preset.id;
            const sampleProps = getCardStyleProperties(preset.id);
            const isNeonDark = false;
            const isLightGlass = preset.id === 'light-glassmorphism';
            const isDarkFrosted = preset.id === 'dark-frosted-glass' || preset.id === 'dark-glassmorphism';
            const isLeather = preset.id === 'cowhide-leather';

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
                  borderRadius: '14px',
                  padding: '15px',
                  ...(isLeather
                    ? {
                        outline: isActive
                          ? '2px dashed #FFF8DC'
                          : '1.5px dashed rgba(245, 222, 179, 0.58)',
                        outlineOffset: '-7px',
                      }
                    : {}),
                  ...(isActive
                    ? {
                        boxShadow: isNeonDark
                          ? '0 12px 32px rgba(6, 182, 212, 0.35), 0 0 0 3px #22D3EE'
                          : isLightGlass
                            ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #0284C7`
                            : isDarkFrosted
                              ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #38BDF8`
                              : isLeather
                                ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #F5DEB3`
                                : `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px var(--color-indigo)`,
                      }
                    : {}),
                }}
                className={`relative flex flex-col justify-between p-[15px] cursor-pointer transition-all duration-300 border rounded-[14px] ${
                  isDarkFrosted ? 'card-dark-glassmorphism' : ''
                } ${isLightGlass ? 'card-light-glassmorphism' : ''} ${
                  isNeonDark
                    ? isActive
                      ? 'border-cyan-400 shadow-[0_0_28px_rgba(34,211,238,0.35)]'
                      : 'border-fuchsia-400/45 hover:border-cyan-400'
                    : isLightGlass
                      ? isActive
                        ? 'border-sky-500/90'
                        : 'border-white/85 hover:border-white'
                      : isDarkFrosted
                        ? isActive
                          ? 'border-sky-400/90'
                          : 'border-white/20 hover:border-sky-400/70'
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
                          ? isNeonDark
                            ? 'bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 text-white border-cyan-300'
                            : isLightGlass
                              ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white border-white/80'
                              : isDarkFrosted
                                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-sky-300/80'
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
                        isNeonDark
                          ? {
                              background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)',
                              boxShadow: '0 0 14px rgba(236, 72, 153, 0.55)',
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
                            : isDarkFrosted
                              ? {
                                  background: 'linear-gradient(135deg, #0EA5E9 0%, #4F46E5 100%)',
                                  border: '1px solid rgba(255, 255, 255, 0.24)',
                                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.25)',
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
                          isNeonDark
                            ? 'text-cyan-300'
                            : isLightGlass
                              ? 'text-[#0f172a]'
                              : isDarkFrosted
                                ? 'text-[#f8fafc]'
                                : isLeather
                                  ? 'text-[#FFF8DC]'
                                  : ''
                        }`}
                        data-card-title="true"
                        style={
                          !isNeonDark && !isLightGlass && !isDarkFrosted && !isLeather
                            ? { color: preset.color }
                            : undefined
                        }
                      >
                        {preset.name}
                      </h3>
                      <span
                        className={`typo-badge font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                          isNeonDark
                            ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
                            : isLightGlass
                              ? 'bg-white/80 text-[#0f172a] border-white/95'
                              : isDarkFrosted
                                ? 'bg-slate-800/80 text-slate-100 border-white/20'
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
                        isNeonDark || isDarkFrosted
                          ? 'text-slate-200'
                          : isLightGlass
                            ? 'text-[#0f172a]/85'
                            : isLeather
                              ? 'text-[#F5DEB3]'
                              : 'text-slate-600'
                      }`}
                    >
                      {preset.desc}
                    </p>
                  </div>
                </div>

                {/* Mẫu hiển thị trực quan mini card / tab */}
                <div
                  style={preset.miniPreviewWrapStyle}
                  className={`my-3 p-2.5 flex flex-col gap-2 transition-all shadow-2xs rounded-[14px] border ${
                    isNeonDark
                      ? 'border-cyan-400/40'
                      : isLightGlass
                        ? 'border-white/90'
                        : isDarkFrosted
                          ? 'border-white/20'
                          : isLeather
                            ? 'border-[#F5DEB3]/45 border-dashed'
                            : 'bg-slate-100/80 border-slate-200/80'
                  }`}
                >
                  <div
                    className={`flex items-center justify-between typo-label font-bold ${
                      isNeonDark
                        ? 'text-cyan-200'
                        : isLightGlass
                          ? 'text-[#0f172a]'
                          : isDarkFrosted
                            ? 'text-[#f8fafc]'
                            : isLeather
                              ? 'text-[#FFF8DC]'
                              : 'text-[#334155]'
                    }`}
                  >
                    <span>Mẫu hiển thị</span>
                    <span
                      className={`font-mono typo-label ${
                        isNeonDark
                          ? 'text-fuchsia-300'
                          : isLightGlass
                            ? 'text-[#0284c7]'
                            : isDarkFrosted
                              ? 'text-sky-300'
                              : isLeather
                                ? 'text-[#F5DEB3]'
                                : 'text-[#475569]'
                      }`}
                    >
                      {preset.shortBadge}
                    </span>
                  </div>
                  {isNeonDark && (
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 flex-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
                      <span className="h-1.5 flex-1 rounded-full bg-fuchsia-400 shadow-[0_0_8px_#F472B6]" />
                      <span className="h-1.5 flex-1 rounded-full bg-violet-400 shadow-[0_0_8px_#C084FC]" />
                      <span className="h-1.5 flex-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
                    </div>
                  )}
                  {isLightGlass && (
                    <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent my-0.5" />
                  )}
                  {isDarkFrosted && (
                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent my-0.5" />
                  )}
                  {isLeather && (
                    <div className="w-full border-t border-dashed border-[#F5DEB3]/55 my-0.5" />
                  )}
                  <div className="flex items-center gap-1.5">
                    <span
                      style={preset.miniTabStyle}
                      className={`px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] border ${
                        isNeonDark
                          ? 'text-cyan-200 border-cyan-400/40'
                          : isLightGlass
                            ? 'text-[#0f172a] border-white/95'
                            : isDarkFrosted
                              ? 'text-[#f8fafc] border-white/20'
                              : isLeather
                                ? 'text-[#FFF8DC] border-[#F5DEB3]/45'
                                : 'bg-white/95 text-slate-800 border-slate-200/70'
                      }`}
                    >
                      Tab Mẫu
                    </span>
                    <span
                      style={preset.miniBtnStyle}
                      className={`px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] ${
                        isNeonDark || isDarkFrosted || isLightGlass
                          ? 'text-white'
                          : isLeather
                            ? 'text-[#FFF8DC]'
                            : 'bg-indigo-600 text-white'
                      }`}
                    >
                      Nút Áp Dụng
                    </span>
                  </div>
                </div>

                <div
                  className={`mt-auto pt-2 flex items-center justify-between border-t ${
                    isNeonDark || isDarkFrosted
                      ? 'border-white/15'
                      : isLightGlass
                        ? 'border-white/75'
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
                    className={`typo-button font-bold px-3 py-1.5 transition-all rounded-xl border flex items-center gap-1 cursor-pointer ${
                      isNeonDark || isDarkFrosted
                        ? 'bg-slate-800/80 text-sky-300 border-white/20 hover:bg-slate-700'
                        : isLightGlass
                          ? 'bg-white/80 text-[#0f172a] border-white/95 hover:bg-white shadow-2xs'
                          : isLeather
                            ? 'bg-[#522E10]/85 text-[#F5DEB3] border-[#F5DEB3]/40 hover:bg-[#3D210B]'
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
                        ? isNeonDark
                          ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-xs'
                          : isLightGlass
                            ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-xs border border-white/85'
                            : isDarkFrosted
                              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-xs border border-white/25'
                              : isLeather
                                ? 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] shadow-xs border border-[#F5DEB3]/60'
                                : 'bg-indigo-600 text-white shadow-xs'
                        : isNeonDark || isDarkFrosted
                          ? 'bg-slate-800/90 text-slate-100 hover:bg-slate-700 border border-white/15'
                          : isLightGlass
                            ? 'bg-white/75 text-[#0f172a] hover:bg-white border border-white/90'
                            : isLeather
                              ? 'bg-[#522E10]/90 text-[#FFF8DC] hover:bg-[#3D210B] border border-[#F5DEB3]/35'
                              : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
                    }`}
                  >
                    {isActive ? 'Đang dùng' : 'Chọn'}
                  </span>
                  {isActive && (
                    <div
                      className={`w-6 h-6 rounded-[14px] text-white flex items-center justify-center typo-label font-bold shadow-xs ${
                        isNeonDark
                          ? 'bg-cyan-500'
                          : isLightGlass
                            ? 'bg-sky-600'
                            : isDarkFrosted
                              ? 'bg-sky-500'
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
      </div>
    </div>
  );
};

export default InterfaceView;
