# CLAUDE.md

Guidance for AI agents working in this repo.

## Commands

```bash
npm run dev          # Vite dev on :5173
npm run build        # vue-tsc -b && vite build
npm run lint         # must exit clean
npm run type-check   # vue-tsc --noEmit
npm test             # vitest run

npx vitest run src/__tests__/i18n.spec.ts        # single file
npx vitest run -t "switches the active locale"   # filter by name
```

## What this is

Single-page Vue 3 CV / frontend showcase. No router, no backend. `App.vue` stacks 8 sections (`HeroSection` → `ContactFooter`) over a fixed-position animated background, with a `NavBar` on top.

## Source-of-truth contract

Three layers must stay in sync:

1. **`src/i18n/de.ts` + `src/i18n/en.ts`** — every user-facing string. Identical key shapes; `src/__tests__/i18n.spec.ts` enforces this recursively. Add new copy to both files in the same place.
2. **`src/data/cv.ts`** — structural registry: `SKILLS`, `EXPERIENCE_ORDER`, `EDUCATION_ORDER`, `LANGUAGE_PROFICIENCIES`, `CATEGORY_COLOR`, `CONTACT`. Holds proper-noun data and key codes that map back into i18n (e.g. `'andrena'` → `experience.entries.andrena.*`). `src/__tests__/data.spec.ts` pins counts and the category-color contract.
3. **Components** iterate the registry and resolve labels via `t('experience.entries.<key>.title')`. Components never own copy.

## Background canvas

`FluidBackground.vue` runs `webgl-fluid` on a `position: fixed; z-index: -1; pointer-events: none` canvas behind everything. `webgl-fluid` only listens on its own canvas, so a `window` listener forwards each mouse event as a synthetic `MouseEvent` dispatched at the canvas (with `offsetX/offsetY` set via `Object.defineProperty`, since synthetic events report 0).

`PortraitSection.vue` runs Three.js directly (one plane, TresJS would be overkill). Shaders in `src/shaders/portrait.{vert,frag}.glsl`, imported with Vite's `?raw`. Has an `<img>` fallback if WebGL fails.

## Animation stack

- **GSAP + ScrollTrigger + SplitText + ScrambleText** — heavy work: hero name reveal, scrambled tagline, pinned timeline scrub, language-ring scrub. Plugins imported per-file and registered once where used.
- **`@vueuse/motion`** (`v-motion`) — declarative one-shot fade-ups (education cards).
- **Lenis** — smooth-scroll. `src/composables/useLenis.ts` keeps a single module-level `lenisInstance` and pipes `gsap.ticker` → `lenis.raf()`. Use its `scrollToTarget(selector)` for in-page anchors instead of `el.scrollIntoView`, otherwise GSAP and Lenis fight.

**Reduced motion is non-negotiable.** Every animated component calls `useReducedMotion()` (`src/composables/useReducedMotion.ts`) and bails out of GSAP / Lenis / WebGL init when it returns true. Lenis itself checks `prefers-reduced-motion` before instantiating.

## i18n typing

`createI18n` is called **without explicit generics** — passing them narrows the locale type to a tuple and breaks `.value` access. Do not add `as const` to `de.ts` / `en.ts` — that re-narrows literal types and the EN→DE shape check fails to compile. The augmentation `declare module 'vue-i18n' { interface DefineLocaleMessage extends MessageSchema {} }` provides keypath autocomplete; `legacy: false` enables the Composer API used via `useI18n()`.

## Styling

Tailwind 4, **CSS-first config**. Theme tokens, fonts, shadows live in `@theme { … }` inside `src/assets/styles/main.css`. There is no `tailwind.config.js`. Add tokens to `@theme`; reference them as `var(--color-accent-cyan)` from scoped component styles. Most non-trivial visual effects (rings, marquees, conic gradients) live in scoped CSS, not utility classes.

## Tests

`vitest.setup.ts` polyfills `IntersectionObserver`, `ResizeObserver`, `matchMedia`, and a memory-backed `localStorage`/`sessionStorage`. Coverage focuses on data/i18n invariants and one component (`LanguageToggle`, locale persistence). Do not write tests for canvas/WebGL behaviour — the WebGL stack isn't available under happy-dom.

## Two Vite configs

`vite.config.ts` and `vitest.config.ts` are intentionally separate. Vitest ships its own pinned Vite, and importing `defineConfig` from `vitest/config` into the build config produces clashing `Plugin` types. `vitest.config.ts` uses `mergeConfig` to inherit without forcing Vitest's Vite types through.

## Public assets

`public/portrait.jpg` and `public/soufian-madi-cv.pdf` are deployable copies of `Portrait.jpg` and `Soufian_Madi_Lebenslauf_2026 (1).pdf` at the repo root. If the user updates a CV PDF or portrait, copy it into `public/` (don't symlink — Vite serves `public/` files with their literal names).
