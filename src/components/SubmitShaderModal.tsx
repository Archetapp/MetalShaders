"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import CodeBlock from "./CodeBlock";

interface SubmitShaderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SubmitShaderModal({ open, onClose }: SubmitShaderModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [glslCode, setGlslCode] = useState("");
  const [metalCode, setMetalCode] = useState("");
  const [previewTab, setPreviewTab] = useState<"glsl" | "metal">("glsl");

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const isValid = title.trim() && author.trim() && description.trim() && glslCode.trim() && metalCode.trim();

  const handleSubmit = () => {
    if (!isValid) return;

    const issueTitle = `[Shader Submission] ${title.trim()}`;
    const issueBody = [
      `## Shader Submission`,
      ``,
      `**Title:** ${title.trim()}`,
      `**Author:** ${author.trim()}`,
      `**Tags:** ${tags.length > 0 ? tags.join(", ") : "None"}`,
      ``,
      `### Description`,
      description.trim(),
      ``,
      `### GLSL Code`,
      "```glsl",
      glslCode.trim(),
      "```",
      ``,
      `### Metal Code`,
      "```metal",
      metalCode.trim(),
      "```",
    ].join("\n");

    const url = new URL("https://github.com/Archetapp/MetalShaders/issues/new");
    url.searchParams.set("title", issueTitle);
    url.searchParams.set("body", issueBody);

    window.open(url.toString(), "_blank");
  };

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div
        className="relative glass-card rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/6">
          <h2 className="text-lg font-semibold text-gray-900">Submit a Shader</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Aurora Borealis"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Author name *</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name or handle"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your shader does..."
              rows={3}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
            <div className="glass-input rounded-xl px-3 py-2 flex flex-wrap gap-2 items-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-indigo-900 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Type a tag and press Enter" : ""}
                className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none py-0.5"
              />
            </div>
          </div>

          {/* GLSL Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">GLSL Code *</label>
            <textarea
              value={glslCode}
              onChange={(e) => setGlslCode(e.target.value)}
              placeholder="Paste your GLSL fragment shader code..."
              rows={8}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none font-mono"
            />
          </div>

          {/* Metal Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Metal Code *</label>
            <textarea
              value={metalCode}
              onChange={(e) => setMetalCode(e.target.value)}
              placeholder="Paste your Metal shader code..."
              rows={8}
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-none font-mono"
            />
          </div>

          {/* Code Preview */}
          {(glslCode.trim() || metalCode.trim()) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Code Preview</label>
              <div className="flex gap-1 mb-2">
                <button
                  onClick={() => setPreviewTab("glsl")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    previewTab === "glsl"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-black/5"
                  }`}
                >
                  GLSL
                </button>
                <button
                  onClick={() => setPreviewTab("metal")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    previewTab === "metal"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-black/5"
                  }`}
                >
                  Metal
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto rounded-xl">
                <CodeBlock
                  code={previewTab === "glsl" ? glslCode : metalCode}
                  language={previewTab === "glsl" ? "glsl" : "cpp"}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-black/6">
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isValid
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Submit via GitHub Issue
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
