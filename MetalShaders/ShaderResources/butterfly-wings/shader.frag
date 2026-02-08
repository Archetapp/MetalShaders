#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float bflyHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float bflyWingShape(vec2 p) {
    float a = atan(p.y, p.x);
    float r = length(p);
    float wing = 0.25 * (1.0 + 0.3 * cos(a * 2.0)) * (sin(a) * 0.5 + 0.7);
    return smoothstep(0.01, -0.01, r - wing) * step(0.0, p.y * 0.5 + abs(p.x));
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.03, 0.03, 0.05);

    float flapAngle = sin(iTime * 3.0) * 0.3;
    vec2 uvR = vec2(abs(uv.x), uv.y);
    uvR.x *= 1.0 + flapAngle * 0.5;

    float wing = bflyWingShape(uvR);

    vec3 wingCol = vec3(0.9, 0.3, 0.1);
    float pattern1 = smoothstep(0.15, 0.14, length(uvR - vec2(0.12, 0.08)));
    float pattern2 = smoothstep(0.08, 0.07, length(uvR - vec2(0.06, -0.05)));
    wingCol = mix(wingCol, vec3(0.1, 0.1, 0.3), pattern1);
    wingCol = mix(wingCol, vec3(0.0, 0.0, 0.2), pattern2);

    float scales = bflyHash(floor(uvR * 80.0));
    wingCol *= 0.85 + 0.15 * scales;

    float iridescence = 0.5 + 0.5 * sin(uvR.x * 30.0 + uvR.y * 20.0 + iTime);
    wingCol += vec3(0.05, 0.0, 0.1) * iridescence;

    float edgeDark = smoothstep(0.2, 0.22, length(uvR) * (0.8 + 0.2 * sin(atan(uvR.y, uvR.x) * 5.0)));
    wingCol = mix(wingCol, vec3(0.05, 0.02, 0.02), edgeDark * 0.5);

    col = mix(col, wingCol, wing);

    float body = smoothstep(0.015, 0.005, abs(uv.x)) * smoothstep(0.2, 0.0, abs(uv.y - 0.02));
    col = mix(col, vec3(0.15, 0.1, 0.05), body);

    float ant1 = smoothstep(0.003, 0.001, abs(uv.x - 0.02 - uv.y * 0.3)) * step(0.05, uv.y) * step(uv.y, 0.2);
    float ant2 = smoothstep(0.003, 0.001, abs(uv.x + 0.02 + uv.y * 0.3)) * step(0.05, uv.y) * step(uv.y, 0.2);
    col += (ant1 + ant2) * vec3(0.2, 0.15, 0.1);

    fragColor = vec4(col, 1.0);
}
