#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float edScene(float2 uv,float t){float v=0.0;
    for(int i=0;i<4;i++){float fi=float(i);
        float2 p=float2(0.3+fi*0.15,0.5+0.2*sin(t*0.5+fi));
        v+=smoothstep(0.1,0.08,length(uv-p));}
    v+=step(0.5,fmod(floor(uv.x*10.0)+floor(uv.y*10.0),2.0))*0.3;return v;}
fragment float4 edgeDetectionFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float2 px=1.0/iResolution*2.0;
    float tl=edScene(uv+float2(-px.x,px.y),t);float tc=edScene(uv+float2(0,px.y),t);
    float tr=edScene(uv+float2(px.x,px.y),t);float ml=edScene(uv+float2(-px.x,0),t);
    float mr=edScene(uv+float2(px.x,0),t);float bl=edScene(uv+float2(-px.x,-px.y),t);
    float bc=edScene(uv+float2(0,-px.y),t);float br=edScene(uv+float2(px.x,-px.y),t);
    float gx=-tl-2.0*ml-bl+tr+2.0*mr+br;float gy=-tl-2.0*tc-tr+bl+2.0*bc+br;
    float edge=sqrt(gx*gx+gy*gy);float hue=atan2(gy,gx)/6.28+0.5;
    float3 col=(0.5+0.5*cos(6.28*(hue+float3(0,0.33,0.67))))*edge*2.0+float3(0.02,0.02,0.05);
    return float4(col,1.0);}
