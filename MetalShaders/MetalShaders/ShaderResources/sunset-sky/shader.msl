#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float ssNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5);
    float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5);
    float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5);
    float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}
float ssFbm(float2 p){float v=0.0;float a=0.5;for(int i=0;i<5;i++){v+=a*ssNoise(p);p*=2.0;a*=0.5;}return v;}

fragment float4 sunsetSkyFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.05;
    float y=uv.y;
    float3 top=float3(0.1,0.05,0.2);
    float3 mid=float3(0.6,0.15,0.3);
    float3 horizon_col=float3(1.0,0.5,0.1);
    float3 low=float3(1.0,0.7,0.2);
    float3 sky=mix(low,horizon_col,smoothstep(0.0,0.3,y));
    sky=mix(sky,mid,smoothstep(0.3,0.6,y));
    sky=mix(sky,top,smoothstep(0.6,1.0,y));
    float clouds=ssFbm(float2(uv.x*3.0+t,y*2.0+t*0.3));
    float cloudMask=smoothstep(0.4,0.6,clouds)*smoothstep(0.2,0.5,y)*smoothstep(0.9,0.6,y);
    float3 cloudColor=mix(float3(1.0,0.6,0.3),float3(0.8,0.3,0.4),y);
    cloudColor=mix(cloudColor,float3(0.3,0.15,0.2),smoothstep(0.6,0.9,y));
    sky=mix(sky,cloudColor,cloudMask*0.7);
    float sunY=0.15;
    float sunX=0.5+sin(t)*0.1;
    float sunDist=length(float2(uv.x-sunX,(uv.y-sunY)*1.5));
    float sun=smoothstep(0.08,0.05,sunDist);
    float sunGlow=exp(-sunDist*8.0)*0.4;
    sky+=float3(1.0,0.8,0.3)*sun;
    sky+=float3(1.0,0.5,0.15)*sunGlow;
    float stars=step(0.998,fract(sin(dot(floor(uv*500.0),float2(12.9,78.2)))*43758.5));
    sky+=float3(1.0)*stars*smoothstep(0.6,0.9,y)*0.5;
    return float4(sky,1.0);
}
