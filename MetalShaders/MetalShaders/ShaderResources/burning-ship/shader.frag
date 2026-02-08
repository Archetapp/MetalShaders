#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 burningShipPalette(float t) {
    t = fract(t);
    vec3 a = vec3(0.1, 0.0, 0.0);
    vec3 b = vec3(0.8, 0.2, 0.0);
    vec3 c = vec3(1.0, 0.8, 0.0);
    vec3 d = vec3(1.0, 1.0, 0.8);
    
    if (t < 0.33) return mix(a, b, t * 3.0);
    if (t < 0.66) return mix(b, c, (t - 0.33) * 3.0);
    return mix(c, d, (t - 0.66) * 3.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float zoom = 1.5 + sin(iTime * 0.1) * 0.3;
    vec2 center = vec2(-1.755, -0.03);
    vec2 c = uv * zoom + center;
    
    vec2 z = vec2(0.0);
    float iter = 0.0;
    float maxIter = 200.0;
    
    for (float i = 0.0; i < 200.0; i++) {
        z = vec2(abs(z.x), abs(z.y));
        z = vec2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    vec3 col;
    if (iter >= maxIter - 1.0) {
        col = vec3(0.0);
    } else {
        float smooth_iter = iter - log2(log2(dot(z, z))) + 4.0;
        float t = smooth_iter * 0.02 + iTime * 0.05;
        col = burningShipPalette(t);
    }
    
    fragColor = vec4(col, 1.0);
}
