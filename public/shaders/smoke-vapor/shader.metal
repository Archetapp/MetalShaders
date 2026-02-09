#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float smokeVaporHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float smokeVaporNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(smokeVaporHash(i), smokeVaporHash(i+float2(1,0)), f.x), mix(smokeVaporHash(i+float2(0,1)), smokeVaporHash(i+float2(1,1)), f.x), f.y);
}
float smokeVaporFbm(float2 p) {
    float v = 0.0, a = 0.5;
    float2x2 rot = float2x2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 6; i++) { v += a * smokeVaporNoise(p); p = rot * p * 2.0; a *= 0.5; }
    return v;
}

fragment float4 smokeVaporFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float3 col = float3(0.02, 0.02, 0.03);
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float2 smokeUv = uv - float2((fi-1.0)*0.2, -0.4);
        smokeUv.x += sin(smokeUv.y*3.0+iTime*0.5+fi)*0.1*(smokeUv.y+0.4);
        smokeUv.x *= 1.0/(1.0+(smokeUv.y+0.4)*0.8);
        float height = smokeUv.y+0.4;
        if (height > 0.0) {
            float density = smokeVaporFbm(float2(smokeUv.x*4.0, smokeUv.y*2.0-iTime*0.3+fi*10.0));
            density += smokeVaporFbm(float2(smokeUv.x*8.0+iTime*0.1, smokeUv.y*4.0-iTime*0.5+fi*20.0))*0.5;
            density *= exp(-abs(smokeUv.x)*4.0) * exp(-height*1.5) * smoothstep(0.0, 0.1, height);
            density = max(density-0.2, 0.0)*1.5;
            float3 smokeColor = mix(float3(0.4,0.4,0.45), float3(0.25,0.25,0.3), height);
            smokeColor += float3(0.3,0.2,0.1)*exp(-height*2.0)*0.3;
            col = mix(col, smokeColor, density*0.6);
        }
    }
    float ambientSmoke = smokeVaporFbm(uv * 3.0 + iTime * 0.02) * 0.05;
    col += ambientSmoke * float3(0.2, 0.2, 0.25);
    return float4(col, 1.0);
}
