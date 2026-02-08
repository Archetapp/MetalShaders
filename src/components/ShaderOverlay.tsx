"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { ShaderMeta } from "@/types/shader";
import ShaderCanvas from "./ShaderCanvas";
import CodeBlock from "./CodeBlock";
import EditableCodeBlock from "./EditableCodeBlock";
import ParameterControls from "./ParameterControls";

interface ShaderOverlayProps {
  shader: ShaderMeta;
  sourceRect: DOMRect;
  onClose: () => void;
}

export default function ShaderOverlay({
  shader,
  sourceRect,
  onClose,
}: ShaderOverlayProps) {
  const [fragSource, setFragSource] = useState<string | null>(null);
  const [metalSource, setMetalSource] = useState<string | null>(null);
  const [editedFragSource, setEditedFragSource] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"metal" | "glsl">("glsl");
  const [backdropVisible, setBackdropVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const recompileRef = useRef<((src: string) => string | null) | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/shaders/${shader.slug}/shader.frag`).then((r) => r.text()),
      fetch(`/shaders/${shader.slug}/shader.metal`).then((r) => r.text()),
    ]).then(([frag, metal]) => {
      setFragSource(frag);
      setEditedFragSource(frag);
      setMetalSource(metal);
    });
  }, [shader.slug]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const finalRect = panel.getBoundingClientRect();
    const scaleX = sourceRect.width / finalRect.width;
    const scaleY = sourceRect.height / finalRect.height;
    const dx =
      sourceRect.left +
      sourceRect.width / 2 -
      (finalRect.left + finalRect.width / 2);
    const dy =
      sourceRect.top +
      sourceRect.height / 2 -
      (finalRect.top + finalRect.height / 2);

    panel.style.transition = "none";
    panel.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    panel.style.opacity = "0.4";
    panel.style.borderRadius = "1rem";

    panel.offsetHeight;

    panel.style.transition =
      "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease, border-radius 0.4s ease";
    panel.style.transform = "none";
    panel.style.opacity = "1";
    panel.style.borderRadius = "";

    requestAnimationFrame(() => setBackdropVisible(true));
  }, [sourceRect]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    setBackdropVisible(false);

    const panel = panelRef.current;
    if (panel) {
      const currentRect = panel.getBoundingClientRect();
      const scaleX = sourceRect.width / currentRect.width;
      const scaleY = sourceRect.height / currentRect.height;
      const dx =
        sourceRect.left +
        sourceRect.width / 2 -
        (currentRect.left + currentRect.width / 2);
      const dy =
        sourceRect.top +
        sourceRect.height / 2 -
        (currentRect.top + currentRect.height / 2);

      panel.style.transition =
        "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease, border-radius 0.35s ease";
      panel.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
      panel.style.opacity = "0";
      panel.style.borderRadius = "1rem";

      setTimeout(onClose, 350);
    } else {
      setTimeout(onClose, 200);
    }
  }, [sourceRect, onClose]);

  const handleCodeChange = useCallback((newCode: string) => {
    setEditedFragSource(newCode);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (recompileRef.current) {
        recompileRef.current(newCode);
      }
    }, 300);
  }, []);

  const handleParameterChange = useCallback((newSource: string) => {
    setEditedFragSource(newSource);
    if (recompileRef.current) {
      recompileRef.current(newSource);
    }
  }, []);

  const handleRecompileReady = useCallback(
    (recompile: (src: string) => string | null) => {
      recompileRef.current = recompile;
    },
    []
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          backdropVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      />

      <div
        className="relative min-h-full flex items-start justify-center py-8 px-4"
        onClick={handleClose}
      >
        <div
          ref={panelRef}
          className="relative w-full max-w-4xl"
          style={{ transformOrigin: "center top" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {shader.title}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {shader.description}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {editedFragSource ? (
              <div className="flex flex-col">
                <div className="shader-preview">
                  <ShaderCanvas
                    fragSource={editedFragSource}
                    width={1024}
                    height={576}
                    alwaysVisible
                    onRecompileReady={handleRecompileReady}
                  />
                </div>

                <div className="px-6 py-4">
                  <ParameterControls
                    fragSource={editedFragSource}
                    onSourceChange={handleParameterChange}
                  />
                </div>

                <div className="px-6 pb-6">
                  <div className="flex gap-1 mb-4">
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        activeTab === "glsl"
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveTab("glsl")}
                    >
                      GLSL (Editable)
                    </button>
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
                  </div>

                  <div className="rounded-xl">
                    {activeTab === "glsl" ? (
                      <EditableCodeBlock
                        code={editedFragSource}
                        language="glsl"
                        onChange={handleCodeChange}
                      />
                    ) : metalSource ? (
                      <CodeBlock code={metalSource} language="cpp" />
                    ) : null}
                  </div>
                </div>

                <div className="px-6 pb-4 flex flex-wrap items-center gap-2 border-t border-gray-200/60 pt-4">
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
            ) : (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
