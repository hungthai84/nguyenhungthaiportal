import React from 'react';

export interface WeatherItemData {
  id: string;
  temp: number;
  condition: string;
  location: string;
  time: string;
  date: string;
  bgGradient: string;
  textColor: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  type: 'cloudy-sun' | 'storm' | 'overcast' | 'sunny' | 'rain' | 'lightning';
}

export const WEATHER_PRESETS_DATA: WeatherItemData[] = [
  {
    id: 'cloudy-sun',
    temp: 38,
    condition: 'Nhiều mây',
    location: 'Hồ Chí Minh',
    time: '14:00',
    date: 'Thứ Sáu, 06/11/2026',
    bgGradient: 'from-[#38bdf8] via-[#0284c7] to-[#0369a1]',
    textColor: 'text-white',
    accentBorder: 'border-sky-300/60',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    type: 'cloudy-sun',
  },
  {
    id: 'storm',
    temp: 27,
    condition: 'Giông bão',
    location: 'Hồ Chí Minh',
    time: '21:27',
    date: 'Thứ Sáu, 06/11/2026',
    bgGradient: 'from-[#475569] via-[#334155] to-[#1e293b]',
    textColor: 'text-white',
    accentBorder: 'border-slate-400/50',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    type: 'storm',
  },
  {
    id: 'overcast',
    temp: 31,
    condition: 'Âm u',
    location: 'Hồ Chí Minh',
    time: '15:00',
    date: 'Thứ Sáu, 06/11/2026',
    bgGradient: 'from-[#93c5fd] via-[#cbd5e1] to-[#fed7aa]',
    textColor: 'text-slate-800',
    accentBorder: 'border-blue-200/80',
    badgeBg: 'bg-white/50',
    badgeText: 'text-slate-800',
    type: 'overcast',
  },
  {
    id: 'sunny',
    temp: 37,
    condition: 'Nắng',
    location: 'Hồ Chí Minh',
    time: '13:00',
    date: 'Thứ Sáu, 06/11/2026',
    bgGradient: 'from-[#22d3ee] via-[#06b6d4] to-[#0891b2]',
    textColor: 'text-white',
    accentBorder: 'border-cyan-300/60',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    type: 'sunny',
  },
  {
    id: 'rain',
    temp: 26,
    condition: 'Mưa lớn',
    location: 'Hồ Chí Minh',
    time: '18:00',
    date: 'Thứ Sáu, 06/11/2026',
    bgGradient: 'from-[#60a5fa] via-[#3b82f6] to-[#1e3a8a]',
    textColor: 'text-white',
    accentBorder: 'border-blue-400/60',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    type: 'rain',
  },
  {
    id: 'lightning',
    temp: 24,
    condition: 'Sét',
    location: 'Hồ Chí Minh',
    time: '23:00',
    date: 'Thứ Sáu, 06/11/2026',
    bgGradient: 'from-[#7c3aed] via-[#9333ea] to-[#c084fc]',
    textColor: 'text-white',
    accentBorder: 'border-purple-300/60',
    badgeBg: 'bg-white/20',
    badgeText: 'text-white',
    type: 'lightning',
  },
];
