import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

export interface MotionIconProps {
  id?: string;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  isActive?: boolean;
}

const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 360, damping: 20 };
const EASE_SMOOTH = { duration: 0.42, ease: [0.22, 1, 0.36, 1] as const };

const ICON_SVG_BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const drawVariant: Variants = {
  rest: { pathLength: 1, opacity: 1 },
  hover: {
    pathLength: [0.2, 1],
    opacity: [0.55, 1],
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const pulseScaleVariant: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: [1, 1.16, 0.96, 1.06, 1],
    transition: { duration: 0.48, ease: 'easeInOut' },
  },
};

const wobbleVariant: Variants = {
  rest: { rotate: 0 },
  hover: {
    rotate: [0, -10, 10, -5, 0],
    transition: { duration: 0.48, ease: 'easeInOut' },
  },
};

const spinCompassVariant: Variants = {
  rest: { rotate: 0 },
  hover: {
    rotate: [0, 38, -14, 0],
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const nudgeLeftVariant: Variants = {
  rest: { x: 0 },
  hover: { x: [0, -3, 0], transition: { duration: 0.36, ease: 'easeInOut' } },
};

const nudgeRightVariant: Variants = {
  rest: { x: 0 },
  hover: { x: [0, 3, 0], transition: { duration: 0.36, ease: 'easeInOut' } },
};

const bounceUpVariant: Variants = {
  rest: { y: 0 },
  hover: { y: [0, -2.5, 0], transition: { duration: 0.38, ease: 'easeOut' } },
};

/**
 * Bộ icon động chuẩn hóa theo hình học Lucide 24×24 xây dựng bằng `motion/react`.
 * Tự động tôn trọng `prefers-reduced-motion` của hệ điều hành.
 */
export const SUPPORTED_MOTION_ICONS = [
  'home',
  'mail',
  'user-round',
  'graduation-cap',
  'heart-handshake',
  'heart',
  'briefcase',
  'brain',
  'folder',
  'server',
  'mic',
  'compass',
  'camera',
  'bot',
  'image',
  'palette',
  'file-text',
  'languages',
  'layers',
  'sun',
  'moon',
  'sparkles',
  'chevron-left',
  'chevron-right',
  'volume-2',
  'volume-x',
  'play',
  'sliders',
  'search',
  'check',
  'x',
] as const;

export type SupportedMotionIconName = (typeof SUPPORTED_MOTION_ICONS)[number];

const MOTION_ALIAS_MAP: Record<string, SupportedMotionIconName> = {
  home: 'home',
  house: 'home',
  'fa-house-chimney': 'home',
  mail: 'mail',
  envelope: 'mail',
  'fa-envelope': 'mail',
  'fa-envelope-open-text': 'mail',
  user: 'user-round',
  'user-round': 'user-round',
  'fa-address-card': 'user-round',
  'fa-address-book': 'user-round',
  graduation: 'graduation-cap',
  'graduation-cap': 'graduation-cap',
  'fa-graduation-cap': 'graduation-cap',
  'heart-handshake': 'heart-handshake',
  'customer-support': 'heart-handshake',
  'fa-hand-holding-heart': 'heart-handshake',
  heart: 'heart',
  briefcase: 'briefcase',
  'fa-business-time': 'briefcase',
  brain: 'brain',
  'fa-brain': 'brain',
  folder: 'folder',
  'fa-diagram-project': 'folder',
  server: 'server',
  'fa-server': 'server',
  mic: 'mic',
  'fa-microphone-lines': 'mic',
  compass: 'compass',
  'fa-compass': 'compass',
  camera: 'camera',
  'fa-camera-retro': 'camera',
  bot: 'bot',
  robot: 'bot',
  'fa-robot': 'bot',
  image: 'image',
  'fa-image': 'image',
  palette: 'palette',
  'fa-palette': 'palette',
  'file-text': 'file-text',
  'fa-file-text': 'file-text',
  languages: 'languages',
  'fa-language': 'languages',
  layers: 'layers',
  sun: 'sun',
  moon: 'moon',
  sparkles: 'sparkles',
  'chevron-left': 'chevron-left',
  'chevron-right': 'chevron-right',
  volume: 'volume-2',
  volume2: 'volume-2',
  'volume-2': 'volume-2',
  'volume-high': 'volume-2',
  mute: 'volume-x',
  volumex: 'volume-x',
  'volume-x': 'volume-x',
  'volume-off': 'volume-x',
  play: 'play',
  sliders: 'sliders',
  search: 'search',
  check: 'check',
  x: 'x',
  cancel: 'x',
  close: 'x',
};

export function resolveMotionIconKey(name: string): SupportedMotionIconName | null {
  const norm = (name || '').toLowerCase().trim();
  return MOTION_ALIAS_MAP[norm] || null;
}

export const MotionIcon: React.FC<MotionIconProps> = ({
  id,
  name,
  size,
  className = 'w-4 h-4',
  style,
  strokeWidth = 2.4,
  isActive = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const key = resolveMotionIconKey(name);
  if (!key) return null;

  const svgProps = {
    id,
    width: size,
    height: size,
    className: `web-icon motion-icon ${className}`.trim(),
    style,
    strokeWidth,
    initial: 'rest' as const,
    animate: isActive && !prefersReducedMotion ? 'hover' : 'rest',
    whileHover: prefersReducedMotion ? undefined : ('hover' as const),
    whileTap: prefersReducedMotion ? undefined : { scale: 0.9 },
    transition: SPRING_SNAPPY,
    ...ICON_SVG_BASE,
  };

  switch (key) {
    case 'home':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" variants={bounceUpVariant} />
          <motion.path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" variants={drawVariant} />
        </motion.svg>
      );
    case 'mail':
      return (
        <motion.svg {...svgProps}>
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <motion.path
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
            variants={{
              rest: { y: 0 },
              hover: { y: [0, -1.8, 0], transition: EASE_SMOOTH },
            }}
          />
        </motion.svg>
      );
    case 'user-round':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="12" cy="8" r="5" variants={bounceUpVariant} />
          <motion.path d="M20 21a8 8 0 0 0-16 0" variants={drawVariant} />
        </motion.svg>
      );
    case 'graduation-cap':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
            variants={wobbleVariant}
            style={{ originX: '12px', originY: '10px' }}
          />
          <motion.path d="M22 10v6" variants={drawVariant} />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </motion.svg>
      );
    case 'heart-handshake':
    case 'heart':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            variants={pulseScaleVariant}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );
    case 'briefcase':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" variants={bounceUpVariant} />
          <motion.rect width="20" height="14" x="2" y="6" rx="2" variants={wobbleVariant} style={{ originX: '12px', originY: '13px' }} />
        </motion.svg>
      );
    case 'brain':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" variants={pulseScaleVariant} style={{ originX: '12px', originY: '12px' }} />
          <motion.path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" variants={pulseScaleVariant} style={{ originX: '12px', originY: '12px' }} />
          <path d="M12 5v13" />
        </motion.svg>
      );
    case 'folder':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
            variants={bounceUpVariant}
          />
        </motion.svg>
      );
    case 'server':
      return (
        <motion.svg {...svgProps}>
          <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
          <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
          <motion.line x1="6" x2="6.01" y1="6" y2="6" variants={pulseScaleVariant} />
          <motion.line x1="6" x2="6.01" y1="18" y2="18" variants={pulseScaleVariant} />
        </motion.svg>
      );
    case 'mic':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" variants={bounceUpVariant} />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </motion.svg>
      );
    case 'compass':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.polygon
            points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
            variants={spinCompassVariant}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );
    case 'camera':
      return (
        <motion.svg {...svgProps}>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <motion.circle cx="12" cy="13" r="3" variants={pulseScaleVariant} style={{ originX: '12px', originY: '13px' }} />
        </motion.svg>
      );
    case 'bot':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 8V4H8" variants={wobbleVariant} style={{ originX: '12px', originY: '8px' }} />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <motion.path d="M15 13v2" variants={pulseScaleVariant} />
          <motion.path d="M9 13v2" variants={pulseScaleVariant} />
        </motion.svg>
      );
    case 'image':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <motion.circle cx="9" cy="9" r="2" variants={pulseScaleVariant} style={{ originX: '9px', originY: '9px' }} />
          <motion.path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" variants={drawVariant} />
        </motion.svg>
      );
    case 'palette':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={wobbleVariant} style={{ originX: '12px', originY: '12px' }}>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </motion.g>
        </motion.svg>
      );
    case 'file-text':
      return (
        <motion.svg {...svgProps}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <motion.path d="M10 9H8" variants={drawVariant} />
          <motion.path d="M16 13H8" variants={drawVariant} />
          <motion.path d="M16 17H8" variants={drawVariant} />
        </motion.svg>
      );
    case 'languages':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m5 8 6 6" variants={drawVariant} />
          <motion.path d="m4 14 6-6 2-3" variants={drawVariant} />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <motion.path d="m22 22-5-10-5 10" variants={bounceUpVariant} />
          <path d="M14 18h6" />
        </motion.svg>
      );
    case 'layers':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" variants={bounceUpVariant} />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <motion.path
            d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
            variants={{ rest: { y: 0 }, hover: { y: [0, -1.2, 0], transition: EASE_SMOOTH } }}
          />
        </motion.svg>
      );
    case 'sun':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="4" />
          <motion.g
            variants={{
              rest: { rotate: 0 },
              hover: { rotate: 45, transition: { duration: 0.45, ease: 'easeOut' } },
            }}
            style={{ originX: '12px', originY: '12px' }}
          >
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </motion.g>
        </motion.svg>
      );
    case 'moon':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
            variants={wobbleVariant}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );
    case 'sparkles':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
            variants={pulseScaleVariant}
            style={{ originX: '12px', originY: '12px' }}
          />
          <motion.path d="M20 3v4" variants={drawVariant} />
          <motion.path d="M22 5h-4" variants={drawVariant} />
        </motion.svg>
      );
    case 'chevron-left':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m15 18-6-6 6-6" variants={nudgeLeftVariant} />
        </motion.svg>
      );
    case 'chevron-right':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m9 18 6-6-6-6" variants={nudgeRightVariant} />
        </motion.svg>
      );
    case 'volume-2':
      return (
        <motion.svg {...svgProps}>
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <motion.path d="M16 9a5 5 0 0 1 0 6" variants={pulseScaleVariant} />
          <motion.path d="M19.364 18.364a9 9 0 0 0 0-12.728" variants={drawVariant} />
        </motion.svg>
      );
    case 'volume-x':
      return (
        <motion.svg {...svgProps}>
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <motion.line x1="22" x2="16" y1="9" y2="15" variants={drawVariant} />
          <motion.line x1="16" x2="22" y1="9" y2="15" variants={drawVariant} />
        </motion.svg>
      );
    case 'play':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon points="6 3 20 12 6 21 6 3" variants={nudgeRightVariant} />
        </motion.svg>
      );
    case 'sliders':
      return (
        <motion.svg {...svgProps}>
          <line x1="21" x2="14" y1="4" y2="4" />
          <line x1="10" x2="3" y1="4" y2="4" />
          <line x1="21" x2="12" y1="12" y2="12" />
          <line x1="8" x2="3" y1="12" y2="12" />
          <line x1="21" x2="16" y1="20" y2="20" />
          <line x1="12" x2="3" y1="20" y2="20" />
          <motion.line x1="14" x2="14" y1="2" y2="6" variants={nudgeLeftVariant} />
          <motion.line x1="8" x2="8" y1="10" y2="14" variants={nudgeRightVariant} />
          <motion.line x1="16" x2="16" y1="18" y2="22" variants={nudgeLeftVariant} />
        </motion.svg>
      );
    case 'search':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={wobbleVariant} style={{ originX: '11px', originY: '11px' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </motion.g>
        </motion.svg>
      );
    case 'check':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M20 6 9 17l-5-5" variants={drawVariant} />
        </motion.svg>
      );
    case 'x':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M18 6 6 18" variants={drawVariant} />
          <motion.path d="m6 6 12 12" variants={drawVariant} />
        </motion.svg>
      );
    default:
      return null;
  }
};

export default MotionIcon;
