#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

fragment float4 synthwaveSunsetFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    uv.y += 0.1;
    float t = iTime * 0.3;

    float3 skyTop = float3(0.05, 0.0, 0.15);
    float3 skyMid = float3(0.4, 0.0, 0.3);
    float3 skyBot = float3(0.95, 0.3, 0.1);
    float skyGrad = uv.y + 0.3;
    float3 sky;
    if (skyGrad > 0.5) {
        sky = mix(skyMid, skyTop, (skyGrad - 0.5) * 2.0);
    } else {
        sky = mix(skyBot, skyMid, skyGrad * 2.0);
    }

    float horizon = -0.05;

    float2 sunCenter = float2(0.0, horizon + 0.2 - fmod(t * 0.1, 0.4));
    float sunDist = length(uv - sunCenter);
    float sun = smoothstep(0.22, 0.2, sunDist);

    float bandY = (uv.y - sunCenter.y) / 0.22;
    float bands = step(0.0, sin(bandY * 25.0));
    float bandMask = smoothstep(0.0, -0.15, uv.y - sunCenter.y);
    sun *= mix(1.0, bands, bandMask);

    float3 sunColor = mix(float3(1.0, 0.9, 0.2), float3(1.0, 0.2, 0.4), clamp(-bandY * 0.5 + 0.5, 0.0, 1.0));
    float3 col = mix(sky, sunColor, sun);

    col += float3(1.0, 0.3, 0.5) * exp(-sunDist * 3.0) * 0.4;

    if (uv.y < horizon) {
        float depth = (horizon - uv.y);
        float perspZ = 0.5 / depth;
        float perspX = uv.x * perspZ;

        float scrollZ = perspZ - t * 2.0;

        float gridX = abs(fract(perspX * 0.5) - 0.5);
        float gridZ = abs(fract(scrollZ * 0.15) - 0.5);

        float lineX = smoothstep(0.02, 0.0, gridX);
        float lineZ = smoothstep(0.02, 0.0, gridZ);
        float grid = max(lineX, lineZ);

        float fade = exp(-depth * 3.0);
        float3 gridColor = float3(0.8, 0.1, 0.8) * grid * fade;

        float3 floorColor = float3(0.02, 0.0, 0.05);
        col = floorColor + gridColor;

        float3 sunReflect = sunColor * exp(-abs(uv.x) * 5.0) * 0.3 * fade;
        col += sunReflect;

        float horizonGlow = exp(-depth * 15.0);
        col += float3(0.8, 0.2, 0.5) * horizonGlow * 0.5;
    }

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
