#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float freqSpecHash(float n){return fract(sin(n)*43758.5453);}
float freqSpecBin(float bin, float t){
    float bass=sin(t*2.0+bin*0.5)*0.5+0.5;float mid=sin(t*4.0+bin*2.0)*0.3+0.4;float treble=sin(t*8.0+bin*5.0)*0.2+0.3;
    float noise=freqSpecHash(bin+floor(t*4.0))*0.2;
    float w=bin<5.0?bass:bin<15.0?mid:treble;return w+noise*(1.0-w*0.5);
}

fragment float4 frequencySpectrumFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float3 col = float3(0.02,0.02,0.04);
    float numBars=32.0;float bi=floor(uv.x*numBars);float bl=fract(uv.x*numBars);
    float bg=smoothstep(0.0,0.1,bl)*smoothstep(1.0,0.9,bl);
    float bh=pow(freqSpecBin(bi,iTime),1.5);
    float bm=step(uv.y,bh)*bg;
    float t=bi/numBars;
    float3 bc;
    if(t<0.33)bc=mix(float3(0.8,0.1,0.2),float3(0.9,0.5,0.1),t*3.0);
    else if(t<0.66)bc=mix(float3(0.9,0.5,0.1),float3(0.2,0.8,0.3),(t-0.33)*3.0);
    else bc=mix(float3(0.2,0.8,0.3),float3(0.2,0.4,0.9),(t-0.66)*3.0);
    col+=bc*bm*0.8+bc*smoothstep(bh-0.02,bh,uv.y)*step(uv.y,bh+0.01)*1.5;
    col+=bc*exp(-abs(uv.y-bh)*20.0)*bg*0.3;
    return float4(col, 1.0);
}
