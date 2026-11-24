'use client';

import React, { useState, useEffect } from 'react';
import { WebIcon } from '@/components/ui/WebIcon';
import { WeatherPreset, SiteTheme } from '@/types';
import { SoundEngine } from '@/components/ui/SoundEngine';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { useLanguage, Language } from '@/context/LanguageContext';

export interface WeatherWidgetProps {
  currentPreset?: WeatherPreset;
  onCycle?: () => void;
  currentTheme?: SiteTheme;
  onShowNotification?: (msg: string) => void;
}

export interface SunAmbientConfig {
  phase: 'morning' | 'noon' | 'sunset' | 'night';
  label: string;
  sunGlow: string;
  sunHaloFill: string;
  sunHaloOpacity: number;
  stop1: string;
  stop2: string;
  stop3: string;
  strokeColor: string;
  ambientShadow: string;
  timeString: string;
}

export const getSunAmbientConfig = (date: Date = new Date()): SunAmbientConfig => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  if (hours >= 5 && hours < 10) {
    return {
      phase: 'morning',
      label: 'Sắc vàng ban mai',
      sunGlow: 'rgba(253, 224, 71, 0.5)',
      sunHaloFill: '#FBBF24',
      sunHaloOpacity: 0.28,
      stop1: '#FEF9C3',
      stop2: '#FDE047',
      stop3: '#F59E0B',
      strokeColor: '#FEF08A',
      ambientShadow: '0 0 16px rgba(253, 224, 71, 0.45)',
      timeString,
    };
  }

  if (hours >= 10 && hours < 16) {
    return {
      phase: 'noon',
      label: 'Rực rỡ trưa hè',
      sunGlow: 'rgba(250, 204, 21, 0.65)',
      sunHaloFill: '#FF7A00',
      sunHaloOpacity: 0.35,
      stop1: '#FFFFFF',
      stop2: '#FACC15',
      stop3: '#EA580C',
      strokeColor: '#FDE047',
      ambientShadow: '0 0 24px rgba(234, 88, 12, 0.5)',
      timeString,
    };
  }

  if (hours >= 16 && hours < 19) {
    return {
      phase: 'sunset',
      label: 'Hoàng hôn cam ấm áp',
      sunGlow: 'rgba(249, 115, 22, 0.6)',
      sunHaloFill: '#F97316',
      sunHaloOpacity: 0.32,
      stop1: '#FED7AA',
      stop2: '#F97316',
      stop3: '#E11D48',
      strokeColor: '#FDBA74',
      ambientShadow: '0 0 20px rgba(249, 115, 22, 0.45)',
      timeString,
    };
  }

  return {
    phase: 'night',
    label: 'Ánh trăng huyền ảo',
    sunGlow: 'rgba(129, 140, 248, 0.45)',
    sunHaloFill: '#818CF8',
    sunHaloOpacity: 0.25,
    stop1: '#F0FDF4',
    stop2: '#818CF8',
    stop3: '#4338CA',
    strokeColor: '#A5B4FC',
    ambientShadow: '0 0 16px rgba(129, 140, 248, 0.35)',
    timeString,
  };
};

// 6 Mẫu thẻ Thời Tiết 3D chuẩn 100% theo hình mẫu DỰ BÁO THỜI TIẾT đính kèm
export interface WeatherCardStyleConfig {
  condition: string;
  labelVi: string;
  defaultTemp: string;
  iconPosition: 'left' | 'right';
  cardGradient: string;
  borderGlow: string;
  shadowColor: string;
  sampleTime: string;
}

