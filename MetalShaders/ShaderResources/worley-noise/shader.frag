#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 worleyRandom(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

vec2 worleyCellNoise(vec2 p, float t) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float f1 = 8.0, f2 = 8.0;
    
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 r = worleyRandom(i + n);
        r = 0.5 + 0.5 * sin(t * 0.8 + 6.2831 * r);
        float d = length(n + r - f);
        if (d < f1) { f2 = f1; f1 = d; }
        else if (d < f2) { f2 = d; }
    }
    return vec2(f1, f2);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime;
    
    vec2 cell = worleyCellNoise(uv * 8.0, t);
    float f1 = cell.x;
    float f2 = cell.y;
    
    float edge = f2 - f1;
    
    vec3 col = vec3(0.0);
    col += vec3(0.1, 0.3, 0.5) * f1 * 2.0;
    col += vec3(0.8, 0.4, 0.1) * edge * 1.5;
    col += vec3(0.9, 0.9, 0.95) * smoothstep(0.02, 0.0, edge) * 0.5;
    
    fragColor = vec4(col, 1.0);
}
