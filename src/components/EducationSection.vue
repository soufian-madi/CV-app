<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { CERT_DOWNLOADS, EDUCATION_ORDER } from '@/data/cv';

const { t } = useI18n();

const cards = computed(() =>
  EDUCATION_ORDER.map((key) => ({
    key,
    title: t(`education.entries.${key}.title` as const),
    institution: t(`education.entries.${key}.institution` as const),
    period: t(`education.entries.${key}.period` as const),
    certUrl: CERT_DOWNLOADS[key] ?? null,
  })),
);
</script>

<template>
  <section id="education" class="section education-section">
    <header class="education-section__header">
      <p class="section-eyebrow">{{ t('education.heading') }}</p>
      <h2 class="education-section__title">
        <span class="gradient-text">{{ t('education.heading') }}</span>
      </h2>
    </header>

    <div class="education-grid">
      <article
        v-for="(card, idx) in cards"
        :key="card.key"
        v-motion
        :initial="{ opacity: 0, y: 32 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: idx * 100 } }"
        class="education-card glass-panel"
      >
        <span class="education-card__index">0{{ idx + 1 }}</span>
        <div class="education-card__body">
          <span class="education-card__period">{{ card.period }}</span>
          <h3 class="education-card__title">{{ card.title }}</h3>
          <p class="education-card__inst">{{ card.institution }}</p>
          <a
            v-if="card.certUrl"
            :href="card.certUrl"
            download
            class="education-card__download"
            @click.stop
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {{ t('education.downloadCert') }}
          </a>
        </div>
        <div class="education-card__shine" aria-hidden="true" />
      </article>
    </div>
  </section>
</template>

<style scoped>
.education-section__header {
  margin-bottom: 3rem;
}
.education-section__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  margin: 0;
}

.education-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 760px) {
  .education-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.education-card {
  position: relative;
  padding: 1.75rem 1.5rem 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 220px;
  overflow: hidden;
  transition: transform 320ms cubic-bezier(0.2, 0.7, 0.2, 1), border-color 320ms ease;
}
.education-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--color-accent-cyan) 35%, var(--color-line));
}
.education-card:hover .education-card__shine {
  opacity: 1;
}

.education-card__index {
  position: absolute;
  top: 1rem;
  right: 1.2rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--color-ink-muted);
}

.education-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}
.education-card__period {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent-cyan);
}
.education-card__title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}
.education-card__inst {
  font-size: 0.9rem;
  color: var(--color-ink-soft);
  margin: 0;
}
.education-card__download {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-accent-cyan);
  text-decoration: none;
  opacity: 0.75;
  transition: opacity 200ms ease;
}
.education-card__download:hover {
  opacity: 1;
}

.education-card__shine {
  position: absolute;
  inset: -50%;
  background: radial-gradient(40% 30% at 50% 50%, rgba(34, 211, 238, 0.16), transparent 70%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 400ms ease;
}
</style>
