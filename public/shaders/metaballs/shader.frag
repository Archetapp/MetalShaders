#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.6;

    vec2 b1 = vec2(sin(t * 0.7) * 0.4, cos(t * 0.9) * 0.3);
    vec2 b2 = vec2(cos(t * 0.8) * 0.35, sin(t * 1.1) * 0.35);
    vec2 b3 = vec2(sin(t * 1.0 + 2.0) * 0.3, cos(t * 0.6 + 1.0) * 0.4);
    vec2 b4 = vec2(cos(t * 0.5 + 3.0) * 0.45, sin(t * 0.7 + 2.0) * 0.25);
    vec2 b5 = vec2(sin(t * 0.9 + 1.5) * 0.25, cos(t * 1.2 + 0.5) * 0.35);

    float r1 = 0.15, r2 = 0.12, r3 = 0.18, r4 = 0.1, r5 = 0.13;

    float f = 0.0;
    f += r1 * r1 / dot(uv - b1, uv - b1);
    f += r2 * r2 / dot(uv - b2, uv - b2);
    f += r3 * r3 / dot(uv - b3, uv - b3);
    f += r4 * r4 / dot(uv - b4, uv - b4);
    f += r5 * r5 / dot(uv - b5, uv - b5);

    vec3 col1 = vec3(0.9, 0.2, 0.4);
    vec3 col2 = vec3(0.2, 0.6, 0.9);
    vec3 col3 = vec3(0.1, 0.9, 0.5);
    vec3 col4 = vec3(0.9, 0.6, 0.1);
    vec3 col5 = vec3(0.6, 0.2, 0.9);

    float w1 = r1 * r1 / dot(uv - b1, uv - b1);
    float w2 = r2 * r2 / dot(uv - b2, uv - b2);
    float w3 = r3 * r3 / dot(uv - b3, uv - b3);
    float w4 = r4 * r4 / dot(uv - b4, uv - b4);
    float w5 = r5 * r5 / dot(uv - b5, uv - b5);

    vec3 col = (col1 * w1 + col2 * w2 + col3 * w3 + col4 * w4 + col5 * w5) / f;

    float edge = smoothstep(0.95, 1.05, f);
    float glow = smoothstep(0.5, 1.0, f);

    vec3 bg = vec3(0.02, 0.02, 0.05);
    vec3 glowCol = col * 0.3;

    vec3 finalCol = bg;
    finalCol = mix(finalCol, glowCol, glow * (1.0 - edge));
    finalCol = mix(finalCol, col, edge);

    float highlight = smoothstep(1.3, 1.8, f);
    finalCol += vec3(0.3) * highlight;

    fragColor = vec4(finalCol, 1.0);
}
