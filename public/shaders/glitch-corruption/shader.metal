#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float glitchCorruptHash(float n){return fract(sin(n)*43758.5453);}
float glitchCorruptHash2(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 glitchCorruptionFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float gt = floor(iTime*8.0);
    float gi = pow(sin(iTime*0.5)*0.5+0.5, 2.0);
    float bs = 0.05+glitchCorruptHash(gt)*0.1;
    float2 bid = floor(uv/bs);
    float bg = step(0.7,glitchCorruptHash2(bid+gt))*gi;
    float rs = bg*0.03+gi*0.01;
    float3 col;
    col.r = sin((uv.x+rs)*20.0)*0.25+0.25;
    col.g = sin(uv.y*15.0+1.0)*0.25+0.25;
    col.b = sin((uv.x-rs)*20.0)*0.25+0.25;
    col = mix(col,float3(glitchCorruptHash2(bid+gt+1.0),glitchCorruptHash2(bid+gt+2.0),glitchCorruptHash2(bid+gt+3.0)),bg*0.5);
    col += step(0.95,glitchCorruptHash(floor(uv.y*100.0+iTime*50.0)))*gi;
    col += glitchCorruptHash2(uv*500.0+iTime)*gi*0.15;
    float colorBand=step(0.9,glitchCorruptHash(floor(uv.y*30.0)+gt*0.5));
    col=mix(col,col.gbr,colorBand*gi);
    col -= sin(uv.y*iResolution.y*M_PI_F)*0.03;
    return float4(col, 1.0);
}
