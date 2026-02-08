#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float woodHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float woodNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(woodHash(i), woodHash(i+vec2(1,0)), f.x),
               mix(woodHash(i+vec2(0,1)), woodHash(i+vec2(1,1)), f.x), f.y);
}

float woodFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * woodNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.05;
    
    vec2 center = vec2(0.3, 0.5);
    float dist = length((uv - center) * vec2(1.0, 3.0));
    
    float distortion = woodFbm(uv * 4.0 + t) * 0.5;
    float rings = sin((dist + distortion) * 40.0) * 0.5 + 0.5;
    rings = pow(rings, 0.7);
    
    float grain = woodNoise(vec2(uv.x * 2.0, uv.y * 80.0 + t * 5.0)) * 0.08;
    
    vec3 lightWood = vec3(0.76, 0.6, 0.42);
    vec3 darkWood = vec3(0.45, 0.3, 0.15);
    vec3 veryDark = vec3(0.3, 0.18, 0.08);
    
    vec3 col = mix(darkWood, lightWood, rings);
    col = mix(col, veryDark, (1.0 - rings) * 0.3);
    col += grain;
    
    float knot = smoothstep(0.08, 0.0, length(uv - vec2(0.65, 0.35)));
    col = mix(col, veryDark, knot * 0.7);
    
    fragColor = vec4(col, 1.0);
}
