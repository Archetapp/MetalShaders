#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float causticLightNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

float causticLightCalc(float2 uv, float t) {
    float c=0.0;
    for(int i=0;i<4;i++){float fi=float(i);float s=3.0+fi*2.0;float sp=0.3+fi*0.15;
    float2 p=uv*s+float2(t*sp,t*sp*0.7);c+=sin(causticLightNoise(p)*6.28+t*(1.0+fi*0.5))/s;}
    return c*0.5+0.5;
}

fragment float4 causticLightPatternsFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float caustic = causticLightCalc(uv,iTime)*causticLightCalc(uv+float2(0.3,0.7),iTime*0.8)+causticLightCalc(uv*1.5,iTime*1.2)*0.3;
    caustic = pow(caustic,1.5)*2.0;
    float3 col = float3(0,0.15,0.3)+float3(0.3,0.7,0.9)*caustic*0.4+float3(0.8,0.95,1.0)*pow(caustic,3.0)*0.3;
    col *= 0.6+0.4*smoothstep(-0.5,0.5,uv.y);
    return float4(col, 1.0);
}
