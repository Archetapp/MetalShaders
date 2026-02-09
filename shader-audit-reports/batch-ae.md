# Shader Audit Report - Batch AE

## Summary
- Total shaders audited: 26
- Shaders with issues: 17
- Clean shaders: 9

## Issues Found

### frequency-spectrum
- **[GLSL]** Dead code: `reflection` (line 46) is computed as `step(uv.y, 0.0) * 0.0` which is always 0.0. Variables `reflUv` (line 47) and `reflBar` (line 48) are computed but never used.
- **[Consistency]** The GLSL version includes a scanline effect (line 50-51) and the unused reflection code (lines 46-48). The Metal version omits both the scanline effect and the reflection code, producing a slightly different final image (no scanline subtraction).

### frost-crystallization
- **[GLSL]** Potential division by zero in `frostCrystalBranch` at line 76: `branchLen = growthProgress * 0.3` -- when `growthProgress` is 0.0, `branchLen` is 0.0, and `1.0 - along / branchLen` divides by zero. The `step(along, branchLen)` masks the visual result but the division still occurs.
- **[Metal]** Same potential division by zero in `frostCrystalBranch` at line 76.
- **[Consistency]** The GLSL version uses `iMouseTime` for `cycleProgress` with `clamp(iMouseTime / growthTime, 0.0, 1.0)` (mouse-driven timing). The Metal version uses `fmod(iTime, growthTime) / growthTime` (auto-looping with iTime). This is a fundamental behavior difference: GLSL requires mouse interaction to grow crystals, while Metal auto-animates in a loop. The GLSL version also supports mouse-positioned seed points (`s == 0 && hasInput`), which the Metal version omits entirely.
- **[Meta]** Has `mouseMode: "press"` but the Metal version does not accept mouse uniforms, so mouse interaction only works in GLSL.

### frosted-glass
- **[Metal]** Function names `frostHash`, `frostNoise`, and `frostVoronoi` are not suffixed with a unique prefix. If this shader were compiled alongside `frost-crystallization` (which also uses `frostCrystalHash`, etc.), there would be no collision, but the names `frostHash` and `frostNoise` are generic enough to potentially collide with other frost-themed shaders in a shared compilation unit.

### frosted-glass-wipe
- **[Consistency]** The GLSL version uses `iMouseTime` for animation timing and supports mouse-driven wipe position with `iMouse` uniform. The Metal version uses `iTime` instead of `iMouseTime` and has no mouse interaction, so the wipe always auto-animates. The GLSL version also includes a regrowth loop (lines 46-56) that modulates `clearMask` based on `iMouseTime` history -- this entire mechanic is absent from the Metal version.
- **[Meta]** Has `mouseMode: "press"` but the Metal version does not accept mouse uniforms.

### frosted-metal
- **[Metal]** Function name `fmNoise` is shared between GLSL and Metal. While this works, it is not uniquely suffixed per the Metal naming convention used by other shaders in this collection. Minor inconsistency with naming pattern.

### galaxy-spiral
- **[Metal]** Helper functions `gsHash`, `gsNoise`, `gsFbm` are not uniquely suffixed for Metal -- they use the same names as the GLSL version. Other shaders in this collection add Metal-specific suffixes to avoid namespace collisions. This is a naming convention inconsistency but not a compilation error if compiled in isolation.

### galaxy-spiral-deep
- **[Meta]** The `title` field is "Galaxy Spiral" which is identical to the `galaxy-spiral` shader's title. It should be "Galaxy Spiral Deep" or similar to distinguish it.
- **[Metal]** Uses `in.position.xy` for UV computation (line 27) instead of the `in.uv * iResolution` pattern used in most other Metal shaders. This is functionally equivalent but inconsistent with the project pattern.

### geometric-bloom
- **[Metal]** Helper function `gbPoly` uses the same name as the GLSL version without a Metal-specific suffix. Naming convention inconsistency.
- **[Consistency]** The GLSL version uses `mat2(c,-s,s,c)*uv` for rotation (line 27). The Metal version uses `float2x2(c,-s,s,c)*uv` (line 25). In GLSL, `mat2` is column-major, so `mat2(c,-s,s,c)` creates columns `(c,s)` and `(-s,c)`. In Metal, `float2x2(c,-s,s,c)` creates rows `(c,-s)` and `(s,c)`. These produce the same transformation matrix, so this is correct.

