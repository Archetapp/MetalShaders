#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 displacementWarpFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));
    float2 pokePoint = float2(sin(iTime * 0.6) * 0.25, cos(iTime * 0.5) * 0.2);
    float2 toPoint = uv - pokePoint;
    float dist = length(toPoint);
    float pokeRadius = 0.25;
    float pokeStrength = 0.15;
    float displacement = pokeStrength * exp(-dist * dist / (pokeRadius * pokeRadius * 0.3));
    float2 warpedUv = uv + normalize(toPoint + 0.001) * displacement;
    float checker = step(0.0, sin(warpedUv.x * 20.0) * sin(warpedUv.y * 20.0));
    float3 color1 = float3(0.2, 0.4, 0.7);
    float3 color2 = float3(0.9, 0.85, 0.8);
    float3 pattern = mix(color1, color2, checker);
    float ring1 = smoothstep(0.22, 0.2, abs(length(warpedUv) - 0.3));
    float ring2 = smoothstep(0.15, 0.13, abs(length(warpedUv - float2(0.2, 0.1)) - 0.15));
    pattern = mix(pattern, float3(0.8, 0.3, 0.2), ring1 * 0.7);
    pattern = mix(pattern, float3(0.2, 0.7, 0.4), ring2 * 0.6);

    float2 eps = float2(0.001, 0.0);
    float dR = pokeStrength * exp(-pow(length(uv + eps - pokePoint), 2.0) / (pokeRadius * pokeRadius * 0.3));
    float dU = pokeStrength * exp(-pow(length(uv + eps.yx - pokePoint), 2.0) / (pokeRadius * pokeRadius * 0.3));
    float3 normal = normalize(float3((dR - displacement) * 50.0, (dU - displacement) * 50.0, 1.0));
    float3 lightDir = normalize(float3(0.5, 0.8, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, normal), float3(0, 0, 1)), 0.0), 32.0);
    float3 col = pattern * (0.4 + diff * 0.6) + spec * 0.3;
    float shadow = smoothstep(pokeRadius, 0.0, dist) * 0.15;
    col *= 1.0 - shadow;
    return float4(col, 1.0);
}
