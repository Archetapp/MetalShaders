#include <metal_stdlib>
using namespace metal;
struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float gnHash(float2 p){return fract(sin(dot(p,float2(12.9,78.2)))*43758.5);}

fragment float4 gravityNbodyFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
){
    float2 uv = (in.uv * iResolution - 0.5*iResolution) / iResolution.y;
    float t = iTime * 0.5;
    float2 fragCoord = in.uv * iResolution;
    float3 col = float3(0.01, 0.01, 0.03);
    float stars = step(0.998, gnHash(floor(fragCoord*0.3)));
    col += stars * 0.3;
    float3 bodyColors[5] = {float3(1.0,0.4,0.1),float3(0.2,0.5,1.0),float3(0.1,0.9,0.4),float3(0.9,0.2,0.8),float3(1.0,0.9,0.2)};
    float sizes[5] = {0.025,0.018,0.015,0.012,0.02};
    for(int i = 0; i < 5; i++){
        float fi = float(i);
        float orbitR = 0.15 + fi*0.06;
        float speed = 1.0/(0.5+fi*0.3);
        float phase = fi*1.256;
        float ecc = 0.1+fi*0.05;
        float2 pos = float2(cos(t*speed+phase)*(orbitR+ecc*sin(t*speed*2.0)),
                           sin(t*speed+phase)*orbitR*0.8);
        float d = length(uv - pos);
        float body = smoothstep(sizes[i], sizes[i]-0.005, d);
        col += bodyColors[i]*body;
        float glow = sizes[i]*0.02/(d*d+0.001);
        col += bodyColors[i]*glow*0.3;
        for(int j = 0; j < 30; j++){
            float tj = t - float(j)*0.02;
            float2 tp = float2(cos(tj*speed+phase)*(orbitR+ecc*sin(tj*speed*2.0)),
                              sin(tj*speed+phase)*orbitR*0.8);
            float td = length(uv - tp);
            float trail = 0.001/(td+0.003)*(1.0-float(j)/30.0);
            col += bodyColors[i]*trail*0.03;
        }
    }
    return float4(col, 1.0);
}
