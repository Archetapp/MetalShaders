#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.85, 0.85, 0.85);

    for (int ring = 0; ring < 4; ring++) {
        float ringR = 0.08 + float(ring) * 0.1;
        float ringWidth = 0.04;
        int count = 8 + ring * 4;

        for (int i = 0; i < 24; i++) {
            if (i >= count) break;
            float fi = float(i);
            float angle = fi / float(count) * 6.28318;
            float direction = mod(float(ring), 2.0) < 0.5 ? 1.0 : -1.0;
            angle += iTime * 0.3 * direction;

            vec2 pos = vec2(cos(angle), sin(angle)) * ringR;
            vec2 d = uv - pos;
            float dist = length(d);

            float cell = smoothstep(ringWidth, ringWidth * 0.6, dist);
            float localAngle = atan(d.y, d.x);

            float wedge1 = smoothstep(0.0, 0.1, localAngle);
            float wedge2 = smoothstep(0.0, -0.1, localAngle);

            vec3 c1 = vec3(0.15);
            vec3 c2 = vec3(0.95);
            float pattern = step(0.0, sin(localAngle * 3.0 + fi * 0.5));
            vec3 cellCol = mix(c1, c2, pattern);

            float asymmetry = 0.5 + 0.5 * sin(localAngle * 2.0 + direction * 1.5708);
            cellCol = mix(cellCol, vec3(0.5, 0.5, 0.55), asymmetry * 0.3);

            col = mix(col, cellCol, cell);
        }
    }

    float centerDot = smoothstep(0.015, 0.005, length(uv));
    col = mix(col, vec3(0.1), centerDot);

    float breath = 0.97 + 0.03 * sin(iTime * 1.5);
    col *= breath;

    fragColor = vec4(col, 1.0);
}
