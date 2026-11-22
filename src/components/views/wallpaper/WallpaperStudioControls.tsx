import React, { useMemo } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { AdaptiveAccentPalette, WallpaperOverlaySettings } from '@/config/ui/theme.types';

export type SmartFilterCategory = 'all' | 'video' | 'webgl' | 'minimal' | 'custom';

export interface WallpaperStudioControlsProps {
  isEn: boolean;
  filterType: SmartFilterCategory;
  onChangeFilter: (cat: SmartFilterCategory) => void;
  filterCounts: Record<SmartFilterCategory, number>;
  wallpaperOverlay: WallpaperOverlaySettings;
  onUpdateWallpaperOverlay: (patch: Partial<WallpaperOverlaySettings>) => void;
  onResetWallpaperOverlay: () => void;
  adaptiveAccentEnabled: boolean;
  onToggleAdaptiveAccent: (enabled: boolean) => void;
  suggestedAccent: AdaptiveAccentPalette | null;
}

export const WallpaperStudioControls: React.FC<WallpaperStudioControlsProps> = ({
  isEn,
  filterType,
  onChangeFilter,
  filterCounts,
  wallpaperOverlay,
  onUpdateWallpaperOverlay,
  onResetWallpaperOverlay,
  adaptiveAccentEnabled,
  onToggleAdaptiveAccent,
  suggestedAccent,
}) => {
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

  const isOverlayDefault = wallpaperOverlay.blur === 0 && wallpaperOverlay.dim === 0;

  return (
    <section
      id="wallpaper-studio-controls"
      data-element-name="Thanh lọc & Lớp phủ nền & Màu nhấn thích ứng"
      data-element-type="section"
      data-element-page="wallpaper"
      className="flex flex-col gap-[12px] shrink-0 w-full"
    >
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
      </div>

      {/* LỚP PHỦ NỀN & MÀU NHẤN THÍCH ỨNG (MẶC ĐỊNH: ĐỘ MỜ 0px · ĐỘ TỐI LỚP PHỤ 0%) */}
      <div
        id="wallpaper-overlay-accent-panel"
        data-element-name="Lớp phủ nền & Màu nhấn thích ứng"
        data-element-type="section"
        data-element-page="wallpaper"
        data-subcard="true"
        className="sub-card rounded-[14px] px-[15px] py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3 shrink-0"
      >
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <WebIcon name="sliders" className="w-4 h-4 shrink-0" />
            <span className="typo-label font-bold font-play">
              {isEn ? 'Backdrop Overlay & Adaptive Accent' : 'Lớp phủ nền & Màu nhấn thích ứng'}
            </span>
          </div>

          {!isOverlayDefault && (
            <button
              id="wallpaper-overlay-reset-btn"
              type="button"
              onClick={() => {
                SoundEngine.playTap();
                onResetWallpaperOverlay();
              }}
              className="px-2.5 py-1 rounded-full typo-badge font-bold border border-[var(--border-subcard)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-all"
              style={{ background: 'var(--bg-card)' }}
            >
              {isEn ? 'Reset 0px · 0%' : 'Mặc định 0px · 0%'}
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1 justify-end min-w-0">
          {/* Độ mờ hình nền (Default: 0px) */}
          <div className="flex items-center gap-2 min-w-[190px] flex-1 max-w-[280px]">
            <label
              htmlFor="wallpaper-overlay-blur-slider"
              className="typo-caption font-semibold text-[var(--text-secondary)] whitespace-nowrap shrink-0"
            >
              {isEn ? 'Backdrop Blur' : 'Độ mờ hình nền'}
            </label>
            <input
              id="wallpaper-overlay-blur-slider"
              type="range"
              min={0}
              max={32}
              step={1}
              value={wallpaperOverlay.blur}
              aria-label={isEn ? 'Wallpaper blur in pixels' : 'Điều chỉnh độ mờ hình nền'}
              onChange={(e) => onUpdateWallpaperOverlay({ blur: Number(e.target.value) })}
              className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
            />
            <span
              className="typo-badge font-mono font-bold tabular-nums w-10 text-right shrink-0"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            >
              {wallpaperOverlay.blur}px
            </span>
          </div>

          {/* Độ tối lớp phụ (Default: 0%) */}
          <div className="flex items-center gap-2 min-w-[190px] flex-1 max-w-[280px]">
            <label
              htmlFor="wallpaper-overlay-dim-slider"
              className="typo-caption font-semibold text-[var(--text-secondary)] whitespace-nowrap shrink-0"
            >
              {isEn ? 'Secondary Dim' : 'Độ tối lớp phụ'}
            </label>
            <input
              id="wallpaper-overlay-dim-slider"
              type="range"
              min={0}
              max={80}
              step={5}
              value={wallpaperOverlay.dim}
              aria-label={isEn ? 'Secondary overlay darkness percentage' : 'Điều chỉnh độ tối lớp phụ'}
              onChange={(e) => onUpdateWallpaperOverlay({ dim: Number(e.target.value) })}
              className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
            />
            <span
              className="typo-badge font-mono font-bold tabular-nums w-10 text-right shrink-0"
              style={{ color: 'var(--text-link, var(--color-primary))' }}
            >
              {wallpaperOverlay.dim}%
            </span>
          </div>

          {/* Màu nhấn thích ứng */}
          <button
            id="wallpaper-adaptive-accent-btn"
            type="button"
            aria-pressed={adaptiveAccentEnabled}
            onClick={() => {
              SoundEngine.playTap();
              onToggleAdaptiveAccent(!adaptiveAccentEnabled);
            }}
            className={`px-3 py-1 rounded-full typo-badge font-bold border inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-all ${
              adaptiveAccentEnabled ? 'text-white border-transparent shadow-xs' : 'hover:opacity-90'
            }`}
            style={
              adaptiveAccentEnabled
                ? { background: 'var(--bg-button-primary)' }
                : {
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subcard)',
                    color: 'var(--text-secondary)',
                  }
            }
          >
            {suggestedAccent?.primary && (
              <span
                aria-hidden="true"
                className="w-2.5 h-2.5 rounded-full border border-white/60 shrink-0"
                style={{ backgroundColor: suggestedAccent.primary }}
              />
            )}
            <span>{isEn ? 'Adaptive Accent' : 'Màu nhấn thích ứng'}</span>
            <span className="opacity-85">{adaptiveAccentEnabled ? (isEn ? 'On' : 'Bật') : isEn ? 'Off' : 'Tắt'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
