#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 rotatingIllusionFragment(VertexOut in [[stage_in]],
                                          constant float &iTime [[buffer(0)]],
                                          constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;
    float3 col = float3(0.85);

    for (int ring = 0; ring < 4; ring++) {
        float ringR = 0.08 + float(ring) * 0.1;
        float ringWidth = 0.04;
        int count = 8 + ring * 4;

        for (int i = 0; i < 24; i++) {
            if (i >= count) break;
            float fi = float(i);
            float angle = fi / float(count) * 2.0 * M_PI_F;
            float direction = fmod(float(ring), 2.0) < 0.5 ? 1.0 : -1.0;
            angle += iTime * 0.3 * direction;

            float2 pos = float2(cos(angle), sin(angle)) * ringR;
            float2 d = uv - pos;
            float dist = length(d);

            float cell = smoothstep(ringWidth, ringWidth * 0.6, dist);
            float localAngle = atan2(d.y, d.x);

            float3 c1 = float3(0.15);
            float3 c2 = float3(0.95);
            float pattern = step(0.0, sin(localAngle * 3.0 + fi * 0.5));
            float3 cellCol = mix(c1, c2, pattern);

            float asymmetry = 0.5 + 0.5 * sin(localAngle * 2.0 + direction * 1.5708);
            cellCol = mix(cellCol, float3(0.5, 0.5, 0.55), asymmetry * 0.3);

            col = mix(col, cellCol, cell);
        }
    }

    float centerDot = smoothstep(0.015, 0.005, length(uv));
    col = mix(col, float3(0.1), centerDot);

    float breath = 0.97 + 0.03 * sin(iTime * 1.5);
    col *= breath;

    return float4(col, 1.0);
}
