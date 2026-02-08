#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 tricornPalette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t * vec3(1.0, 0.7, 0.4) + vec3(0.0, 0.15, 0.20)));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);
    
    float zoom = 1.8 + sin(iTime * 0.15) * 0.3;
    vec2 c = uv * zoom + vec2(-0.3, 0.0);
    vec2 z = vec2(0.0);
    
    float iter = 0.0;
    for (float i = 0.0; i < 150.0; i++) {
        z = vec2(z.x, -z.y);
        z = vec2(z.x * z.x - z.y * z.y + c.x, 2.0 * z.x * z.y + c.y);
        if (dot(z, z) > 4.0) { iter = i; break; }
        iter = i;
    }
    
    vec3 col;
    if (iter >= 149.0) {
        col = vec3(0.02, 0.0, 0.05);
    } else {
        float sm = iter - log2(log2(dot(z, z))) + 4.0;
        col = tricornPalette(sm * 0.03 + iTime * 0.02);
    }
    
    fragColor = vec4(col, 1.0);
}
