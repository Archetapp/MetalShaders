import { ShaderMeta, ShaderData, ShaderIndex } from "@/types/shader";

export async function loadShaderIndex(): Promise<ShaderMeta[]> {
  const res = await fetch("/shaders/index.json");
  const data: ShaderIndex = await res.json();
  return data.shaders;
}

export async function loadShaderData(slug: string): Promise<ShaderData> {
  const [metaRes, fragRes, metalRes] = await Promise.all([
    fetch(`/shaders/${slug}/meta.json`),
    fetch(`/shaders/${slug}/shader.frag`),
    fetch(`/shaders/${slug}/shader.metal`),
  ]);

  const meta: ShaderMeta = await metaRes.json();
  const fragSource = await fragRes.text();
  const metalSource = await metalRes.text();

  return { ...meta, fragSource, metalSource };
}

export async function loadShaderIndexStatic(): Promise<ShaderMeta[]> {
  const fs = await import("fs");
  const path = await import("path");
  const indexPath = path.join(process.cwd(), "public", "shaders", "index.json");
  const data: ShaderIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return data.shaders;
}

export async function loadShaderDataStatic(slug: string): Promise<ShaderData> {
  const fs = await import("fs");
  const path = await import("path");
  const shaderDir = path.join(process.cwd(), "public", "shaders", slug);

  const meta: ShaderMeta = JSON.parse(
    fs.readFileSync(path.join(shaderDir, "meta.json"), "utf-8")
  );
  const fragSource = fs.readFileSync(
    path.join(shaderDir, "shader.frag"),
    "utf-8"
  );
  const metalSource = fs.readFileSync(
    path.join(shaderDir, "shader.metal"),
    "utf-8"
  );

  return { ...meta, fragSource, metalSource };
}
