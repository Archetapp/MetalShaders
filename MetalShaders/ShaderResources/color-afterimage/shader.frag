#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float cycle = mod(iTime, 8.0);
    float starePhase = smoothstep(0.0, 0.5, cycle) * smoothstep(5.0, 4.5, cycle);
    float revealPhase = smoothstep(5.0, 5.5, cycle) * smoothstep(8.0, 7.5, cycle);

    vec3 stareColor = vec3(0.0, 0.8, 0.8);
    vec3 revealColor = vec3(0.85, 0.85, 0.85);

    float circleR = 0.15;
    float circleMask = smoothstep(circleR + 0.005, circleR - 0.005, length(uv));

    float crossH = smoothstep(0.003, 0.001, abs(uv.y)) * step(abs(uv.x), 0.02);
    float crossV = smoothstep(0.003, 0.001, abs(uv.x)) * step(abs(uv.y), 0.02);
    float cross = max(crossH, crossV);

    vec3 col = vec3(0.5);

    if (starePhase > 0.01) {
        col = mix(col, stareColor, circleMask * starePhase);
        col = mix(col, vec3(0.0), cross * starePhase);

        float flash = sin(iTime * 30.0) * 0.02 * starePhase;
        col += flash;
    }

    if (revealPhase > 0.01) {
        col = mix(vec3(0.5), revealColor, circleMask * revealPhase);
        col = mix(col, vec3(0.3), cross * revealPhase);

        float hint = sin(length(uv) * 50.0) * 0.01 * revealPhase;
        col += hint;
    }

    float borderPulse = sin(iTime * 2.0) * 0.01;
    float border = smoothstep(0.48, 0.47, max(abs(uv.x), abs(uv.y) * iResolution.x / iResolution.y));
    col = mix(vec3(0.2), col, border);

    fragColor = vec4(col, 1.0);
}
