import fs from "fs";
import path from "path";
import ShaderGrid from "@/components/ShaderGrid";
import { ShaderIndex } from "@/types/shader";

function loadShaders() {
  const indexPath = path.join(process.cwd(), "public", "shaders", "index.json");
  if (!fs.existsSync(indexPath)) {
    return [];
  }
  const data: ShaderIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return data.shaders;
}

export default function Home() {
  const shaders = loadShaders();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Shader Gallery</h1>
        <p className="text-base-content/70">
          Browse Metal shaders with live previews. Click any shader to view the
          full source code.
        </p>
      </div>
      <ShaderGrid shaders={shaders} />
    </main>
  );
}
