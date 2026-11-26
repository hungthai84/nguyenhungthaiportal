import { CardStyleMode } from './theme.types';

export type SoundThemeId = 'soft-glass' | 'crystal' | 'liquid' | 'digital' | 'futuristic' | 'minimal';
export type SoundEventId =
  | 'buttonClick'
  | 'buttonHover'
  | 'toggleOn'
  | 'toggleOff'
  | 'tabChange'
  | 'cardSelect'
  | 'popupOpen'
  | 'popupClose'
  | 'notification'
  | 'success'
  | 'error';

export type WallpaperModeId =
  | 'solid'
  | 'multi-gradient'
  | 'aurora'
  | 'liquid'
  | 'iridescent'
  | 'abstract-3d'
  | 'custom-image'
  | 'upload';

export type CardMaterialPresetId =
  | 'clear-glass'
  | 'frosted-glass'
  | 'milk-glass'
  | 'liquid-glass'
  | 'crystal-glass'
  | 'iridescent-glass'
  | 'glossy-glass'
  | 'chrome-glass'
  | 'gradient-glass'
  | 'dark-glass';

export type CardTargetKey =
  | 'mainCard'
  | 'contentCard'
  | 'dashboardCard'
  | 'navigationCard'
  | 'modalCard'
  | 'popupCard'
  | 'sidebarCard'
  | 'footerCard';

export type MotionPresetLevel = 'off' | 'gentle' | 'standard' | 'vivid';
export type CursorStyleId =
  | 'default'
  | 'glass'
  | 'crystal'
  | 'iridescent'
  | 'glow'
  | 'magnetic'
  | 'spotlight'
  | 'soft-circle';

export interface CardTargetOverride {
  opacity: number;
  blur: number;
  radius: number;
}

export interface ThemeStudioConfig {
  version: number;
  mode: 'light' | 'dark';
  // Group 01: Website Colors
  colors: {
    websiteBg: string;
    headerBg: string;
    mainContainerBg: string;
    sidebarBg: string;
    footerBg: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    iconColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
    useGradient: boolean;
    gradientCss: string;
  };
  // Group 02: Primary Color System
  primary: {
    presetId: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    highlightColor: string;
    gradientStart: string;
    gradientEnd: string;
    glowColor: string;
    chromeReflectionColor: string;
  };
  // Group 03: Wallpaper
  wallpaper: {
    mode: WallpaperModeId;
    backgroundColor: string;
    backgroundImage: string;
    backgroundPosition: string;
    backgroundSize: 'cover' | 'contain' | 'auto';
    backgroundAttachment: 'fixed' | 'scroll';
    backgroundOpacity: number;
    backgroundBlur: number;
    overlayColor: string;
    overlayOpacity: number;
    brightness: number;
    contrast: number;
    backgroundAnimation: boolean;
  };
  // Group 04: Card Background
  cardBg: {
    preset: CardMaterialPresetId;
    backgroundColor: string;
    backgroundOpacity: number;
    backdropBlur: number;
    saturation: number;
    borderColor: string;
    borderOpacity: number;
    borderWidth: number;
    borderRadius: number;
    innerHighlight: number;
    glassReflection: number;
    cardTransparency: number;
    activeTarget: CardTargetKey;
    targets: Record<CardTargetKey, CardTargetOverride>;
  };
  // Group 05: Card Effects (12 independent toggles + 8 sliders)
  cardEffects: {
    glossyReflection: boolean;
    iridescentBorder: boolean;
    chromeEdge: boolean;
    glassRefraction: boolean;
    holographicShine: boolean;
    innerGlow: boolean;
    outerGlow: boolean;
    softShadow: boolean;
    floatingCard: boolean;
    layeredGlass: boolean;
    prismaticHighlight: boolean;
    specularHighlight: boolean;
    glowIntensity: number;
    reflectionIntensity: number;
    shadowDepth: number;
    borderShine: number;
    refractionStrength: number;
    hoverElevation: number;
    cardDepth: number;
    glassGlossiness: number;
  };
  // Group 06: Motion Effects
  motion: {
    level: MotionPresetLevel;
    floatingAnimation: boolean;
    smoothFade: boolean;
    slideTransition: boolean;
    scaleTransition: boolean;
    parallaxMovement: boolean;
    lightSweep: boolean;
    glassShimmer: boolean;
    borderFlow: boolean;
    gradientFlow: boolean;
    ambientGlow: boolean;
    cardEntrance: boolean;
    pageTransition: boolean;
    animationSpeed: number;
    animationDuration: number;
    easing: string;
    motionIntensity: number;
    delay: number;
    hoverAnimationSpeed: number;
  };
  // Group 07: Interaction Effects
  interaction: {
    buttonHoverGlow: boolean;
    buttonPressDepth: boolean;
    buttonRippleEffect: boolean;
    buttonLightReflection: boolean;
    buttonMagneticHover: boolean;
    buttonGradientShift: boolean;
    cardHoverLift: boolean;
    cardTilt3D: boolean;
    cardBorderHighlight: boolean;
    cardPerspective: boolean;
    cardSpotlightFollow: boolean;
    inputFocusGlow: boolean;
    inputAnimatedBorder: boolean;
    inputGlassFocus: boolean;
    inputSearchSuggestions: boolean;
    navActiveIndicator: boolean;
    navSmoothUnderline: boolean;
    navSlidingHighlight: boolean;
    navIconAnimation: boolean;
    toggleLiquidSwitch: boolean;
    toggleGlowSwitch: boolean;
    toggleSmoothSliding: boolean;
    tabsSlidingIndicator: boolean;
    tabsCapsuleHighlight: boolean;
    tabsGlassActiveState: boolean;
    toastGlassReveal: boolean;
    toastSmoothEntrance: boolean;
    toastBlurBackground: boolean;
  };
  // Group 08: Sound Effects (Default OFF)
  sound: {
    enabled: boolean;
    volume: number;
    theme: SoundThemeId;
    hoverSound: boolean;
    clickSound: boolean;
    notificationSound: boolean;
    events: Record<SoundEventId, boolean>;
  };
  // Group 09: Custom Cursor (Desktop Pointer only)
  cursor: {
    enabled: boolean;
    style: CursorStyleId;
    size: number;
    opacity: number;
    color: string;
    glowIntensity: number;
    trailLength: number;
    animationSpeed: number;
    hoverScale: number;
    blur: number;
    glassReflection: boolean;
    rainbowTrail: boolean;
    softGlow: boolean;
    magneticHover: boolean;
    clickRipple: boolean;
    interactiveSpotlight: boolean;
  };
}

