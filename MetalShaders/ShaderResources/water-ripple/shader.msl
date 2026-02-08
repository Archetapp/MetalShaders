#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 waterRippleFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float period=4.0;
    float phase=fmod(t,period);
    float r=length(uv);
    float speed=0.4;
    float waveR=phase*speed;
    float waveWidth=0.15;
    float wave=exp(-pow((r-waveR)/waveWidth,2.0));
    wave*=exp(-phase*0.5);
    float ripple=sin(r*40.0-phase*12.0)*wave;
    float h=ripple;
    for(int i=1;i<4;i++){
        float fi=float(i);
        float prevPhase=phase+period*fi;
        float pw=prevPhase*speed;
        float w2=exp(-pow((r-pw)/waveWidth,2.0))*exp(-prevPhase*0.5);
        h+=sin(r*40.0-prevPhase*12.0)*w2*0.3;
    }
    float3 waterBase=float3(0.05,0.15,0.3);
    float3 skyRef=float3(0.4,0.6,0.85);
    float fresnel=0.3+0.7*pow(1.0-abs(h),5.0);
    float3 col=mix(waterBase,skyRef,fresnel*0.5);
    col+=float3(1.0,0.95,0.9)*pow(max(h,0.0),3.0)*2.0;
    col+=float3(0.1,0.2,0.3)*h;
    float center=smoothstep(0.02,0.0,r)*wave*0.5;
    col+=float3(0.5,0.7,1.0)*center;
    return float4(col,1.0);
}
