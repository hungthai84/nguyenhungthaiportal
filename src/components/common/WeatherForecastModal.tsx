import React, { useState, useEffect } from 'react';
import { WEATHER_PRESETS_DATA, WeatherItemData } from '../../data/weatherData';
import { Weather3DIcon } from './Weather3DIcon';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherForecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWeather: WeatherItemData;
  onSelectWeather: (item: WeatherItemData) => void;
}

const WEATHER_CONDITION_EN: Record<string, string> = {
  'cloudy-sun': 'Cloudy',
  storm: 'Thunder Storm',
  overcast: 'Overcast',
  sunny: 'Sunny',
  rain: 'Heavy Rain',
  lightning: 'Lightning',
};

export const WeatherForecastModal: React.FC<WeatherForecastModalProps> = ({
  isOpen,
  onClose,
  selectedWeather,
  onSelectWeather,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (!isOpen) return;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const days = isEn
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[now.getDay()];
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const fullDateHeader = isEn
    ? `${dayName}, ${monthsEn[now.getMonth()]} ${now.getDate()}, ${yyyy}`
    : `${dayName}, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${yyyy}`;
  const liveTime24 = `${hh}:${min}:${ss}`;
  const liveTimeShort24 = `${hh}:${min}`;
  const shortDate = isEn ? `${dayName}, ${monthsEn[now.getMonth()]} ${dd}, ${yyyy}` : `${dayName}, ${dd}/${mm}/${yyyy}`;

  return (
    <div
      style={{
        background: 'var(--bg-modal-backdrop)',
        backdropFilter: 'blur(var(--blur-modal, 6px))',
        WebkitBackdropFilter: 'blur(var(--blur-modal, 6px))',
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 font-play animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEn ? 'Weather Forecast' : 'Dự Báo Thời Tiết'}
        className="theme-modal-card rounded-[var(--radius-modal,24px)] max-w-3xl w-full max-h-[90vh] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.3)] relative text-left select-none overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative soft gradient blurs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header matching reference title */}
        <div className="theme-modal-header relative z-10 flex flex-col items-center justify-center text-center -mx-5 -mt-5 sm:-mx-7 sm:-mt-7 px-5 sm:px-7 py-5 mb-5 rounded-t-[var(--radius-modal,24px)]">
          <h2 className="typo-popup-title font-play tracking-wide" style={{ color: 'var(--text-heading, var(--text-primary))' }}>
            {isEn ? 'Weather Forecast' : 'Dự Báo Thời Tiết'}
          </h2>
          <p className="typo-body-sm font-semibold mt-1" style={{ color: 'var(--text-secondary)' }} suppressHydrationWarning>
            {fullDateHeader} • <span className="font-mono font-bold" style={{ color: 'var(--color-primary)' }}>{liveTime24}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close' : 'Đóng'}
            className="theme-modal-close absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer typo-button shadow-xs"
            title={isEn ? 'Close' : 'Đóng'}
          >
            ✕
          </button>
        </div>

        {/* 6 Weather Cards Grid (2 columns on tablet/desktop, 1 column on mobile) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 max-h-[62vh] overflow-y-auto no-scrollbar pr-1">
          {WEATHER_PRESETS_DATA.map((item) => {
            const isSelected = selectedWeather.id === item.id;
            const isIconRight = item.id === 'storm' || item.id === 'overcast' || item.id === 'lightning';
            const conditionText = isEn ? WEATHER_CONDITION_EN[item.id] || item.condition : item.condition;
            const locationText = isEn && item.location === 'Hồ Chí Minh' ? 'Ho Chi Minh City' : item.location;

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectWeather(item);
                    onClose();
                  }
                }}
                onClick={() => {
                  onSelectWeather(item);
                  onClose();
                }}
                className={`relative overflow-hidden rounded-[var(--radius-subcard,16px)] p-3.5 sm:p-4 border transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:scale-[1.02] flex items-center justify-between gap-3 bg-gradient-to-r ${item.bgGradient} ${item.accentBorder} ${
                  isSelected ? 'ring-4 ring-white/90 shadow-[0_0_24px_rgba(255,255,255,0.7)]' : ''
                }`}
              >
                {/* Visual Glass Sheen on Card */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />

                {/* If icon on left: Render Icon first */}
                {!isIconRight && (
                  <div className="shrink-0 -my-2 -ml-1">
                    <Weather3DIcon
                      type={
                        item.type === 'sunny'
                          ? 'bright-sun'
                          : item.type === 'rain'
                          ? 'heavy-rain-cloud'
                          : item.type === 'storm'
                          ? 'thunder-cloud'
                          : item.type === 'lightning'
                          ? 'lightning-bolt'
                          : item.type === 'overcast'
                          ? 'overcast-clouds'
                          : 'cloudy-sun'
                      }
                      className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md"
                    />
                  </div>
                )}

                {/* Info Text Area */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-baseline gap-2">
                    <span className={`typo-kpi font-bold font-play tracking-tight ${item.textColor}`}>
                      {item.temp}°<span className="typo-h4 font-bold">C</span>
                    </span>
                    <span className={`typo-h5 font-bold ${item.textColor} drop-shadow-xs`}>
                      {conditionText}
                    </span>
                  </div>
                  <div className={`typo-caption font-semibold ${item.textColor} opacity-90 mt-1 leading-snug`}>
                    <p suppressHydrationWarning>{locationText} • {liveTimeShort24}</p>
                    <p suppressHydrationWarning>{shortDate}</p>
                  </div>
                </div>

                {/* If icon on right: Render Icon on the right */}
                {isIconRight && (
                  <div className="shrink-0 -my-2 -mr-1">
                    <Weather3DIcon
                      type={
                        item.type === 'sunny'
                          ? 'bright-sun'
                          : item.type === 'rain'
                          ? 'heavy-rain-cloud'
                          : item.type === 'storm'
                          ? 'thunder-cloud'
                          : item.type === 'lightning'
                          ? 'lightning-bolt'
                          : item.type === 'overcast'
                          ? 'overcast-clouds'
                          : 'cloudy-sun'
                      }
                      className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-md"
                    />
                  </div>
                )}

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white text-indigo-700 flex items-center justify-center typo-badge font-bold shadow-md">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="theme-modal-footer relative z-10 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 px-5 sm:px-7 py-3.5 mt-5 rounded-b-[var(--radius-modal,24px)] flex flex-wrap items-center justify-between gap-2 typo-caption">
          <span style={{ color: 'var(--text-secondary)' }}>
            {isEn
              ? 'Tap any card to update the weather widget in the Footer'
              : 'Chạm vào thẻ bất kỳ để đổi thời tiết hiển thị ở Footer'}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'var(--bg-button-primary)' }}
            className="px-4 py-1.5 rounded-full text-white typo-button hover:opacity-90 transition cursor-pointer ml-auto"
          >
            {isEn ? 'Close' : 'Đóng'}
          </button>
        </div>
      </div>
    </div>
  );
};
