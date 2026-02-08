#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float marbleHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float marbleNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(marbleHash(i), marbleHash(i+vec2(1,0)), f.x),
               mix(marbleHash(i+vec2(0,1)), marbleHash(i+vec2(1,1)), f.x), f.y);
}

float marbleFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * marbleNoise(p); p = r * p * 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.05;
    
    float fbm1 = marbleFbm(uv * 6.0 + t);
    float fbm2 = marbleFbm(uv * 12.0 - t * 0.5);
    
    float vein = sin(uv.x * 10.0 + fbm1 * 8.0 + fbm2 * 4.0);
    vein = pow(abs(vein), 0.3);
    
    vec3 white = vec3(0.95, 0.93, 0.9);
    vec3 gray = vec3(0.6, 0.58, 0.55);
    vec3 dark = vec3(0.25, 0.22, 0.2);
    
    vec3 col = mix(dark, gray, vein);
    col = mix(col, white, smoothstep(0.4, 0.8, vein));
    
    float fine = sin(uv.y * 60.0 + fbm1 * 20.0) * 0.02;
    col += fine;
    
    float polish = pow(marbleNoise(uv * 20.0), 3.0) * 0.1;
    col += polish;
    
    fragColor = vec4(col, 1.0);
}
