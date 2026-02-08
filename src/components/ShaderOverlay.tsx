"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  type ChangeEvent,
} from "react";
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
  const [detailsVisible, setDetailsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const recompileRef = useRef<((src: string) => string | null) | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tiltAnim = useRef<number | null>(null);
  const tilt = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const tiltHovered = useRef(false);

  const DEFAULT_BG_URL =
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1280&q=80";
  const BLEND_MODES = [
    { value: "screen", label: "Screen" },
    { value: "multiply", label: "Multiply" },
    { value: "overlay", label: "Overlay" },
    { value: "soft-light", label: "Soft Light" },
    { value: "difference", label: "Difference" },
    { value: "normal", label: "Normal" },
  ] as const;

  const [bgEnabled, setBgEnabled] = useState(false);
  const [bgImageUrl, setBgImageUrl] = useState(DEFAULT_BG_URL);
  const [blendMode, setBlendMode] = useState("screen");
  const customBgRef = useRef<string | null>(null);

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
    const hero = heroRef.current;
    if (!hero) return;

    const heroRect = hero.getBoundingClientRect();
    const scaleX = sourceRect.width / heroRect.width;
    const scaleY = sourceRect.height / heroRect.height;
    const dx =
      sourceRect.left +
      sourceRect.width / 2 -
      (heroRect.left + heroRect.width / 2);
    const dy =
      sourceRect.top +
      sourceRect.height / 2 -
      (heroRect.top + heroRect.height / 2);

    hero.style.transition = "none";
    hero.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    hero.style.opacity = "1";

    hero.offsetHeight;

    hero.style.transition =
      "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";
    hero.style.transform = "none";

    requestAnimationFrame(() => setBackdropVisible(true));
    setTimeout(() => setDetailsVisible(true), 150);
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

    setDetailsVisible(false);
    setBackdropVisible(false);

    const hero = heroRef.current;
    const scrollContainer = scrollRef.current;
    const scrolledFar = scrollContainer && scrollContainer.scrollTop > 150;

    if (hero && !scrolledFar) {
      const heroRect = hero.getBoundingClientRect();
      const scaleX = sourceRect.width / heroRect.width;
      const scaleY = sourceRect.height / heroRect.height;
      const dx =
        sourceRect.left +
        sourceRect.width / 2 -
        (heroRect.left + heroRect.width / 2);
      const dy =
        sourceRect.top +
        sourceRect.height / 2 -
        (heroRect.top + heroRect.height / 2);

      hero.style.transition =
        "transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)";
      hero.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;

      setTimeout(onClose, 400);
    } else if (hero) {
      hero.style.transition = "opacity 0.3s ease";
      hero.style.opacity = "0";
      setTimeout(onClose, 300);
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

  const ensureTiltLoop = useCallback(() => {
    if (tiltAnim.current) return;
    const tick = () => {
      const t = tilt.current;
      const el = heroInnerRef.current;
      t.cx += (t.tx - t.cx) * 0.1;
      t.cy += (t.ty - t.cy) * 0.1;
      if (el) {
        el.style.transform = `perspective(1200px) rotateX(${t.cx}deg) rotateY(${t.cy}deg) scale3d(1.01, 1.01, 1)`;
        const lift = Math.abs(t.cx) + Math.abs(t.cy);
        const shadowX = t.cy * -1;
        const shadowY = 8 + t.cx * 1;
        el.style.boxShadow = `${shadowX}px ${shadowY}px ${30 + lift}px rgba(0,0,0,${(0.15 + lift * 0.005).toFixed(3)})`;
      }
      const settled = Math.abs(t.cx - t.tx) < 0.05 && Math.abs(t.cy - t.ty) < 0.05;
      if (tiltHovered.current || !settled) {
        tiltAnim.current = requestAnimationFrame(tick);
      } else {
        tiltAnim.current = null;
        t.cx = t.tx = 0;
        t.cy = t.ty = 0;
        if (el) {
          el.style.transform = "";
          el.style.boxShadow = "";
        }
      }
    };
    tiltAnim.current = requestAnimationFrame(tick);
  }, []);

  const handleHeroMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = heroInnerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      tilt.current.tx = (ny - 0.5) * -12;
      tilt.current.ty = (nx - 0.5) * 12;
      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`;
        glareRef.current.style.opacity = "1";
      }
    },
    []
  );

  const handleHeroMouseEnter = useCallback(() => {
    tiltHovered.current = true;
    ensureTiltLoop();
  }, [ensureTiltLoop]);

  const handleHeroMouseLeave = useCallback(() => {
    tiltHovered.current = false;
    tilt.current.tx = 0;
    tilt.current.ty = 0;
    if (glareRef.current) glareRef.current.style.opacity = "0";
    ensureTiltLoop();
  }, [ensureTiltLoop]);

  useEffect(() => {
    return () => {
      if (tiltAnim.current) cancelAnimationFrame(tiltAnim.current);
      if (customBgRef.current) URL.revokeObjectURL(customBgRef.current);
    };
  }, []);

  const handleBgUpload = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (customBgRef.current) URL.revokeObjectURL(customBgRef.current);
    const url = URL.createObjectURL(file);
    customBgRef.current = url;
    setBgImageUrl(url);
  }, []);

  const handleBgReset = useCallback(() => {
    if (customBgRef.current) {
      URL.revokeObjectURL(customBgRef.current);
      customBgRef.current = null;
    }
    setBgImageUrl(DEFAULT_BG_URL);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          backdropVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      />

      <div
        ref={scrollRef}
        className="fixed inset-0 overflow-y-auto"
        onClick={handleClose}
      >
        <div className="min-h-full flex items-start justify-center py-8 px-4 md:px-8">
          <div className="w-full max-w-4xl flex flex-col gap-4 pointer-events-none">
            <div
              ref={heroRef}
              className="pointer-events-auto"
              style={{ transformOrigin: "center center" }}
              onClick={(e) => e.stopPropagation()}
              onMouseMove={handleHeroMouseMove}
              onMouseEnter={handleHeroMouseEnter}
              onMouseLeave={handleHeroMouseLeave}
            >
              <div
                ref={heroInnerRef}
                className="rounded-2xl overflow-hidden shadow-2xl relative"
                style={{ willChange: "transform" }}
              >
                <button
                  onClick={handleClose}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-black/50 hover:text-white transition-colors"
                >
                  <svg
                    className="w-4 h-4"
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

                {editedFragSource ? (
                  <ShaderCanvas
                    fragSource={editedFragSource}
                    width={1024}
                    height={576}
                    alwaysVisible
                    onRecompileReady={handleRecompileReady}
                  />
                ) : (
                  <div
                    className="w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
                    style={{ aspectRatio: "16/9" }}
                  />
                )}

                <div
                  ref={glareRef}
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
                  style={{ opacity: 0, mixBlendMode: "overlay" }}
                />
              </div>
            </div>

            <div
              className={`flex flex-col gap-4 transition-all duration-500 ease-out ${
                detailsVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              <div
                className="glass-card rounded-2xl shadow-lg pointer-events-auto px-6 py-5"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {shader.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {shader.description}
                </p>
                <div className="border-t border-gray-200/60 mt-4 pt-3 flex flex-wrap items-center gap-2">
                  {shader.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-50 text-gray-600 border border-gray-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="text-xs text-gray-400 ml-auto">
                    By {shader.author}
                  </span>
                </div>
              </div>

              {editedFragSource && (
                <div
                  className="pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ParameterControls
                    fragSource={editedFragSource}
                    onSourceChange={handleParameterChange}
                  />
                </div>
              )}

              <div
                className="glass-card rounded-2xl overflow-hidden shadow-lg pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex gap-1 px-4 pt-4 pb-2">
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

                <div className="px-4 pb-4">
                  <div className="rounded-xl overflow-hidden">
                    {activeTab === "glsl" && editedFragSource ? (
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
