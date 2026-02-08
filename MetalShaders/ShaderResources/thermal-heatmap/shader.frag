#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float thermalHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float thermalNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(thermalHash(i), thermalHash(i+vec2(1,0)), f.x),
               mix(thermalHash(i+vec2(0,1)), thermalHash(i+vec2(1,1)), f.x), f.y);
}

float thermalFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * thermalNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

vec3 thermalPalette(float t) {
    t = clamp(t, 0.0, 1.0);
    if (t < 0.25) return mix(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.8), t * 4.0);
    if (t < 0.5) return mix(vec3(0.0, 0.0, 0.8), vec3(0.0, 0.8, 0.0), (t - 0.25) * 4.0);
    if (t < 0.75) return mix(vec3(0.0, 0.8, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.5) * 4.0);
    return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.75) * 4.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.3;
    float heat = thermalFbm(uv * 4.0 + t);
    heat += thermalFbm(uv * 8.0 - t * 0.5) * 0.4;
    heat += sin(uv.x * 3.0 + t) * 0.1;
    heat = heat * 0.7 + 0.15;
    vec3 col = thermalPalette(heat);
    float scanline = sin(gl_FragCoord.y * 2.0) * 0.03;
    col += scanline;
    fragColor = vec4(col, 1.0);
}
