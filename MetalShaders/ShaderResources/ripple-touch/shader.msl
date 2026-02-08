#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 rippleTouchFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.15,0.15,0.2);
    float2 bd=abs(uv)-float2(0.3,0.08);float button=smoothstep(0.01,0.0,max(bd.x,bd.y)-0.02);
    col=mix(col,float3(0.2,0.4,0.8),button);
    for(int i=0;i<3;i++){float fi=float(i);float rippleAge=fmod(t-fi*2.0,6.0);
        if(rippleAge<1.5){float2 origin=float2(sin(fi*2.0)*0.1,sin(fi*3.0)*0.03);
            float rippleR=rippleAge*0.4;float d=length(uv-origin);
            col+=float3(0.3,0.5,1.0)*smoothstep(rippleR,rippleR-0.02,d)*(1.0-rippleAge/1.5)*button*0.4;}}
    return float4(col,1.0);}
