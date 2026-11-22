import React, { useMemo, useState } from 'react';
import {
  AdaptiveAccentPalette,
  CardStyleMode,
  ThemeWallpaperPreset,
  WallpaperOverlaySettings,
} from '@/config/ui/theme.types';
import { WallpaperPreset, getCleanImageUrl, getWallpaperThumbnailUrl } from '@/data/wallpapers';
import { CARD_STYLES_MAP, getLightDarkCounterpart } from '@/config/ui/cardStyles';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';

export type SmartFilterCategory = 'all' | 'video' | 'webgl' | 'minimal' | 'custom';

export interface WallpaperStudioControlsProps {
  isEn: boolean;
  isDark: boolean;
  cardStyle: CardStyleMode;
  activeWallpaper: WallpaperPreset;
  previewWallpaper: WallpaperPreset | null;
  filterType: SmartFilterCategory;
  onChangeFilter: (cat: SmartFilterCategory) => void;
  filterCounts: Record<SmartFilterCategory, number>;
  liveHoverPreview: boolean;
  onToggleLiveHoverPreview: () => void;
  wallpaperOverlay: WallpaperOverlaySettings;
  onUpdateOverlay: (patch: Partial<WallpaperOverlaySettings>) => void;
  onResetOverlay: () => void;
  adaptiveAccentEnabled: boolean;
  onToggleAdaptiveAccent: (enabled: boolean) => void;
  suggestedAccent: AdaptiveAccentPalette | null;
  onSyncContrastMode: (targetDark: boolean) => void;
  presets: ThemeWallpaperPreset[];
  onApplyPreset: (preset: ThemeWallpaperPreset) => void;
  onSaveCurrentPreset: (customName: string) => void;
  onDeletePreset: (presetId: string) => void;
}

