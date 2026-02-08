#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 loadingSpinnerFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.95,0.95,0.97);float r=length(uv);float angle=atan2(uv.y,uv.x);
    float spinAngle=t*3.0;float arcLength=M_PI_F+sin(t*2.0)*1.0;
    float relAngle=fmod(angle-spinAngle+M_PI_F+6.28,6.28)-M_PI_F;
    float arc=smoothstep(0.0,0.3,relAngle+arcLength)*smoothstep(arcLength+0.3,arcLength,relAngle+arcLength);
    float ring=smoothstep(0.15,0.14,abs(r-0.2));
    float gradient=smoothstep(0.0,arcLength,relAngle+arcLength);
    float3 spinnerCol=mix(float3(0.2,0.4,0.9),float3(0.4,0.7,1.0),gradient);
    col=mix(col,spinnerCol,arc*ring);col-=smoothstep(0.005,0.0,abs(r-0.2))*0.1;
    return float4(col,1.0);}
