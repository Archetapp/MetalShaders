# Shader Audit Report - Batch AM

## Summary
- Total shaders audited: 26
- Shaders with issues: 8
- Clean shaders: 18

## Issues Found

### underwater-bubbles
- **[Consistency]** The GLSL version includes squash distortion of the bubble (`float squash = 1.0 + sin(iMouseTime * 3.0 + fi) * 0.1; toBubble.y *= squash;`) which is absent from the Metal version.
- **[Consistency]** The GLSL version includes `bottomLight` computation (`pow(max(0.0, 1.0 - length(toBubble / size - vec2(0.1, -0.25)) * 2.0), 4.0) * 0.3`) added to `bubbleColor`, which is missing from the Metal version.
- **[Consistency]** The GLSL version uses refracted UV coordinates to compute `refractedWater` for each bubble, whereas the Metal version uses the base `waterColor` directly for the bubble interior color.
- **[Consistency]** The GLSL version includes a vignette effect (`float vignette = 1.0 - 0.3 * length(uv); col *= vignette;`) that is absent from the Metal version.

### voronoi-cells
- **[Metal]** The helper function `hash2` is a very generic name that risks namespace collision with other Metal shaders if compiled into the same Metal library. Other shaders in this batch use prefixed names (e.g., `vhsHashMtl`, `underwaterBubbleHash`).

### voronoi-glass-shatter
- **[Consistency]** The GLSL version uses `iMouseTime` for shatter timing while the Metal version uses `fmod(iTime, cycleTime)` with a 4-second auto-cycling loop. The GLSL impact point comes from mouse input; the Metal version computes it from the cycle count. This produces fundamentally different behavior beyond just the lack of mouse input.

### wave-equation
- **[GLSL]** The `weHash` function is declared (line 7-9) but never called anywhere in `main()`. This is dead code.

### welding-sparks
- **[Consistency]** The GLSL version includes a spark trail rendering section (lines 35-48: the `if(life>0.3)` block that draws line segments between previous and current spark positions using perpendicular distance). The Metal version omits this trail effect entirely, rendering only spark points.

### wet-asphalt
- **[Consistency]** The GLSL version includes a noise-based scatter highlight at the end (`float scatter = waNoise(uv*50.0+t)*puddle; col += vec3(0.1)*pow(scatter, 3.0);`) that is absent from the Metal version.

### xray-reveal-lens
- **[Consistency]** The GLSL version includes several visual details missing from Metal: plank line separators on the wood surface (`float plank = smoothstep(0.01, 0.0, abs(fract(uv.y * 4.0) - 0.5) - 0.48)`), noise grain on the x-ray layer (`xrayColor += xrlNoise(uv * 50.0 + iTime) * 0.03`), a lens edge highlight band (`lensEdge`), and a center lens glare effect (`lensGlare`).

### water-drops-surface
- **[Consistency]** The GLSL contact shadow logic inside the drop rendering (`if (dropMask < 0.1) { totalColor -= vec3(0.03) * contactShadow * (1.0 - dropMask); }`) which darkens the area at the base of each drop is absent from the Metal version.

## Clean Shaders
- tunnel-zoom
- turbulence
- value-noise
- vector-field
- velvet
- vhs-glitch
- vignette
- vinyl-record
- volumetric-clouds
- voronoi-shatter
- warp-speed
- water-ripple
- waterfall
- wax-subsurface
- wood-grain
- worley-noise
- wormhole-tunnel
- woven-basket

Note: Several interactive shaders (underwater-bubbles, voronoi-glass-shatter, water-drops-surface, xray-reveal-lens) have `mouseMode` in their meta.json, and their Metal versions naturally lack mouse uniform support, using `iTime`-based fallback animation instead. The consistency issues flagged above are about visual feature differences beyond just the mouse input substitution.
