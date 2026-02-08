#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float dissolveEmberNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float dissolveEmberFbm(float2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*dissolveEmberNoise(p);p*=2.0;a*=0.5;}return v;}

fragment float4 dissolveToEmbersFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float cycle = fmod(iTime*0.3,2.0);
    float burnProgress = smoothstep(0.0,1.5,cycle);
    float2 bo = float2(sin(floor(iTime*0.3/2.0)*2.3)*0.2, cos(floor(iTime*0.3/2.0)*1.7)*0.15);
    float dist = length(uv-bo);
    float noise = dissolveEmberFbm(uv*5.0)*0.3+dissolveEmberFbm(uv*10.0)*0.15;
    float burnEdge = dist+noise-burnProgress*0.8;
    float burned = smoothstep(0.02,-0.02,burnEdge);
    float glowEdge = smoothstep(0.1,0.0,burnEdge)-burned;
    float content = step(0.0,sin(uv.x*15.0))*step(0.0,sin(uv.y*10.0));
    float3 contentColor = mix(float3(0.3,0.5,0.7),float3(0.7,0.5,0.3),content);
    float3 glowColor = mix(float3(1,0.6,0.1),float3(1,0.2,0),smoothstep(0.0,0.08,burnEdge));
    float3 col = float3(0.02);
    col = mix(col, contentColor, 1.0-burned);
    col += glowColor*glowEdge*2.0;
    return float4(col, 1.0);
}
