#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float leafShape(vec2 p) {
    p.x *= 1.8;
    float r = length(p);
    float a = atan(p.y, p.x);
    float leaf = 0.3 * (1.0 + 0.1 * sin(a * 2.0)) * (cos(a) * 0.5 + 0.5);
    return smoothstep(0.01, -0.01, r - leaf);
}

float leafVeinLine(vec2 p, vec2 a, vec2 b, float w) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return smoothstep(w, w * 0.2, length(pa - ba * h));
}

float leafVeinPattern(vec2 uv) {
    float veins = 0.0;
    float mainVein = leafVeinLine(uv, vec2(-0.25, 0.0), vec2(0.2, 0.0), 0.004);
    veins += mainVein;

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float x = -0.15 + fi * 0.04;
        float side = 1.0;
        float angle = 0.6 + fi * 0.05;
        vec2 start = vec2(x, 0.0);
        vec2 end = start + vec2(cos(angle), sin(angle)) * (0.08 + fi * 0.01);
        veins += leafVeinLine(uv, start, end, 0.002);
        end = start + vec2(cos(-angle), sin(-angle)) * (0.08 + fi * 0.01);
        veins += leafVeinLine(uv, start, end, 0.002);
    }
    return clamp(veins, 0.0, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    uv.x += 0.05 * sin(iTime * 0.5);

    vec3 col = vec3(0.05, 0.08, 0.03);

    float leaf = leafShape(uv);
    vec3 leafCol = mix(vec3(0.15, 0.45, 0.1), vec3(0.3, 0.6, 0.15), uv.x + 0.5);
    leafCol += 0.1 * sin(iTime + uv.x * 10.0);

    float veins = leafVeinPattern(uv);
    vec3 veinCol = vec3(0.2, 0.55, 0.15);
    leafCol = mix(leafCol, veinCol, veins * 0.6);

    float pulse = 0.5 + 0.5 * sin(iTime * 2.0 - length(uv) * 8.0);
    leafCol += veins * pulse * vec3(0.0, 0.15, 0.05);

    col = mix(col, leafCol, leaf);

    fragColor = vec4(col, 1.0);
}
