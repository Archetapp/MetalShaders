#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float t = iTime * 0.4;
    
    float wave1 = sin(uv.x * 3.0 + t) * 0.5 + 0.5;
    float wave2 = sin(uv.y * 2.5 + t * 1.3 + 1.0) * 0.5 + 0.5;
    float wave3 = sin((uv.x + uv.y) * 2.0 + t * 0.7 + 2.0) * 0.5 + 0.5;
    
    vec3 neon1 = vec3(1.0, 0.0, 0.6) * wave1;
    vec3 neon2 = vec3(0.0, 0.8, 1.0) * wave2;
    vec3 neon3 = vec3(0.5, 1.0, 0.0) * wave3;
    
    vec3 col = neon1 + neon2 * 0.7 + neon3 * 0.5;
    col = pow(col, vec3(0.8));
    
    float glow = 0.3 + 0.1 * sin(t * 2.0);
    col += glow * vec3(0.1, 0.0, 0.15);
    
    col = clamp(col, 0.0, 1.0);
    
    fragColor = vec4(col, 1.0);
}
