import React, { memo } from 'react';
import * as LucideIcons from 'lucide-react';
import { MotionIcon, resolveMotionIconKey } from './MotionIcons';

export interface WebIconProps {
  id?: string;
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  sparkle?: boolean;
  animated?: boolean;
  isActive?: boolean;
  isHovered?: boolean;
  duration?: number;
  hoverTrigger?: boolean;
  disableAncestorTrigger?: boolean;
}

// Icon alias dictionary mapping custom or legacy FontAwesome/HugeIcons names directly to Lucide React icons
const ICON_ALIAS_MAP: Record<string, keyof typeof LucideIcons> = {
  // Navigation & General
  home: 'Home',
  house: 'Home',
  'fa-house-chimney': 'Home',
  grid: 'LayoutGrid',
  'layout-grid': 'LayoutGrid',
  layout: 'Layout',
  sparkles: 'Sparkles',
  'chevron-left': 'ChevronLeft',
  'chevron-right': 'ChevronRight',
  'chevron-down': 'ChevronDown',
  'chevron-up': 'ChevronUp',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  'arrow-up': 'ArrowUp',
  'arrow-down': 'ArrowDown',
  'arrow-up-right': 'ArrowUpRight',
  'arrow-left-right': 'ArrowLeftRight',
  pause: 'Pause',
  play: 'Play',
  location: 'MapPin',
  'map-pin': 'MapPin',
  mappin: 'MapPin',
  map: 'Map',
  route: 'Route',
  mail: 'Mail',
  envelope: 'Mail',
  'fa-envelope-open-text': 'Mail',
  'fa-envelope': 'Mail',
  phone: 'Phone',
  'phone-call': 'PhoneCall',
  call: 'Phone',
  'fa-phone': 'Phone',
  globe: 'Globe',
  volume: 'Volume2',
  volume2: 'Volume2',
  'volume-2': 'Volume2',
  'volume-high': 'Volume2',
  mute: 'VolumeX',
  volumex: 'VolumeX',
  'volume-x': 'VolumeX',
  'volume-off': 'VolumeX',
  cancel: 'X',
  x: 'X',
  close: 'X',
  target: 'Target',
  user: 'User',
  person: 'User',
  contact: 'Contact',
  contact2: 'Contact2',
  'contact-round': 'ContactRound',
  'user-round': 'UserRound',
  'users-round': 'UsersRound',
  'user-check': 'UserCheck',
  'user-cog': 'UserCog',
  'id-card': 'IdCard',
  'fa-address-card': 'UserRound',
  'user-group': 'Users',
  users: 'Users',
  'fa-address-book': 'UserCheck',
  palette: 'Palette',
  'fa-palette': 'Palette',
  chart: 'BarChart3',
  barchart3: 'BarChart3',
  'bar-chart': 'BarChart3',
  'bar-chart-3': 'BarChart3',
  'line-chart': 'LineChart',
  'pie-chart': 'PieChart',
  'fa-chart-pie': 'PieChart',
  'chart-no-axes-combined': 'ChartNoAxesCombined',
  heart: 'Heart',
  leaf: 'Leaf',
  star: 'Star',
  award: 'Award',
  crown: 'Crown',
  'fa-crown': 'Crown',
  anchor: 'Anchor',
  gem: 'Gem',
  clock: 'Clock',
  timer: 'Timer',
  history: 'History',
  'alarm-clock': 'AlarmClock',
  'heart-handshake': 'HeartHandshake',
  'customer-support': 'HeartHandshake',
  'fa-hand-holding-heart': 'HeartHandshake',
  navigation: 'Navigation',
  bot: 'Bot',
  robot: 'Bot',
  'fa-robot': 'Bot',
  calendar: 'Calendar',
  'calendar-days': 'CalendarDays',
  'calendar-check': 'CalendarCheck',
  'fa-calendar-check': 'CalendarCheck',
  briefcase: 'Briefcase',
  'briefcase-business': 'BriefcaseBusiness',
  'building-2': 'Building2',
  building2: 'Building2',
  'fa-business-time': 'Briefcase',
  link: 'Link',
  linkedin: 'Linkedin',
  'fa-linkedin-in': 'Linkedin',
  'external-link': 'ExternalLink',
  'shield-check': 'ShieldCheck',
  car: 'Car',
  'shopping-bag': 'ShoppingBag',
  'shopping-cart': 'ShoppingCart',
  gift: 'Gift',
  graduation: 'GraduationCap',
  'graduation-cap': 'GraduationCap',
  'fa-graduation-cap': 'GraduationCap',
  headphones: 'Headphones',
  headset: 'Headphones',
  'fa-headset': 'Headphones',
  'user-plus': 'UserPlus',
  presentation: 'Presentation',
  slides: 'Presentation',
  'fa-chalkboard-user': 'Presentation',
  trending: 'TrendingUp',
  'trending-up': 'TrendingUp',
  'trending-down': 'TrendingDown',
  'trend-down': 'TrendingDown',
  activity: 'Activity',
  signal: 'Signal',
  edit: 'Edit3',
  'edit-3': 'Edit3',
  pencil: 'Edit3',
  settings: 'Settings',
  'settings-2': 'Settings2',
  cog: 'Settings',
  'check-circle-02': 'CheckCircle2',
  'check-circle': 'CheckCircle2',
  check: 'Check',
  sliders: 'SlidersHorizontal',
  maximize: 'Maximize2',
  'maximize-2': 'Maximize2',
  minimize: 'Minimize2',
  'minimize-2': 'Minimize2',
  backward: 'SkipBack',
  forward: 'SkipForward',
  layers: 'Layers',
  game: 'Gamepad2',
  'gamepad-2': 'Gamepad2',
  wallet: 'Wallet',
  trophy: 'Trophy',
  network: 'Network',
  'fa-network-wired': 'Network',
  image: 'Image',
  images: 'Images',
  'fa-image': 'Image',
  quote: 'Quote',
  search: 'Search',
  'zoom-in': 'ZoomIn',
  sun: 'Sun',
  moon: 'Moon',
  move: 'Move',
  copy: 'Copy',
  save: 'Save',
  file: 'File',
  'file-text': 'FileText',
  'fa-file-text': 'FileText',
  'fa-file-lines': 'FileText',
  database: 'Database',
  cpu: 'Cpu',
  'fa-microchip': 'Cpu',
  code: 'Code',
  terminal: 'Terminal',
  'credit-card': 'CreditCard',
  shield: 'Shield',
  compass: 'Compass',
  'fa-compass': 'Compass',
  folder: 'Folder',
  'folder-kanban': 'FolderKanban',
  kanban: 'FolderKanban',
  'fa-diagram-project': 'FolderKanban',
  server: 'Server',
  'fa-server': 'Server',
  mic: 'Mic',
  'fa-microphone-lines': 'Mic',
  camera: 'Camera',
  'fa-camera-retro': 'Camera',
  'fa-brain': 'BrainCircuit',
  brain: 'BrainCircuit',
  languages: 'Languages',
  'fa-language': 'Languages',
  'fa-comment-dots': 'MessageSquare',
  'messages-square': 'MessagesSquare',
  'message-square': 'MessageSquare',
  chat: 'MessageSquare',
  book: 'Book',
  'book-open': 'BookOpen',
  bookmark: 'Bookmark',
  clipboard: 'Clipboard',
  list: 'List',
  'list-checks': 'ListChecks',
  'list-filter': 'ListFilter',
  filter: 'Filter',
  'shield-alert': 'ShieldAlert',
  'fa-shield-exclamation': 'ShieldAlert',
  'rotate-ccw': 'RotateCcw',
  'rotate-cw': 'RotateCw',
  refresh: 'RefreshCw',
  'refresh-cw': 'RefreshCw',
  'fa-arrows-rotate': 'RefreshCw',
  'alert-circle': 'AlertCircle',
  'alert-triangle': 'AlertTriangle',
  alert: 'AlertTriangle',
  'corner-down-left': 'CornerDownLeft',
  'circle-help': 'CircleHelp',
  help: 'CircleHelp',
  workflow: 'Workflow',
  'git-branch': 'GitBranch',
  'git-merge': 'GitMerge',
  boxes: 'Boxes',
  gauge: 'Gauge',
  'key-round': 'KeyRound',
  pin: 'Pin',
  'pin-off': 'PinOff',
  share: 'Share2',
  'share-2': 'Share2',
  building: 'Building2',
  download: 'Download',
  upload: 'Upload',
  eye: 'Eye',
  'eye-off': 'EyeOff',
  tower: 'RadioTower',
  snowflake: 'Snowflake',
  'chevrons-up-down': 'ChevronsUpDown',
  square: 'Square',
  stop: 'Square',
  bell: 'Bell',
  'bell-ring': 'BellRing',
  rocket: 'Rocket',
  zap: 'Zap',
  bolt: 'Zap',
  flame: 'Flame',
  lock: 'Lock',
  unlock: 'Unlock',
  plus: 'Plus',
  minus: 'Minus',
  send: 'Send',
  smile: 'Smile',
  table: 'Table',
  tag: 'Tag',
  wrench: 'Wrench',
  smartphone: 'Smartphone',
  monitor: 'Monitor',
  laptop: 'Laptop',
  tv: 'Tv',
  video: 'Video',
  'qr-code': 'QrCode',
  'trash-2': 'Trash2',
  archive: 'Archive',
  droplet: 'Droplet',
  sprout: 'Sprout',
  landmark: 'Landmark',
  scale: 'Scale',
  'fa-scale-balanced': 'Scale',
  coins: 'Coins',
  'dollar-sign': 'DollarSign',
  hash: 'Hash',
  'log-in': 'LogIn',
  'log-out': 'LogOut',
  menu: 'Menu',
  'more-horizontal': 'MoreHorizontal',
  cloud: 'Cloud',
  wifi: 'Wifi',
  bluetooth: 'Bluetooth',
  lightbulb: 'Lightbulb',
  flag: 'Flag',
};

