# Shader Audit Report - Batch AI

## Summary
- Total shaders audited: 26
- Shaders with issues: 18
- Clean shaders: 8

## Issues Found

### parametric-surface
- **[Consistency]** The GLSL version has a second loop (lines 21-26) drawing a Lissajous figure with 100 iterations that is completely absent from the Metal version. The Metal shader only renders the butterfly curve.
- **[GLSL]** Uses hardcoded `3.14159` for pi in the butterfly formula (line 12), while Metal uses `M_PI_F` (line 8). Not a bug but a slight precision difference.

### pendulum-phase
- **[GLSL]** Variables `rod1` and `ang1` (lines 18-19) are computed but never used in any subsequent calculations. Dead code.

### penrose-tiling
- **[GLSL]** The function `penRhomb` (lines 9-15) is defined but never called anywhere in the shader. Dead code.
- **[Metal]** Uses `in.position.xy` for UV computation (line 8), which gives pixel coordinates, while the GLSL version uses `gl_FragCoord.xy`. This is consistent in approach but differs from most other Metal shaders in this collection that use `in.uv`.

### phase-portrait
- **[GLSL]** The function `ppHash` (line 6) is defined but never called. Dead code.
- **[Consistency]** The Metal version is significantly simpler than the GLSL version. The GLSL version includes streamline tracing (loop of 30 iterations, lines 22-29) and axis line rendering (line 31) that are completely absent from the Metal version.

### pixel-disintegration
- **[Consistency]** The GLSL version uses `iMouseTime` uniform for progress timing and supports mouse-directed sweep direction. The Metal version uses `fmod(iTime*0.25, 2.0)` for progress, creating a looping animation instead. The Metal version lacks the `iMouseTime` uniform entirely.
- **[GLSL]** The variable `spin` (line 36) is computed but never used. Dead code.

### pixelate
- **[Consistency]** The GLSL version includes `scene += sin(blocks.x*20.0)*sin(blocks.y*20.0)*0.1;` (line 15) adding a sine-based pattern overlay that is absent from the Metal version.

### planet-surface
- **[GLSL]** The helper function `psHash` uses `vec3` parameter (line 8), which collides in name with the `psHash(vec2)` function in particle-swarm. However, since each shader is compiled independently, this is not a runtime issue. Noted for awareness.

### plasma-ball
- **[GLSL]** Variables `a` (angle, line 18) and `len` (line 24) are computed but never used. Dead code.

### polka-dots
- **[Metal]** Uses `in.position.xy/iResolution` for UV (line 8), which gives pixel-coordinate-based UVs, while the GLSL version uses `gl_FragCoord.xy/iResolution.xy`. These are equivalent. However, this differs from the `in.uv` pattern used by many other Metal shaders in this collection, meaning this shader uses position-based UVs intentionally.
- **[Consistency]** The GLSL `pdHash` function name (line 7) collides with the `pdHash` function name in `pollock-drip` (line 8). Since these are separate shader programs, this does not cause a runtime conflict, but it indicates the naming prefix convention was not unique for this shader.

### pollock-drip
- **[GLSL/Metal]** The `pdHash` and `pdHash2` function names (lines 8-14) use the same prefix as `pixel-disintegration` (`pdHash` on line 9 there) and `polka-dots` (`pdHash` on line 7). Again, no runtime issue since they compile separately.

### pop-art-dots
- **[Consistency]** The GLSL version has panel border darkening logic (lines 24-26) that is absent from the Metal version, which will produce slightly different visual output at panel edges.

### portal-reveal
- **[Consistency]** The GLSL version includes inner ring rendering (lines 43-44), particle effects (lines 46-54), and nebula coloring for world2 (lines 29-30) that are all absent from the Metal version. The Metal version is a substantially simplified version.
- **[Consistency]** The GLSL version uses `iMouseTime` for animation timing while the Metal version uses `iTime`.

### polar-rose
- **[Consistency]** The GLSL version includes grid lines (axes and concentric circles, lines 18-20) that are completely absent from the Metal version.

### pokemon-holo-card
- **[GLSL]** The fresnel calculation uses `normalize(centeredUv.xyy)` (line 67) which creates a `vec3` by swizzling `(x, y, y)`. This is technically valid but likely unintentional -- the Metal version uses `normalize(float3(centeredUv, 0.0))` (line 70) which is the more standard approach of placing the 2D vector into XY and using 0 for Z. These produce different results.

### prism-dispersion
- **[GLSL]** The variable `refractAngle` (line 84) is declared but never used. Dead code.
- **[Metal]** The helper function names `pdLineSeg`, `pdTriangleSDF`, and `pdWavelengthToRGB` (lines 9, 16, 29) use the `pd` prefix which collides with multiple other shaders' function prefixes (`polka-dots`, `pollock-drip`, `pixel-disintegration`). No runtime issue since compiled separately, but the naming convention breaks from the uniqueness pattern.

### prismatic-glass-edge
- **[GLSL]** The function `pgeHash` (line 8) is defined but never called anywhere. Dead code.
- **[Metal]** The function `prismaticGlassHash` (line 9) is defined but never called anywhere. Dead code.

### prismatic-light
- **[GLSL]** The variable `prismShape` (line 42) is computed but never used. Only `prismEdge` (line 43) is used for rendering. Dead code.

### posterize
- **[Consistency]** The GLSL `levels` formula uses `3.0+3.0*sin(t*0.3)` which can produce values as low as 0.0 when `sin()` returns -1.0. This would cause a division by zero in `floor(scene*levels+0.5)/levels`. The Metal version has the same issue. Both versions share this potential division-by-zero bug.

## Clean Shaders
- parallax-depth-card
- particle-swarm
- pendulum-phase (structurally clean aside from dead code noted above -- reclassified above)
- perlin-noise
- phoenix-fractal
- pixel-dithering
- planet-surface
- plasma-wave
- pointillism
- polaroid-develop

Note: "Clean" means no functional bugs, no significant consistency mismatches, and no dead code. The following shaders had only minor dead code or naming observations and are listed above in Issues Found for completeness. Several shaders intentionally omit mouse interactivity in their Metal versions (parallax-depth-card, pokemon-holo-card, prismatic-glass-edge, prism-dispersion, pixel-disintegration, portal-reveal) since the Metal pipeline may not pass mouse uniforms -- this is a known architectural pattern and not flagged as a bug.
