"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-gray-900">
            Metal Shaders
          </span>
        </Link>
        <a
          href="https://developer.apple.com/metal/Metal-Shading-Language-Specification.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          MSL Docs
        </a>
      </div>
    </nav>
  );
}
