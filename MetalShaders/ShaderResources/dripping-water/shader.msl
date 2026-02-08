#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float dripWaterHash(float n) { return fract(sin(n) * 43758.5453); }

fragment float4 drippingWaterFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));
    float3 col = float3(0.12, 0.12, 0.14);
    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float xPos = (dripWaterHash(fi * 1.23) - 0.5) * 0.8;
        float interval = 2.0 + dripWaterHash(fi * 2.47) * 2.0;
        float t = fmod(iTime + fi * 1.1, interval);
        float formTime = 0.8;
        if (t < formTime) {
            float fp = t / formTime;
            float dropSize = 0.01 + fp * 0.015;
            float yPos = 0.5 - fp * 0.03;
            float streak = smoothstep(0.005, 0.0, abs(uv.x - xPos)) * smoothstep(0.5, yPos + dropSize, uv.y);
            col += streak * float3(0.15, 0.2, 0.25) * fp;
            float dropDist = length(float2(uv.x - xPos, (uv.y - yPos) * 0.7));
            float drop = smoothstep(dropSize, dropSize * 0.5, dropDist);
            col = mix(col, float3(0.2, 0.25, 0.3), drop * 0.6);
        } else {
            float fallTime = t - formTime;
            float yPos = 0.5 - 0.03 - fallTime * fallTime * 0.75;
            if (yPos > -0.5) {
                float2 dv = float2(uv.x - xPos, (uv.y - yPos) * 0.6);
                float drop = smoothstep(0.012, 0.005, length(dv));
                col = mix(col, float3(0.2, 0.25, 0.3), drop * 0.6);
            }
        }
    }
    return float4(col, 1.0);
}
