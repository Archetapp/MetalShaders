# Shader Audit Report - Batch AK

## Summary
- Total shaders audited: 26
- Shaders with issues: 15
- Clean shaders: 11

## Issues Found

### sdf-outline
- **[Consistency]** Metal version is missing the animated growing circle outline present in GLSL (GLSL lines 27-30 compute `anim`, `grow`, and `animOutline` variables and blend an animated pulsing ring). This entire animated feature is absent from the Metal shader.

### sdf-primitives
- **[GLSL]** `sdHexagon` function (lines 49-55) and `smin` function (lines 57-60) are declared but never called. Dead code.

### seashell-spiral
- **[Metal]** Uses `in.position.xy` for coordinate calculation (line 12) instead of `in.uv`. While `in.position.xy` provides pixel coordinates matching GLSL's `gl_FragCoord.xy`, most other Metal shaders in this project use `in.uv` (0-1 normalized). This will produce correct results only if the rendering pipeline maps position to screen pixels, but it is inconsistent with the project convention.

### sierpinski-triangle
- **[GLSL]** Variable `angle` (line 10, inside `sierpinskiDE`) is computed from `iTime` but never used. Dead code.
- **[Metal]** Uses `in.position.xy` for coordinate calculation (line 26) instead of `in.uv`.

### shockwave-distort
- **[Consistency]** GLSL adds a fine sine-based texture detail to both the base scene and distorted scene (`0.05*sin(uv.x*20.0)*sin(uv.y*20.0)` on lines 10 and 23). Metal omits this detail texture entirely, resulting in a flatter checker pattern.

### smoke-vapor
- **[Consistency]** Metal version is missing the ambient smoke layer present in GLSL (lines 57-58: `ambientSmoke` via `svFbm` added to final color). Metal omits this background atmospheric effect.

### snowfall
- **[Consistency]** Metal `snowfallLayer` function lacks the `windBias` parameter present in GLSL's `snowLayer`. The GLSL version derives `windBias` from mouse hover position and uses it to shift snow drift direction. Metal ignores this entirely, so the mouse-interactive wind effect is absent.

### snowglobe
- **[Consistency]** Metal version is missing all mouse-driven shake interaction. GLSL computes `shakeX`/`shakeY` from `iMouse` uniforms (lines 47-48) and applies them to snow particle displacement (lines 115-117). Metal omits the mouse uniforms and all shake-related logic.

### soap-film
- **[Consistency]** Swirl calculation differs between GLSL and Metal. GLSL computes `sin(swirl * 3.0) * 0.1` where the 3.0 is the frequency multiplier inside `sin()`. Metal computes `sin(atan2(...) + t*0.2) * 3.0 * 0.1`, where the 3.0 multiplies the result of `sin()` rather than the argument. GLSL produces a 3-lobed swirl pattern; Metal produces a single-lobed pattern scaled to 0.3 amplitude instead of 0.1.

### solar-flare
- **[Metal]** Uses `in.position.xy` for coordinate calculation (line 28) instead of `in.uv`.

### sound-rings
- **[Consistency]** Metal version is missing the particle ring effect present in GLSL (lines 45-49: floating particles orbiting the outer edge, computed via `particleAngle`, `particleRing`, `particleDist`). Metal omits this entire visual feature.

### sparks-embers
- **[Metal]** Uses `in.position.xy` for coordinate calculation (line 8) instead of `in.uv`.

### spider-web
- **[Metal]** Uses `in.position.xy` for coordinate calculation (line 14) instead of `in.uv`.

### spirograph
- **[GLSL]** Variable `tMod` is declared (line 41: `float tMod = mod(t * 0.3, 6.28318 * 3.0);`) but never used. Dead code.

### spring-mesh-deform
- **[Consistency]** Metal version is missing the spring connection lines (horizontal and vertical) present in GLSL (lines 36-39: `springH`/`springV` calculations and `springColor` blending). Metal renders only the nodes and glow, not the connecting grid lines.

## Clean Shaders
- sdf-noise-displace
- sdf-repetition
- sdf-scene
- sdf-shadow
- sdf-smooth-blend
- sdf-text
- sharpen
- silk-flow
- simplex-noise
- sine-wave-sum
- spring-mesh
