"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import SubmitShaderModal from "./SubmitShaderModal";

export type SortOption = "popular" | "name" | "type";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  tagCounts: Record<string, number>;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  votingEnabled: boolean;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "name", label: "Name" },
  { value: "type", label: "Type" },
];

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  allTags,
  selectedTags,
  onTagToggle,
  tagCounts,
  sortBy,
  onSortChange,
  votingEnabled,
}: SearchFilterProps) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (paletteOpen) {
      document.body.style.overflow = "hidden";
      setPaletteSearch("");
      requestAnimationFrame(() => paletteInputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [paletteOpen]);

  const filteredTags = useMemo(() => {
    if (!paletteSearch) return allTags;
    const q = paletteSearch.toLowerCase();
    return allTags.filter((tag) => tag.toLowerCase().includes(q));
  }, [allTags, paletteSearch]);

  const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
  const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search shaders..."
            className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer bg-white/60 border border-gray-200/80 text-gray-600 hover:bg-white hover:border-gray-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filter
          {selectedTags.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-xs font-semibold">
              {selectedTags.length}
            </span>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200">
            {shortcutLabel}
          </kbd>
        </button>

        <div className="flex items-center rounded-xl overflow-hidden border border-gray-200/80">
          {SORT_OPTIONS
            .filter((opt) => votingEnabled || opt.value !== "popular")
            .map((opt) => (
              <button
                key={opt.value}
                onClick={() => onSortChange(opt.value)}
                className={`px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                  sortBy === opt.value
                    ? "bg-gray-900 text-white"
                    : "bg-white/60 text-gray-600 hover:bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <a
            href="https://developer.apple.com/metal/Metal-Shading-Language-Specification.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-black/5"
          >
            MSL Docs
          </a>

          <button
            onClick={() => setSubmitOpen(true)}
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-black/5 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Submit Shader
          </button>

          <a
            href="https://github.com/Archetapp/MetalShaders"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-black/5 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-gray-900 text-white cursor-pointer transition-all duration-200 hover:bg-gray-700"
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
              <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ))}
          <button
            onClick={() => selectedTags.forEach((tag) => onTagToggle(tag))}
            className="px-3 py-1.5 text-sm font-medium rounded-full text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {mounted &&
        paletteOpen &&
        createPortal(
          <CommandPalette
            allTags={allTags}
            filteredTags={filteredTags}
            selectedTags={selectedTags}
            tagCounts={tagCounts}
            paletteSearch={paletteSearch}
            onSearchChange={setPaletteSearch}
            onTagToggle={onTagToggle}
            onClose={() => setPaletteOpen(false)}
            inputRef={paletteInputRef}
          />,
          document.body
        )}

      <SubmitShaderModal open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
}

interface CommandPaletteProps {
  allTags: string[];
  filteredTags: string[];
  selectedTags: string[];
  tagCounts: Record<string, number>;
  paletteSearch: string;
  onSearchChange: (query: string) => void;
  onTagToggle: (tag: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function CommandPalette({
  filteredTags,
  selectedTags,
  tagCounts,
  paletteSearch,
  onSearchChange,
  onTagToggle,
  onClose,
  inputRef,
}: CommandPaletteProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-[480px] mx-4 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl"
        style={{ maxHeight: "70vh" }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/60">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tags..."
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            value={paletteSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200">
            ESC
          </kbd>
        </div>

        <div
          className="overflow-y-auto p-3"
          style={{ maxHeight: "calc(70vh - 110px)" }}
        >
          {filteredTags.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              No tags matching &ldquo;{paletteSearch}&rdquo;
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => onTagToggle(tag)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-gray-900 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    <span className={`ml-1.5 text-xs ${isSelected ? "text-gray-400" : "text-gray-400"}`}>
                      {tagCounts[tag] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200/60 bg-gray-50/50">
          <span className="text-xs text-gray-400">
            {selectedTags.length} tag{selectedTags.length !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
