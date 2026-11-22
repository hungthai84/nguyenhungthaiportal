import React from 'react';

interface Weather3DIconProps {
  type: 'cloudy-sun' | 'thunder-cloud' | 'overcast-clouds' | 'bright-sun' | 'heavy-rain-cloud' | 'lightning-bolt';
  className?: string;
}

export const Weather3DIcon: React.FC<Weather3DIconProps> = ({ type, className = 'w-10 h-10' }) => {
  switch (type) {
    case 'cloudy-sun':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <radialGradient id="cloud-white" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde68a" />
            </radialGradient>
            <filter id="sun-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#b45309" floodOpacity="0.25" />
            </filter>
          </defs>
          {/* Sun behind */}
          <circle cx="36" cy="36" r="24" fill="url(#sun-glow)" filter="url(#sun-blur)" opacity="0.6" />
          <circle cx="36" cy="36" r="20" fill="url(#sun-glow)" />
          {/* 3D Puffy Cloud in front */}
          <g filter="url(#cloud-shadow)">
            <ellipse cx="62" cy="56" rx="28" ry="20" fill="url(#cloud-white)" />
            <circle cx="46" cy="52" r="19" fill="url(#cloud-white)" />
            <circle cx="68" cy="46" r="16" fill="url(#cloud-white)" />
            <ellipse cx="56" cy="62" rx="30" ry="14" fill="url(#cloud-white)" />
          </g>
        </svg>
      );

    case 'thunder-cloud':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cloud-thunder" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
            <linearGradient id="lightning-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="lightning-glow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#eab308" floodOpacity="0.6" />
            </filter>
          </defs>
          {/* Rain streaks */}
          <line x1="36" y1="68" x2="33" y2="80" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <line x1="48" y1="72" x2="45" y2="85" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          <line x1="68" y1="68" x2="65" y2="80" stroke="#93c5fd" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          {/* Cloud body */}
          <g>
            <ellipse cx="50" cy="40" rx="30" ry="20" fill="url(#cloud-thunder)" />
            <circle cx="36" cy="36" r="16" fill="url(#cloud-thunder)" />
            <circle cx="60" cy="32" r="18" fill="url(#cloud-thunder)" />
          </g>
          {/* Lightning bolt striking down */}
          <polygon
            points="54,48 44,66 52,66 48,86 64,62 55,62"
            fill="url(#lightning-grad)"
            filter="url(#lightning-glow)"
          />
        </svg>
      );

    case 'overcast-clouds':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="cloud-puff-1" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
            <filter id="cloud-soft-shadow">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#64748b" floodOpacity="0.2" />
            </filter>
          </defs>
          <g filter="url(#cloud-soft-shadow)">
            {/* Back cloud */}
            <circle cx="62" cy="42" r="20" fill="url(#cloud-puff-1)" opacity="0.95" />
            <ellipse cx="68" cy="54" rx="22" ry="16" fill="url(#cloud-puff-1)" opacity="0.95" />
            {/* Front puffy cloud */}
            <circle cx="40" cy="52" r="17" fill="url(#cloud-puff-1)" />
            <circle cx="50" cy="46" r="22" fill="url(#cloud-puff-1)" />
            <ellipse cx="44" cy="62" rx="26" ry="14" fill="url(#cloud-puff-1)" />
          </g>
        </svg>
      );

    case 'bright-sun':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="sun-core" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="65%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>
            <radialGradient id="sun-corona" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#fb923c" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
            </radialGradient>
            <filter id="sun-rays">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          {/* Intense Outer Glow Rays */}
          <circle cx="50" cy="50" r="42" fill="url(#sun-corona)" filter="url(#sun-rays)" />
          {/* Ray bursts subtle */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="50"
              x2={50 + 36 * Math.cos((deg * Math.PI) / 180)}
              y2={50 + 36 * Math.sin((deg * Math.PI) / 180)}
              stroke="#fbbf24"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          ))}
          {/* Glowing 3D Sun Sphere */}
          <circle cx="50" cy="50" r="25" fill="url(#sun-core)" />
        </svg>
      );

    case 'heavy-rain-cloud':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cloud-rain-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#dbeafe" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
            <linearGradient id="rain-stream" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
          {/* Heavy rain streams falling */}
          <line x1="28" y1="58" x2="28" y2="86" stroke="url(#rain-stream)" strokeWidth="3" strokeLinecap="round" />
          <line x1="38" y1="62" x2="38" y2="92" stroke="url(#rain-stream)" strokeWidth="3" strokeLinecap="round" />
          <line x1="48" y1="58" x2="48" y2="88" stroke="url(#rain-stream)" strokeWidth="3" strokeLinecap="round" />
          <line x1="58" y1="62" x2="58" y2="94" stroke="url(#rain-stream)" strokeWidth="3" strokeLinecap="round" />
          <line x1="68" y1="58" x2="68" y2="88" stroke="url(#rain-stream)" strokeWidth="3" strokeLinecap="round" />
          {/* 3D Puffy Rain Cloud */}
          <g>
            <ellipse cx="50" cy="38" rx="28" ry="18" fill="url(#cloud-rain-grad)" />
            <circle cx="36" cy="34" r="16" fill="url(#cloud-rain-grad)" />
            <circle cx="62" cy="32" r="17" fill="url(#cloud-rain-grad)" />
          </g>
        </svg>
      );

    case 'lightning-bolt':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pure-lightning" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="45%" stopColor="#facc15" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="bolt-glow">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#facc15" floodOpacity="0.8" />
            </filter>
          </defs>
          <polygon
            points="58,10 26,52 48,52 38,90 76,42 54,42"
            fill="url(#pure-lightning)"
            filter="url(#bolt-glow)"
          />
        </svg>
      );

    default:
      return null;
  }
};
