<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { tm, rt } = useI18n();

const items = computed(() => {
  const list = tm('interests.items') as unknown[];
  return Array.isArray(list) ? list.map((m) => rt(m as string)) : [];
});

const doubled = computed(() => [...items.value, ...items.value]);
</script>

<template>
  <section class="interests" :aria-label="$t('interests.heading')">
    <div class="interests__track">
      <span
        v-for="(item, i) in doubled"
        :key="i"
        class="interests__item"
      >
        <span class="interests__dot" aria-hidden="true" />
        {{ item }}
      </span>
    </div>
  </section>
</template>

<style scoped>
.interests {
  position: relative;
  overflow: hidden;
  padding-block: 3rem;
  border-top: 1px solid var(--color-line);
  border-bottom: 1px solid var(--color-line);
  background: linear-gradient(180deg, transparent, rgba(167, 139, 250, 0.04), transparent);
  -webkit-mask: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
          mask: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
}

.interests__track {
  display: inline-flex;
  gap: 3rem;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 3rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  animation: marquee 32s linear infinite;
}
.interests:hover .interests__track {
  animation-play-state: paused;
}

.interests__item {
  display: inline-flex;
  align-items: center;
  gap: 1.25rem;
  color: var(--color-ink-soft);
  transition: color 240ms ease;
}
.interests__item:hover {
  color: var(--color-ink);
}

.interests__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--color-accent-cyan);
  box-shadow: 0 0 10px var(--color-accent-cyan);
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
