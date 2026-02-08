#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 polarRoseFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float r=length(uv);float theta=atan2(uv.y,uv.x);
    float3 col=float3(0.02,0.02,0.06);
    for(int i=0;i<4;i++){float fi=float(i);
        float n=2.0+fi+sin(t*0.3+fi);float d=3.0+fi*0.5;
        float dist=abs(r-abs(0.35*cos(n*theta/d+t*0.5*fi*0.2)));
        float3 rc=0.5+0.5*cos(6.28*(fi*0.25+t*0.05+float3(0,0.33,0.67)));
        col+=rc*smoothstep(0.008,0.0,dist)*0.6+rc*0.002/(dist+0.002)*0.15;}
    return float4(col,1.0);}
