import { describe, expect, it, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';
import LanguageToggle from '../components/LanguageToggle.vue';
import de from '../i18n/de';
import en from '../i18n/en';

function makeI18n(initial: 'de' | 'en' = 'de') {
  return createI18n({
    legacy: false,
    locale: initial,
    fallbackLocale: 'en',
    messages: { de, en },
  });
}

describe('LanguageToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders both locale buttons and marks current locale as pressed', () => {
    const i18n = makeI18n('de');
    const wrapper = mount(LanguageToggle, { global: { plugins: [i18n] } });
    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].text()).toBe('DE');
    expect(buttons[1].text()).toBe('EN');
    expect(buttons[0].attributes('aria-pressed')).toBe('true');
    expect(buttons[1].attributes('aria-pressed')).toBe('false');
  });

  it('switches the active locale and persists it to localStorage on click', async () => {
    const i18n = makeI18n('de');
    const wrapper = mount(LanguageToggle, { global: { plugins: [i18n] } });
    await wrapper.findAll('button')[1].trigger('click');
    expect(i18n.global.locale.value).toBe('en');
    expect(window.localStorage.getItem('cv-locale')).toBe('en');
  });
});
