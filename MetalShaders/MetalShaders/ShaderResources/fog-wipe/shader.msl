#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float fogWipeHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float fogWipeNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(fogWipeHash(i), fogWipeHash(i+float2(1,0)), f.x), mix(fogWipeHash(i+float2(0,1)), fogWipeHash(i+float2(1,1)), f.x), f.y);
}
float fogWipeFbm(float2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * fogWipeNoise(p); p *= 2.0; a *= 0.5; }
    return v;
}

fragment float4 fogWipeFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;
    float3 scene = float3(0.1, 0.15, 0.2);
    scene += smoothstep(-0.5, 0.5, centered.y) * float3(0.05, 0.08, 0.1);
    float fogDensity = fogWipeFbm(centered * 2.0 + float2(iTime * 0.05, 0.0));
    fogDensity += fogWipeFbm(centered * 4.0 - float2(iTime * 0.08, iTime * 0.02)) * 0.5;
    fogDensity = fogDensity * 0.6 + 0.3;
    float clearMask = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float t = iTime * 0.3 + fi * 1.8;
        float2 wipePos = float2(sin(t * 0.7 + fi) * 0.5, cos(t * 0.5 + fi * 0.7) * 0.4);
        float wipeAge = fract(t / 5.0) * 5.0;
        float wipeRadius = 0.2 + 0.1 * sin(fi);
        float wipeClear = smoothstep(wipeRadius, wipeRadius * 0.3, length(centered - wipePos));
        float regrow = smoothstep(0.0, 4.0, wipeAge) * 0.8;
        clearMask = max(clearMask, wipeClear * (1.0 - regrow));
    }
    float3 fogColor = float3(0.6, 0.65, 0.7) + fogWipeFbm(centered * 3.0 + iTime * 0.02) * 0.1;
    float finalFog = fogDensity * (1.0 - clearMask);
    float3 col = mix(scene, fogColor, finalFog);
    return float4(col, 1.0);
}
