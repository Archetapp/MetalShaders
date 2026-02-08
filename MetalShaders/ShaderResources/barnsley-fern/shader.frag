#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float fernHash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= iResolution.x / iResolution.y;
    
    float density = 0.0;
    float wind = sin(iTime * 0.5) * 0.02;
    
    vec2 pt = vec2(0.0);
    
    for (int i = 0; i < 200; i++) {
        float fi = float(i);
        float r = fernHash(fi * 13.37 + iTime * 0.01);
        
        vec2 newPt;
        if (r < 0.01) {
            newPt = vec2(0.0, 0.16 * pt.y);
        } else if (r < 0.86) {
            newPt = vec2(0.85 * pt.x + 0.04 * pt.y + wind,
                        -0.04 * pt.x + 0.85 * pt.y + 1.6);
        } else if (r < 0.93) {
            newPt = vec2(0.2 * pt.x - 0.26 * pt.y,
                         0.23 * pt.x + 0.22 * pt.y + 1.6);
        } else {
            newPt = vec2(-0.15 * pt.x + 0.28 * pt.y,
                          0.26 * pt.x + 0.24 * pt.y + 0.44);
        }
        pt = newPt;
        
        vec2 mapped = vec2(pt.x * 0.18, pt.y * 0.09 - 0.45);
        float d = length(p - mapped);
        density += exp(-d * d * 800.0);
    }
    
    density = min(density, 1.0);
    
    vec3 darkGreen = vec3(0.05, 0.2, 0.05);
    vec3 lightGreen = vec3(0.2, 0.7, 0.15);
    vec3 tip = vec3(0.5, 0.9, 0.3);
    
    vec3 col = mix(vec3(0.02, 0.03, 0.05), darkGreen, density);
    col = mix(col, lightGreen, density * density);
    col = mix(col, tip, pow(density, 4.0));
    
    fragColor = vec4(col, 1.0);
}
