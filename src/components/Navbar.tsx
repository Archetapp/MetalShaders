"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-200 border-b border-base-300">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Metal Shaders
          </Link>
        </div>
        <div className="flex-none gap-2">
          <a
            href="https://developer.apple.com/metal/Metal-Shading-Language-Specification.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            MSL Docs
          </a>
        </div>
      </div>
    </div>
  );
}
