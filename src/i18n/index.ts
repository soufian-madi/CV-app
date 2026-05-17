import { createI18n } from 'vue-i18n';
import de from './de';
import en from './en';

export type AppLocale = 'de' | 'en';
const STORAGE_KEY = 'cv-locale';

function detectInitialLocale(): AppLocale {
  if (typeof window === 'undefined') return 'de';
  try {
    const stored = window.localStorage?.getItem?.(STORAGE_KEY);
    if (stored === 'de' || stored === 'en') return stored;
  } catch {
    // ignore — localStorage can throw in private mode or sandboxed contexts
  }
  const navLang = window.navigator?.language?.toLowerCase?.() ?? '';
  return navLang.startsWith('de') ? 'de' : 'en';
}

const initial = detectInitialLocale();

type MessageSchema = typeof de;

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initial,
  fallbackLocale: 'en',
  messages: { de, en },
});

export function persistLocale(locale: AppLocale) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage?.setItem?.(STORAGE_KEY, locale);
  } catch {
    // ignore
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = initial;
}

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}
