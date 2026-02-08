"use client";

import ShaderCanvas from "./ShaderCanvas";
import { ShaderMeta } from "@/types/shader";
import { useEffect, useState, useRef } from "react";

interface ShaderCardProps {
  shader: ShaderMeta;
  onExpand: (rect: DOMRect) => void;
  isExpanded?: boolean;
}

export default function ShaderCard({ shader, onExpand, isExpanded }: ShaderCardProps) {
  const [fragSource, setFragSource] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/shaders/${shader.slug}/shader.frag`)
      .then((res) => res.text())
      .then(setFragSource)
      .catch(() => setFragSource(null));
  }, [shader.slug]);

  const handleExpand = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) onExpand(rect);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleExpand}
      className={`shader-preview group rounded-2xl overflow-hidden cursor-pointer h-full transition-opacity duration-300 ${
        isExpanded ? "opacity-0" : "opacity-100"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleExpand();
        }
      }}
    >
      <div className="relative">
        {fragSource ? (
          <ShaderCanvas fragSource={fragSource} width={400} height={300} />
        ) : (
          <div
            className="w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
            style={{ aspectRatio: "4/3" }}
          />
        )}
        <div className="glass-overlay absolute inset-x-0 bottom-0 px-4 pt-10 pb-4">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            {shader.title}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-1 mb-2">
            {shader.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {shader.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-white/60 text-gray-600 border border-gray-200/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
