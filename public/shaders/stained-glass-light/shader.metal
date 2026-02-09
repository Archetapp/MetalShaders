#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float2 stainedGlassHash2(float2 p){p=float2(dot(p,float2(127.1,311.7)),dot(p,float2(269.5,183.3)));return fract(sin(p)*43758.5453);}

fragment float4 stainedGlassLightFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float2 cellUv = uv*5.0; float2 cellId = floor(cellUv);
    float minD=10.0,secD=10.0; float2 nId=float2(0);
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
        float2 nb=float2(float(x),float(y)),id=cellId+nb;
        float2 pt=nb+stainedGlassHash2(id)-fract(cellUv);float d=length(pt);
        if(d<minD){secD=minD;minD=d;nId=id;}else if(d<secD)secD=d;}
    float leadLine = smoothstep(0.08,0.04,secD-minD);
    float2 h = stainedGlassHash2(nId+100.0);
    float3 gc = pow(0.5+0.5*cos(6.28*(h.x+float3(0,0.33,0.67))),float3(0.7))*0.8;
    float2 lightDir = float2(sin(iTime*0.3),cos(iTime*0.4));
    float lightAngle = dot(normalize(uv+0.001),lightDir)*0.5+0.5;
    float li = 0.5+0.5*lightAngle;
    float2 lightOrigin = float2(0.0, 0.5);
    float lightBeam = pow(max(dot(normalize(uv-lightOrigin), float2(0.0,-1.0)), 0.0), 2.0);
    float3 col = gc*li;
    col *= 1.0 + lightBeam * 0.5;
    col = mix(col, float3(0.05,0.04,0.03), leadLine);
    float glow = pow(1.0 - minD * 0.5, 3.0) * li * 0.2;
    col += glow * gc;
    col *= 1.0-0.3*length(uv);
    return float4(col, 1.0);
}
