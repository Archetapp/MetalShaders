#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float vvNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}

fragment float4 velvetFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = in.uv;
    float t = iTime;
    float3 baseColor = float3(0.4, 0.05, 0.1);
    float2 lightDir = normalize(float2(sin(t*0.5), cos(t*0.3)));
    float2 surfaceNormal = float2(0.0);
    float nScale = 50.0;
    surfaceNormal.x = vvNoise(uv*nScale+float2(0.1,0.0)) - vvNoise(uv*nScale-float2(0.1,0.0));
    surfaceNormal.y = vvNoise(uv*nScale+float2(0.0,0.1)) - vvNoise(uv*nScale-float2(0.0,0.1));
    float nDotL = dot(normalize(surfaceNormal+float2(0.0,0.0001)), lightDir);
    float rimLight = pow(1.0 - abs(nDotL), 3.0);
    float fuzz = vvNoise(uv*200.0)*0.15;
    float microFuzz = vvNoise(uv*500.0+t*0.1)*0.08;
    float3 col = baseColor * (0.4 + 0.3*max(nDotL, 0.0));
    col += baseColor * 2.0 * rimLight;
    col += float3(0.8, 0.3, 0.4) * rimLight * 0.5;
    col += fuzz * baseColor;
    col += microFuzz * float3(0.3, 0.1, 0.15);
    float fold1 = sin(uv.x*8.0+sin(uv.y*3.0)*2.0+t*0.2)*0.5+0.5;
    float fold2 = sin(uv.y*6.0+sin(uv.x*4.0)*1.5)*0.5+0.5;
    col *= 0.85 + fold1*0.1 + fold2*0.05;
    float sheen = pow(max(0.0, dot(lightDir, normalize(float2(fold1-0.5, fold2-0.5)+0.001))), 4.0);
    col += float3(0.6, 0.2, 0.3)*sheen*0.2;
    return float4(col, 1.0);
}
