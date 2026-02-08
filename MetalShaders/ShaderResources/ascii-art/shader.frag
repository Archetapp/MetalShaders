#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float asciiChar(vec2 p, float brightness) {
    p = clamp(p, 0.0, 1.0);
    int level = int(brightness * 9.99);

    float px = p.x;
    float py = p.y;
    float d = 1.0;

    if (level <= 1) { return 0.0; }
    if (level == 2) { d = min(d, abs(py - 0.5)); return smoothstep(0.15, 0.05, d); }
    if (level == 3) {
        d = min(abs(px - 0.5), abs(py - 0.5));
        return smoothstep(0.15, 0.05, d) * step(0.2, px) * step(px, 0.8) * step(0.2, py) * step(py, 0.8);
    }
    if (level == 4) {
        d = min(abs(px - 0.5), abs(py - 0.5));
        return smoothstep(0.12, 0.05, d);
    }
    if (level == 5) {
        d = abs(length(p - 0.5) - 0.3);
        return smoothstep(0.1, 0.03, d);
    }
    if (level == 6) {
        float cross1 = abs(px - py);
        float cross2 = abs(px - (1.0 - py));
        d = min(cross1, cross2);
        return smoothstep(0.12, 0.04, d);
    }
    if (level == 7) {
        d = min(min(abs(px - 0.5), abs(py - 0.5)), min(abs(px - py), abs(px - (1.0 - py))));
        return smoothstep(0.1, 0.03, d);
    }
    if (level >= 8) {
        float circle = length(p - 0.5) - 0.35;
        return smoothstep(0.05, -0.05, circle);
    }
    return 0.0;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float cellSize = 8.0;
    vec2 cell = floor(gl_FragCoord.xy / cellSize);
    vec2 cellUV = fract(gl_FragCoord.xy / cellSize);
    vec2 cellCenter = (cell * cellSize + cellSize * 0.5 - 0.5 * iResolution.xy) / iResolution.y;

    float r = length(cellCenter);
    float a = atan(cellCenter.y, cellCenter.x);
    float scene = 0.5 + 0.5 * sin(r * 10.0 - iTime * 2.0 + a * 3.0);
    scene *= smoothstep(0.5, 0.1, r);
    scene += 0.3 * sin(cellCenter.x * 5.0 + iTime) * sin(cellCenter.y * 5.0 + iTime * 0.7);
    scene = clamp(scene, 0.0, 1.0);

    float ch = asciiChar(cellUV, scene);
    vec3 charCol = 0.5 + 0.5 * cos(iTime * 0.5 + cellCenter.xyx * 3.0 + vec3(0.0, 2.0, 4.0));
    vec3 col = mix(vec3(0.02, 0.02, 0.04), charCol, ch);

    fragColor = vec4(col, 1.0);
}
