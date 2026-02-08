#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.1, 0.2);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float t = iTime * 0.05;
    float zoom = 0.5 + 2.0 * (1.0 - exp(-t * 0.3));
    zoom = pow(1.5, t);
    zoom = max(zoom, 0.5);

    vec2 center = vec2(-0.7453, 0.1127);
    vec2 c = center + uv / zoom;

    vec2 z = vec2(0.0);
    float iter = 0.0;
    const float maxIter = 256.0;

    for (float i = 0.0; i < maxIter; i++) {
        if (dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iter = i;
    }

    if (dot(z, z) > 4.0) {
        float sl = iter - log2(log2(dot(z, z))) + 4.0;
        float normalized = sl / maxIter;
        vec3 col = palette(normalized * 4.0 + iTime * 0.1);
        fragColor = vec4(col, 1.0);
    } else {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
