import React from 'react';

export interface PrismWaveWallpaperProps {
  compact?: boolean;
  className?: string;
}

export const PRISM_WAVE_WALLPAPER_ID = 'css-prism-wave-flow';

export const PrismWaveWallpaper: React.FC<PrismWaveWallpaperProps> = React.memo(
  ({ compact = false, className = '' }) => {
    return (
      <div
        aria-hidden="true"
        data-prism-wave-mode={compact ? 'compact' : 'stage'}
        className={`wp-prism-wave-stage ${compact ? 'wp-prism-wave-stage--compact' : ''} ${className}`.trim()}
      >
        <div className="wp-prism-wave-ribbon wp-prism-wave-ribbon--1" />
        <div className="wp-prism-wave-ribbon wp-prism-wave-ribbon--2" />
        <div className="wp-prism-wave-ribbon wp-prism-wave-ribbon--3" />
      </div>
    );
  }
);

PrismWaveWallpaper.displayName = 'PrismWaveWallpaper';

export default PrismWaveWallpaper;
