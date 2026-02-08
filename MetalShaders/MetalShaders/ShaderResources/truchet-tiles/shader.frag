#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.2;

    float scale = 8.0;
    uv *= scale;

    vec2 id = floor(uv);
    vec2 gv = fract(uv);

    float rnd = hash21(id + floor(t) * 0.1);
    float nextRnd = hash21(id + (floor(t) + 1.0) * 0.1);

    bool flip = rnd > 0.5;
    bool nextFlip = nextRnd > 0.5;

    if (flip) gv.x = 1.0 - gv.x;

    float d1 = abs(length(gv) - 1.0);
    float d2 = abs(length(gv - 1.0) - 1.0);

    float d = min(d1, d2);

    float lineWidth = 0.08;
    float line = smoothstep(lineWidth + 0.02, lineWidth, d);

    float colorPhase = hash21(id * 7.0 + 13.0);
    vec3 lineCol;
    lineCol.r = sin(colorPhase * 6.28 + 0.0) * 0.3 + 0.6;
    lineCol.g = sin(colorPhase * 6.28 + 2.09) * 0.3 + 0.6;
    lineCol.b = sin(colorPhase * 6.28 + 4.18) * 0.3 + 0.6;

    float glow = exp(-d * 8.0) * 0.3;

    vec3 bg = vec3(0.03, 0.03, 0.06);
    vec3 col = bg;
    col += lineCol * glow;
    col = mix(col, lineCol, line);

    float edgeDist = min(min(gv.x, 1.0 - gv.x), min(gv.y, 1.0 - gv.y));
    float gridLine = smoothstep(0.02, 0.03, edgeDist);
    col *= mix(0.7, 1.0, gridLine);

    fragColor = vec4(col, 1.0);
}
