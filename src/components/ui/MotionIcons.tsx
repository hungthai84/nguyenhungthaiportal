import React, { memo, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ICON_VARIANTS,
  SPRING_DECK,
  SPRING_STANDARD,
  useIconAnimationControls,
} from './iconMotionPresets';

export interface MotionIconProps {
  id?: string;
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  isActive?: boolean;
  isHovered?: boolean;
  duration?: number;
  hoverTrigger?: boolean;
  disableAncestorTrigger?: boolean;
  'aria-hidden'?: boolean;
}

export const SUPPORTED_MOTION_ICONS = [
  'activity',
  'alarm-clock',
  'alert-circle',
  'alert-triangle',
  'anchor',
  'archive',
  'arrow-down',
  'arrow-left',
  'arrow-left-right',
  'arrow-right',
  'arrow-up',
  'arrow-up-right',
  'award',
  'bar-chart-3',
  'bell',
  'bell-ring',
  'bluetooth',
  'book',
  'book-open',
  'bookmark',
  'bot',
  'boxes',
  'brain',
  'briefcase',
  'briefcase-business',
  'building-2',
  'calendar',
  'calendar-check',
  'calendar-days',
  'camera',
  'car',
  'chart-no-axes-combined',
  'check',
  'check-circle',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'chevrons-up-down',
  'circle-help',
  'clipboard',
  'clock',
  'cloud',
  'code',
  'coins',
  'compass',
  'contact',
  'contact-2',
  'contact-round',
  'copy',
  'corner-down-left',
  'cpu',
  'credit-card',
  'crown',
  'database',
  'dollar-sign',
  'download',
  'droplet',
  'edit-3',
  'external-link',
  'eye',
  'eye-off',
  'file',
  'file-text',
  'filter',
  'flag',
  'flame',
  'folder',
  'folder-kanban',
  'gamepad-2',
  'gauge',
  'gem',
  'gift',
  'git-branch',
  'git-merge',
  'globe',
  'graduation-cap',
  'grid',
  'hash',
  'headphones',
  'heart',
  'heart-handshake',
  'history',
  'home',
  'id-card',
  'image',
  'images',
  'key-round',
  'landmark',
  'languages',
  'laptop',
  'layers',
  'layout',
  'leaf',
  'lightbulb',
  'line-chart',
  'link',
  'linkedin',
  'list',
  'list-checks',
  'list-filter',
  'lock',
  'log-in',
  'log-out',
  'mail',
  'map',
  'map-pin',
  'maximize-2',
  'menu',
  'message-square',
  'messages-square',
  'mic',
  'minimize-2',
  'minus',
  'monitor',
  'moon',
  'more-horizontal',
  'move',
  'navigation',
  'network',
  'palette',
  'pause',
  'phone',
  'phone-call',
  'pie-chart',
  'pin',
  'pin-off',
  'play',
  'plus',
  'presentation',
  'qr-code',
  'quote',
  'radio-tower',
  'refresh-cw',
  'rocket',
  'rotate-ccw',
  'rotate-cw',
  'route',
  'save',
  'scale',
  'search',
  'send',
  'server',
  'settings',
  'settings-2',
  'share-2',
  'shield',
  'shield-alert',
  'shield-check',
  'shopping-bag',
  'shopping-cart',
  'signal',
  'skip-back',
  'skip-forward',
  'sliders',
  'smartphone',
  'smile',
  'snowflake',
  'sparkles',
  'sprout',
  'square',
  'star',
  'sun',
  'table',
  'tag',
  'target',
  'terminal',
  'timer',
  'trash-2',
  'trending-down',
  'trending-up',
  'trophy',
  'tv',
  'unlock',
  'upload',
  'user',
  'user-check',
  'user-cog',
  'user-plus',
  'user-round',
  'users',
  'users-round',
  'video',
  'volume-2',
  'volume-x',
  'wallet',
  'wifi',
  'workflow',
  'wrench',
  'x',
  'zap',
  'zoom-in',
] as const;

export type SupportedMotionIconName = (typeof SUPPORTED_MOTION_ICONS)[number];

