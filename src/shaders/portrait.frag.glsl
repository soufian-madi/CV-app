precision highp float;

uniform sampler2D uTexture;
uniform vec2 uMouse;        // 0..1 in plane UV space (already mapped)
uniform float uHover;       // 0..1 lerped hover strength
uniform float uTime;
uniform vec2 uResolution;   // pixel size of canvas (for chromatic aberration scaling)

varying vec2 vUv;

float circle(vec2 uv, vec2 c, float r, float blur) {
  return smoothstep(r, r - blur, distance(uv, c));
}

vec2 displace(vec2 uv, vec2 mouse, float strength) {
  vec2 dir = uv - mouse;
  float d = length(dir);
  // soft falloff: strong near cursor, fading out
  float falloff = exp(-d * 6.0);
  vec2 push = normalize(dir + 1e-6) * falloff * strength;
  return uv + push;
}

vec2 ripple(vec2 uv, vec2 mouse, float t) {
  float d = distance(uv, mouse);
  float wave = sin(d * 35.0 - t * 4.5) * 0.012 * exp(-d * 7.0);
  vec2 dir = normalize(uv - mouse + 1e-6);
  return uv + dir * wave;
}

void main() {
  vec2 uv = vUv;
  vec2 mouse = uMouse;

  float hover = clamp(uHover, 0.0, 1.0);
  float strength = mix(0.012, 0.075, hover);

  vec2 disp = displace(uv, mouse, strength);
  disp = ripple(disp, mouse, uTime);

  // chromatic aberration scaling with hover
  float caStrength = 0.004 + hover * 0.012;
  vec2 dir = normalize(uv - mouse + 1e-6);
  float falloff = exp(-distance(uv, mouse) * 5.0);
  vec2 caOffset = dir * caStrength * falloff;

  vec3 col;
  col.r = texture2D(uTexture, disp + caOffset).r;
  col.g = texture2D(uTexture, disp).g;
  col.b = texture2D(uTexture, disp - caOffset).b;

  // ambient grain
  float grain = (fract(sin(dot(uv * 1000.0, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.04;
  col += grain;

  // soft circular vignette / mask
  float vignette = circle(uv, vec2(0.5), 0.62, 0.35);
  col *= mix(0.65, 1.05, vignette);

  // tinted highlight near cursor
  vec3 tint = mix(vec3(0.13, 0.83, 0.93), vec3(0.66, 0.55, 0.97), 0.5 + 0.5 * sin(uTime * 0.4));
  col += tint * falloff * 0.18 * hover;

  gl_FragColor = vec4(col, 1.0);
}
