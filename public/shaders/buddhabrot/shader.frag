#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float buddhaHash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    uv *= 1.5;
    uv.x -= 0.25;
    
    float densityR = 0.0;
    float densityG = 0.0;
    float densityB = 0.0;
    
    float t = iTime * 0.1;
    
    for (int s = 0; s < 80; s++) {
        float fs = float(s);
        vec2 c = vec2(
            buddhaHash(vec2(fs * 0.127 + t, fs * 0.319)) * 3.0 - 2.0,
            buddhaHash(vec2(fs * 0.419 + t, fs * 0.713)) * 3.0 - 1.5
        );
        
        vec2 z = vec2(0.0);
        bool escaped = false;

        for (int i = 0; i < 60; i++) {
            z = vec2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
            if (dot(z, z) > 4.0) { escaped = true; break; }
        }
        
        if (escaped) {
            z = vec2(0.0);
            for (int i = 0; i < 60; i++) {
                z = vec2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
                
                float d = length(uv - z);
                float contribution = exp(-d * d * 100.0);
                
                if (i < 20) densityR += contribution;
                if (i < 40) densityG += contribution;
                densityB += contribution;
                
                if (dot(z, z) > 4.0) break;
            }
        }
    }
    
    vec3 col = vec3(
        log(1.0 + densityR * 0.3),
        log(1.0 + densityG * 0.2),
        log(1.0 + densityB * 0.15)
    );
    
    col = pow(col, vec3(0.7));
    col *= vec3(0.8, 0.9, 1.0);
    
    fragColor = vec4(col, 1.0);
}
