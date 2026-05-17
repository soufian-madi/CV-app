<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useReducedMotion } from '@/composables/useReducedMotion';

gsap.registerPlugin(SplitText);

const { t, locale } = useI18n();
const nameRef = ref<HTMLElement | null>(null);
const taglineRef = ref<HTMLElement | null>(null);
const reduced = useReducedMotion();

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

// Returns a frame function that throttles random-char updates to `flickerMs`.
// Characters past `progress` are revealed left-to-right; spaces are preserved.
function makeScrambler(text: string, flickerMs = 100) {
  let lastTick = 0;
  const snapshot = text.split('').map(ch => (ch === ' ' ? ' ' : rand()));
  return (progress: number): string => {
    const now = performance.now();
    if (now - lastTick >= flickerMs) {
      lastTick = now;
      for (let i = 0; i < snapshot.length; i++)
        if (snapshot[i] !== ' ') snapshot[i] = rand();
    }
    return text
      .split('')
      .map((ch, i) => (ch === ' ' ? ' ' : progress >= (i + 1) / text.length ? ch : snapshot[i]))
      .join('');
  };
}

let activeScrTween: gsap.core.Tween | null = null;

function runScramble(el: HTMLElement, text: string, duration: number) {
  activeScrTween?.kill();
  const frame = makeScrambler(text);
  const obj = { p: 0 };
  el.textContent = frame(0);
  activeScrTween = gsap.to(obj, {
    p: 1,
    duration,
    ease: 'none',
    onUpdate: () => { el.textContent = frame(obj.p); },
    onComplete: () => { el.textContent = text; },
  });
}

onMounted(() => {
  if (reduced.value) return;
  if (!nameRef.value || !taglineRef.value) return;

  const el = taglineRef.value;
  const text = t('hero.tagline');
  const frame = makeScrambler(text);
  el.textContent = frame(0);

  const split = new SplitText(nameRef.value, { type: 'chars,words' });
  gsap.set(split.chars, { yPercent: 110, opacity: 0 });

  const obj = { p: 0 };
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(split.chars, {
    yPercent: 0,
    opacity: 1,
    duration: 1.1,
    stagger: 0.045,
    delay: 0.15,
  })
    .to(
      obj,
      {
        p: 1,
        duration: 1.6,
        ease: 'none',
        onUpdate: () => { el.textContent = frame(obj.p); },
        onComplete: () => { el.textContent = text; },
      },
      0,
    )
    .from(
      '.hero__meta > *',
      {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
      },
      '-=0.8',
    )
    .from(
      '.hero__cue',
      { opacity: 0, y: 10, duration: 0.5 },
      '-=0.3',
    );
});

watch(locale, () => {
  if (!taglineRef.value) return;
  const text = t('hero.tagline');
  taglineRef.value.dataset.fullText = text;
  if (reduced.value) {
    taglineRef.value.textContent = text;
    return;
  }
  runScramble(taglineRef.value, text, 1.2);
}, { flush: 'post' });
</script>

<template>
  <section id="top" class="hero">
    <div class="hero__inner">
      <p class="hero__greeting">
        <span class="hero__greeting-mark" />
        {{ t('hero.greeting') }}
      </p>

      <h1 ref="nameRef" class="hero__name">
        {{ t('hero.name') }}
      </h1>

      <p class="hero__role">
        <span>{{ t('hero.role') }}</span>
        <span class="hero__role-sep">/</span>
        <span>{{ t('hero.location') }}</span>
      </p>

      <p
        ref="taglineRef"
        class="hero__tagline"
        :data-full-text="t('hero.tagline')"
      >
        {{ reduced ? t('hero.tagline') : '' }}
      </p>

      <div class="hero__meta">
        <span class="hero__pill">
          <span class="hero__dot" />
          {{ t('hero.available') }}
        </span>
      </div>
    </div>

    <div class="hero__cue" aria-hidden="true">
      <!-- scroll cue: desktop (≥900px) -->
      <span class="hero__cue--scroll">{{ t('hero.scrollCue') }}</span>
      <svg class="hero__cue--scroll" width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" stroke-width="1.4">
        <rect x="1" y="1" width="12" height="20" rx="6" />
        <line x1="7" y1="6" x2="7" y2="11" stroke-linecap="round">
          <animate attributeName="y2" values="11;15;11" dur="1.6s" repeatCount="indefinite" />
        </line>
      </svg>
      <!-- swipe cue: compact (<900px) -->
      <span class="hero__cue--swipe">{{ t('hero.swipeCue') }}</span>
      <!-- 3 downward chevrons, cascading animation top→bottom -->
      <svg class="hero__cue--swipe" width="14" height="20" viewBox="0 0 14 20" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="2,1 7,6 12,1">
          <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" begin="0s" repeatCount="indefinite" />
        </polyline>
        <polyline points="2,7 7,12 12,7">
          <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
        </polyline>
        <polyline points="2,13 7,18 12,13">
          <animate attributeName="opacity" values="1;0.2;1" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
        </polyline>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 7rem clamp(1.25rem, 5vw, 4rem) 5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.hero__inner {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.hero__greeting {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-accent-cyan);
}
.hero__greeting-mark {
  width: 1.6rem;
  height: 1px;
  background: currentColor;
  display: inline-block;
}

.hero__name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(3.5rem, 13vw, 11rem);
  line-height: 0.92;
  letter-spacing: -0.04em;
  margin: 0;
  overflow: hidden;
  background: linear-gradient(120deg, var(--color-accent-cyan), var(--color-accent-violet) 55%, var(--color-accent-pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* SplitText creates child <div>s that lose the parent's gradient. Re-apply per char. */
.hero__name :deep(div) {
  background: linear-gradient(120deg, var(--color-accent-cyan), var(--color-accent-violet) 55%, var(--color-accent-pink));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero__role {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: baseline;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: clamp(1.1rem, 2.2vw, 1.6rem);
  color: var(--color-ink);
}
.hero__role-sep {
  color: var(--color-accent-violet);
}

.hero__tagline {
  max-width: 56ch;
  font-size: clamp(1rem, 1.4vw, 1.15rem);
  color: var(--color-ink-soft);
  font-family: var(--font-mono);
  letter-spacing: -0.005em;
  min-height: 1.5em;
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.hero__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: rgba(231, 233, 245, 0.03);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
.hero__dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--color-accent-teal);
  box-shadow: 0 0 12px var(--color-accent-teal);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.4); }
}

.hero__cue {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

.hero__cue--swipe { display: none; }

@media (max-width: 899px) {
  .hero__cue--scroll { display: none; }
  .hero__cue--swipe  { display: revert; }
}
</style>
