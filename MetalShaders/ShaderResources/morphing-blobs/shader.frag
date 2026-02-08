#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float blobField(vec2 uv, float t) {
    float field = 0.0;
    vec2 p1 = vec2(sin(t * 0.7) * 0.3, cos(t * 0.5) * 0.3);
    vec2 p2 = vec2(cos(t * 0.6) * 0.25, sin(t * 0.8) * 0.25);
    vec2 p3 = vec2(sin(t * 0.4 + 2.0) * 0.35, cos(t * 0.3 + 1.0) * 0.2);
    vec2 p4 = vec2(cos(t * 0.9 + 3.0) * 0.2, sin(t * 0.6 + 2.0) * 0.35);
    vec2 p5 = vec2(sin(t * 0.5 + 4.0) * 0.15, cos(t * 0.7 + 3.0) * 0.3);
    
    field += 0.08 / (length(uv - p1) + 0.01);
    field += 0.06 / (length(uv - p2) + 0.01);
    field += 0.07 / (length(uv - p3) + 0.01);
    field += 0.05 / (length(uv - p4) + 0.01);
    field += 0.06 / (length(uv - p5) + 0.01);
    return field;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.8;
    float field = blobField(uv, t);
    
    vec3 c1 = vec3(0.95, 0.3, 0.5);
    vec3 c2 = vec3(0.3, 0.5, 0.95);
    vec3 c3 = vec3(0.4, 0.9, 0.6);
    
    float f = smoothstep(0.8, 2.5, field);
    vec3 col = mix(c1, c2, sin(field * 0.5 + t) * 0.5 + 0.5);
    col = mix(col, c3, cos(field * 0.3 + t * 0.7) * 0.5 + 0.5);
    col *= f;
    col += (1.0 - f) * vec3(0.02, 0.02, 0.05);
    
    fragColor = vec4(col, 1.0);
}
