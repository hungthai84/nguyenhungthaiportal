import React, { useState, useEffect } from 'react';
import { SiteTheme } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export interface ClockProps {
  isLight?: boolean;
  currentTheme?: SiteTheme;
}

export const Clock: React.FC<ClockProps> = ({ isLight = true, currentTheme }) => {
  const { language } = useLanguage();
  const [timeStr, setTimeStr] = useState<string>('--:--');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const dayNames =
        language === 'en'
          ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dName = dayNames[now.getDay()];
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      setDateStr(`${dName}, ${d}/${m}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const isDark =
    currentTheme === 'dark-liquid-glass' ||
    currentTheme === 'dark-neon-glass' ||
    currentTheme === 'cowhide-leather' ||
    currentTheme === 'black-cowhide-leather' ||
    currentTheme === 'deep-ocean' ||
    currentTheme === 'dark-neumorphism-beyond' ||
    currentTheme === 'dark-frost-ice-neu' ||
    !isLight;

  return (
    <div className="flex flex-col items-start justify-center leading-none text-left shrink-0 pl-1">
      <div
        className="typo-nav font-mono font-bold tracking-tight leading-none"
        style={{ color: 'var(--text-heading, var(--text-primary))' }}
      >
        <span>{timeStr}</span>
      </div>
      {dateStr && (
        <span
          className="typo-label font-mono mt-0.5 leading-none opacity-85"
          style={{ color: 'var(--text-secondary)' }}
        >
          {dateStr}
        </span>
      )}
    </div>
  );
};
