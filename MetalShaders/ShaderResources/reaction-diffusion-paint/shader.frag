#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float rdpHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float rdpNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(rdpHash(i), rdpHash(i + vec2(1, 0)), f.x),
               mix(rdpHash(i + vec2(0, 1)), rdpHash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float pattern = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        vec2 seedPoint = vec2(sin(fi * 2.1 + 1.0) * 0.3, cos(fi * 1.7 + 0.5) * 0.25);
        float seedTime = fi * 1.2;
        float growthTime = max(0.0, iTime - seedTime);
        float growthRadius = growthTime * 0.08;

        float dist = length(uv - seedPoint);
        if (dist < growthRadius + 0.2) {
            float growMask = smoothstep(growthRadius + 0.1, growthRadius - 0.05, dist);
            float scale = 15.0 + fi * 3.0;
            float n1 = rdpNoise(uv * scale + iTime * 0.1 + fi * 10.0);
            float n2 = rdpNoise(uv * scale * 2.0 - iTime * 0.15 + fi * 20.0);
            float n3 = rdpNoise(uv * scale * 0.5 + vec2(iTime * 0.05));

            float rdPattern = sin(n1 * 10.0 + n2 * 5.0 + dist * 20.0) * 0.5 + 0.5;
            rdPattern *= sin(n2 * 8.0 - n3 * 6.0 + atan(uv.y - seedPoint.y, uv.x - seedPoint.x) * 3.0) * 0.5 + 0.5;
            rdPattern = smoothstep(0.3, 0.7, rdPattern);

            pattern += rdPattern * growMask;
        }
    }
    pattern = clamp(pattern, 0.0, 1.0);

    vec3 bg = vec3(0.95, 0.93, 0.88);
    vec3 patternColor1 = vec3(0.1, 0.3, 0.5);
    vec3 patternColor2 = vec3(0.5, 0.15, 0.2);
    float colorMix = rdpNoise(uv * 3.0 + iTime * 0.02);
    vec3 patternColor = mix(patternColor1, patternColor2, colorMix);

    vec3 col = mix(bg, patternColor, pattern);
    float edge = abs(dFdx(pattern)) + abs(dFdy(pattern));
    col += edge * 0.3;

    fragColor = vec4(col, 1.0);
}
