# Shader Audit Report - Batch AC

## Summary
- Total shaders audited: 26
- Shaders with issues: 18
- Clean shaders: 8

## Issues Found

### delaunay-lines
- **[Consistency]** GLSL uses `in.uv` via `gl_FragCoord.xy/iResolution.xy` for normalized UV, but Metal uses `in.position.xy/iResolution` (pixel coordinates divided by resolution) instead of `in.uv`. This will produce the same result only if position maps to pixel coords, but it is inconsistent with the pattern used in the GLSL version and most other shaders in this batch.
- **[Consistency]** GLSL tracks `minEdge` variable and applies gamma correction `pow(col, vec3(0.9))`. Metal also does `pow(col, float3(0.9))` but does not track `minEdge`. The `minEdge` variable in GLSL is unused after computation (dead code), so this is a GLSL dead code issue rather than a functional mismatch.
- **[GLSL]** `minEdge` is computed but never used for any output. Dead code.

### dew-drops
- **[Consistency]** GLSL version includes mouse-based tilt interaction (tiltX, tiltY affecting refraction offset and highlight offset) and leaf texture detail (`sin(centered.x * 40.0) * sin(centered.y * 30.0) * 0.03`). Metal version omits all mouse interaction, leaf texture noise, refraction offset, and rim lighting. The Metal version is a significantly simplified version of the GLSL shader.
- **[Consistency]** GLSL has `leafTexture` computation added to `leafColor`; Metal omits this entirely.
- **[Consistency]** GLSL computes `rim` and adds it to `dropColor`; Metal omits rim lighting on drops.

### diamond-facets
- **[GLSL]** Variable `girdle` is computed on line 28 but never used. Dead code.

### diamond-grid-holo
- **[Consistency]** GLSL version includes full mouse interaction (tiltX, tiltY, viewDir, lightDir all affected by mouse position). Metal version hardcodes the non-interactive fallback path only (tiltX/tiltY from sin/cos of iTime). Mouse interaction is entirely absent from Metal.

### disco-ball-reflections
- **[Consistency]** GLSL version has significantly more detail than Metal: GLSL includes facet grid pattern (`facetGrid`), ball highlight, center glow, and uses `facetRing` based on `acos`. Metal version simplifies the ball rendering substantially -- it uses `bd*20.0` instead of the `acos`-based ring approach, omits `facetGrid`, omits `ballHighlight`, and omits `centerGlow`. The visual output will differ noticeably.
- **[Consistency]** GLSL version includes full mouse interaction for ball rotation; Metal hardcodes time-based rotation only.

### displacement-warp
- **[Consistency]** GLSL uses `dFdx`/`dFdy` for normal computation (screen-space derivatives), while Metal computes finite differences manually using epsilon offsets. These are algorithmically different approaches that will produce slightly different normal maps, though the intent is the same.
- **[Consistency]** GLSL version includes mouse interaction (press mode with iMouseTime); Metal hardcodes the poke point animation using `iTime`.

### dissolve-embers
- **[Meta]** Slug is `dissolve-embers` but the title is "Dissolve to Embers". This is the same title as the `dissolve-to-embers` shader. Having two shaders with identical titles is confusing.

### dissolve-to-embers
- **[Consistency]** GLSL version includes mouse interaction (press mode with iMouseTime, iMouse), char edge rendering, and 15 ember particles. Metal version omits all mouse interaction, omits char edge rendering, omits ember particles entirely, and uses a different burn origin calculation. The Metal version is significantly stripped down.
- **[Consistency]** Metal version uses `dissolveEmberNoise` and `dissolveEmberFbm` as function names, which collide with the helper function names in the `dissolve-embers` Metal shader. If both shaders are compiled into the same Metal library, this will cause a compilation error due to duplicate function symbols.

### dynamic-island
- **[Meta]** Slug is `dynamic-island` but the title is "Dynamic Island Morph". This conflicts with the `dynamic-island-morph` shader which has the exact same title "Dynamic Island Morph". Two different shaders should not share the same title.

### dynamic-island-morph
- **[Consistency]** GLSL version includes mouse interaction (press mode with iMouseDown, iMouse, iMouseTime), green indicator dot, camera lens detail, edge highlight, and shadow. Metal version omits all mouse interaction, omits indicator/camera details, omits edge highlight, and omits shadow. Significantly simplified.

### deep-ocean-gradient
- **[Consistency]** GLSL uses `3.14159` as pi constant in the caustic function, while Metal uses `M_PI_F`. These are functionally equivalent (M_PI_F is more precise) but produce very slightly different results due to the precision difference.

### dla-growth
- **[Consistency]** Metal uses `in.position.xy` for UV computation while GLSL uses `gl_FragCoord.xy`. This is consistent in intent (both are pixel coordinates), but differs from the `in.uv` pattern used by most Metal shaders in this batch.

### dna-helix
- **[Consistency]** Metal uses `in.position.xy` for UV computation rather than `in.uv`. Same pattern inconsistency as other shaders.

### dot-matrix
- **[Consistency]** Metal uses `in.position.xy/iResolution` instead of `in.uv`. Pattern inconsistency with the rest of the codebase. Both should produce pixel-coordinate-based UV, but the convention differs.

### dragon-curve
- **[Consistency]** Metal uses `in.position.xy` for UV computation rather than `in.uv`.

### dripping-paint
- **[Consistency]** Metal uses `in.position.xy/iResolution` instead of `in.uv`.

### dripping-water
- **[Consistency]** GLSL version includes mouse interaction (hover mode with tilt and gravity adjustments), background gradient, wet floor effect, streak rendering during drop formation, and splash rings. Metal version omits all mouse interaction, omits background gradient variation, omits wet floor, omits splash effects. Significantly simplified.

### droste-effect
- **[Consistency]** Metal uses `in.position.xy` for UV computation. Same pattern inconsistency.
- **[GLSL]** `border` variable declared on line 15 (`float border = 0.05;`) but never used. Dead code.

## Clean Shaders
- curl-noise
- cycloid-family
- de-stijl
- dissolve-transition
- duotone-wash
- eclipse
- edge-detection
- electric-arc
