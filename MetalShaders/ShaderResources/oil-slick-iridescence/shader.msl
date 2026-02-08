#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float oilSlickIridNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

fragment float4 oilSlickIridescenceFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float tiltX=sin(iTime*0.4)*0.5, tiltY=cos(iTime*0.6)*0.3;
    float thickness = oilSlickIridNoise(uv*3.0+iTime*0.05)*0.5+oilSlickIridNoise(uv*7.0-iTime*0.03)*0.3+0.3;
    float viewAngle = 1.0-length(uv)*0.5+tiltX*uv.x+tiltY*uv.y;
    float phase = thickness*viewAngle*15.0;
    float3 thinFilm = float3(pow(sin(phase)*0.5+0.5,2.0),pow(sin(phase*1.2+2.094)*0.5+0.5,2.0),pow(sin(phase*1.4+4.189)*0.5+0.5,2.0));
    float3 waterBase = float3(0.05,0.08,0.12);
    float oilShape = oilSlickIridNoise(uv*2.0+iTime*0.02)+oilSlickIridNoise(uv*4.0-iTime*0.03)*0.5;
    float oilMask = smoothstep(0.3,0.6,oilShape);
    float3 col = mix(waterBase, thinFilm*0.7+waterBase*0.3, oilMask);
    col += smoothstep(0.05,0.0,abs(oilShape-0.45))*thinFilm*0.3;
    return float4(col, 1.0);
}
