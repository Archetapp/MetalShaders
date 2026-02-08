#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float paintPeelNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

fragment float4 paintPeelFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv; float2 centered = uv*2.0-1.0; centered.x *= iResolution.x/iResolution.y;
    float pp = sin(iTime*0.3)*0.5+0.5;
    float pl = centered.x+centered.y*0.3-(pp*2.5-1.0)+paintPeelNoise(centered*5.0)*0.15;
    float peeled = smoothstep(0.0,0.05,pl);
    float3 under = float3(0.6,0.55,0.45)+paintPeelNoise(centered*10.0)*0.1;
    float3 paint = float3(0.3,0.5,0.7);
    float cw = 0.15;
    float cz = smoothstep(cw,0.0,pl)*smoothstep(-0.02,0.0,pl);
    float ca = (1.0-pl/cw)*M_PI_F*1.5;
    float3 cc = mix(paint*max(cos(ca)*0.5+0.5,0.0), under*(1.0-max(cos(ca)*0.5+0.5,0.0)), step(M_PI_F*0.5,ca));
    float3 col = mix(under*(1.0-peeled), paint, peeled);
    col = mix(col,cc,cz);
    col *= 1.0-smoothstep(cw*1.5,0.0,pl)*0.3*(1.0-peeled);
    return float4(col, 1.0);
}