export const WEATHER_CARD_STYLES: Record<string, WeatherCardStyleConfig> = {
  Cloudy: {
    condition: 'Cloudy',
    labelVi: 'Nhiều mây',
    defaultTemp: '38',
    iconPosition: 'left',
    cardGradient: 'linear-gradient(135deg, #38bdf8 0%, #1d8cf8 55%, #0284c7 100%)',
    borderGlow: 'rgba(186, 230, 253, 0.65)',
    shadowColor: 'rgba(2, 132, 199, 0.35)',
    sampleTime: '14:00',
  },
  'Thunder Storm': {
    condition: 'Thunder Storm',
    labelVi: 'Giông bão',
    defaultTemp: '27',
    iconPosition: 'right',
    cardGradient: 'linear-gradient(135deg, #5b6e8c 0%, #7388ad 55%, #9bb2d6 100%)',
    borderGlow: 'rgba(203, 213, 225, 0.6)',
    shadowColor: 'rgba(71, 85, 105, 0.35)',
    sampleTime: '21:27',
  },
  Overcast: {
    condition: 'Overcast',
    labelVi: 'Âm u',
    defaultTemp: '31',
    iconPosition: 'right',
    cardGradient: 'linear-gradient(135deg, #98b5f2 0%, #c6d5f7 52%, #fae3d2 100%)',
    borderGlow: 'rgba(255, 255, 255, 0.85)',
    shadowColor: 'rgba(148, 163, 184, 0.3)',
    sampleTime: '15:00',
  },
  Sunny: {
    condition: 'Sunny',
    labelVi: 'Nắng',
    defaultTemp: '37',
    iconPosition: 'left',
    cardGradient: 'linear-gradient(135deg, #64ebd8 0%, #4dd4ec 52%, #38bdf8 100%)',
    borderGlow: 'rgba(165, 243, 252, 0.75)',
    shadowColor: 'rgba(14, 165, 233, 0.32)',
    sampleTime: '13:00',
  },
  'Heavy Rain': {
    condition: 'Heavy Rain',
    labelVi: 'Mưa lớn',
    defaultTemp: '26',
    iconPosition: 'left',
    cardGradient: 'linear-gradient(135deg, #8aa6c9 0%, #4c6d9c 50%, #1e3f75 100%)',
    borderGlow: 'rgba(147, 197, 253, 0.55)',
    shadowColor: 'rgba(30, 58, 138, 0.38)',
    sampleTime: '18:00',
  },
  Lightning: {
    condition: 'Lightning',
    labelVi: 'Sét',
    defaultTemp: '24',
    iconPosition: 'right',
    cardGradient: 'linear-gradient(135deg, #7c2ae8 0%, #a259d9 52%, #de8aba 100%)',
    borderGlow: 'rgba(233, 213, 255, 0.65)',
    shadowColor: 'rgba(124, 58, 237, 0.38)',
    sampleTime: '23:00',
  },
};

const formatLocalizedDateInfo = (date: Date, lang: Language = 'vi') => {
  const days =
    lang === 'en'
      ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      : ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const shortDays =
    lang === 'en'
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      : ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayName = days[date.getDay()];
  const shortDayName = shortDays[date.getDay()];
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return {
    dayName,
    shortDayName,
    dd,
    mm,
    yyyy,
    compactDate:
      lang === 'en' ? `${monthsEn[date.getMonth()]} ${dd}, ${yyyy}` : `${dd}/${mm}/${yyyy}`,
    fullMonthDate:
      lang === 'en'
        ? `${monthsEn[date.getMonth()]} ${dd}, ${yyyy}`
        : `Ngày ${dd} Tháng ${mm}, ${yyyy}`,
    shortDate:
      lang === 'en'
        ? `${dayName}, ${monthsEn[date.getMonth()]} ${dd}, ${yyyy}`
        : `${dayName}, ${dd}/${mm}/${yyyy}`,
    fullDateHeader:
      lang === 'en'
        ? `${dayName}, ${monthsEn[date.getMonth()]} ${date.getDate()}, ${yyyy}`
        : `${dayName}, ngày ${date.getDate()} tháng ${date.getMonth() + 1} năm ${yyyy}`,
    timeStr: `${hh}:${min}`,
    timeStr24Full: `${hh}:${min}:${ss}`,
  };
};

