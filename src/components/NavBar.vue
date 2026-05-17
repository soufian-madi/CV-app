<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import LanguageToggle from './LanguageToggle.vue';
import { scrollToTarget } from '@/composables/useLenis';
import { CONTACT } from '@/data/cv';

const { t } = useI18n();
const scrolled = ref(false);

const sections = [
  { id: 'about', key: 'nav.about' as const },
  { id: 'skills', key: 'nav.skills' as const },
  { id: 'experience', key: 'nav.experience' as const },
  { id: 'education', key: 'nav.education' as const },
  { id: 'languages', key: 'nav.languages' as const },
  { id: 'contact', key: 'nav.contact' as const },
];

function onScroll() {
  scrolled.value = window.scrollY > 32;
}

function go(id: string) {
  scrollToTarget(`#${id}`);
}

onMounted(() => {
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <header class="nav" :class="{ 'is-scrolled': scrolled }">
    <a href="#top" class="nav__logo" aria-label="Soufian Madi" @click.prevent="scrollToTarget('#top')">
      <span class="nav__logo-mark">SM</span>
      <span class="nav__logo-dot" />
    </a>

    <nav class="nav__links" :aria-label="t('nav.primaryNav')">
      <button
        v-for="s in sections"
        :key="s.id"
        type="button"
        class="nav__link"
        @click="go(s.id)"
      >
        {{ t(s.key) }}
      </button>
    </nav>

    <div class="nav__actions">
      <a
        :href="CONTACT.cvDownload"
        class="nav__cta"
        download
        :aria-label="t('nav.downloadCv')"
      >
        <span>{{ t('nav.downloadCv') }}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
          <path d="M7 1.5v9M3.5 7L7 10.5 10.5 7M2 12.5h10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
      <LanguageToggle />
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem clamp(1rem, 4vw, 3rem);
  transition: background 220ms ease, backdrop-filter 220ms ease, border-color 220ms ease;
  border-bottom: 1px solid transparent;
}
.nav.is-scrolled {
  background: rgba(5, 6, 13, 0.55);
  backdrop-filter: blur(12px) saturate(1.1);
  -webkit-backdrop-filter: blur(12px) saturate(1.1);
  border-bottom-color: var(--color-line);
}

.nav__logo {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(231, 233, 245, 0.04);
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
}
.nav__logo-mark {
  background: linear-gradient(120deg, var(--color-accent-cyan), var(--color-accent-violet));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.nav__logo-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--color-accent-cyan);
  box-shadow: 0 0 12px var(--color-accent-cyan);
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.nav__links {
  display: none;
  gap: 0.4rem;
  font-size: 0.85rem;
}
@media (min-width: 900px) {
  .nav__links { display: inline-flex; }
}
.nav__link {
  background: transparent;
  border: 0;
  padding: 0.5rem 0.85rem;
  color: var(--color-ink-soft);
  border-radius: 999px;
  transition: color 200ms ease, background 200ms ease;
}
.nav__link:hover {
  color: var(--color-ink);
  background: rgba(231, 233, 245, 0.05);
}

.nav__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
}
.nav__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border-radius: 999px;
  border: 1px solid var(--color-accent-cyan);
  color: var(--color-accent-cyan);
  background: color-mix(in srgb, var(--color-accent-cyan) 8%, transparent);
  transition: background 220ms ease, color 220ms ease, transform 220ms ease;
}
.nav__cta:hover {
  background: var(--color-accent-cyan);
  color: var(--color-bg);
  transform: translateY(-1px);
}
</style>
