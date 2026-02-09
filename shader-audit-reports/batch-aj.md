# Shader Audit Report - Batch AJ

## Summary
- Total shaders audited: 26
- Shaders with issues: 11
- Clean shaders: 15

## Issues Found

### progress-ring
- **[GLSL]** Unused variable: `pct` is declared on line 26 (`float pct=floor(progress*100.0);`) but never read.

### puddle-splash
- **[GLSL]** Unused function: `psHash` is declared on line 9 but never called.
- **[Metal]** Unused variables: `eps` (line 28) and `rH` (line 29) are declared but never used.
- **[Consistency]** The GLSL version uses `dFdx`/`dFdy` on `rippleHeight` to compute per-pixel surface normals from the wave simulation. The Metal version sets `normal = normalize(float3(0.0, 0.0, 1.0))` -- a constant flat normal with no ripple perturbation. This means the Metal version will not show ripple-driven reflection distortion or wave-based specular highlights, producing a significantly flatter visual result.
- **[Consistency]** The GLSL version applies specular lighting (`spec * vec3(1.0, 0.98, 0.95) * 0.6`) while the Metal version instead adds `rippleHeight * 5.0` as a flat brightness offset. These produce different visual effects.
- **[Consistency]** The GLSL version computes `puddleEdge` and adds an edge brightness boost (`col += (puddleMask - puddleEdge) * 0.05`) that the Metal version omits.

### rainfall
- **[Consistency]** The GLSL version applies a subtle scanline/noise effect on the final color (`col*=0.9+0.1*sin(uv.y*200.0+t*20.0)*0.05;`). The Metal version omits this.

### reaction-diffusion
- **[GLSL]** Helper functions use non-prefixed names (`hash`, `noise`, `fbm`). All other shaders in this batch properly prefix their helpers to avoid namespace collisions (e.g., `pfHash`, `rdpHash`). These generic names will collide if shaders are ever combined into a single compilation unit.
- **[Consistency]** The GLSL version computes an edge highlight using `fwidth(v)` and adds `vec3(0.8, 0.9, 1.0) * edge * 0.3` to the color. The Metal version omits this edge effect entirely.

### reaction-diffusion-paint
- **[Consistency]** The GLSL version computes edge detection using `abs(dFdx(pattern)) + abs(dFdy(pattern))` and adds it to the final color as a detail enhancement. The Metal version omits this edge highlight.

### rain-on-window
- **[Consistency]** The GLSL version supports mouse interaction: mouse-driven wind bias on raindrop refraction and mouse-driven light position shifting in the background. The Metal version has no mouse support and uses hardcoded light positions without the `lightShift` offset, removing an interactive feature.

### rothko-fields
- **[Consistency]** The GLSL version applies a fine-grain texture noise pass on the final color (`col+=rfNoise(uv*100.0)*0.02-0.01;`). The Metal version omits this grain overlay.

### saturn-rings
- **[Consistency]** The GLSL version computes a ring shadow effect (`float shadow = 1.0 - smoothstep(-0.01, 0.01, ringUV.x) * smoothstep(...) * step(...) * step(...) * 0.5; ringCol *= shadow;`). The Metal version omits this shadow calculation entirely, so the rings will lack darkening where the planet shadow falls.

### ray-march-3d
- **[GLSL/Metal]** Potential NaN in `rmSoftShadow`: the expression `sqrt(h * h - y * y)` can produce NaN when `h * h < y * y` due to floating-point precision issues. Both versions lack a `max(0.0, h*h - y*y)` guard on the sqrt argument. This can cause dark artifacts or flickering in the shadow computation.

### sdf-morphing
- **[GLSL]** Unused variable: `morph` is declared on line 10 (`float morph=sin(t*0.5)*0.5+0.5;`) but never read.

### scratch-off-reveal
- **[Consistency]** The GLSL version uses `iMouseTime` for timing scratch progression, while the Metal version uses `fmod(iTime, cycleTime)`. The GLSL version cycles based on mouse-interaction time while Metal cycles based on absolute time, producing different animation timing behavior.

## Clean Shaders
- procedural-fire
- puddle-reflection
- pulsar-beam
- pulsing-grid
- radial-blur
- rain-on-glass
- rainbow-arc
- retro-terminal
- ridged-noise
- ripple-touch
- rotating-illusion
- rust-corrosion
- sand-simulation
- scratched-surface
- sdf-booleans
