#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float laserGridNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

fragment float4 laserGridFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float3 col = float3(0.02,0.02,0.03)+laserGridNoise(uv*3.0+iTime*0.1)*0.05*float3(0.1,0.15,0.2);
    for(int i=0;i<4;i++){float fi=float(i);
    float sp=sin(iTime*(0.5+fi*0.2)+fi*1.5)*0.4;
    float3 bc = fi<2.0?float3(1,0.1,0.1):float3(0.1,1,0.2);
    float beamGlowH=exp(-abs(uv.y-sp)*30.0);
    col+=bc*smoothstep(0.004,0.0,abs(uv.y-sp))*0.8+bc*beamGlowH*0.15;
    float fogScatter=laserGridNoise(float2(uv.x*10.0,sp*20.0+iTime))*beamGlowH;
    col+=bc*fogScatter*0.1;}
    for(int i=0;i<4;i++){float fi=float(i);
    float sp=cos(iTime*(0.4+fi*0.15)+fi*2.0)*0.4;
    float3 bc=fi<2.0?float3(0.1,0.3,1):float3(0.8,0.1,0.8);
    col+=bc*smoothstep(0.004,0.0,abs(uv.x-sp))*0.8+bc*exp(-abs(uv.x-sp)*30.0)*0.15;}
    for(int i=0;i<4;i++){for(int j=0;j<4;j++){
    float hi=sin(iTime*(0.5+float(i)*0.2)+float(i)*1.5)*0.4;
    float vj=cos(iTime*(0.4+float(j)*0.15)+float(j)*2.0)*0.4;
    float2 intersection=float2(vj,hi);
    float intDist=length(uv-intersection);
    float intGlow=exp(-intDist*20.0)*0.3;
    col+=intGlow*float3(1.0,0.8,0.9);}}
    return float4(col, 1.0);
}