const MOTION_ALIAS_MAP: Record<string, SupportedMotionIconName> = {
  activity: 'activity',
  'alarm-clock': 'alarm-clock',
  alarmclock: 'alarm-clock',
  'alert-circle': 'alert-circle',
  alertcircle: 'alert-circle',
  'alert-triangle': 'alert-triangle',
  alerttriangle: 'alert-triangle',
  alert: 'alert-triangle',
  anchor: 'anchor',
  archive: 'archive',
  'arrow-down': 'arrow-down',
  arrowdown: 'arrow-down',
  'arrow-left': 'arrow-left',
  arrowleft: 'arrow-left',
  'arrow-left-right': 'arrow-left-right',
  arrowleftright: 'arrow-left-right',
  'arrow-right': 'arrow-right',
  arrowright: 'arrow-right',
  'arrow-up': 'arrow-up',
  arrowup: 'arrow-up',
  'arrow-up-right': 'arrow-up-right',
  arrowupright: 'arrow-up-right',
  award: 'award',
  chart: 'bar-chart-3',
  barchart3: 'bar-chart-3',
  'bar-chart': 'bar-chart-3',
  'bar-chart-3': 'bar-chart-3',
  'chart-no-axes-combined': 'chart-no-axes-combined',
  chartnoaxescombined: 'chart-no-axes-combined',
  'pie-chart': 'pie-chart',
  piechart: 'pie-chart',
  'fa-chart-pie': 'pie-chart',
  bell: 'bell',
  'bell-ring': 'bell-ring',
  bellring: 'bell-ring',
  bluetooth: 'bluetooth',
  book: 'book',
  'book-open': 'book-open',
  bookopen: 'book-open',
  bookmark: 'bookmark',
  bot: 'bot',
  robot: 'bot',
  'fa-robot': 'bot',
  boxes: 'boxes',
  brain: 'brain',
  'brain-circuit': 'brain',
  'fa-brain': 'brain',
  briefcase: 'briefcase',
  'briefcase-business': 'briefcase-business',
  briefcasebusiness: 'briefcase-business',
  'fa-business-time': 'briefcase',
  building: 'building-2',
  'building-2': 'building-2',
  building2: 'building-2',
  calendar: 'calendar',
  'calendar-days': 'calendar-days',
  calendardays: 'calendar-days',
  'calendar-check': 'calendar-check',
  'fa-calendar-check': 'calendar-check',
  camera: 'camera',
  'fa-camera-retro': 'camera',
  car: 'car',
  check: 'check',
  'check-circle': 'check-circle',
  'check-circle-02': 'check-circle',
  checkcircle: 'check-circle',
  checkcircle2: 'check-circle',
  'chevron-down': 'chevron-down',
  chevrondown: 'chevron-down',
  'chevron-left': 'chevron-left',
  chevronleft: 'chevron-left',
  'chevron-right': 'chevron-right',
  chevronright: 'chevron-right',
  'chevron-up': 'chevron-up',
  chevronup: 'chevron-up',
  'chevrons-up-down': 'chevrons-up-down',
  'circle-help': 'circle-help',
  help: 'circle-help',
  clipboard: 'clipboard',
  clock: 'clock',
  cloud: 'cloud',
  code: 'code',
  coins: 'coins',
  compass: 'compass',
  'fa-compass': 'compass',
  contact: 'contact',
  contact2: 'contact-2',
  'contact-2': 'contact-2',
  'contact-round': 'contact-round',
  contactround: 'contact-round',
  copy: 'copy',
  'corner-down-left': 'corner-down-left',
  cpu: 'cpu',
  'fa-microchip': 'cpu',
  'credit-card': 'credit-card',
  crown: 'crown',
  'fa-crown': 'crown',
  database: 'database',
  'dollar-sign': 'dollar-sign',
  dollarsign: 'dollar-sign',
  download: 'download',
  droplet: 'droplet',
  edit: 'edit-3',
  edit3: 'edit-3',
  'edit-3': 'edit-3',
  pencil: 'edit-3',
  'external-link': 'external-link',
  externallink: 'external-link',
  eye: 'eye',
  'eye-off': 'eye-off',
  file: 'file',
  'file-text': 'file-text',
  'fa-file-text': 'file-text',
  'fa-file-lines': 'file-text',
  filter: 'filter',
  flag: 'flag',
  flame: 'flame',
  folder: 'folder',
  'folder-kanban': 'folder-kanban',
  kanban: 'folder-kanban',
  'fa-diagram-project': 'folder-kanban',
  game: 'gamepad-2',
  'gamepad-2': 'gamepad-2',
  gamepad2: 'gamepad-2',
  gauge: 'gauge',
  gem: 'gem',
  gift: 'gift',
  'git-branch': 'git-branch',
  gitbranch: 'git-branch',
  'git-merge': 'git-merge',
  gitmerge: 'git-merge',
  globe: 'globe',
  graduation: 'graduation-cap',
  'graduation-cap': 'graduation-cap',
  graduationcap: 'graduation-cap',
  'fa-graduation-cap': 'graduation-cap',
  grid: 'grid',
  'layout-grid': 'grid',
  layoutgrid: 'grid',
  layout: 'layout',
  hash: 'hash',
  headphones: 'headphones',
  headset: 'headphones',
  'fa-headset': 'headphones',
  heart: 'heart',
  'heart-handshake': 'heart-handshake',
  hearthandshake: 'heart-handshake',
  'customer-support': 'heart-handshake',
  'fa-hand-holding-heart': 'heart-handshake',
  history: 'history',
  home: 'home',
  house: 'home',
  'fa-house-chimney': 'home',
  'id-card': 'id-card',
  image: 'image',
  images: 'images',
  'fa-image': 'image',
  'key-round': 'key-round',
  keyround: 'key-round',
  landmark: 'landmark',
  languages: 'languages',
  'fa-language': 'languages',
  laptop: 'laptop',
  layers: 'layers',
  leaf: 'leaf',
  lightbulb: 'lightbulb',
  'line-chart': 'line-chart',
  linechart: 'line-chart',
  link: 'link',
  linkedin: 'linkedin',
  'fa-linkedin-in': 'linkedin',
  list: 'list',
  'list-checks': 'list-checks',
  listchecks: 'list-checks',
  'list-filter': 'list-filter',
  lock: 'lock',
  unlock: 'unlock',
  'log-in': 'log-in',
  'log-out': 'log-out',
  mail: 'mail',
  envelope: 'mail',
  'fa-envelope': 'mail',
  'fa-envelope-open-text': 'mail',
  map: 'map',
  location: 'map-pin',
  'map-pin': 'map-pin',
  mappin: 'map-pin',
  maximize: 'maximize-2',
  'maximize-2': 'maximize-2',
  maximize2: 'maximize-2',
  menu: 'menu',
  'more-horizontal': 'more-horizontal',
  morehorizontal: 'more-horizontal',
  'message-square': 'message-square',
  messagesquare: 'message-square',
  chat: 'message-square',
  'fa-comment-dots': 'message-square',
  'messages-square': 'messages-square',
  mic: 'mic',
  'fa-microphone-lines': 'mic',
  minimize: 'minimize-2',
  'minimize-2': 'minimize-2',
  minimize2: 'minimize-2',
  minus: 'minus',
  monitor: 'monitor',
  moon: 'moon',
  move: 'move',
  navigation: 'navigation',
  network: 'network',
  'fa-network-wired': 'network',
  palette: 'palette',
  'fa-palette': 'palette',
  pause: 'pause',
  phone: 'phone',
  call: 'phone',
  'fa-phone': 'phone',
  'phone-call': 'phone-call',
  phonecall: 'phone-call',
  pin: 'pin',
  'pin-off': 'pin-off',
  play: 'play',
  plus: 'plus',
  presentation: 'presentation',
  slides: 'presentation',
  'fa-chalkboard-user': 'presentation',
  'qr-code': 'qr-code',
  qrcode: 'qr-code',
  quote: 'quote',
  tower: 'radio-tower',
  'radio-tower': 'radio-tower',
  refresh: 'refresh-cw',
  'refresh-cw': 'refresh-cw',
  refreshcw: 'refresh-cw',
  'fa-arrows-rotate': 'refresh-cw',
  rocket: 'rocket',
  'rotate-ccw': 'rotate-ccw',
  rotateccw: 'rotate-ccw',
  'rotate-cw': 'rotate-cw',
  rotatecw: 'rotate-cw',
  route: 'route',
  save: 'save',
  scale: 'scale',
  'fa-scale-balanced': 'scale',
  search: 'search',
  send: 'send',
  server: 'server',
  'fa-server': 'server',
  settings: 'settings',
  cog: 'settings',
  'settings-2': 'settings-2',
  settings2: 'settings-2',
  share: 'share-2',
  'share-2': 'share-2',
  shield: 'shield',
  'shield-alert': 'shield-alert',
  shieldalert: 'shield-alert',
  'fa-shield-exclamation': 'shield-alert',
  'shield-check': 'shield-check',
  shieldcheck: 'shield-check',
  'shopping-bag': 'shopping-bag',
  shoppingbag: 'shopping-bag',
  'shopping-cart': 'shopping-cart',
  shoppingcart: 'shopping-cart',
  signal: 'signal',
  backward: 'skip-back',
  'skip-back': 'skip-back',
  forward: 'skip-forward',
  'skip-forward': 'skip-forward',
  sliders: 'sliders',
  'sliders-horizontal': 'sliders',
  slidershorizontal: 'sliders',
  smartphone: 'smartphone',
  smile: 'smile',
  snowflake: 'snowflake',
  sparkles: 'sparkles',
  sprout: 'sprout',
  square: 'square',
  stop: 'square',
  star: 'star',
  sun: 'sun',
  table: 'table',
  tag: 'tag',
  target: 'target',
  terminal: 'terminal',
  timer: 'timer',
  'trash-2': 'trash-2',
  trending: 'trending-up',
  'trending-up': 'trending-up',
  trendingup: 'trending-up',
  'trending-down': 'trending-down',
  trendingdown: 'trending-down',
  'trend-down': 'trending-down',
  trophy: 'trophy',
  tv: 'tv',
  upload: 'upload',
  user: 'user',
  person: 'user',
  'user-check': 'user-check',
  usercheck: 'user-check',
  'user-cog': 'user-cog',
  usercog: 'user-cog',
  'user-plus': 'user-plus',
  'user-round': 'user-round',
  'fa-address-card': 'user-round',
  users: 'users',
  'users-round': 'users-round',
  usersround: 'users-round',
  'user-group': 'users',
  'fa-address-book': 'user-check',
  video: 'video',
  volume: 'volume-2',
  volume2: 'volume-2',
  'volume-2': 'volume-2',
  'volume-high': 'volume-2',
  mute: 'volume-x',
  volumex: 'volume-x',
  'volume-x': 'volume-x',
  'volume-off': 'volume-x',
  wallet: 'wallet',
  wifi: 'wifi',
  workflow: 'workflow',
  wrench: 'wrench',
  x: 'x',
  cancel: 'x',
  close: 'x',
  zap: 'zap',
  bolt: 'zap',
  'zoom-in': 'zoom-in',
  zoomin: 'zoom-in',
};

export function resolveMotionIconKey(name: string): SupportedMotionIconName | null {
  const norm = (name || '').toLowerCase().trim();
  if (MOTION_ALIAS_MAP[norm]) return MOTION_ALIAS_MAP[norm];
  const clean = norm.replace(/^fa-(solid|regular|brands)\s+/, '').replace(/^fa-/, '');
  return MOTION_ALIAS_MAP[clean] || null;
}

