#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float valueHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float valueNoiseFn(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    float a = valueHash(i);
    float b = valueHash(i + vec2(1.0, 0.0));
    float c = valueHash(i + vec2(0.0, 1.0));
    float d = valueHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float valueFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.866, 0.5, -0.5, 0.866);
    for (int i = 0; i < 7; i++) {
        v += a * valueNoiseFn(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.15;
    
    float n = valueFbm(uv * 6.0 + t);
    
    vec3 col = vec3(n);
    col.r = valueFbm(uv * 6.0 + t + vec2(1.7, 9.2));
    col.g = valueFbm(uv * 6.0 + t + vec2(5.2, 1.3));
    col.b = valueFbm(uv * 6.0 + t + vec2(2.8, 3.4));
    
    col = smoothstep(0.2, 0.8, col);
    
    fragColor = vec4(col, 1.0);
}
