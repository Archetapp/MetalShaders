"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ShaderMeta } from "@/types/shader";
import ShaderCard from "./ShaderCard";
import SearchFilter, { SortOption } from "./SearchFilter";
import ShaderOverlay from "./ShaderOverlay";

interface ShaderGridProps {
  shaders: ShaderMeta[];
}

interface ExpandState {
  slug: string;
  rect: DOMRect;
}

const VOTES_STORAGE_KEY = "shader-votes";

export default function ShaderGrid({ shaders }: ShaderGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandState, setExpandState] = useState<ExpandState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [sortVotes, setSortVotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [votingEnabled, setVotingEnabled] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name");

  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem(VOTES_STORAGE_KEY);
    if (stored) {
      try {
        setUserVotes(new Set(JSON.parse(stored)));
      } catch {
        /* ignore corrupt data */
      }
    }

    fetch("/api/votes")
      .then((res) => res.json())
      .then((data: { enabled: boolean; votes?: Record<string, number> }) => {
        if (data.enabled && data.votes) {
          setVotes(data.votes);
          setSortVotes(data.votes);
          setVotingEnabled(true);
          setSortBy("popular");
        }
      })
      .catch(() => {
        setVotingEnabled(false);
      });
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

  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    shaders.forEach((s) => s.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    }));
    return counts;
  }, [shaders]);

  const handleVote = useCallback((slug: string) => {
    const alreadyVoted = userVotes.has(slug);
    const action = alreadyVoted ? "remove" : "upvote";

    setVotes((prev) => ({
      ...prev,
      [slug]: Math.max(0, (prev[slug] || 0) + (alreadyVoted ? -1 : 1)),
    }));

    setUserVotes((prev) => {
      const next = new Set(prev);
      if (alreadyVoted) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });

    fetch(`/api/votes/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }).then((res) => {
      if (!res.ok) throw new Error("Vote failed");
    }).catch(() => {
      /* revert on failure */
      setVotes((prev) => ({
        ...prev,
        [slug]: Math.max(0, (prev[slug] || 0) + (alreadyVoted ? 1 : -1)),
      }));
      setUserVotes((prev) => {
        const next = new Set(prev);
        if (alreadyVoted) {
          next.add(slug);
        } else {
          next.delete(slug);
        }
        localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify([...next]));
        return next;
      });
    });
  }, [userVotes]);

  const filteredAndSortedShaders = useMemo(() => {
    const filtered = shaders.filter((shader) => {
      const matchesSearch =
        searchQuery === "" ||
        shader.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shader.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => shader.tags.includes(tag));

      return matchesSearch && matchesTags;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "popular":
        sorted.sort((a, b) => {
          const diff = (sortVotes[b.slug] || 0) - (sortVotes[a.slug] || 0);
          return diff !== 0 ? diff : a.title.localeCompare(b.title);
        });
        break;
      case "name":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "type":
        sorted.sort((a, b) => {
          const tagA = a.tags[0] || "";
          const tagB = b.tags[0] || "";
          const tagDiff = tagA.localeCompare(tagB);
          return tagDiff !== 0 ? tagDiff : a.title.localeCompare(b.title);
        });
        break;
    }

    return sorted;
  }, [shaders, searchQuery, selectedTags, sortBy, sortVotes]);

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
        tagCounts={tagCounts}
        sortBy={sortBy}
        onSortChange={setSortBy}
        votingEnabled={votingEnabled}
      />

      {filteredAndSortedShaders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-gray-400">No shaders found</p>
          <p className="text-sm text-gray-300 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedShaders.map((shader) => (
            <ShaderCard
              key={shader.slug}
              shader={shader}
              onExpand={(rect) =>
                setExpandState({ slug: shader.slug, rect })
              }
              isExpanded={expandState?.slug === shader.slug}
              overlayOpen={!!expandState}
              voteCount={votes[shader.slug] || 0}
              hasVoted={userVotes.has(shader.slug)}
              onVote={handleVote}
              votingEnabled={votingEnabled}
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
