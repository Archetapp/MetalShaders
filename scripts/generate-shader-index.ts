import fs from "fs";
import path from "path";

const SHADERS_DIR = path.join(process.cwd(), "public", "shaders");

interface ShaderMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  mouseMode?: "hover" | "press";
}

function generateIndex() {
  const entries = fs.readdirSync(SHADERS_DIR, { withFileTypes: true });
  const shaders: ShaderMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const metaPath = path.join(SHADERS_DIR, entry.name, "meta.json");
    if (!fs.existsSync(metaPath)) continue;

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as ShaderMeta;
    shaders.push(meta);
  }

  shaders.sort((a, b) => a.title.localeCompare(b.title));

  const indexPath = path.join(SHADERS_DIR, "index.json");
  fs.writeFileSync(indexPath, JSON.stringify({ shaders }, null, 2) + "\n");

  console.log(`Generated index.json with ${shaders.length} shaders`);
}

generateIndex();
