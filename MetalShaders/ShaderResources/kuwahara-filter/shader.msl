#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float3 kfScene(float2 uv,float t){float3 c;c.r=sin(uv.x*8.0+t)*0.4+0.5;c.g=sin(uv.y*6.0-t*0.7)*0.4+0.5;
    c.b=cos(length(uv-0.5)*12.0+t)*0.4+0.5;
    c=mix(c,float3(0.9,0.3,0.2),smoothstep(0.2,0.15,length(uv-float2(0.5+0.15*sin(t*0.5),0.5))));return c;}
fragment float4 kuwaharaFilterFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;int radius=3;float px=2.0/iResolution.x;
    float3 bestMean=float3(0.0);float bestVar=1e10;
    for(int q=0;q<4;q++){float3 meanV=float3(0.0);float3 sq=float3(0.0);float count=0.0;
        int ox=q%2==0?-radius:0;int oy=q<2?-radius:0;int ex=q%2==0?0:radius;int ey=q<2?0:radius;
        for(int x=ox;x<=ex;x++)for(int y=oy;y<=ey;y++){
            float3 s=kfScene(uv+float2(float(x),float(y))*px,t);meanV+=s;sq+=s*s;count+=1.0;}
        meanV/=count;sq/=count;float var=dot(sq-meanV*meanV,float3(1.0));
        if(var<bestVar){bestVar=var;bestMean=meanV;}}
    return float4(bestMean,1.0);}
