import React from 'react';
import * as LucideIcons from 'lucide-react';

export interface WebIconProps {
  id?: string;
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  strokeWidth?: number;
  sparkle?: boolean;
}

// Icon alias dictionary mapping custom or legacy FontAwesome/HugeIcons names directly to Lucide React icons
const ICON_ALIAS_MAP: Record<string, keyof typeof LucideIcons> = {
  // Navigation & General
  home: 'Home',
  house: 'Home',
  'fa-house-chimney': 'Home',
  grid: 'LayoutGrid',
  sparkles: 'Sparkles',
  'chevron-left': 'ChevronLeft',
  'chevron-right': 'ChevronRight',
  'chevron-down': 'ChevronDown',
  'chevron-up': 'ChevronUp',
  'arrow-left': 'ArrowLeft',
  'arrow-right': 'ArrowRight',
  pause: 'Pause',
  play: 'Play',
  location: 'MapPin',
  'map-pin': 'MapPin',
  mappin: 'MapPin',
  mail: 'Mail',
  envelope: 'Mail',
  'fa-envelope-open-text': 'Mail',
  'fa-envelope': 'Mail',
  phone: 'Phone',
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
  'user-round': 'UserRound',
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
  heart: 'Heart',
  leaf: 'Leaf',
  star: 'Star',
  award: 'Award',
  clock: 'Clock',
  'heart-handshake': 'HeartHandshake',
  'customer-support': 'HeartHandshake',
  'fa-hand-holding-heart': 'HeartHandshake',
  navigation: 'Navigation',
  bot: 'Bot',
  robot: 'Bot',
  'fa-robot': 'Bot',
  calendar: 'Calendar',
  'fa-calendar-check': 'CalendarCheck',
  briefcase: 'Briefcase',
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
  'user-plus': 'UserPlus',
  presentation: 'Presentation',
  slides: 'Presentation',
  trending: 'TrendingUp',
  'trending-up': 'TrendingUp',
  activity: 'Activity',
  edit: 'Edit3',
  settings: 'Settings',
  'check-circle-02': 'CheckCircle2',
  'check-circle': 'CheckCircle2',
  check: 'Check',
  sliders: 'SlidersHorizontal',
  maximize: 'Maximize2',
  'maximize-2': 'Maximize2',
  backward: 'SkipBack',
  forward: 'SkipForward',
  layers: 'Layers',
  game: 'Gamepad2',
  wallet: 'Wallet',
  trophy: 'Trophy',
  network: 'Network',
  image: 'Image',
  'fa-image': 'Image',
  quote: 'Quote',
  search: 'Search',
  sun: 'Sun',
  moon: 'Moon',
  move: 'Move',
  copy: 'Copy',
  'file-text': 'FileText',
  'fa-file-text': 'FileText',
  database: 'Database',
  cpu: 'Cpu',
  'credit-card': 'CreditCard',
  shield: 'Shield',
  compass: 'Compass',
  'fa-compass': 'Compass',
  folder: 'Folder',
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
  'book-open': 'BookOpen',
  'list-filter': 'ListFilter',
  'shield-alert': 'ShieldAlert',
  'rotate-ccw': 'RotateCcw',
  'alert-circle': 'AlertCircle',
  'corner-down-left': 'CornerDownLeft',
  'circle-help': 'CircleHelp',
  help: 'CircleHelp',
  workflow: 'Workflow',
  pin: 'Pin',
  'pin-off': 'PinOff',
  share: 'Share2',
  building: 'Building2',
  download: 'Download',
  eye: 'Eye',
  'eye-off': 'EyeOff',
  tower: 'RadioTower',
  snowflake: 'Snowflake',
  'chevrons-up-down': 'ChevronsUpDown',
  square: 'Square',
};

export const WebIcon: React.FC<WebIconProps> = ({
  id,
  name,
  size,
  className = 'w-4 h-4',
  style,
  strokeWidth = 2.85,
}) => {
  const normName = (name || '').toLowerCase().trim();

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
  return <IconComponent id={id} size={size} className={mergedClassName} style={style} strokeWidth={strokeWidth} />;
};

export default WebIcon;
