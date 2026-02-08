#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 chevronPulseFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float3 col=float3(0.05,0.05,0.12);
    float scale=12.0;
    float y=uv.y*scale+t*2.0;
    float row=floor(y);
    float fy=fract(y);
    float chevron=abs(uv.x)*3.0-fy*0.5;
    float pulse=sin(row*0.5-t*3.0)*0.5+0.5;
    float shape=smoothstep(0.02,0.0,abs(chevron-0.3)-0.08);
    shape+=smoothstep(0.02,0.0,abs(chevron-0.15)-0.06)*0.5;
    float3 chevCol=mix(float3(0.1,0.5,0.9),float3(0.0,0.9,0.6),pulse);
    chevCol*=(0.5+0.5*pulse);
    col+=chevCol*shape;
    float glow=shape*pulse*0.3;
    col+=chevCol*glow;
    return float4(col,1.0);
}
