#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2 spHypotrochoid(float t, float R, float r, float d) {
    float diff = R - r;
    float ratio = diff / r;
    return float2(
        diff * cos(t) + d * cos(ratio * t),
        diff * sin(t) - d * sin(ratio * t)
    );
}

float2 spEpitrochoid(float t, float R, float r, float d) {
    float sum = R + r;
    float ratio = sum / r;
    return float2(
        sum * cos(t) - d * cos(ratio * t),
        sum * sin(t) - d * sin(ratio * t)
    );
}

float spDistToLine(float2 p, float2 a, float2 b) {
    float2 pa = p - a;
    float2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

fragment float4 spirographFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float scale = 2.5;
    uv *= scale;

    float3 col = float3(0.01, 0.01, 0.02);

    float R1 = 1.0;
    float r1 = 0.38 + 0.1 * sin(t * 0.1);
    float d1 = 0.3 + 0.15 * cos(t * 0.15);

    float R2 = 0.6;
    float r2 = 0.22 + 0.05 * cos(t * 0.12);
    float d2 = 0.4 + 0.1 * sin(t * 0.08);

    float R3 = 0.8;
    float r3 = 0.3;
    float d3 = 0.25 + 0.1 * sin(t * 0.2);

    float minDist1 = 1e9;
    float minDist2 = 1e9;
    float minDist3 = 1e9;

    int steps = 300;
    float maxAngle = 6.28318 * 5.0;
    float dt = maxAngle / float(steps);

    float2 prevP1 = spHypotrochoid(0.0, R1, r1, d1);
    float2 prevP2 = spEpitrochoid(0.0, R2, r2, d2);
    float2 prevP3 = spHypotrochoid(0.0, R3, r3, d3);

    for (int i = 1; i <= 300; i++) {
        float angle = float(i) * dt;

        float2 p1 = spHypotrochoid(angle, R1, r1, d1);
        float2 p2 = spEpitrochoid(angle, R2, r2, d2);
        float2 p3 = spHypotrochoid(angle, R3, r3, d3);

        float seg1 = spDistToLine(uv, prevP1, p1);
        float seg2 = spDistToLine(uv, prevP2, p2);
        float seg3 = spDistToLine(uv, prevP3, p3);

        minDist1 = min(minDist1, seg1);
        minDist2 = min(minDist2, seg2);
        minDist3 = min(minDist3, seg3);

        prevP1 = p1;
        prevP2 = p2;
        prevP3 = p3;
    }

    float3 color1 = float3(0.2, 0.6, 1.0);
    float3 color2 = float3(1.0, 0.3, 0.5);
    float3 color3 = float3(0.3, 1.0, 0.5);

    float glow1 = 0.003 / (minDist1 * minDist1 + 0.0001);
    float glow2 = 0.003 / (minDist2 * minDist2 + 0.0001);
    float glow3 = 0.002 / (minDist3 * minDist3 + 0.0001);

    float line1 = smoothstep(0.015, 0.005, minDist1);
    float line2 = smoothstep(0.015, 0.005, minDist2);
    float line3 = smoothstep(0.012, 0.004, minDist3);

    col += color1 * (line1 + glow1 * 0.1);
    col += color2 * (line2 + glow2 * 0.1);
    col += color3 * (line3 + glow3 * 0.08);

    float vig = 1.0 - 0.15 * dot(uv / scale, uv / scale);
    col *= vig;

    col = col / (col + 0.8);
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
