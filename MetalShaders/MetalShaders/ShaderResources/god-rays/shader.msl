#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float grNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float grFbm(float2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*grNoise(p);p*=2.0;a*=0.5;}return v;}

fragment float4 godRaysFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.05;
    float3 sky=mix(float3(0.5,0.55,0.7),float3(0.25,0.3,0.45),uv.y);
    float3 col=sky;
    float2 sunPos=float2(0.5,0.85);
    float clouds=grFbm(float2(uv.x*3.0+t,uv.y*2.0+t*0.5));
    float cloudMask=smoothstep(0.35,0.65,clouds)*smoothstep(0.4,0.7,uv.y);
    float3 cloudCol=mix(float3(0.8,0.8,0.85),float3(0.5,0.5,0.55),clouds);
    col=mix(col,cloudCol,cloudMask*0.7);
    float sunDist=length(uv-sunPos);
    float sunGlow=exp(-sunDist*4.0)*0.3;
    col+=float3(1.0,0.9,0.7)*sunGlow;
    for(int i=0;i<12;i++){
        float fi=float(i);
        float angle=(fi/12.0)*M_PI_F-1.57+sin(t+fi)*0.05;
        float2 rayDir=float2(cos(angle),sin(angle));
        float rayWidth=0.04+0.02*sin(fi*2.3+t);
        float along=dot(uv-sunPos,rayDir);
        if(along>0.0){
            float2 perp=uv-sunPos-rayDir*along;
            float perpDist=length(perp);
            float ray=exp(-perpDist*perpDist/(rayWidth*rayWidth*2.0));
            ray*=smoothstep(0.0,0.1,along)*exp(-along*1.5);
            float cloudBlock=grFbm(float2((sunPos+rayDir*along*0.5).x*3.0+t,(sunPos+rayDir*along*0.5).y*2.0+t*0.5));
            float gap=smoothstep(0.5,0.3,cloudBlock);
            ray*=gap;
            col+=float3(1.0,0.9,0.6)*ray*0.15;
        }
    }
    float ground=smoothstep(0.1,0.0,uv.y);
    col=mix(col,float3(0.15,0.2,0.1),ground);
    return float4(col,1.0);
}
