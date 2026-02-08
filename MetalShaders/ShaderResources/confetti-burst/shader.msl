#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float cbHash(float p){return fract(sin(p*127.1)*43758.5453);}
fragment float4 confettiBurstFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.95,0.95,0.97);float burstTime=fmod(t,3.0);
    for(int i=0;i<60;i++){float fi=float(i);
        float angle=cbHash(fi)*6.28;float speed=0.3+cbHash(fi+100.0)*0.4;
        float2 vel=float2(cos(angle),sin(angle))*speed;
        float2 pos=vel*burstTime+float2(0,-0.5*burstTime*burstTime*0.5);
        float spin=burstTime*5.0+fi*2.0;
        float w=0.008+cbHash(fi+200.0)*0.006,h=0.003+cbHash(fi+300.0)*0.004;
        float cs=cos(spin),sn=sin(spin);float2 d=uv-pos;
        float2 rd=float2(d.x*cs-d.y*sn,d.x*sn+d.y*cs);
        float rect=step(abs(rd.x),w*(1.0+sin(burstTime*8.0+fi)*0.15))*step(abs(rd.y),h);
        float fade=1.0-smoothstep(1.5,3.0,burstTime);
        float3 confettiCol=max(0.5+0.5*cos(6.28*(cbHash(fi+400.0)+float3(0,0.33,0.67))),float3(0.3));
        col=mix(col,confettiCol,rect*fade);}
    return float4(col,1.0);}
