export type SiteTheme = 'liquid-glass' | 'dark-liquid-glass' | 'cowhide-leather' | 'deep-ocean' | 'mica-fluent' | string;
export type { MemoryPhoto } from '@/data/memories';

export interface WeatherPreset {
  temp: string;
  condition: string;
  conditionVi?: string;
  badge?: string;
  bgStyle?: string;
  location?: string;
  time?: string;
  dateLabel?: string;
}

export interface PageMeta {
  id: number;
  name?: string;
  shortTitle?: string;
  shortTitleEn?: string;
  icon?: string;
  path?: string;
}

export interface ProjectStarAction {
  step: string;
  title: string;
  desc: string;
}

export interface ProjectStarData {
  situation: string;
  approach: string;
  actions: ProjectStarAction[];
  results: string[];
}

export interface ProjectDetailedSpec {
  subtitleEn?: string;
  tagline?: string;
  overview: string[];
  context: {
    intro: string;
    challenges: string[];
    challengeTitles?: string[];
    conclusion: string;
  };
  objectives: {
    title: string;
    items: string[];
  }[];
  scopeItems: {
    code: string;
    title: string;
    intro: string;
    tasks: string[];
    note?: string;
    deliverable: string;
  }[];
  methodology: {
    intro: string;
    phases: {
      stage: string;
      title: string;
      desc: string;
    }[];
    outro: string;
  };
  metrics: {
    intro: string;
    table: {
      category: string;
      indicators: string;
    }[];
    outro: string;
  };
  pmRoles: {
    intro: string;
    items: {
      role: string;
      desc: string;
    }[];
  };
  expectedOutcomes: {
    intro: string;
    items: {
      dimension: string;
      desc: string;
    }[];
    outro: string;
  };
  philosophy: {
    paragraphs: string[];
    coreMessage: string;
  };
}

export interface ProjectData {
  id: string;
  code: string;
  number: string;
  title: string;
  subtitleEn?: string;
  tagline?: string;
  groupTitle: string;
  groupKey: string;
  description: string;
  phase: string;
  progressText: string;
  progressPercent: number;
  role: string;
  hashtags: string[];
  image: string;
  mindmap?: string;
  quote?: string;
  star: ProjectStarData;
  detailedSpec?: ProjectDetailedSpec;
}

export interface InterviewQuestion {
  stt: number;
  categoryKey: string;
  categoryVi: string;
  timestamp: string;
  startSec: number;
  endSec: number;
  askerVi: string;
  questionVi: string;
  answererVi: string;
  answerVi: string;
  keyTakeawayVi: string;
}

export interface EnterpriseSystem {
  id: string;
  code: string;
  name: string;
  category: string;
  url: string;
  badge: string;
  description: string;
  features: string[];
  metrics: string;
  status: 'active' | 'maintenance' | 'beta';
  bgVideoUrl?: string;
  bannerUrl?: string;
  iconName?: string;
  themeColor?: string;
  youtubeId?: string;
  abbr?: string;
  nameVi?: string;
  nameEn?: string;
  categoryVi?: string;
  categoryEn?: string;
  descriptionVi?: string;
  descriptionEn?: string;
  featuresVi?: string[];
  featuresEn?: string[];
  metricsVi?: string;
  metricsEn?: string;
  accentColor?: string;
  techStack?: string[];
  videoPoster?: string;
  videoWebm?: string;
  videoMp4?: string;
  [key: string]: any;
}

export type SystemData = EnterpriseSystem;

export interface DomainData {
  id: string;
  serviceCode?: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  professionalMessage?: string;
  coreCompetency?: string;
  experienceAndScale?: string;
  operationalCapabilityLabel?: string;
  operationalCapability?: string;
  keyResultsSummary?: string;
  techAndSystemsSummary?: string;
  valueDelivered?: string;
  typicalRolesLine?: string;
  typicalEntitiesLabel?: string;
  typicalEntitiesLine?: string;
  tag: string;
  desc: string;
  descEn: string;
  color: string;
  icon: string;
  customIllustrationUrl?: string;
  metrics: { label: string; value: string }[];
  details?: string[];
  experienceItems?: string[];
  scaleAndScope?: { label: string; content: string }[];
  operationalChallenges?: string[];
  techSolutions?: { name: string; desc: string }[];
  operationalResults?: { indicator: string; outcome: string }[];
  summaryNote?: string;
  rolesHeld?: string[];
  ecosystemNote?: string;
  companies: string[];
  companyLogos?: { name: string; logo: string; fallbackLogo?: string; url?: string }[];
  tools: string[];
  badgeClass?: string;
  badgeText?: string;
  overview?: string;
  results?: { metric: string; label: string; detail?: string; desc?: string }[];
  focusAreas?: string[];
  toolsAndMethods?: string[];
  keyValue?: string;
  pillars?: { title: string; desc: string; metrics?: string[] }[];
  challengesAndSolutions?: { challenge: string; solution: string; result?: string }[];
}