export interface PrimaryPalettePreset {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  highlightColor: string;
  gradientStart: string;
  gradientEnd: string;
  glowColor: string;
  chromeReflectionColor: string;
}

export const PRIMARY_PALETTE_PRESETS: PrimaryPalettePreset[] = [
  {
    id: 'iridescent-rainbow',
    name: 'Iridescent Rainbow',
    primaryColor: '#06B6D4',
    secondaryColor: '#A78BFA',
    accentColor: '#FB923C',
    highlightColor: '#67E8F9',
    gradientStart: '#38BDF8',
    gradientEnd: '#C084FC',
    glowColor: '#22D3EE',
    chromeReflectionColor: '#FDE68A',
  },
  {
    id: 'ocean-navy',
    name: 'Ocean Navy',
    primaryColor: '#1D4ED8',
    secondaryColor: '#0284C7',
    accentColor: '#38BDF8',
    highlightColor: '#93C5FD',
    gradientStart: '#1E3A8A',
    gradientEnd: '#0EA5E9',
    glowColor: '#3B82F6',
    chromeReflectionColor: '#BAE6FD',
  },
  {
    id: 'electric-blue',
    name: 'Electric Blue',
    primaryColor: '#2563EB',
    secondaryColor: '#4F46E5',
    accentColor: '#06B6D4',
    highlightColor: '#60A5FA',
    gradientStart: '#2563EB',
    gradientEnd: '#06B6D4',
    glowColor: '#3B82F6',
    chromeReflectionColor: '#E0F2FE',
  },
  {
    id: 'aurora-cyan',
    name: 'Aurora Cyan',
    primaryColor: '#0891B2',
    secondaryColor: '#2DD4BF',
    accentColor: '#818CF8',
    highlightColor: '#67E8F9',
    gradientStart: '#06B6D4',
    gradientEnd: '#34D399',
    glowColor: '#22D3EE',
    chromeReflectionColor: '#CCFBF1',
  },
  {
    id: 'lavender-crystal',
    name: 'Lavender Crystal',
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    accentColor: '#38BDF8',
    highlightColor: '#DDD6FE',
    gradientStart: '#A78BFA',
    gradientEnd: '#F472B6',
    glowColor: '#C084FC',
    chromeReflectionColor: '#F5D0FE',
  },
  {
    id: 'emerald-glass',
    name: 'Emerald Glass',
    primaryColor: '#10B981',
    secondaryColor: '#14B8A6',
    accentColor: '#38BDF8',
    highlightColor: '#6EE7B7',
    gradientStart: '#10B981',
    gradientEnd: '#06B6D4',
    glowColor: '#34D399',
    chromeReflectionColor: '#D1FAE5',
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    primaryColor: '#F97316',
    secondaryColor: '#FB7185',
    accentColor: '#06B6D4',
    highlightColor: '#FDBA74',
    gradientStart: '#FB923C',
    gradientEnd: '#F43F5E',
    glowColor: '#FB923C',
    chromeReflectionColor: '#FFEDD5',
  },
  {
    id: 'silver-chrome',
    name: 'Silver Chrome',
    primaryColor: '#64748B',
    secondaryColor: '#94A3B8',
    accentColor: '#38BDF8',
    highlightColor: '#E2E8F0',
    gradientStart: '#94A3B8',
    gradientEnd: '#CBD5E1',
    glowColor: '#94A3B8',
    chromeReflectionColor: '#F8FAFC',
  },
  {
    id: 'midnight-prism',
    name: 'Midnight Prism',
    primaryColor: '#6366F1',
    secondaryColor: '#06B6D4',
    accentColor: '#F472B6',
    highlightColor: '#A5B4FC',
    gradientStart: '#312E81',
    gradientEnd: '#0EA5E9',
    glowColor: '#818CF8',
    chromeReflectionColor: '#C7D2FE',
  },
];

