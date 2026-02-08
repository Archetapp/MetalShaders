#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    vec2 orbCenter = vec2(sin(iTime * 0.5) * 0.1, cos(iTime * 0.7) * 0.08);
    float dist = length(uv - orbCenter);
    
    float core = exp(-dist * 8.0);
    float glow = exp(-dist * 3.0);
    float outer = exp(-dist * 1.5);
    
    float pulse = 0.9 + 0.1 * sin(iTime * 2.0);
    
    vec3 coreColor = vec3(1.0, 0.95, 0.9);
    vec3 midColor = vec3(0.4, 0.6, 1.0) * pulse;
    vec3 outerColor = vec3(0.6, 0.2, 0.8);
    
    vec3 col = coreColor * core + midColor * glow * 0.7 + outerColor * outer * 0.3;
    col += vec3(0.01, 0.01, 0.02);
    
    fragColor = vec4(col, 1.0);
}
