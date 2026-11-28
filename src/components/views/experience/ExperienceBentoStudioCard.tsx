import React from 'react';
import { cn } from '@/lib/utils';

export type ExperienceBentoVariant =
  | 'hero-purple'
  | 'amber-highlight'
  | 'roadmap-violet'
  | 'emerald-trust'
  | 'slate-tasks'
  | 'indigo-docs'
  | 'rose-kpi'
  | 'gallery-pink';

export interface ExperienceBentoStudioCardProps extends React.HTMLAttributes<HTMLElement> {
  variant: ExperienceBentoVariant;
  children: React.ReactNode;
}

export const ExperienceBentoStudioCard: React.FC<ExperienceBentoStudioCardProps> = ({
  variant,
  className = '',
  children,
  style,
  ...rest
}) => {
  return (
    <section
      data-bento-studio-card="true"
      data-studio-variant={variant}
      style={style}
      className={cn(
        'exp-studio-card',
        `exp-studio-card--${variant}`,
        'no-card-hover',
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

export default ExperienceBentoStudioCard;

