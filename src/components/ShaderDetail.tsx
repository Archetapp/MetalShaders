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
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Gallery
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            {shader.title}
          </h1>
          <p className="text-gray-500 mb-3">{shader.description}</p>
          <div className="flex flex-wrap items-center gap-2">
            {shader.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
              >
                {tag}
              </span>
            ))}
            <span className="text-xs text-gray-400 ml-1">
              By {shader.author}
            </span>
          </div>
        </div>

        <div className="shader-preview rounded-2xl overflow-hidden">
          <ShaderCanvas
            fragSource={shader.fragSource}
            width={1024}
            height={576}
            alwaysVisible
          />
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex gap-1 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "metal"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("metal")}
            >
              Metal
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "glsl"
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("glsl")}
            >
              GLSL
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
