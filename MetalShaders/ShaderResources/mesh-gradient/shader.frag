#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime * 0.3;

    vec2 p1 = vec2(0.3 + 0.2 * sin(t * 0.7), 0.3 + 0.2 * cos(t * 0.9));
    vec2 p2 = vec2(0.7 + 0.15 * cos(t * 0.8), 0.6 + 0.2 * sin(t * 1.1));
    vec2 p3 = vec2(0.5 + 0.25 * sin(t * 0.6), 0.8 + 0.15 * cos(t * 0.7));
    vec2 p4 = vec2(0.2 + 0.2 * cos(t * 1.0), 0.7 + 0.15 * sin(t * 0.5));
    vec2 p5 = vec2(0.8 + 0.15 * sin(t * 0.9), 0.2 + 0.2 * cos(t * 0.6));

    float d1 = exp(-3.0 * length(uv - p1));
    float d2 = exp(-3.5 * length(uv - p2));
    float d3 = exp(-3.0 * length(uv - p3));
    float d4 = exp(-3.5 * length(uv - p4));
    float d5 = exp(-3.0 * length(uv - p5));

    float n = snoise(uv * 2.0 + t * 0.5) * 0.15;

    vec3 col1 = vec3(0.95, 0.4, 0.6);
    vec3 col2 = vec3(0.4, 0.6, 0.95);
    vec3 col3 = vec3(0.6, 0.3, 0.9);
    vec3 col4 = vec3(0.3, 0.85, 0.75);
    vec3 col5 = vec3(0.95, 0.7, 0.3);

    vec3 col = col1 * d1 + col2 * d2 + col3 * d3 + col4 * d4 + col5 * d5;
    float total = d1 + d2 + d3 + d4 + d5 + 0.001;
    col /= total;

    col += n;
    col = clamp(col, 0.0, 1.0);

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
