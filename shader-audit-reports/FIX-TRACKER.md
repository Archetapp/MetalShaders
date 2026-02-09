# Shader Audit Fix Tracker

## Status: COMPLETE

## Priority 1: Critical Bugs - ALL DONE
- [x] **soap-film** - Fixed Metal swirl: moved `3.0` inside `sin()` to match GLSL.
- [x] **puddle-splash** - Fixed finite-difference normals in Metal.
- [x] **hexagonal-grid** - Replaced `fmod()` with manual Euclidean mod in Metal.
- [x] **pokemon-holo-card** - Fixed GLSL fresnel to use `vec3(centeredUv, 0.0)` matching Metal.
- [x] **moon-phases** - Moved glow halo outside `if(moonMask>0.01)` in both GLSL and Metal.
- [x] **posterize** - Added `max(1.0, ...)` guard to `levels` in both versions.
- [x] **ray-march-3d** - Added `max(0.0, ...)` guard inside `sqrt()` in both versions.
- [x] **newtons-fractal** - Added `+ 1e-10` epsilon to `dot(b,b)` in both versions.
- [x] **morphing-blob-drag** - Added `+ 0.0001` to all `length()` divisors in both versions.
- [x] **complex-mapping** - Added `+ 1e-10` epsilon to `dot(b,b)` in both versions.
- [x] **frost-crystallization** - Added `max(..., 0.0001)` to `branchLen` in both versions.
- [x] **stained-glass** - Added `min(..., 5)` clamp to array index in both versions.

## Priority 2: Batch-by-Batch Fixes - ALL DONE

### Batch AA (anamorphic-stretch → candle-flame) - DONE
- [x] Remove dead code: anamorphic-stretch (unused `anaHash`), apollonian-gasket (unused `a`), buddhabrot (unused `density`/`escapeIter`)
- [x] Fix consistency: apollonian-gasket (UV mismatch), art-deco-fans (Metal missing inner arcs), audio-reactive-blob (Metal missing features), barrel-distortion (Metal missing grid)
- [x] Fix meta/naming as needed

### Batch AB (candy-swirl → cubist-facets) - DONE
- [x] Remove dead code: cell-division (`cellSize2`), color-afterimage (`borderPulse`)
- [x] Fix consistency: cassette-tape (Metal missing window), circuit-board (Metal missing corner traces), chromatic-aberration (Metal missing radial mod), cracked-earth (Metal missing edge highlight), complex-mapping (Metal missing grid), confetti-burst naming
- [x] Fix interactive: caustic-light-patterns, cloth-simulation, condensation (Metal missing mouse)

### Batch AC (curl-noise → electric-arc) - DONE
- [x] Remove dead code: delaunay-lines (`minEdge`), diamond-facets (`girdle`), droste-effect (`border`)
- [x] Fix consistency: dew-drops, diamond-grid-holo, disco-ball-reflections, displacement-warp, dissolve-to-embers, dynamic-island-morph, dripping-water (Metal simplified)
- [x] Fix meta: dissolve-embers title, dynamic-island title
- [x] Fix naming collision: dissolve-to-embers + dissolve-embers Metal functions

### Batch AD (electric-arc-dual → fractal-spiral) - DONE
- [x] Remove dead code: elementary-ca (dead CA loop), escher-tessellation (`cellId`), falling-sand (`aspect`), flocking-boids (`glow`)
- [x] Fix consistency: fibonacci-spiral (Metal missing spiral glow), fog-wipe (Metal missing tree/sparkle), forest-fire (Metal missing trunks), fourier-series (Metal missing zero-lines), fractal-noise (GLSL generic names)
- [x] Fix interactive: electric-lightning-arc, falling-sand, ferrofluid, fog-wipe (Metal missing mouse)

### Batch AE (frequency-spectrum → heat-map-touch) - DONE
- [x] Remove dead code: frequency-spectrum (`reflection`/`reflUv`/`reflBar`), guilloche (`th`)
- [x] Fix consistency: frequency-spectrum (Metal added scanline), glitch-corruption (Metal added colorBand swizzle)
- [x] Fix meta: galaxy-spiral-deep duplicate title
- [x] Fix interactive: frost-crystallization, frosted-glass-wipe, glitch-corruption, gravity-wells, heat-map-touch

