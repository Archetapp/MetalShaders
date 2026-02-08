#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float leafShapeMtl(float2 p) {
    p.x *= 1.8;
    float r = length(p);
    float a = atan2(p.y, p.x);
    float leaf = 0.3 * (1.0 + 0.1 * sin(a * 2.0)) * (cos(a) * 0.5 + 0.5);
    return smoothstep(0.01, -0.01, r - leaf);
}

float leafVeinLineMtl(float2 p, float2 a, float2 b, float w) {
    float2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return smoothstep(w, w * 0.2, length(pa - ba * h));
}

float leafVeinPatternMtl(float2 uv) {
    float veins = 0.0;
    float mainVein = leafVeinLineMtl(uv, float2(-0.25, 0.0), float2(0.2, 0.0), 0.004);
    veins += mainVein;

    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float x = -0.15 + fi * 0.04;
        float angle = 0.6 + fi * 0.05;
        float2 start = float2(x, 0.0);
        float2 end = start + float2(cos(angle), sin(angle)) * (0.08 + fi * 0.01);
        veins += leafVeinLineMtl(uv, start, end, 0.002);
        end = start + float2(cos(-angle), sin(-angle)) * (0.08 + fi * 0.01);
        veins += leafVeinLineMtl(uv, start, end, 0.002);
    }
    return clamp(veins, 0.0, 1.0);
}

fragment float4 leafVeinsFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    uv.x += 0.05 * sin(iTime * 0.5);

    float3 col = float3(0.05, 0.08, 0.03);

    float leaf = leafShapeMtl(uv);
    float3 leafCol = mix(float3(0.15, 0.45, 0.1), float3(0.3, 0.6, 0.15), uv.x + 0.5);
    leafCol += 0.1 * sin(iTime + uv.x * 10.0);

    float veins = leafVeinPatternMtl(uv);
    float3 veinCol = float3(0.2, 0.55, 0.15);
    leafCol = mix(leafCol, veinCol, veins * 0.6);

    float pulse = 0.5 + 0.5 * sin(iTime * 2.0 - length(uv) * 8.0);
    leafCol += veins * pulse * float3(0.0, 0.15, 0.05);

    col = mix(col, leafCol, leaf);

    return float4(col, 1.0);
}