export const CARD_MATERIAL_PRESETS: Array<{
  id: CardMaterialPresetId;
  label: string;
  backgroundColor: string;
  backgroundOpacity: number;
  backdropBlur: number;
  saturation: number;
  borderOpacity: number;
  innerHighlight: number;
  glassReflection: number;
}> = [
  { id: 'iridescent-glass', label: 'Iridescent Glass', backgroundColor: '#FFFFFF', backgroundOpacity: 62, backdropBlur: 24, saturation: 185, borderOpacity: 68, innerHighlight: 78, glassReflection: 72 },
  { id: 'clear-glass', label: 'Clear Glass', backgroundColor: '#FFFFFF', backgroundOpacity: 28, backdropBlur: 14, saturation: 160, borderOpacity: 55, innerHighlight: 65, glassReflection: 60 },
  { id: 'frosted-glass', label: 'Frosted Glass', backgroundColor: '#F8FAFC', backgroundOpacity: 74, backdropBlur: 30, saturation: 145, borderOpacity: 58, innerHighlight: 62, glassReflection: 48 },
  { id: 'milk-glass', label: 'Milk Glass', backgroundColor: '#FFFDFB', backgroundOpacity: 86, backdropBlur: 22, saturation: 130, borderOpacity: 70, innerHighlight: 82, glassReflection: 44 },
  { id: 'liquid-glass', label: 'Liquid Glass', backgroundColor: '#F0F9FF', backgroundOpacity: 52, backdropBlur: 26, saturation: 195, borderOpacity: 64, innerHighlight: 85, glassReflection: 76 },
  { id: 'crystal-glass', label: 'Crystal Glass', backgroundColor: '#ECFEFF', backgroundOpacity: 44, backdropBlur: 18, saturation: 200, borderOpacity: 74, innerHighlight: 90, glassReflection: 84 },
  { id: 'glossy-glass', label: 'Glossy Glass', backgroundColor: '#FFFFFF', backgroundOpacity: 68, backdropBlur: 20, saturation: 175, borderOpacity: 72, innerHighlight: 92, glassReflection: 90 },
  { id: 'chrome-glass', label: 'Chrome Glass', backgroundColor: '#E2E8F0', backgroundOpacity: 58, backdropBlur: 22, saturation: 165, borderOpacity: 82, innerHighlight: 88, glassReflection: 86 },
  { id: 'gradient-glass', label: 'Gradient Glass', backgroundColor: '#F5F3FF', backgroundOpacity: 64, backdropBlur: 24, saturation: 190, borderOpacity: 62, innerHighlight: 74, glassReflection: 68 },
  { id: 'dark-glass', label: 'Dark Glass', backgroundColor: '#0F172A', backgroundOpacity: 72, backdropBlur: 24, saturation: 175, borderOpacity: 32, innerHighlight: 34, glassReflection: 62 },
];

export const WALLPAPER_MODE_GRADIENTS: Record<WallpaperModeId, { light: string; dark: string }> = {
  solid: {
    light: '#F4F7FC',
    dark: '#090D1A',
  },
  'multi-gradient': {
    light: 'linear-gradient(135deg, #F8FAFF 0%, #E0F2FE 34%, #F3E8FF 68%, #FFEDD5 100%)',
    dark: 'linear-gradient(135deg, #090D1A 0%, #111C38 38%, #1E1436 72%, #1D1520 100%)',
  },
  aurora: {
    light: 'radial-gradient(ellipse 64% 52% at 15% 15%, rgba(56, 189, 248, 0.34), transparent 58%), radial-gradient(ellipse 62% 52% at 85% 20%, rgba(167, 139, 250, 0.32), transparent 56%), radial-gradient(ellipse 60% 50% at 62% 84%, rgba(52, 211, 153, 0.28), transparent 58%), linear-gradient(145deg, #F8FAFF 0%, #EDF6FF 55%, #F5F3FF 100%)',
    dark: 'radial-gradient(ellipse 64% 52% at 15% 15%, rgba(6, 182, 212, 0.28), transparent 58%), radial-gradient(ellipse 62% 52% at 85% 20%, rgba(168, 85, 247, 0.26), transparent 56%), radial-gradient(ellipse 60% 50% at 62% 84%, rgba(16, 185, 129, 0.22), transparent 58%), linear-gradient(145deg, #070B16 0%, #0D152A 55%, #120E24 100%)',
  },
  liquid: {
    light: 'radial-gradient(circle at 20% 24%, rgba(103, 232, 249, 0.42), transparent 48%), radial-gradient(circle at 80% 28%, rgba(251, 146, 60, 0.26), transparent 46%), radial-gradient(circle at 50% 80%, rgba(192, 132, 252, 0.30), transparent 52%), linear-gradient(135deg, #FAFCFF 0%, #EFF6FF 50%, #F5F3FF 100%)',
    dark: 'radial-gradient(circle at 20% 24%, rgba(34, 211, 238, 0.26), transparent 48%), radial-gradient(circle at 80% 28%, rgba(251, 146, 60, 0.18), transparent 46%), radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.26), transparent 52%), linear-gradient(135deg, #080C18 0%, #0E172E 52%, #130F28 100%)',
  },
  iridescent: {
    light: 'radial-gradient(ellipse 72% 58% at 12% 14%, rgba(125, 211, 252, 0.45) 0%, transparent 56%), radial-gradient(ellipse 64% 54% at 88% 16%, rgba(196, 181, 253, 0.42) 0%, transparent 54%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(253, 186, 116, 0.34) 0%, transparent 54%), radial-gradient(ellipse 60% 54% at 18% 84%, rgba(110, 231, 183, 0.34) 0%, transparent 56%), linear-gradient(135deg, #FBFBFF 0%, #F0F8FF 46%, #F6F0FF 76%, #FFF7F0 100%)',
    dark: 'radial-gradient(ellipse 72% 58% at 12% 14%, rgba(34, 211, 238, 0.28) 0%, transparent 56%), radial-gradient(ellipse 64% 54% at 88% 16%, rgba(167, 139, 250, 0.28) 0%, transparent 54%), radial-gradient(ellipse 58% 52% at 82% 84%, rgba(251, 146, 60, 0.20) 0%, transparent 54%), radial-gradient(ellipse 60% 54% at 18% 84%, rgba(45, 212, 191, 0.22) 0%, transparent 56%), linear-gradient(135deg, #070B16 0%, #0D1429 48%, #15102B 78%, #121222 100%)',
  },
  'abstract-3d': {
    light: 'conic-gradient(from 140deg at 52% 48%, rgba(56, 189, 248, 0.26), rgba(167, 139, 250, 0.28), rgba(251, 146, 60, 0.22), rgba(52, 211, 153, 0.24), rgba(56, 189, 248, 0.26)), linear-gradient(145deg, #F8FAFC 0%, #EEF2FF 100%)',
    dark: 'conic-gradient(from 140deg at 52% 48%, rgba(34, 211, 238, 0.20), rgba(139, 92, 246, 0.22), rgba(251, 146, 60, 0.16), rgba(16, 185, 129, 0.18), rgba(34, 211, 238, 0.20)), linear-gradient(145deg, #080C19 0%, #10182F 100%)',
  },
  'custom-image': {
    light: '#F4F7FC',
    dark: '#090D1A',
  },
  upload: {
    light: '#F4F7FC',
    dark: '#090D1A',
  },
};

