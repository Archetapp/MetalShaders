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
      <ShaderGrid shaders={shaders} />
    </main>
  );
}
