#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float oilWaterNoise(float2 p) {
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float oilWaterFbm(float2 p) {
    float v=0.0,a=0.5;float2x2 r=float2x2(0.8,0.6,-0.6,0.8);
    for(int i=0;i<5;i++){v+=a*oilWaterNoise(p);p=r*p*2.0;a*=0.5;}return v;
}

fragment float4 oilAndWaterFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float boundary = oilWaterFbm(uv*3.0+iTime*0.15)+oilWaterFbm(uv*6.0-iTime*0.1)*0.3;
    boundary += sin(uv.x*5.0+iTime*0.3)*0.1+sin(uv.y*4.0-iTime*0.2)*0.1;
    float oilMask = smoothstep(0.48,0.52,boundary);
    float3 waterColor = float3(0.1,0.3,0.5)+sin(uv.x*20.0+iTime)*sin(uv.y*15.0+iTime*0.7)*0.05*float3(0.1,0.2,0.3);
    float thinFilm = dot(uv,float2(sin(iTime*0.2),cos(iTime*0.3)))*5.0+oilWaterFbm(uv*8.0)*3.0;
    float3 rainbow = 0.5+0.5*cos(6.28*(thinFilm+float3(0,0.33,0.67)));
    float3 oilColor = mix(float3(0.15,0.12,0.05), rainbow*0.4, 0.5);
    float edgeGlow = smoothstep(0.05,0.0,abs(boundary-0.5));
    float3 col = mix(waterColor, oilColor, oilMask)+edgeGlow*rainbow*0.3;
    return float4(col, 1.0);
}
