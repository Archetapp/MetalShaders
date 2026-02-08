#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float dmPattern(float2 p,float t){
    float wave=sin(p.x*0.3-t*2.0)*0.5+0.5;
    float wave2=sin(p.y*0.5+t*1.5)*0.5+0.5;
    float circle=sin(length(p-float2(16.0,8.0))*0.5-t*3.0)*0.5+0.5;
    return max(wave*wave2,circle);
}

fragment float4 dotMatrixFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime;
    float gridW=64.0;
    float gridH=32.0;
    float2 grid=float2(gridW,gridH);
    float2 cellUV=uv*grid;
    float2 cell=floor(cellUV);
    float2 f=fract(cellUV)-0.5;
    float dotR=0.35;
    float d=length(f);
    float brightness=dmPattern(cell,t);
    float scanline=0.95+0.05*sin(cell.y*M_PI_F);
    brightness*=scanline;
    float3 onColor=mix(float3(0.0,0.8,0.0),float3(0.0,1.0,0.3),brightness);
    float3 offColor=float3(0.02,0.05,0.02);
    float dot_mask=smoothstep(dotR+0.05,dotR-0.05,d);
    float3 col=mix(offColor,onColor*brightness,dot_mask);
    float glow=exp(-d*d*8.0)*brightness*0.2;
    col+=float3(0.0,0.3,0.0)*glow;
    col*=0.9+0.1*sin(uv.y*iResolution.y*0.5);
    return float4(col,1.0);
}
