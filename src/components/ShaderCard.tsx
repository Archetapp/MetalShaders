"use client";

import Link from "next/link";
import ShaderCanvas from "./ShaderCanvas";
import { ShaderMeta } from "@/types/shader";
import { useEffect, useState } from "react";

interface ShaderCardProps {
  shader: ShaderMeta;
}

export default function ShaderCard({ shader }: ShaderCardProps) {
  const [fragSource, setFragSource] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/shaders/${shader.slug}/shader.frag`)
      .then((res) => res.text())
      .then(setFragSource)
      .catch(() => setFragSource(null));
  }, [shader.slug]);

  return (
    <Link href={`/shaders/${shader.slug}`}>
      <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
        <figure className="relative overflow-hidden">
          {fragSource ? (
            <ShaderCanvas fragSource={fragSource} width={400} height={300} />
          ) : (
            <div className="w-full bg-base-300 animate-pulse rounded-t-2xl" style={{ aspectRatio: "4/3" }} />
          )}
        </figure>
        <div className="card-body p-4">
          <h2 className="card-title text-base">{shader.title}</h2>
          <p className="text-sm text-base-content/70 line-clamp-2">
            {shader.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {shader.tags.map((tag) => (
              <span key={tag} className="badge badge-outline badge-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
