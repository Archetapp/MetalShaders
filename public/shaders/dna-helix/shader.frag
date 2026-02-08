#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dnaStrand(vec2 uv, float phase, float yOffset) {
    float x = sin(uv.y * 8.0 + phase + iTime * 2.0) * 0.15;
    float d = abs(uv.x - x);
    float z = cos(uv.y * 8.0 + phase + iTime * 2.0);
    float width = 0.012 + 0.004 * (z * 0.5 + 0.5);
    return smoothstep(width, width * 0.3, d) * (0.6 + 0.4 * (z * 0.5 + 0.5));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.02, 0.02, 0.06);

    float strand1 = dnaStrand(uv, 0.0, 0.0);
    float strand2 = dnaStrand(uv, 3.14159, 0.0);

    col += strand1 * vec3(0.2, 0.5, 1.0);
    col += strand2 * vec3(1.0, 0.3, 0.5);

    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float y = -0.5 + fi * 0.05 + mod(iTime * 0.1, 0.05);
        float phase1 = y * 8.0 + iTime * 2.0;
        float x1 = sin(phase1) * 0.15;
        float x2 = sin(phase1 + 3.14159) * 0.15;
        float z = cos(phase1);

        vec2 p1 = vec2(x1, y);
        vec2 p2 = vec2(x2, y);
        vec2 pa = uv - p1, ba = p2 - p1;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        float d = length(pa - ba * h);
        float rung = smoothstep(0.005, 0.002, d) * (0.4 + 0.3 * (z * 0.5 + 0.5));

        vec3 rungCol = mix(vec3(0.2, 0.8, 0.3), vec3(0.8, 0.6, 0.1), h);
        col += rung * rungCol;
    }

    float glow = exp(-length(uv) * 2.0) * 0.15;
    col += vec3(0.1, 0.15, 0.3) * glow;

    fragColor = vec4(col, 1.0);
}
