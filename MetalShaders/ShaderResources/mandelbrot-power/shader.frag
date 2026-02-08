#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 cpowN(vec2 z, float n) {
    float r = length(z);
    float theta = atan(z.y, z.x);
    float rn = pow(r, n);
    return vec2(rn * cos(n * theta), rn * sin(n * theta));
}

vec3 mandelbrotPowerPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t * vec3(1.0, 0.8, 0.6) + vec3(0.0, 0.1, 0.2)));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float power = 2.0 + mod(iTime * 0.2, 3.0);
    
    float zoom = 1.5;
    vec2 c = uv * zoom;
    vec2 z = vec2(0.0);
    
    float iter = 0.0;
    for (float i = 0.0; i < 100.0; i++) {
        z = cpowN(z, power) + c;
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    vec3 col;
    if (iter >= 99.0) {
        col = vec3(0.0);
    } else {
        float sm = iter - log2(log2(dot(z, z))) + 4.0;
        col = mandelbrotPowerPalette(sm * 0.03 + power * 0.1);
    }
    
    fragColor = vec4(col, 1.0);
}
