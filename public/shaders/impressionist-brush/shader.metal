#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float ibHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 impressionistBrushFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float3 scene;
    scene.r=0.5+0.3*sin(uv.x*3.0+t*0.3);scene.g=0.5+0.3*sin(uv.y*4.0-t*0.2+1.0);
    scene.b=0.4+0.3*cos(length(uv-0.5)*5.0+t*0.4);
    float brushScale=30.0;float2 cell=floor(uv*brushScale);
    float angle=ibHash(cell)*M_PI_F-M_PI_F*0.5+0.3*sin(t*0.2+ibHash(cell+float2(1,0))*6.0);
    float cs=cos(angle),sn=sin(angle);float2 f=fract(uv*brushScale)-0.5;
    float2 rf=float2(f.x*cs-f.y*sn,f.x*sn+f.y*cs);
    float brushStroke=smoothstep(0.4,0.0,abs(rf.y)*3.0)*smoothstep(0.5,0.3,abs(rf.x))*(0.7+ibHash(cell+float2(2,0))*0.6);
    float3 brushCol=clamp(scene+float3(ibHash(cell+float2(3,0))-0.5,ibHash(cell+float2(4,0))-0.5,ibHash(cell+float2(5,0))-0.5)*0.2,0.0,1.0);
    float3 col=mix(float3(0.9,0.87,0.8),brushCol,brushStroke);
    col+=float3(ibHash(cell*17.0)-0.5)*0.04;
    return float4(col,1.0);}
