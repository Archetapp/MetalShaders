#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 apollonianGasketFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.02,0.06);float minDist=1e5;int depth=0;float2 p=uv*2.0;
    for(int iter=0;iter<8;iter++){float r=length(p);
        if(r<0.01)break;float d=abs(r-1.0);
        if(d<minDist){minDist=d;depth=iter;}
        p=p/(r*r);p.x+=1.0+0.1*sin(t*0.3+float(iter));
        p*=2.0+0.5*sin(t*0.2);p=p-floor(p+0.5);}
    float3 circCol=0.5+0.5*cos(6.28*(float(depth)*0.125+t*0.05+float3(0,0.33,0.67)));
    col+=circCol*smoothstep(0.05,0.0,minDist)*0.8+circCol*0.02/(minDist+0.02)*0.2;
    col+=float3(0.5)*smoothstep(0.02,0.0,abs(length(uv*2.0)-1.0));
    return float4(col,1.0);}
