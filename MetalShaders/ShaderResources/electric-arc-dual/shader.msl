#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float eadHash(float n){return fract(sin(n)*43758.5453);}
float eadNoise(float p){float i=floor(p);float f=fract(p);f=f*f*(3.0-2.0*f);return mix(eadHash(i),eadHash(i+1.0),f);}

float eadArc(float2 uv,float2 a,float2 b,float t,float seed){
    float2 ab=b-a;
    float len=length(ab);
    float2 dir=ab/len;
    float2 n=float2(-dir.y,dir.x);
    float2 ap=uv-a;
    float along=dot(ap,dir)/len;
    float perp=dot(ap,n);
    if(along<0.0||along>1.0) return 0.0;
    float displacement=0.0;
    float amp=0.08;
    for(int i=0;i<5;i++){
        float fi=float(i);
        float freq=3.0+fi*4.0;
        displacement+=amp*eadNoise(along*freq+t*15.0+seed+fi*7.3);
        amp*=0.5;
    }
    displacement-=0.08;
    float dist=abs(perp-displacement);
    float taper=smoothstep(0.0,0.1,along)*smoothstep(1.0,0.9,along);
    float glow=0.003/(dist+0.001)*taper;
    return glow;
}

fragment float4 electricArcDualFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float3 col=float3(0.02,0.02,0.05);
    float2 p1=float2(-0.35,0.0);
    float2 p2=float2(0.35,0.0);
    for(int i=0;i<5;i++){
        float fi=float(i);
        float arc=eadArc(uv,p1,p2,t+fi*0.1,fi*13.7);
        float flicker=0.5+0.5*eadNoise(t*10.0+fi*5.0);
        float3 arcCol=mix(float3(0.3,0.4,1.0),float3(0.7,0.8,1.0),arc*0.1);
        col+=arcCol*arc*flicker*0.3;
    }
    for(int i=0;i<2;i++){
        float2 pt=i==0?p1:p2;
        float d=length(uv-pt);
        float glow=0.01/(d*d+0.001);
        col+=float3(0.3,0.5,1.0)*glow*0.05;
    }
    col=pow(col,float3(0.85));
    return float4(col,1.0);
}
