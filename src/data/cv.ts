export type SkillCategory = 'languages' | 'frameworks' | 'engineering' | 'cloud' | 'testing' | 'ai';

export interface Skill {
  name: string;
  category: SkillCategory;
}

export const SKILLS: readonly Skill[] = [
  { name: 'Java', category: 'languages' },
  { name: 'TypeScript', category: 'languages' },
  { name: 'JavaScript', category: 'languages' },

  { name: 'Vue.js', category: 'frameworks' },
  { name: 'React', category: 'frameworks' },
  { name: 'Angular', category: 'frameworks' },
  { name: 'Spring Boot', category: 'frameworks' },
  { name: 'REST APIs', category: 'frameworks' },
  { name: 'OAuth 2.0', category: 'frameworks' },
  { name: 'i18n', category: 'frameworks' },
  { name: 'Web Accessibility', category: 'frameworks' },

  { name: 'Agile (Scrum, XP)', category: 'engineering' },
  { name: 'Clean Code', category: 'engineering' },
  { name: 'TDD', category: 'engineering' },
  { name: 'Software Architecture', category: 'engineering' },
  { name: 'End-to-End Testing', category: 'engineering' },

  { name: 'Docker', category: 'cloud' },
  { name: 'Kubernetes', category: 'cloud' },
  { name: 'GitLab CI/CD', category: 'cloud' },
  { name: 'AWS', category: 'cloud' },
  { name: 'Linux', category: 'cloud' },
  { name: 'Terraform', category: 'cloud' },

  { name: 'Playwright', category: 'testing' },
  { name: 'Storybook', category: 'testing' },
  { name: 'Cucumber', category: 'testing' },
  { name: 'Vitest', category: 'testing' },
  { name: 'Unit & Integration', category: 'testing' },

  { name: 'GitHub Copilot', category: 'ai' },
  { name: 'Claude Code', category: 'ai' },
  { name: 'Agentic Coding', category: 'ai' },
] as const;

export const CATEGORY_ORDER: readonly SkillCategory[] = [
  'languages',
  'frameworks',
  'engineering',
  'cloud',
  'testing',
  'ai',
] as const;

export const CATEGORY_COLOR: Record<SkillCategory, [number, number, number]> = {
  languages: [0.18, 0.85, 0.95],
  frameworks: [0.55, 0.42, 0.96],
  engineering: [0.95, 0.62, 0.32],
  cloud: [0.34, 0.78, 0.62],
  testing: [0.92, 0.4, 0.6],
  ai: [0.7, 0.95, 0.4],
};

export type ExperienceKey = 'andrena' | 'bamf';
export const EXPERIENCE_ORDER: readonly ExperienceKey[] = ['andrena', 'bamf'] as const;

export type EducationKey = 'bsc' | 'vue' | 'agile';
export const EDUCATION_ORDER: readonly EducationKey[] = ['bsc', 'vue', 'agile'] as const;

export type LanguageKey = 'de' | 'ar' | 'en' | 'he';
export interface LanguageProficiency {
  key: LanguageKey;
  level: number;
  label: string;
  isNative: boolean;
}
export const LANGUAGE_PROFICIENCIES: readonly LanguageProficiency[] = [
  { key: 'de', level: 1.0, label: 'C2+', isNative: true },
  { key: 'ar', level: 1.0, label: 'C2+', isNative: true },
  { key: 'en', level: 0.95, label: 'C2', isNative: false },
  { key: 'he', level: 0.3, label: 'A2', isNative: false },
] as const;

export const CONTACT = {
  email: 'set.email.in@env.file',
  phone: '+123456789',
  phoneTel: '+123456789',
  linkedin: 'https://www.linkedin.com/in/soufian-madi',
  linkedinHandle: 'linkedin.com/in/soufian-madi',
  address: 'Neuhausen-Nymphenburg, München',
  cvDownload: '/soufian-madi-cv.pdf',
} as const;
