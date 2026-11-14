import React, { useState, useEffect } from 'react';
import { SiteTheme } from '@/types';

export interface ClockProps {
  isLight?: boolean;
  currentTheme?: SiteTheme;
}

export const Clock: React.FC<ClockProps> = ({ isLight = true, currentTheme }) => {
  const [timeStr, setTimeStr] = useState<string>('--:--');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);

      const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dName = dayNames[now.getDay()];
      const d = String(now.getDate()).padStart(2, '0');
      const m = String(now.getMonth() + 1).padStart(2, '0');
      setDateStr(`${dName}, ${d}/${m}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isDark = currentTheme === 'dark-neon' || !isLight;

  return (
    <div className="flex flex-col items-start justify-center leading-none text-left shrink-0 pl-1">
      <div
        className={`text-[13px] sm:text-[14px] font-mono font-black tracking-tight leading-none ${
          isDark
            ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
            : 'text-indigo-950 font-black'
        }`}
      >
        <span>{timeStr}</span>
      </div>
      {dateStr && (
        <span
          className={`text-[12px] font-mono font-bold mt-0.5 leading-none opacity-85 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {dateStr}
        </span>
      )}
    </div>
  );
};
