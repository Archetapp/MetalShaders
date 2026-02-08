#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 moireCirclesFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.3;
    float2 c1=float2(0.15*cos(t),0.15*sin(t));
    float2 c2=float2(-0.15*cos(t*0.7),-0.15*sin(t*0.7));
    float freq=60.0;
    float r1=length(uv-c1);
    float r2=length(uv-c2);
    float p1=sin(r1*freq);
    float p2=sin(r2*freq);
    float moire=p1*p2;
    float3 col1=float3(0.1,0.4,0.8);
    float3 col2=float3(0.8,0.2,0.4);
    float3 col=mix(col1,col2,moire*0.5+0.5);
    col+=0.15*sin(moire*M_PI_F+t+float3(0,2,4));
    float v=0.8+0.2*moire;
    col*=v;
    return float4(col,1.0);
}
