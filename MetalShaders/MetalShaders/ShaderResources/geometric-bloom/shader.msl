#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float gbPoly(float2 p,int n,float r){
    float a=atan2(p.y,p.x);
    float seg=6.2832/float(n);
    a=abs(fmod(a,seg)-seg*0.5);
    return length(p)-r*cos(seg*0.5)/cos(a);
}

fragment float4 geometricBloomFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.5;
    float3 col=float3(0.02,0.02,0.05);
    for(int i=0;i<12;i++){
        float fi=float(i);
        float phase=fi*0.524+t;
        float expand=fract(phase*0.3)*0.6;
        float alpha=1.0-fract(phase*0.3);
        alpha=alpha*alpha;
        int sides=3+int(fmod(fi,5.0));
        float rot=t*0.3+fi*0.5;
        float c=cos(rot),s=sin(rot);
        float2 ruv=float2x2(c,-s,s,c)*uv;
        float d=gbPoly(ruv,sides,expand);
        float line=smoothstep(0.015,0.0,abs(d));
        float3 hue=0.5+0.5*cos(fi*0.7+t+float3(0,2,4));
        col+=hue*line*alpha*0.8;
        float glow=exp(-abs(d)*40.0)*alpha*0.3;
        col+=hue*glow;
    }
    col=pow(col,float3(0.9));
    return float4(col,1.0);
}
