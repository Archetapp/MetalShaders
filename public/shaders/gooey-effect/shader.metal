#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 gooeyEffectFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float sep=sin(t*0.8)*0.25;
    float2 blob1=float2(-sep,0.05*sin(t*1.5)),blob2=float2(sep,0.05*cos(t*1.3)),blob3=float2(0.05*sin(t*2.0),sep*0.5);
    float d1=length(uv-blob1),d2=length(uv-blob2),d3=length(uv-blob3);
    float field=0.0144/(d1*d1+0.001)+0.01/(d2*d2+0.001)+0.0064/(d3*d3+0.001);
    float blob=smoothstep(0.9,1.1,field);
    float3 blobCol=mix(float3(0.9,0.2,0.4),float3(0.3,0.2,0.8),sin(t*0.5)*0.5+0.5);
    float3 col=mix(float3(0.95,0.95,0.97),blobCol,blob);
    col+=float3(0.3)*(smoothstep(0.8,1.0,field)-smoothstep(1.0,1.2,field));
    col+=float3(1.0)*(pow(max(0.0,1.0-d1*5.0),8.0)+pow(max(0.0,1.0-d2*5.0),8.0))*blob*0.3;
    return float4(col,1.0);}
