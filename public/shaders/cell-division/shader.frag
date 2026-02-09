#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float cellNoise(vec2 p) {
    return fract(sin(dot(p, vec2(41.1, 289.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.01, 0.02, 0.04);

    float phase = mod(iTime * 0.4, 6.2832);
    float split = smoothstep(0.0, 3.14159, phase);

    float sep = split * 0.2;
    vec2 c1 = vec2(-sep, 0.0);
    vec2 c2 = vec2(sep, 0.0);

    float cellSize1 = 0.25 - split * 0.05;

    float pinch = 1.0 - 0.4 * sin(split * 3.14159);
    float membraneWidth = 0.008;

    float d1 = length((uv - c1) * vec2(1.0, 1.0 / pinch)) - cellSize1;
    float d2 = length((uv - c2) * vec2(1.0, 1.0 / pinch)) - cellSize1;
    float cellDist = min(d1, d2);

    float membrane = smoothstep(membraneWidth, 0.0, abs(cellDist));
    vec3 membraneCol = vec3(0.3, 0.7, 0.4);
    col += membrane * membraneCol;

    float inside = smoothstep(0.01, -0.01, cellDist);
    vec3 cytoplasmCol = vec3(0.08, 0.15, 0.12);
    col = mix(col, cytoplasmCol, inside * 0.8);

    float nucSize = 0.08 * (1.0 - split * 0.3);
    float nuc1 = smoothstep(nucSize + 0.005, nucSize - 0.005, length(uv - c1));
    float nuc2 = smoothstep(nucSize + 0.005, nucSize - 0.005, length(uv - c2));
    vec3 nucCol = vec3(0.2, 0.3, 0.6);
    col = mix(col, nucCol, max(nuc1, nuc2) * inside);

    if (split > 0.1 && split < 0.9) {
        for (int i = 0; i < 10; i++) {
            float fi = float(i);
            float angle = fi * 0.628 + iTime;
            vec2 fiberStart = c1 + vec2(cos(angle), sin(angle)) * nucSize;
            vec2 fiberEnd = c2 + vec2(cos(angle + 3.14159), sin(angle + 3.14159)) * nucSize;
            vec2 pa = uv - fiberStart, ba = fiberEnd - fiberStart;
            float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
            float d = length(pa - ba * h);
            float fiber = smoothstep(0.003, 0.001, d) * inside;
            col += fiber * vec3(0.4, 0.5, 0.2) * 0.3;
        }
    }

    for (int i = 0; i < 15; i++) {
        float fi = float(i);
        vec2 orgPos = vec2(cellNoise(vec2(fi, 0.0)) - 0.5, cellNoise(vec2(0.0, fi)) - 0.5) * 0.35;
        float side = orgPos.x > 0.0 ? 1.0 : -1.0;
        orgPos.x += side * sep * split;
        float orgSize = 0.008 + 0.005 * cellNoise(vec2(fi, fi));
        float org = smoothstep(orgSize, orgSize * 0.3, length(uv - orgPos));
        col += org * vec3(0.3, 0.2, 0.1) * inside * 0.5;
    }

    fragColor = vec4(col, 1.0);
}
