#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float flameHash(float n) { return fract(sin(n) * 43758.5453); }

vec2 flameSinusoidal(vec2 p) { return sin(p); }

vec2 flameSpherical(vec2 p) {
    float r2 = dot(p, p) + 0.0001;
    return p / r2;
}

vec2 flameSwirl(vec2 p) {
    float r2 = dot(p, p);
    float s = sin(r2); float c = cos(r2);
    return vec2(p.x * s - p.y * c, p.x * c + p.y * s);
}

vec2 flameHorseshoe(vec2 p) {
    float r = length(p) + 0.0001;
    return vec2((p.x - p.y) * (p.x + p.y), 2.0 * p.x * p.y) / r;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float density = 0.0;
    vec3 colorAccum = vec3(0.0);
    
    vec2 p = vec2(0.1, 0.1);
    float t = iTime * 0.2;
    
    for (int i = 0; i < 150; i++) {
        float fi = float(i);
        float r = flameHash(fi * 7.13 + t * 0.1);
        
        float angle = t * 0.3 + fi * 0.01;
        mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        
        vec2 newP;
        vec3 c;
        if (r < 0.25) {
            newP = flameSinusoidal(rot * p * 1.5) * 0.8;
            c = vec3(1.0, 0.3, 0.1);
        } else if (r < 0.5) {
            newP = flameSpherical(p + vec2(0.5, 0.0)) * 0.7;
            c = vec3(0.3, 0.1, 1.0);
        } else if (r < 0.75) {
            newP = flameSwirl(p * 1.2) * 0.6;
            c = vec3(0.1, 0.8, 0.3);
        } else {
            newP = flameHorseshoe(p) * 0.7;
            c = vec3(1.0, 0.8, 0.1);
        }
        p = newP;
        
        float d = length(uv - p * 0.4);
        float contribution = exp(-d * d * 300.0);
        density += contribution;
        colorAccum += contribution * c;
    }
    
    float logDensity = log(1.0 + density) * 0.5;
    vec3 col = colorAccum / (density + 0.001);
    col *= logDensity;
    col = pow(col, vec3(0.8));
    
    fragColor = vec4(col, 1.0);
}
