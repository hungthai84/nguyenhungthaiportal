import React, { useMemo } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useTheme } from '@/hooks/useTheme';
import type { WaveMotionMode } from '@/config/ui/theme.types';

export type SmartFilterCategory = 'all' | 'video' | 'webgl' | 'minimal' | 'custom';

export interface WallpaperStudioControlsProps {
  isEn: boolean;
  filterType: SmartFilterCategory;
  onChangeFilter: (cat: SmartFilterCategory) => void;
  filterCounts: Record<SmartFilterCategory, number>;
}

const WAVE_MOTION_OPTIONS: Array<{ id: WaveMotionMode; labelVi: string; labelEn: string }> = [
  { id: 'off', labelVi: 'Tắt', labelEn: 'Off' },
  { id: 'gentle', labelVi: 'Nhẹ', labelEn: 'Gentle' },
  { id: 'normal', labelVi: 'Chuẩn', labelEn: 'Normal' },
  { id: 'vivid', labelVi: 'Mạnh', labelEn: 'Vivid' },
];

export const WallpaperStudioControls: React.FC<WallpaperStudioControlsProps> = ({
  isEn,
  filterType,
  onChangeFilter,
  filterCounts,
}) => {
  const { waveMotion, setWaveMotion } = useTheme();

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

  return (
    <section
      id="wallpaper-studio-controls"
      data-element-name="Thanh lọc hình nền"
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
                    ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
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
                  className={`tabular-nums typo-badge opacity-85 ${
                    active ? 'text-current' : 'text-[var(--text-muted)]'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="wallpaper-studio-wave-motion-group"
          role="group"
          aria-label={isEn ? 'Wave motion intensity' : 'Chuyển động sóng nền'}
          className="inline-flex items-center gap-1 p-0.5 rounded-full border border-[var(--border-subcard)] bg-[var(--bg-card)] shrink-0"
        >
          <span className="inline-flex items-center gap-1 pl-2 pr-1 typo-badge text-[var(--text-secondary)] whitespace-nowrap">
            <WebIcon name="waves" className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
            <span>{isEn ? 'Wave' : 'Sóng nền'}</span>
          </span>
          {WAVE_MOTION_OPTIONS.map((opt) => {
            const active = waveMotion === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  SoundEngine.playTap();
                  setWaveMotion(opt.id);
                }}
                style={
                  active
                    ? { background: 'var(--bg-button-primary)', color: 'var(--text-button-primary, #FFFFFF)' }
                    : undefined
                }
                className={`px-2.5 py-1 rounded-full typo-badge font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  active ? 'shadow-2xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {isEn ? opt.labelEn : opt.labelVi}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
