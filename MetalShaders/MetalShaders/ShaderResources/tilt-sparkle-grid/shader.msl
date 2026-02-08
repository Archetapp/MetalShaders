#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float tsgHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float2 tsgHash2(float2 p) {
    return float2(tsgHash(p), tsgHash(p + float2(37.0, 91.0)));
}

fragment float4 tiltSparkleGridFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    float tiltX = sin(iTime * 0.7) * 0.5;
    float tiltY = cos(iTime * 0.5) * 0.4;
    float3 viewDir = normalize(float3(tiltX, tiltY, 1.0));
    float3 lightDir = normalize(float3(sin(iTime * 0.3) * 0.8, cos(iTime * 0.4) * 0.6, 1.0));

    float gridSize = 40.0;
    float2 gridUv = uv * gridSize;
    float2 cellId = floor(gridUv);
    float2 cellLocal = fract(gridUv) - 0.5;

    float2 facetAngles = (tsgHash2(cellId) - 0.5) * 1.2;
    float3 facetNormal = normalize(float3(facetAngles, 1.0));

    float3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(facetNormal, halfVec), 0.0), 256.0);

    float sparkleSize = 0.15 + tsgHash(cellId + 200.0) * 0.2;
    float pointMask = smoothstep(sparkleSize, sparkleSize * 0.5, length(cellLocal));

    float twinkle = sin(iTime * (2.0 + tsgHash(cellId + 300.0) * 4.0) + tsgHash(cellId) * 6.28) * 0.5 + 0.5;
    twinkle = pow(twinkle, 3.0);

    float starShape = max(
        abs(cellLocal.x * 0.7 + cellLocal.y * 0.7),
        abs(cellLocal.x * 0.7 - cellLocal.y * 0.7)
    );
    float starMask = smoothstep(sparkleSize, sparkleSize * 0.3, starShape);

    float hue = tsgHash(cellId + 500.0);
    float3 sparkleColor = 0.5 + 0.5 * cos(6.28 * (hue + float3(0.0, 0.33, 0.67)));
    sparkleColor = mix(float3(1.0), sparkleColor, 0.4);

    float3 baseColor = float3(0.05, 0.05, 0.08);
    float sparkleIntensity = spec * pointMask * twinkle * 3.0 + starMask * spec * 0.5;
    float3 col = baseColor + sparkleColor * sparkleIntensity;

    float glow = exp(-length(cellLocal) * 6.0) * spec * twinkle * 0.5;
    col += sparkleColor * glow;

    col = pow(col, float3(0.9));
    return float4(col, 1.0);
}
