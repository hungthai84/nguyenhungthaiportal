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
    sm: 'w-7 h-7 rounded-[var(--radius-subcard,16px)] typo-badge',
    md: 'w-9 h-9 rounded-[var(--radius-subcard,16px)] typo-body-sm',
    lg: 'w-11 h-11 rounded-[var(--radius-subcard,16px)] typo-body-lg',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center shrink-0 border border-[var(--border-subcard)] transition-all duration-300 shadow-sm',
        sizeClasses[size],
        springBounce && 'hover:scale-110 active:scale-95',
        className
      )}
      style={{
        color,
        background: `var(--bg-nested-card, radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9) 0%, ${glowColor}15 100%))`,
        boxShadow: `0 4px 12px ${glowColor}`,
      }}
    >
      {children}
    </div>
  );
};
