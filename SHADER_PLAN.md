# Metal Shaders Collection — Master Plan

> Target: 200+ shaders across 16 categories.
> Each shader has both a `.metal` (native) and `.frag` (GLSL/WebGL2) version.

**Status key:** `[ ]` planned · `[~]` in progress · `[x]` done

---

## 1. Gradients & Modern UI Backgrounds

Smooth, tasteful, app-ready. The shaders designers actually want.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 1 | Mesh Gradient | Apple-style flowing gradient with 4–6 soft color blobs morphing via simplex noise | Medium | `[ ]` |
| 2 | Aurora Borealis | Curtains of light — layered vertical FBM streaks with green/purple/blue palette | Medium | `[ ]` |
| 3 | Liquid Chrome | Reflective mercury surface — warped environment map with smooth deformations | Hard | `[ ]` |
| 4 | Iridescent Film | Thin-film interference (soap bubble / oil slick) — hue shifts based on surface angle | Medium | `[ ]` |
| 5 | Morphing Blobs | 4–5 soft metaball gradients that drift, merge, and separate organically | Easy | `[ ]` |
| 6 | Gradient Orb | Single luminous sphere with radial falloff, floating in dark space, subtle color drift | Easy | `[ ]` |
| 7 | Prismatic Light | White light refracting through a prism into a clean rainbow spectrum | Medium | `[ ]` |
| 8 | Neon Glow Wash | Broad diffuse neon color bands that pulse and shift, like LED wall wash lighting | Easy | `[ ]` |
| 9 | Silk Flow | Anisotropic flowing fabric with specular highlights along thread direction | Medium | `[ ]` |
| 10 | Thermal Heatmap | Animated thermal camera palette — cold blues through hot whites with organic blobs | Easy | `[ ]` |
| 11 | Atmospheric Sunset | Rayleigh scattering simulation — sun disk near horizon with orange/pink/purple sky | Medium | `[ ]` |
| 12 | Deep Ocean Gradient | Depth-based color shift from bright turquoise surface to abyssal dark blue-black | Easy | `[ ]` |
| 13 | Holographic Foil | Tilted holographic card effect — rainbow diffraction grating that shifts with time | Medium | `[ ]` |
| 14 | Frosted Glass | Blurred, icy surface with subtle crystalline structure and refraction | Medium | `[ ]` |
| 15 | Lava Lamp | Thick blobs rising and falling with heat-driven convection coloring | Easy | `[ ]` |
| 16 | Duotone Wash | Two-color gradient with animated noise boundary between them | Easy | `[ ]` |
| 17 | Candy Swirl | Taffy/candy-pull swirling two or three saturated colors together | Easy | `[ ]` |

---

## 2. Noise & Procedural Textures

The building blocks. Every noise type and common procedural material.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 18 | Perlin Noise | Classic gradient noise with smooth interpolation, animated slowly | Easy | `[ ]` |
| 19 | Simplex Noise | Improved noise with less directional artifacts, fewer multiply ops | Easy | `[ ]` |
| 20 | Worley Noise | Cellular/Voronoi distance noise — F1 and F2 distance visualization | Easy | `[ ]` |
| 21 | Value Noise | Random lattice points with bicubic interpolation | Easy | `[ ]` |
| 22 | Curl Noise | Divergence-free noise field visualized as flowing streamlines | Medium | `[ ]` |
| 23 | Domain Warping | FBM fed back into its own coordinates — creates alien organic landscapes | Medium | `[x]` |
| 24 | Turbulence | Absolute-value FBM summing — sharper creases than standard FBM | Easy | `[ ]` |
| 25 | Ridged Noise | Inverted absolute noise summed octave-style — mountain ridge patterns | Medium | `[ ]` |
| 26 | Marble Veins | Sine of (x + FBM) creating stone vein patterns with depth coloring | Easy | `[ ]` |
| 27 | Wood Grain | Concentric ring distortion with noise-driven irregularity | Easy | `[ ]` |
| 28 | Granite Speckle | Multifrequency noise summed to create flecked stone texture | Easy | `[ ]` |
| 29 | Fabric Weave | Cross-hatch pattern with per-thread noise giving textile appearance | Medium | `[ ]` |
| 30 | Leather | Large low-freq bumps with fine-grain high-freq pore detail | Easy | `[ ]` |
| 31 | Paper Fiber | Subtle directional fiber noise with slight color variation | Easy | `[ ]` |
| 32 | Rust / Corrosion | Multi-layered noise with hard thresholds creating patchy oxidation boundaries | Medium | `[ ]` |
| 33 | Camouflage | Smoothstepped noise layers in army green/brown/tan palette | Easy | `[ ]` |
| 34 | Lava / Magma | High-contrast noise with hot-to-cool coloring and slow flow distortion | Medium | `[ ]` |
| 35 | Ice Crystals | Branching crystalline frost pattern using angular Worley noise | Medium | `[ ]` |
| 36 | Bark Texture | Vertically stretched noise with deep grooves and rough surface detail | Easy | `[ ]` |
| 37 | Sand Dunes | Rippled terrain with wind-driven displacement — viewed from above | Medium | `[ ]` |
| 38 | Concrete | Flat gray with subtle aggregate speckle and fine hairline cracks | Easy | `[ ]` |

