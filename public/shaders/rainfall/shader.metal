#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float rfHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 rainfallFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime;
    float3 sky=mix(float3(0.2,0.22,0.25),float3(0.35,0.38,0.42),uv.y);
    float3 col=sky;
    float groundY=0.15;
    float ground=smoothstep(groundY+0.02,groundY,uv.y);
    col=mix(col,float3(0.12,0.13,0.11),ground);
    float rain=0.0;
    for(int layer=0;layer<3;layer++){
        float fl=float(layer);
        float speed=1.5+fl*0.5;
        float thickness=0.01-fl*0.002;
        for(int i=0;i<20;i++){
            float fi=float(i);
            float x=rfHash(float2(fi+fl*100.0,0.0));
            float phase=fract(t*speed*0.3+rfHash(float2(fi,fl)));
            float y=1.0-phase;
            float streakLen=0.04+fl*0.01;
            float dx=abs(uv.x-x);
            if(dx<thickness){
                float inStreak=step(y-streakLen,uv.y)*step(uv.y,y);
                float fade=smoothstep(0.0,streakLen,(uv.y-(y-streakLen)));
                rain+=inStreak*fade*(1.0-fl*0.25);
            }
            if(y<groundY+0.03){
                float splashPhase=1.0-phase;
                if(splashPhase<0.1){
                    float splashR=splashPhase*0.3;
                    float splashD=length(float2(uv.x-x,(uv.y-groundY)*3.0));
                    float splash=smoothstep(splashR+0.005,splashR,splashD)*(1.0-splashPhase*10.0);
                    rain+=splash*0.5;
                }
            }
        }
    }
    col+=float3(0.5,0.55,0.6)*rain*0.4;
    col*=0.9+0.1*sin(uv.y*200.0+t*20.0)*0.05;
    return float4(col,1.0);
}
