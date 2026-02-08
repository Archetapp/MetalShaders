#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dripHash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec3 bg = vec3(0.12, 0.12, 0.14);
    bg += smoothstep(0.5, -0.5, uv.y) * 0.03;
    vec3 col = bg;

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float xPos = (dripHash(fi * 1.23) - 0.5) * 0.8;
        float interval = 2.0 + dripHash(fi * 2.47) * 2.0;
        float t = mod(iTime + fi * 1.1, interval);

        float formTime = 0.8;
        float fallStart = formTime;

        if (t < formTime) {
            float formProgress = t / formTime;
            float dropSize = 0.01 + formProgress * 0.015;
            float yPos = 0.5 - formProgress * 0.03;

            float streakLength = formProgress * 0.1;
            float streak = smoothstep(0.005, 0.0, abs(uv.x - xPos)) *
                           smoothstep(0.5, yPos + dropSize, uv.y);
            col += streak * vec3(0.15, 0.2, 0.25) * formProgress;

            float dropDist = length(vec2(uv.x - xPos, (uv.y - yPos) * 0.7));
            float drop = smoothstep(dropSize, dropSize * 0.5, dropDist);
            float highlight = smoothstep(dropSize * 0.5, 0.0, length(vec2(uv.x - xPos - 0.003, uv.y - yPos + 0.005)));
            col = mix(col, vec3(0.2, 0.25, 0.3), drop * 0.6);
            col += highlight * 0.3 * drop;
        } else {
            float fallTime = t - fallStart;
            float gravity = 1.5;
            float yPos = 0.5 - 0.03 - fallTime * fallTime * gravity * 0.5;
            float dropSize = 0.012;

            if (yPos > -0.5) {
                vec2 dropVec = vec2(uv.x - xPos, (uv.y - yPos) * 0.6);
                float drop = smoothstep(dropSize, dropSize * 0.4, length(dropVec));
                col = mix(col, vec3(0.2, 0.25, 0.3), drop * 0.6);
            } else {
                float splashTime = fallTime - sqrt(2.0 * (0.5 + 0.47) / gravity);
                if (splashTime > 0.0 && splashTime < 0.5) {
                    float splashRadius = splashTime * 0.3;
                    float splashDist = length(vec2(uv.x - xPos, (uv.y + 0.5) * 3.0));
                    float splash = smoothstep(0.02, 0.0, abs(splashDist - splashRadius));
                    splash *= (1.0 - splashTime * 2.0);
                    col += splash * vec3(0.2, 0.3, 0.4) * max(0.0, 1.0 - splashTime * 3.0);
                }
            }
        }
    }

    float wetFloor = smoothstep(-0.48, -0.5, uv.y) * 0.15;
    col += wetFloor * vec3(0.1, 0.15, 0.2);

    fragColor = vec4(col, 1.0);
}
