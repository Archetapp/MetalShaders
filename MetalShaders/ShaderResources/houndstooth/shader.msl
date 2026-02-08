#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 houndstoothFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.3;
    float scale=8.0;
    float2 p=uv*scale;
    float2 cell=floor(p);
    float2 f=fract(p);
    float checker=fmod(cell.x+cell.y,2.0);
    float hound=0.0;
    if(checker<0.5){
        hound=(f.x<0.5&&f.y<0.5)?1.0:0.0;
        if(f.x>=0.5&&f.y<0.5&&f.x-0.5<f.y) hound=1.0;
        if(f.x<0.5&&f.y>=0.5&&f.y-0.5<f.x) hound=1.0;
    } else {
        hound=(f.x>=0.5&&f.y>=0.5)?1.0:0.0;
        if(f.x<0.5&&f.y>=0.5&&(1.0-f.x-0.5)<(1.0-f.y)) hound=1.0;
        if(f.x>=0.5&&f.y<0.5&&(1.0-f.y-0.5)<(1.0-f.x)) hound=1.0;
    }
    float3 c1=0.5+0.3*cos(t+float3(0,2,4));
    float3 c2=float3(0.95,0.92,0.88);
    float3 col=mix(c2,c1,hound);
    float vignette=1.0-0.3*length(uv-0.5);
    col*=vignette;
    return float4(col,1.0);
}
