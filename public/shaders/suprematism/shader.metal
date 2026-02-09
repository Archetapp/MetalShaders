#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float spHash(float p){return fract(sin(p*127.1)*43758.5);}
fragment float4 suprematismFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.95,0.93,0.9);
    for(int i=0;i<8;i++){float fi=float(i);
        float2 pos=float2(spHash(fi*3.0)-0.5,spHash(fi*3.0+1.0)-0.5)*0.6+float2(sin(t*0.2+fi),cos(t*0.15+fi*1.3))*0.03;
        float angle=spHash(fi*3.0+2.0)*M_PI_F+t*0.1*(spHash(fi)-0.5);
        float w=0.05+spHash(fi*5.0)*0.15,h=0.02+spHash(fi*5.0+1.0)*0.1;
        float2 d=uv-pos;float cs=cos(angle),sn=sin(angle);
        float2 rd=float2(d.x*cs-d.y*sn,d.x*sn+d.y*cs);
        float rect=step(abs(rd.x),w)*step(abs(rd.y),h);float ci=fmod(fi,4.0);float3 shapeCol;
        if(ci<1.0)shapeCol=float3(0.85,0.1,0.1);else if(ci<2.0)shapeCol=float3(0.1);
        else if(ci<3.0)shapeCol=float3(0.1,0.15,0.55);else shapeCol=float3(0.9,0.75,0.1);
        col=mix(col,shapeCol,rect);}
    float cross1=step(abs(uv.x),0.005)*step(abs(uv.y-0.1),0.15);
    float cross2=step(abs(uv.y),0.005)*step(abs(uv.x+0.1),0.15);
    col=mix(col,float3(0.1),max(cross1,cross2)*0.5);
    return float4(col,1.0);}
