#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float sierpinskiDE(vec2 p) {
    float scale = 1.0;

    for (int i = 0; i < 12; i++) {
        p = p * 2.0 - 1.0;
        
        if (p.x + p.y < 0.0) p.xy = -p.yx;
        if (p.x - p.y < 0.0) p.xy = vec2(p.y, p.x);
        if (p.x < 0.0) p.x = -p.x;
        
        p = p - 1.0;
        scale *= 2.0;
    }
    
    return length(p) / scale;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float rotation = iTime * 0.1;
    mat2 rot = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
    uv = rot * uv;
    
    uv = uv * 1.2 + vec2(0.5, 0.35);
    
    float d = sierpinskiDE(uv);
    
    float edge = smoothstep(0.002, 0.0, d);
    float glow = exp(-d * 200.0);
    
    vec3 col = vec3(0.02, 0.02, 0.05);
    col += vec3(0.2, 0.5, 0.9) * edge;
    col += vec3(0.1, 0.3, 0.6) * glow * 0.5;
    
    float t = iTime * 0.3;
    col *= 0.8 + 0.2 * sin(d * 500.0 + t);
    
    fragColor = vec4(col, 1.0);
}
