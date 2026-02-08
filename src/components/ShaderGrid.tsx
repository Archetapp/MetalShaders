"use client";

import { useState, useMemo } from "react";
import { ShaderMeta } from "@/types/shader";
import ShaderCard from "./ShaderCard";
import SearchFilter from "./SearchFilter";

interface ShaderGridProps {
  shaders: ShaderMeta[];
}

export default function ShaderGrid({ shaders }: ShaderGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
        <div className="text-center py-16 text-base-content/50">
          <p className="text-lg">No shaders found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredShaders.map((shader) => (
            <ShaderCard key={shader.slug} shader={shader} />
          ))}
        </div>
      )}
    </div>
  );
}
