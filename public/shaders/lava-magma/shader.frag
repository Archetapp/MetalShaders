#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float magmaHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float magmaNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(magmaHash(i), magmaHash(i+vec2(1,0)), f.x),
               mix(magmaHash(i+vec2(0,1)), magmaHash(i+vec2(1,1)), f.x), f.y);
}

float magmaFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 r = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * magmaNoise(p); p = r * p * 2.0; a *= 0.5; }
    return v;
}

vec3 magmaPalette(float t) {
    t = clamp(t, 0.0, 1.0);
    vec3 cold = vec3(0.1, 0.02, 0.0);
    vec3 warm = vec3(0.6, 0.1, 0.0);
    vec3 hot = vec3(1.0, 0.5, 0.0);
    vec3 white = vec3(1.0, 0.9, 0.5);
    
    if (t < 0.33) return mix(cold, warm, t * 3.0);
    if (t < 0.66) return mix(warm, hot, (t - 0.33) * 3.0);
    return mix(hot, white, (t - 0.66) * 3.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.15;
    
    vec2 flow = vec2(magmaFbm(uv * 3.0 + t), magmaFbm(uv * 3.0 + t + vec2(5.0, 3.0)));
    float heat = magmaFbm(uv * 4.0 + flow * 0.5 + t * 0.5);
    heat = pow(heat, 1.5);
    
    vec3 col = magmaPalette(heat);
    
    float crack = smoothstep(0.01, 0.0, abs(heat - 0.3)) + smoothstep(0.01, 0.0, abs(heat - 0.5));
    col += crack * vec3(1.0, 0.6, 0.1) * 0.5;
    
    float glow = max(0.0, heat - 0.5) * 2.0;
    col += glow * vec3(0.3, 0.1, 0.0) * 0.3;
    
    fragColor = vec4(col, 1.0);
}
