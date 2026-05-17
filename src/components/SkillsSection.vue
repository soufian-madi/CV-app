<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMediaQuery } from '@vueuse/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CATEGORY_COLOR,
  CATEGORY_ORDER,
  SKILLS,
  type SkillCategory,
} from '@/data/cv';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { triggerFluidExplosion } from '@/composables/useFluidSplat';

gsap.registerPlugin(ScrollTrigger);

const { t } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();
const isMobile = useMediaQuery('(max-width: 899px)');

const grouped = computed(() =>
  CATEGORY_ORDER.map((cat) => ({
    key: cat,
    label: t(`skills.categories.${cat}` as const),
    skills: SKILLS.filter((s) => s.category === cat),
  })),
);

function colorVar(cat: SkillCategory): string {
  const [r, g, b] = CATEGORY_COLOR[cat];
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

function onChipEnter(e: MouseEvent) {
  if (reduced.value) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  triggerFluidExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function onChipTouch(e: TouchEvent) {
  if (reduced.value) return;
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  triggerFluidExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
}

let triggers: ScrollTrigger[] = [];

onMounted(() => {
  if (reduced.value || !sectionRef.value) return;
  const groups = sectionRef.value.querySelectorAll<HTMLElement>('.skills-group');
  groups.forEach((group) => {
    const chips = group.querySelectorAll<HTMLElement>('.chip');
    const trig = ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          chips,
          { y: 22, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power3.out',
          },
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
  <section id="skills" ref="sectionRef" class="section skills-section">
    <header class="skills-section__header">
      <p class="section-eyebrow">{{ t('skills.heading') }}</p>
      <h2 class="skills-section__title">
        <span>Stack &amp;</span>
        <span class="gradient-text">Tooling</span>
      </h2>
      <p class="skills-section__sub">{{ isMobile ? t('skills.subheadingTouch') : t('skills.subheading') }}</p>
    </header>

    <div class="skills-section__groups">
      <div
        v-for="group in grouped"
        :key="group.key"
        class="skills-group"
        :style="{ '--group-color': colorVar(group.key) }"
      >
        <h3 class="skills-group__title">
          <span class="skills-group__index">{{ String(CATEGORY_ORDER.indexOf(group.key) + 1).padStart(2, '0') }}</span>
          <span>{{ group.label }}</span>
          <span class="skills-group__line" />
        </h3>
        <div class="skills-group__chips">
          <span
            v-for="skill in group.skills"
            :key="skill.name"
            class="chip"
            :style="{ '--chip-color': colorVar(skill.category) }"
            @mouseenter="onChipEnter"
            @touchstart.passive="onChipTouch"
          >
            {{ skill.name }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills-section__header {
  margin-bottom: 4rem;
  max-width: 720px;
}
.skills-section__title {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: clamp(2.4rem, 5vw, 4rem);
  margin: 0 0 1rem;
}
.skills-section__sub {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--color-ink-muted);
}

.skills-section__groups {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.skills-group__title {
  display: inline-flex;
  align-items: center;
  gap: 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
  font-weight: 500;
  margin: 0 0 1.25rem;
  width: 100%;
}
.skills-group__index {
  color: var(--group-color);
  font-weight: 600;
}
.skills-group__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--group-color), transparent);
  opacity: 0.4;
}

.skills-group__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.5rem;
}
</style>
