# Shader Audit Report - Batch AD

## Summary
- Total shaders audited: 26
- Shaders with issues: 18
- Clean shaders: 8

## Issues Found

### electric-lightning-arc
- **[Consistency]** GLSL version has mouse interactivity (iMouse, iMouseDown uniforms) allowing user to control pointB position. Metal version has no mouse support and always uses the animated `pointB = float2(0.35, cos(iTime * 0.4) * 0.15)`. The meta.json declares `mouseMode: "press"` but Metal cannot honor it.
- **[GLSL]** `iMouseDown` uniform is declared but this is a non-standard uniform; not necessarily a bug if the host provides it, but worth noting as it couples to the specific hosting framework.

### elementary-ca
- **[GLSL]** Dead code: the function `ecaRule` (lines 7-10) is defined but never called in `main()`. The variables `prev` (line 26), `h` (line 30), and `neighbor` (line 32) are computed but never used in a meaningful way (overwritten or ignored). The variable `newState` is computed on line 31, then immediately overwritten on line 33, making the line 31 computation dead code.
- **[Consistency]** The GLSL version has significantly more code in main() (the rule-based cellular automaton loop with `ecaRule`, `prev`, `current` logic from lines 23-37) that ultimately gets overridden by the pattern computation on lines 38-40. The Metal version omits this entire dead code block and goes straight to the pattern computation. While the final visual output matches (both use the same `pattern`/`cellState` approach), the GLSL contains substantial unused logic.

### escher-tessellation
- **[GLSL]** Unused variable: `cellId` is computed on line 69 (`float cellId = etHash(cell);`) but never read.
- **[Metal]** Unused variable: `cellId` is computed on line 72 (`float cellId = etHash(cell);`) but never read.
- **[Consistency]** GLSL uses `3.14159` for `freq` while Metal uses `M_PI_F`. These are approximately equal but not exactly the same value (M_PI_F is 3.14159265...). Minor precision difference.

### falling-sand
- **[Consistency]** GLSL has full mouse interactivity (iMouse, iMouseDown, iMouseTime uniforms) where stream 0 follows the mouse position and uses iMouseTime for pile growth. Metal version has no mouse support at all -- stream 0 uses the same animated formula as other streams, and all streams use iTime instead of iMouseTime. The meta.json declares `mouseMode: "press"` but Metal cannot honor it.
- **[GLSL]** Unused variable: `aspect` is computed on line 40 but never used.

### ferrofluid
- **[Consistency]** GLSL has mouse interactivity (iMouse, iMouseTime uniforms) allowing the user to control magnet position. Metal version uses only iTime-based animated position with no mouse support. The GLSL also uses `iMouseTime` for spike animation timing while Metal uses `iTime`. The meta.json declares `mouseMode: "press"` but Metal cannot honor it.
- **[GLSL]** Unused variable: `hasInput` is computed on line 40 but only used in the ternary on line 42; the variable `mouseUV` on line 39 is used but the overall mouse pathway is missing from Metal.

### fibonacci-spiral
- **[Consistency]** GLSL version has a secondary spiral glow loop (lines 22-27) that adds a continuous spiral trail effect. The Metal version completely omits this loop, producing a less detailed visual output.
- **[GLSL]** Unused variable: `glow` declared on line 21 in the main loop is not explicitly used by name (but the glow-like contribution is added inline on line 21).

### flocking-boids
- **[GLSL]** Unused variable: `glow` is declared on line 21 (`float glow = 0.0;`) but never read or written to after initialization.

### fog-mist
- **[Metal]** Uses `in.position.xy/iResolution` for UV calculation (line 16) rather than `in.uv`. This means it uses pixel coordinates divided by resolution instead of the pre-computed normalized UV. While functionally similar when the viewport matches the resolution, it differs from the convention used in most other shaders in this collection.

### fog-wipe
- **[Consistency]** GLSL version has a tree silhouette effect (line 28-29) and particle sparkle effect (line 55-56) that are absent from the Metal version. Metal also omits the tree scene element entirely.
- **[Consistency]** GLSL uses `iMouseTime` for wipe position timing while Metal uses `iTime`, which means the wipe behavior timing differs between versions.

### foil-stamp
- **[GLSL]** Uses `dFdx()` and `dFdy()` (lines 52-53) for computing surface normals from the emboss pattern. These derivative functions may not be available or may produce unexpected results in all WebGL2 contexts, particularly in non-continuous regions.
- **[Consistency]** The GLSL version uses `dFdx`/`dFdy` for normal computation while Metal manually computes finite differences with an epsilon offset (lines 54-63). This is a different mathematical approach that may produce visually different normals, especially at stamp pattern edges.

### forest-fire
- **[Consistency]** GLSL version has a tree trunk element (`treeTrunk` on line 30, combined with `treeTop` on line 32 via `max(treeTrunk*0.5, treeTop)`) that is absent from the Metal version. Metal only uses `treeTop` (line 35-36), making the trees appear without trunks.
- **[Metal]** The helper function names `ffHash` and `ffNoise` collide with the same-named functions in the ferrofluid shader. If both shaders are compiled into the same Metal library, this will cause a linker error.

### fourier-series
- **[Consistency]** GLSL version includes zero-line reference markers (line 22: `smoothstep` calls for `abs(uv.y-0.15)` and `abs(uv.y+0.15)`) that are absent from the Metal version, which means the Metal version lacks the baseline reference lines.

### fractal-noise
- **[GLSL]** Helper function names `hash`, `noise`, and `fbm` are very generic and not prefixed. If this shader's functions were ever exposed alongside other shaders (e.g., in a shared compilation unit), they would cause name collisions. The Metal version correctly suffixes them as `hash1`, `noise1`, `fbm1`.

### electric-arc-dual
- **[GLSL]** Potential division by zero: `eadArc` computes `float len=length(ab);` then `vec2 dir=ab/len;`. If points `p1` and `p2` are identical (currently hardcoded differently, so not triggered), `len` would be 0. Same issue exists in Metal.

### fibonacci-spiral (additional)
- **[Metal]** The UV computation uses `(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0)` which is a different coordinate space than GLSL's `(gl_FragCoord.xy-0.5*iResolution)/iResolution.y`. The Metal approach scales x by aspect ratio and leaves y at [-0.5, 0.5], while GLSL divides both by iResolution.y. These produce different coordinate ranges when the aspect ratio is not 1:1.

### explosion
- **[GLSL]** Unused variable: `a` (angle from atan on line 22) is used later in the noise calls but shadows the same variable name in the noise function context. Not a bug but worth noting for clarity.

### ferrofluid (additional)
- **[GLSL]** Missing `iMouseDown` uniform: The meta.json declares `mouseMode: "press"` but the GLSL shader declares `iMouse` and `iMouseTime` but not `iMouseDown`. It uses `hasInput = iMouse.x > 0.0 || iMouse.y > 0.0` as a proxy instead of checking press state directly. This means hover also triggers the magnet repositioning, which may not match the intended "press" mode.

### fog-wipe (additional)
- **[GLSL]** The `iMouseTime` uniform is used but not `iMouseDown`. Since meta.json declares `mouseMode: "press"`, the shader should likely be gating on press state, but it only uses `hasInput` (checking if mouse coordinates are nonzero).

## Clean Shaders
- emboss
- epidemic-model
- fabric-weave
- feather-barbs
- film-grain
- fingerprint
- flower-bloom
- fluid-advection
- fluid-simulation
- fractal-flame
- fractal-spiral