const ICON_SVG_BASE = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const MotionIconInner: React.FC<MotionIconProps> = ({
  id,
  name,
  size,
  color,
  className = 'w-4 h-4',
  style,
  strokeWidth = 2.85,
  isActive = false,
  isHovered,
  duration,
  hoverTrigger = true,
  disableAncestorTrigger = false,
  'aria-hidden': ariaHidden,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const key = resolveMotionIconKey(name);

  const { controls } = useIconAnimationControls(svgRef, {
    isActive,
    isHovered,
    hoverTrigger,
    disableAncestorTrigger,
    prefersReducedMotion,
  });

  if (!key) return null;

  const isCustomStroke = typeof strokeWidth === 'number' && Math.abs(strokeWidth - 2.85) > 0.02;

  const mergedStyle: React.CSSProperties | undefined = color
    ? { color, ...style }
    : style;

  const baseTransition =
    typeof duration === 'number'
      ? { ...SPRING_STANDARD, duration }
      : SPRING_DECK;

  const svgProps: React.ComponentProps<typeof motion.svg> & {
    'data-thin-stroke'?: string;
  } = {
    ref: svgRef,
    id,
    width: size,
    height: size,
    className: `web-icon motion-icon ${className}`.trim(),
    style: mergedStyle,
    stroke: color || 'currentColor',
    strokeWidth,
    'data-thin-stroke': isCustomStroke ? 'true' : undefined,
    'aria-hidden': ariaHidden,
    initial: 'idle',
    animate: controls,
    whileTap: prefersReducedMotion ? undefined : { scale: 0.94 },
    transition: baseTransition,
    ...ICON_SVG_BASE,
  };

  switch (key) {
    case 'bell':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
            variants={ICON_VARIANTS.bellBody}
            style={{ originX: '12px', originY: '3px' }}
          />
          <motion.path
            d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
            variants={ICON_VARIANTS.bellClapper}
            style={{ originX: '12px', originY: '18px' }}
          />
        </motion.svg>
      );

    case 'bell-ring':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
            variants={ICON_VARIANTS.bellBody}
            style={{ originX: '12px', originY: '3px' }}
          />
          <motion.path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" variants={ICON_VARIANTS.bellClapper} />
          <motion.path d="M4 2C2.8 3.7 2 5.7 2 8" variants={ICON_VARIANTS.soundWaveInner} style={{ originX: '4px', originY: '5px' }} />
          <motion.path d="M22 8c0-2.3-.8-4.3-2-6" variants={ICON_VARIANTS.soundWaveInner} style={{ originX: '20px', originY: '5px' }} />
        </motion.svg>
      );

    case 'heart':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            variants={ICON_VARIANTS.heartBeat}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'heart-handshake':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            variants={ICON_VARIANTS.heartHandshakePulse}
            style={{ originX: '12px', originY: '12px' }}
          />
          <motion.path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" variants={ICON_VARIANTS.handshakeFold} />
          <motion.path d="m18 15-2-2" variants={ICON_VARIANTS.handshakeFold} />
          <motion.path d="m15 18-2-2" variants={ICON_VARIANTS.handshakeFold} />
        </motion.svg>
      );

    case 'search':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.searchScan} style={{ originX: '11px', originY: '11px' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </motion.g>
        </motion.svg>
      );

    case 'zoom-in':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.zoomPulse} style={{ originX: '11px', originY: '11px' }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <motion.line x1="11" x2="11" y1="8" y2="14" variants={ICON_VARIANTS.pathDraw} />
            <motion.line x1="8" x2="14" y1="11" y2="11" variants={ICON_VARIANTS.pathDraw} />
          </motion.g>
        </motion.svg>
      );

    case 'download':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" variants={ICON_VARIANTS.downloadTray} style={{ originX: '12px', originY: '19px' }} />
          <motion.g variants={ICON_VARIANTS.downloadArrow}>
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </motion.g>
        </motion.svg>
      );

    case 'upload':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" variants={ICON_VARIANTS.downloadTray} style={{ originX: '12px', originY: '19px' }} />
          <motion.g variants={ICON_VARIANTS.uploadArrow}>
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </motion.g>
        </motion.svg>
      );

    case 'check':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M20 6 9 17l-5-5" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'check-circle':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="12" cy="12" r="10" variants={ICON_VARIANTS.circleSettle} style={{ originX: '12px', originY: '12px' }} />
          <motion.path d="m9 12 2 2 4-4" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'arrow-left':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideLeft}>
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </motion.g>
        </motion.svg>
      );

    case 'arrow-right':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideRight}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </motion.g>
        </motion.svg>
      );

    case 'arrow-up':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideUp}>
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </motion.g>
        </motion.svg>
      );

    case 'arrow-down':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideDown}>
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </motion.g>
        </motion.svg>
      );

    case 'arrow-up-right':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.launchDiagonal}>
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </motion.g>
        </motion.svg>
      );

    case 'arrow-left-right':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.splitRight}>
            <path d="M8 3 4 7l4 4" />
            <path d="M4 7h16" />
          </motion.g>
          <motion.g variants={ICON_VARIANTS.splitLeft}>
            <path d="m16 21 4-4-4-4" />
            <path d="M20 17H4" />
          </motion.g>
        </motion.svg>
      );

    case 'chevron-left':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m15 18-6-6 6-6" variants={ICON_VARIANTS.slideLeft} />
        </motion.svg>
      );

    case 'chevron-right':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m9 18 6-6-6-6" variants={ICON_VARIANTS.slideRight} />
        </motion.svg>
      );

    case 'chevron-up':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m18 15-6-6-6 6" variants={ICON_VARIANTS.slideUp} />
        </motion.svg>
      );

    case 'chevron-down':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m6 9 6 6 6-6" variants={ICON_VARIANTS.slideDown} />
        </motion.svg>
      );

    case 'chevrons-up-down':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m7 15 5 5 5-5" variants={ICON_VARIANTS.splitDown} />
          <motion.path d="m7 9 5-5 5 5" variants={ICON_VARIANTS.splitUp} />
        </motion.svg>
      );

    case 'refresh-cw':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.spinCW} style={{ originX: '12px', originY: '12px' }}>
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </motion.g>
        </motion.svg>
      );

    case 'rotate-cw':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.spinCW} style={{ originX: '12px', originY: '12px' }}>
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </motion.g>
        </motion.svg>
      );

    case 'rotate-ccw':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.spinCCW} style={{ originX: '12px', originY: '12px' }}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </motion.g>
        </motion.svg>
      );

    case 'settings':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.gearRotateLoop} style={{ originX: '12px', originY: '12px' }}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </motion.g>
        </motion.svg>
      );

    case 'mail':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="20" height="16" x="2" y="4" rx="2" variants={ICON_VARIANTS.mailFrameLift} />
          <motion.path
            d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
            variants={ICON_VARIANTS.mailFlapOpen}
            style={{ originX: '12px', originY: '7px' }}
          />
        </motion.svg>
      );

    case 'calendar':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M8 2v4" variants={ICON_VARIANTS.calendarRing} />
          <motion.path d="M16 2v4" variants={ICON_VARIANTS.calendarRing} />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <motion.path
            d="M8 14h.01"
            variants={ICON_VARIANTS.calendarDatePop}
            style={{ originX: '8px', originY: '14px' }}
          />
          <motion.path
            d="M12 14h.01"
            variants={ICON_VARIANTS.calendarDatePop}
            style={{ originX: '12px', originY: '14px' }}
          />
          <motion.path
            d="M16 14h.01"
            variants={ICON_VARIANTS.calendarDatePop}
            style={{ originX: '16px', originY: '14px' }}
          />
        </motion.svg>
      );

    case 'calendar-check':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M8 2v4" variants={ICON_VARIANTS.calendarRing} />
          <motion.path d="M16 2v4" variants={ICON_VARIANTS.calendarRing} />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <motion.path d="m9 16 2 2 4-4" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'activity':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
            variants={ICON_VARIANTS.waveformDraw}
          />
        </motion.svg>
      );

    case 'rocket':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.rocketFloat} style={{ originX: '12px', originY: '12px' }}>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
          </motion.g>
          <motion.path
            d="M4.5 19.5 2 22"
            variants={ICON_VARIANTS.rocketTrail}
            style={{ originX: '5px', originY: '19px' }}
          />
        </motion.svg>
      );

    case 'star':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            variants={ICON_VARIANTS.starTwinkle}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'sparkles':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
            variants={ICON_VARIANTS.sparkleMain}
            style={{ originX: '12px', originY: '12px' }}
          />
          <motion.g variants={ICON_VARIANTS.sparkleMinor} style={{ originX: '20px', originY: '5px' }}>
            <path d="M20 3v4" />
            <path d="M22 5h-4" />
          </motion.g>
          <motion.circle cx="4" cy="20" r="1" variants={ICON_VARIANTS.sparkleMinor} style={{ originX: '4px', originY: '20px' }} />
        </motion.svg>
      );

    case 'sun':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="4" />
          <motion.g variants={ICON_VARIANTS.sunRays} style={{ originX: '12px', originY: '12px' }}>
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
            variants={ICON_VARIANTS.moonTilt}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'home':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            variants={ICON_VARIANTS.homeRoofLift}
          />
          <motion.path
            d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
            variants={ICON_VARIANTS.homeDoorOpen}
            style={{ originY: '21px' }}
          />
        </motion.svg>
      );

    case 'user':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="12" cy="7" r="4" variants={ICON_VARIANTS.userHeadNod} />
          <motion.path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'user-round':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="12" cy="8" r="5" variants={ICON_VARIANTS.userHeadNod} />
          <motion.path d="M20 21a8 8 0 0 0-16 0" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'user-check':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="9" cy="7" r="4" variants={ICON_VARIANTS.userHeadNod} />
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <motion.polyline points="16 11 18 13 22 9" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'user-plus':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="9" cy="7" r="4" variants={ICON_VARIANTS.userHeadNod} />
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <motion.line x1="19" x2="19" y1="8" y2="14" variants={ICON_VARIANTS.pathDraw} />
          <motion.line x1="22" x2="16" y1="11" y2="11" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'user-cog':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="9" cy="7" r="4" variants={ICON_VARIANTS.userHeadNod} />
          <path d="M12 15H6a4 4 0 0 0-4 4v2" />
          <motion.g variants={ICON_VARIANTS.gearRotateLoop} style={{ originX: '18px', originY: '15px' }}>
            <circle cx="18" cy="15" r="3" />
            <path d="M18 11v1" />
            <path d="M18 18v1" />
            <path d="M14 15h1" />
            <path d="M21 15h1" />
          </motion.g>
        </motion.svg>
      );

    case 'users':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="9" cy="7" r="4" variants={ICON_VARIANTS.userHeadNod} />
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <motion.g variants={ICON_VARIANTS.userSecondarySlide}>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </motion.g>
        </motion.svg>
      );

    case 'contact':
    case 'contact-2':
    case 'id-card':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <motion.circle cx="12" cy="11" r="2.5" variants={ICON_VARIANTS.userHeadNod} />
          <motion.path d="M7 20v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" variants={ICON_VARIANTS.pathDraw} />
          <path d="M8 2v2" />
          <path d="M16 2v2" />
        </motion.svg>
      );

    case 'briefcase':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" variants={ICON_VARIANTS.briefcaseHandle} />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </motion.svg>
      );

    case 'building-2':
      return (
        <motion.svg {...svgProps}>
          <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
          <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
          <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
          <motion.path d="M10 6h4" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M10 10h4" variants={ICON_VARIANTS.docLine2} />
          <motion.path d="M10 14h4" variants={ICON_VARIANTS.docLine3} />
          <path d="M10 18h4" />
        </motion.svg>
      );

    case 'graduation-cap':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
            variants={ICON_VARIANTS.gradCapTilt}
            style={{ originX: '12px', originY: '10px' }}
          />
          <motion.path d="M22 10v6" variants={ICON_VARIANTS.gradTassel} style={{ originX: '22px', originY: '10px' }} />
          <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
        </motion.svg>
      );

    case 'brain':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" variants={ICON_VARIANTS.shieldPulse} style={{ originX: '8px', originY: '12px' }} />
          <motion.path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" variants={ICON_VARIANTS.shieldPulse} style={{ originX: '16px', originY: '12px' }} />
          <motion.path d="M12 5v13" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'folder':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
            variants={ICON_VARIANTS.layersTop}
          />
        </motion.svg>
      );

    case 'folder-kanban':
      return (
        <motion.svg {...svgProps}>
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          <motion.path d="M8 10v4" variants={ICON_VARIANTS.bar1Grow} style={{ originY: '10px' }} />
          <motion.path d="M12 10v2" variants={ICON_VARIANTS.bar2Grow} style={{ originY: '10px' }} />
          <motion.path d="M16 10v6" variants={ICON_VARIANTS.bar3Grow} style={{ originY: '10px' }} />
        </motion.svg>
      );

    case 'server':
      return (
        <motion.svg {...svgProps}>
          <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
          <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
          <motion.line x1="6" x2="6.01" y1="6" y2="6" variants={ICON_VARIANTS.serverLedA} />
          <motion.line x1="6" x2="6.01" y1="18" y2="18" variants={ICON_VARIANTS.serverLedB} />
        </motion.svg>
      );

    case 'database':
      return (
        <motion.svg {...svgProps}>
          <motion.ellipse cx="12" cy="5" rx="9" ry="3" variants={ICON_VARIANTS.dbTier1} />
          <motion.path d="M3 5V19A9 3 0 0 0 21 19V5" />
          <motion.path d="M3 12A9 3 0 0 0 21 12" variants={ICON_VARIANTS.dbTier2} />
        </motion.svg>
      );

    case 'cpu':
      return (
        <motion.svg {...svgProps}>
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <motion.rect width="6" height="6" x="9" y="9" rx="1" variants={ICON_VARIANTS.cpuCore} style={{ originX: '12px', originY: '12px' }} />
          <path d="M15 2v2" />
          <path d="M15 20v2" />
          <path d="M2 15h2" />
          <path d="M2 9h2" />
          <path d="M20 15h2" />
          <path d="M20 9h2" />
          <path d="M9 2v2" />
          <path d="M9 20v2" />
        </motion.svg>
      );

    case 'network':
      return (
        <motion.svg {...svgProps}>
          <motion.rect x="16" y="16" width="6" height="6" rx="1" variants={ICON_VARIANTS.shareNodeRadiate} style={{ originX: '19px', originY: '19px' }} />
          <motion.rect x="2" y="16" width="6" height="6" rx="1" variants={ICON_VARIANTS.shareNodeRadiate} style={{ originX: '5px', originY: '19px' }} />
          <motion.rect x="9" y="2" width="6" height="6" rx="1" variants={ICON_VARIANTS.shareNodeRadiate} style={{ originX: '12px', originY: '5px' }} />
          <motion.path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M12 12V8" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'workflow':
      return (
        <motion.svg {...svgProps}>
          <rect width="8" height="8" x="3" y="3" rx="2" />
          <motion.path d="M7 11v4a2 2 0 0 0 2 2h4" variants={ICON_VARIANTS.pathDraw} />
          <motion.rect width="8" height="8" x="13" y="13" rx="2" variants={ICON_VARIANTS.copyFront} />
        </motion.svg>
      );

    case 'git-merge':
      return (
        <motion.svg {...svgProps}>
          <circle cx="18" cy="18" r="3" />
          <circle cx="6" cy="6" r="3" />
          <motion.path d="M6 21V9a9 9 0 0 0 9 9" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'git-branch':
      return (
        <motion.svg {...svgProps}>
          <line x1="6" x2="6" y1="3" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <motion.path d="M18 9a9 9 0 0 1-9 9" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'boxes':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" variants={ICON_VARIANTS.layersMid} />
          <motion.path d="m17 16.5-4.74-2.85" variants={ICON_VARIANTS.layersTop} />
          <motion.path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" variants={ICON_VARIANTS.layersMid} />
          <motion.path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'mic':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
            variants={ICON_VARIANTS.micPulse}
            style={{ originX: '12px', originY: '12px' }}
          />
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
            variants={ICON_VARIANTS.compassSeek}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'camera':
      return (
        <motion.svg {...svgProps}>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <motion.circle
            cx="12"
            cy="13"
            r="3"
            variants={ICON_VARIANTS.cameraShutter}
            style={{ originX: '12px', originY: '13px' }}
          />
        </motion.svg>
      );

    case 'bot':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M12 8V4H8"
            variants={ICON_VARIANTS.botAntenna}
            style={{ originX: '12px', originY: '8px' }}
          />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <motion.path d="M15 13v2" variants={ICON_VARIANTS.botEyeBlink} style={{ originY: '14px' }} />
          <motion.path d="M9 13v2" variants={ICON_VARIANTS.botEyeBlink} style={{ originY: '14px' }} />
        </motion.svg>
      );

    case 'image':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <motion.circle
            cx="9"
            cy="9"
            r="2"
            variants={ICON_VARIANTS.userHeadNod}
            style={{ originX: '9px', originY: '9px' }}
          />
          <motion.path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'palette':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.paletteTilt} style={{ originX: '12px', originY: '12px' }}>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
            <motion.circle cx="13.5" cy="6.5" r=".75" fill="currentColor" stroke="none" strokeWidth={0} variants={ICON_VARIANTS.paletteDot} style={{ originX: '13.5px', originY: '6.5px' }} />
            <motion.circle cx="17.5" cy="10.5" r=".75" fill="currentColor" stroke="none" strokeWidth={0} variants={ICON_VARIANTS.paletteDot} style={{ originX: '17.5px', originY: '10.5px' }} />
            <motion.circle cx="8.5" cy="7.5" r=".75" fill="currentColor" stroke="none" strokeWidth={0} variants={ICON_VARIANTS.paletteDot} style={{ originX: '8.5px', originY: '7.5px' }} />
            <motion.circle cx="6.5" cy="12.5" r=".75" fill="currentColor" stroke="none" strokeWidth={0} variants={ICON_VARIANTS.paletteDot} style={{ originX: '6.5px', originY: '12.5px' }} />
          </motion.g>
        </motion.svg>
      );

    case 'file-text':
      return (
        <motion.svg {...svgProps}>
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
          <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          <motion.path d="M10 9H8" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M16 13H8" variants={ICON_VARIANTS.docLine2} />
          <motion.path d="M16 17H8" variants={ICON_VARIANTS.docLine3} />
        </motion.svg>
      );

    case 'languages':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m5 8 6 6" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="m4 14 6-6 2-3" variants={ICON_VARIANTS.docLine2} />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <motion.path d="m22 22-5-10-5 10" variants={ICON_VARIANTS.layersTop} />
          <path d="M14 18h6" />
        </motion.svg>
      );

    case 'layers':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
            variants={ICON_VARIANTS.layersTop}
          />
          <motion.path
            d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
            variants={ICON_VARIANTS.layersMid}
          />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
        </motion.svg>
      );

    case 'volume-2':
      return (
        <motion.svg {...svgProps}>
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <motion.path d="M16 9a5 5 0 0 1 0 6" variants={ICON_VARIANTS.soundWaveInner} style={{ originX: '14px', originY: '12px' }} />
          <motion.path d="M19.364 18.364a9 9 0 0 0 0-12.728" variants={ICON_VARIANTS.soundWaveOuter} style={{ originX: '14px', originY: '12px' }} />
        </motion.svg>
      );

    case 'volume-x':
      return (
        <motion.svg {...svgProps}>
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <motion.line x1="22" x2="16" y1="9" y2="15" variants={ICON_VARIANTS.pathDraw} />
          <motion.line x1="16" x2="22" y1="9" y2="15" variants={ICON_VARIANTS.pathDrawDelayed} />
        </motion.svg>
      );

    case 'headphones':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.heartHandshakePulse} style={{ originX: '12px', originY: '12px' }}>
            <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
          </motion.g>
        </motion.svg>
      );

    case 'radio-tower':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" variants={ICON_VARIANTS.soundWaveOuter} style={{ originX: '12px', originY: '9px' }} />
          <motion.path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" variants={ICON_VARIANTS.soundWaveInner} style={{ originX: '12px', originY: '9px' }} />
          <circle cx="12" cy="9" r="2" />
          <motion.path d="M16.2 4.8c2 2 2.26 5.11.8 7.47" variants={ICON_VARIANTS.soundWaveInner} style={{ originX: '12px', originY: '9px' }} />
          <motion.path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1" variants={ICON_VARIANTS.soundWaveOuter} style={{ originX: '12px', originY: '9px' }} />
          <path d="M9.5 18h5" />
          <path d="m8 22 4-11 4 11" />
        </motion.svg>
      );

    case 'play':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon points="6 3 20 12 6 21 6 3" variants={ICON_VARIANTS.slideRight} />
        </motion.svg>
      );

    case 'pause':
      return (
        <motion.svg {...svgProps}>
          <motion.rect x="14" y="4" width="4" height="16" rx="1" variants={ICON_VARIANTS.pauseBarB} style={{ originY: '12px' }} />
          <motion.rect x="6" y="4" width="4" height="16" rx="1" variants={ICON_VARIANTS.pauseBarA} style={{ originY: '12px' }} />
        </motion.svg>
      );

    case 'square':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="14" height="14" x="5" y="5" rx="2" variants={ICON_VARIANTS.circleSettle} style={{ originX: '12px', originY: '12px' }} />
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
          <motion.line x1="14" x2="14" y1="2" y2="6" variants={ICON_VARIANTS.sliderLeft} />
          <motion.line x1="8" x2="8" y1="10" y2="14" variants={ICON_VARIANTS.sliderRight} />
          <motion.line x1="16" x2="16" y1="18" y2="22" variants={ICON_VARIANTS.sliderLeft} />
        </motion.svg>
      );

    case 'x':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M18 6 6 18" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="m6 6 12 12" variants={ICON_VARIANTS.pathDrawDelayed} />
        </motion.svg>
      );

    case 'plus':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M5 12h14" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M12 5v14" variants={ICON_VARIANTS.pathDrawDelayed} />
        </motion.svg>
      );

    case 'minus':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M5 12h14" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'maximize-2':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.expandNE}>
            <polyline points="15 3 21 3 21 9" />
            <line x1="21" x2="14" y1="3" y2="10" />
          </motion.g>
          <motion.g variants={ICON_VARIANTS.expandSW}>
            <polyline points="9 21 3 21 3 15" />
            <line x1="3" x2="10" y1="21" y2="14" />
          </motion.g>
        </motion.svg>
      );

    case 'minimize-2':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.contractNE}>
            <polyline points="4 14 10 14 10 20" />
            <line x1="3" x2="10" y1="21" y2="14" />
          </motion.g>
          <motion.g variants={ICON_VARIANTS.contractSW}>
            <polyline points="20 10 14 10 14 4" />
            <line x1="14" x2="21" y1="10" y2="3" />
          </motion.g>
        </motion.svg>
      );

    case 'move':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 2v20" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M2 12h20" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="m9 5 3-3 3 3" variants={ICON_VARIANTS.splitUp} />
          <motion.path d="m9 19 3 3 3-3" variants={ICON_VARIANTS.splitDown} />
          <motion.path d="m5 9-3 3 3 3" variants={ICON_VARIANTS.splitLeft} />
          <motion.path d="m19 9 3 3-3 3" variants={ICON_VARIANTS.splitRight} />
        </motion.svg>
      );

    case 'copy':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="14" height="14" x="8" y="8" rx="2" ry="2" variants={ICON_VARIANTS.copyFront} />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </motion.svg>
      );

    case 'trash-2':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.trashLidLift} style={{ originX: '4px', originY: '6px' }}>
            <path d="M3 6h18" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </motion.g>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </motion.svg>
      );

    case 'send':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.sendFly}>
            <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
            <path d="m21.854 2.147-10.94 10.939" />
          </motion.g>
        </motion.svg>
      );

    case 'clock':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.path
            d="M12 6v6"
            variants={ICON_VARIANTS.clockMinuteSweep}
            style={{ originX: '12px', originY: '12px' }}
          />
          <motion.path
            d="m12 12 4 2"
            variants={ICON_VARIANTS.clockHourSweep}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'trending-up':
      return (
        <motion.svg {...svgProps}>
          <motion.polyline points="22 7 13.5 15.5 8.5 10.5 2 17" variants={ICON_VARIANTS.waveformDraw} />
          <motion.polyline points="16 7 22 7 22 13" variants={ICON_VARIANTS.launchDiagonal} />
        </motion.svg>
      );

    case 'bar-chart-3':
      return (
        <motion.svg {...svgProps}>
          <path d="M3 3v18h18" />
          <motion.path d="M18 17V9" variants={ICON_VARIANTS.bar3Grow} style={{ originY: '17px' }} />
          <motion.path d="M13 17V5" variants={ICON_VARIANTS.bar2Grow} style={{ originY: '17px' }} />
          <motion.path d="M8 17v-3" variants={ICON_VARIANTS.bar1Grow} style={{ originY: '17px' }} />
        </motion.svg>
      );

    case 'line-chart':
      return (
        <motion.svg {...svgProps}>
          <path d="M3 3v18h18" />
          <motion.path d="m19 9-5 5-4-4-3 3" variants={ICON_VARIANTS.waveformDraw} />
        </motion.svg>
      );

    case 'shield':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            variants={ICON_VARIANTS.shieldPulse}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'shield-check':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            variants={ICON_VARIANTS.shieldPulse}
            style={{ originX: '12px', originY: '12px' }}
          />
          <motion.path d="m9 12 2 2 4-4" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'shield-alert':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
            variants={ICON_VARIANTS.shieldPulse}
            style={{ originX: '12px', originY: '12px' }}
          />
          <motion.path d="M12 8v4" variants={ICON_VARIANTS.zapFlash} />
          <motion.path d="M12 16h.01" variants={ICON_VARIANTS.zapFlash} />
        </motion.svg>
      );

    case 'lock':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <motion.path d="M7 11V7a5 5 0 0 1 10 0v4" variants={ICON_VARIANTS.lockShackleLift} />
        </motion.svg>
      );

    case 'alert-circle':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.line x1="12" x2="12" y1="8" y2="12" variants={ICON_VARIANTS.zapFlash} />
          <motion.line x1="12" x2="12.01" y1="16" y2="16" variants={ICON_VARIANTS.zapFlash} />
        </motion.svg>
      );

    case 'alert-triangle':
      return (
        <motion.svg {...svgProps}>
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <motion.path d="M12 9v4" variants={ICON_VARIANTS.zapFlash} />
          <motion.path d="M12 17h.01" variants={ICON_VARIANTS.zapFlash} />
        </motion.svg>
      );

    case 'circle-help':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M12 17h.01" variants={ICON_VARIANTS.zapFlash} />
        </motion.svg>
      );

    case 'award':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.trophyLift} style={{ originX: '12px', originY: '9px' }}>
            <circle cx="12" cy="8" r="6" />
          </motion.g>
          <motion.path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" variants={ICON_VARIANTS.layersMid} />
        </motion.svg>
      );

    case 'trophy':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.trophyLift} style={{ originX: '12px', originY: '12px' }}>
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </motion.g>
        </motion.svg>
      );

    case 'gift':
      return (
        <motion.svg {...svgProps}>
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13" />
          <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
          <motion.path
            d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"
            variants={ICON_VARIANTS.giftLidLift}
            style={{ originX: '12px', originY: '8px' }}
          />
        </motion.svg>
      );

    case 'target':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.circle cx="12" cy="12" r="6" variants={ICON_VARIANTS.circleSettle} style={{ originX: '12px', originY: '12px' }} />
          <motion.circle cx="12" cy="12" r="2" variants={ICON_VARIANTS.targetBullseye} style={{ originX: '12px', originY: '12px' }} />
        </motion.svg>
      );

    case 'zap':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
            variants={ICON_VARIANTS.zapFlash}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'flame':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            variants={ICON_VARIANTS.flameFlicker}
            style={{ originX: '12px', originY: '20px' }}
          />
        </motion.svg>
      );

    case 'coins':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="8" cy="8" r="6" variants={ICON_VARIANTS.dbTier1} />
          <motion.path d="M18.09 10.37A6 6 0 1 1 10.34 18" variants={ICON_VARIANTS.dbTier2} />
          <path d="M7 6h1v4" />
        </motion.svg>
      );

    case 'dollar-sign':
      return (
        <motion.svg {...svgProps}>
          <line x1="12" x2="12" y1="2" y2="22" />
          <motion.path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'wallet':
      return (
        <motion.svg {...svgProps}>
          <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
          <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
          <motion.circle cx="17.5" cy="14" r=".75" fill="currentColor" stroke="none" strokeWidth={0} variants={ICON_VARIANTS.targetBullseye} style={{ originX: '17.5px', originY: '14px' }} />
        </motion.svg>
      );

    case 'credit-card':
      return (
        <motion.svg {...svgProps}>
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <motion.line x1="2" x2="22" y1="10" y2="10" variants={ICON_VARIANTS.docLine1} />
        </motion.svg>
      );

    case 'shopping-cart':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideRight}>
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </motion.g>
        </motion.svg>
      );

    case 'shopping-bag':
      return (
        <motion.svg {...svgProps}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <motion.path d="M16 10a4 4 0 0 1-8 0" variants={ICON_VARIANTS.briefcaseHandle} />
        </motion.svg>
      );

    case 'gamepad-2':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.paletteTilt} style={{ originX: '12px', originY: '12px' }}>
            <line x1="6" x2="10" y1="11" y2="11" />
            <line x1="8" x2="8" y1="9" y2="13" />
            <motion.line x1="15" x2="15.01" y1="12" y2="12" variants={ICON_VARIANTS.paletteDot} />
            <motion.line x1="18" x2="18.01" y1="10" y2="10" variants={ICON_VARIANTS.paletteDot} />
            <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
          </motion.g>
        </motion.svg>
      );

    case 'phone':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            variants={ICON_VARIANTS.phoneVibrate}
            style={{ originX: '12px', originY: '12px' }}
          />
        </motion.svg>
      );

    case 'phone-call':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" variants={ICON_VARIANTS.phoneVibrate} style={{ originX: '12px', originY: '12px' }} />
          <motion.path d="M14.05 2a9 9 0 0 1 8 7.94" variants={ICON_VARIANTS.soundWaveOuter} style={{ originX: '14px', originY: '10px' }} />
          <motion.path d="M14.05 6A5 5 0 0 1 18 10" variants={ICON_VARIANTS.soundWaveInner} style={{ originX: '14px', originY: '10px' }} />
        </motion.svg>
      );

    case 'map-pin':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.mapPinDrop}>
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
            <circle cx="12" cy="10" r="3" />
          </motion.g>
        </motion.svg>
      );

    case 'navigation':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon points="3 11 22 2 13 21 11 13 3 11" variants={ICON_VARIANTS.launchDiagonal} />
        </motion.svg>
      );

    case 'globe':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.path
            d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
            variants={ICON_VARIANTS.globeMeridian}
            style={{ originX: '12px', originY: '12px' }}
          />
          <path d="M2 12h20" />
        </motion.svg>
      );

    case 'message-square':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            variants={ICON_VARIANTS.layersTop}
          />
        </motion.svg>
      );

    case 'messages-square':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2z" variants={ICON_VARIANTS.layersTop} />
          <motion.path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" variants={ICON_VARIANTS.userSecondarySlide} />
        </motion.svg>
      );

    case 'share-2':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="18" cy="5" r="3" variants={ICON_VARIANTS.shareNodeRadiate} style={{ originX: '18px', originY: '5px' }} />
          <circle cx="6" cy="12" r="3" />
          <motion.circle cx="18" cy="19" r="3" variants={ICON_VARIANTS.shareNodeRadiate} style={{ originX: '18px', originY: '19px' }} />
          <motion.line x1="8.59" x2="15.42" y1="13.51" y2="17.49" variants={ICON_VARIANTS.pathDraw} />
          <motion.line x1="15.41" x2="8.59" y1="6.51" y2="10.49" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'link':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" variants={ICON_VARIANTS.splitRight} />
          <motion.path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" variants={ICON_VARIANTS.splitLeft} />
        </motion.svg>
      );

    case 'external-link':
      return (
        <motion.svg {...svgProps}>
          <path d="M15 3h6v6" />
          <motion.path d="M10 14 21 3" variants={ICON_VARIANTS.launchDiagonal} />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </motion.svg>
      );

    case 'linkedin':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" variants={ICON_VARIANTS.layersTop} />
          <rect width="4" height="12" x="2" y="9" />
          <motion.circle cx="4" cy="4" r="2" variants={ICON_VARIANTS.userHeadNod} />
        </motion.svg>
      );

    case 'quote':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" variants={ICON_VARIANTS.layersMid} />
          <motion.path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'edit-3':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 20h9" variants={ICON_VARIANTS.pathDraw} />
          <motion.path
            d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
            variants={ICON_VARIANTS.editWrite}
            style={{ originX: '6px', originY: '18px' }}
          />
        </motion.svg>
      );

    case 'eye':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.eyeBlink} style={{ originX: '12px', originY: '12px' }}>
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </motion.g>
        </motion.svg>
      );

    case 'eye-off':
      return (
        <motion.svg {...svgProps}>
          <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
          <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
          <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
          <motion.path d="m2 2 20 20" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'book':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'book-open':
      return (
        <motion.svg {...svgProps}>
          <path d="M12 7v14" />
          <motion.path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" variants={ICON_VARIANTS.globeMeridian} style={{ originX: '12px', originY: '12px' }} />
        </motion.svg>
      );

    case 'bookmark':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" variants={ICON_VARIANTS.mapPinDrop} />
        </motion.svg>
      );

    case 'clipboard':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="8" height="4" x="8" y="2" rx="1" ry="1" variants={ICON_VARIANTS.calendarRing} />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        </motion.svg>
      );

    case 'list':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M8 6h13" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M8 12h13" variants={ICON_VARIANTS.docLine2} />
          <motion.path d="M8 18h13" variants={ICON_VARIANTS.docLine3} />
          <path d="M3 6h.01" />
          <path d="M3 12h.01" />
          <path d="M3 18h.01" />
        </motion.svg>
      );

    case 'list-checks':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m3 17 2 2 4-4" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="m3 7 2 2 4-4" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M13 6h8" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M13 12h8" variants={ICON_VARIANTS.docLine2} />
          <motion.path d="M13 18h8" variants={ICON_VARIANTS.docLine3} />
        </motion.svg>
      );

    case 'list-filter':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M3 6h18" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M7 12h10" variants={ICON_VARIANTS.docLine2} />
          <motion.path d="M10 18h4" variants={ICON_VARIANTS.docLine3} />
        </motion.svg>
      );

    case 'filter':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" variants={ICON_VARIANTS.circleSettle} style={{ originX: '12px', originY: '12px' }} />
        </motion.svg>
      );

    case 'grid':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="7" height="7" x="3" y="3" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '6.5px', originY: '6.5px' }} />
          <motion.rect width="7" height="7" x="14" y="3" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '17.5px', originY: '6.5px' }} />
          <motion.rect width="7" height="7" x="14" y="14" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '17.5px', originY: '17.5px' }} />
          <motion.rect width="7" height="7" x="3" y="14" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '6.5px', originY: '17.5px' }} />
        </motion.svg>
      );

    case 'table':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <motion.path d="M3 9h18" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M3 15h18" variants={ICON_VARIANTS.docLine2} />
          <motion.path d="M9 3v18" variants={ICON_VARIANTS.docLine3} />
        </motion.svg>
      );

    case 'qr-code':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="5" height="5" x="3" y="3" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '5.5px', originY: '5.5px' }} />
          <motion.rect width="5" height="5" x="16" y="3" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '18.5px', originY: '5.5px' }} />
          <motion.rect width="5" height="5" x="3" y="16" rx="1" variants={ICON_VARIANTS.qrModulePulse} style={{ originX: '5.5px', originY: '18.5px' }} />
          <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
          <path d="M21 21v.01" />
          <path d="M12 7v3a2 2 0 0 1-2 2H7" />
          <path d="M3 12h.01" />
          <path d="M12 3h.01" />
          <path d="M12 16v.01" />
          <path d="M16 12h1" />
          <path d="M21 12v.01" />
          <path d="M12 21v-1" />
        </motion.svg>
      );

    case 'smile':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="12" r="10" />
          <motion.path d="M8 14s1.5 2 4 2 4-2 4-2" variants={ICON_VARIANTS.pathDraw} />
          <motion.line x1="9" x2="9.01" y1="9" y2="9" variants={ICON_VARIANTS.botEyeBlink} />
          <motion.line x1="15" x2="15.01" y1="9" y2="9" variants={ICON_VARIANTS.botEyeBlink} />
        </motion.svg>
      );

    case 'droplet':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" variants={ICON_VARIANTS.mapPinDrop} />
        </motion.svg>
      );

    case 'sprout':
      return (
        <motion.svg {...svgProps}>
          <path d="M7 20h10" />
          <motion.path d="M10 20c5.5-2.5.8-6.4 3-10" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" variants={ICON_VARIANTS.layersTop} />
          <motion.path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'landmark':
      return (
        <motion.svg {...svgProps}>
          <line x1="3" x2="21" y1="22" y2="22" />
          <motion.line x1="6" x2="6" y1="18" y2="11" variants={ICON_VARIANTS.bar1Grow} style={{ originY: '18px' }} />
          <motion.line x1="10" x2="10" y1="18" y2="11" variants={ICON_VARIANTS.bar2Grow} style={{ originY: '18px' }} />
          <motion.line x1="14" x2="14" y1="18" y2="11" variants={ICON_VARIANTS.bar2Grow} style={{ originY: '18px' }} />
          <motion.line x1="18" x2="18" y1="18" y2="11" variants={ICON_VARIANTS.bar3Grow} style={{ originY: '18px' }} />
          <motion.polygon points="12 2 20 7 4 7" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'scale':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.paletteTilt} style={{ originX: '12px', originY: '7px' }}>
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
            <path d="M7 21h10" />
            <path d="M12 3v18" />
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
          </motion.g>
        </motion.svg>
      );

    case 'tag':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.paletteTilt} style={{ originX: '7px', originY: '7px' }}>
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
            <circle cx="7.5" cy="7.5" r=".75" fill="currentColor" stroke="none" strokeWidth={0} />
          </motion.g>
        </motion.svg>
      );

    case 'wrench':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            variants={ICON_VARIANTS.wrenchTurn}
            style={{ originX: '6px', originY: '18px' }}
          />
        </motion.svg>
      );

    case 'snowflake':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.sunRays} style={{ originX: '12px', originY: '12px' }}>
            <line x1="2" x2="22" y1="12" y2="12" />
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="m20 16-4-4 4-4" />
            <path d="m4 8 4 4-4 4" />
            <path d="m16 4-4 4-4-4" />
            <path d="m8 20 4-4 4 4" />
          </motion.g>
        </motion.svg>
      );

    case 'car':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideRight}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </motion.g>
        </motion.svg>
      );

    case 'pin':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.mapPinDrop}>
            <path d="M12 17v5" />
            <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
          </motion.g>
        </motion.svg>
      );

    case 'pin-off':
      return (
        <motion.svg {...svgProps}>
          <path d="M12 17v5" />
          <path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" />
          <motion.path d="m2 2 20 20" variants={ICON_VARIANTS.pathDraw} />
          <path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" />
        </motion.svg>
      );

    case 'archive':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="20" height="5" x="2" y="3" rx="1" variants={ICON_VARIANTS.layersTop} />
          <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
          <path d="M10 12h4" />
        </motion.svg>
      );

    case 'corner-down-left':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideLeft}>
            <polyline points="9 10 4 15 9 20" />
            <path d="M20 4v7a4 4 0 0 1-4 4H4" />
          </motion.g>
        </motion.svg>
      );

    case 'gauge':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m12 14 4-4" variants={ICON_VARIANTS.compassSeek} style={{ originX: '12px', originY: '14px' }} />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </motion.svg>
      );

    case 'hash':
      return (
        <motion.svg {...svgProps}>
          <motion.line x1="4" x2="20" y1="9" y2="9" variants={ICON_VARIANTS.docLine1} />
          <motion.line x1="4" x2="20" y1="15" y2="15" variants={ICON_VARIANTS.docLine2} />
          <line x1="10" x2="8" y1="3" y2="21" />
          <line x1="16" x2="14" y1="3" y2="21" />
        </motion.svg>
      );

    case 'key-round':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.wrenchTurn} style={{ originX: '7px', originY: '16px' }}>
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
            <circle cx="16.5" cy="7.5" r=".75" fill="currentColor" stroke="none" strokeWidth={0} />
          </motion.g>
        </motion.svg>
      );

    case 'leaf':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.paletteTilt} style={{ originX: '4px', originY: '20px' }}>
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </motion.g>
        </motion.svg>
      );

    case 'log-in':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.slideRight}>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" x2="3" y1="12" y2="12" />
          </motion.g>
        </motion.svg>
      );

    case 'log-out':
      return (
        <motion.svg {...svgProps}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <motion.g variants={ICON_VARIANTS.slideRight}>
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </motion.g>
        </motion.svg>
      );

    case 'monitor':
      return (
        <motion.svg {...svgProps}>
          <motion.rect width="20" height="14" x="2" y="3" rx="2" variants={ICON_VARIANTS.circleSettle} style={{ originX: '12px', originY: '10px' }} />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </motion.svg>
      );

    case 'presentation':
      return (
        <motion.svg {...svgProps}>
          <path d="M2 3h20" />
          <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
          <motion.path d="m7 21 5-5 5 5" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'skip-back':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon points="19 20 9 12 19 4 19 20" variants={ICON_VARIANTS.slideLeft} />
          <line x1="5" x2="5" y1="19" y2="5" />
        </motion.svg>
      );

    case 'skip-forward':
      return (
        <motion.svg {...svgProps}>
          <motion.polygon points="5 4 15 12 5 20 5 4" variants={ICON_VARIANTS.slideRight} />
          <line x1="19" x2="19" y1="5" y2="19" />
        </motion.svg>
      );

    case 'smartphone':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.phoneVibrate} style={{ originX: '12px', originY: '12px' }}>
            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </motion.g>
        </motion.svg>
      );

    case 'tv':
      return (
        <motion.svg {...svgProps}>
          <rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
          <motion.polyline points="17 2 12 7 7 2" variants={ICON_VARIANTS.splitUp} />
        </motion.svg>
      );

    case 'video':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" variants={ICON_VARIANTS.layersTop} />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </motion.svg>
      );

    case 'code':
      return (
        <motion.svg {...svgProps}>
          <motion.polyline points="16 18 22 12 16 6" variants={ICON_VARIANTS.codeTagRight} />
          <motion.polyline points="8 6 2 12 8 18" variants={ICON_VARIANTS.codeTagLeft} />
        </motion.svg>
      );

    case 'terminal':
      return (
        <motion.svg {...svgProps}>
          <motion.polyline points="4 17 10 11 4 5" variants={ICON_VARIANTS.codeTagRight} />
          <motion.line x1="12" x2="20" y1="19" y2="19" variants={ICON_VARIANTS.docLine1} />
        </motion.svg>
      );

    case 'anchor':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.anchorSway} style={{ originX: '12px', originY: '5px' }}>
            <circle cx="12" cy="5" r="3" />
            <line x1="12" x2="12" y1="22" y2="8" />
            <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
          </motion.g>
        </motion.svg>
      );

    case 'gem':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.gemFacetSparkle} style={{ originX: '12px', originY: '12px' }}>
            <path d="M6 3h12l4 6-10 13L2 9Z" />
            <motion.path d="M11 3 8 9l4 13 4-13-3-6" variants={ICON_VARIANTS.pathDraw} />
            <path d="M2 9h20" />
          </motion.g>
        </motion.svg>
      );

    case 'crown':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.crownTilt} style={{ originX: '12px', originY: '18px' }}>
            <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
            <path d="M5 21h14" />
          </motion.g>
        </motion.svg>
      );

    case 'settings-2':
      return (
        <motion.svg {...svgProps}>
          <path d="M20 7h-9" />
          <path d="M14 17H5" />
          <motion.circle cx="17" cy="17" r="3" variants={ICON_VARIANTS.sliderLeft} />
          <motion.circle cx="7" cy="7" r="3" variants={ICON_VARIANTS.sliderRight} />
        </motion.svg>
      );

    case 'pie-chart':
      return (
        <motion.svg {...svgProps}>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <motion.path d="M22 12A10 10 0 0 0 12 2v10z" variants={ICON_VARIANTS.pieSlicePop} />
        </motion.svg>
      );

    case 'chart-no-axes-combined':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M12 16v5" variants={ICON_VARIANTS.bar2Grow} style={{ originY: '21px' }} />
          <motion.path d="M16 14v7" variants={ICON_VARIANTS.bar3Grow} style={{ originY: '21px' }} />
          <motion.path d="M20 10v11" variants={ICON_VARIANTS.bar3Grow} style={{ originY: '21px' }} />
          <motion.path d="m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" variants={ICON_VARIANTS.pathDraw} />
          <motion.path d="M4 18v3" variants={ICON_VARIANTS.bar1Grow} style={{ originY: '21px' }} />
          <motion.path d="M8 14v7" variants={ICON_VARIANTS.bar2Grow} style={{ originY: '21px' }} />
        </motion.svg>
      );

    case 'trending-down':
      return (
        <motion.svg {...svgProps}>
          <motion.polyline points="22 17 13.5 8.5 8.5 13.5 2 7" variants={ICON_VARIANTS.pathDraw} />
          <motion.polyline points="16 17 22 17 22 11" variants={ICON_VARIANTS.slideRight} />
        </motion.svg>
      );

    case 'signal':
      return (
        <motion.svg {...svgProps}>
          <path d="M2 20h.01" />
          <motion.path d="M7 20v-4" variants={ICON_VARIANTS.signalBar1} style={{ originY: '20px' }} />
          <motion.path d="M12 20v-8" variants={ICON_VARIANTS.signalBar2} style={{ originY: '20px' }} />
          <motion.path d="M17 20V8" variants={ICON_VARIANTS.signalBar2} style={{ originY: '20px' }} />
          <motion.path d="M22 4v16" variants={ICON_VARIANTS.signalBar3} style={{ originY: '20px' }} />
        </motion.svg>
      );

    case 'wifi':
      return (
        <motion.svg {...svgProps}>
          <path d="M12 20h.01" />
          <motion.path d="M8.5 16.429a5 5 0 0 1 7 0" variants={ICON_VARIANTS.signalBar1} style={{ originX: '12px', originY: '18px' }} />
          <motion.path d="M5 12.859a10 10 0 0 1 14 0" variants={ICON_VARIANTS.signalBar2} style={{ originX: '12px', originY: '18px' }} />
          <motion.path d="M2 8.82a15 15 0 0 1 20 0" variants={ICON_VARIANTS.signalBar3} style={{ originX: '12px', originY: '18px' }} />
        </motion.svg>
      );

    case 'bluetooth':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="m7 7 10 10-5 5V2l5 5L7 17" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'cloud':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'unlock':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <motion.path d="M7 11V7a5 5 0 0 1 9.9-1" variants={ICON_VARIANTS.lockShackleLift} />
        </motion.svg>
      );

    case 'save':
      return (
        <motion.svg {...svgProps}>
          <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <motion.path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M7 3v4a1 1 0 0 0 1 1h7" variants={ICON_VARIANTS.downloadArrow} />
        </motion.svg>
      );

    case 'file':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" variants={ICON_VARIANTS.layersTop} />
          <motion.path d="M14 2v4a2 2 0 0 0 2 2h4" variants={ICON_VARIANTS.pathDraw} />
        </motion.svg>
      );

    case 'layout':
      return (
        <motion.svg {...svgProps}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <motion.path d="M3 9h18" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M9 21V9" variants={ICON_VARIANTS.docLine2} />
        </motion.svg>
      );

    case 'menu':
      return (
        <motion.svg {...svgProps}>
          <motion.line x1="4" x2="20" y1="6" y2="6" variants={ICON_VARIANTS.docLine1} />
          <motion.line x1="4" x2="20" y1="12" y2="12" variants={ICON_VARIANTS.docLine2} />
          <motion.line x1="4" x2="20" y1="18" y2="18" variants={ICON_VARIANTS.docLine3} />
        </motion.svg>
      );

    case 'more-horizontal':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="12" cy="12" r="1" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '12px', originY: '12px' }} />
          <motion.circle cx="19" cy="12" r="1" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '19px', originY: '12px' }} />
          <motion.circle cx="5" cy="12" r="1" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '5px', originY: '12px' }} />
        </motion.svg>
      );

    case 'images':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M18 22H4a2 2 0 0 1-2-2V6" variants={ICON_VARIANTS.layersMid} />
          <path d="m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" />
          <circle cx="12" cy="8" r="2" />
          <motion.rect width="16" height="16" x="6" y="2" rx="2" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'briefcase-business':
      return (
        <motion.svg {...svgProps}>
          <path d="M12 12h.01" />
          <motion.path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" variants={ICON_VARIANTS.briefcaseHandle} />
          <motion.path d="M22 13a18.15 18.15 0 0 1-20 0" variants={ICON_VARIANTS.pathDraw} />
          <rect width="20" height="14" x="2" y="6" rx="2" />
        </motion.svg>
      );

    case 'contact-round':
      return (
        <motion.svg {...svgProps}>
          <path d="M16 2v2" />
          <path d="M17.915 22a6 6 0 0 0-12 0" />
          <motion.circle cx="12" cy="12" r="4" variants={ICON_VARIANTS.userHeadNod} />
          <path d="M8 2v2" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
        </motion.svg>
      );

    case 'users-round':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M18 21a8 8 0 0 0-16 0" variants={ICON_VARIANTS.pathDraw} />
          <motion.circle cx="10" cy="8" r="5" variants={ICON_VARIANTS.userHeadNod} />
          <motion.path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" variants={ICON_VARIANTS.userSecondarySlide} />
        </motion.svg>
      );

    case 'calendar-days':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M8 2v4" variants={ICON_VARIANTS.calendarRing} />
          <motion.path d="M16 2v4" variants={ICON_VARIANTS.calendarRing} />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <motion.path d="M8 14h.01" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '8px', originY: '14px' }} />
          <motion.path d="M12 14h.01" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '12px', originY: '14px' }} />
          <motion.path d="M16 14h.01" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '16px', originY: '14px' }} />
          <motion.path d="M8 18h.01" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '8px', originY: '18px' }} />
          <motion.path d="M12 18h.01" variants={ICON_VARIANTS.calendarDatePop} style={{ originX: '12px', originY: '18px' }} />
        </motion.svg>
      );

    case 'timer':
      return (
        <motion.svg {...svgProps}>
          <motion.line x1="10" x2="14" y1="2" y2="2" variants={ICON_VARIANTS.calendarRing} />
          <motion.line x1="12" x2="15" y1="14" y2="11" variants={ICON_VARIANTS.clockMinuteSweep} style={{ originX: '12px', originY: '14px' }} />
          <circle cx="12" cy="14" r="8" />
        </motion.svg>
      );

    case 'history':
      return (
        <motion.svg {...svgProps}>
          <motion.g variants={ICON_VARIANTS.spinCCW} style={{ originX: '12px', originY: '12px' }}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </motion.g>
          <motion.path d="M12 7v5l4 2" variants={ICON_VARIANTS.clockMinuteSweep} style={{ originX: '12px', originY: '12px' }} />
        </motion.svg>
      );

    case 'alarm-clock':
      return (
        <motion.svg {...svgProps}>
          <circle cx="12" cy="13" r="8" />
          <motion.path d="M12 9v4l2 2" variants={ICON_VARIANTS.clockMinuteSweep} style={{ originX: '12px', originY: '13px' }} />
          <motion.path d="M5 3 2 6" variants={ICON_VARIANTS.bellBody} style={{ originX: '5px', originY: '6px' }} />
          <motion.path d="m22 6-3-3" variants={ICON_VARIANTS.bellBody} style={{ originX: '19px', originY: '6px' }} />
          <path d="M6.38 18.7 4 21" />
          <path d="M17.64 18.67 20 21" />
        </motion.svg>
      );

    case 'laptop':
      return (
        <motion.svg {...svgProps}>
          <motion.path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" variants={ICON_VARIANTS.layersTop} />
        </motion.svg>
      );

    case 'lightbulb':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
            variants={ICON_VARIANTS.bulbGlow}
            style={{ originX: '12px', originY: '9px' }}
          />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </motion.svg>
      );

    case 'flag':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
            variants={ICON_VARIANTS.flagWave}
            style={{ originX: '4px', originY: '9px' }}
          />
          <line x1="4" x2="4" y1="22" y2="15" />
        </motion.svg>
      );

    case 'map':
      return (
        <motion.svg {...svgProps}>
          <motion.path
            d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
            variants={ICON_VARIANTS.layersTop}
          />
          <motion.path d="M15 5.764v15" variants={ICON_VARIANTS.docLine1} />
          <motion.path d="M9 3.236v15" variants={ICON_VARIANTS.docLine2} />
        </motion.svg>
      );

    case 'route':
      return (
        <motion.svg {...svgProps}>
          <motion.circle cx="6" cy="19" r="3" variants={ICON_VARIANTS.circleSettle} style={{ originX: '6px', originY: '19px' }} />
          <motion.path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" variants={ICON_VARIANTS.pathDraw} />
          <motion.circle cx="18" cy="5" r="3" variants={ICON_VARIANTS.circleSettle} style={{ originX: '18px', originY: '5px' }} />
        </motion.svg>
      );

    default:
      return null;
  }
};

