#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float tvNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float tvFbm(float2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*tvNoise(p);p*=2.0;a*=0.5;}return v;}
float tvHash(float n){return fract(sin(n)*43758.5453);}

fragment float4 tornadoVortexFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float3 sky=mix(float3(0.15,0.15,0.12),float3(0.25,0.22,0.2),uv.y+0.5);
    float stormCloud=tvFbm(float2(uv.x*2.0+t*0.1,uv.y*1.5+0.5));
    sky=mix(sky,float3(0.08,0.08,0.06),smoothstep(0.3,0.6,stormCloud)*smoothstep(0.0,0.3,uv.y+0.5));
    float3 col=sky;
    float funnelTop=0.3;
    float funnelBot=-0.45;
    float yNorm=(uv.y-funnelBot)/(funnelTop-funnelBot);
    yNorm=clamp(yNorm,0.0,1.0);
    float funnelW=mix(0.02,0.15,yNorm*yNorm);
    float sway=sin(t*0.5)*0.03+sin(t*0.3+2.0)*0.02;
    float centerX=sway*yNorm;
    float dx=abs(uv.x-centerX);
    float funnelMask=smoothstep(funnelW,funnelW-0.02,dx);
    funnelMask*=step(funnelBot,uv.y)*step(uv.y,funnelTop);
    float a=atan2(uv.y-funnelBot,uv.x-centerX);
    float spin=tvNoise(float2(a*3.0+t*3.0,yNorm*5.0));
    float3 funnelCol=mix(float3(0.2,0.18,0.15),float3(0.35,0.32,0.28),spin);
    funnelCol*=0.7+0.3*yNorm;
    col=mix(col,funnelCol,funnelMask*0.8);
    for(int i=0;i<20;i++){
        float fi=float(i);
        float h=tvHash(fi*7.3);
        float debrisY=funnelBot+fmod(h*2.0+t*0.5,funnelTop-funnelBot);
        float norm=(debrisY-funnelBot)/(funnelTop-funnelBot);
        float radius=mix(0.01,0.12,norm*norm);
        float angle=h*6.28+t*3.0/(0.5+norm);
        float2 dPos=float2(centerX+cos(angle)*radius,debrisY);
        float dd=length(uv-dPos);
        float debris=smoothstep(0.005,0.0,dd);
        col=mix(col,float3(0.15,0.12,0.1),debris*0.7);
    }
    float groundY=-0.45;
    float gnd=smoothstep(groundY+0.03,groundY,uv.y);
    col=mix(col,float3(0.1,0.08,0.05),gnd);
    return float4(col,1.0);
}
