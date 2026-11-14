import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicIconFrameProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  glowColor?: string;
  springBounce?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const GlassmorphicIconFrame: React.FC<GlassmorphicIconFrameProps> = ({
  size = 'md',
  color = 'var(--color-indigo)',
  glowColor = 'rgba(67, 56, 202, 0.35)',
  springBounce = false,
  className,
  children,
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-[14px] text-xs',
    md: 'w-9 h-9 rounded-[14px] text-sm',
    lg: 'w-11 h-11 rounded-[14px] text-base',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 border border-white/60 dark:border-white/10 backdrop-blur-md transition-all duration-300 shadow-sm',
        sizeClasses[size],
        springBounce && 'hover:scale-110 active:scale-95',
        className
      )}
      style={{
        color,
        background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, ${glowColor}15 100%)`,
        boxShadow: `0 4px 12px ${glowColor}`,
      }}
    >
      {children}
    </div>
  );
};
