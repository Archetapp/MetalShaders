#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 fracSpiralTransform(vec2 p, float scale, float angle) {
    float c = cos(angle), s = sin(angle);
    p = mat2(c, -s, s, c) * p;
    return p * scale;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.01, 0.04);

    vec2 p = uv;
    float totalIntensity = 0.0;
    float hueAccum = 0.0;

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float r = length(p);
        float a = atan(p.y, p.x);

        float spiral = sin(a * 3.0 - r * 10.0 + iTime * (1.0 + fi * 0.2));
        float band = smoothstep(-0.2, 0.2, spiral);

        float contribution = band * exp(-r * 2.0) / (1.0 + fi * 0.5);
        totalIntensity += contribution;
        hueAccum += fi * 0.5 + a;

        p = fracSpiralTransform(p, 2.0, iTime * 0.3 + fi * 0.7);
        p = fract(p + 0.5) - 0.5;
    }

    vec3 rainbow = 0.5 + 0.5 * cos(hueAccum * 0.3 + iTime * 0.5 + vec3(0.0, 2.094, 4.189));
    col += rainbow * totalIntensity;

    float r = length(uv);
    float glow = exp(-r * 3.0) * 0.1;
    col += vec3(0.2, 0.1, 0.3) * glow;

    fragColor = vec4(col, 1.0);
}
