#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float treeGrowthHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float treeGrowthBranch(float2 p, float2 a, float2 b, float w) {
    float2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    return smoothstep(w, w * 0.3, d);
}

fragment float4 treeGrowthFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float growth = clamp(iTime * 0.3, 0.0, 1.0);
    float3 col = float3(0.02, 0.01, 0.04);

    float trunk = treeGrowthBranch(uv, float2(0.0, -0.5), float2(0.0, -0.1), 0.015);
    col += trunk * float3(0.4, 0.25, 0.1);

    float angle = 0.5;
    float len = 0.2;
    float totalBranch = 0.0;
    float totalLeaf = 0.0;

    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float branchGrowth = clamp(growth * 6.0 - fi, 0.0, 1.0);
        if (branchGrowth <= 0.0) break;

        float spread = angle + fi * 0.15;
        float l = len * pow(0.72, fi) * branchGrowth;
        float w = 0.012 * pow(0.65, fi);

        for (int j = 0; j < 4; j++) {
            float fj = float(j);
            float side = fj < 2.0 ? -1.0 : 1.0;

            float2 base = float2(side * 0.05 * (fi + 1.0), -0.1 + fi * 0.06);
            float a = spread * side + sin(iTime + fi + fj) * 0.05;
            float2 tip = base + float2(cos(a + 1.5708) * l, sin(a + 1.5708) * l);

            totalBranch += treeGrowthBranch(uv, base, tip, w);

            float leafSize = 0.02 * branchGrowth * (1.0 + 0.3 * sin(iTime * 2.0 + fi + fj));
            float leafDist = length(uv - tip);
            totalLeaf += smoothstep(leafSize, leafSize * 0.2, leafDist);
        }
    }

    col += totalBranch * float3(0.35, 0.2, 0.08);
    float3 leafCol = mix(float3(0.1, 0.5, 0.15), float3(0.3, 0.7, 0.1), sin(iTime) * 0.5 + 0.5);
    col += totalLeaf * leafCol;

    col += float3(0.02, 0.03, 0.0) * smoothstep(0.5, 0.0, length(uv));

    return float4(col, 1.0);
}
