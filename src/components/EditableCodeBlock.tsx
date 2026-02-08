"use client";

import { useState, useCallback, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface EditableCodeBlockProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
}

export default function EditableCodeBlock({
  code,
  language,
  onChange,
}: EditableCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    const hl = highlighterRef.current?.querySelector("pre");
    if (ta && hl) {
      hl.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
    }
  }, []);

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-20 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <div className="editable-code-container">
        <div ref={highlighterRef} className="editable-code-highlighter">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            customStyle={{
              margin: 0,
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
              lineHeight: "1.6",
              overflow: "hidden",
            }}
            showLineNumbers
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          className="editable-code-textarea"
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
