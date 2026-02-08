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
      <input
        type="text"
        placeholder="Search shaders..."
        className="input input-bordered w-full max-w-md"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`badge badge-lg cursor-pointer transition-colors ${
              selectedTags.includes(tag)
                ? "badge-primary"
                : "badge-outline"
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
