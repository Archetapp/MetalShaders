#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 phoenixPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t * vec3(0.8, 1.0, 0.6) + vec3(0.3, 0.1, 0.5)));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float zoom = 1.8;
    vec2 z = uv * zoom;
    float cRe = 0.5667 + sin(iTime * 0.1) * 0.05;
    float p = -0.5 + cos(iTime * 0.08) * 0.05;
    
    vec2 zPrev = vec2(0.0);
    float iter = 0.0;
    
    for (float i = 0.0; i < 150.0; i++) {
        vec2 zNew = vec2(
            z.x * z.x - z.y * z.y + cRe + p * zPrev.x,
            2.0 * z.x * z.y + p * zPrev.y
        );
        zPrev = z;
        z = zNew;
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    vec3 col;
    if (iter >= 149.0) {
        col = vec3(0.02, 0.01, 0.05);
    } else {
        float sm = iter - log2(log2(dot(z, z))) + 4.0;
        col = phoenixPalette(sm * 0.025 + iTime * 0.03);
        col *= 0.8 + 0.2 * sin(sm * 0.5);
    }
    
    fragColor = vec4(col, 1.0);
}
