<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import WebGLFluid from 'webgl-fluid';
import { useReducedMotion } from '@/composables/useReducedMotion';
import { registerFluidCanvas } from '@/composables/useFluidSplat';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const reduced = useReducedMotion();

let cleanupFns: Array<() => void> = [];

function forwardEvent(canvas: HTMLCanvasElement, type: 'mousedown' | 'mousemove' | 'mouseup', source: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const offsetX = source.clientX - rect.left;
  const offsetY = source.clientY - rect.top;
  const synthetic = new MouseEvent(type, {
    clientX: source.clientX,
    clientY: source.clientY,
    bubbles: false,
    cancelable: true,
    view: window,
  });
  Object.defineProperty(synthetic, 'offsetX', { configurable: true, value: offsetX });
  Object.defineProperty(synthetic, 'offsetY', { configurable: true, value: offsetY });
  canvas.dispatchEvent(synthetic);
}

onMounted(() => {
  if (reduced.value) return;
  const canvas = canvasRef.value;
  if (!canvas) return;

  registerFluidCanvas(canvas);

  try {
    WebGLFluid(canvas, {
      TRIGGER: 'hover',
      IMMEDIATE: true,
      AUTO: false,
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 1.4,
      VELOCITY_DISSIPATION: 0.55,
      PRESSURE: 0.78,
      PRESSURE_ITERATIONS: 18,
      CURL: 24,
      SPLAT_RADIUS: 0.22,
      SPLAT_FORCE: 6500,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 4,
      BACK_COLOR: '#05060d',
      TRANSPARENT: true,
      BLOOM: true,
      BLOOM_INTENSITY: 0.18,
      BLOOM_THRESHOLD: 0.55,
      SUNRAYS: false,
    });
  } catch (err) {
    console.warn('FluidBackground init failed; hiding canvas.', err);
    canvas.style.display = 'none';
    return;
  }

  const onMove = (event: MouseEvent) => forwardEvent(canvas, 'mousemove', event);
  const onDown = (event: MouseEvent) => forwardEvent(canvas, 'mousedown', event);
  const onUp = (event: MouseEvent) => forwardEvent(canvas, 'mouseup', event);

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mousedown', onDown, { passive: true });
  window.addEventListener('mouseup', onUp, { passive: true });

  cleanupFns.push(() => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mousedown', onDown);
    window.removeEventListener('mouseup', onUp);
  });

  const onVisibility = () => {
    canvas.style.display = document.hidden ? 'none' : 'block';
  };
  document.addEventListener('visibilitychange', onVisibility);
  cleanupFns.push(() => document.removeEventListener('visibilitychange', onVisibility));
});

onBeforeUnmount(() => {
  cleanupFns.forEach((fn) => fn());
  cleanupFns = [];
  registerFluidCanvas(null);
});
</script>

<template>
  <div class="fluid-bg" aria-hidden="true">
    <canvas v-if="!reduced" ref="canvasRef" class="fluid-bg__canvas" />
    <div class="fluid-bg__vignette" />
    <div class="fluid-bg__noise" />
  </div>
</template>

<style scoped>
.fluid-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background: var(--color-bg);
}

.fluid-bg__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.55;
  mix-blend-mode: screen;
  filter: saturate(1.1) contrast(1.05);
}

.fluid-bg__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(140% 90% at 50% 0%, transparent 50%, rgba(5, 6, 13, 0.85) 100%),
    radial-gradient(140% 90% at 50% 100%, transparent 50%, rgba(5, 6, 13, 0.85) 100%);
}

.fluid-bg__noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>");
  background-size: 160px 160px;
}
</style>
