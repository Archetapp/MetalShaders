"use client";

import { useMemo, useCallback } from "react";
import { parseParameters, applyParameter } from "@/lib/parameterParser";
import { ShaderParameter } from "@/types/shader";

interface ParameterControlsProps {
  fragSource: string;
  onSourceChange: (newSource: string) => void;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

export default function ParameterControls({
  fragSource,
  onSourceChange,
}: ParameterControlsProps) {
  const params = useMemo(() => parseParameters(fragSource), [fragSource]);

  const handleChange = useCallback(
    (param: ShaderParameter, newValue: number | [number, number, number]) => {
      const updated = applyParameter(fragSource, param, newValue);
      onSourceChange(updated);
    },
    [fragSource, onSourceChange]
  );

  if (params.length === 0) return null;

  return (
    <div className="parameter-controls glass-card rounded-2xl p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Parameters
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {params.map((param) => (
          <ParameterControl
            key={param.id}
            param={param}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
}

function ParameterControl({
  param,
  onChange,
}: {
  param: ShaderParameter;
  onChange: (param: ShaderParameter, value: number | [number, number, number]) => void;
}) {
  if (param.type === "color" && Array.isArray(param.value)) {
    const hexValue = rgbToHex(param.value[0], param.value[1], param.value[2]);
    return (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hexValue}
          onChange={(e) => onChange(param, hexToRgb(e.target.value))}
          className="w-8 h-8 rounded-lg cursor-pointer border border-gray-200/60"
        />
        <span className="text-sm text-gray-700">{param.label}</span>
      </div>
    );
  }

  const numValue = param.value as number;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-700">{param.label}</span>
        <span className="text-gray-400 font-mono text-xs">
          {param.type === "int" ? numValue : numValue.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={param.min ?? 0}
        max={param.max ?? 10}
        step={param.step ?? 0.1}
        value={numValue}
        onChange={(e) => onChange(param, parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-indigo-500"
      />
    </div>
  );
}
