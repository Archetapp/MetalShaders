"use client";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  allTags,
  selectedTags,
  onTagToggle,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <div className="relative max-w-md">
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
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
              selectedTags.includes(tag)
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white/60 text-gray-600 border border-gray-200/80 hover:bg-white hover:border-gray-300"
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
