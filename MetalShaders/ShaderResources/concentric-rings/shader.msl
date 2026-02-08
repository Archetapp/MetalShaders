#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 concentricRingsFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float r=length(uv);
    float a=atan2(uv.y,uv.x);
    float ring1=sin(r*30.0-t*3.0);
    float ring2=sin(r*25.0+t*2.0+a*2.0);
    float ring3=sin(r*35.0-t*1.5-a*3.0);
    float pattern=ring1*0.4+ring2*0.35+ring3*0.25;
    float3 col1=float3(0.1,0.3,0.7);
    float3 col2=float3(0.7,0.1,0.5);
    float3 col3=float3(0.0,0.7,0.5);
    float3 col=col1*max(0.0,ring1)+col2*max(0.0,ring2)+col3*max(0.0,ring3);
    col=col*0.5+0.3;
    float brightness=0.8+0.2*pattern;
    col*=brightness;
    float fade=1.0-smoothstep(0.3,0.7,r);
    col=mix(float3(0.02),col,fade*0.8+0.2);
    return float4(col,1.0);
}
