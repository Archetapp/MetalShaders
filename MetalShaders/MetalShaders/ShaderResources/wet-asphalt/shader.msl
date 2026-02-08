#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float waNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}
fragment float4 wetAsphaltFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;
    float grain=waNoise(uv*100.0)*0.1+waNoise(uv*200.0)*0.05;
    float3 asphalt=float3(0.06,0.06,0.07)+grain;
    float puddle=waNoise(uv*3.0)*0.5+waNoise(uv*7.0)*0.3;
    puddle=smoothstep(0.45,0.55,puddle);
    float ripple=0.0;
    for(int i=0;i<8;i++){float fi=float(i);
        float2 drop=float2(waNoise(float2(fi*7.0,floor(t+fi))),waNoise(float2(fi*13.0,floor(t+fi)+0.5)));
        float age=fract(t*0.5+fi*0.125);float r=age*0.15;float ring=abs(length(uv-drop)-r);
        ripple+=smoothstep(0.005,0.0,ring)*(1.0-age)*puddle;}
    float3 col=asphalt;col=mix(col,col*1.3+float3(0.02),puddle);col+=float3(0.2)*ripple;
    float spec=pow(max(0.0,1.0-length(uv-float2(0.5,0.8))*2.0),12.0)*puddle;
    col+=float3(1.0,0.9,0.7)*spec*0.4;
    return float4(col,1.0);}
