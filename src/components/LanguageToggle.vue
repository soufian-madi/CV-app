<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { persistLocale, type AppLocale } from '@/i18n';

const { locale, t } = useI18n();

const locales: { code: AppLocale; label: string }[] = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
];

function setLocale(next: AppLocale) {
  if (locale.value === next) return;
  locale.value = next;
  persistLocale(next);
}
</script>

<template>
  <div
    class="lang-toggle"
    role="group"
    :aria-label="t('nav.languageLabel')"
  >
    <button
      v-for="opt in locales"
      :key="opt.code"
      type="button"
      class="lang-toggle__btn"
      :class="{ 'is-active': locale === opt.code }"
      :aria-pressed="locale === opt.code"
      @click="setLocale(opt.code)"
    >
      {{ opt.label }}
    </button>
    <span class="lang-toggle__pill" :data-active="locale" />
  </div>
</template>

<style scoped>
.lang-toggle {
  position: relative;
  display: inline-flex;
  padding: 3px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(231, 233, 245, 0.04);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  isolation: isolate;
}

.lang-toggle__btn {
  position: relative;
  z-index: 2;
  padding: 0.4rem 0.8rem;
  border: 0;
  background: transparent;
  color: var(--color-ink-muted);
  border-radius: 999px;
  transition: color 200ms ease;
}
.lang-toggle__btn.is-active {
  color: var(--color-bg);
}

.lang-toggle__pill {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 3px;
  width: calc(50% - 3px);
  border-radius: 999px;
  background: linear-gradient(120deg, var(--color-accent-cyan), var(--color-accent-violet));
  z-index: 1;
  transition: transform 320ms cubic-bezier(0.6, 0, 0.2, 1);
  transform: translateX(0);
}
.lang-toggle__pill[data-active="en"] {
  transform: translateX(100%);
}
</style>
