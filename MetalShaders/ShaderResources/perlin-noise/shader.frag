#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 perlinGrad(vec2 p) {
    float a = fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453) * 6.28318;
    return vec2(cos(a), sin(a));
}

float perlinNoise2D(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    
    float a = dot(perlinGrad(i + vec2(0,0)), f - vec2(0,0));
    float b = dot(perlinGrad(i + vec2(1,0)), f - vec2(1,0));
    float c = dot(perlinGrad(i + vec2(0,1)), f - vec2(0,1));
    float d = dot(perlinGrad(i + vec2(1,1)), f - vec2(1,1));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y) * 0.5 + 0.5;
}

float perlinFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        v += a * perlinNoise2D(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.2;
    
    float n = perlinFbm(uv * 5.0 + t);
    
    vec3 col1 = vec3(0.1, 0.15, 0.3);
    vec3 col2 = vec3(0.4, 0.6, 0.8);
    vec3 col3 = vec3(0.9, 0.85, 0.7);
    
    vec3 col = n < 0.5 ? mix(col1, col2, n * 2.0) : mix(col2, col3, (n - 0.5) * 2.0);
    
    fragColor = vec4(col, 1.0);
}
