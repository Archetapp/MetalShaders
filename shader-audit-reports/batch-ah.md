# Shader Audit Report - Batch AH

## Summary
- Total shaders audited: 26
- Shaders with issues: 14
- Clean shaders: 12

## Issues Found

### mondrian
- **[Consistency]** GLSL computes the cell grid with a hash-varied size `floor(uv.x*(4.0+2.0*mnHash(vec2(seed,0.0))))/6.0` (line 11-12), making the grid dimensions change over time. Metal uses a fixed `floor(uv.x*6.0)/6.0` (line 8). The GLSL produces a different, time-varying grid layout that the Metal version does not replicate.

### moon-phases
- **[GLSL/Metal]** The glow halo calculation (GLSL lines 61-63, Metal lines 59-61) is placed inside the `if(moonMask>0.01)` block. Since `glow` is based on `moonDist` relative to `moonR*1.3`, the glow is intended to be visible outside the moon disc where `moonMask` is 0, but it will never render there because the block is skipped.

### morphing-blob-drag
- **[GLSL]** Potential division by zero: `0.12 / length(uv - dragPos)` (line 20), `blobSize / dist` (line 32), and `(0.04 - fi * 0.008) / length(uv - trailPos)` (line 42) all divide by `length()` with no epsilon guard. If `uv` exactly equals any blob position, this produces infinity.
- **[Metal]** Same division-by-zero risk at lines 22, 34, and 44.
- **[Consistency]** GLSL uses `iMouseTime` for all animation timing while Metal uses `iTime`. These are different uniforms -- `iMouseTime` tracks time since last mouse interaction while `iTime` is absolute time. The animations will diverge after any mouse interaction.

### morphing-blobs
- **[Metal]** Helper function `blobField` at line 9 uses a generic, non-prefixed name. While no other shader in this batch defines `blobField`, this deviates from the project convention of prefixing helpers to avoid Metal namespace collisions.

### navier-stokes-fluid
- **[Consistency]** The GLSL version includes turbulence noise (`turbulence` variable, line 53), vorticity-based brightness modulation (`col *= 0.8 + 0.2 * vorticity`, line 61), and water noise fbm contribution (`oawFbm`-style via `nsNoise`). The Metal version omits all three, producing a noticeably less detailed visual.
- **[Consistency]** The GLSL version includes mouse-driven dye injection (lines 34-44, using `iMouseDown` and `iMouse`). The Metal version has no mouse interaction at all, despite meta.json specifying `mouseMode: "press"`.

### night-sky
- **[GLSL]** Helper functions `nsHash` and `nsNoise` (lines 7-11) use the same names as the identically-named functions in `navier-stokes-fluid/shader.frag`. While WebGL compiles shaders as separate programs (no actual collision), this violates the project naming convention and could cause confusion.
- **[Metal]** Same issue: `nsHash` and `nsNoise` (lines 5-9) are non-unique names in the Metal global namespace. If night-sky and another shader with the same function names are compiled into the same Metal library, it will cause a linker error.

### ocean-surface
- **[GLSL]** Helper functions `hash` and `noise` (lines 9, 13) use generic non-prefixed names, unlike all other shaders in this batch which prefix their helpers. Multiple other shaders across the project also define `hash` and `noise` with the same signatures.

### oil-slick
- **[Meta]** The title is `Oil Slick Iridescence`, which is identical to the title of the `oil-slick-iridescence` shader. Two shaders should not share the same title.
- **[GLSL/Metal]** Helper functions `osHash`, `osNoise`, and `osFbm` share names with those in `oil-slick-material` (which also defines `osNoise`). In Metal, both shaders define `osNoise` at global scope, which would cause a linker error if compiled into the same Metal library.

### oil-slick-iridescence
- **[Consistency]** The GLSL version includes a specular highlight calculation (`pow(max(0.0, dot(normalize(vec3(uv, 1.0)), normalize(vec3(tiltX, tiltY, 1.0)))), 16.0)` at line 37) and water ripple effect (line 29) that are absent from the Metal version.

### oil-slick-material
- **[Metal]** Helper function `osNoise` (line 8) uses the same name as the `osNoise` function in `oil-slick/shader.metal` (line 13). This would cause a Metal linker collision if both shaders are compiled into the same library.

### newtons-fractal
- **[GLSL/Metal]** Potential division by zero in `newtonCdiv`: `float d = dot(b,b)` is 0 when `b` (the derivative `fp = 3.0 * z2`) is the zero vector, which occurs when `z = (0,0)`. This happens on the first iteration since `z` is initialized to `vec2(0.0)`. The division `return .../d` produces infinity/NaN. In practice, GPU hardware often handles this gracefully (producing a large finite value), but it is technically undefined behavior.

### paint-peel
- **[Consistency]** GLSL uses `iMouseTime` for peel progress (`clamp(iMouseTime * 0.3, 0.0, 1.0)`, line 23) producing a linear, one-directional peel that saturates at 1.0. Metal uses `sin(iTime*0.3)*0.5+0.5` (line 14) producing a continuously oscillating back-and-forth peel. These are fundamentally different animation behaviors.
- **[Consistency]** GLSL includes an edge highlight effect (lines 51-52) absent from the Metal version.
- **[Consistency]** GLSL adds noise texture to the paint color (line 34) which the Metal version omits.

### outrun-road
- **[GLSL/Metal]** Near the horizon where `uv.y` approaches `horizonY`, the depth calculation `depth = -0.3 / (uv.y - horizonY + 0.001)` produces very large values (line 37 GLSL, line 40 Metal). Subsequent calculations `roadWidth = 0.3 / depth` and `0.005 / depth` can then produce near-zero or underflowing results, and `edgeLine = smoothstep(...) / depth * 2.0` (line 47 GLSL, line 49 Metal) divides by the potentially very large `depth` value which is safe, but the general pattern is fragile near the horizon.

### morphing-blob-drag (additional note)
- **[Metal]** At line 43, the trail normalization `normalize(float2(cos(iTime * 0.7), -sin(iTime * 0.5)))` cannot produce a zero vector (since sin and cos are never both zero simultaneously for real inputs), so this is safe.

## Clean Shaders
- moire-lines
- multibrot
- mushroom-spores
- nebula
- neon-glow-wash
- neon-light-painting
- neon-sign
- neural-network
- nuclear-glow
- op-art-waves
- page-curl
- motion-blur
