#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float iceFreezeNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

fragment float4 iceFreezeOverFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float fp = smoothstep(0.0,1.5,fmod(iTime*0.3,2.0));
    float2 fo = float2(sin(floor(iTime*0.15)*2.3)*0.2, cos(floor(iTime*0.15)*1.7)*0.15);
    float dist = length(uv-fo);
    float fn = iceFreezeNoise(uv*8.0)*0.2+iceFreezeNoise(uv*16.0)*0.1;
    float fe = dist+fn-fp*0.8;
    float frozen = smoothstep(0.02,-0.02,fe);
    float3 warm = float3(0.8,0.4,0.2);
    float3 ice = float3(0.7,0.85,0.95)+iceFreezeNoise(uv*20.0)*0.1;
    float crystal = 0.0;
    for(int i=0;i<6;i++){float a=float(i)*1.047;float2 d=float2(cos(a),sin(a));
    crystal+=smoothstep(0.008,0.0,abs(dot(uv-fo,d)))*smoothstep(fp*0.5,0.0,abs(dot(uv-fo,float2(-d.y,d.x))));}
    float3 col = mix(warm,ice,frozen);
    col += crystal*frozen*float3(0.5,0.7,0.9)*0.5;
    return float4(col, 1.0);
}
