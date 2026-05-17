<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@vueuse/core';
import { CONTACT } from '@/data/cv';

const { t } = useI18n();
const { copy, copied: justCopied } = useClipboard({ legacy: true });
const lastCopied = ref<string | null>(null);

async function copyValue(value: string, key: string) {
  await copy(value);
  lastCopied.value = key;
  window.setTimeout(() => {
    if (lastCopied.value === key) lastCopied.value = null;
  }, 1600);
}

const fields = [
  { key: 'email', value: CONTACT.email, href: `mailto:${CONTACT.email}`, labelKey: 'contact.emailLabel' as const },
  { key: 'phone', value: CONTACT.phone, href: `tel:${CONTACT.phoneTel}`, labelKey: 'contact.phoneLabel' as const },
  { key: 'linkedin', value: CONTACT.linkedinHandle, href: CONTACT.linkedin, labelKey: 'contact.linkedinLabel' as const },
  { key: 'address', value: CONTACT.address, href: undefined, labelKey: 'contact.addressLabel' as const },
];
</script>

<template>
  <footer id="contact" class="contact">
    <div class="contact__inner">
      <div class="contact__lead">
        <p class="section-eyebrow">{{ t('contact.heading') }}</p>
        <h2 class="contact__title">
          <span>{{ t('contact.subheading') }}</span>
        </h2>
        <a
          :href="`mailto:${CONTACT.email}`"
          class="contact__cta"
        >
          <span>{{ t('contact.cta') }}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor" stroke-width="1.5" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </div>

      <ul class="contact__list">
        <li v-for="f in fields" :key="f.key" class="contact__item">
          <span class="contact__label">{{ t(f.labelKey) }}</span>
          <div class="contact__row">
            <a
              v-if="f.href"
              :href="f.href"
              :target="f.key === 'linkedin' ? '_blank' : undefined"
              :rel="f.key === 'linkedin' ? 'noopener noreferrer' : undefined"
              class="contact__value contact__value--link"
            >
              {{ f.value }}
            </a>
            <span v-else class="contact__value">{{ f.value }}</span>
            <button
              v-if="f.key !== 'linkedin'"
              type="button"
              class="contact__copy"
              :aria-label="`${t('contact.copy')} ${t(f.labelKey)}`"
              @click="copyValue(f.value, f.key)"
            >
              {{ lastCopied === f.key && justCopied ? t('contact.copied') : t('contact.copy') }}
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div class="contact__signature">
      <span>© {{ new Date().getFullYear() }} Soufian Madi</span>
      <span class="contact__credit">Vue 3 · TypeScript · WebGL</span>
    </div>
  </footer>
</template>

<style scoped>
.contact {
  position: relative;
  padding: clamp(5rem, 10vw, 8rem) clamp(1.25rem, 5vw, 4rem) 3rem;
  max-width: 1280px;
  margin: 0 auto;
}

.contact__inner {
  display: grid;
  gap: 4rem;
  grid-template-columns: 1fr;
}
@media (min-width: 880px) {
  .contact__inner {
    grid-template-columns: 1.1fr 1fr;
    gap: 5rem;
  }
}

.contact__title {
  font-size: clamp(2rem, 4.4vw, 3.4rem);
  margin: 0 0 2rem;
  line-height: 1.1;
  max-width: 18ch;
}

.contact__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  background: linear-gradient(120deg, var(--color-accent-cyan), var(--color-accent-violet));
  color: var(--color-bg);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  transition: transform 240ms ease, box-shadow 240ms ease;
}
.contact__cta:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-cyan);
}

.contact__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-top: 1px solid var(--color-line);
  padding-top: 1.5rem;
}

.contact__item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.contact__label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}

.contact__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.contact__value {
  font-size: 1rem;
  color: var(--color-ink);
  word-break: break-word;
}
.contact__value--link {
  transition: color 220ms ease;
}
.contact__value--link:hover {
  color: var(--color-accent-cyan);
}

.contact__copy {
  border: 1px solid var(--color-line);
  background: transparent;
  color: var(--color-ink-soft);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 200ms ease, border-color 200ms ease;
  flex-shrink: 0;
}
.contact__copy:hover {
  color: var(--color-accent-cyan);
  border-color: var(--color-accent-cyan);
}

.contact__signature {
  margin-top: 4rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-line);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-ink-muted);
}
.contact__credit {
  color: var(--color-accent-cyan);
}
</style>
