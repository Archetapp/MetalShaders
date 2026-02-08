#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float turbHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float turbNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(mix(turbHash(i), turbHash(i+vec2(1,0)), f.x),
               mix(turbHash(i+vec2(0,1)), turbHash(i+vec2(1,1)), f.x), f.y);
}

float turbulenceFn(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 7; i++) {
        v += a * abs(turbNoise(p) * 2.0 - 1.0);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.2;
    
    float turb = turbulenceFn(uv * 5.0 + t);
    
    vec3 col1 = vec3(0.02, 0.05, 0.1);
    vec3 col2 = vec3(0.3, 0.15, 0.05);
    vec3 col3 = vec3(0.9, 0.7, 0.4);
    
    vec3 col = mix(col1, col2, smoothstep(0.2, 0.5, turb));
    col = mix(col, col3, smoothstep(0.5, 0.9, turb));
    
    float crease = pow(1.0 - turb, 3.0) * 0.3;
    col += crease * vec3(0.5, 0.6, 0.8);
    
    fragColor = vec4(col, 1.0);
}