### glitch-corruption
- **[Consistency]** The GLSL version uses `iMouseTime` for glitch timing and supports mouse-positioned glitch intensity via `iMouse` uniform. The Metal version uses `iTime` instead and has no mouse interaction. The Metal version also omits the `colorBand` swizzle effect (GLSL line 51-52: `col = mix(col, col.gbr, colorBand * glitchIntensity)`). The overall glitch intensity calculation differs: GLSL uses mouse proximity-based `smoothstep` while Metal uses `pow(sin(iTime*0.5)*0.5+0.5, 2.0)`.
- **[Meta]** Has `mouseMode: "press"` but the Metal version does not accept mouse uniforms.

### god-rays
- **[Metal]** Uses `in.position.xy/iResolution` for UV computation (line 16) instead of `in.uv`. Since this shader uses 0-1 UV space (not centered), using `in.position.xy` (pixel coordinates) divided by resolution should work, but it is inconsistent with the `in.uv` pattern used by most other Metal shaders. If the vertex shader provides normalized UVs in `in.uv`, using `in.position.xy/iResolution` may give slightly different results depending on the vertex pipeline setup.

### gravity-wells
- **[Consistency]** The GLSL version uses `iMouseDown` uniform to detect active press and `iMouse` for position. The first gravity well follows the mouse when `isInteracting` is true. The Metal version has no mouse support and always auto-animates all three wells.
- **[Meta]** Has `mouseMode: "press"` but the Metal version does not accept mouse uniforms.

### guilloche
- **[GLSL]** Unused variable `th` at line 18: `float th=float(i)*6.2831/8.0;` is computed but never referenced.

### gyroid-surface
- **[Consistency]** The GLSL version computes UV as `(gl_FragCoord.xy-0.5*iResolution)/iResolution.y` which is a centered UV with aspect ratio correction based on height. The Metal version computes UV as `(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0)` which centers and applies aspect ratio correction. These are equivalent.

### halftone-cmyk
- No issues found. Both GLSL and Metal versions are consistent and well-implemented.

### hammered-metal
- **[GLSL]** Potential issue at line 17: `normalize(p-center+0.001)` -- adding scalar 0.001 to a vec2 adds it to both components, which works as a zero-protection offset, but if `p` exactly equals `center`, the resulting normalize would be `normalize(vec2(0.001, 0.001))` which is fine. However, this is an unusual pattern.
- **[Metal]** Same potential issue with `normalize(p-center+0.001)` at line 13.

### heat-map-touch
- **[Consistency]** The GLSL version uses `iMouseTime` for heat timing. The Metal version uses `iTime`. The GLSL version supports mouse-positioned heat sources via `iMouse`, while the Metal version always auto-animates. Same pattern as other interactive shaders.
- **[Meta]** Has `mouseMode: "press"` but the Metal version does not accept mouse uniforms.

### frosted-metal
- No additional issues beyond the naming note above.

## Clean Shaders
- frosted-glass
- galaxy-spiral
- game-boy
- game-of-life
- gaussian-blur
- gradient-map
- gradient-orb
- granite-speckle
- gravity-nbody
- halftone-cmyk
- heartbeat
- heat-diffusion

## Notes on Recurring Patterns

### Interactive Shaders Missing Metal Mouse Support
The following shaders declare `mouseMode` in meta.json but their Metal versions do not accept mouse/mouseTime/mouseDown uniforms, meaning mouse interaction only works in the WebGL (GLSL) version:
- frost-crystallization
- frosted-glass-wipe
- glitch-corruption
- gravity-wells
- heat-map-touch

In all these cases, the Metal version falls back to time-based auto-animation, which produces a functional but non-interactive effect.

### Metal UV Computation Inconsistency
Most Metal shaders use `in.uv` for normalized UV coordinates, but some use `in.position.xy` divided by resolution (god-rays, galaxy-spiral-deep, geometric-bloom, guilloche, heartbeat, gradient-orb). Both approaches work but the inconsistency means the shaders assume different things about the vertex pipeline.
