import { gsap } from 'gsap';

let _canvas: HTMLCanvasElement | null = null;

export function registerFluidCanvas(el: HTMLCanvasElement | null) {
  _canvas = el;
}

function dispatchMove(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  const ev = new MouseEvent('mousemove', {
    clientX,
    clientY,
    bubbles: false,
    cancelable: true,
    view: window,
  });
  Object.defineProperty(ev, 'offsetX', { configurable: true, value: clientX - rect.left });
  Object.defineProperty(ev, 'offsetY', { configurable: true, value: clientY - rect.top });
  canvas.dispatchEvent(ev);
}

export function triggerFluidExplosion(clientX: number, clientY: number) {
  if (!_canvas) return;
  const canvas = _canvas;

  // Punch the canvas opacity up to 1 then fade back — the canvas sits at 0.55
  // normally; screen blend on a dark bg means this nearly doubles perceived brightness.
  gsap.killTweensOf(canvas, 'opacity');
  gsap.fromTo(canvas, { opacity: 1 }, { opacity: 0.55, duration: 1.1, delay: 0.15, ease: 'power2.in' });

  const baseAngle = Math.random() * Math.PI * 2;

  // Outer ring: 20 wide-radius rays, rapid-fire
  const OUTER = 20;
  for (let i = 0; i < OUTER; i++) {
    const angle = baseAngle + (i / OUTER) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const radius = 120 + Math.random() * 100;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    setTimeout(() => {
      dispatchMove(canvas, clientX, clientY);
      dispatchMove(canvas, clientX + dx, clientY + dy);
    }, i * 8);
  }

  // Inner ring: 12 tighter rays offset by half a rotation, slight delay
  const INNER = 12;
  for (let i = 0; i < INNER; i++) {
    const angle = baseAngle + Math.PI / INNER + (i / INNER) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
    const radius = 60 + Math.random() * 60;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    setTimeout(() => {
      dispatchMove(canvas, clientX, clientY);
      dispatchMove(canvas, clientX + dx, clientY + dy);
    }, 40 + i * 8);
  }
}
