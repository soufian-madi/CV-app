import { describe, expect, it } from 'vitest';
import {
  CATEGORY_COLOR,
  CATEGORY_ORDER,
  CONTACT,
  EDUCATION_ORDER,
  EXPERIENCE_ORDER,
  LANGUAGE_PROFICIENCIES,
  SKILLS,
} from '../data/cv';

describe('CV data', () => {
  it('exposes the six skill categories in display order', () => {
    expect(CATEGORY_ORDER).toEqual([
      'languages',
      'frameworks',
      'engineering',
      'cloud',
      'testing',
      'ai',
    ]);
  });

  it('every skill belongs to a known category', () => {
    for (const skill of SKILLS) {
      expect(CATEGORY_ORDER).toContain(skill.category);
    }
  });

  it('every category has at least one skill and a color', () => {
    for (const cat of CATEGORY_ORDER) {
      expect(SKILLS.some((s) => s.category === cat)).toBe(true);
      expect(CATEGORY_COLOR[cat]).toHaveLength(3);
    }
  });

  it('lists exactly two experience entries and four education items', () => {
    expect(EXPERIENCE_ORDER).toEqual(['andrena', 'bamf']);
    expect(EDUCATION_ORDER).toEqual(['bsc', 'vue', 'scrum', 'agile']);
  });

  it('declares four language proficiencies including German and Arabic as native', () => {
    expect(LANGUAGE_PROFICIENCIES).toHaveLength(4);
    const native = LANGUAGE_PROFICIENCIES.filter((l) => l.isNative).map((l) => l.key);
    expect(native).toEqual(['de', 'ar']);
  });

  it('exposes contact details', () => {
    expect(CONTACT.email).toMatch(/@/);
    expect(CONTACT.phoneTel).toMatch(/^\+\d+$/);
    expect(CONTACT.linkedin).toMatch(/^https:\/\//);
  });
});
