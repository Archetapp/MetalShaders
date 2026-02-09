#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 shockwaveDistortFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float checker=fmod(floor((uv.x+0.5)*10.0)+floor((uv.y+0.5)*10.0),2.0);
    float3 scene=mix(float3(0.2,0.3,0.6),float3(0.3,0.5,0.8),checker);
    scene+=0.05*sin(uv.x*20.0)*sin(uv.y*20.0);
    float cycle=fmod(t,2.5);float waveR=cycle*0.5;float waveWidth=0.08;float r=length(uv);
    float wave=smoothstep(waveWidth,0.0,abs(r-waveR))*(1.0-cycle/2.5);
    float2 distortedUv=uv+normalize(uv+0.001)*wave*0.05;
    float dChecker=fmod(floor((distortedUv.x+0.5)*10.0)+floor((distortedUv.y+0.5)*10.0),2.0);
    float3 distorted=mix(float3(0.2,0.3,0.6),float3(0.3,0.5,0.8),dChecker);
    distorted+=0.05*sin(distortedUv.x*20.0)*sin(distortedUv.y*20.0);
    float3 col=mix(scene,distorted,min(wave*3.0,1.0));
    float ring=smoothstep(waveWidth,waveWidth*0.5,abs(r-waveR))-smoothstep(waveWidth*0.5,0.0,abs(r-waveR));
    col+=float3(0.5,0.7,1.0)*ring*(1.0-cycle/2.5)*0.5;
    return float4(col,1.0);}
