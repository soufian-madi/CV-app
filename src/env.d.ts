/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}

declare module '*.vert' {
  const value: string;
  export default value;
}

declare module '*.frag' {
  const value: string;
  export default value;
}

declare module 'webgl-fluid' {
  type WebglFluidConfig = Record<string, unknown>;
  export default function webglFluid(
    canvas: HTMLCanvasElement,
    config?: WebglFluidConfig,
  ): void;
}