---

## 3. Fractals

Mathematical infinities. Deep zooms and animated parameters.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 39 | Mandelbrot Set | Classic escape-time fractal with smooth continuous coloring and slow auto-zoom | Medium | `[ ]` |
| 40 | Julia Set | Animated Julia where c orbits a circle, morphing the fractal continuously | Medium | `[ ]` |
| 41 | Burning Ship | Absolute-value variant — upside down hull shapes with fire-palette coloring | Medium | `[ ]` |
| 42 | Newton's Fractal | Newton's method convergence basins for z³−1 — three-color domain coloring | Medium | `[ ]` |
| 43 | Lyapunov Fractal | Logistic map Lyapunov exponents mapped to AB parameter space | Hard | `[ ]` |
| 44 | Tricorn / Mandelbar | Conjugate Mandelbrot — three-fold symmetric fractal | Medium | `[ ]` |
| 45 | Phoenix Fractal | Two-term recurrence Julia variant with feather-like structures | Medium | `[ ]` |
| 46 | Sierpinski Triangle | Iterated function system / chaos game triangle at high iteration | Easy | `[ ]` |
| 47 | Koch Snowflake | Edge-distance estimation for Koch curve at high recursion depth | Medium | `[ ]` |
| 48 | Dragon Curve | Paper-folding fractal rendered via IFS with animated fold progression | Medium | `[ ]` |
| 49 | Barnsley Fern | IFS fern with animated wind sway — classic chaos game | Medium | `[ ]` |
| 50 | Fractal Flame | IFS with nonlinear variation functions and log-density coloring | Hard | `[ ]` |
| 51 | Mandelbrot Power | z^n + c for animated n (2→5) — watching symmetry increase | Medium | `[ ]` |
| 52 | Multibrot | Higher-power Mandelbrot (z^3, z^4) with smooth coloring | Medium | `[ ]` |
| 53 | Buddhabrot (approx) | Trajectory density estimation of escaped Mandelbrot orbits | Hard | `[ ]` |

---

## 4. Geometry & Patterns

Tessellations, tilings, mathematical precision.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 54 | Truchet Tiles | Quarter-circle arcs randomly rotated per cell creating maze-like paths | Easy | `[ ]` |
| 55 | Truchet Triangles | Triangle-based Truchet variant with animated tile flips | Medium | `[ ]` |
| 56 | Hexagonal Grid | Honeycomb cells with per-cell pulse animation and edge highlighting | Medium | `[ ]` |
| 57 | Islamic Star Pattern | 8-fold or 12-fold interlocking star tessellation — line art animated drawing | Hard | `[ ]` |
| 58 | Penrose Tiling | Aperiodic kite-and-dart tiling with animated color cycling | Hard | `[ ]` |
| 59 | Voronoi Cells | Animated point-based cell boundaries with smooth coloring | Easy | `[x]` |
| 60 | Delaunay Lines | Dual of Voronoi — triangulation wireframe over moving points | Medium | `[ ]` |
| 61 | Moire Circles | Two overlapping sets of concentric circles at different centers | Easy | `[ ]` |
| 62 | Moire Lines | Rotating line grids overlapping to create flowing moire bands | Easy | `[ ]` |
| 63 | Spirograph | Hypotrochoid / epitrochoid curves drawn with glowing trails | Medium | `[ ]` |
| 64 | Guilloche | Fine-line security pattern engraving (like on currency) | Medium | `[ ]` |
| 65 | Celtic Knot | Over-under interlocking knot pattern with depth shading | Hard | `[ ]` |
| 66 | Escher Tessellation | Interlocking shape tessellation (fish/bird style) from deformed grid | Hard | `[ ]` |
| 67 | Houndstooth | Classic two-tone fashion pattern with clean geometric teeth | Easy | `[ ]` |
| 68 | Herringbone | Zigzag brick pattern — alternating direction rectangular tiles | Easy | `[ ]` |
| 69 | Chevron Pulse | Animated chevron arrows pulsing in a direction like a conveyor | Easy | `[ ]` |
| 70 | Polka Dots | Animated dots on a grid with phase-offset scale pulsing | Easy | `[ ]` |
| 71 | Concentric Rings | Expanding rings from center with interference at overlap | Easy | `[ ]` |
| 72 | Tartan / Plaid | Overlapping colored stripes in two directions with thread-blending | Easy | `[ ]` |
| 73 | Chain Mail | Interlocking metal rings with subtle 3D shading | Medium | `[ ]` |
| 74 | Brick Wall | Offset rectangular grid with mortar lines and per-brick color variation | Easy | `[ ]` |
| 75 | Tiled Mirrors | Kaleidoscopic mirror reflections at cell boundaries | Easy | `[ ]` |
| 76 | Dot Matrix | LED display-style dot grid with scrolling message capability | Easy | `[ ]` |
| 77 | Geometric Bloom | Expanding geometric shapes (triangles, hexagons) radiating from center | Easy | `[ ]` |
| 78 | Woven Basket | Over-under strip weaving pattern with two strip colors | Medium | `[ ]` |

