#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float webHash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.02, 0.05);

    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float radialCount = 16.0;
    float radialAngle = mod(a + 3.14159, 6.28318 / radialCount);
    radialAngle = abs(radialAngle - 3.14159 / radialCount);
    float radialThread = smoothstep(0.003, 0.001, radialAngle * r);

    float spiralSpacing = 0.04;
    float spiralOffset = a / 6.28318 * spiralSpacing;
    float spiralDist = mod(r + spiralOffset + iTime * 0.01, spiralSpacing);
    spiralDist = abs(spiralDist - spiralSpacing * 0.5);
    float spiralThread = smoothstep(0.003, 0.001, spiralDist) * step(0.03, r) * step(r, 0.45);

    float web = max(radialThread * step(r, 0.45), spiralThread);
    col += vec3(0.6, 0.6, 0.7) * web;

    for (int i = 0; i < 12; i++) {
        float fi = float(i);
        float dewAngle = webHash(fi * 7.13) * 6.28318;
        float dewR = 0.05 + webHash(fi * 3.71) * 0.35;
        vec2 dewPos = vec2(cos(dewAngle), sin(dewAngle)) * dewR;
        float dewSize = 0.005 + 0.003 * webHash(fi * 11.3);
        float dewDist = length(uv - dewPos);
        float dew = smoothstep(dewSize, dewSize * 0.3, dewDist);
        float sparkle = 0.5 + 0.5 * sin(iTime * 3.0 + fi * 2.0);
        col += dew * mix(vec3(0.3, 0.4, 0.6), vec3(1.0), sparkle * 0.5);
    }

    float vignette = 1.0 - smoothstep(0.3, 0.6, r);
    col *= 0.7 + 0.3 * vignette;

    fragColor = vec4(col, 1.0);
}
