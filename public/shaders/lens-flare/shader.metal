#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 lensFlareFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float2 lp = float2(sin(iTime*0.4)*0.3,cos(iTime*0.3)*0.2+0.15);
    float2 tl = uv-lp; float dist = length(tl);
    float3 col = float3(0.01,0.01,0.02);
    col += 0.02/(dist+0.02)*float3(1,0.9,0.7)*0.3;
    col += exp(-dist*dist*500.0)*float3(1,0.95,0.9);
    col += exp(-tl.y*tl.y*100.0)*exp(-abs(tl.x)*3.0)*float3(0.3,0.5,0.8)*0.3;
    for(int i=0;i<6;i++){float fi=float(i);float gs=0.3+fi*0.25;
    float2 gp=-lp*gs;float gd=length(uv-gp);float gsz=0.02+fi*0.015;
    float ghost=exp(-pow(gd-gsz,2.0)*1000.0)+exp(-gd*gd*200.0)*0.3;
    col+=ghost*(0.5+0.5*cos(6.28*(fi*0.15+float3(0,0.33,0.67))))*0.15;}
    for(int i=0;i<8;i++){float angle=float(i)*0.785+0.2;
    float2 sd=float2(cos(angle),sin(angle));
    col+=exp(-pow(max(abs(dot(tl,sd)),0.0),1.0)*50.0)*exp(-dist*5.0)*float3(0.8,0.85,1.0)*0.05;}
    float iris=exp(-pow(dist-0.08,2.0)*2000.0)*0.2;
    col+=iris*float3(0.5,0.3,0.8);
    float chromatic=exp(-dist*8.0)*0.1;
    col.r+=chromatic*0.3;
    col.b+=chromatic*0.2;
    return float4(col, 1.0);
}
