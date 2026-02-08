#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 soundRingsFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float dist=length(uv); float angle=atan2(uv.y,uv.x);
    float bass=sin(iTime*2.5)*0.5+0.5, mid=sin(iTime*5.0+1.5)*0.3+0.5, treble=sin(iTime*10.0+3.0)*0.2+0.5;
    float3 col = float3(0.02,0.01,0.04);
    for(int i=0;i<8;i++){float fi=float(i);
    float rr=0.05+fi*0.06; float rw=0.008+fi*0.002;
    float freq=fi<3.0?bass:fi<6.0?mid:treble;
    float ar=rr+freq*(0.02+fi*0.005)+sin(angle*(3.0+fi)+iTime*(2.0-fi*0.2))*freq*0.01;
    float ring=exp(-pow(dist-ar,2.0)/(rw*rw));
    float3 rc=0.5+0.5*cos(6.28*(fi/8.0+iTime*0.1+float3(0,0.33,0.67)));
    col+=ring*rc*(0.5+freq*0.5)*(0.4+freq*0.6);}
    col+=exp(-dist*15.0)*(bass*0.5+0.2)*float3(0.5,0.3,0.8);
    col+=max(sin(dist*30.0-iTime*5.0)*exp(-dist*3.0)*bass*0.1,0.0)*float3(0.3,0.4,0.6);
    col = pow(col, float3(0.9));
    return float4(col, 1.0);
}
