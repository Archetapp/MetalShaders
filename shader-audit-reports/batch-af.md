# Shader Audit Report - Batch AF

## Summary
- Total shaders audited: 26
- Shaders with issues: 16
- Clean shaders: 10

## Issues Found

### heat-shimmer
- **[Metal]** Helper function `hsNoise` is not uniquely suffixed. The GLSL version also uses `hsNoise`, which is fine there, but in Metal the function name could collide with other shaders if compiled together. The name `hsNoise` is short enough that collision risk is real (e.g., holographic-sticker also uses `hsNoise` in GLSL, though Metal renames it). This is borderline but acceptable given the `hs` prefix.

### hexagonal-grid
- **[Consistency]** GLSL uses `mod(uv, r)` for the hex coordinate calculation, while Metal uses `fmod(uv, r)`. In GLSL `mod` always returns positive results (Euclidean modulo), but Metal's `fmod` is a truncated modulo that can return negative values for negative inputs. Since `uv` can be negative (the shader centers UV coordinates), this will produce different hex cell assignments for negative UV regions, causing a visual mismatch between the two versions.

### holographic-sticker
- **[Consistency]** The GLSL version declares and uses `uniform vec2 iMouse;` for mouse-driven tilt (hover interaction), with fallback to time-based animation. The Metal version omits the `iMouse` uniform entirely and only uses the time-based fallback animation. The mouse interactivity described in meta.json (`mouseMode: "hover"`) will not work in the Metal version.
- **[Consistency]** The GLSL version computes `embossNormal` using `dFdx`/`dFdy` (screen-space derivatives), while the Metal version manually approximates the derivatives with finite differences using a hardcoded epsilon of 0.002. These will produce visually different emboss normals, especially at different resolutions.
- **[Consistency]** The GLSL version has a "peel" effect (lines 74-75: `float peel = smoothstep(...)`) that is absent from the Metal version.

### hopf-fibration
- **[Consistency]** The GLSL version computes a variable `c` (line 16: `float c=cp*cos(psi+t*0.2)-sp*sin(psi+t*0.2);`) which is calculated but never used. The Metal version omits this variable entirely. While the Metal version is correct to omit it, the GLSL has dead code.
- **[GLSL]** Unused variable `c` on line 16 (the third stereographic projection coordinate is computed but never referenced).

### hypnotic-spiral
- **[GLSL]** Variables `scale` (line 20) and `bands2` (line 23) and `spiral2` (line 22) are computed but never used in the final output. They appear to be remnants of an incomplete infinite-zoom feature.
- **[Metal]** Same issue: `spiral2` (line 24) is computed but never used.

### ice-freeze-over
- **[Consistency]** The GLSL version uses `iMouseTime` uniform for freeze progress and `iMouse` for freeze origin position (interactive press behavior). The Metal version uses `iTime` instead of `iMouseTime` and computes freeze origin from `sin`/`cos` of time rather than mouse position. The interactive freeze-from-touch behavior described in meta.json (`mouseMode: "press"`) will not work in the Metal version.
- **[Consistency]** The GLSL version includes frost edge rendering (lines 46-47: `frostEdge`, `frostColor`) and ice highlight effects (line 43) that are absent from the Metal version.
- **[Consistency]** The GLSL version includes `fern` sub-branching detail on crystal arms (line 37: `float fern = sin(along * 30.0) * 0.01;`) that the Metal version omits (the Metal crystal computation is simpler).

### impressionist-brush
- **[Consistency]** The GLSL version uses `ibNoise` function (declared on lines 7-8), while the Metal version omits the noise function entirely. The GLSL has an extra noise-based grain line: `col+=vec3(ibHash(cell*17.0)-0.5)*0.04;` (line 26) that the Metal version skips. This is a minor visual difference in texture grain.

### ink-in-water
- **[GLSL]** Variable `dist` (line 23: `float dist=length(uv);`) is computed but never used.
- **[Metal]** Variable `dist` (line 21: `float dist=length(uv);`) is computed but never used.

### ink-watercolor
- **[Consistency]** The GLSL version computes `bleedAmount` (line 112) and `bleedColor` (line 113: `vec3 bleedColor = inkCol * 0.3;`) then uses `bleedColor` in the mix on line 119. The Metal version omits the `bleedAmount` variable but achieves the same result by inlining `inkCol * 0.3` directly on line 119. This is functionally equivalent.
- **[GLSL]** Variable `bleedAmount` (line 112) is computed but never used in the final output.

### ink-watercolor-spread
- **[Consistency]** The GLSL version uses `iMouseTime` and `iMouse` uniforms for interactive press behavior. The Metal version uses `iTime` instead and omits mouse input entirely. The interactive ink-drop-at-touch behavior described in meta.json (`mouseMode: "press"`) will not work in the Metal version.
- **[Consistency]** The GLSL version has `bleed`/`wetEdge` computation (lines 66-70) that applies a wet edge darkening effect. The Metal version omits this entirely.

### kaleidoscope
- **[GLSL]** Helper functions `hash`, `noise`, and `fbm` use generic non-prefixed names that could cause namespace collisions if multiple shaders are compiled together. The Metal version properly renames them to `hashKal`, `noiseKal`, `fbmKal`.

### koch-snowflake
- **[GLSL]** Variable `scale` (line 24 inside kochCurve: `float scale = 1.0 / 3.0;`) is declared but never used. It appears `s *= 3.0` and `p *= 3.0` are used directly instead.
- **[Metal]** Same issue: the `scale` variable removal was done (correctly omitted), so no dead code in Metal. The GLSL version still has the unused variable.

### langtons-ant
- **[GLSL]** Multiple declared-but-unused variables: `cellId` (line 15), `antX` (line 17), `antY` (line 17), `dir` (line 18), `pattern` initial assignment is overwritten (line 19), `cellState` (line 20), `diagonal` (line 21). These appear to be remnants of an intended Langton's ant simulation that was replaced with a visual approximation.
- **[Metal]** Variable `steps` (line 20) is computed but never used.

### laser-grid
- **[Consistency]** The GLSL version uses `iMouseTime` and `iMouse` uniforms for interactive beam positioning. The Metal version uses `iTime` instead and omits mouse input. The interactive laser-follows-touch behavior described in meta.json (`mouseMode: "press"`) will not work in the Metal version.
- **[Consistency]** The GLSL version computes beam intersection glow points (lines 46-55: a 4x4 nested loop computing intersection highlights). The Metal version omits the intersection glow effect entirely.
- **[Consistency]** The GLSL version includes per-beam fog scatter effects (line 32-33) that the Metal version omits.

### lava-flow
- **[Metal]** The `lfVoronoi` function takes a `time` parameter in Metal but uses `iTime` directly (as a global/closure) in GLSL. This is a correct architectural adaptation, not a bug.

### kandinsky
- **[Metal]** Potential division by zero: `float2 dir=ab/len;` (line 19) - if points `a` and `b` happen to coincide, `len` would be 0. The same issue exists in the GLSL version (line 26). In practice this is unlikely since the hash-based positions are fixed, but it is not guarded.
- **[GLSL]** Same potential division by zero: `vec2 dir=ab/len;` (line 26).

## Clean Shaders
- heat-shimmer
- herringbone
- holographic-foil
- houndstooth
- ice-crystals
- impossible-triangle
- interference-rings
- iridescent-film
- islamic-geometry
- julia-set
- kuwahara-filter
- lava-flow
