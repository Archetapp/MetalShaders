#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 torusKnotFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.02,0.06);float p_val=3.0;float q_val=2.0+sin(t*0.2);
    float R=0.25;float r_val=0.1;
    for(float s=0.0;s<300.0;s+=1.0){float param=s*0.021;
        float cp=cos(p_val*param+t*0.3),sp=sin(p_val*param+t*0.3);
        float cq=cos(q_val*param),sq_v=sin(q_val*param);
        float x=(R+r_val*cq)*cp,y=(R+r_val*cq)*sp,z=r_val*sq_v;
        float px=x*cos(t*0.2)-z*sin(t*0.2),py=y,pz=x*sin(t*0.2)+z*cos(t*0.2);
        float scale=1.0/(2.0+pz);float2 proj=float2(px,py)*scale;
        float d=length(uv-proj);float thickness=0.004*(0.5+scale);
        float3 knotCol=0.5+0.5*cos(6.28*(param*0.3+float3(0,0.33,0.67)));
        float bright=0.5+0.5*pz;
        col+=knotCol*smoothstep(thickness,thickness-0.002,d)*bright*0.15+knotCol*0.0002/(d+0.002)*bright*0.3;}
    return float4(col,1.0);}
