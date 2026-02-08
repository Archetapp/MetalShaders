#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float penHash(float2 p){return fract(sin(dot(p,float2(41.1,67.7)))*4758.5);}

fragment float4 penroseTilingFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.2;
    float minD=1e9;
    float3 col=float3(0.02,0.02,0.05);
    for(int i=0;i<5;i++){
        float angle=float(i)*M_PI_F/5.0+t*0.1;
        float ca=cos(angle),sa=sin(angle);
        float2 ruv=float2x2(ca,-sa,sa,ca)*uv;
        float s=0.3;
        float2 cell=floor(ruv/s+0.5)*s;
        float d=length(ruv-cell);
        float h=penHash(cell+float(i)*100.0);
        if(d<minD){
            minD=d;
            float3 hc=0.5+0.4*cos(t*0.5+h*6.28+float3(0,2,4)+float(i)*1.2);
            col=hc;
        }
    }
    float edge=smoothstep(0.0,0.01,abs(minD-0.06));
    col*=mix(1.5,1.0,edge);
    float grid=0.0;
    for(int i=0;i<5;i++){
        float angle=float(i)*M_PI_F/5.0+t*0.1;
        float ca=cos(angle),sa=sin(angle);
        float2 ruv=float2x2(ca,-sa,sa,ca)*uv;
        float s=0.3;
        float2 f=fract(ruv/s+0.5)-0.5;
        float d=min(abs(f.x),abs(f.y));
        grid=max(grid,1.0-smoothstep(0.0,0.008,d));
    }
    col=mix(col,float3(0.9,0.85,0.7),grid*0.4);
    return float4(col,1.0);
}
