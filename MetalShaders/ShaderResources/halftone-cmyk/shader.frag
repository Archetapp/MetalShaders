#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 htRotate(vec2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

float htDotScreen(vec2 uv, float angle, float scale, float intensity) {
    vec2 rotUV = htRotate(uv, angle);
    vec2 grid = fract(rotUV * scale) - 0.5;
    float d = length(grid);
    float r = intensity * 0.5;
    return smoothstep(r + 0.02, r - 0.02, d);
}

vec3 htSourceColor(vec2 uv, float t) {
    vec3 col = vec3(0.0);
    col.r = 0.5 + 0.5 * sin(uv.x * 3.0 + t);
    col.g = 0.5 + 0.5 * sin(uv.y * 3.0 + t * 1.3 + 2.0);
    col.b = 0.5 + 0.5 * sin((uv.x + uv.y) * 2.0 + t * 0.7 + 4.0);

    float swirl = sin(length(uv) * 5.0 - t * 2.0) * 0.3;
    col += swirl;
    col = clamp(col, 0.0, 1.0);
    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    vec3 src = htSourceColor(uv, t);

    float c = 1.0 - src.r;
    float m = 1.0 - src.g;
    float y = 1.0 - src.b;
    float k = min(c, min(m, y));
    c = (c - k) / (1.0 - k + 0.001);
    m = (m - k) / (1.0 - k + 0.001);
    y = (y - k) / (1.0 - k + 0.001);

    float scale = 30.0;
    float cDot = htDotScreen(uv, 0.261, scale, c);
    float mDot = htDotScreen(uv, 1.309, scale, m);
    float yDot = htDotScreen(uv, 0.0, scale, y);
    float kDot = htDotScreen(uv, 0.785, scale, k);

    vec3 paper = vec3(0.95, 0.93, 0.88);
    vec3 col = paper;
    col = mix(col, col * vec3(0.0, 1.0, 1.0), cDot * 0.85);
    col = mix(col, col * vec3(1.0, 0.0, 1.0), mDot * 0.85);
    col = mix(col, col * vec3(1.0, 1.0, 0.0), yDot * 0.85);
    col = mix(col, col * vec3(0.0), kDot * 0.9);

    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * 0.02;

    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