---

## 5. Nature — Water & Liquid

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 79 | Ocean Surface | Gerstner wave summation with Fresnel reflection and sun specular | Hard | `[ ]` |
| 80 | Calm Pool | Gentle concentric ripples on a reflective water surface | Medium | `[ ]` |
| 81 | Rain on Glass | Droplets sliding down with trails, randomized sizes, refraction | Hard | `[ ]` |
| 82 | Caustics | Dancing underwater light patterns from surface refraction | Medium | `[ ]` |
| 83 | Water Ripple | Single-point disturbance expanding outward with damping | Easy | `[ ]` |
| 84 | Waterfall | Sheet of cascading water with spray and foam at base | Hard | `[ ]` |
| 85 | Puddle Reflection | Still water reflection with slight distortion and edge darkening | Medium | `[ ]` |
| 86 | Bubbles | Floating transparent spheres with thin-film iridescence and refraction | Medium | `[ ]` |
| 87 | Dripping Paint | Thick viscous drips running down a surface with gravity | Medium | `[ ]` |
| 88 | Ink in Water | Diffusing ink cloud spreading through water with tendrils | Medium | `[ ]` |

---

## 6. Nature — Fire & Energy

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 89 | Procedural Fire | Turbulent noise scrolling upward with black-body heat coloring | Medium | `[ ]` |
| 90 | Candle Flame | Single gentle flame with flicker, inner blue core, orange mantle | Medium | `[ ]` |
| 91 | Lightning Bolt | Branching electric discharge with glow bloom and random re-strike | Medium | `[ ]` |
| 92 | Electric Arc | Tesla coil arcs between two points — jittery bright filaments | Medium | `[ ]` |
| 93 | Explosion | Expanding fireball with shockwave ring and dissipating smoke | Hard | `[ ]` |
| 94 | Sparks & Embers | Glowing particles rising with wind drift and cooling fade | Medium | `[ ]` |
| 95 | Plasma Ball | Novelty plasma globe — branching filaments reaching toward a point | Medium | `[ ]` |
| 96 | Lava Flow | Slow-moving bright cracks over dark cooled surface crust | Medium | `[ ]` |
| 97 | Welding Sparks | Bright white-hot point with radiating orange spark trajectories | Easy | `[ ]` |
| 98 | Nuclear Glow | Cherenkov-blue glowing core with pulsing radiation rings | Easy | `[ ]` |

---