export const WallpaperStudioControls: React.FC<WallpaperStudioControlsProps> = ({
  isEn,
  isDark,
  cardStyle,
  activeWallpaper,
  previewWallpaper,
  filterType,
  onChangeFilter,
  filterCounts,
  liveHoverPreview,
  onToggleLiveHoverPreview,
  wallpaperOverlay,
  onUpdateOverlay,
  onResetOverlay,
  adaptiveAccentEnabled,
  onToggleAdaptiveAccent,
  suggestedAccent,
  onSyncContrastMode,
  presets,
  onApplyPreset,
  onSaveCurrentPreset,
  onDeletePreset,
}) => {
  const [isStudioExpanded, setIsStudioExpanded] = useState<boolean>(true);
  const [presetNameInput, setPresetNameInput] = useState<string>('');

  const inspectedWallpaper = previewWallpaper || activeWallpaper;
  const activeThemeMeta = CARD_STYLES_MAP[cardStyle];

  const smartFilterTabs: Array<{
    id: SmartFilterCategory;
    label: string;
    icon: string;
    count: number;
  }> = useMemo(
    () => [
      { id: 'all', label: isEn ? 'All' : 'Tất cả', icon: 'grid', count: filterCounts.all },
      { id: 'video', label: isEn ? 'Motion Video' : 'Video động', icon: 'video', count: filterCounts.video },
      { id: 'webgl', label: isEn ? 'WebGL 3D' : 'Hiệu ứng WebGL', icon: 'sparkles', count: filterCounts.webgl },
      { id: 'minimal', label: isEn ? 'Minimal Static' : 'Tĩnh tối giản', icon: 'image', count: filterCounts.minimal },
      { id: 'custom', label: isEn ? 'Personal Uploads' : 'Cá nhân tải lên', icon: 'upload', count: filterCounts.custom },
    ],
    [isEn, filterCounts]
  );

  const contrastMismatch = useMemo(() => {
    if (!suggestedAccent) return false;
    const counterpart = getLightDarkCounterpart(cardStyle, suggestedAccent.recommendedDark);
    return counterpart !== cardStyle && suggestedAccent.recommendedDark !== isDark;
  }, [suggestedAccent, cardStyle, isDark]);

  const handleSavePresetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    SoundEngine.playPop();
    const wpShort = activeWallpaper.name
      .replace(/^[^\p{L}\p{N}]+/u, '')
      .trim()
      .split(/\s+/)
      .slice(0, 3)
      .join(' ');
    const fallbackName = `${activeThemeMeta?.shortBadge || cardStyle} + ${wpShort || 'Nền'}`;
    onSaveCurrentPreset(presetNameInput.trim() || fallbackName);
    setPresetNameInput('');
  };

  return (
    <section
      id="wallpaper-studio-controls"
      data-element-name="Thanh lọc thông minh và cấu hình nền"
      data-element-type="section"
      data-element-page="wallpaper"
      className="flex flex-col gap-[12px] shrink-0 w-full"
    >
      {/* HÀNG 1: THANH LỌC NHANH THÔNG MINH + CHẾ ĐỘ XEM TRƯỚC + NÚT THU GỌN STUDIO */}
      <div
        id="wallpaper-smart-filter-bar"
        className="sub-card rounded-[14px] px-[15px] py-2.5 flex flex-wrap items-center justify-between gap-2.5"
      >
        <div
          role="tablist"
          aria-label={isEn ? 'Smart wallpaper filter' : 'Thanh lọc nhanh hình nền'}
          className="flex items-center gap-1.5 flex-wrap"
        >
          {smartFilterTabs.map((tab) => {
            const active = filterType === tab.id;
            return (
              <button
                key={tab.id}
                id={`wallpaper-filter-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                data-selected={active ? 'true' : 'false'}
                onClick={() => {
                  SoundEngine.playTap();
                  onChangeFilter(tab.id);
                }}
                style={
                  active
                    ? { background: 'var(--bg-button-primary)', color: '#ffffff' }
                    : undefined
                }
                className={`h-8 px-3 rounded-[10px] typo-nav font-play inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'shadow-sm font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/10'
                }`}
              >
                <WebIcon name={tab.icon} className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`tabular-nums text-[11px] opacity-80 ${
                    active ? 'text-white/90' : 'text-[var(--text-muted)]'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap ml-auto">
          <button
            id="wallpaper-live-hover-toggle"
            type="button"
            aria-pressed={liveHoverPreview}
            onClick={() => {
              SoundEngine.playTap();
              onToggleLiveHoverPreview();
            }}
            title={
              isEn
                ? 'Hover over a wallpaper card to preview full-screen immediately'
                : 'Di chuột lên thẻ để xem thử hình nền trực tiếp trên toàn website'
            }
            className={`h-8 px-3 rounded-[10px] typo-caption font-play inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border transition-all cursor-pointer ${
              liveHoverPreview
                ? 'border-[var(--color-primary)] text-[var(--text-link,var(--color-primary))] bg-[var(--color-primary)]/10 font-medium'
                : 'border-[var(--border-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <WebIcon name="eye" className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'Hover Live Preview' : 'Xem trước khi di chuột'}</span>
          </button>

          <button
            id="wallpaper-studio-toggle-btn"
            type="button"
            aria-expanded={isStudioExpanded}
            onClick={() => {
              SoundEngine.playTap();
              setIsStudioExpanded((prev) => !prev);
            }}
            className="h-8 px-3 rounded-[10px] typo-caption font-play inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 border border-[var(--border-subcard)] text-[var(--text-primary)] hover:border-[var(--color-primary)] transition-all cursor-pointer"
          >
            <WebIcon name="sliders" className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)]" />
            <span>{isStudioExpanded ? (isEn ? 'Hide Studio' : 'Ẩn tinh chỉnh') : (isEn ? 'Studio & Presets' : 'Tinh chỉnh & Preset')}</span>
            <WebIcon
              name="chevron-down"
              className={`w-3.5 h-3.5 transition-transform duration-200 ${isStudioExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* HÀNG 2: STUDIO TINH CHỈNH NỀN (ĐỘ MỜ, ĐỘ TỐI, MÀU NHẤN THÍCH ỨNG) & BỘ SƯU TẬP PRESET 1 CHẠM */}
      {isStudioExpanded && (
        <div
          id="wallpaper-studio-grid"
          className="grid grid-cols-1 lg:grid-cols-12 gap-[15px] items-stretch"
        >
          {/* CỘT TRÁI (5/12): ĐỘ MỜ & ĐỘ TỐI LỚP PHỦ NỀN + TỰ ĐỘNG MÀU NHẤN */}
          <div
            id="wallpaper-overlay-accent-card"
            data-subcard="true"
            className="sub-card lg:col-span-5 rounded-[14px] p-[15px] flex flex-col justify-between gap-3"
          >
            {/* Header Cột trái */}
            <div className="flex items-center justify-between gap-2">
              <div className="subcard-header-sync flex items-center gap-2 min-w-0" style={{ color: 'var(--color-primary)' }}>
                <WebIcon name="sliders" className="w-4 h-4 shrink-0" />
                <h2 className="typo-h4 subcard-title-synced font-play text-[var(--text-primary)] truncate" data-subcard-title="true">
                  {isEn ? 'Backdrop Clarity & Adaptive Accent' : 'Lớp phủ nền & Màu nhấn thích ứng'}
                </h2>
              </div>
              {(wallpaperOverlay.blur > 0 || wallpaperOverlay.dim > 0) && (
                <button
                  id="wallpaper-overlay-reset-btn"
                  type="button"
                  onClick={() => {
                    SoundEngine.playTap();
                    onResetOverlay();
                  }}
                  className="typo-caption text-[var(--text-link,var(--color-primary))] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isEn ? 'Reset' : 'Đặt lại'}
                </button>
              )}
            </div>

            {/* 2 Thanh trượt Blur & Dim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 cursor-pointer">
                <div className="flex items-center justify-between typo-caption text-[var(--text-secondary)]">
                  <span>{isEn ? 'Backdrop Blur' : 'Độ mờ hình nền'}</span>
                  <span className="font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                    {wallpaperOverlay.blur}px
                  </span>
                </div>
                <input
                  id="wallpaper-blur-slider"
                  type="range"
                  min={0}
                  max={32}
                  step={1}
                  value={wallpaperOverlay.blur}
                  onChange={(e) => onUpdateOverlay({ blur: Number(e.target.value) })}
                  aria-label="Độ mờ hình nền"
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] bg-slate-300/60 dark:bg-slate-700/70"
                />
              </label>

              <label className="flex flex-col gap-1.5 cursor-pointer">
                <div className="flex items-center justify-between typo-caption text-[var(--text-secondary)]">
                  <span>{isEn ? 'Overlay Dim' : 'Độ tối lớp phủ'}</span>
                  <span className="font-mono tabular-nums font-semibold text-[var(--text-primary)]">
                    {wallpaperOverlay.dim}%
                  </span>
                </div>
                <input
                  id="wallpaper-dim-slider"
                  type="range"
                  min={0}
                  max={80}
                  step={2}
                  value={wallpaperOverlay.dim}
                  onChange={(e) => onUpdateOverlay({ dim: Number(e.target.value) })}
                  aria-label="Độ tối lớp phủ"
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)] bg-slate-300/60 dark:bg-slate-700/70"
                />
              </label>
            </div>

            {/* Adaptive Accent Bar */}
            <div className="pt-2 border-t border-[var(--border-subcard)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex items-center -space-x-1 shrink-0" title={isEn ? 'Extracted palette swatches' : 'Bộ màu trích xuất từ hình nền'}>
                  {(suggestedAccent?.swatches || ['#4F46E5', '#0EA5E9', '#10B981']).map((hex, i) => (
                    <span
                      key={`${hex}-${i}`}
                      className="w-4 h-4 rounded-full border border-white/80 dark:border-slate-900 shadow-2xs"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="typo-caption text-[var(--text-primary)] font-medium truncate">
                    {suggestedAccent
                      ? isEn
                        ? suggestedAccent.contrastLabelEn
                        : suggestedAccent.contrastLabelVi
                      : isEn
                      ? 'Harmonic accent ready'
                      : 'Sẵn sàng đồng bộ màu nhấn'}
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {inspectedWallpaper.id === 'none'
                      ? isEn
                        ? 'System default'
                        : 'Nền hệ thống'
                      : inspectedWallpaper.name.replace(/^[^\p{L}\p{N}]+/u, '').trim()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {contrastMismatch && suggestedAccent && (
                  <button
                    id="wallpaper-sync-contrast-btn"
                    type="button"
                    onClick={() => {
                      SoundEngine.playPop();
                      onSyncContrastMode(suggestedAccent.recommendedDark);
                    }}
                    className="h-7 px-2.5 rounded-[8px] text-[11px] font-medium border border-[var(--border-subcard)] text-[var(--text-primary)] hover:border-[var(--color-primary)] transition cursor-pointer whitespace-nowrap"
                  >
                    {suggestedAccent.recommendedDark
                      ? isEn
                        ? 'Switch Dark'
                        : 'Chuyển Nền Tối'
                      : isEn
                      ? 'Switch Light'
                      : 'Chuyển Nền Sáng'}
                  </button>
                )}

                <button
                  id="wallpaper-adaptive-accent-toggle"
                  type="button"
                  aria-pressed={adaptiveAccentEnabled}
                  onClick={() => {
                    SoundEngine.playPop();
                    onToggleAdaptiveAccent(!adaptiveAccentEnabled);
                  }}
                  style={
                    adaptiveAccentEnabled
                      ? { background: 'var(--bg-button-primary)', color: '#ffffff' }
                      : undefined
                  }
                  className={`h-7 px-2.5 rounded-[8px] text-[11px] font-medium transition cursor-pointer whitespace-nowrap inline-flex items-center gap-1 ${
                    adaptiveAccentEnabled
                      ? 'shadow-2xs'
                      : 'border border-[var(--border-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <WebIcon name="palette" className="w-3 h-3 shrink-0" />
                  <span>
                    {adaptiveAccentEnabled
                      ? isEn
                        ? 'Adaptive On'
                        : 'Đang đồng bộ màu'
                      : isEn
                      ? 'Apply Accent'
                      : 'Tự đổi màu nhấn'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (7/12): BỘ SƯU TẬP PRESET (HÌNH NỀN + GIAO DIỆN 1 CHẠM) */}
          <div
            id="wallpaper-presets-collection-card"
            data-subcard="true"
            className="sub-card lg:col-span-7 rounded-[14px] p-[15px] flex flex-col justify-between gap-2.5 min-w-0"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="subcard-header-sync flex items-center gap-2 min-w-0">
                <WebIcon name="layers" className="w-4 h-4 shrink-0" />
                <h2 className="typo-h4 subcard-title-synced font-play text-[var(--text-primary)] truncate" data-subcard-title="true">
                  {isEn ? 'Theme + Wallpaper Presets (1-Tap)' : 'Bộ sưu tập Hình nền + Giao diện (1 chạm)'}
                </h2>
                <span className="tabular-nums text-[11px] text-[var(--text-muted)]">
                  · {presets.length}
                </span>
              </div>

              <form onSubmit={handleSavePresetSubmit} className="flex items-center gap-1.5 min-w-0 w-full sm:w-auto">
                <input
                  id="wallpaper-preset-name-input"
                  type="text"
                  value={presetNameInput}
                  onChange={(e) => setPresetNameInput(e.target.value)}
                  placeholder={isEn ? 'Preset name...' : 'Đặt tên bộ cấu hình...'}
                  className="theme-input h-7 px-2.5 rounded-[8px] text-[12px] w-full sm:w-40 focus:outline-none"
                />
                <button
                  id="wallpaper-save-preset-btn"
                  type="submit"
                  style={{ background: 'var(--bg-button-primary)' }}
                  className="h-7 px-3 rounded-[8px] text-[11px] font-medium text-white hover:brightness-110 transition cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-1 shadow-2xs"
                >
                  <WebIcon name="plus" className="w-3 h-3 shrink-0" />
                  <span>{isEn ? 'Save Combo' : 'Lưu bộ này'}</span>
                </button>
              </form>
            </div>

            {/* Danh sách thẻ Preset */}
            <div
              id="wallpaper-presets-strip"
              className="flex items-stretch gap-2.5 overflow-x-auto pb-1 glass-scrollbar"
            >
              {presets.map((preset) => {
                const styleMeta = CARD_STYLES_MAP[preset.cardStyle];
                const isActiveCombo =
                  cardStyle === preset.cardStyle &&
                  activeWallpaper.id === preset.wallpaper.id &&
                  wallpaperOverlay.blur === preset.blur &&
                  wallpaperOverlay.dim === preset.dim;

                const wpThumb =
                  preset.wallpaper.type === 'image'
                    ? getWallpaperThumbnailUrl(preset.wallpaper.value || preset.wallpaper.bg || '') ||
                      getCleanImageUrl(preset.wallpaper.value || preset.wallpaper.bg || '')
                    : '';

                return (
                  <div
                    key={preset.id}
                    id={`wallpaper-preset-item-${preset.id}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      SoundEngine.playPop();
                      onApplyPreset(preset);
                    }}
                    onKeyDown={(e) => {
                      if (e.target !== e.currentTarget) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        SoundEngine.playPop();
                        onApplyPreset(preset);
                      }
                    }}
                    className={`group relative shrink-0 w-[198px] rounded-[12px] p-2 border transition-all cursor-pointer flex items-center gap-2.5 text-left ${
                      isActiveCombo
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-xs'
                        : 'border-[var(--border-subcard)] hover:border-[var(--color-primary)]/60 hover:-translate-y-0.5'
                    }`}
                  >
                    {/* Thumbnail nhỏ 38x38 bo cong */}
                    <div
                      className="w-9 h-9 rounded-[12px] shrink-0 overflow-hidden border border-white/40 dark:border-white/15 relative"
                      style={
                        preset.wallpaper.type === 'css' || preset.wallpaper.type === 'gradient'
                          ? preset.wallpaper.previewStyle || { background: preset.wallpaper.value }
                          : preset.wallpaper.type === 'webgl'
                          ? {
                              background: `linear-gradient(135deg, ${
                                preset.wallpaper.gravityConfig?.swatchColor || '#4F46E5'
                              }, ${preset.wallpaper.gravityConfig?.secondaryColor || '#38BDF8'})`,
                            }
                          : { background: styleMeta?.color || '#4F46E5' }
                      }
                    >
                      {wpThumb && (
                        <img
                          src={wpThumb}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-[inherit]"
                        />
                      )}
                      <span
                        className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: styleMeta?.color || '#4F46E5' }}
                        title={styleMeta?.shortBadge}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] font-semibold text-[var(--text-primary)] truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10.5px] text-[var(--text-secondary)] truncate">
                        {styleMeta?.shortBadge || preset.cardStyle}
                        {(preset.blur > 0 || preset.dim > 0) && (
                          <span className="tabular-nums opacity-80">
                            {' '}
                            · {preset.blur}px/{preset.dim}%
                          </span>
                        )}
                      </div>
                    </div>

                    {!preset.isBuiltIn && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          SoundEngine.playTap();
                          onDeletePreset(preset.id);
                        }}
                        aria-label={isEn ? 'Delete preset' : 'Xóa bộ cấu hình'}
                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 w-5 h-5 rounded-full bg-rose-500/85 hover:bg-rose-500 text-white flex items-center justify-center shrink-0 transition-opacity cursor-pointer"
                      >
                        <WebIcon name="x" className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
