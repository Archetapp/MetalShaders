# Shader Audit Report - Batch AB

## Summary
- Total shaders audited: 26
- Shaders with issues: 16
- Clean shaders: 10

## Issues Found

### carbon-fiber
- **[Consistency]** GLSL uses `gl_FragCoord.xy / iResolution` for UV (0-1 screen space), while Metal uses `in.uv` which is also 0-1 but sourced differently. This is acceptable as a standard GLSL-to-Metal translation pattern. However, GLSL computes UV from fragment coords (non-aspect-corrected), so both should produce the same result. No real bug here upon closer inspection.

### cassette-tape
- **[Consistency]** Metal version omits the window and windowBorder rendering that exists in the GLSL version (GLSL lines 56-60). The Metal shader skips the transparent window overlay and its border entirely.

### caustic-light-patterns
- **[Consistency]** GLSL version has mouse interactivity (iMouse, iMouseTime uniforms, caustic center follows mouse), while Metal version has no mouse support and uses iTime instead of iMouseTime. The shimmer effect present in GLSL (line 49) is also absent in Metal. This is a significant feature gap -- the Metal version will look and behave differently, especially since the GLSL version is specifically flagged with `mouseMode: "press"` in meta.json.

### caustics
- **[Metal]** Helper function `csNoise` is not suffixed with a unique name. The GLSL and Metal versions both use `csNoise` and `csCaustic`. While the GLSL function names are fine, the Metal helper functions risk namespace collisions if compiled alongside other shaders that also define `csNoise` (e.g., the `cloud-shadows` shader also defines `csNoise` in GLSL, though its Metal version uses `csNoise2`). The naming is inconsistent across the codebase.

### cell-division
- **[GLSL]** Declares `cellSize2` on line 24 which is identical to `cellSize1` and is never used -- `d2` on line 30 also uses `cellSize1` in the Metal version (line 31), confirming `cellSize2` is dead code in GLSL.

### cloth-simulation
- **[Consistency]** GLSL version has full mouse interactivity (iMouse, iMouseDown, iMouseTime uniforms; pinch point follows mouse position when pressed). Metal version has no mouse support -- `csHeight` takes only 2 parameters (no `pinch1Pos`) and hardcodes pinch1 position to `float2(-0.8, -0.8)`. This is a significant feature gap given the meta.json specifies `mouseMode: "press"`.

### cloud-shadows
- **[Consistency]** GLSL uses `gl_FragCoord.xy/iResolution.xy` for UV, while Metal uses `in.position.xy/iResolution`. The GLSL version divides by `iResolution.xy` (a vec2) while Metal divides by `iResolution` (also a float2), so these are equivalent. However, this is a different UV space than what some other shaders use. No actual bug.
- **[Consistency]** Metal version is missing the edge highlight effect on cracks (GLSL line 33: `col+=vec3(0.02)*smoothstep(...)`) that appears in the GLSL cracked-earth shader. For cloud-shadows specifically, this is not applicable -- disregard.

### color-afterimage
- **[GLSL]** Variable `borderPulse` is declared on line 43 but never used (dead code).

### color-grading
- **[Consistency]** GLSL computes luma before contrast adjustment (line 15: `float luma=dot(scene,...)`), then applies contrast (line 17), then uses that pre-contrast luma for saturation mixing (line 19). Metal version also computes luma before contrast (line 9) but then applies contrast and uses the pre-contrast luma for saturation (line 11). These are equivalent. No actual bug here.

### complex-mapping
- **[GLSL]** Potential division by zero in `cmDiv` when `b` is `(0,0)` -- `dot(b,b)` would be 0. This happens when mode is between 1.0 and 2.0 and `z` (which equals `uv`) is at the origin (0,0). This would produce `inf` or `NaN` at the center pixel.
- **[Metal]** Same potential division by zero in `cmDiv`.
- **[Consistency]** GLSL version includes grid lines overlay (line 24: `float grid=smoothstep(...)`) that is absent from the Metal version.

### confetti-burst
- **[GLSL]** Helper function named `cbHash` collides with the same name used in `circuit-board` shader. If these are ever compiled into the same Metal library, there will be a linker error. The GLSL versions are separate compilation units so no issue there, but naming consistency is a concern.
- **[Metal]** Same `cbHash` function name collision risk with `circuit-board` Metal shader.
- **[Consistency]** GLSL gravity is `0.5` (line 15: `float gravity=0.5`), while Metal gravity is `0.5*0.5 = 0.25` (line 11: `float2(0,-0.5*burstTime*burstTime*0.5)`). The GLSL computes `vec2(0, -gravity*burstTime*burstTime*0.5)` which is `vec2(0, -0.5*bt*bt*0.5)` = `vec2(0, -0.25*bt*bt)`. Metal computes `float2(0, -0.5*bt*bt*0.5)` = `float2(0, -0.25*bt*bt)`. Actually these are equivalent. Disregard.
- **[Consistency]** GLSL flutter factor is `sin(...)*0.5` (line 23) applied as `w*(1.0+flutter*0.3)`, while Metal uses `sin(...)*0.15` directly (line 16: `w*(1.0+sin(burstTime*8.0+fi)*0.15)`). GLSL: `0.5*0.3 = 0.15`. These are equivalent.

### condensation
- **[Consistency]** GLSL version has mouse interactivity (iMouse uniform; tilt effects based on mouse position for behind-glass refraction offset). Metal version has no mouse support and omits the tilt offsets. The GLSL also includes a micro-condensation noise layer (line 64) absent from Metal. Given meta.json specifies `mouseMode: "hover"`, this is a significant feature gap.

### circuit-board
- **[Consistency]** GLSL version includes corner trace rendering (lines 21-25: `traceCorner` calculation for cells with `id > 0.7`) that is entirely absent from the Metal version. The Metal version only has horizontal and vertical traces.

### chromatic-aberration
- **[Consistency]** GLSL includes a radial lens-like brightness modulation (line 21: `col*=0.95+0.05*cos(dist*20.0)`) that is absent from the Metal version.

### cracked-earth
- **[Consistency]** GLSL version includes an edge highlight effect on crack borders (line 33: `col+=vec3(0.02)*smoothstep(0.03,0.06,crack)*smoothstep(0.1,0.06,crack)`) that is absent from the Metal version.

### comet-tail
- **[GLSL]** Potential division by zero: `tailWidth = 0.02 + along * 0.15` could become zero or negative when `along` is negative (specifically when `along < -0.1333`). This is used as a divisor in `exp(-perp / tailWidth)`. When `tailWidth` is negative, this flips the sign in the exponent, causing unexpected bright artifacts far from the tail. However, `smoothstep(0.0, 0.05, along)` would be 0 for negative `along`, so it's multiplied away. Not a real bug in practice.
- **[Metal]** Same potential issue exists but is similarly guarded by the smoothstep.

## Clean Shaders
- candy-swirl
- carbon-fiber
- celtic-knot
- ceramic-glaze
- chain-mail
- channel-mixer
- chevron-pulse
- color-grading
- concentric-rings
- coral-reef
- crt-monitor
- cubist-facets