## 7. Nature — Sky & Atmosphere

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 99 | Volumetric Clouds | Ray-marched cloud layer with god rays, self-shadow, silver lining | Hard | `[ ]` |
| 100 | Sunset Sky | Atmospheric scattering — sun near horizon, purple overhead fading to orange | Medium | `[ ]` |
| 101 | Night Sky | Dark gradient with procedural star field and milky way band | Easy | `[ ]` |
| 102 | Rainbow | Circular arc with correct spectral ordering and secondary bow | Medium | `[ ]` |
| 103 | Fog / Mist | Layered translucent noise sheets creating depth fog | Easy | `[ ]` |
| 104 | Snowfall | Layered parallax snowflakes at different depths with wind sway | Easy | `[ ]` |
| 105 | Rainfall | Streak-based rain with splash impacts on an implied ground plane | Medium | `[ ]` |
| 106 | Tornado Vortex | Rotating funnel cloud with debris particles and darkened sky | Hard | `[ ]` |
| 107 | God Rays | Crepuscular rays streaming through cloud gaps — volumetric light shafts | Medium | `[ ]` |
| 108 | Heat Shimmer | Refractive distortion rising from a hot surface — desert mirage | Easy | `[ ]` |
| 109 | Cloud Shadows | Overhead cloud shadows drifting across a sunlit ground plane | Medium | `[ ]` |
| 110 | Moon Phases | Accurate lunar phase rendering with crater detail and earthshine | Medium | `[ ]` |

---

## 8. Nature — Organic & Biological

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 111 | Tree Growth | L-system-inspired recursive branching that animates growing outward | Hard | `[ ]` |
| 112 | Flower Bloom | Petal spiral unfolding from bud — golden angle phyllotaxis | Medium | `[ ]` |
| 113 | Leaf Veins | Branching venation pattern on a leaf shape — DLA-inspired | Medium | `[ ]` |
| 114 | Coral Reef | Branching coral structures with subsurface scattering coloring | Hard | `[ ]` |
| 115 | Spider Web | Radial + spiral threads with dew drops and gentle sway | Medium | `[ ]` |
| 116 | DNA Helix | Double helix rotation with base-pair rungs and phosphate backbone | Medium | `[ ]` |
| 117 | Cell Division | Mitosis animation — nucleus splitting, membrane pinching, two cells | Hard | `[ ]` |
| 118 | Butterfly Wings | Symmetric wing pattern with scale-like microstructure | Medium | `[ ]` |
| 119 | Feather Barbs | Branching barb structure from central shaft with iridescence | Medium | `[ ]` |
| 120 | Mushroom Spores | Expanding spore cloud from a cap with Brownian drift | Easy | `[ ]` |
| 121 | Seashell Spiral | Logarithmic spiral shell with growth-line ridges and nacre sheen | Medium | `[ ]` |
| 122 | Fingerprint | Whorl/loop/arch ridge patterns procedurally generated | Medium | `[ ]` |
| 123 | Heartbeat | Pulsing heart shape with ECG-style trace line | Easy | `[ ]` |
| 124 | Neural Network | Interconnected nodes with signal pulses traveling along edges | Medium | `[ ]` |

---

## 9. Space & Cosmic

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 125 | Starfield Parallax | Multi-depth star layers with twinkling and slow drift | Easy | `[ ]` |
| 126 | Galaxy Spiral | Rotating spiral arms with star density and dust lanes | Medium | `[ ]` |
| 127 | Nebula | Layered colored gas clouds with embedded bright stars | Medium | `[ ]` |
| 128 | Black Hole | Gravitational lensing distortion of a star field background | Hard | `[ ]` |
| 129 | Supernova | Expanding shell of light and matter with central remnant | Medium | `[ ]` |
| 130 | Planet Surface | Procedural terrain (continents, ocean, clouds) on a sphere | Hard | `[ ]` |
| 131 | Saturn Rings | Particle ring system with gap structure and shadow on planet | Medium | `[ ]` |
| 132 | Solar Flare | Arcing plasma loop erupting from a stellar surface | Medium | `[ ]` |
| 133 | Comet Tail | Bright nucleus with dust and ion tails streaming away from sun | Medium | `[ ]` |
| 134 | Wormhole Tunnel | Spacetime tunnel effect with star streaks on walls | Medium | `[ ]` |
| 135 | Pulsar Beam | Rotating lighthouse beam from a neutron star with pulse timing | Easy | `[ ]` |
| 136 | Asteroid Field | Tumbling irregular rocks with depth and shadow | Hard | `[ ]` |
| 137 | Eclipse | Moon passing in front of sun with corona and diamond ring | Medium | `[ ]` |
| 138 | Meteor Shower | Multiple bright streaks across a night sky with persistence | Easy | `[ ]` |
| 139 | Warp Speed | Star-trek-style elongated star streaks accelerating to warp | Easy | `[ ]` |

---

## 10. Optical Illusions & Abstract

