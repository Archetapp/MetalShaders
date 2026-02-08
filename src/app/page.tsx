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
    <main className="container mx-auto px-6 pt-10 pb-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
          Shader Gallery
        </h1>
        <p className="text-lg text-gray-500">
          Live Metal shader previews. Click to explore the source.
        </p>
      </div>
      <ShaderGrid shaders={shaders} />
    </main>
  );
}
