#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float waterRippleWave(float2 uv, float2 center, float time, float birthTime) {
    float age = time - birthTime;
    if (age < 0.0) return 0.0;
    float dist = length(uv - center);
    float speed = 0.4;
    float freq = 18.0;
    float wave = sin(dist * freq - age * speed * freq) * exp(-dist * 3.0) * exp(-age * 1.2);
    return wave * smoothstep(0.0, 0.3, age);
}

fragment float4 touchWaterRippleFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;
    float2 uvAspect = float2(uv.x * aspect, uv.y);

    float totalDisplacement = 0.0;

    float2 touchPoints[5];
    touchPoints[0] = float2(0.5 + 0.3 * cos(iTime * 0.4), 0.5 + 0.3 * sin(iTime * 0.5));
    touchPoints[1] = float2(0.5 + 0.25 * sin(iTime * 0.7 + 1.0), 0.5 + 0.25 * cos(iTime * 0.3 + 2.0));
    touchPoints[2] = float2(0.5 + 0.35 * cos(iTime * 0.3 + 3.0), 0.5 + 0.2 * sin(iTime * 0.6 + 1.5));
    touchPoints[3] = float2(0.5 + 0.2 * sin(iTime * 0.5 + 4.0), 0.5 + 0.35 * cos(iTime * 0.4 + 3.0));
    touchPoints[4] = float2(0.5 + 0.3 * cos(iTime * 0.6 + 5.0), 0.5 + 0.3 * sin(iTime * 0.35 + 4.5));

    for (int i = 0; i < 5; i++) {
        float2 tp = float2(touchPoints[i].x * aspect, touchPoints[i].y);
        float interval = 2.0 + float(i) * 0.5;
        for (int j = 0; j < 4; j++) {
            float birthTime = floor(iTime / interval) * interval - float(j) * interval;
            totalDisplacement += waterRippleWave(uvAspect, tp, iTime, birthTime) * 0.03;
        }
    }

    float2 distortedUv = uv + float2(totalDisplacement, totalDisplacement * 0.8);

    float3 deepWater = float3(0.02, 0.08, 0.18);
    float3 shallowWater = float3(0.1, 0.3, 0.5);
    float3 highlight = float3(0.6, 0.85, 1.0);

    float depthGradient = distortedUv.y * 0.6 + 0.2;
    float3 baseColor = mix(deepWater, shallowWater, depthGradient);

    float caustic1 = sin(distortedUv.x * 25.0 + iTime * 1.5) * cos(distortedUv.y * 20.0 - iTime * 1.2);
    float caustic2 = sin(distortedUv.x * 18.0 - iTime * 0.8 + 2.0) * cos(distortedUv.y * 22.0 + iTime * 1.0);
    float caustics = pow(max(caustic1 + caustic2, 0.0), 2.0) * 0.15;

    baseColor += highlight * caustics;

    float specular = pow(max(totalDisplacement * 15.0, 0.0), 3.0);
    baseColor += float3(0.8, 0.9, 1.0) * specular;

    float rim = smoothstep(0.0, 0.005, totalDisplacement * totalDisplacement * 100.0);
    baseColor += highlight * rim * 0.1;

    baseColor += float3(0.05, 0.1, 0.15) * (1.0 - uv.y);

    return float4(baseColor, 1.0);
}
