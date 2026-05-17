<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReducedMotion } from '@/composables/useReducedMotion';

const { t } = useI18n();
const portraitRef = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();

const stats = computed(() => [
  { value: '5+', label: t('about.statYears') },
  { value: '4', label: t('about.statLanguages') },
  { value: '1.5+', label: t('about.statClients') },
]);

const REST_TILT = { rx: 0, ry: 0, gx: 50, gy: 50 };
const tilt = ref({ ...REST_TILT });
let raf = 0;
let target = { ...REST_TILT };

function animate() {
  tilt.value = {
    rx: tilt.value.rx + (target.rx - tilt.value.rx) * 0.12,
    ry: tilt.value.ry + (target.ry - tilt.value.ry) * 0.12,
    gx: tilt.value.gx + (target.gx - tilt.value.gx) * 0.12,
    gy: tilt.value.gy + (target.gy - tilt.value.gy) * 0.12,
  };
  raf = requestAnimationFrame(animate);
}

function startAnimating() {
  if (raf) return;
  raf = requestAnimationFrame(animate);
}

function onPointerMove(event: PointerEvent) {
  if (reduced.value || !portraitRef.value) return;
  const rect = portraitRef.value.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;  // 0..1
  const y = (event.clientY - rect.top) / rect.height;  // 0..1
  target = {
    ry: (x - 0.5) * 14,    // up to ±7° around Y
    rx: -(y - 0.5) * 14,   // up to ±7° around X
    gx: x * 100,
    gy: y * 100,
  };
  startAnimating();
}

function onPointerLeave() {
  target = { ...REST_TILT };
}

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf);
});
</script>

<template>
  <section id="about" class="section about-section">
    <div class="about-section__grid">
      <div
        ref="portraitRef"
        class="portrait"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <div
          class="portrait__inner"
          :style="{
            transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }"
        >
          <img
            src="/portrait.jpg"
            :alt="t('about.portraitAlt')"
            class="portrait__img"
            draggable="false"
          />
          <div
            class="portrait__sheen"
            :style="{
              background: `radial-gradient(120% 120% at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.18), transparent 55%)`,
            }"
            aria-hidden="true"
          />
        </div>
        <div class="portrait__ring" aria-hidden="true" />
        <div class="portrait__corner portrait__corner--tl" />
        <div class="portrait__corner portrait__corner--tr" />
        <div class="portrait__corner portrait__corner--bl" />
        <div class="portrait__corner portrait__corner--br" />
      </div>

      <div class="about-section__copy">
        <p class="section-eyebrow">{{ t('about.heading') }}</p>
        <h2 class="about-section__title">
          <span class="gradient-text">{{ t('hero.role') }}</span>
        </h2>
        <p class="about-section__body">{{ t('about.body') }}</p>

        <ul class="stats">
          <li v-for="s in stats" :key="s.label" class="stats__item">
            <span class="stats__value">{{ s.value }}</span>
            <span class="stats__label">{{ s.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}
@media (min-width: 900px) {
  .about-section__grid {
    grid-template-columns: minmax(280px, 0.85fr) 1.15fr;
    gap: 4rem;
  }
}

.portrait {
  position: relative;
  aspect-ratio: 1118 / 1280;
  width: 100%;
  max-width: 480px;
  margin-inline: auto;
  border-radius: 24px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid var(--color-line);
  box-shadow: var(--shadow-glow-cyan);
  transform-style: preserve-3d;
}

.portrait__inner {
  position: absolute;
  inset: 0;
  transition: transform 0.08s linear;
  will-change: transform;
}

.portrait__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
  filter: contrast(1.04) saturate(1.06);
}

.portrait__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.9;
  transition: background 0.12s linear;
}

.portrait__ring {
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  pointer-events: none;
  background: conic-gradient(
    from 220deg,
    transparent 0deg,
    var(--color-accent-cyan) 45deg,
    transparent 90deg,
    transparent 220deg,
    var(--color-accent-violet) 280deg,
    transparent 320deg
  );
  opacity: 0.55;
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
  animation: spin 16s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.portrait__corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 1px solid var(--color-accent-cyan);
  pointer-events: none;
  opacity: 0.7;
  z-index: 2;
}
.portrait__corner--tl { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
.portrait__corner--tr { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
.portrait__corner--bl { bottom: 8px; left: 8px; border-right: 0; border-top: 0; }
.portrait__corner--br { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }

.about-section__title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 0 0 1.5rem;
}

.about-section__body {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-ink-soft);
  max-width: 60ch;
}

.stats {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  border-top: 1px solid var(--color-line);
  padding-top: 1.6rem;
}
.stats__item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.stats__value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  color: var(--color-ink);
}
.stats__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

@media (prefers-reduced-motion: reduce) {
  .portrait__inner { transform: none !important; }
  .portrait__sheen { display: none; }
  .portrait__ring { animation: none; }
}
</style>