// Render 3D Weather SVG Icon giống 100% hình mẫu đính kèm
export const render3DWeatherIcon = (condition: string, sizeClass = 'w-14 h-14') => {
  switch (condition) {
    case 'Cloudy':
      return (
        <svg viewBox="0 0 120 110" className={`${sizeClass} overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.22)]`}>
          <defs>
            <radialGradient id="w3d_sunCloudy" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="55%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#F57C00" />
            </radialGradient>
            <radialGradient id="w3d_cloudWarm1" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FFF3E0" />
              <stop offset="100%" stopColor="#FFCC80" />
            </radialGradient>
            <linearGradient id="w3d_cloudWhite1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>
          {/* Glow */}
          <circle cx="44" cy="36" r="28" fill="#FBBF24" opacity="0.35" filter="blur(6px)" />
          {/* Sun */}
          <circle cx="44" cy="36" r="22" fill="url(#w3d_sunCloudy)" />
          {/* Fluffy 3D Cloud */}
          <path
            d="M26 86 C12 86 6 73 12 60 C16 49 28 46 37 51 C44 37 64 34 76 45 C89 41 104 51 103 66 C103 78 93 86 80 86 Z"
            fill="url(#w3d_cloudWarm1)"
          />
          <circle cx="34" cy="64" r="19" fill="url(#w3d_cloudWarm1)" />
          <circle cx="66" cy="59" r="23" fill="url(#w3d_cloudWhite1)" />
          <rect x="20" y="64" width="72" height="22" rx="11" fill="url(#w3d_cloudWhite1)" opacity="0.88" />
        </svg>
      );

    case 'Thunder Storm':
      return (
        <svg viewBox="0 0 120 120" className={`${sizeClass} overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.25)]`}>
          <defs>
            <radialGradient id="w3d_stormCloud" cx="45%" cy="28%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>
            <linearGradient id="w3d_boltGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFEE58" />
              <stop offset="50%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FB8C00" />
            </linearGradient>
          </defs>
          {/* Back cloud puff */}
          <circle cx="48" cy="34" r="20" fill="url(#w3d_stormCloud)" />
          <circle cx="72" cy="36" r="18" fill="url(#w3d_stormCloud)" />
          {/* Main 3D Cloud */}
          <path
            d="M24 74 C10 74 6 60 14 49 C18 41 28 38 38 41 C45 27 67 26 77 39 C91 37 104 48 102 62 C100 71 91 74 80 74 Z"
            fill="url(#w3d_stormCloud)"
          />
          {/* Golden glow at cloud base */}
          <ellipse cx="58" cy="74" rx="22" ry="6" fill="#FACC15" opacity="0.55" filter="blur(4px)" />
          {/* 3D Lightning bolt */}
          <path
            d="M59 68 L44 90 H56 L50 112 L75 85 H62 L69 68 Z"
            fill="url(#w3d_boltGold)"
            stroke="#FFF59D"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          {/* Rain droplets */}
          <circle cx="34" cy="88" r="2.6" fill="#60A5FA" />
          <circle cx="40" cy="100" r="2.6" fill="#38BDF8" />
          <circle cx="78" cy="86" r="2.6" fill="#60A5FA" />
          <circle cx="72" cy="99" r="2.6" fill="#38BDF8" />
          <circle cx="84" cy="96" r="2.4" fill="#93C5FD" />
        </svg>
      );

    case 'Overcast':
      return (
        <svg viewBox="0 0 120 110" className={`${sizeClass} overflow-visible drop-shadow-[0_8px_16px_rgba(100,116,139,0.25)]`}>
          <defs>
            <radialGradient id="w3d_overcastMain" cx="45%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="68%" stopColor="#F1F5F9" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
            <radialGradient id="w3d_overcastSmall" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </radialGradient>
          </defs>
          {/* Large Cloud */}
          <circle cx="52" cy="36" r="20" fill="url(#w3d_overcastMain)" />
          <path
            d="M26 82 C12 82 8 68 16 56 C22 46 36 44 45 48 C54 32 78 32 88 47 C102 47 110 60 106 72 C102 80 93 82 82 82 Z"
            fill="url(#w3d_overcastMain)"
          />
          {/* Front Small Cloud on Bottom Left */}
          <path
            d="M16 92 C8 92 5 84 9 78 C12 72 20 71 25 74 C30 66 42 66 47 74 C54 74 58 81 55 87 C53 91 48 92 42 92 Z"
            fill="url(#w3d_overcastSmall)"
          />
        </svg>
      );

    case 'Sunny':
      return (
        <svg viewBox="0 0 120 120" className={`${sizeClass} overflow-visible`}>
          <defs>
            <radialGradient id="w3d_sunCore" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="45%" stopColor="#FFCA28" />
              <stop offset="85%" stopColor="#FB8C00" />
              <stop offset="100%" stopColor="#EF6C00" />
            </radialGradient>
            <radialGradient id="w3d_sunCorona" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB300" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#FB8C00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Outer corona glow */}
          <circle cx="60" cy="60" r="52" fill="url(#w3d_sunCorona)" />
          {/* 3D Sun sphere */}
          <circle
            cx="60"
            cy="60"
            r="36"
            fill="url(#w3d_sunCore)"
            stroke="#FFE082"
            strokeWidth="2"
          />
        </svg>
      );

    case 'Heavy Rain':
      return (
        <svg viewBox="0 0 120 125" className={`${sizeClass} overflow-visible drop-shadow-[0_8px_14px_rgba(15,23,42,0.3)]`}>
          <defs>
            <radialGradient id="w3d_rainCloud" cx="45%" cy="30%" r="72%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#DBEAFE" />
              <stop offset="100%" stopColor="#93C5FD" />
            </radialGradient>
            <linearGradient id="w3d_rainStreak" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Cloud */}
          <path
            d="M24 72 C10 72 6 58 14 46 C20 36 33 34 42 38 C50 22 74 22 84 37 C98 37 108 49 104 62 C101 70 92 72 80 72 Z"
            fill="url(#w3d_rainCloud)"
          />
          {/* Vertical rain streaks */}
          {[26, 36, 46, 56, 66, 76, 86].map((x, idx) => {
            const yEnd = idx % 2 === 0 ? 112 : 118;
            return (
              <g key={x}>
                <line
                  x1={x}
                  y1={75}
                  x2={x}
                  y2={yEnd}
                  stroke="url(#w3d_rainStreak)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                <circle cx={x} cy={yEnd} r="2.2" fill="#38BDF8" />
              </g>
            );
          })}
        </svg>
      );

    case 'Lightning':
    default:
      return (
        <svg viewBox="0 0 110 120" className={`${sizeClass} overflow-visible drop-shadow-[0_10px_18px_rgba(245,158,11,0.45)]`}>
          <defs>
            <linearGradient id="w3d_pureBolt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF59D" />
              <stop offset="45%" stopColor="#FFCA28" />
              <stop offset="100%" stopColor="#F57C00" />
            </linearGradient>
          </defs>
          <path
            d="M66 6 L22 64 H50 L36 114 L88 52 H58 L66 6 Z"
            fill="url(#w3d_pureBolt)"
            stroke="#FFE082"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

const DEFAULT_PRESET: WeatherPreset = {
  temp: '37',
  condition: 'Sunny',
  conditionVi: 'Nắng',
  badge: 'Hồ Chí Minh',
  location: 'Hồ Chí Minh',
};

const resolveTimezoneCityName = (): string => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz.includes('Ho_Chi_Minh') || tz.includes('Saigon')) return 'Hồ Chí Minh';
    if (tz.includes('Hanoi')) return 'Hà Nội';
    const cityPart = tz.split('/').pop();
    if (cityPart) return cityPart.replace(/_/g, ' ');
  } catch {
    // Fallback below
  }
  return 'Hồ Chí Minh';
};

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  currentPreset = DEFAULT_PRESET,
  onCycle,
  onShowNotification,
  currentTheme: _currentTheme,
}) => {
  const { showToast } = useToast();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [now, setNow] = useState<Date>(() => new Date());
  const [liveWeather, setLiveWeather] = useState<WeatherPreset | null>(null);
  const [isLoadingGeo, setIsLoadingGeo] = useState<boolean>(false);
  const [isForecastOpen, setIsForecastOpen] = useState<boolean>(false);
  const [manualOverride, setManualOverride] = useState<WeatherPreset | null>(null);

  // Đồng hồ thời gian thực cập nhật mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Tự động đồng bộ thời tiết thật từ Open-Meteo khi tải trang
  useEffect(() => {
    handleFetchGeoWeather(undefined, true);
  }, []);

  const handleFetchGeoWeather = async (e?: React.MouseEvent, silent = false) => {
    e?.stopPropagation();
    setIsLoadingGeo(true);
    if (!silent) {
      SoundEngine.playClockTick();
      showToast(
        isEn
          ? 'Updating live weather for your timezone... 🛰️'
          : 'Đang cập nhật thời tiết thực tế theo múi giờ... 🛰️'
      );
    }

    const fetchFromCoords = async (lat: number, lon: number, fallbackName: string, shouldReverseGeocode = false) => {
      try {
        let locName = fallbackName;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
        const weatherPromise = fetch(url).then((r) => r.json());

        const geoPromise = shouldReverseGeocode
          ? fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${isEn ? 'en' : 'vi'}`,
              { signal: AbortSignal.timeout(3000) }
            )
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          : Promise.resolve(null);

        const [data, geoData] = await Promise.all([weatherPromise, geoPromise]);
        if (geoData) {
          const detected = geoData.city || geoData.locality || geoData.principalSubdivision;
          if (typeof detected === 'string' && detected.trim().length > 0) {
            locName = detected.replace(/^Thành phố\s+/i, '').trim();
          }
        }

        const tempVal = Math.round(data.current?.temperature_2m ?? 34);
        const code = data.current?.weather_code ?? 0;

        let condition = 'Sunny';
        let conditionVi = 'Nắng';
        if (code === 0) {
          condition = 'Sunny';
          conditionVi = 'Nắng';
        } else if ([1, 2, 3].includes(code)) {
          condition = 'Cloudy';
          conditionVi = 'Nhiều mây';
        } else if ([45, 48].includes(code)) {
          condition = 'Overcast';
          conditionVi = 'Âm u';
        } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
          condition = 'Heavy Rain';
          conditionVi = 'Mưa lớn';
        } else if ([95, 96].includes(code)) {
          condition = 'Thunder Storm';
          conditionVi = 'Giông bão';
        } else if (code >= 99) {
          condition = 'Lightning';
          conditionVi = 'Sét';
        }

        const updated: WeatherPreset = {
          temp: String(tempVal),
          condition,
          conditionVi,
          badge: locName,
          location: locName,
        };

        setLiveWeather(updated);
        setManualOverride(null);
        if (!silent) {
          SoundEngine.playWeatherFeedback(condition);
          const condDisplay = isEn ? condition : conditionVi;
          const msg = isEn
            ? `Live weather synced (${locName}): ${tempVal}°C • ${condDisplay}`
            : `Đã đồng bộ thời tiết (${locName}): ${tempVal}°C • ${condDisplay}`;
          showToast(msg);
          onShowNotification?.(msg);
        }
      } catch {
        if (!silent) {
          showToast(isEn ? 'Showing standard weather mode.' : 'Đang hiển thị chế độ thời tiết tiêu chuẩn.');
        }
      } finally {
        setIsLoadingGeo(false);
      }
    };

    const tzCity = resolveTimezoneCityName();
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchFromCoords(pos.coords.latitude, pos.coords.longitude, tzCity, true),
        () => fetchFromCoords(10.7769, 106.7009, 'Hồ Chí Minh', false),
        { timeout: 5000 }
      );
    } else {
      fetchFromCoords(10.7769, 106.7009, 'Hồ Chí Minh', false);
    }
  };

  const activePreset = manualOverride || liveWeather || currentPreset;
  const cardCfg =
    WEATHER_CARD_STYLES[activePreset.condition] || WEATHER_CARD_STYLES.Sunny;
  const dateInfo = formatLocalizedDateInfo(now, language);
  const displayTemp = activePreset.temp || cardCfg.defaultTemp;
  const displayLabel = isEn ? cardCfg.condition : cardCfg.labelVi;
  const rawLocation = activePreset.location || 'Hồ Chí Minh';
  const displayLocation =
    isEn && rawLocation === 'Hồ Chí Minh' ? 'Ho Chi Minh City' : rawLocation;

  const handleOpenForecastModal = () => {
    onCycle?.();
    SoundEngine.playWeatherFeedback(activePreset.condition);
    setIsForecastOpen(true);
  };

  return (
    <>
      <div className="flex items-center gap-1.5 shrink-0 select-none">
        {/* THẺ THỜI TIẾT FOOTER (PHIÊN BẢN CŨ): ĐỒNG HỒ HH:MM · ICON + NHIỆT ĐỘ + TRẠNG THÁI + KHU VỰC · THỨ, NGÀY THÁNG NĂM */}
        <button
          id="weather-widget-card"
          type="button"
          data-element-type="card"
          data-weather-card="true"
          onClick={handleOpenForecastModal}
          aria-label={
            isEn
              ? `Weather ${displayLabel} ${displayTemp}°C in ${displayLocation}, ${dateInfo.fullDateHeader} at ${dateInfo.timeStr}. Click to open forecast`
              : `Thời tiết ${displayLabel} ${displayTemp}°C tại ${displayLocation}, ${dateInfo.fullDateHeader}, ${dateInfo.timeStr}. Nhấn để mở dự báo thời tiết`
          }
          title={
            isEn
              ? `Weather ${displayLabel} (${displayTemp}°C) • Area: ${displayLocation} • ${dateInfo.timeStr} • ${dateInfo.fullDateHeader}`
              : `Thời tiết ${displayLabel} (${displayTemp}°C) • Khu vực: ${displayLocation} • ${dateInfo.timeStr} • ${dateInfo.fullDateHeader}`
          }
          className="relative h-[50px] px-2.5 lg:px-3.5 py-1 rounded-[10px] flex items-center justify-between gap-2 lg:gap-3 cursor-pointer overflow-hidden text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          style={{
            borderRadius: '10px',
          }}
        >
          {/* 1. BÊN TRÁI: ĐỒNG HỒ HH:MM (24H) */}
          <div className="relative z-20 flex flex-col items-start justify-center shrink-0">
            <span
              suppressHydrationWarning
              style={{ color: 'var(--text-heading, var(--text-primary))' }}
              className="text-[16px] lg:text-[18px] font-mono font-bold leading-none tracking-tight tabular-nums"
            >
              {dateInfo.timeStr}
            </span>
          </div>

          {/* VÁCH NGĂN 1 */}
          <div
            className="relative z-10 w-[1px] h-7 rounded-full shrink-0 opacity-70"
            style={{ backgroundColor: 'var(--divider-nav-pill, var(--border-color))' }}
            aria-hidden="true"
          />

          {/* 2. Ở GIỮA: ICON THỜI TIẾT + NHIỆT ĐỘ + TRẠNG THÁI + KHU VỰC */}
          <div className="relative z-20 flex items-center gap-1.5 lg:gap-2 shrink-0 min-w-0">
            <div className="relative shrink-0 flex items-center justify-center">
              {render3DWeatherIcon(cardCfg.condition, 'w-8 h-8 lg:w-9 lg:h-9')}
            </div>
            <div className="flex flex-col justify-center leading-tight text-left min-w-0">
              <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                <span
                  suppressHydrationWarning
                  style={{ color: 'var(--text-primary)' }}
                  className="text-[13px] lg:text-[14px] font-bold leading-none tracking-tight font-play tabular-nums"
                >
                  {displayTemp}°C
                </span>
                <span
                  suppressHydrationWarning
                  style={{ color: 'var(--accent-sky, var(--text-link, var(--color-primary)))' }}
                  className="hidden sm:inline text-[11px] lg:text-[12px] font-bold font-play leading-none whitespace-nowrap"
                >
                  {displayLabel}
                </span>
              </div>
              <div
                className="flex items-center gap-1 mt-0.5 min-w-0"
                style={{ color: 'var(--text-secondary)' }}
              >
                <WebIcon
                  name="map-pin"
                  className="w-3 h-3 shrink-0"
                  style={{ color: 'var(--text-link, var(--color-primary))' }}
                />
                <span
                  suppressHydrationWarning
                  className="text-[10.5px] lg:text-[11px] font-medium font-play leading-none truncate max-w-[92px] sm:max-w-[110px] lg:max-w-[140px]"
                >
                  {displayLocation}
                </span>
              </div>
            </div>
          </div>

          {/* VÁCH NGĂN 2 */}
          <div
            className="relative z-10 w-[1px] h-7 rounded-full shrink-0 opacity-70"
            style={{ backgroundColor: 'var(--divider-nav-pill, var(--border-color))' }}
            aria-hidden="true"
          />

          {/* 3. BÊN PHẢI: THỨ, NGÀY THÁNG NĂM */}
          <div className="relative z-20 flex flex-col items-start justify-center gap-0.5 shrink-0 text-left leading-tight">
            <span
              suppressHydrationWarning
              style={{ color: 'var(--text-primary)' }}
              className="text-[11.5px] lg:text-[12.5px] font-bold font-play whitespace-nowrap leading-none tracking-tight"
            >
              <span className="md:inline xl:inline hidden sm:inline">{dateInfo.dayName}</span>
              <span className="inline sm:hidden">{dateInfo.shortDayName}</span>
            </span>
            <span
              suppressHydrationWarning
              style={{ color: 'var(--text-secondary)' }}
              className="text-[10.5px] lg:text-[11px] font-semibold whitespace-nowrap font-play leading-none tabular-nums"
            >
              <span className="xl:hidden">{dateInfo.compactDate}</span>
              <span className="hidden xl:inline">{dateInfo.fullMonthDate}</span>
            </span>
          </div>
        </button>
      </div>

      {/* MODAL BẢNG DỰ BÁO THỜI TIẾT 6 THẺ 3D */}
      {isForecastOpen && (
        <Modal
          isOpen={isForecastOpen}
          onClose={() => setIsForecastOpen(false)}
          title={isEn ? 'Visual Weather Forecast' : 'Dự Báo Thời Tiết Trực Quan'}
          icon={<WebIcon name="sun" className="w-5 h-5 text-amber-500" />}
          maxWidth="4xl"
        >
          <div className="theme-modal-subcard p-5 sm:p-8 rounded-[14px] font-play select-none">
            <div className="flex flex-col items-center text-center mb-6 gap-2">
              <h2
                className="typo-h2 font-bold tracking-wide inline-flex items-center justify-center gap-2"
                style={{ color: 'var(--text-heading, var(--text-primary))' }}
              >
                <WebIcon name="sun" className="w-5 h-5 text-amber-500 shrink-0" />
                <span>{isEn ? 'Weather Forecast' : 'Dự Báo Thời Tiết'}</span>
              </h2>
              <div
                className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 typo-body-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
                suppressHydrationWarning
              >
                <span className="inline-flex items-center gap-1 font-semibold" style={{ color: 'var(--text-primary)' }}>
                  <WebIcon name="map-pin" className="w-4 h-4 shrink-0" style={{ color: 'var(--text-link, var(--color-primary))' }} />
                  <span>{displayLocation}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span>{dateInfo.fullDateHeader}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-bold tabular-nums">{dateInfo.timeStr24Full}</span>
              </div>
              <button
                type="button"
                onClick={(e) => handleFetchGeoWeather(e, false)}
                disabled={isLoadingGeo}
                className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[999px] text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 border"
                style={{
                  backgroundColor: 'var(--bg-nav-pill, var(--bg-subcard))',
                  borderColor: 'var(--border-subcard, var(--border-color))',
                  color: 'var(--text-link, var(--color-primary))',
                }}
              >
                <WebIcon
                  name="refresh-cw"
                  className={`w-3.5 h-3.5 shrink-0 ${isLoadingGeo ? 'animate-spin' : ''}`}
                />
                <span>
                  {isLoadingGeo
                    ? isEn
                      ? 'Syncing live location...'
                      : 'Đang đồng bộ vị trí...'
                    : isEn
                    ? 'Sync Live Regional Weather'
                    : 'Cập nhật thời tiết khu vực thực tế'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 max-w-3xl mx-auto">
              {Object.values(WEATHER_CARD_STYLES).map((cfg) => {
                const isSelected = cardCfg.condition === cfg.condition;
                const selectedCondDisplay = isEn ? cfg.condition : cfg.labelVi;
                return (
                  <div
                    key={cfg.condition}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      SoundEngine.playWeatherFeedback(cfg.condition);
                      setManualOverride({
                        temp: cfg.defaultTemp,
                        condition: cfg.condition,
                        conditionVi: cfg.labelVi,
                        badge: rawLocation,
                        location: rawLocation,
                      });
                      onShowNotification?.(
                        isEn
                          ? `Weather switched to ${selectedCondDisplay} (${cfg.defaultTemp}°C)`
                          : `Đã đổi thẻ thời tiết sang ${selectedCondDisplay} (${cfg.defaultTemp}°C)`
                      );
                      setIsForecastOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                    style={{
                      background: cfg.cardGradient,
                      borderColor: cfg.borderGlow,
                      boxShadow: `0 14px 30px -6px ${cfg.shadowColor}, inset 0 1.5px 2px rgba(255,255,255,0.7)`,
                    }}
                    className={`relative h-[128px] sm:h-[136px] rounded-[14px] border px-6 py-4 flex items-center justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isSelected ? 'ring-4 ring-white shadow-2xl' : ''
                    }`}
                  >
                    {/* Vệt sáng chéo góc phải */}
                    <div className="absolute inset-0 rounded-[14px] overflow-hidden pointer-events-none">
                      <div
                        className="absolute -right-8 -top-8 w-36 h-36 rotate-45 opacity-25"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
                        }}
                      />
                    </div>

                    {cfg.iconPosition === 'left' && (
                      <div className="relative z-20 -ml-3 -mt-6 shrink-0">
                        {render3DWeatherIcon(cfg.condition, 'w-28 h-28 sm:w-32 sm:h-32')}
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col justify-center text-left">
                      <div className="flex items-baseline gap-1.5">
                        <span className="typo-kpi font-bold text-white leading-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.2)]">
                          {cfg.defaultTemp}
                        </span>
                        <span className="typo-h4 font-bold text-white/95 -translate-y-2">°C</span>
                        <span className="typo-h3 font-bold text-white ml-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                          {selectedCondDisplay}
                        </span>
                      </div>
                      <div className="typo-caption font-medium text-white/95 mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
                        {displayLocation} • {dateInfo.timeStr}
                      </div>
                      <div className="typo-caption font-medium text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
                        {dateInfo.shortDate}
                      </div>
                    </div>

                    {cfg.iconPosition === 'right' && (
                      <div className="relative z-20 -mr-3 -mt-6 shrink-0">
                        {render3DWeatherIcon(cfg.condition, 'w-28 h-28 sm:w-32 sm:h-32')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export const WeatherCard = WeatherWidget;