export const THEME_STUDIO_STORAGE_KEY = 'hungthai_theme_studio_configs_v1';
export const THEME_STUDIO_SYNC_EVENT = 'hungthai:theme-studio-changed';

export function createDefaultStudioConfig(mode: 'light' | 'dark' = 'light'): ThemeStudioConfig {
  const isDark = mode === 'dark';
  const defaultTargets: Record<CardTargetKey, CardTargetOverride> = {
    mainCard: { opacity: isDark ? 68 : 66, blur: 24, radius: 18 },
    contentCard: { opacity: isDark ? 62 : 62, blur: 22, radius: 16 },
    dashboardCard: { opacity: isDark ? 64 : 64, blur: 22, radius: 16 },
    navigationCard: { opacity: isDark ? 72 : 70, blur: 24, radius: 999 },
    modalCard: { opacity: isDark ? 82 : 82, blur: 28, radius: 20 },
    popupCard: { opacity: isDark ? 84 : 84, blur: 26, radius: 16 },
    sidebarCard: { opacity: isDark ? 70 : 70, blur: 22, radius: 16 },
    footerCard: { opacity: isDark ? 74 : 74, blur: 24, radius: 18 },
  };

  return {
    version: 1,
    mode,
    colors: {
      websiteBg: isDark ? '#090D1A' : '#F4F8FF',
      headerBg: isDark ? '#11182D' : '#FFFFFF',
      mainContainerBg: isDark ? '#0F172A' : '#FFFFFF',
      sidebarBg: isDark ? '#131C33' : '#F8FAFF',
      footerBg: isDark ? '#11182D' : '#FFFFFF',
      textPrimary: isDark ? '#F8FAFC' : '#0F172A',
      textSecondary: isDark ? '#CBD5E1' : '#475569',
      borderColor: isDark ? '#67E8F9' : '#CBD5E1',
      iconColor: isDark ? '#67E8F9' : '#0891B2',
      successColor: '#10B981',
      warningColor: '#F59E0B',
      errorColor: '#EF4444',
      useGradient: true,
      gradientCss: WALLPAPER_MODE_GRADIENTS.iridescent[mode],
    },
    primary: {
      presetId: 'iridescent-rainbow',
      primaryColor: isDark ? '#22D3EE' : '#06B6D4',
      secondaryColor: isDark ? '#C084FC' : '#8B5CF6',
      accentColor: '#FB923C',
      highlightColor: isDark ? '#67E8F9' : '#38BDF8',
      gradientStart: isDark ? '#22D3EE' : '#06B6D4',
      gradientEnd: isDark ? '#C084FC' : '#8B5CF6',
      glowColor: '#22D3EE',
      chromeReflectionColor: isDark ? '#E0F2FE' : '#FDE68A',
    },
    wallpaper: {
      mode: 'iridescent',
      backgroundColor: isDark ? '#090D1A' : '#F4F8FF',
      backgroundImage: '',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundOpacity: 100,
      backgroundBlur: 0,
      overlayColor: isDark ? '#070B16' : '#FFFFFF',
      overlayOpacity: isDark ? 12 : 6,
      brightness: 100,
      contrast: 100,
      backgroundAnimation: true,
    },
    cardBg: {
      preset: isDark ? 'dark-glass' : 'iridescent-glass',
      backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
      backgroundOpacity: isDark ? 66 : 64,
      backdropBlur: 24,
      saturation: 185,
      borderColor: isDark ? '#93C5FD' : '#FFFFFF',
      borderOpacity: isDark ? 34 : 74,
      borderWidth: 1,
      borderRadius: 16,
      innerHighlight: isDark ? 36 : 82,
      glassReflection: 74,
      cardTransparency: isDark ? 34 : 36,
      activeTarget: 'mainCard',
      targets: defaultTargets,
    },
    cardEffects: {
      glossyReflection: true,
      iridescentBorder: true,
      chromeEdge: true,
      glassRefraction: true,
      holographicShine: false,
      innerGlow: true,
      outerGlow: true,
      softShadow: true,
      floatingCard: false,
      layeredGlass: true,
      prismaticHighlight: true,
      specularHighlight: true,
      glowIntensity: 56,
      reflectionIntensity: 68,
      shadowDepth: 52,
      borderShine: 76,
      refractionStrength: 58,
      hoverElevation: 6,
      cardDepth: 48,
      glassGlossiness: 72,
    },
    motion: {
      level: 'standard',
      floatingAnimation: false,
      smoothFade: true,
      slideTransition: true,
      scaleTransition: true,
      parallaxMovement: false,
      lightSweep: true,
      glassShimmer: false,
      borderFlow: true,
      gradientFlow: false,
      ambientGlow: true,
      cardEntrance: true,
      pageTransition: true,
      animationSpeed: 100,
      animationDuration: 280,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      motionIntensity: 55,
      delay: 0,
      hoverAnimationSpeed: 200,
    },
    interaction: {
      buttonHoverGlow: true,
      buttonPressDepth: true,
      buttonRippleEffect: true,
      buttonLightReflection: true,
      buttonMagneticHover: false,
      buttonGradientShift: true,
      cardHoverLift: true,
      cardTilt3D: false,
      cardBorderHighlight: true,
      cardPerspective: true,
      cardSpotlightFollow: true,
      inputFocusGlow: true,
      inputAnimatedBorder: true,
      inputGlassFocus: true,
      inputSearchSuggestions: true,
      navActiveIndicator: true,
      navSmoothUnderline: true,
      navSlidingHighlight: true,
      navIconAnimation: true,
      toggleLiquidSwitch: true,
      toggleGlowSwitch: true,
      toggleSmoothSliding: true,
      tabsSlidingIndicator: true,
      tabsCapsuleHighlight: true,
      tabsGlassActiveState: true,
      toastGlassReveal: true,
      toastSmoothEntrance: true,
      toastBlurBackground: true,
    },
    sound: {
      enabled: false, // MANDATORY: default OFF
      volume: 45,
      theme: 'soft-glass',
      hoverSound: false,
      clickSound: true,
      notificationSound: true,
      events: {
        buttonClick: true,
        buttonHover: false,
        toggleOn: true,
        toggleOff: true,
        tabChange: true,
        cardSelect: true,
        popupOpen: true,
        popupClose: true,
        notification: true,
        success: true,
        error: true,
      },
    },
    cursor: {
      enabled: false,
      style: 'iridescent',
      size: 28,
      opacity: 85,
      color: '#22D3EE',
      glowIntensity: 62,
      trailLength: 5,
      animationSpeed: 75,
      hoverScale: 145,
      blur: 8,
      glassReflection: true,
      rainbowTrail: true,
      softGlow: true,
      magneticHover: false,
      clickRipple: true,
      interactiveSpotlight: false,
    },
  };
}

