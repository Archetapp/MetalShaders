#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 tiledMirrorsFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.3;
    float scale=3.0;
    float2 p=uv*scale;
    float2 cell=floor(p);
    float2 f=fract(p);
    f=abs(f*2.0-1.0);
    float angle=t*0.5+cell.x*0.7+cell.y*1.3;
    float c=cos(angle),s=sin(angle);
    float2 rf=float2x2(c,-s,s,c)*f;
    float3 col=float3(0.0);
    for(int i=0;i<6;i++){
        float fi=float(i);
        float a=fi*1.0472+t*0.2;
        float2 d=float2(cos(a),sin(a));
        float v=sin(dot(rf,d)*8.0+t*2.0+fi);
        float3 hue=0.5+0.5*cos(fi*0.9+t*0.3+float3(0,2,4));
        col+=hue*v*0.2;
    }
    col=abs(col);
    col=pow(col,float3(0.8));
    float edge=min(min(f.x,f.y),min(1.0-f.x,1.0-f.y));
    float border=1.0-smoothstep(0.0,0.05,edge);
    col=mix(col,float3(1),border*0.3);
    return float4(col,1.0);
}
