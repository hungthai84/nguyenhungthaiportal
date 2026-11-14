'use client';

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

  const rawCardStyle = getCardStyleProperties(cardStyle);
  const { borderRadius: _, background: __, backgroundColor: ___, backgroundImage: ____, ...cardSampleStyle } = rawCardStyle as any;

  return (
    <div
      id="interface-page-container"
      data-element-name="Trang Cấu Hình Giao Diện & Kiểu Thẻ"
      data-element-type="card"
      data-section-card="true"
      data-element-page="interface"
      style={{
        ...cardSampleStyle,
        borderRadius: '14px',
        padding: '15px',
        gap: '15px',
      }}
      className="bento-card glass-card w-full h-full flex flex-col p-[15px] gap-[15px] overflow-y-auto no-scrollbar font-play select-none text-left animate-fadeIn rounded-[14px]"
    >
      {/* Banner Giao diện format giống Banner Học Vấn (h-[200px], p-[15px], rounded-[14px]) */}
      <section
        id="interface-hero-banner"
        data-element-name="Banner chính trang Giao diện"
        data-element-type="section"
        data-element-page="interface"
        data-element-parent="interface-page-container"
        data-section-card="true"
        className="banner-card hero-banner w-full max-w-full lg:h-[200px] lg:min-h-[200px] lg:max-h-[200px] mx-auto rounded-[14px] overflow-hidden relative border border-white/80 dark:border-cyan-400/40 shadow-[0_10px_30px_rgba(15,23,42,0.12)] shrink-0 flex flex-col justify-between p-[15px] z-20 backdrop-blur-xl"
        style={{ padding: '15px', width: '100%', maxWidth: '100%', borderRadius: '14px' }}
      >
        <div
          className="absolute inset-0 z-0 rounded-[14px] overflow-hidden pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #4c1d95 100%)',
            borderRadius: '14px',
          }}
        >
          <img
            src="https://res.cloudinary.com/q5tpzaxk/image/upload/v1793591948/T%E1%BB%AD_vi.png"
            alt="Banner Giao Diện & Kiểu Thẻ"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            className="w-full h-full object-cover object-center opacity-100 brightness-105 contrast-105 saturate-110 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/70 pointer-events-none" />
        </div>
        
        <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 w-full">
          <div className="flex items-center gap-2 min-w-0">
            <WebIcon
              name="layers"
              className="w-[22px] h-[22px] shrink-0 bg-transparent border-0 p-0 shadow-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] text-[#818cf8]"
              style={{ color: '#818cf8', width: '22px', height: '22px', fontSize: '22px', fontWeight: 'bold' }}
            />
            <h1
              className="typo-h1 font-bold font-play not-italic tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] text-[#818cf8] truncate"
              style={{ color: '#818cf8', fontWeight: 700, textTransform: 'none', fontStyle: 'normal' }}
            >
              Cấu hình phong cách – Theme Presets
            </h1>
          </div>
          <p
            className="font-handwriting font-italianno not-italic text-[20px] sm:text-[24px] md:text-[28px] font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] select-none text-left md:text-right md:ml-auto whitespace-normal overflow-hidden text-ellipsis md:max-w-[50%]"
            style={{ color: '#ffff18', fontFamily: "'Italianno', cursive, sans-serif", fontWeight: 700, fontStyle: 'normal' }}
          >
            &quot;Quản lý và chuyển đổi phong cách hiển thị toàn diện ♡&quot;
          </p>
        </div>
      </section>

      {/* Danh sách các giao diện độc lập */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] flex-1 items-stretch">
        {CARD_STYLE_PRESETS_LIST.map((preset) => {
          const isActive = cardStyle === preset.id;
          const sampleProps = getCardStyleProperties(preset.id);
          const isNeonDark = preset.id === 'glassmorphism-neon';
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
                        : isLeather
                          ? `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px #F5DEB3`
                          : `${(sampleProps as any).boxShadow || ''}, 0 0 0 3px var(--color-indigo)`,
                    }
                  : {}),
              }}
              className={`relative flex flex-col justify-between p-[15px] cursor-pointer transition-all duration-300 border-2 rounded-[14px] ${
                isNeonDark
                  ? isActive
                    ? 'border-cyan-400 shadow-[0_0_28px_rgba(34,211,238,0.35)]'
                    : 'border-fuchsia-400/45 hover:border-cyan-400'
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
                      className={`typo-h3 leading-snug ${
                        isNeonDark ? 'text-cyan-300' : isLeather ? 'text-[#FFF8DC]' : ''
                      }`}
                      style={!isNeonDark && !isLeather ? { color: preset.color } : undefined}
                    >
                      {preset.name}
                    </h3>
                    <span
                      className={`typo-badge font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        isNeonDark
                          ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400/50'
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
                      isNeonDark
                        ? 'text-slate-200'
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
                    : isLeather
                      ? 'border-[#F5DEB3]/45 border-dashed'
                      : 'bg-slate-100/80 border-slate-200/80'
                }`}
              >
                <div
                  className={`flex items-center justify-between typo-label font-bold ${
                    isNeonDark ? 'text-cyan-200' : isLeather ? 'text-[#FFF8DC]' : 'text-[#334155]'
                  }`}
                >
                  <span>Mẫu hiển thị</span>
                  <span
                    className={`font-mono typo-label ${
                      isNeonDark ? 'text-fuchsia-300' : isLeather ? 'text-[#F5DEB3]' : 'text-[#475569]'
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
                {isLeather && (
                  <div className="w-full border-t border-dashed border-[#F5DEB3]/55 my-0.5" />
                )}
                <div className="flex items-center gap-1.5">
                  <span
                    style={preset.miniTabStyle}
                    className={`px-2 py-1 typo-label font-bold flex-1 text-center truncate shadow-2xs rounded-[14px] border ${
                      isNeonDark
                        ? 'text-cyan-200 border-cyan-400/40'
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
                      isNeonDark ? 'text-white' : isLeather ? 'text-[#FFF8DC]' : 'bg-indigo-600 text-white'
                    }`}
                  >
                    Nút Áp Dụng
                  </span>
                </div>
              </div>

              <div
                className={`mt-auto pt-2 flex items-center justify-between border-t ${
                  isNeonDark
                    ? 'border-white/15'
                    : isLeather
                      ? 'border-[#F5DEB3]/30 border-dashed'
                      : 'border-slate-200/80'
                }`}
              >
                <span
                  style={{ borderRadius: '999px' }}
                  className={`typo-button font-bold px-3.5 py-1.5 transition-all rounded-full ${
                    isActive
                      ? isNeonDark
                        ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-xs'
                        : isLeather
                          ? 'bg-gradient-to-r from-[#D97706] to-[#92400E] text-[#FFF8DC] shadow-xs border border-[#F5DEB3]/60'
                          : 'bg-indigo-600 text-white shadow-xs'
                      : isNeonDark
                        ? 'bg-slate-800/90 text-cyan-100 hover:bg-slate-700'
                        : isLeather
                          ? 'bg-[#522E10]/90 text-[#FFF8DC] hover:bg-[#3D210B] border border-[#F5DEB3]/35'
                          : 'bg-slate-100 text-slate-700 hover:bg-indigo-50'
                  }`}
                >
                  {isActive ? 'Đang sử dụng' : 'Chọn phong cách'}
                </span>
                {isActive && (
                  <div
                    className={`w-6 h-6 rounded-[14px] text-white flex items-center justify-center typo-label font-bold shadow-xs ${
                      isNeonDark
                        ? 'bg-cyan-500'
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
  );
};

export default InterfaceView;
