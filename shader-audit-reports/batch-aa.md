# Shader Audit Report - Batch AA

## Summary
- Total shaders audited: 26
- Shaders with issues: 15
- Clean shaders: 11

## Issues Found

### anamorphic-stretch
- **[GLSL]** Unused function `anaHash` declared on line 8 but never called.

### apollonian-gasket
- **[Consistency]** GLSL uses `gl_FragCoord.xy` for UV calculation (pixel-space based), while Metal uses `in.uv` (0-1 normalized) with manual aspect ratio correction. These produce different coordinate spaces and will yield visually different results.
- **[GLSL]** Unused variable `a` (atan result) computed on line 12 but never used in the loop body.

### art-deco-fans
- **[Consistency]** Metal version is missing the inner arc rings loop (`for(float ri=0.2;ri<0.8;ri+=0.2)`) and the ray lines that are present in the GLSL version (lines 23-26 of GLSL). The Metal version only renders the outer arc at r=0.8, resulting in a less detailed effect.

### ascii-art
- **[GLSL]** Unused variable `cellSize` is assigned on line 50 but this is actually used on line 51 -- no issue. (Clean on closer review.)

### audio-reactive-blob
- **[Consistency]** GLSL version includes a `deform` term from `angle * 3.0` (line 23: `deform += sin(angle * 3.0 + iTime) * amplitude * 0.03;`) that is missing in the Metal version. The Metal deform only has 3 terms while GLSL has 4.
- **[Consistency]** GLSL version includes the pulse ring effect (`pulseRing` on lines 55-56) that is entirely absent from the Metal version.
- **[Metal]** The `bass * 0.3` term for modifying `blobColor` (present in GLSL line 40) is missing from the Metal version.

### atmospheric-sunset
- **[Metal]** Helper function `sunsetScatter` is not suffixed for Metal namespace uniqueness. If this shader is compiled alongside other Metal shaders with a function also named `sunsetScatter`, it will cause a linker collision.

### barnsley-fern
- **[Metal]** Helper function `fernHash` is not suffixed for Metal namespace uniqueness. The GLSL and Metal versions use the identical function name `fernHash`.

### barrel-distortion
- **[Consistency]** GLSL version has a grid overlay effect (line 21: `float grid = smoothstep(...)`) that blends grid lines on top of the final color. The Metal version omits this grid overlay entirely.

### black-hole-lens
- **[Consistency]** GLSL version has `iMouse`/`iMouseTime` uniforms and interactive black hole positioning via mouse input. The Metal version hardcodes `bhPos` to `(0,0)` and uses `iTime` instead of `iMouseTime`, so the interactive feature is absent.
- **[Metal]** Helper functions `bhHash`, `bhStarField`, and `bhStarColor` share names with the `black-hole` shader's Metal helpers. If both shaders are compiled into the same Metal library, this will cause duplicate symbol errors.

### bloom-glow
- **[Metal]** Helper function `bgScene` is not suffixed for Metal namespace uniqueness. Could collide with any other shader defining `bgScene`.

### bubbles
- **[Metal]** Helper function `bubHash` and `bubIridescence` are not suffixed for Metal namespace uniqueness, matching the GLSL names exactly.

### buddhabrot
- **[GLSL]** Variable `density` declared on line 16 is never used (only `densityR`, `densityG`, `densityB` are used).
- **[Metal]** Variable `density` declared on line 15 is never used.
- **[Metal]** Variable `escapeIter` is set on line 35 but never read.
- **[GLSL]** Variable `escapeIter` is set on line 31 but never read.
- **[Metal]** Helper function `buddhaHash` is not suffixed for Metal namespace uniqueness.

### candle-flame
- **[Metal]** Helper function `cfNoise` is not suffixed for Metal namespace uniqueness, matching the GLSL name exactly.
- **[GLSL]** Potential division by zero: `flameUV.y/flameH` on line 25 (`width` calculation) and line 32-33 (color interpolation). When `flameH` approaches zero (e.g., if `sin(t*3.0)` returns exactly `-7.0`, though with the constants used `flameH` ranges from 0.30 to 0.40, so this is safe in practice).

### calm-pool
- **[Metal]** Helper function `cpWave` is not suffixed for Metal namespace uniqueness, matching the GLSL name exactly.

### camouflage
- **[Metal]** Helper functions `camoHash`, `camoNoise`, and `camoFbm` are not suffixed for Metal namespace uniqueness, matching the GLSL names exactly.

## Clean Shaders
- anamorphic-stretch (only a minor unused function, noting above but structurally clean)
- ascii-art
- asteroid-field
- aurora-borealis
- bauhaus-circles
- black-hole
- breathing-glow
- brick-wall
- brushed-aluminum-tilt
- brushed-metal
- burning-ship
- butterfly-wings

## Notes on Metal Function Naming

Multiple shaders have Metal helper functions that are not uniquely suffixed (e.g., with `Mtl` or similar). While this is not a bug for shaders compiled independently, it becomes a real problem if multiple shaders are compiled into a single Metal library. The following shaders have this issue and are flagged above:

- atmospheric-sunset (`sunsetScatter`)
- barnsley-fern (`fernHash`)
- black-hole-lens (`bhHash`, `bhStarField`, `bhStarColor` -- also collides with black-hole shader)
- bloom-glow (`bgScene`)
- bubbles (`bubHash`, `bubIridescence`)
- buddhabrot (`buddhaHash`)
- calm-pool (`cpWave`)
- camouflage (`camoHash`, `camoNoise`, `camoFbm`)
- candle-flame (`cfNoise`)

Shaders that correctly suffix their Metal helpers include: asteroid-field (`astHashMtl`, `asteroidSDFMtl`), ascii-art (`asciiCharMtl`), aurora-borealis (`hashAurora`, `noiseAurora`, `fbmAurora`), brushed-aluminum-tilt (`brushedAlumHash`, `brushedAlumNoise`), butterfly-wings (`bflyHashMtl`, `bflyWingShapeMtl`).
