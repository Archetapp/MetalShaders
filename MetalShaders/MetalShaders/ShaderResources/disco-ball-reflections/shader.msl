#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float discoBallHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }

fragment float4 discoBallReflectionsFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float3 col = float3(0.02,0.02,0.05);
    for(int i=0;i<30;i++){
        float fi=float(i); float theta=fi*0.4+iTime*0.8; float phi=fi*0.7+iTime*0.3;
        float2 spotPos = float2(sin(theta)*cos(phi),sin(phi))*0.8+float2(sin(fi*1.3+iTime*0.5),cos(fi*0.9+iTime*0.4))*0.3;
        float spot = exp(-dot(uv-spotPos,uv-spotPos)*30.0);
        float3 sc = 0.5+0.5*cos(6.28*(fi*0.1+float3(0,0.33,0.67)));
        col += sc*spot*max(sin(theta*3.0+iTime*2.0),0.0)*0.3;
    }
    float bd = length(uv); float bm = smoothstep(0.15,0.13,bd);
    float fa = atan2(uv.y,uv.x)+iTime*0.8;
    float fs = pow(discoBallHash(floor(float2(fa*4.0,bd*20.0))),3.0);
    float3 bc = float3(0.5,0.5,0.55)*(0.3+fs*0.7);
    col = mix(col,bc,bm);
    return float4(col, 1.0);
}
