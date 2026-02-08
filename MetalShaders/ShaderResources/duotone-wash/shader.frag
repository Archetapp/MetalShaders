#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float duotoneNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    float a = fract(sin(dot(i, vec2(127.1,311.7))) * 43758.5453);
    float b = fract(sin(dot(i+vec2(1,0), vec2(127.1,311.7))) * 43758.5453);
    float c = fract(sin(dot(i+vec2(0,1), vec2(127.1,311.7))) * 43758.5453);
    float d = fract(sin(dot(i+vec2(1,1), vec2(127.1,311.7))) * 43758.5453);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float duotoneFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * duotoneNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.3;
    
    float boundary = uv.x * 0.6 + uv.y * 0.4;
    boundary += duotoneFbm(uv * 3.0 + t) * 0.3;
    boundary += sin(uv.y * 5.0 + t * 2.0) * 0.05;
    
    vec3 color1 = vec3(0.05, 0.05, 0.2);
    vec3 color2 = vec3(0.95, 0.4, 0.2);
    
    float blend = smoothstep(0.35, 0.65, boundary);
    vec3 col = mix(color1, color2, blend);
    
    float grain = duotoneNoise(uv * 200.0 + t * 10.0) * 0.03;
    col += grain;
    
    fragColor = vec4(col, 1.0);
}
