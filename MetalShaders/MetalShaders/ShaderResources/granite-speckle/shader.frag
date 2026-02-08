#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float graniteHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float graniteNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(graniteHash(i), graniteHash(i+vec2(1,0)), f.x),
               mix(graniteHash(i+vec2(0,1)), graniteHash(i+vec2(1,1)), f.x), f.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.03;
    
    float coarse = graniteNoise(uv * 8.0 + t);
    float medium = graniteNoise(uv * 25.0 + t * 0.5);
    float fine = graniteNoise(uv * 80.0);
    float vfine = graniteNoise(uv * 200.0);
    
    float speckle = step(0.7, fine) * 0.3 + step(0.8, vfine) * 0.2;
    
    vec3 base = vec3(0.55, 0.52, 0.5);
    vec3 dark = vec3(0.2, 0.18, 0.17);
    vec3 light = vec3(0.8, 0.78, 0.75);
    vec3 mica = vec3(0.7, 0.65, 0.55);
    
    vec3 col = base;
    col = mix(col, dark, (1.0 - coarse) * 0.3);
    col = mix(col, light, medium * 0.2);
    col = mix(col, mica, speckle);
    
    float crystal = pow(graniteNoise(uv * 150.0 + t * 0.2), 8.0) * 0.15;
    col += crystal * vec3(1.0, 0.95, 0.9);
    
    fragColor = vec4(col, 1.0);
}
