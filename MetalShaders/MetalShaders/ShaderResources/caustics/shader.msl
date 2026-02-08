#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float csNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);
    f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

float csCaustic(float2 p,float t){
    float v=0.0;
    float a=0.5;
    for(int i=0;i<5;i++){
        float n=csNoise(p);
        v+=abs(sin(n*6.2832+t))*a;
        p=p*2.0+float2(t*0.1);
        a*=0.5;
    }
    return v;
}

fragment float4 causticsFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.8;
    float c1=csCaustic(uv*3.0,t);
    float c2=csCaustic(uv*3.0+5.0,t*1.3);
    float c=c1*c2;
    c=pow(c,1.5)*3.0;
    float3 deep=float3(0.0,0.05,0.15);
    float3 light=float3(0.1,0.5,0.7);
    float3 bright=float3(0.3,0.8,0.9);
    float3 col=deep+light*c+bright*c*c*0.5;
    col+=float3(0.05,0.1,0.15)*sin(uv.y*10.0+t)*0.3;
    return float4(col,1.0);
}
