<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCE_ORDER, type ExperienceKey } from '@/data/cv';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

const { t, tm, rt } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();

interface Entry {
  key: ExperienceKey;
  title: string;
  company: string;
  location: string;
  period: string;
  summary: string;
  bullets: string[];
}

const entries = computed<Entry[]>(() =>
  EXPERIENCE_ORDER.map((key) => {
    const bulletMessages = tm(`experience.entries.${key}.bullets`) as unknown[];
    const bullets = Array.isArray(bulletMessages)
      ? bulletMessages.map((b) => rt(b as string))
      : [];
    return {
      key,
      title: t(`experience.entries.${key}.title` as const),
      company: t(`experience.entries.${key}.company` as const),
      location: t(`experience.entries.${key}.location` as const),
      period: t(`experience.entries.${key}.period` as const),
      summary: t(`experience.entries.${key}.summary` as const),
      bullets,
    };
  }),
);

let triggers: ScrollTrigger[] = [];

onMounted(() => {
  if (reduced.value || !sectionRef.value) return;

  const spine = sectionRef.value.querySelector<HTMLElement>('.timeline__spine-fill');
  const items = sectionRef.value.querySelectorAll<HTMLElement>('.timeline-entry');
  const list = sectionRef.value.querySelector<HTMLElement>('.timeline');
  if (!spine || !list) return;

  const spineTrig = ScrollTrigger.create({
    trigger: list,
    start: 'top 70%',
    end: 'bottom 80%',
    scrub: 0.6,
    onUpdate: (self) => {
      gsap.set(spine, { scaleY: self.progress });
    },
  });
  triggers.push(spineTrig);

  items.forEach((item) => {
    const trig = ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(
          item,
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
        );
      },
      once: true,
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
  <section id="experience" ref="sectionRef" class="section experience-section">
    <header class="experience-section__header">
      <p class="section-eyebrow">{{ t('experience.heading') }}</p>
      <h2 class="experience-section__title">
        <span>{{ t('experience.heading') }}</span>
      </h2>
    </header>

    <ol class="timeline">
      <div class="timeline__spine" aria-hidden="true">
        <div class="timeline__spine-fill" />
      </div>

      <li
        v-for="entry in entries"
        :key="entry.key"
        class="timeline-entry"
      >
        <span class="timeline-entry__dot" aria-hidden="true" />
        <div class="timeline-entry__meta">
          <span class="timeline-entry__period">{{ entry.period }}</span>
          <span class="timeline-entry__location">{{ entry.location }}</span>
        </div>
        <div class="timeline-entry__body">
          <h3 class="timeline-entry__title">
            {{ entry.title }}
            <span class="timeline-entry__company">— {{ entry.company }}</span>
          </h3>
          <p class="timeline-entry__summary">{{ entry.summary }}</p>
          <ul class="timeline-entry__bullets">
            <li v-for="(b, i) in entry.bullets" :key="i">{{ b }}</li>
          </ul>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.experience-section__header {
  margin-bottom: 3.5rem;
}
.experience-section__title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  margin: 0;
}

.timeline {
  position: relative;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}
.timeline__spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  width: 1px;
  background: var(--color-line);
  overflow: hidden;
}
.timeline__spine-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--color-accent-cyan), var(--color-accent-violet));
  transform-origin: top;
  transform: scaleY(0);
}

.timeline-entry {
  position: relative;
  padding-left: 2.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}
@media (min-width: 880px) {
  .timeline-entry {
    grid-template-columns: 200px 1fr;
    gap: 2.5rem;
  }
}

.timeline-entry__dot {
  position: absolute;
  left: 0;
  top: 0.4rem;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 2px solid var(--color-accent-cyan);
  box-shadow: 0 0 18px var(--color-accent-cyan);
}

.timeline-entry__meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-ink-muted);
  letter-spacing: 0.05em;
}
.timeline-entry__period {
  color: var(--color-accent-cyan);
  font-weight: 500;
}

.timeline-entry__title {
  font-size: clamp(1.3rem, 2vw, 1.7rem);
  margin: 0 0 0.6rem;
  font-weight: 600;
}
.timeline-entry__company {
  color: var(--color-ink-soft);
  font-weight: 400;
}

.timeline-entry__summary {
  color: var(--color-ink-soft);
  margin: 0 0 1rem;
  line-height: 1.6;
  font-size: 1.02rem;
}

.timeline-entry__bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}
.timeline-entry__bullets li {
  position: relative;
  padding-left: 1.4rem;
  color: var(--color-ink-soft);
  line-height: 1.55;
  font-size: 0.95rem;
}
.timeline-entry__bullets li::before {
  content: "›";
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-accent-cyan);
  font-weight: 700;
}
</style>
