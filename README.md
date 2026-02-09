# Metal Shaders

A gallery of **339 Metal shaders** with live WebGL previews, side-by-side GLSL and Metal source code, and an interactive editor. Built with Next.js 16, TypeScript, and raw WebGL2.

**Live site:** [metalshaders.vercel.app](https://metalshaders.vercel.app)

## Features

- **Live previews** — Every shader runs in real-time via WebGL2 with a shared context pool for performance
- **Interactive editing** — Modify GLSL code in-browser with Monaco Editor and see changes instantly
- **Dual source code** — View both the GLSL (WebGL) and Metal (MSL) versions of each shader
- **Search and filter** — Find shaders by name, description, or tags with a command palette (`Cmd+K`)
- **Parameter controls** — Adjust uniforms like speed, color, and intensity per shader
- **Community submissions** — Submit your own shaders directly via GitHub Issues

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + DaisyUI v5 |
| Rendering | Raw WebGL2 (no library) |
| Code Editor | Monaco Editor |
| Syntax Highlighting | react-syntax-highlighter |
| Hosting | Vercel |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
public/shaders/
  <slug>/
    meta.json       # Title, description, tags, author
    shader.frag     # GLSL fragment shader
    shader.metal    # Metal shader equivalent

src/
  app/              # Next.js App Router pages
  components/       # React components
    ShaderGrid.tsx      # Main grid with search/filter
    ShaderCard.tsx      # Individual shader card with live preview
    ShaderOverlay.tsx   # Expanded shader detail view
    ShaderCanvas.tsx    # WebGL2 rendering canvas
    EditableCodeBlock.tsx  # Monaco-based shader editor
    CodeBlock.tsx       # Read-only syntax highlighted code
    SearchFilter.tsx    # Search bar, tag filter, action buttons
    SubmitShaderModal.tsx  # Shader submission form
  lib/              # WebGL context pool and utilities
  types/            # TypeScript type definitions

scripts/
  generate-shader-index.ts  # Scans shader dirs -> index.json
```

## Adding a Shader

Create a new directory under `public/shaders/` with three files:

**`meta.json`**
```json
{
  "slug": "my-shader",
  "title": "My Shader",
  "description": "A short description of the effect",
  "tags": ["tag1", "tag2"],
  "author": "Your Name",
  "date": "2026-01-01"
}
```

**`shader.frag`** — GLSL fragment shader (WebGL2 / GLSL ES 3.0)

**`shader.metal`** — Metal Shading Language equivalent

Then regenerate the index:

```bash
npm run generate-index
```

## Contributing

The easiest way to contribute a shader is through the **Submit Shader** button on the site, which opens a pre-filled GitHub Issue. You can also open a PR directly with a new shader directory.

## License

MIT