export function isIridescentTheme(style: CardStyleMode): boolean {
  return style === 'iridescent-liquid-glass' || style === 'dark-iridescent-liquid-glass';
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha)).toFixed(2)})`;
}

export function parseColorToHex(input: string, fallback: string): string {
  const trimmed = input.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toUpperCase();
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
  if (rgbMatch) {
    const [r, g, b] = [Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3])].map((v) =>
      Math.max(0, Math.min(255, v))
    );
    return (
      '#' +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }
  const hslMatch = trimmed.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?/i);
  if (hslMatch) {
    const h = (Number(hslMatch[1]) % 360) / 360;
    const s = Math.max(0, Math.min(100, Number(hslMatch[2]))) / 100;
    const l = Math.max(0, Math.min(100, Number(hslMatch[3]))) / 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    return (
      '#' +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()
    );
  }
  return fallback;
}

export function generateHarmonizedPalette(seedHex: string, mode: 'light' | 'dark'): Partial<ThemeStudioConfig['colors']> {
  const isDark = mode === 'dark';
  const clean = seedHex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) || 6;
  const g = parseInt(clean.slice(2, 4), 16) || 182;
  const b = parseInt(clean.slice(4, 6), 16) || 212;
  const mix = (a: number, target: number, ratio: number) => Math.round(a * (1 - ratio) + target * ratio);
  const toHex = (rr: number, gg: number, bb: number) =>
    '#' + [rr, gg, bb].map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')).join('').toUpperCase();

  return {
    websiteBg: isDark ? toHex(mix(r, 9, 0.9), mix(g, 13, 0.9), mix(b, 26, 0.9)) : toHex(mix(r, 248, 0.92), mix(g, 250, 0.92), mix(b, 255, 0.92)),
    headerBg: isDark ? toHex(mix(r, 17, 0.88), mix(g, 24, 0.88), mix(b, 45, 0.88)) : '#FFFFFF',
    mainContainerBg: isDark ? toHex(mix(r, 15, 0.88), mix(g, 23, 0.88), mix(b, 42, 0.88)) : '#FFFFFF',
    sidebarBg: isDark ? toHex(mix(r, 19, 0.86), mix(g, 28, 0.86), mix(b, 51, 0.86)) : toHex(mix(r, 245, 0.9), mix(g, 249, 0.9), mix(b, 255, 0.9)),
    footerBg: isDark ? toHex(mix(r, 17, 0.88), mix(g, 24, 0.88), mix(b, 45, 0.88)) : '#FFFFFF',
    borderColor: isDark ? toHex(mix(r, 255, 0.45), mix(g, 255, 0.45), mix(b, 255, 0.45)) : toHex(mix(r, 226, 0.72), mix(g, 232, 0.72), mix(b, 240, 0.72)),
    iconColor: seedHex.toUpperCase(),
  };
}

export function loadAllStudioConfigs(): Record<string, ThemeStudioConfig> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(THEME_STUDIO_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as Record<string, ThemeStudioConfig>;
  } catch {
    return {};
  }
}

export function loadStudioConfigForTheme(themeId: CardStyleMode): ThemeStudioConfig {
  const mode: 'light' | 'dark' = themeId.includes('dark') || themeId === 'deep-ocean' || themeId === 'walnut-wood' ? 'dark' : 'light';
  const defaults = createDefaultStudioConfig(mode);
  const all = loadAllStudioConfigs();
  const saved = all[themeId];
  if (!saved) return defaults;
  return {
    ...defaults,
    ...saved,
    colors: { ...defaults.colors, ...(saved.colors || {}) },
    primary: { ...defaults.primary, ...(saved.primary || {}) },
    wallpaper: { ...defaults.wallpaper, ...(saved.wallpaper || {}) },
    cardBg: {
      ...defaults.cardBg,
      ...(saved.cardBg || {}),
      targets: { ...defaults.cardBg.targets, ...(saved.cardBg?.targets || {}) },
    },
    cardEffects: { ...defaults.cardEffects, ...(saved.cardEffects || {}) },
    motion: { ...defaults.motion, ...(saved.motion || {}) },
    interaction: { ...defaults.interaction, ...(saved.interaction || {}) },
    sound: {
      ...defaults.sound,
      ...(saved.sound || {}),
      events: { ...defaults.sound.events, ...(saved.sound?.events || {}) },
    },
    cursor: { ...defaults.cursor, ...(saved.cursor || {}) },
  };
}

export function saveStudioConfigForTheme(themeId: CardStyleMode, config: ThemeStudioConfig): void {
  if (typeof window === 'undefined') return;
  try {
    const all = loadAllStudioConfigs();
    all[themeId] = config;
    localStorage.setItem(THEME_STUDIO_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new CustomEvent(THEME_STUDIO_SYNC_EVENT, { detail: { themeId, config } }));
  } catch {
    // ignore quota errors
  }
}

export function resetStudioConfigForTheme(themeId: CardStyleMode): ThemeStudioConfig {
  const mode: 'light' | 'dark' = themeId.includes('dark') ? 'dark' : 'light';
  const fresh = createDefaultStudioConfig(mode);
  if (typeof window !== 'undefined') {
    try {
      const all = loadAllStudioConfigs();
      delete all[themeId];
      localStorage.setItem(THEME_STUDIO_STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent(THEME_STUDIO_SYNC_EVENT, { detail: { themeId, config: fresh } }));
    } catch {
      // ignore
    }
  }
  return fresh;
}

export function resolveWallpaperCss(config: ThemeStudioConfig): string {
  const { wallpaper, mode } = config;
  if ((wallpaper.mode === 'custom-image' || wallpaper.mode === 'upload') && wallpaper.backgroundImage) {
    return `url("${wallpaper.backgroundImage}") ${wallpaper.backgroundPosition} / ${wallpaper.backgroundSize} no-repeat`;
  }
  if (wallpaper.mode === 'solid') {
    return wallpaper.backgroundColor;
  }
  return WALLPAPER_MODE_GRADIENTS[wallpaper.mode]?.[mode] || WALLPAPER_MODE_GRADIENTS.iridescent[mode];
}

const STUDIO_CSS_VARS = [
  '--website-background',
  '--website-primary',
  '--website-secondary',
  '--website-accent',
  '--website-text',
  '--website-muted',
  '--website-border',
  '--website-header-bg',
  '--website-main-bg',
  '--website-sidebar-bg',
  '--website-footer-bg',
  '--website-icon-color',
  '--website-success',
  '--website-warning',
  '--website-error',
  '--website-gradient-start',
  '--website-gradient-end',
  '--website-highlight',
  '--website-chrome-reflection',
  '--card-background',
  '--card-opacity',
  '--card-blur',
  '--card-saturation',
  '--card-radius',
  '--card-border-width',
  '--card-border-color',
  '--card-shadow',
  '--glass-highlight',
  '--glass-reflection',
  '--glass-iridescent',
  '--glass-glow',
  '--glass-refraction',
  '--glass-glossiness',
  '--card-hover-elevation',
  '--motion-duration',
  '--motion-intensity',
  '--motion-easing',
  '--motion-delay',
  '--motion-hover-duration',
  '--interaction-glow',
  '--sound-enabled',
  '--sound-volume',
  '--cursor-enabled',
  '--cursor-size',
  '--cursor-glow',
  '--irid-wallpaper-bg',
  '--irid-wallpaper-blur',
  '--irid-wallpaper-opacity',
  '--irid-wallpaper-brightness',
  '--irid-wallpaper-contrast',
  '--irid-wallpaper-overlay',
  '--irid-main-card-bg',
  '--irid-content-card-bg',
  '--irid-footer-bg',
  '--irid-modal-bg',
];

export function clearThemeStudioVariablesFromDocument(): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const prop of STUDIO_CSS_VARS) {
    root.style.removeProperty(prop);
  }
  const attrs = Array.from(root.attributes)
    .map((a) => a.name)
    .filter((name) => name.startsWith('data-irid-'));
  attrs.forEach((a) => root.removeAttribute(a));
}

export function applyThemeStudioConfigToDocument(config: ThemeStudioConfig | null, activeThemeId: CardStyleMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!config || !isIridescentTheme(activeThemeId)) {
    clearThemeStudioVariablesFromDocument();
    return;
  }

  const cardAlpha = Math.max(0.18, Math.min(0.96, (config.cardBg.backgroundOpacity * (100 - config.cardBg.cardTransparency * 0.35)) / 10000));
  const mainAlpha = Math.max(0.22, Math.min(0.96, config.cardBg.targets.mainCard.opacity / 100));
  const contentAlpha = Math.max(0.20, Math.min(0.96, config.cardBg.targets.contentCard.opacity / 100));
  const footerAlpha = Math.max(0.28, Math.min(0.96, config.cardBg.targets.footerCard.opacity / 100));
  const modalAlpha = Math.max(0.45, Math.min(0.98, config.cardBg.targets.modalCard.opacity / 100));
  const borderAlpha = Math.max(0.08, Math.min(1, config.cardBg.borderOpacity / 100));
  const glowAlpha = Math.max(0.08, Math.min(0.85, config.cardEffects.glowIntensity / 100));
  const shadowSpread = Math.round(14 + config.cardEffects.shadowDepth * 0.42);
  const shadowY = Math.round(6 + config.cardEffects.shadowDepth * 0.22);
  const shadowAlpha = (config.mode === 'dark' ? 0.34 : 0.11) + (config.cardEffects.shadowDepth / 100) * 0.22;

  const speedFactor = Math.max(0.35, Math.min(2.5, config.motion.animationSpeed / 100));
  const effectiveDuration = config.motion.level === 'off' ? 0 : Math.round(config.motion.animationDuration / speedFactor);
  const effectiveHoverDuration = config.motion.level === 'off' ? 0 : Math.round(config.motion.hoverAnimationSpeed / speedFactor);
  const intensityScale =
    config.motion.level === 'off'
      ? 0
      : config.motion.level === 'gentle'
        ? 0.45
        : config.motion.level === 'vivid'
          ? 1.35
          : 1;

  const wallpaperCss = resolveWallpaperCss(config);

  root.style.setProperty('--website-background', config.colors.useGradient ? config.colors.gradientCss : config.colors.websiteBg);
  root.style.setProperty('--website-primary', config.primary.primaryColor);
  root.style.setProperty('--website-secondary', config.primary.secondaryColor);
  root.style.setProperty('--website-accent', config.primary.accentColor);
  root.style.setProperty('--website-text', config.colors.textPrimary);
  root.style.setProperty('--website-muted', config.colors.textSecondary);
  root.style.setProperty('--website-border', hexToRgba(config.cardBg.borderColor, borderAlpha));
  root.style.setProperty('--website-header-bg', hexToRgba(config.colors.headerBg, Math.max(0.35, config.cardBg.targets.navigationCard.opacity / 100)));
  root.style.setProperty('--website-main-bg', hexToRgba(config.colors.mainContainerBg, mainAlpha));
  root.style.setProperty('--website-sidebar-bg', hexToRgba(config.colors.sidebarBg, config.cardBg.targets.sidebarCard.opacity / 100));
  root.style.setProperty('--website-footer-bg', hexToRgba(config.colors.footerBg, footerAlpha));
  root.style.setProperty('--website-icon-color', config.colors.iconColor);
  root.style.setProperty('--website-success', config.colors.successColor);
  root.style.setProperty('--website-warning', config.colors.warningColor);
  root.style.setProperty('--website-error', config.colors.errorColor);
  root.style.setProperty('--website-gradient-start', config.primary.gradientStart);
  root.style.setProperty('--website-gradient-end', config.primary.gradientEnd);
  root.style.setProperty('--website-highlight', config.primary.highlightColor);
  root.style.setProperty('--website-chrome-reflection', config.primary.chromeReflectionColor);

  root.style.setProperty('--card-background', hexToRgba(config.cardBg.backgroundColor, cardAlpha));
  root.style.setProperty('--card-opacity', cardAlpha.toFixed(2));
  root.style.setProperty('--card-blur', `${config.cardBg.backdropBlur}px`);
  root.style.setProperty('--card-saturation', `${config.cardBg.saturation}%`);
  root.style.setProperty('--card-radius', `${config.cardBg.borderRadius}px`);
  root.style.setProperty('--card-border-width', `${config.cardBg.borderWidth}px`);
  root.style.setProperty('--card-border-color', hexToRgba(config.cardBg.borderColor, borderAlpha));
  root.style.setProperty(
    '--card-shadow',
    config.cardEffects.softShadow
      ? `0 ${shadowY}px ${shadowSpread}px -6px rgba(15, 23, 42, ${shadowAlpha.toFixed(2)})`
      : 'none'
  );

  root.style.setProperty('--glass-highlight', `rgba(255, 255, 255, ${(config.cardBg.innerHighlight / 100).toFixed(2)})`);
  root.style.setProperty('--glass-reflection', `${(config.cardBg.glassReflection * config.cardEffects.reflectionIntensity) / 10000}`);
  root.style.setProperty('--glass-iridescent', `${(config.cardEffects.borderShine / 100).toFixed(2)}`);
  root.style.setProperty('--glass-glow', hexToRgba(config.primary.glowColor, glowAlpha));
  root.style.setProperty('--glass-refraction', `${config.cardEffects.refractionStrength}%`);
  root.style.setProperty('--glass-glossiness', `${(config.cardEffects.glassGlossiness / 100).toFixed(2)}`);
  root.style.setProperty('--card-hover-elevation', `${config.cardEffects.hoverElevation}px`);

  root.style.setProperty('--motion-duration', `${effectiveDuration}ms`);
  root.style.setProperty('--motion-intensity', `${((config.motion.motionIntensity / 100) * intensityScale).toFixed(2)}`);
  root.style.setProperty('--motion-easing', config.motion.easing);
  root.style.setProperty('--motion-delay', `${config.motion.delay}ms`);
  root.style.setProperty('--motion-hover-duration', `${effectiveHoverDuration}ms`);
  root.style.setProperty('--interaction-glow', hexToRgba(config.primary.glowColor, Math.min(0.65, glowAlpha + 0.12)));

  root.style.setProperty('--sound-enabled', config.sound.enabled ? '1' : '0');
  root.style.setProperty('--sound-volume', (config.sound.volume / 100).toFixed(2));
  root.style.setProperty('--cursor-enabled', config.cursor.enabled ? '1' : '0');
  root.style.setProperty('--cursor-size', `${config.cursor.size}px`);
  root.style.setProperty('--cursor-glow', `${config.cursor.glowIntensity}%`);

  root.style.setProperty('--irid-wallpaper-bg', wallpaperCss);
  root.style.setProperty('--irid-wallpaper-blur', `${config.wallpaper.backgroundBlur}px`);
  root.style.setProperty('--irid-wallpaper-opacity', `${(config.wallpaper.backgroundOpacity / 100).toFixed(2)}`);
  root.style.setProperty('--irid-wallpaper-brightness', `${config.wallpaper.brightness}%`);
  root.style.setProperty('--irid-wallpaper-contrast', `${config.wallpaper.contrast}%`);
  root.style.setProperty('--irid-wallpaper-overlay', hexToRgba(config.wallpaper.overlayColor, config.wallpaper.overlayOpacity / 100));

  root.style.setProperty('--irid-main-card-bg', hexToRgba(config.colors.mainContainerBg, mainAlpha));
  root.style.setProperty('--irid-content-card-bg', hexToRgba(config.cardBg.backgroundColor, contentAlpha));
  root.style.setProperty('--irid-footer-bg', hexToRgba(config.colors.footerBg, footerAlpha));
  root.style.setProperty('--irid-modal-bg', hexToRgba(config.cardBg.backgroundColor, modalAlpha));

  // Feature flags for CSS selectors
  root.setAttribute('data-irid-preset', config.cardBg.preset);
  root.setAttribute('data-irid-border', config.cardEffects.iridescentBorder ? 'on' : 'off');
  root.setAttribute('data-irid-chrome', config.cardEffects.chromeEdge ? 'on' : 'off');
  root.setAttribute('data-irid-glossy', config.cardEffects.glossyReflection ? 'on' : 'off');
  root.setAttribute('data-irid-holo', config.cardEffects.holographicShine ? 'on' : 'off');
  root.setAttribute('data-irid-glow', config.cardEffects.outerGlow ? 'on' : 'off');
  root.setAttribute('data-irid-inner-glow', config.cardEffects.innerGlow ? 'on' : 'off');
  root.setAttribute('data-irid-float', config.cardEffects.floatingCard ? 'on' : 'off');
  root.setAttribute('data-irid-specular', config.cardEffects.specularHighlight ? 'on' : 'off');
  root.setAttribute('data-irid-motion', config.motion.level);
  root.setAttribute('data-irid-shimmer', config.motion.glassShimmer && config.motion.level !== 'off' ? 'on' : 'off');
  root.setAttribute('data-irid-border-flow', config.motion.borderFlow && config.motion.level !== 'off' ? 'on' : 'off');
  root.setAttribute('data-irid-bg-anim', config.wallpaper.backgroundAnimation && config.motion.level !== 'off' ? 'on' : 'off');
  root.setAttribute('data-irid-btn-glow', config.interaction.buttonHoverGlow ? 'on' : 'off');
  root.setAttribute('data-irid-btn-press', config.interaction.buttonPressDepth ? 'on' : 'off');
  root.setAttribute('data-irid-card-lift', config.interaction.cardHoverLift ? 'on' : 'off');
  root.setAttribute('data-irid-card-tilt', config.interaction.cardTilt3D ? 'on' : 'off');
  root.setAttribute('data-irid-input-glow', config.interaction.inputFocusGlow ? 'on' : 'off');
}