Mesmerizing, trippy, share-worthy.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 140 | Kaleidoscope | N-fold radial mirror symmetry applied to animated noise | Easy | `[ ]` |
| 141 | Hypnotic Spiral | Logarithmic spiral with color rotation — infinite zoom illusion | Easy | `[ ]` |
| 142 | Metaballs 2D | Soft implicit-surface blobs with smooth color blending at merges | Easy | `[ ]` |
| 143 | Op Art Waves | Bridget Riley-style undulating B&W stripes creating depth illusion | Medium | `[ ]` |
| 144 | Lissajous Curves | Parametric x=sin(at), y=sin(bt) with slowly evolving a:b ratio | Easy | `[ ]` |
| 145 | Impossible Triangle | Penrose triangle rendered as a shader with depth contradiction | Medium | `[ ]` |
| 146 | Tunnel Zoom | Radial texture scrolling inward creating infinite tunnel fly-through | Easy | `[ ]` |
| 147 | Fractal Spiral | Spiral arms that themselves contain smaller spiral arms recursively | Medium | `[ ]` |
| 148 | Interference Rings | Overlapping circular wave sources creating constructive/destructive patterns | Easy | `[ ]` |
| 149 | Anamorphic Stretch | Cylindrical anamorphic projection — distorted image that looks correct in a mirror | Medium | `[ ]` |
| 150 | Rotating Illusion | Static pattern that appears to rotate (peripheral drift illusion) | Medium | `[ ]` |
| 151 | Droste Effect | Recursive image-within-image spiral (Escher's Print Gallery) | Hard | `[ ]` |
| 152 | Stereogram | Random-dot autostereogram with hidden depth shape | Hard | `[ ]` |
| 153 | Pulsing Grid | Grid of circles that pulse in traveling wave patterns | Easy | `[ ]` |
| 154 | Color Afterimage | Stare-then-reveal afterimage illusion with complementary colors | Easy | `[ ]` |

---

## 11. Retro & Stylized

Nostalgia and aesthetic movements.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 155 | Synthwave Sunset | 80s retro sun with horizontal bands sinking behind perspective grid | Medium | `[ ]` |
| 156 | CRT Monitor | Scanlines, barrel distortion, phosphor subpixels, screen curvature | Medium | `[ ]` |
| 157 | Matrix Rain | Falling green katakana columns with varying speeds and brightness | Medium | `[ ]` |
| 158 | VHS Glitch | Tracking errors, color bleed, horizontal tearing, static bursts | Medium | `[ ]` |
| 159 | Halftone CMYK | Color separation into rotated dot screens — newspaper print effect | Medium | `[ ]` |
| 160 | Pixel Dithering | Ordered Bayer matrix dithering reducing a gradient to limited colors | Easy | `[ ]` |
| 161 | ASCII Art | Content rendered as a grid of ASCII density characters | Medium | `[ ]` |
| 162 | Game Boy | 4-shade green palette with chunky pixel grid | Easy | `[ ]` |
| 163 | Neon Sign | Glowing tube letters with flicker, glass tube visible, halo bleed | Medium | `[ ]` |
| 164 | Tron Gridscape | Glowing blue grid extending to horizon with light cycle trails | Medium | `[ ]` |
| 165 | Outrun Road | Perspective highway with lane stripes, mountains, and gradient sky | Medium | `[ ]` |
| 166 | Retro Terminal | Green/amber phosphor text terminal with cursor blink and CRT glow | Easy | `[ ]` |
| 167 | Film Noir | High-contrast black and white with venetian blind shadow stripes | Easy | `[ ]` |
| 168 | Cassette Tape | Spinning reel-to-reel with tape moving between spools | Medium | `[ ]` |
| 169 | Vinyl Record | Spinning disk with groove microstructure and light reflection | Medium | `[ ]` |
| 170 | Polaroid Develop | Photo slowly developing from white — color bleeding in from edges | Medium | `[ ]` |

---

## 12. Simulations & Cellular Automata

Emergent complexity from simple rules.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 171 | Reaction Diffusion | Gray-Scott model — feed/kill parameters producing spots/stripes/mitosis | Hard | `[ ]` |
| 172 | Game of Life | Conway's cellular automaton with glider guns and stable structures | Medium | `[ ]` |
| 173 | Wave Equation | 2D wave propagation with reflection off boundaries | Medium | `[ ]` |
| 174 | Fluid Advection | Simplified Navier-Stokes — velocity field advecting color | Hard | `[ ]` |
| 175 | Particle Swarm | Points orbiting attractors with trailing paths | Medium | `[ ]` |
| 176 | Flocking / Boids | Emergent bird-flock behavior — separation, alignment, cohesion | Hard | `[ ]` |
| 177 | Gravity N-Body | Multiple masses orbiting each other with trajectory trails | Medium | `[ ]` |
| 178 | Spring Mesh | Grid of connected springs responding to disturbance | Medium | `[ ]` |
| 179 | Heat Diffusion | Temperature spreading from hot spots through a medium | Easy | `[ ]` |
| 180 | Sand Simulation | Falling sand with piling and angle-of-repose physics | Medium | `[ ]` |
| 181 | Magnetic Field | Iron-filing-style field lines from two poles | Medium | `[ ]` |
| 182 | Pendulum Phase | Double pendulum with phase-space trajectory visualization | Hard | `[ ]` |
| 183 | DLA Growth | Diffusion-limited aggregation — snowflake-like crystal growing | Hard | `[ ]` |
| 184 | Langton's Ant | Simple Turing machine on a grid producing emergent highway | Easy | `[ ]` |
| 185 | Elementary CA | Wolfram's 1D cellular automata (Rule 30, 90, 110) scrolling | Easy | `[ ]` |
| 186 | Forest Fire | Probabilistic fire spread through a procedural forest grid | Medium | `[ ]` |
| 187 | Epidemic Model | SIR model visualization — infection spreading through a population | Medium | `[ ]` |

---

## 13. Materials & Surfaces

Realistic surface rendering for reference and learning.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 188 | Brushed Metal | Anisotropic specular highlight elongated along brush direction | Medium | `[ ]` |
| 189 | Carbon Fiber | Woven 2×2 twill pattern with dark glossy resin coating | Medium | `[ ]` |
| 190 | Soap Film | Swirling thin-film interference on a membrane with thickness variation | Medium | `[ ]` |
| 191 | Velvet | Rim-lit soft material — bright at grazing angles, dark face-on | Easy | `[ ]` |
| 192 | Ceramic Glaze | Smooth glossy surface with subtle color pooling at edges | Medium | `[ ]` |
| 193 | Circuit Board | PCB traces, vias, solder pads, and green solder mask | Hard | `[ ]` |
| 194 | Diamond Facets | Brilliant-cut gem with internal refraction and spectral dispersion | Hard | `[ ]` |
| 195 | Oil Slick | Thin oil layer on dark water with swirling rainbow interference | Medium | `[ ]` |
| 196 | Wet Asphalt | Dark surface with scattered specular rain reflections | Easy | `[ ]` |
| 197 | Scratched Surface | Fine directional scratches catching light at specific angles | Medium | `[ ]` |
| 198 | Stained Glass | Colored glass panels with lead came borders and light transmission | Medium | `[ ]` |
| 199 | Wax / Subsurface | Translucent material with subsurface scattering glow at thin edges | Medium | `[ ]` |
| 200 | Hammered Metal | Dimpled metal surface with per-dimple specular highlights | Medium | `[ ]` |
| 201 | Frosted Metal | Matte brushed finish with fine grain and soft reflections | Easy | `[ ]` |
| 202 | Cracked Earth | Dry mud flat with deep crack network and curled edges | Medium | `[ ]` |

---

## 14. Post-Processing & Utility

Practical effects every graphics developer needs.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 203 | Gaussian Blur | Separable Gaussian kernel applied to procedural content | Easy | `[ ]` |
| 204 | Radial Blur | Blur emanating from a center point — zoom/spin blur | Easy | `[ ]` |
| 205 | Motion Blur | Directional streak blur simulating camera motion | Easy | `[ ]` |
| 206 | Chromatic Aberration | RGB channel offset increasing toward edges — lens fringing | Easy | `[ ]` |
| 207 | Film Grain | Animated photographic grain overlay — adjustable intensity | Easy | `[ ]` |
| 208 | Vignette | Darkened corners and edges — multiple falloff curve options | Easy | `[ ]` |
| 209 | Edge Detection | Sobel/Prewitt filter highlighting edges in generated content | Easy | `[ ]` |
| 210 | Sharpen | Unsharp mask sharpening — edge contrast enhancement | Easy | `[ ]` |
| 211 | Emboss | Directional emboss creating raised/lowered surface illusion | Easy | `[ ]` |
| 212 | Posterize | Reduce color levels to create poster-art flat color bands | Easy | `[ ]` |
| 213 | Bloom / Glow | Bright areas bleed light into surroundings — soft glow | Medium | `[ ]` |
| 214 | Barrel Distortion | Lens barrel/pincushion distortion with adjustable strength | Easy | `[ ]` |
| 215 | Color Grading | Temperature/tint/contrast/saturation adjustments — LUT concept | Easy | `[ ]` |
| 216 | Gradient Map | Remap luminance to a configurable color ramp | Easy | `[ ]` |
| 217 | Threshold | Hard black/white cutoff with animated noise dithering at boundary | Easy | `[ ]` |
| 218 | Channel Mixer | RGB channel remapping — swap/blend color channels | Easy | `[ ]` |
| 219 | Pixelate | Mosaic pixelation at configurable block size | Easy | `[ ]` |
| 220 | Kuwahara Filter | Painterly smoothing that preserves edges — oil painting effect | Hard | `[ ]` |

---

## 15. SDF & Ray Marching

Signed distance fields — the modern shader toolkit.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 221 | SDF Primitives | Circle, box, triangle, star, heart, cross — distance field gallery | Easy | `[ ]` |
| 222 | SDF Booleans | Union, intersection, subtraction of primitive shapes | Easy | `[ ]` |
| 223 | SDF Smooth Blend | Smooth minimum blending shapes together — organic merging | Medium | `[ ]` |
| 224 | SDF Morphing | One shape smoothly morphing into another via lerped distance | Easy | `[ ]` |
| 225 | SDF Repetition | Infinite grid repetition of a shape via modular coordinates | Easy | `[ ]` |
| 226 | SDF Outline | Exact-width outlines, rounded outlines, dashed outlines on shapes | Easy | `[ ]` |
| 227 | SDF Shadow | Soft shadows cast by SDF shapes using ray marching | Medium | `[ ]` |
| 228 | SDF Scene | Composed scene — multiple shapes with lighting and shadows | Medium | `[ ]` |
| 229 | SDF Text | Letter forms rendered as distance fields with glow/shadow | Hard | `[ ]` |
| 230 | 3D Ray March | Simple 3D scene ray-marched with basic lighting — sphere on plane | Hard | `[ ]` |
| 231 | Gyroid Surface | Triply periodic minimal surface — organic lattice structure | Medium | `[ ]` |
| 232 | SDF Noise Displace | Shape boundary displaced by noise — blobby organic forms | Medium | `[ ]` |

---

## 16. Mathematical Visualization

Pure math made visible.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 233 | Sine Wave Sum | Multiple sine waves superimposed — constructive/destructive interference | Easy | `[ ]` |
| 234 | Fourier Series | Square/triangle/sawtooth wave built from harmonics one by one | Medium | `[ ]` |
| 235 | Strange Attractor | Lorenz, Rössler, or Aizawa attractor trajectory rendered as density | Hard | `[ ]` |
| 236 | Phase Portrait | Vector field of a 2D dynamical system with flow lines | Medium | `[ ]` |
| 237 | Complex Mapping | Domain coloring of f(z) = z², z³, sin(z), exp(z) etc. | Medium | `[ ]` |
| 238 | Polar Rose | r = cos(nθ/d) for various n,d producing petal patterns | Easy | `[ ]` |
| 239 | Parametric Surface | Animated parametric curve (butterfly curve, rose, spirals) | Easy | `[ ]` |
| 240 | Vector Field | Arrow grid showing gradient, curl, or divergence of a function | Medium | `[ ]` |
| 241 | Fibonacci Spiral | Golden ratio spiral with sunflower seed arrangement | Easy | `[ ]` |
| 242 | Torus Knot | (p,q) torus knot projected to 2D with depth shading | Medium | `[ ]` |
| 243 | Cycloid Family | Epicycloid, hypocycloid, epitrochoid animations | Easy | `[ ]` |
| 244 | Apollonian Gasket | Circle packing fractal — circles tangent to three neighbors | Hard | `[ ]` |
| 245 | Hopf Fibration | Projection of 3-sphere fiber bundle to 2D — linked circles | Hard | `[ ]` |

---

## 17. Artistic Movements & Styles

Generative art inspired by famous art movements.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 246 | Mondrian | Random rectangular partition filled with red/blue/yellow/white and black borders | Easy | `[ ]` |
| 247 | Bauhaus Circles | Overlapping primary-color circles with geometric composition | Easy | `[ ]` |
| 248 | Art Deco Fans | Radiating fan/sunburst motifs in gold and deep colors | Medium | `[ ]` |
| 249 | Kandinsky | Animated composition of circles, lines, and triangles in Kandinsky's palette | Medium | `[ ]` |
| 250 | Pollock Drip | Splattered paint trajectories building up layered drip painting | Hard | `[ ]` |
| 251 | Rothko Fields | Soft-edged color field rectangles with luminous hovering presence | Easy | `[ ]` |
| 252 | Pop Art Dots | Ben-Day dot pattern with bold flat colors — Lichtenstein style | Easy | `[ ]` |
| 253 | Pointillism | Seurat-style small dots of pure color creating blended image | Medium | `[ ]` |
| 254 | Suprematism | Malevich-inspired floating geometric shapes on white ground | Easy | `[ ]` |
| 255 | De Stijl | Horizontal/vertical black lines with primary color rectangles | Easy | `[ ]` |
| 256 | Impressionist Brush | Short directional brush-stroke texture applied to color noise | Medium | `[ ]` |
| 257 | Cubist Facets | Fragmented overlapping angular views of simple shapes | Hard | `[ ]` |

---

## 18. UI & Motion Design

Effects for app interfaces and transitions.

| # | Shader | Description | Difficulty | Status |
|---|--------|-------------|------------|--------|
| 258 | Loading Spinner | Animated arc spinner with gradient tail — Material/iOS style | Easy | `[ ]` |
| 259 | Progress Ring | Circular progress indicator with smooth animated fill | Easy | `[ ]` |
| 260 | Ripple Touch | Material Design touch ripple expanding from a point | Easy | `[ ]` |
| 261 | Liquid Morph | Shape morphing with inertia overshoot and springy settle | Medium | `[ ]` |
| 262 | Gooey Effect | Sticky/gooey blob separation when elements pull apart | Medium | `[ ]` |
| 263 | Page Curl | Paper page curling back to reveal content underneath | Hard | `[ ]` |
| 264 | Dissolve Transition | Noise-threshold dissolve from one color/image to another | Easy | `[ ]` |
| 265 | Swipe Reveal | Diagonal wipe with feathered edge and slight distortion | Easy | `[ ]` |
| 266 | Shockwave Distort | Expanding ring distortion — notification impact effect | Easy | `[ ]` |
| 267 | Breathing Glow | Smooth sine-pulsing glow ring — "Siri listening" style | Easy | `[ ]` |
| 268 | Confetti Burst | Colorful paper rectangles exploding outward and fluttering down | Medium | `[ ]` |

---

## Summary

| Category | Count |
|----------|-------|
| Gradients & Modern UI | 17 |
| Noise & Procedural | 21 |
| Fractals | 15 |
| Geometry & Patterns | 25 |
| Water & Liquid | 10 |
| Fire & Energy | 10 |
| Sky & Atmosphere | 12 |
| Organic & Biological | 14 |
| Space & Cosmic | 15 |
| Optical & Abstract | 15 |
| Retro & Stylized | 16 |
| Simulations & CA | 17 |
| Materials & Surfaces | 15 |
| Post-Processing | 18 |
| SDF & Ray Marching | 12 |
| Math Visualization | 13 |
| Artistic Movements | 12 |
| UI & Motion Design | 11 |
| **Total** | **268** |

---

## Implementation Priority

### Wave 1 — Gallery Essentials (high-impact, moderate effort)
Mesh Gradient, Mandelbrot, Ocean Surface, Synthwave Sunset, Reaction Diffusion,
Metaballs, Starfield, Lightning, SDF Primitives, Truchet Tiles, Film Grain,
Kaleidoscope, Aurora Borealis, Game of Life, Matrix Rain

### Wave 2 — Visual Variety
Liquid Chrome, Julia Set, Rain on Glass, Volumetric Clouds, Neon Sign,
Hexagonal Grid, Halftone, Fire, Galaxy Spiral, Op Art Waves, Moire,
Brushed Metal, Spirograph, CRT Monitor, Dissolve Transition

### Wave 3 — Deep Cuts
Black Hole, Diamond Facets, Fluid Advection, Reaction Diffusion, Celtic Knot,
Islamic Geometry, DLA Growth, Escher Tessellation, Strange Attractor,
Droste Effect, Pollock Drip, Planet Surface, Ray March 3D

### Wave 4 — Completionists
Everything else — fill out each category systematically.
