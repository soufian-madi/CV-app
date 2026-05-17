import { describe, expect, it } from 'vitest';
import de from '../i18n/de';
import en from '../i18n/en';

function keyPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  const paths: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      paths.push(`${path}[]`);
    } else if (v && typeof v === 'object') {
      paths.push(...keyPaths(v as Record<string, unknown>, path));
    } else {
      paths.push(path);
    }
  }
  return paths.sort();
}

describe('i18n catalogues', () => {
  it('DE and EN have an identical key shape', () => {
    expect(keyPaths(en)).toEqual(keyPaths(de));
  });

  it('every leaf is a non-empty string or array of strings', () => {
    function check(value: unknown, label: string) {
      if (Array.isArray(value)) {
        expect(value.length).toBeGreaterThan(0);
        for (const v of value) expect(v).toEqual(expect.any(String));
        return;
      }
      if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) check(v, `${label}.${k}`);
        return;
      }
      expect(value, label).toEqual(expect.any(String));
      expect((value as string).length, label).toBeGreaterThan(0);
    }
    check(de, 'de');
    check(en, 'en');
  });

  it('exposes the andrena and bamf experience entries with bullet arrays', () => {
    expect(de.experience.entries.andrena.bullets.length).toBeGreaterThanOrEqual(5);
    expect(en.experience.entries.andrena.bullets.length).toBeGreaterThanOrEqual(5);
    expect(de.experience.entries.bamf.bullets.length).toBeGreaterThanOrEqual(2);
  });
});
