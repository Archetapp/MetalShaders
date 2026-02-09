"use client";

import ShaderCanvas from "./ShaderCanvas";
import { ShaderMeta } from "@/types/shader";
import { useEffect, useState, useRef, useCallback } from "react";

interface ShaderCardProps {
  shader: ShaderMeta;
  onExpand: (rect: DOMRect) => void;
  isExpanded?: boolean;
  overlayOpen?: boolean;
  voteCount: number;
  hasVoted: boolean;
  onVote: (slug: string) => void;
  votingEnabled: boolean;
}

export default function ShaderCard({
  shader,
  onExpand,
  isExpanded,
  overlayOpen = false,
  voteCount,
  hasVoted,
  onVote,
  votingEnabled,
}: ShaderCardProps) {
  const [fragSource, setFragSource] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const justDragged = useRef(false);
  const dragCleanup = useRef<(() => void) | null>(null);

  const tilt = useRef({ tx: 0, ty: 0, cx: 0, cy: 0 });
  const pos = useRef({ tx: 0, ty: 0, cx: 0, cy: 0, sx: 0, sy: 0, active: false });
  const scl = useRef({ target: 1, current: 1 });
  const hovered = useRef(false);

  useEffect(() => {
    fetch(`/shaders/${shader.slug}/shader.frag`)
      .then((res) => res.text())
      .then(setFragSource)
      .catch(() => setFragSource(null));
  }, [shader.slug]);

  const applyTransform = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    const t = tilt.current;
    const p = pos.current;
    const s = scl.current;

    t.cx += (t.tx - t.cx) * 0.12;
    t.cy += (t.ty - t.cy) * 0.12;
    p.cx += (p.tx - p.cx) * (p.active ? 0.35 : 0.1);
    p.cy += (p.ty - p.cy) * (p.active ? 0.35 : 0.1);
    s.current += (s.target - s.current) * 0.15;

    card.style.transform = [
      `translate(${p.cx}px, ${p.cy}px)`,
      `perspective(800px)`,
      `rotateX(${t.cx}deg)`,
      `rotateY(${t.cy}deg)`,
      `scale3d(${s.current}, ${s.current}, 1)`,
    ].join(" ");

    const lift = (s.current - 1) * 500;
    const shadowX = t.cy * -0.8;
    const shadowY = 4 + lift + t.cx * 0.8;
    const blur = 16 + lift * 1.5;
    const opacity = 0.06 + lift * 0.004;
    card.style.boxShadow = [
      `${shadowX}px ${shadowY}px ${blur}px rgba(0,0,0,${opacity.toFixed(3)})`,
      `0 2px 6px rgba(0,0,0,0.04)`,
    ].join(", ");
  }, []);

  const ensureLoop = useCallback(() => {
    if (animRef.current) return;

    const tick = () => {
      applyTransform();

      const t = tilt.current;
      const p = pos.current;
      const s = scl.current;
      const settled =
        Math.abs(t.cx - t.tx) < 0.05 &&
        Math.abs(t.cy - t.ty) < 0.05 &&
        Math.abs(p.cx - p.tx) < 0.3 &&
        Math.abs(p.cy - p.ty) < 0.3 &&
        Math.abs(s.current - s.target) < 0.001;

      if (hovered.current || p.active || !settled) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        animRef.current = null;
        t.cx = t.tx = 0;
        t.cy = t.ty = 0;
        p.cx = p.tx = 0;
        p.cy = p.ty = 0;
        s.current = s.target = 1;
        if (cardRef.current) cardRef.current.style.transform = "";
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, [applyTransform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (pos.current.active) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    tilt.current.tx = (ny - 0.5) * -20;
    tilt.current.ty = (nx - 0.5) * 20;

    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${nx * 100}% ${ny * 100}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 60%)`;
      glareRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    hovered.current = true;
    scl.current.target = 1.04;
    ensureLoop();
  }, [ensureLoop]);

  const handleMouseLeave = useCallback(() => {
    hovered.current = false;
    tilt.current.tx = 0;
    tilt.current.ty = 0;
    scl.current.target = 1;
    if (glareRef.current) glareRef.current.style.opacity = "0";
    ensureLoop();
  }, [ensureLoop]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      pos.current.sx = e.clientX;
      pos.current.sy = e.clientY;

      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - pos.current.sx;
        const dy = ev.clientY - pos.current.sy;

        if (!pos.current.active && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
          pos.current.active = true;
          scl.current.target = 1.06;
          if (cardRef.current) {
            cardRef.current.style.zIndex = "20";
            cardRef.current.style.cursor = "grabbing";
          }
        }

        if (pos.current.active) {
          pos.current.tx = dx;
          pos.current.ty = dy;
          ensureLoop();
        }
      };

      const cleanup = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        dragCleanup.current = null;
      };

      const onUp = () => {
        if (pos.current.active) {
          justDragged.current = true;
          requestAnimationFrame(() => {
            justDragged.current = false;
          });
        }

        pos.current.active = false;
        pos.current.tx = 0;
        pos.current.ty = 0;
        scl.current.target = hovered.current ? 1.04 : 1;

        if (cardRef.current) {
          cardRef.current.style.zIndex = "";
          cardRef.current.style.cursor = "";
        }

        cleanup();
        ensureLoop();
      };

      dragCleanup.current = cleanup;
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [ensureLoop]
  );

  const handleClick = useCallback(() => {
    if (justDragged.current) return;
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = "";
    const rect = card.getBoundingClientRect();
    onExpand(rect);
  }, [onExpand]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (dragCleanup.current) dragCleanup.current();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`rounded-2xl overflow-hidden cursor-grab h-full select-none relative ${
        isExpanded ? "opacity-0" : ""
      }`}
      style={{
        willChange: "transform",
        boxShadow:
          "0 4px 16px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)",
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative">
        {fragSource ? (
          <ShaderCanvas fragSource={fragSource} width={400} height={300} paused={overlayOpen} mouseMode={shader.mouseMode} />
        ) : (
          <div
            className="w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse"
            style={{ aspectRatio: "4/3" }}
          />
        )}
        <div className="absolute inset-x-0 top-0 px-4 py-3 bg-gradient-to-b from-black/50 to-transparent flex items-start justify-between">
          <h2 className="text-sm font-semibold text-white drop-shadow-sm">
            {shader.title}
          </h2>
          {votingEnabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote(shader.slug);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer backdrop-blur-sm bg-black/20 hover:bg-black/40"
              aria-label={hasVoted ? "Remove vote" : "Upvote shader"}
            >
              <svg
                className={`w-3.5 h-3.5 transition-all duration-200 ${
                  hasVoted
                    ? "text-red-400 fill-red-400 scale-110"
                    : "text-white/80 fill-none hover:text-red-300"
                }`}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
              {voteCount > 0 && (
                <span className="text-white/90 drop-shadow-sm">
                  {voteCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      <div
        ref={glareRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0, mixBlendMode: "overlay" }}
      />
    </div>
  );
}
