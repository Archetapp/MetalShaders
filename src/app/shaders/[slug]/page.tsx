import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import ShaderDetail from "@/components/ShaderDetail";
import { ShaderData, ShaderMeta, ShaderIndex } from "@/types/shader";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function loadShaderData(slug: string): ShaderData | null {
  const shaderDir = path.join(process.cwd(), "public", "shaders", slug);

  const metaPath = path.join(shaderDir, "meta.json");
  if (!fs.existsSync(metaPath)) return null;

  const meta: ShaderMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
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

export async function generateStaticParams() {
  const indexPath = path.join(
    process.cwd(),
    "public",
    "shaders",
    "index.json"
  );
  if (!fs.existsSync(indexPath)) return [];

  const data: ShaderIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
  return data.shaders.map((shader) => ({ slug: shader.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const shader = loadShaderData(slug);
  if (!shader) return { title: "Shader Not Found" };

  return {
    title: `${shader.title} - Metal Shaders Gallery`,
    description: shader.description,
    openGraph: {
      title: `${shader.title} - Metal Shaders`,
      description: shader.description,
    },
  };
}

export default async function ShaderPage({ params }: PageProps) {
  const { slug } = await params;
  const shader = loadShaderData(slug);

  if (!shader) {
    notFound();
  }

  return <ShaderDetail shader={shader} />;
}
