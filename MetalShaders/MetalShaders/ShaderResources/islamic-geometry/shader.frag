#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float igSdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float igStar8(vec2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 8; i++) {
        float a1 = float(i) * 3.14159 / 4.0;
        float a2 = float(i + 1) * 3.14159 / 4.0;
        float amid = (a1 + a2) * 0.5;

        vec2 p1 = r * vec2(cos(a1), sin(a1));
        vec2 p2 = r * 0.5 * vec2(cos(amid), sin(amid));
        vec2 p3 = r * vec2(cos(a2), sin(a2));

        d = min(d, igSdSegment(p, p1, p2));
        d = min(d, igSdSegment(p, p2, p3));
    }
    return d;
}

float igCross(vec2 p, float size) {
    float d = 1e5;
    for (int i = 0; i < 4; i++) {
        float a = float(i) * 3.14159 / 2.0 + 3.14159 / 4.0;
        vec2 dir = vec2(cos(a), sin(a));
        d = min(d, igSdSegment(p, -dir * size, dir * size));
    }
    return d;
}

float igPattern(vec2 uv, float lineW) {
    float d = 1e5;

    d = min(d, igStar8(uv, 0.4));

    for (int i = 0; i < 8; i++) {
        float a = float(i) * 3.14159 / 4.0;
        vec2 tip = 0.4 * vec2(cos(a), sin(a));
        float nextA = float(i + 1) * 3.14159 / 4.0;
        vec2 nextTip = 0.4 * vec2(cos(nextA), sin(nextA));

        vec2 outerMid = 0.55 * vec2(cos((a + nextA) * 0.5), sin((a + nextA) * 0.5));
        d = min(d, igSdSegment(uv, tip, outerMid));
        d = min(d, igSdSegment(uv, outerMid, nextTip));
    }

    d = min(d, igCross(uv, 0.15));

    return smoothstep(lineW + 0.003, lineW - 0.003, d);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float scale = 3.0;
    vec2 p = uv * scale;

    vec2 cell = floor(p + 0.5);
    vec2 f = p - cell;

    float lineWidth = 0.02 + 0.005 * sin(iTime * 0.5);

    float pattern = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            vec2 neighbor = vec2(float(dx), float(dy));
            vec2 cellPos = cell + neighbor;
            vec2 localP = p - cellPos;
            pattern = max(pattern, igPattern(localP, lineWidth));
        }
    }

    float drawProgress = fract(iTime * 0.15);
    float dist = length(uv);
    float reveal = smoothstep(drawProgress * 4.0, drawProgress * 4.0 - 1.0, dist);
    float steadyState = step(4.0, iTime);
    pattern *= mix(reveal, 1.0, steadyState);

    vec3 bgColor = vec3(0.02, 0.03, 0.08);
    vec3 lineColor = vec3(0.85, 0.7, 0.3);
    vec3 glowColor = vec3(0.4, 0.3, 0.1);

    vec3 col = bgColor;

    float starD = igStar8(f, 0.4);
    float innerGlow = smoothstep(0.3, 0.0, starD) * 0.15;
    col += vec3(0.1, 0.05, 0.15) * innerGlow;

    col = mix(col, lineColor, pattern);

    float glow = smoothstep(0.1, 0.0, igStar8(f, 0.4) - lineWidth) * (1.0 - pattern);
    col += glowColor * glow * 0.3;

    float shimmer = sin(iTime * 3.0 + cell.x * 5.0 + cell.y * 7.0) * 0.5 + 0.5;
    col += lineColor * pattern * shimmer * 0.15;

    col *= 1.0 - 0.3 * length(uv);

    fragColor = vec4(col, 1.0);
}
