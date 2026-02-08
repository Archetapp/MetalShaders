#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float dgHoloHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float3 dgHoloRainbow(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + float3(0.0, 0.33, 0.67)));
}

fragment float4 diamondGridHoloFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.5) * 0.6;
    float tiltY = cos(iTime * 0.7) * 0.4;
    float3 viewDir = normalize(float3(tiltX, tiltY, 1.0));
    float3 lightDir = normalize(float3(sin(iTime * 0.3), cos(iTime * 0.4), 1.2));

    float gridScale = 20.0;
    float2 rotUv = float2(uv.x + uv.y, uv.x - uv.y) * gridScale;
    float2 cellId = floor(rotUv);
    float2 cellUv = fract(rotUv) - 0.5;

    float facetAngleX = (dgHoloHash(cellId) - 0.5) * 0.6;
    float facetAngleY = (dgHoloHash(cellId + 100.0) - 0.5) * 0.6;
    float3 facetNormal = normalize(float3(facetAngleX, facetAngleY, 1.0));

    float spec = pow(max(dot(reflect(-lightDir, facetNormal), viewDir), 0.0), 96.0);
    float diff = max(dot(facetNormal, lightDir), 0.0);

    float diffraction = dot(cellId, viewDir.xy) * 0.15 + length(cellId) * 0.05;
    float3 holoColor = dgHoloRainbow(diffraction + iTime * 0.2);

    float edge = smoothstep(0.5, 0.45, abs(cellUv.x)) * smoothstep(0.5, 0.45, abs(cellUv.y));
    float edgeLine = 1.0 - smoothstep(0.42, 0.5, max(abs(cellUv.x), abs(cellUv.y)));

    float3 baseColor = float3(0.9, 0.9, 0.92);
    float3 col = baseColor * (0.3 + diff * 0.5);
    col = mix(col, holoColor, 0.5 * edge);
    col += spec * float3(1.0) * 1.5 * edge;
    col += edgeLine * 0.05;

    float borderMask = smoothstep(0.0, 0.02, uv.x) * smoothstep(0.0, 0.02, uv.y) *
                       smoothstep(0.0, 0.02, 1.0 - uv.x) * smoothstep(0.0, 0.02, 1.0 - uv.y);
    col *= borderMask;
    col = pow(col, float3(0.95));

    return float4(col, 1.0);
}
