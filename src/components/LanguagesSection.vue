<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LANGUAGE_PROFICIENCIES } from '@/data/cv';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();

const items = computed(() =>
  LANGUAGE_PROFICIENCIES.map((lang) => ({
    ...lang,
    name: t(`languages.levels.${lang.key}` as const),
    levelLabel: lang.label,
    nativeLabel: lang.isNative ? t('languages.native') : '',
  })),
);

const CIRCUMFERENCE = 2 * Math.PI * 36;

let triggers: ScrollTrigger[] = [];

onMounted(() => {
  if (reduced.value || !sectionRef.value) return;
  const rings = sectionRef.value.querySelectorAll<SVGCircleElement>('.lang-ring__progress');
  rings.forEach((ring) => {
    const final = parseFloat(ring.dataset.level || '0');
    gsap.set(ring, { strokeDashoffset: CIRCUMFERENCE });
    const trig = ScrollTrigger.create({
      trigger: ring,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(ring, {
          strokeDashoffset: CIRCUMFERENCE * (1 - final),
          duration: 1.4,
          ease: 'power3.out',
        });
      },
    });
    triggers.push(trig);
  });
});

onBeforeUnmount(() => {
  triggers.forEach((t) => t.kill());
  triggers = [];
});
</script>

<template>
  <section id="languages" ref="sectionRef" class="section languages-section">
    <header class="languages-section__header">
      <p class="section-eyebrow">{{ t('languages.heading') }}</p>
      <h2 class="languages-section__title">{{ t('languages.heading') }}</h2>
    </header>

    <div class="lang-grid">
      <div
        v-for="item in items"
        :key="item.key"
        class="lang-card"
      >
        <svg class="lang-ring" viewBox="0 0 80 80" aria-hidden="true">
          <defs>
            <linearGradient :id="`grad-${item.key}`" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="var(--color-accent-cyan)" />
              <stop offset="100%" stop-color="var(--color-accent-violet)" />
            </linearGradient>
          </defs>
          <circle class="lang-ring__track" cx="40" cy="40" r="36" />
          <circle
            class="lang-ring__progress"
            cx="40"
            cy="40"
            r="36"
            :stroke="`url(#grad-${item.key})`"
            :stroke-dasharray="CIRCUMFERENCE"
            :stroke-dashoffset="reduced ? CIRCUMFERENCE * (1 - item.level) : CIRCUMFERENCE"
            :data-level="item.level"
          />
          <text
            x="40"
            y="45"
            text-anchor="middle"
            class="lang-ring__label"
          >{{ item.levelLabel }}</text>
        </svg>
        <span class="lang-name">{{ item.name }}</span>
        <span v-if="item.nativeLabel" class="lang-native">{{ item.nativeLabel }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.languages-section__header {
  margin-bottom: 3rem;
}
.languages-section__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  margin: 0;
}

.lang-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
@media (min-width: 720px) {
  .lang-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.lang-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 1.5rem 1rem;
  border-radius: 18px;
  border: 1px solid var(--color-line);
  background: rgba(231, 233, 245, 0.02);
  transition: border-color 240ms ease, transform 240ms ease;
}
.lang-card:hover {
  border-color: color-mix(in srgb, var(--color-accent-cyan) 30%, var(--color-line));
  transform: translateY(-2px);
}

.lang-ring {
  width: 96px;
  height: 96px;
  transform: rotate(-90deg);
}
.lang-ring__track {
  fill: none;
  stroke: var(--color-line);
  stroke-width: 6;
}
.lang-ring__progress {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  filter: drop-shadow(0 0 8px rgba(34, 211, 238, 0.35));
}
.lang-ring__label {
  fill: var(--color-ink);
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transform: rotate(90deg);
  transform-origin: 40px 40px;
}

.lang-name {
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.05rem;
}
.lang-native {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-accent-cyan);
  margin-top: -0.3rem;
}
</style>
