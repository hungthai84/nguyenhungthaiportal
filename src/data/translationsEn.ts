import { DOMAINS_DATA } from './domains';
import { ABOUT_PROFILE_STATS, PERSONAL_DEMOGRAPHICS, SERVICE_PHILOSOPHY_VALUES } from './aboutData';
import { CAREER_MILESTONES_DATA, CORE_VALUES_DATA } from './letterData';
import { POWER_SYSTEMS_12, SYSTEM_CATEGORIES } from './systemsData';
import { SYSTEMS_DATA } from './systems';
import {
  LANGUAGES_DATA,
  OPPORTUNITIES_DATA,
  SKILL_GROUPS,
  STRENGTHS_DATA,
  THREATS_DATA,
  WEAKNESSES_DATA,
} from './skills';
import { TABS_DATA } from './tabs';
import { CHROME_AND_MODALS_EN } from './i18n/chromeAndModalsEn';
import { PROFILE_CAREER_EN } from './i18n/profileCareerEn';
import { PROJECTS_SYSTEMS_EN } from './i18n/projectsSystemsEn';
import { ENGAGEMENT_EXTRAS_EN } from './i18n/engagementExtrasEn';

const VIETNAMESE_DIACRITIC_REGEX =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

export const STATIC_VI_TO_EN: Record<string, string> = {
  ...CHROME_AND_MODALS_EN,
  ...PROFILE_CAREER_EN,
  ...PROJECTS_SYSTEMS_EN,
  ...ENGAGEMENT_EXTRAS_EN,
};

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

export function buildInstantViToEnMap(): Map<string, string> {
  const map = new Map<string, string>();

  const registerPair = (vi?: string, en?: string, allowSame = false) => {
    if (!vi || !en) return;
    const cleanVi = vi.trim();
    const cleanEn = en.trim();
    if (!cleanVi || !cleanEn) return;
    if (VIETNAMESE_DIACRITIC_REGEX.test(cleanEn)) return;
    if (!allowSame && cleanVi === cleanEn) return;

    map.set(cleanVi, cleanEn);

    const collapsed = normalizeWhitespace(cleanVi);
    if (collapsed && collapsed !== cleanVi && !map.has(collapsed)) {
      map.set(collapsed, normalizeWhitespace(cleanEn));
    }

    // Also index stripped smart-quote variants so JSX entities and Unicode quotes both resolve
    const normalizedQuotes = cleanVi.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
    if (normalizedQuotes !== cleanVi && !map.has(normalizedQuotes)) {
      map.set(normalizedQuotes, cleanEn.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"));
    }
  };

  Object.entries(STATIC_VI_TO_EN).forEach(([vi, en]) => registerPair(vi, en, true));

  // Tabs & page quotes
  TABS_DATA.forEach((tab) => {
    registerPair(tab.name, tab.nameEn);
    registerPair(tab.shortTitle, tab.shortTitleEn);
    registerPair(tab.quote, tab.quoteEn);
    if (tab.quote) {
      const bareQuote = tab.quote.replace(/^["“]|["”]$/g, '').trim();
      const bareEn = tab.quoteEn?.replace(/^["“]|["”]$/g, '').trim();
      if (bareQuote && bareEn) registerPair(bareQuote, bareEn);
    }
  });

  // Domains / Services
  DOMAINS_DATA.forEach((d) => {
    registerPair(d.title, d.titleEn);
    registerPair(d.subtitle, d.subtitleEn);
    registerPair(d.desc, d.descEn);
  });

  // About & Philosophy
  ABOUT_PROFILE_STATS.forEach((stat) => {
    registerPair(stat.labelVi, stat.labelEn);
    registerPair(stat.unitVi, stat.unitEn);
  });

  PERSONAL_DEMOGRAPHICS.forEach((demo) => {
    registerPair(demo.labelVi, demo.labelEn);
    registerPair(demo.valueVi, demo.valueEn);
  });

  SERVICE_PHILOSOPHY_VALUES.forEach((v) => {
    registerPair(v.titleVi, v.titleEn);
    registerPair(v.subtitleVi, v.subtitleEn);
    registerPair(v.descVi, v.descEn);
  });

  // Letter & Career Milestones
  CAREER_MILESTONES_DATA.forEach((m) => {
    registerPair(m.descVi, m.descEn);
    registerPair(m.highlightVi, m.highlightEn);
    registerPair(m.yearLabelVi, m.yearLabelEn);
    registerPair(m.roleVi, m.roleEn);
    registerPair(m.roleTitle, m.roleEn);
  });

  CORE_VALUES_DATA.forEach((c) => {
    registerPair(c.titleVi, c.titleEn);
    registerPair(c.descVi, c.descEn);
  });

  // Systems (12 modules + categories + features)
  SYSTEM_CATEGORIES.forEach((cat) => {
    registerPair(cat.vi, cat.en);
  });

  POWER_SYSTEMS_12.forEach((s) => {
    registerPair(s.nameVi, s.nameEn);
    registerPair(s.descVi, s.descEn);
    registerPair(s.badgeVi, s.badgeEn);
    if (Array.isArray(s.featuresVi) && Array.isArray(s.featuresEn)) {
      s.featuresVi.forEach((fv, idx) => registerPair(fv, s.featuresEn[idx]));
    }
  });

  SYSTEMS_DATA.forEach((s) => {
    registerPair(s.nameVi || s.name, s.nameEn);
    registerPair(s.descVi || s.description, s.descEn);
    if (Array.isArray(s.featuresVi) && Array.isArray(s.featuresEn)) {
      s.featuresVi.forEach((fv, idx) => registerPair(fv, s.featuresEn?.[idx]));
    }
  });

  // Skills & Languages
  LANGUAGES_DATA.forEach((lang) => {
    registerPair(lang.nameVi, lang.nameEn);
    registerPair(lang.roleVi, lang.roleEn);
    registerPair(lang.levelVi, lang.levelEn);
  });

  [STRENGTHS_DATA, WEAKNESSES_DATA, OPPORTUNITIES_DATA, THREATS_DATA].forEach((group) => {
    group.forEach((item) => {
      registerPair(item.labelVi, item.labelEn);
      if (item.descVi && item.descEn) registerPair(item.descVi, item.descEn);
    });
  });

  SKILL_GROUPS.forEach((group) => {
    registerPair(group.titleVi, group.titleEn);
  });

  return map;
}
