#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float iridescentHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float iridescentNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = iridescentHash(i);
    float b = iridescentHash(i + vec2(1.0, 0.0));
    float c = iridescentHash(i + vec2(0.0, 1.0));
    float d = iridescentHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 thinFilmColor(float thickness) {
    float r = 0.5 + 0.5 * cos(6.28318 * (thickness * 1.0 + 0.0));
    float g = 0.5 + 0.5 * cos(6.28318 * (thickness * 1.0 + 0.33));
    float b = 0.5 + 0.5 * cos(6.28318 * (thickness * 1.0 + 0.67));
    return vec3(r, g, b);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 center = uv - 0.5;
    float dist = length(center);
    float angle = atan(center.y, center.x);
    
    float thickness = dist * 3.0 + iTime * 0.3;
    thickness += iridescentNoise(uv * 4.0 + iTime * 0.2) * 0.5;
    thickness += sin(angle * 3.0 + iTime) * 0.2;
    
    vec3 col = thinFilmColor(thickness);
    
    float bubble = 1.0 - smoothstep(0.0, 0.5, dist);
    float rim = smoothstep(0.35, 0.5, dist) * (1.0 - smoothstep(0.5, 0.52, dist));
    
    col *= bubble;
    col += rim * vec3(1.0, 1.0, 1.0) * 0.5;
    
    float highlight = pow(max(0.0, 1.0 - length(center - vec2(-0.1, 0.15))), 8.0);
    col += highlight * vec3(1.0) * 0.6;
    
    fragColor = vec4(col, 1.0);
}
