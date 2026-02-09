# Shader Audit Report - Batch AG

## Summary
- Total shaders audited: 26
- Shaders with issues: 18
- Clean shaders: 8

## Issues Found

### lava-lamp
- **[Metal]** Helper function `lavaBlob` is not suffixed/namespaced. If another shader in the same Metal compilation unit also defines a `lavaBlob` function, there will be a name collision.

### lava-magma
- **[Consistency]** GLSL uses `gl_FragCoord.xy / iResolution.xy` for UV coordinates while Metal uses `in.uv`. These produce the same [0,1] range, but if the Metal vertex shader provides `in.uv` as a normalized coordinate this is consistent. However, the GLSL version divides by `iResolution.xy` (non-uniform scaling) while Metal just uses `in.uv` directly. This is functionally equivalent assuming the vertex shader provides proper [0,1] UVs.
- **[Metal]** Helper functions `magmaHash`, `magmaNoise`, `magmaFbm`, `magmaPalette` lack unique suffixes. Multiple shaders in this batch use similar patterns. If `magmaHash` collides with another file in the same Metal build, it will fail. (Borderline -- the "magma" prefix provides some uniqueness.)

### leaf-veins
- **[GLSL]** Unused variable `side` declared on line 30 (`float side = 1.0;`) but never used.

### leather-texture
- **[Consistency]** GLSL uses `gl_FragCoord.xy / iResolution.xy` for UV while Metal uses `in.uv`. Functionally equivalent but different UV computation approaches.
- **[Metal]** `leatherHash` is called with `i + n + 0.5` in `leatherVoronoi` where `0.5` is a scalar added to a `float2`. In Metal, adding a scalar to a vector is valid (broadcasts), so this is correct.

### lens-flare
- **[Consistency]** GLSL version includes mouse interactivity (`uniform vec2 iMouse`), iris ring effect (line 47-48), and chromatic aberration (lines 50-52). The Metal version omits all of these: no mouse support, no iris ring, no chromatic aberration. The Metal version is a significantly simplified version of the GLSL shader.
- **[Metal]** Missing the specular dot effects, edge border, and several post-processing details present in the GLSL version.

### lenticular-card
- **[Metal]** `lenticularCardHash` function is defined but never called in the Metal shader. Dead code.
- **[Consistency]** GLSL version has mouse interactivity (`uniform vec2 iMouse`) for tilt control. Metal version only uses time-based animation with no mouse support. This is expected for non-WebGL platforms but worth noting.

### light-sweep-glare
- **[Consistency]** GLSL version includes: surface micro-texture lines (line 17 `sin(centered.x * 100.0) * 0.01`), specular dot pattern (line 36), and edge border vignette (lines 39-41). Metal version is missing all three of these features.
- **[Metal]** Missing the brush-texture surface detail, specular dot grid, and edge masking present in the GLSL version.

### lightning
- **[GLSL]** The `hash` and `noise` function names are not namespaced/prefixed. These are extremely common names that will collide if multiple shaders are compiled together.
- **[Metal]** The `bolt` function name is not suffixed. It could collide with another Metal shader defining a `bolt` function in the same compilation unit.

### liquid-metal-mercury
- **[Consistency]** GLSL version has mouse interactivity (`uniform vec2 iMouse`, `uniform float iMouseDown`, `uniform float iMouseTime`) allowing the blob to follow mouse/touch input. Metal version has no interaction and always centers the blob at origin. The Metal version also omits: the second specular highlight (`spec2`), the environment band effect (`envBand`), and some lighting detail present in the GLSL version.

### liquid-morph
- **[GLSL]** Potential division by zero: `polygon = cos(PI/sides) / cos(mod(angle+PI/sides, 2.0*PI/sides) - PI/sides)`. When the modular angle result makes the denominator's `cos()` return 0, this divides by zero. In practice this is unlikely with floating point but is theoretically possible.

### loading-spinner
- **[Consistency]** GLSL version includes rounded end caps on the spinner (lines 19-22, `cap1` and `cap2` calculations). Metal version omits the end cap rendering entirely.

### lyapunov-fractal
- **[GLSL]** Array index `seq[n - (n/12)*12]` uses integer division to compute modulo manually. This is correct but unusual compared to the Metal version which uses the cleaner `seq[n % 12]` syntax.

### mandelbrot
- **[Metal]** The `palette` function name is completely generic and highly likely to collide with other Metal shaders in the same compilation unit. Other shaders in this batch (e.g., mandelbrot-power) also define palette-like functions.

### mandelbrot-power
- **[Metal]** The `cpowN` function name is not suffixed. If compiled alongside the GLSL-equivalent of another shader that also defines `cpowN`, it would collide.

### meteor-shower
- **[Consistency]** In the GLSL version, the `meteorCol` mix uses `-along / tailLen` which can produce a division by zero when `tailLen` is zero (when `life` is 0). The same issue exists in the Metal version. In practice, when `life` is 0 the entire contribution is multiplied by 0, masking the NaN, but the intermediate value is still undefined.

### magnetic-particle-field
- **[Consistency]** GLSL version uses `iMouseTime` for orbit animation timing while Metal version uses `iTime`. When mouse interaction is not active the GLSL version falls back to `iMouseTime`-based animation, which may differ from `iTime` depending on how the host app provides these uniforms.

### metallic-crosshatch
- **[GLSL]** Uses `dFdx()` and `dFdy()` for normal computation. These are valid GLSL ES 3.0 functions but require the `GL_OES_standard_derivatives` extension to be available. Most implementations support this but it is worth noting.
- **[Consistency]** GLSL uses screen-space derivatives (`dFdx`/`dFdy`) for normal computation while Metal uses finite differences with an epsilon of 0.001. These will produce different normal maps, particularly at different resolutions. The Metal version only computes the derivative of `line1`, not the full crosshatch pattern, so the normals will differ more significantly.
- **[Metal]** `metallicCrosshatchHash` function is defined but never called. Dead code.

### moire-circles
- **[Consistency]** GLSL uses `3.14159` for pi while Metal uses `M_PI_F`. These are slightly different values (M_PI_F is more precise), producing a very minor visual difference in the sin() calculation on line 21/19.

## Clean Shaders
- lava-lamp
- leather-texture
- liquid-chrome
- lissajous-curves
- magnetic-field
- magnetic-particles
- marble-veins
- mesh-gradient
- metaballs
- matrix-rain
