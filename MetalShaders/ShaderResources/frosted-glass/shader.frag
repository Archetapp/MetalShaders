#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float frostHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float frostNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(frostHash(i), frostHash(i+vec2(1,0)), f.x),
               mix(frostHash(i+vec2(0,1)), frostHash(i+vec2(1,1)), f.x), f.y);
}

float frostVoronoi(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    float md = 1.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 r = n + frostHash(i + n) - f;
        md = min(md, dot(r, r));
    }
    return sqrt(md);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.2;
    
    float crystal = frostVoronoi(uv * 12.0 + t * 0.3);
    float detail = frostNoise(uv * 30.0 + t * 0.1) * 0.3;
    float frost = crystal + detail;
    
    vec3 iceColor = vec3(0.7, 0.85, 0.95);
    vec3 deepIce = vec3(0.4, 0.6, 0.8);
    vec3 col = mix(deepIce, iceColor, frost);
    
    float highlight = pow(1.0 - crystal, 4.0) * 0.5;
    col += highlight * vec3(1.0, 1.0, 1.0);
    
    float edge = smoothstep(0.0, 0.05, crystal) * (1.0 - smoothstep(0.05, 0.1, crystal));
    col += edge * vec3(0.8, 0.9, 1.0) * 0.4;
    
    float refract = frostNoise(uv * 5.0 + t) * 0.03;
    col += refract * vec3(0.5, 0.7, 1.0);
    
    fragColor = vec4(col, 1.0);
}
