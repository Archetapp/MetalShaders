#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dragonDE(vec2 p) {
    float s = 1.0;
    float angle = iTime * 0.1;
    
    for (int i = 0; i < 16; i++) {
        float c = cos(0.7854 + angle * 0.01);
        float sn = sin(0.7854 + angle * 0.01);
        
        vec2 p1 = vec2(c * p.x + sn * p.y, -sn * p.x + c * p.y) * 1.4142;
        
        c = cos(-0.7854 + angle * 0.01);
        sn = sin(-0.7854 + angle * 0.01);
        vec2 p2 = vec2(c * (p.x - 1.0) + sn * p.y, -sn * (p.x - 1.0) + c * p.y) * 1.4142;
        
        float d1 = dot(p1, p1);
        float d2 = dot(p2, p2);
        
        p = (d1 < d2) ? p1 : p2;
        s *= 1.4142;
    }
    
    return length(p) / s;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    uv = uv * 2.5 + vec2(0.5, 0.0);
    
    float d = dragonDE(uv);
    
    float shape = smoothstep(0.005, 0.0, d);
    float glow = exp(-d * 100.0);
    
    vec3 col = vec3(0.02, 0.02, 0.04);
    
    float hue = d * 50.0 + iTime * 0.3;
    vec3 rainbow = 0.5 + 0.5 * cos(6.28 * (hue + vec3(0.0, 0.33, 0.67)));
    
    col += rainbow * shape;
    col += vec3(0.2, 0.3, 0.5) * glow * 0.4;
    
    fragColor = vec4(col, 1.0);
}
