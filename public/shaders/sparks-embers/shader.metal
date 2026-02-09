#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float seHash(float n){return fract(sin(n)*43758.5453);}

fragment float4 sparksEmbersFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.uv*iResolution-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float3 col=float3(0.02,0.01,0.01);
    float glowBase=exp(-length(uv-float2(0,-0.4))*3.0)*0.15;
    col+=float3(0.3,0.1,0.02)*glowBase;
    for(int i=0;i<50;i++){
        float fi=float(i);
        float h1=seHash(fi*7.3);
        float h2=seHash(fi*13.1);
        float h3=seHash(fi*19.7);
        float life=fmod(t*0.3+h1*3.0,1.5);
        float alive=smoothstep(0.0,0.05,life)*smoothstep(1.5,1.2,life);
        float x=h2*0.6-0.3+sin(life*4.0+h1*6.28)*0.1;
        float y=-0.35+life*0.6;
        float wind=sin(t*0.5+h1*10.0)*0.05*life;
        x+=wind;
        float2 sparkPos=float2(x,y);
        float d=length(uv-sparkPos);
        float size=0.003+h3*0.004;
        float spark=size/(d*d+0.0001)*alive;
        float heat=1.0-life/1.5;
        float3 sparkCol=mix(float3(1.0,0.3,0.0),float3(1.0,0.8,0.2),heat);
        sparkCol=mix(sparkCol,float3(0.5,0.1,0.0),1.0-heat);
        col+=sparkCol*spark*0.015;
    }
    col=pow(col,float3(0.9));
    return float4(col,1.0);
}
