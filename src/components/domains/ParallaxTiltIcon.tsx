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
      className={`${sizeClass} rounded-[14px] bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/10 shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-110`}
    >
      <WebIcon name={iconName.toLowerCase()} className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
    </div>
  );
};
