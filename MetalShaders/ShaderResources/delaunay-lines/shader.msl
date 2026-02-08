#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float2 dlnRandPt(float i,float t){
    float a=i*2.399+t*0.3;
    float r=0.3+0.15*sin(i*1.7+t*0.5);
    return float2(0.5+r*cos(a),0.5+r*sin(a));
}

float dlnSegDist(float2 p,float2 a,float2 b){
    float2 pa=p-a,ba=b-a;
    float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return length(pa-ba*h);
}

fragment float4 delaunayLinesFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float aspect=iResolution.x/iResolution.y;
    uv.x*=aspect;
    float t=iTime;
    const int N=12;
    float2 pts[12];
    for(int i=0;i<N;i++){
        pts[i]=dlnRandPt(float(i),t);
        pts[i].x*=aspect;
    }
    float3 col=float3(0.03,0.03,0.08);
    for(int i=0;i<N;i++){
        for(int j=i+1;j<N;j++){
            float d=length(pts[i]-pts[j]);
            if(d<0.6*aspect){
                float sd=dlnSegDist(uv,pts[i],pts[j]);
                float glow=0.002/max(sd,0.001);
                float hue=float(i+j)*0.3+t*0.2;
                float3 lc=0.5+0.5*cos(hue+float3(0,2,4));
                col+=lc*glow*0.3;
            }
        }
    }
    for(int i=0;i<N;i++){
        float d=length(uv-pts[i]);
        float dot_g=0.004/(d*d+0.0001);
        col+=float3(0.8,0.9,1.0)*dot_g*0.05;
    }
    col=pow(col,float3(0.9));
    return float4(col,1.0);
}
