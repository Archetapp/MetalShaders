#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float rustHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float rustNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(rustHash(i), rustHash(i+vec2(1,0)), f.x),
               mix(rustHash(i+vec2(0,1)), rustHash(i+vec2(1,1)), f.x), f.y);
}

float rustFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) { v += a * rustNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.05;
    
    float rust1 = rustFbm(uv * 5.0 + t);
    float rust2 = rustFbm(uv * 10.0 + vec2(5.0, 3.0) + t * 0.5);
    float rust3 = rustFbm(uv * 20.0 + vec2(10.0, 7.0));
    
    float corrosion = smoothstep(0.35, 0.5, rust1);
    float deepRust = smoothstep(0.55, 0.7, rust1 + rust2 * 0.3);
    
    vec3 metal = vec3(0.5, 0.52, 0.55);
    vec3 lightRust = vec3(0.7, 0.4, 0.15);
    vec3 darkRust = vec3(0.35, 0.15, 0.05);
    vec3 veryDeep = vec3(0.2, 0.08, 0.02);
    
    vec3 col = metal;
    col = mix(col, lightRust, corrosion);
    col = mix(col, darkRust, deepRust);
    col = mix(col, veryDeep, smoothstep(0.7, 0.9, rust1 + rust3 * 0.2));
    
    float pitting = step(0.75, rust3) * corrosion * 0.15;
    col -= pitting;
    
    float metalSheen = pow(rustNoise(uv * 50.0), 4.0) * (1.0 - corrosion) * 0.2;
    col += metalSheen;
    
    fragColor = vec4(col, 1.0);
}