### Batch AF (heat-shimmer → lava-flow) - DONE
- [x] Remove dead code: hopf-fibration (`c`), hypnotic-spiral (`scale`/`bands2`/`spiral2`), ink-in-water (`dist`), ink-watercolor (`bleedAmount`), koch-snowflake (`scale`), langtons-ant (unused vars)
- [x] Fix consistency: holographic-sticker (Metal added peel), impressionist-brush (Metal added grain), laser-grid (Metal added intersections + fog scatter)
- [x] Fix interactive: ice-freeze-over, ink-watercolor-spread, laser-grid

### Batch AG (lava-lamp → moire-circles) - DONE
- [x] Remove dead code: lenticular-card (Metal `lenticularCardHash`), metallic-crosshatch (Metal `metallicCrosshatchHash`)
- [x] Fix consistency: lens-flare (Metal added iris/aberration), light-sweep-glare (Metal added texture/dots/border), loading-spinner (Metal added end caps)
- [x] Fix naming: mandelbrot (`palette` → `mandelbrotPalette`), lightning (`hash`/`noise`/`bolt` → `lightningHash`/`lightningNoise`/`lightningBolt`), ocean-surface (`hash`/`noise` → `oceanHash`/`oceanNoise`)

### Batch AH (moire-lines → paint-peel) - DONE
- [x] Fix consistency: mondrian (Metal hash-varied grid), navier-stokes-fluid (Metal added turbulence), paint-peel (Metal linear + noise + edge), oil-slick-iridescence (Metal added ripple/specular)
- [x] Fix meta: oil-slick duplicate title
- [x] Fix naming: night-sky (`nsHash`/`nsNoise` → `nightSkyHash`/`nightSkyNoise`), oil-slick-material (`osNoise` → `osmNoise`)

### Batch AI (parallax-depth-card → prismatic-light) - DONE
- [x] Remove dead code: pendulum-phase (`rod1`/`ang1`), penrose-tiling (`penRhomb`), phase-portrait (`ppHash`), pixel-disintegration (`spin`), plasma-ball (`a`/`len`), prism-dispersion (`refractAngle`), prismatic-glass-edge (hash functions), prismatic-light (`prismShape`)
- [x] Fix consistency: parametric-surface (Metal added Lissajous), phase-portrait (Metal added streamlines), portal-reveal (Metal added ring/particles), pixelate (Metal added sine), polar-rose (Metal added grid), pop-art-dots (Metal added border)

### Batch AJ (procedural-fire → sdf-morphing) - DONE
- [x] Remove dead code: progress-ring (`pct`), sdf-morphing (`morph`), puddle-splash (`psHash`), reaction-diffusion generic names
- [x] Fix consistency: rainfall (Metal added scanline), rothko-fields (Metal added grain), saturn-rings (Metal added shadow), reaction-diffusion (Metal added edge via `rdComputeV` helper), reaction-diffusion-paint (Metal added edge)

### Batch AK (sdf-noise-displace → spring-mesh-deform) - DONE
- [x] Remove dead code: sdf-primitives (`sdHexagon`/`smin`), sierpinski-triangle (`angle`), spirograph (`tMod`)
- [x] Fix consistency: sdf-outline (Metal added animated ring), shockwave-distort (Metal added texture), smoke-vapor (Metal added ambient), sound-rings (Metal added particles), spring-mesh-deform (Metal added spring lines)
- [x] Fix `in.position.xy` → `in.uv * iResolution`: seashell-spiral, sierpinski-triangle, solar-flare, sparks-embers, spider-web

### Batch AL (stained-glass → truchet-triangles) - DONE
- [x] Remove dead code: tree-growth (`treeHash`/`treeGrowthHash`, `tier`), truchet-tiles (`nextRnd`/`nextFlip`)
- [x] Fix consistency: stained-glass-light (Metal added lightBeam/glow), suprematism (Metal added cross)

### Batch AM (tunnel-zoom → xray-reveal-lens) - DONE
- [x] Remove dead code: wave-equation (`weHash`)
- [x] Fix consistency: underwater-bubbles (Metal added squash/light/refract/vignette), welding-sparks (Metal added trails), wet-asphalt (Metal added scatter), xray-reveal-lens (Metal added plank/grain/glare), water-drops-surface (Metal added shadow)
- [x] Fix naming: voronoi-cells (`hash2` → `voronoiHash2`)

## Duplicate Titles - ALL DONE
- [x] dissolve-embers → renamed to "Dissolve Embers"
- [x] dynamic-island → renamed to "Dynamic Island"
- [x] galaxy-spiral-deep → renamed to "Galaxy Spiral Deep"
- [x] oil-slick → renamed to "Oil Slick"
