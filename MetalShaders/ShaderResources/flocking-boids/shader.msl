#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float fbHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float2 fbBoidPos(float id, float t){
    float a = fbHash(float2(id,0.0))*6.28;
    float r = 0.3+fbHash(float2(id,1.0))*0.2;
    float s = 0.5+fbHash(float2(id,2.0))*0.5;
    float flockX = sin(t*0.3)*0.2;
    float flockY = cos(t*0.2)*0.15;
    return float2(flockX+cos(a+t*s)*r, flockY+sin(a+t*s*1.1)*r*0.6);
}

fragment float4 flockingBoidsFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = (in.uv * iResolution - 0.5*iResolution) / iResolution.y;
    float t = iTime;
    float3 col = float3(0.05, 0.07, 0.15);
    for(int i = 0; i < 50; i++){
        float fi = float(i);
        float2 pos = fbBoidPos(fi, t);
        float2 vel = fbBoidPos(fi, t+0.01) - pos;
        float angle = atan2(vel.y, vel.x);
        float2 dp = uv - pos;
        float cs = cos(-angle), sn = sin(-angle);
        float2 rp = float2(dp.x*cs - dp.y*sn, dp.x*sn + dp.y*cs);
        float body = length(rp*float2(1.0,2.5));
        float wing = length((rp-float2(-0.005,0.0))*float2(2.0,1.0));
        float boid = min(body, wing);
        float g = 0.003/(boid+0.003);
        float hue = fract(fi*0.02+t*0.05);
        float3 c = 0.5+0.5*cos(6.28*(hue+float3(0.0,0.33,0.67)));
        col += c*g*0.08;
        for(int j = 1; j < 5; j++){
            float2 tp = fbBoidPos(fi, t - float(j)*0.05);
            float td = length(uv - tp);
            col += c*0.0005/(td+0.005)*(1.0-float(j)/5.0);
        }
    }
    return float4(col, 1.0);
}
