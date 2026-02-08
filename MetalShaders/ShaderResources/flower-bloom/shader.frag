#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float bloomPetal(vec2 p, float angle, float size) {
    float c = cos(angle), s = sin(angle);
    p = mat2(c, -s, s, c) * p;
    float d = length(p * vec2(1.0, 2.5)) - size;
    return smoothstep(0.01, -0.01, d);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.05, 0.02);

    float goldenAngle = 2.39996;
    float bloomTime = mod(iTime * 0.5, 6.0);
    int numPetals = int(clamp(bloomTime * 12.0, 0.0, 60.0));

    for (int i = 0; i < 60; i++) {
        if (i >= numPetals) break;
        float fi = float(i);
        float angle = fi * goldenAngle;
        float dist = 0.03 * sqrt(fi);
        float petalGrowth = clamp(bloomTime * 12.0 - fi, 0.0, 1.0);

        vec2 center = vec2(cos(angle), sin(angle)) * dist;
        float size = (0.025 + 0.015 * sin(fi * 0.5)) * petalGrowth;
        float petal = bloomPetal(uv - center, angle + 1.5708, size);

        float hue = mod(fi * goldenAngle * 0.5, 6.2832);
        vec3 petalCol = 0.5 + 0.5 * cos(hue + vec3(0.0, 2.094, 4.189));
        petalCol = mix(petalCol, vec3(1.0, 0.4, 0.6), 0.4);

        col = mix(col, petalCol, petal * 0.9);
    }

    float centerDot = smoothstep(0.03, 0.01, length(uv));
    col = mix(col, vec3(1.0, 0.85, 0.2), centerDot);

    fragColor = vec4(col, 1.0);
}
