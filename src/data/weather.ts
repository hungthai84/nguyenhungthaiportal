export interface WeatherForecastItem {
  id: string;
  status: string; // 'Nhiều mây' | 'Giông bão' | 'Âm u' | 'Nắng' | 'Mưa lớn' | 'Sét'
  temp: number; // 38, 27, 31, 37, 26, 24
  location: string; // 'Hồ Chí Minh'
  time: string; // '14:00', '21:27', '15:00', '13:00', '18:00', '23:00'
  dateLabel: string; // 'Thứ Sáu, 06/11/2026'
  iconType: 'cloudy-sun' | 'thunder-cloud' | 'overcast-clouds' | 'bright-sun' | 'heavy-rain-cloud' | 'lightning-bolt';
  iconPosition: 'left' | 'right';
  cardGradient: string;
  darkCardGradient: string;
  borderColor: string;
  darkBorderColor: string;
  accentShadow: string;
  textColor: string;
  darkTextColor: string;
  subtextColor: string;
  darkSubtextColor: string;
}

export const WEATHER_FORECAST_DATA: WeatherForecastItem[] = [
  {
    id: 'weather-1',
    status: 'Nhiều mây',
    temp: 38,
    location: 'Hồ Chí Minh',
    time: '14:00',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    iconType: 'cloudy-sun',
    iconPosition: 'left',
    cardGradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 60%, #0369a1 100%)',
    darkCardGradient: 'linear-gradient(135deg, #075985 0%, #0c4a6e 60%, #082f49 100%)',
    borderColor: 'rgba(255, 255, 255, 0.65)',
    darkBorderColor: 'rgba(56, 189, 248, 0.35)',
    accentShadow: '0 10px 25px -4px rgba(2, 132, 199, 0.45)',
    textColor: '#ffffff',
    darkTextColor: '#f0f9ff',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    darkSubtextColor: 'rgba(224, 242, 254, 0.85)',
  },
  {
    id: 'weather-2',
    status: 'Giông bão',
    temp: 27,
    location: 'Hồ Chí Minh',
    time: '21:27',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    iconType: 'thunder-cloud',
    iconPosition: 'right',
    cardGradient: 'linear-gradient(135deg, #64748b 0%, #475569 60%, #334155 100%)',
    darkCardGradient: 'linear-gradient(135deg, #334155 0%, #1e293b 60%, #0f172a 100%)',
    borderColor: 'rgba(255, 255, 255, 0.55)',
    darkBorderColor: 'rgba(148, 163, 184, 0.35)',
    accentShadow: '0 10px 25px -4px rgba(71, 85, 105, 0.45)',
    textColor: '#ffffff',
    darkTextColor: '#f8fafc',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    darkSubtextColor: 'rgba(226, 232, 240, 0.85)',
  },
  {
    id: 'weather-3',
    status: 'Âm u',
    temp: 31,
    location: 'Hồ Chí Minh',
    time: '15:00',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    iconType: 'overcast-clouds',
    iconPosition: 'right',
    cardGradient: 'linear-gradient(135deg, #93c5fd 0%, #c4b5fd 55%, #fed7aa 100%)',
    darkCardGradient: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 55%, #7c2d12 100%)',
    borderColor: 'rgba(255, 255, 255, 0.75)',
    darkBorderColor: 'rgba(196, 181, 253, 0.35)',
    accentShadow: '0 10px 25px -4px rgba(147, 197, 253, 0.45)',
    textColor: '#ffffff',
    darkTextColor: '#ffffff',
    subtextColor: 'rgba(255, 255, 255, 0.95)',
    darkSubtextColor: 'rgba(243, 232, 255, 0.88)',
  },
  {
    id: 'weather-4',
    status: 'Nắng',
    temp: 37,
    location: 'Hồ Chí Minh',
    time: '13:00',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    iconType: 'bright-sun',
    iconPosition: 'left',
    cardGradient: 'linear-gradient(135deg, #a7f3d0 0%, #38bdf8 55%, #22d3ee 100%)',
    darkCardGradient: 'linear-gradient(135deg, #065f46 0%, #0369a1 55%, #0e7490 100%)',
    borderColor: 'rgba(255, 255, 255, 0.75)',
    darkBorderColor: 'rgba(56, 189, 248, 0.35)',
    accentShadow: '0 10px 25px -4px rgba(34, 211, 238, 0.45)',
    textColor: '#ffffff',
    darkTextColor: '#f0fdf4',
    subtextColor: 'rgba(255, 255, 255, 0.95)',
    darkSubtextColor: 'rgba(207, 250, 254, 0.88)',
  },
  {
    id: 'weather-5',
    status: 'Mưa lớn',
    temp: 26,
    location: 'Hồ Chí Minh',
    time: '18:00',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    iconType: 'heavy-rain-cloud',
    iconPosition: 'left',
    cardGradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1e3a8a 100%)',
    darkCardGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0f172a 100%)',
    borderColor: 'rgba(255, 255, 255, 0.65)',
    darkBorderColor: 'rgba(96, 165, 250, 0.35)',
    accentShadow: '0 10px 25px -4px rgba(37, 99, 235, 0.45)',
    textColor: '#ffffff',
    darkTextColor: '#eff6ff',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    darkSubtextColor: 'rgba(219, 234, 254, 0.85)',
  },
  {
    id: 'weather-6',
    status: 'Sét',
    temp: 24,
    location: 'Hồ Chí Minh',
    time: '23:00',
    dateLabel: 'Thứ Sáu, 06/11/2026',
    iconType: 'lightning-bolt',
    iconPosition: 'right',
    cardGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 45%, #ec4899 100%)',
    darkCardGradient: 'linear-gradient(135deg, #4c1d95 0%, #6b21a8 45%, #9d174d 100%)',
    borderColor: 'rgba(255, 255, 255, 0.65)',
    darkBorderColor: 'rgba(168, 85, 247, 0.35)',
    accentShadow: '0 10px 25px -4px rgba(168, 85, 247, 0.45)',
    textColor: '#ffffff',
    darkTextColor: '#faf5ff',
    subtextColor: 'rgba(255, 255, 255, 0.92)',
    darkSubtextColor: 'rgba(243, 232, 255, 0.85)',
  },
];
