#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float igSdSegment(float2 p, float2 a, float2 b) {
    float2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float igStar8(float2 p, float r) {
    float d = 1e5;
    for (int i = 0; i < 8; i++) {
        float a1 = float(i) * M_PI_F / 4.0;
        float a2 = float(i + 1) * M_PI_F / 4.0;
        float amid = (a1 + a2) * 0.5;

        float2 p1 = r * float2(cos(a1), sin(a1));
        float2 p2 = r * 0.5 * float2(cos(amid), sin(amid));
        float2 p3 = r * float2(cos(a2), sin(a2));

        d = min(d, igSdSegment(p, p1, p2));
        d = min(d, igSdSegment(p, p2, p3));
    }
    return d;
}

float igCross(float2 p, float size) {
    float d = 1e5;
    for (int i = 0; i < 4; i++) {
        float a = float(i) * M_PI_F / 2.0 + M_PI_F / 4.0;
        float2 dir = float2(cos(a), sin(a));
        d = min(d, igSdSegment(p, -dir * size, dir * size));
    }
    return d;
}

float igPattern(float2 uv, float lineW) {
    float d = 1e5;

    d = min(d, igStar8(uv, 0.4));

    for (int i = 0; i < 8; i++) {
        float a = float(i) * M_PI_F / 4.0;
        float2 tip = 0.4 * float2(cos(a), sin(a));
        float nextA = float(i + 1) * M_PI_F / 4.0;
        float2 nextTip = 0.4 * float2(cos(nextA), sin(nextA));

        float2 outerMid = 0.55 * float2(cos((a + nextA) * 0.5), sin((a + nextA) * 0.5));
        d = min(d, igSdSegment(uv, tip, outerMid));
        d = min(d, igSdSegment(uv, outerMid, nextTip));
    }

    d = min(d, igCross(uv, 0.15));

    return smoothstep(lineW + 0.003, lineW - 0.003, d);
}

fragment float4 islamicGeometryFragment(VertexOut in [[stage_in]],
                                         constant float &iTime [[buffer(0)]],
                                         constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float scale = 3.0;
    float2 p = uv * scale;

    float2 cell = floor(p + 0.5);
    float2 f = p - cell;

    float lineWidth = 0.02 + 0.005 * sin(iTime * 0.5);

    float pattern = 0.0;
    for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
            float2 neighbor = float2(float(dx), float(dy));
            float2 cellPos = cell + neighbor;
            float2 localP = p - cellPos;
            pattern = max(pattern, igPattern(localP, lineWidth));
        }
    }

    float drawProgress = fract(iTime * 0.15);
    float dist = length(uv);
    float reveal = smoothstep(drawProgress * 4.0, drawProgress * 4.0 - 1.0, dist);
    float steadyState = step(4.0, iTime);
    pattern *= mix(reveal, 1.0, steadyState);

    float3 bgColor = float3(0.02, 0.03, 0.08);
    float3 lineColor = float3(0.85, 0.7, 0.3);
    float3 glowColor = float3(0.4, 0.3, 0.1);

    float3 col = bgColor;

    float starD = igStar8(f, 0.4);
    float innerGlow = smoothstep(0.3, 0.0, starD) * 0.15;
    col += float3(0.1, 0.05, 0.15) * innerGlow;

    col = mix(col, lineColor, pattern);

    float glow = smoothstep(0.1, 0.0, igStar8(f, 0.4) - lineWidth) * (1.0 - pattern);
    col += glowColor * glow * 0.3;

    float shimmer = sin(iTime * 3.0 + cell.x * 5.0 + cell.y * 7.0) * 0.5 + 0.5;
    col += lineColor * pattern * shimmer * 0.15;

    col *= 1.0 - 0.3 * length(uv);

    return float4(col, 1.0);
}
