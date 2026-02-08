#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 puddleSplashFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y),
                                          iResolution.y / min(iResolution.x, iResolution.y));
    float rippleHeight = 0.0;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float dropInterval = 1.5 + fi * 0.7;
        float dropTime = fmod(iTime + fi * 2.3, dropInterval);
        float2 dropPos = float2(sin(fi * 3.1 + floor((iTime + fi * 2.3) / dropInterval) * 1.7) * 0.3,
                                cos(fi * 2.7 + floor((iTime + fi * 2.3) / dropInterval) * 2.1) * 0.2);
        float dist = length(uv - dropPos);
        float waveRadius = dropTime * 0.4;
        float decay = exp(-dropTime * 1.5);
        float wavelength = 0.05;
        float wave = sin((dist - waveRadius) * 6.28 / wavelength) * decay;
        wave *= smoothstep(waveRadius + wavelength, waveRadius - wavelength * 2.0, dist);
        wave *= smoothstep(0.0, wavelength, dist);
        rippleHeight += wave * 0.02;
    }
    float2 eps = float2(0.001, 0.0);
    float rH = rippleHeight;
    float3 normal = normalize(float3(0.0, 0.0, 1.0));

    float3 viewDir = float3(0.0, 0.0, 1.0);
    float3 reflectDir = reflect(-viewDir, normal);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    float3 reflectedSky = mix(float3(0.4, 0.5, 0.6), float3(0.7, 0.75, 0.8), reflectDir.y * 0.5 + 0.5);
    float3 waterColor = float3(0.1, 0.15, 0.2);
    float3 puddleColor = mix(waterColor, reflectedSky, 0.3 + fresnel * 0.5);
    puddleColor += rippleHeight * 5.0;

    float3 lightDir = normalize(float3(0.3, 0.8, 0.5));
    float spec = pow(max(dot(reflectDir, lightDir), 0.0), 64.0);
    puddleColor += spec * float3(1.0, 0.98, 0.95) * 0.6;

    float puddleMask = smoothstep(0.5, 0.45, length(uv * float2(0.8, 1.0)));
    float3 groundColor = float3(0.25, 0.22, 0.2);
    float3 col = mix(groundColor, puddleColor, puddleMask);
    return float4(col, 1.0);
}
