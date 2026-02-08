#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ridgedHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float ridgedNoiseFn(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(ridgedHash(i), ridgedHash(i+vec2(1,0)), f.x),
               mix(ridgedHash(i+vec2(0,1)), ridgedHash(i+vec2(1,1)), f.x), f.y);
}

float ridgedMultifractal(vec2 p) {
    float v = 0.0, a = 1.0, prev = 1.0;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) {
        float n = 1.0 - abs(ridgedNoiseFn(p) * 2.0 - 1.0);
        n = n * n;
        v += n * a * prev;
        prev = n;
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v * 0.5;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.1;
    
    float ridged = ridgedMultifractal(uv * 5.0 + t);
    
    vec3 deep = vec3(0.05, 0.08, 0.15);
    vec3 mid = vec3(0.3, 0.25, 0.2);
    vec3 peak = vec3(0.95, 0.9, 0.85);
    vec3 snow = vec3(1.0, 1.0, 1.0);
    
    vec3 col = mix(deep, mid, smoothstep(0.1, 0.3, ridged));
    col = mix(col, peak, smoothstep(0.3, 0.6, ridged));
    col = mix(col, snow, smoothstep(0.7, 0.9, ridged));
    
    fragColor = vec4(col, 1.0);
}
