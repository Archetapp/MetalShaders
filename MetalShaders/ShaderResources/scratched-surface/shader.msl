#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float scHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
fragment float4 scratchedSurfaceFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float3 metal=float3(0.5,0.5,0.52);
    float2 lightDir=normalize(float2(sin(t*0.5),cos(t*0.3)));
    float scratches=0.0;
    for(int i=0;i<15;i++){float fi=float(i);
        float angle=scHash(float2(fi,0.0))*M_PI_F*0.5-0.785;
        float offset=scHash(float2(fi,1.0));
        float cs=cos(angle),sn=sin(angle);
        float2 ruv=float2(uv.x*cs-uv.y*sn,uv.x*sn+uv.y*cs);
        float line=smoothstep(0.002,0.0,abs(ruv.y-offset));
        float len=smoothstep(0.0,0.1,ruv.x)*smoothstep(1.0,0.9,ruv.x);
        float depth=0.3+scHash(float2(fi,2.0))*0.7;
        scratches+=line*len*depth;}
    scratches=min(scratches,1.0);
    float aniso=dot(lightDir,float2(0.7,0.7));
    float specAniso=pow(max(0.0,aniso),8.0)*scratches;
    float3 col=metal*(1.0-scratches*0.2);
    col+=float3(0.8,0.8,0.85)*specAniso*0.5;
    float mainSpec=pow(max(0.0,1.0-length(uv-float2(0.5+0.2*sin(t*0.4),0.5+0.2*cos(t*0.3)))*2.5),6.0);
    col+=float3(0.4)*mainSpec;
    return float4(col,1.0);}
