#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

vec3 starLayer(vec2 uv, float scale, float speed, float brightness) {
    vec3 col = vec3(0.0);
    float t = iTime * speed;

    uv *= scale;
    vec2 id = floor(uv);
    vec2 gv = fract(uv) - 0.5;

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 offs = vec2(float(x), float(y));
            vec2 cellId = id + offs;
            float rnd = hash21(cellId);

            if (rnd > 0.6) continue;

            vec2 starPos = vec2(hash21(cellId + 100.0), hash21(cellId + 200.0)) - 0.5;
            float d = length(gv - offs - starPos);

            float twinkle = sin(t * (2.0 + rnd * 4.0) + rnd * 6.28) * 0.5 + 0.5;
            twinkle = mix(0.5, 1.0, twinkle);

            float star = brightness * twinkle / (d * 40.0 + 1.0);
            star = max(star - 0.01, 0.0);

            float colorSeed = hash21(cellId + 300.0);
            vec3 starCol;
            if (colorSeed < 0.3) {
                starCol = vec3(0.8, 0.85, 1.0);
            } else if (colorSeed < 0.6) {
                starCol = vec3(1.0, 0.95, 0.8);
            } else {
                starCol = vec3(1.0, 0.8, 0.7);
            }

            col += starCol * star;
        }
    }
    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;

    float drift = iTime * 0.02;

    vec3 col = vec3(0.0);

    vec3 bg = mix(vec3(0.0, 0.0, 0.02), vec3(0.02, 0.0, 0.04), uv.y * 0.5 + 0.5);
    col += bg;

    col += starLayer(uv + drift * 0.3, 8.0, 0.3, 0.3);
    col += starLayer(uv + drift * 0.5, 15.0, 0.5, 0.5);
    col += starLayer(uv + drift * 0.8, 25.0, 0.7, 0.7);
    col += starLayer(uv + drift * 1.0, 40.0, 1.0, 1.0);

    float nebula = sin(uv.x * 3.0 + iTime * 0.1) * cos(uv.y * 2.0 - iTime * 0.05);
    nebula = smoothstep(0.3, 0.9, nebula * 0.5 + 0.5);
    col += vec3(0.1, 0.02, 0.15) * nebula * 0.3;

    fragColor = vec4(col, 1.0);
}
