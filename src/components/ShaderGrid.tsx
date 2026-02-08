"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShaderMeta } from "@/types/shader";
import ShaderCard from "./ShaderCard";
import SearchFilter from "./SearchFilter";
import ShaderOverlay from "./ShaderOverlay";

interface ShaderGridProps {
  shaders: ShaderMeta[];
}

interface ExpandState {
  slug: string;
  rect: DOMRect;
}

export default function ShaderGrid({ shaders }: ShaderGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandState, setExpandState] = useState<ExpandState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (expandState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandState]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    shaders.forEach((s) => s.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [shaders]);

  const filteredShaders = useMemo(() => {
    return shaders.filter((shader) => {
      const matchesSearch =
        searchQuery === "" ||
        shader.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shader.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => shader.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [shaders, searchQuery, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const expandedShader = expandState
    ? shaders.find((s) => s.slug === expandState.slug) ?? null
    : null;

  return (
    <div>
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />

      {filteredShaders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-400">No shaders found</p>
          <p className="text-sm text-gray-300 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShaders.map((shader) => (
            <ShaderCard
              key={shader.slug}
              shader={shader}
              onExpand={(rect) =>
                setExpandState({ slug: shader.slug, rect })
              }
            />
          ))}
        </div>
      )}

      {mounted &&
        expandState &&
        expandedShader &&
        createPortal(
          <ShaderOverlay
            shader={expandedShader}
            sourceRect={expandState.rect}
            onClose={() => setExpandState(null)}
          />,
          document.body
        )}
    </div>
  );
}
