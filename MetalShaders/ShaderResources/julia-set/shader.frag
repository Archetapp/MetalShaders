#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 jsPalette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0, 0.1, 0.2);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    uv *= 2.0;

    float t = iTime * 0.3;
    vec2 c = vec2(0.38 * cos(t), 0.38 * sin(t * 0.7));

    vec2 z = uv;
    float iter = 0.0;
    float maxIter = 256.0;
    float smooth_iter = 0.0;

    for (float i = 0.0; i < 256.0; i++) {
        if (dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iter = i;
    }

    if (dot(z, z) > 4.0) {
        smooth_iter = iter - log2(log2(dot(z, z))) + 4.0;
        smooth_iter /= maxIter;
    } else {
        smooth_iter = 0.0;
    }

    vec3 col;
    if (dot(z, z) <= 4.0) {
        col = vec3(0.0);
    } else {
        col = jsPalette(smooth_iter * 4.0 + iTime * 0.1);
        col *= 1.0 - exp(-3.5 * smooth_iter);

        float glow = exp(-4.0 * smooth_iter);
        col += vec3(0.8, 0.4, 0.1) * glow;
    }

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
