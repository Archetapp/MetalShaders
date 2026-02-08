#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float camoHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float camoNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(camoHash(i), camoHash(i+vec2(1,0)), f.x),
               mix(camoHash(i+vec2(0,1)), camoHash(i+vec2(1,1)), f.x), f.y);
}

float camoFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * camoNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.05;
    
    float n1 = camoFbm(uv * 4.0 + t);
    float n2 = camoFbm(uv * 3.0 + vec2(5.0, 3.0) + t * 0.3);
    float n3 = camoFbm(uv * 5.0 + vec2(10.0, 7.0) + t * 0.2);
    
    vec3 darkGreen = vec3(0.1, 0.2, 0.08);
    vec3 olive = vec3(0.3, 0.35, 0.15);
    vec3 brown = vec3(0.35, 0.25, 0.1);
    vec3 tan_ = vec3(0.55, 0.5, 0.35);
    
    float zone1 = smoothstep(0.3, 0.35, n1);
    float zone2 = smoothstep(0.45, 0.5, n2);
    float zone3 = smoothstep(0.55, 0.6, n3);
    
    vec3 col = darkGreen;
    col = mix(col, olive, zone1);
    col = mix(col, brown, zone2);
    col = mix(col, tan_, zone3 * 0.7);
    
    float texture_ = camoNoise(uv * 50.0) * 0.03;
    col += texture_;
    
    fragColor = vec4(col, 1.0);
}
