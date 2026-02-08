#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float silkHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float silkNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(silkHash(i), silkHash(i + vec2(1,0)), f.x),
               mix(silkHash(i + vec2(0,1)), silkHash(i + vec2(1,1)), f.x), f.y);
}

float silkFbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * silkNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.3;
    
    float flow = silkFbm(vec2(uv.x * 8.0 + t, uv.y * 2.0));
    float threadAngle = flow * 6.28318;
    vec2 threadDir = vec2(cos(threadAngle), sin(threadAngle));
    
    float specular = pow(abs(dot(normalize(vec2(1.0, 0.5)), threadDir)), 4.0);
    
    float weave = sin(uv.x * 40.0 + flow * 10.0) * 0.02;
    float warp = silkFbm(uv * 3.0 + t * 0.5);
    
    vec3 baseColor = mix(vec3(0.6, 0.15, 0.3), vec3(0.3, 0.1, 0.5), uv.y + warp * 0.3);
    vec3 col = baseColor + specular * vec3(1.0, 0.9, 0.95) * 0.6;
    col += weave;
    
    float sheen = pow(abs(sin(uv.x * 20.0 + flow * 5.0 + t)), 8.0) * 0.15;
    col += sheen * vec3(1.0, 0.85, 0.9);
    
    fragColor = vec4(col, 1.0);
}