export const MotionIcon = memo(MotionIconInner);
MotionIcon.displayName = 'MotionIcon';

export const AnimatedIcon = MotionIcon;

export function createAnimatedIcon(
  iconName: SupportedMotionIconName
): React.FC<Omit<MotionIconProps, 'name'>> {
  const Component: React.FC<Omit<MotionIconProps, 'name'>> = memo((props) => (
    <MotionIcon {...props} name={iconName} />
  ));
  Component.displayName = `Animated(${iconName})`;
  return Component;
}

export const AnimatedBell = createAnimatedIcon('bell');
export const AnimatedHeart = createAnimatedIcon('heart');
export const AnimatedSearch = createAnimatedIcon('search');
export const AnimatedDownload = createAnimatedIcon('download');
export const AnimatedUpload = createAnimatedIcon('upload');
export const AnimatedCheck = createAnimatedIcon('check');
export const AnimatedCheckCircle = createAnimatedIcon('check-circle');
export const AnimatedArrowLeft = createAnimatedIcon('arrow-left');
export const AnimatedArrowRight = createAnimatedIcon('arrow-right');
export const AnimatedArrowUp = createAnimatedIcon('arrow-up');
export const AnimatedArrowDown = createAnimatedIcon('arrow-down');
export const AnimatedArrowUpRight = createAnimatedIcon('arrow-up-right');
export const AnimatedRefreshCw = createAnimatedIcon('refresh-cw');
export const AnimatedSettings = createAnimatedIcon('settings');
export const AnimatedMail = createAnimatedIcon('mail');
export const AnimatedCalendar = createAnimatedIcon('calendar');
export const AnimatedActivity = createAnimatedIcon('activity');
export const AnimatedRocket = createAnimatedIcon('rocket');
export const AnimatedStar = createAnimatedIcon('star');
export const AnimatedSparkles = createAnimatedIcon('sparkles');

export default MotionIcon;
