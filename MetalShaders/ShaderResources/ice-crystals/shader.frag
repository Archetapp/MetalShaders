#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float iceHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

vec2 iceRandom2(vec2 p) {
    return vec2(iceHash(p), iceHash(p + vec2(53.0, 91.0)));
}

float iceVoronoi(vec2 p, out vec2 cellId) {
    vec2 i = floor(p); vec2 f = fract(p);
    float md = 8.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        vec2 n = vec2(float(x), float(y));
        vec2 r = iceRandom2(i + n);
        r = 0.5 + 0.4 * sin(iTime * 0.2 + 6.28 * r);
        float d = length(n + r - f);
        if (d < md) { md = d; cellId = i + n; }
    }
    return md;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.2;
    
    vec2 cellId;
    float d1 = iceVoronoi(uv * 10.0, cellId);
    
    float angle = atan(fract(uv.y * 10.0) - 0.5, fract(uv.x * 10.0) - 0.5);
    float sixfold = abs(sin(angle * 3.0));
    
    float branch = smoothstep(0.3, 0.0, d1) * sixfold;
    float crystal = smoothstep(0.15, 0.0, d1);
    
    float detail = iceHash(cellId * 7.0);
    float fineStructure = pow(abs(sin(angle * 6.0 + detail * 6.28)), 3.0);
    
    vec3 bg = vec3(0.05, 0.1, 0.2);
    vec3 ice = vec3(0.6, 0.8, 0.95);
    vec3 bright = vec3(0.9, 0.95, 1.0);
    
    vec3 col = bg;
    col = mix(col, ice, branch * 0.6 + crystal * 0.4);
    col += fineStructure * crystal * vec3(0.3, 0.4, 0.5) * 0.3;
    col += pow(crystal, 3.0) * bright * 0.5;
    
    float sparkle = pow(iceHash(uv * 50.0 + t), 15.0) * crystal;
    col += sparkle * vec3(1.0) * 0.8;
    
    fragColor = vec4(col, 1.0);
}
