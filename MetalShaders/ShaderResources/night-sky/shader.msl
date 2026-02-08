#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float nsHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float nsNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(nsHash(i),nsHash(i+float2(1,0)),f.x),mix(nsHash(i+float2(0,1)),nsHash(i+float2(1,1)),f.x),f.y);
}

fragment float4 nightSkyFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.02;
    float3 col=mix(float3(0.0,0.0,0.02),float3(0.02,0.02,0.08),uv.y);
    float milky=0.0;
    float2 muv=uv-float2(0.5,0.5);
    muv=float2x2(0.95,-0.3,0.3,0.95)*muv;
    float band=exp(-muv.y*muv.y*50.0);
    milky=nsNoise((muv+float2(t,0))*float2(3.0,8.0))*band;
    milky+=nsNoise((muv+float2(t*0.5,0))*float2(6.0,15.0))*band*0.5;
    col+=float3(0.15,0.12,0.2)*milky*0.4;
    col+=float3(0.1,0.08,0.15)*band*0.15;
    for(float layer=0.0;layer<3.0;layer++){
        float scale=200.0+layer*150.0;
        float2 starUV=floor(uv*scale);
        float h=nsHash(starUV+layer*100.0);
        if(h>0.97){
            float2 starPos=(starUV+0.5)/scale;
            float d=length(in.position.xy/iResolution-starPos)*scale;
            float brightness=(h-0.97)/0.03;
            float twinkle=0.7+0.3*sin(t*50.0+h*100.0);
            float star=brightness*twinkle*smoothstep(1.5,0.0,d);
            float3 starCol=mix(float3(0.8,0.85,1.0),float3(1.0,0.9,0.7),nsHash(starUV*3.0));
            col+=starCol*star*0.8;
        }
    }
    float shootStar=fract(t*2.0);
    if(shootStar<0.1){
        float2 ssStart=float2(0.3+nsHash(float2(floor(t*2.0)))*0.5,0.7+nsHash(float2(floor(t*2.0)+1.0))*0.2);
        float2 ssEnd=ssStart+float2(0.15,-0.08);
        float2 ssPos=mix(ssStart,ssEnd,shootStar*10.0);
        float ssd=length(uv-ssPos);
        col+=float3(1.0)*exp(-ssd*500.0)*0.5;
    }
    return float4(col,1.0);
}
