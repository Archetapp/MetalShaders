#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0, 0.0, 0.02);

    if (uv.y < 0.0) {
        float perspective = -0.3 / uv.y;
        float gridX = uv.x * perspective;
        float gridZ = perspective - iTime * 2.0;

        float lineX = smoothstep(0.05, 0.0, abs(fract(gridX) - 0.5) - 0.47);
        float lineZ = smoothstep(0.05, 0.0, abs(fract(gridZ * 0.5) - 0.5) - 0.47);
        float grid = max(lineX, lineZ);

        float fade = exp(uv.y * 5.0);
        vec3 gridCol = vec3(0.0, 0.5, 1.0) * grid * fade;

        float pulse = 0.5 + 0.5 * sin(gridZ * 3.0 - iTime * 4.0);
        gridCol += vec3(0.0, 0.2, 0.5) * grid * pulse * fade * 0.5;

        col += gridCol;

        float horizon = exp(-abs(uv.y) * 50.0);
        col += vec3(0.0, 0.3, 0.8) * horizon;
    } else {
        float skyGlow = exp(-uv.y * 3.0);
        col += vec3(0.0, 0.05, 0.15) * skyGlow;

        for (int i = 0; i < 30; i++) {
            float fi = float(i);
            vec2 sp = vec2(fract(sin(fi * 73.1) * 43758.5) - 0.5, fract(sin(fi * 91.3) * 43758.5) * 0.4 + 0.05);
            float d = length(uv - sp);
            col += exp(-d * d * 5000.0) * vec3(0.3, 0.5, 0.8) * 0.5;
        }
    }

    float centerGlow = exp(-abs(uv.x) * 8.0) * exp(-abs(uv.y + 0.02) * 20.0);
    col += vec3(0.0, 0.4, 1.0) * centerGlow * 0.5;

    fragColor = vec4(col, 1.0);
}