const WebIconInner: React.FC<WebIconProps> = ({
  id,
  name,
  size,
  color,
  className = 'w-4 h-4',
  style,
  strokeWidth = 2.85,
  animated = true,
  isActive = false,
  isHovered,
  duration,
  hoverTrigger = true,
  disableAncestorTrigger = false,
}) => {
  const normName = (name || '').toLowerCase().trim();

  if (animated && resolveMotionIconKey(normName)) {
    return (
      <MotionIcon
        id={id}
        name={normName}
        size={size}
        color={color}
        className={className}
        style={style}
        strokeWidth={strokeWidth}
        isActive={isActive}
        isHovered={isHovered}
        duration={duration}
        hoverTrigger={hoverTrigger}
        disableAncestorTrigger={disableAncestorTrigger}
      />
    );
  }

  let IconComponent: any = null;

  // 1. Check alias dictionary
  if (ICON_ALIAS_MAP[normName]) {
    const componentName = ICON_ALIAS_MAP[normName];
    IconComponent = LucideIcons[componentName];
  }

  // 2. Try dynamic lookup if not found in alias dictionary
  if (!IconComponent) {
    const cleanName = normName.replace(/^fa-(solid|regular|brands)\s+/, '').replace(/^fa-/, '');

    if (ICON_ALIAS_MAP[cleanName]) {
      IconComponent = LucideIcons[ICON_ALIAS_MAP[cleanName]];
    } else {
      const pascalName = cleanName
        .split(/[-_\s]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');

      IconComponent =
        (LucideIcons as any)[name] ||
        (LucideIcons as any)[pascalName] ||
        (LucideIcons as any)[cleanName] ||
        LucideIcons.Sparkles;
    }
  }

  if (!IconComponent) {
    IconComponent = LucideIcons.Sparkles;
  }

  const mergedClassName = className ? `web-icon ${className}` : 'web-icon w-4 h-4';
  const mergedStyle = color ? { color, ...style } : style;
  return (
    <IconComponent
      id={id}
      size={size}
      className={mergedClassName}
      style={mergedStyle}
      strokeWidth={strokeWidth}
    />
  );
};

export const WebIcon = memo(WebIconInner);
WebIcon.displayName = 'WebIcon';

export default WebIcon;
