#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float sfNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}

fragment float4 soapFilmFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = (in.uv - 0.5) * float2(iResolution.x/iResolution.y, 1.0);
    float t = iTime;
    float r = length(uv);
    float membrane = smoothstep(0.45, 0.44, r);
    float thickness = 0.5 + 0.3*sfNoise(uv*3.0 + t*0.3);
    thickness += 0.2*sfNoise(uv*7.0 - t*0.5);
    thickness += r*0.5;
    thickness += uv.y*0.3 + sin(t*0.2)*0.1;
    thickness += sin(atan2(uv.y, uv.x) + t*0.2)*3.0*0.1;
    float phase = thickness * 12.0;
    float3 thinFilm;
    thinFilm.r = sin(phase)*0.5+0.5;
    thinFilm.g = sin(phase + 2.094)*0.5+0.5;
    thinFilm.b = sin(phase + 4.189)*0.5+0.5;
    thinFilm = pow(thinFilm, float3(0.8));
    float fresnel = pow(1.0 - abs(dot(normalize(float3(uv, 0.3)), float3(0,0,1))), 2.0);
    float3 col = thinFilm * (0.6 + fresnel*0.4);
    col *= membrane;
    float rim = smoothstep(0.44, 0.42, r) - smoothstep(0.42, 0.38, r);
    col += float3(0.8)*rim*0.3;
    float spec = pow(max(0.0, 1.0-length(uv-float2(-0.1, 0.15))*3.0), 5.0);
    col += float3(1.0)*spec*0.3*membrane;
    col += float3(0.02, 0.02, 0.05)*(1.0-membrane);
    return float4(col, 1.0);
}
