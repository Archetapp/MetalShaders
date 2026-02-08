#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float iceHash(float2 p) { return fract(sin(dot(p, float2(127.1,311.7))) * 43758.5453); }

float2 iceRandom2(float2 p) {
    return float2(iceHash(p), iceHash(p + float2(53.0, 91.0)));
}

float iceVoronoi(float2 p, float time, thread float2 &cellId) {
    float2 i = floor(p); float2 f = fract(p);
    float md = 8.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        float2 n = float2(float(x), float(y));
        float2 r = iceRandom2(i + n);
        r = 0.5 + 0.4 * sin(time * 0.2 + 6.28 * r);
        float d = length(n + r - f);
        if (d < md) { md = d; cellId = i + n; }
    }
    return md;
}

fragment float4 iceCrystalsFragment(VertexOut in [[stage_in]],
                                     constant float &iTime [[buffer(0)]],
                                     constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.2;
    
    float2 cellId;
    float d1 = iceVoronoi(uv * 10.0, iTime, cellId);
    
    float angle = atan2(fract(uv.y * 10.0) - 0.5, fract(uv.x * 10.0) - 0.5);
    float sixfold = abs(sin(angle * 3.0));
    
    float branch = smoothstep(0.3, 0.0, d1) * sixfold;
    float crystal = smoothstep(0.15, 0.0, d1);
    
    float detail = iceHash(cellId * 7.0);
    float fineStructure = pow(abs(sin(angle * 6.0 + detail * 6.28)), 3.0);
    
    float3 bg = float3(0.05, 0.1, 0.2);
    float3 ice = float3(0.6, 0.8, 0.95);
    float3 bright = float3(0.9, 0.95, 1.0);
    
    float3 col = bg;
    col = mix(col, ice, branch * 0.6 + crystal * 0.4);
    col += fineStructure * crystal * float3(0.3, 0.4, 0.5) * 0.3;
    col += pow(crystal, 3.0) * bright * 0.5;
    
    float sparkle = pow(iceHash(uv * 50.0 + t), 15.0) * crystal;
    col += sparkle * float3(1.0) * 0.8;
    
    return float4(col, 1.0);
}
