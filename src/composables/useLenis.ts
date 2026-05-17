import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted } from 'vue';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function useLenis() {
  onMounted(() => {
    if (typeof window === 'undefined') return;

    const reduce =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    if (lenisInstance) return;

    lenisInstance = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance?.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  });
}

export function scrollToTarget(target: string | HTMLElement) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, { offset: -80, duration: 1.1 });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
