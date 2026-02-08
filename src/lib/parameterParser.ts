import { ShaderParameter } from "@/types/shader";

function getLineNumber(source: string, index: number): number {
  return source.substring(0, index).split("\n").length;
}

export function parseParameters(source: string): ShaderParameter[] {
  const params: ShaderParameter[] = [];
  const lines = source.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineOffset = lines.slice(0, i).join("\n").length + (i > 0 ? 1 : 0);

    const colorMatch = line.match(
      /\b(col\w*)\s*=\s*vec3\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/
    );
    if (colorMatch) {
      const matchIdx = line.indexOf(colorMatch[0]);
      const vec3Start = colorMatch[0].indexOf("vec3");
      const fullStart = lineOffset + matchIdx + vec3Start;
      const vec3Text = colorMatch[0].substring(vec3Start);
      params.push({
        id: `color-${i}`,
        label: formatLabel(colorMatch[1]),
        type: "color",
        value: [
          parseFloat(colorMatch[2]),
          parseFloat(colorMatch[3]),
          parseFloat(colorMatch[4]),
        ],
        lineNumber: i + 1,
        matchStart: fullStart,
        matchEnd: fullStart + vec3Text.length,
        originalText: vec3Text,
      });
    }

    const timeMatch = line.match(/iTime\s*\*\s*([\d.]+)/);
    if (timeMatch) {
      const matchIdx = line.indexOf(timeMatch[0]);
      const numStart = timeMatch[0].indexOf(timeMatch[1]);
      const fullStart = lineOffset + matchIdx + numStart;
      params.push({
        id: `time-speed-${i}`,
        label: "Time Speed",
        type: "float",
        value: parseFloat(timeMatch[1]),
        min: 0.1,
        max: 5.0,
        step: 0.1,
        lineNumber: i + 1,
        matchStart: fullStart,
        matchEnd: fullStart + timeMatch[1].length,
        originalText: timeMatch[1],
      });
    }

    const loopMatch = line.match(/\bi\s*<\s*(\d+)/);
    if (loopMatch && line.includes("for")) {
      const matchIdx = line.indexOf(loopMatch[0]);
      const numStart = loopMatch[0].indexOf(loopMatch[1]);
      const fullStart = lineOffset + matchIdx + numStart;
      params.push({
        id: `loop-${i}`,
        label: "Iterations",
        type: "int",
        value: parseInt(loopMatch[1]),
        min: 1,
        max: 12,
        step: 1,
        lineNumber: i + 1,
        matchStart: fullStart,
        matchEnd: fullStart + loopMatch[1].length,
        originalText: loopMatch[1],
      });
    }

    const uvScaleMatch = line.match(/uv\s*\*=?\s*([\d.]+)/);
    if (uvScaleMatch && !line.includes("iTime") && !line.includes("iResolution")) {
      const matchIdx = line.indexOf(uvScaleMatch[0]);
      const numStart = uvScaleMatch[0].indexOf(uvScaleMatch[1]);
      const fullStart = lineOffset + matchIdx + numStart;
      params.push({
        id: `uv-scale-${i}`,
        label: "UV Scale",
        type: "float",
        value: parseFloat(uvScaleMatch[1]),
        min: 1.0,
        max: 20.0,
        step: 0.5,
        lineNumber: i + 1,
        matchStart: fullStart,
        matchEnd: fullStart + uvScaleMatch[1].length,
        originalText: uvScaleMatch[1],
      });
    }

    const smoothstepMatch = line.match(
      /smoothstep\(\s*([\d.]+)\s*,\s*([\d.]+)/
    );
    if (smoothstepMatch) {
      const matchIdx = line.indexOf(smoothstepMatch[0]);
      const fullStart = lineOffset + matchIdx;
      params.push({
        id: `smoothstep-${i}`,
        label: "Blend Threshold",
        type: "float",
        value: parseFloat(smoothstepMatch[1]),
        min: 0.0,
        max: 1.0,
        step: 0.05,
        lineNumber: i + 1,
        matchStart: fullStart + smoothstepMatch[0].indexOf(smoothstepMatch[1]),
        matchEnd:
          fullStart +
          smoothstepMatch[0].indexOf(smoothstepMatch[1]) +
          smoothstepMatch[1].length,
        originalText: smoothstepMatch[1],
      });
    }
  }

  return params;
}

export function applyParameter(
  source: string,
  param: ShaderParameter,
  newValue: number | [number, number, number]
): string {
  const lines = source.split("\n");
  const lineIdx = param.lineNumber - 1;
  if (lineIdx < 0 || lineIdx >= lines.length) return source;

  const line = lines[lineIdx];

  if (param.type === "color" && Array.isArray(newValue)) {
    const colorRegex = new RegExp(
      escapeRegex(param.originalText).replace(
        /[\d.]+/g,
        "\\s*[\\d.]+\\s*"
      )
    );
    const replacement = `vec3(${newValue[0].toFixed(3)}, ${newValue[1].toFixed(3)}, ${newValue[2].toFixed(3)})`;
    lines[lineIdx] = line.replace(colorRegex, replacement);
  } else if (typeof newValue === "number") {
    const escaped = escapeRegex(param.originalText);
    const regex = new RegExp(escaped);
    const formatted =
      param.type === "int"
        ? String(Math.round(newValue))
        : newValue.toFixed(countDecimals(param.originalText));
    lines[lineIdx] = line.replace(regex, formatted);
  }

  return lines.join("\n");
}

function formatLabel(varName: string): string {
  const withoutPrefix = varName.replace(/^col/, "Color ");
  if (withoutPrefix === "Color ") return "Color";
  const spaced = withoutPrefix.replace(/([a-z])(\d)/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countDecimals(numStr: string): number {
  const parts = numStr.split(".");
  return parts.length > 1 ? parts[1].length : 1;
}
