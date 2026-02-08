#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float kochCurve(vec2 p, int depth) {
    float s = 1.0;
    float k = 0.57735;
    
    p.x = abs(p.x);
    p.y += k;
    
    if (p.x + k * p.y > 0.0)
        p = vec2(p.x - 0.5, p.y - k * 0.5);
    
    p.x -= 0.5;
    
    for (int i = 0; i < 8; i++) {
        if (i >= depth) break;
        p.x = abs(p.x);
        s *= 3.0;
        float scale = 1.0 / 3.0;
        p *= 3.0;
        p.x -= 1.5;
        p.y -= k;
        if (p.x + k * p.y > 0.0)
            p = vec2(p.x - 0.5, p.y - k * 0.5);
        p.x -= 0.5;
    }
    
    p.x += 0.5;
    return length(p - vec2(clamp(p.x, 0.0, 1.0), 0.0)) / s;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float rotation = iTime * 0.15;
    mat2 rot = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    uv = rot * uv;
    
    float scale = 1.5 + sin(iTime * 0.2) * 0.2;
    uv *= scale;
    
    float d1 = kochCurve(uv, 7);
    
    mat2 rot120 = mat2(cos(2.094), -sin(2.094), sin(2.094), cos(2.094));
    float d2 = kochCurve(rot120 * uv, 7);
    float d3 = kochCurve(rot120 * rot120 * uv, 7);
    
    float d = min(d1, min(d2, d3));
    
    float edge = smoothstep(0.003, 0.0, d);
    float glow = exp(-d * 300.0);
    
    vec3 col = vec3(0.02, 0.05, 0.1);
    col += vec3(0.7, 0.85, 1.0) * edge;
    col += vec3(0.3, 0.5, 0.8) * glow * 0.4;
    
    fragColor = vec4(col, 1.0);
}
