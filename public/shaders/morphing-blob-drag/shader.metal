#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 morphingBlobDragFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));

    float2 dragPos = float2(sin(iTime * 0.7) * 0.3, cos(iTime * 0.5) * 0.25);

    float field = 0.0;
    float3 colorField = float3(0.0);

    float mainBlob = 0.12 / (length(uv - dragPos) + 0.0001);
    field += mainBlob;
    colorField += mainBlob * float3(0.3, 0.6, 1.0);

    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float angle = fi * 1.047 + iTime * 0.3;
        float radius = 0.2 + 0.1 * sin(iTime * 0.4 + fi);
        float2 blobPos = float2(cos(angle), sin(angle)) * radius;

        float dist = length(uv - blobPos);
        float blobSize = 0.06 + 0.02 * sin(iTime * 0.5 + fi * 2.0);
        float blob = blobSize / (dist + 0.0001);
        field += blob;

        float3 blobColor = 0.5 + 0.5 * cos(6.28 * (fi * 0.15 + float3(0.0, 0.33, 0.67)));
        colorField += blob * blobColor;
    }

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float2 trailPos = dragPos - normalize(float2(cos(iTime * 0.7), -sin(iTime * 0.5))) * (fi + 1.0) * 0.06;
        float trailBlob = (0.04 - fi * 0.008) / (length(uv - trailPos) + 0.0001);
        field += trailBlob;
        colorField += trailBlob * float3(0.2, 0.4, 0.9);
    }

    float3 col = float3(0.02, 0.02, 0.05);

    float surface = smoothstep(0.9, 1.1, field);
    float3 blobColor = colorField / max(field, 0.001);

    float edge = smoothstep(0.85, 1.0, field) - smoothstep(1.0, 1.15, field);
    float highlight = smoothstep(1.5, 2.5, field);

    col = mix(col, blobColor * 0.6, surface);
    col += edge * float3(0.4, 0.6, 1.0) * 0.5;
    col += highlight * float3(0.8, 0.9, 1.0) * 0.4;

    float glow = smoothstep(2.0, 0.5, field) * 0.1;
    col += glow * blobColor;

    col = pow(col, float3(0.9));
    return float4(col, 1.0);
}
