"use client";

import { useState } from "react";
import Link from "next/link";
import ShaderCanvas from "./ShaderCanvas";
import CodeBlock from "./CodeBlock";
import { ShaderData } from "@/types/shader";

interface ShaderDetailProps {
  shader: ShaderData;
}

export default function ShaderDetail({ shader }: ShaderDetailProps) {
  const [activeTab, setActiveTab] = useState<"metal" | "glsl">("metal");

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/" className="btn btn-ghost btn-sm gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Gallery
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{shader.title}</h1>
          <p className="text-base-content/70 mb-3">{shader.description}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {shader.tags.map((tag) => (
              <span key={tag} className="badge badge-outline">{tag}</span>
            ))}
          </div>
          <p className="text-xs text-base-content/50">
            By {shader.author} &middot; {shader.date}
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-base-300 bg-base-200">
          <ShaderCanvas
            fragSource={shader.fragSource}
            width={1024}
            height={576}
            alwaysVisible
          />
        </div>

        <div>
          <div role="tablist" className="tabs tabs-bordered mb-4">
            <button
              role="tab"
              className={`tab ${activeTab === "metal" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("metal")}
            >
              Metal (.metal)
            </button>
            <button
              role="tab"
              className={`tab ${activeTab === "glsl" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("glsl")}
            >
              GLSL (.frag)
            </button>
          </div>

          {activeTab === "metal" ? (
            <CodeBlock code={shader.metalSource} language="cpp" />
          ) : (
            <CodeBlock code={shader.fragSource} language="glsl" />
          )}
        </div>
      </div>
    </div>
  );
}
