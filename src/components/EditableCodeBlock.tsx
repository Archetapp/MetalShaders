"use client";

import { useState, useCallback, useRef } from "react";
import Editor, { type OnMount, type Monaco } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface EditableCodeBlockProps {
  code: string;
  language: string;
  onChange: (code: string) => void;
}

const GLSL_LANGUAGE_ID = "glsl";

function registerGlslLanguage(monaco: Monaco) {
  if (monaco.languages.getLanguages().some((l: { id: string }) => l.id === GLSL_LANGUAGE_ID))
    return;

  monaco.languages.register({ id: GLSL_LANGUAGE_ID });

  monaco.languages.setMonarchTokensProvider(GLSL_LANGUAGE_ID, {
    keywords: [
      "attribute", "const", "uniform", "varying", "break", "continue",
      "do", "for", "while", "if", "else", "in", "out", "inout",
      "discard", "return", "struct", "void", "precision", "highp",
      "mediump", "lowp", "flat", "smooth", "layout", "centroid",
      "switch", "case", "default",
    ],
    typeKeywords: [
      "float", "int", "uint", "bool", "double",
      "vec2", "vec3", "vec4", "ivec2", "ivec3", "ivec4",
      "uvec2", "uvec3", "uvec4", "bvec2", "bvec3", "bvec4",
      "dvec2", "dvec3", "dvec4",
      "mat2", "mat3", "mat4", "mat2x2", "mat2x3", "mat2x4",
      "mat3x2", "mat3x3", "mat3x4", "mat4x2", "mat4x3", "mat4x4",
      "sampler2D", "sampler3D", "samplerCube", "sampler2DShadow",
      "sampler2DArray", "isampler2D", "usampler2D",
    ],
    builtins: [
      "gl_Position", "gl_FragCoord", "gl_FragColor", "gl_PointSize",
      "gl_VertexID", "gl_InstanceID", "gl_FrontFacing", "gl_PointCoord",
    ],
    operators: [
      "=", ">", "<", "!", "~", "?", ":",
      "==", "<=", ">=", "!=", "&&", "||", "++", "--",
      "+", "-", "*", "/", "&", "|", "^", "%", "<<", ">>",
      "+=", "-=", "*=", "/=", "&=", "|=", "^=", "%=", "<<=", ">>=",
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    tokenizer: {
      root: [
        [/#\w+/, "keyword.directive"],
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@keywords": "keyword",
            "@typeKeywords": "type",
            "@builtins": "variable.predefined",
            "@default": "identifier",
          },
        }],
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/@symbols/, {
          cases: {
            "@operators": "operator",
            "@default": "",
          },
        }],
        [/\d*\.\d+([eE][\-+]?\d+)?/, "number.float"],
        [/\d+/, "number"],
        [/[;,.]/, "delimiter"],
      ],
      whitespace: [
        [/[ \t\r\n]+/, "white"],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],
    },
  });

  const glslBuiltins = [
    "sin", "cos", "tan", "asin", "acos", "atan",
    "pow", "exp", "log", "exp2", "log2", "sqrt", "inversesqrt",
    "abs", "sign", "floor", "ceil", "fract", "mod", "min", "max", "clamp",
    "mix", "step", "smoothstep", "length", "distance", "dot", "cross",
    "normalize", "reflect", "refract", "faceforward",
    "matrixCompMult", "transpose", "inverse", "determinant",
    "lessThan", "lessThanEqual", "greaterThan", "greaterThanEqual",
    "equal", "notEqual", "any", "all", "not",
    "texture", "textureLod", "textureProj", "textureGrad",
    "dFdx", "dFdy", "fwidth",
    "radians", "degrees", "sinh", "cosh", "tanh",
    "trunc", "round", "roundEven", "isnan", "isinf",
  ];

  monaco.languages.registerCompletionItemProvider(GLSL_LANGUAGE_ID, {
    provideCompletionItems: (model: editor.ITextModel, position: { lineNumber: number; column: number }) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = glslBuiltins.map((fn) => ({
        label: fn,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: fn,
        range,
      }));

      return { suggestions };
    },
  });
}

function defineEditorTheme(monaco: Monaco) {
  monaco.editor.defineTheme("shader-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "C678DD" },
      { token: "keyword.directive", foreground: "E06C75" },
      { token: "type", foreground: "E5C07B" },
      { token: "variable.predefined", foreground: "E06C75" },
      { token: "number", foreground: "D19A66" },
      { token: "number.float", foreground: "D19A66" },
      { token: "comment", foreground: "5C6370", fontStyle: "italic" },
      { token: "string", foreground: "98C379" },
      { token: "operator", foreground: "56B6C2" },
    ],
    colors: {
      "editor.background": "#282c34",
      "editor.foreground": "#ABB2BF",
      "editorLineNumber.foreground": "#5C6370",
      "editorLineNumber.activeForeground": "#ABB2BF",
      "editor.selectionBackground": "#3E4451",
      "editor.lineHighlightBackground": "#2C313A",
      "editorCursor.foreground": "#528BFF",
      "editorWhitespace.foreground": "#3B4048",
    },
  });
}

export default function EditableCodeBlock({
  code,
  language,
  onChange,
}: EditableCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const lineCount = code.split("\n").length;
  const editorHeight = Math.min(Math.max(lineCount * 20 + 16, 200), 600);

  const handleCopy = useCallback(async () => {
    const value = editorRef.current?.getValue() ?? code;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      registerGlslLanguage(monaco);
      defineEditorTheme(monaco);
      monaco.editor.setTheme("shader-dark");
    },
    []
  );

  const monacoLanguage = language === "glsl" ? GLSL_LANGUAGE_ID : language;

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-20 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <div style={{ borderRadius: "0.75rem", overflow: "hidden" }}>
        <Editor
          height={editorHeight}
          language={monacoLanguage}
          value={code}
          onChange={(value) => onChange(value ?? "")}
          onMount={handleMount}
          theme="vs-dark"
          loading={
            <div
              className="bg-[#282c34] animate-pulse"
              style={{ height: editorHeight }}
            />
          }
          options={{
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Menlo, Monaco, 'Courier New', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
            bracketPairColorization: { enabled: true },
            renderLineHighlight: "line",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            contextmenu: true,
            suggest: {
              showKeywords: true,
              showFunctions: true,
              showVariables: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
