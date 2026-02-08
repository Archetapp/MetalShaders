#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float pixelDisintHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}

fragment float4 pixelDisintegrationFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float progress = smoothstep(0.0,1.5,fmod(iTime*0.25,2.0));
    float ps = 0.015;
    float2 pid = floor(uv/ps); float2 pc = (pid+0.5)*ps;
    float threshold = pixelDisintHash(pid)*0.5;
    float dt = smoothstep(threshold,threshold+0.3,progress+(pc.x+pc.y*0.3)*0.3);
    float checker = fmod(pid.x+pid.y,2.0);
    float3 cc = mix(float3(0.2,0.4,0.7),float3(0.7,0.5,0.3),checker);
    cc = mix(cc,float3(0.8,0.3,0.2),smoothstep(0.25,0.23,length(pc)));
    float3 col = float3(0.02);
    if(dt < 0.01){col = cc*step(abs(fract(uv.x/ps)-0.5),0.45)*step(abs(fract(uv.y/ps)-0.5),0.45);}
    else if(dt<1.0){float2 fo=float2(1,-0.5)*dt*0.3*(1.0+pixelDisintHash(pid+100.0));fo.y+=dt*dt*0.1;
    float fp=smoothstep(ps*0.5,ps*0.3,length(uv-pc-fo));col=cc*fp*smoothstep(1.0,0.5,dt);}
    return float4(col, 1.0);
}
