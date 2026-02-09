# Shader Audit Report - Batch AL

## Summary
- Total shaders audited: 26
- Shaders with issues: 14
- Clean shaders: 12

## Issues Found

### stained-glass
- **[Consistency]** Light calculation differs between GLSL and Metal. GLSL uses `lightAngle = t*0.3` and computes `sin(uv.y*3.14159+lightAngle*0.7)` (second factor is `t*0.3*0.7 = t*0.21`). Metal uses `sin(uv.y*M_PI_F+t*0.21)`, which matches the final value but the intermediate expression path differs because the GLSL version uses the approximate pi `3.14159` while Metal uses the exact `M_PI_F`.
- **[GLSL]** Potential out-of-bounds array access: `int idx=int(cellId*6.0);` where `cellId` is the result of `sgHash(closestCell)` returning [0,1). When `cellId` is very close to 1.0, `cellId*6.0` approaches 6.0, and `int(5.999...)` = 5 which is safe. However if floating point imprecision causes `cellId` to equal exactly 1.0, `idx` would be 6, which is out of bounds for a 6-element array. This same issue exists in the Metal version.

### stained-glass-light
- **[Consistency]** Metal version is missing the `lightBeam` effect present in GLSL (line 38 of GLSL: `float lightBeam = pow(...)` and `col *= 1.0 + lightBeam * 0.5`). Metal version also lacks the `glow` effect (GLSL lines 44-45: `float glow = pow(1.0 - minDist * 0.5, 3.0) * lightIntensity * 0.2; col += glow * glassColor;`).
- **[Consistency]** Metal version does not support mouse/hover interaction at all - it always uses the time-based fallback animation. The GLSL version has full mouse support with `lightDir`, `lightOrigin`, and `lightBeam` all responding to `iMouse`.

### supernova
- **[GLSL]** Potential division by zero: `shellWidth = 0.03 + t * 0.02` where `t = mod(iTime * 0.3, 4.0)`. When `t` is exactly 0.0 at cycle start, `shellWidth = 0.03`, so division in `(r - shellR) / shellWidth` is safe. No actual issue here upon closer inspection.
- **[Consistency]** GLSL uses `6.2832` for the debris angle full circle constant, while Metal uses `2.0 * M_PI_F`. Functionally equivalent but worth noting.

### suprematism
- **[Consistency]** Metal version is missing the cross/plus overlay present in the GLSL version (GLSL lines 24-26: `float cross1=...`, `float cross2=...`, `col=mix(col,vec3(0.1),max(cross1,cross2)*0.5);`). The Metal version omits this entirely.
- **[Consistency]** GLSL uses `3.14` for the angle constant while Metal uses `M_PI_F`. Minor numerical difference.

### swirl-vortex-portal
- **[Consistency]** GLSL uses `iMouseTime` for animation timing throughout (spiral animation, portal inside color, etc.), while Metal uses `iTime`. Since this is an interactive shader with `mouseMode: "press"`, the `iMouseTime` uniform drives the effect from user interaction. The Metal fallback using `iTime` will produce different animation behavior.

### synthwave-sunset
- **[GLSL]** Potential division by zero: `float perspZ = 0.5 / depth;` where `depth = (horizon - uv.y)`. This is guarded by the `if (uv.y < horizon)` check, and `horizon = -0.05`, so `depth` is always positive inside the branch. However, at exactly `uv.y == horizon`, `depth` would be 0, but smoothstep/conditional prevents this. No real issue.

### touch-shockwave
- **[Consistency]** GLSL uses `iMouseTime` for animation timing while Metal uses `iTime`. The GLSL version drives the shockwave cycles from `iMouseTime * 0.8` while Metal uses `iTime * 0.8`, producing different timing behavior for the interactive press mode.

### touch-water-ripple
- **[Consistency]** GLSL uses `iMouseTime` for all animation timing (ripple births, touch point positions), while Metal uses `iTime`. This creates fundamentally different behavior: in GLSL, ripples are timed relative to user interaction; in Metal, they use absolute time.
- **[Consistency]** GLSL `touchPoints[0]` defaults to `mouseUV` when input is active or `vec2(0.5, 0.5)` when not. Metal `touchPoints[0]` uses a different animated position: `float2(0.5 + 0.3 * cos(iTime * 0.4), 0.5 + 0.3 * sin(iTime * 0.5))`. The first touch point has entirely different behavior.

### tree-growth
- **[GLSL]** Unused variable: `treeHash` function is defined on line 8 but never called anywhere in the shader.
- **[Metal]** Unused function: `treeGrowthHash` is defined on line 9 but never called.
- **[GLSL]** Unused variable: `tier` is computed on line 45 (`float tier = mod(fj, 2.0);`) but never used. Metal version correctly omits this.

### truchet-tiles
- **[GLSL]** Unused variables: `nextRnd` and `nextFlip` are computed on lines 26 and 29 but never used. These appear to be leftovers from a planned transition animation.

### sunset-sky
- **[Metal]** Uses `in.position.xy/iResolution` for UV calculation instead of `in.uv`. When the Metal rendering pipeline provides normalized UVs via `in.uv`, this position-based approach can produce different coordinate spaces. This is a pattern difference from the GLSL `gl_FragCoord.xy/iResolution.xy` which is correct since `gl_FragCoord` is in pixel coordinates. The Metal `in.position.xy` should be equivalent to pixel coordinates via `[[position]]`, so this is actually consistent.

### tartan-plaid
- **[Metal]** Uses `in.position.xy/iResolution` for UV instead of `in.uv`, same pattern as other shaders using pixel-space coordinates. Consistent with GLSL.

### tidal-wave
- **[Consistency]** Metal version does not support mouse/hover interaction. GLSL has mouse-driven wave shift (`waveShiftX`), sun direction shift (`sunShiftX`, `sunShiftY`), and applies them to `worldPos` and `sunDir`. Metal version hardcodes `sunDir` to `float3(0.3, 0.6, -0.5)` without any mouse influence and omits `waveShiftX`.

### stained-glass (array bounds - additional note)
- **[Metal]** Same potential out-of-bounds array access issue as GLSL: `int idx=int(cellId*6.0);` with `glassColors[idx]`.

## Clean Shaders
- starfield
- stereogram-dots
- strange-attractor
- thermal-heatmap
- threshold
- tiled-mirrors
- tilt-sparkle-grid
- tornado-vortex
- torus-knot
- tricorn-fractal
- tron-gridscape
- truchet-triangles
