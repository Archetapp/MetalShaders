#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float mpHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float mpNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(mpHash(i),mpHash(i+float2(1,0)),f.x),mix(mpHash(i+float2(0,1)),mpHash(i+float2(1,1)),f.x),f.y);
}

float mpCrater(float2 p,float2 center,float r){
    float d=length(p-center);
    float rim=smoothstep(r,r-r*0.1,d)-smoothstep(r-r*0.1,r-r*0.3,d);
    float bowl=smoothstep(r-r*0.2,0.0,d);
    return rim*0.3-bowl*0.15;
}

fragment float4 moonPhasesFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.1;
    float3 col=float3(0.0,0.0,0.02);
    for(float i=0.0;i<200.0;i++){
        float2 starPos=float2(mpHash(float2(i,0.0))-0.5,mpHash(float2(0.0,i))-0.5)*2.0;
        float brightness=mpHash(float2(i,i))*0.5;
        float twinkle=0.7+0.3*sin(t*5.0+i*3.0);
        float sd=length(uv-starPos);
        col+=float3(brightness*twinkle)*smoothstep(0.003,0.0,sd);
    }
    float moonR=0.25;
    float moonDist=length(uv);
    float moonMask=smoothstep(moonR,moonR-0.003,moonDist);
    if(moonMask>0.01){
        float normDist=moonDist/moonR;
        float3 normal=normalize(float3(uv/moonR,sqrt(max(0.0,1.0-normDist*normDist))));
        float phase=fmod(t*0.5,6.2832);
        float3 sunDir=normalize(float3(cos(phase),0.0,sin(phase)));
        float diff=max(dot(normal,sunDir),0.0);
        float3 moonBase=float3(0.6,0.58,0.55);
        float n=mpNoise(uv*20.0)*0.1+mpNoise(uv*40.0)*0.05;
        moonBase+=n;
        float craters=0.0;
        craters+=mpCrater(uv,float2(0.08,0.05),0.04);
        craters+=mpCrater(uv,float2(-0.1,0.1),0.06);
        craters+=mpCrater(uv,float2(0.05,-0.12),0.035);
        craters+=mpCrater(uv,float2(-0.07,-0.05),0.05);
        craters+=mpCrater(uv,float2(0.15,0.0),0.03);
        craters+=mpCrater(uv,float2(-0.02,0.15),0.025);
        craters+=mpCrater(uv,float2(0.12,-0.08),0.02);
        craters+=mpCrater(uv,float2(-0.15,0.05),0.04);
        moonBase+=craters;
        float maria=smoothstep(0.4,0.6,mpNoise(uv*5.0+3.0));
        moonBase=mix(moonBase,moonBase*0.7,maria*0.3);
        float3 moonCol=moonBase*diff;
        float earthshine=max(0.0,-dot(normal,sunDir))*0.03;
        moonCol+=float3(0.05,0.08,0.12)*earthshine;
        float limb=pow(1.0-normal.z,3.0);
        moonCol*=1.0-limb*0.3;
        col=mix(col,moonCol,moonMask);
    }
    float glowR=moonR*1.3;
    float glow=smoothstep(glowR,moonR,moonDist)*0.05;
    col+=float3(0.3,0.3,0.4)*glow;
    return float4(col,1.0);
}
