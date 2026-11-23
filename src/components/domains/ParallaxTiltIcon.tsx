import React from 'react';
import { WebIcon } from '@/components/ui/WebIcon';

export interface ParallaxTiltIconProps {
  iconName: string;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ParallaxTiltIcon: React.FC<ParallaxTiltIconProps> = ({
  iconName,
  size = 'md',
}) => {
  const sizeClass =
    size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';

  return (
    <div
      className={`${sizeClass} rounded-[var(--radius-subcard,16px)] bg-[var(--bg-nested-card)] border border-[var(--border-subcard)] shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-110`}
    >
      <WebIcon name={iconName.toLowerCase()} className="w-5 h-5" style={{ color: 'var(--accent-cyan, var(--color-primary))' }} />
    </div>
  );
};
