"use client";

interface ShaderErrorProps {
  error: string;
}

export default function ShaderError({ error }: ShaderErrorProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-error/10 backdrop-blur-sm rounded-t-2xl">
      <div className="text-center p-4 max-w-full">
        <svg
          className="w-8 h-8 mx-auto mb-2 text-error"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="text-error text-xs font-mono break-all line-clamp-3">
          {error}
        </p>
      </div>
    </div>
  );
}
