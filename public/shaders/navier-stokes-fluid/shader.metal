#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float navierStokesHash(float2 p) { return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453); }
float navierStokesNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(navierStokesHash(i), navierStokesHash(i+float2(1,0)), f.x), mix(navierStokesHash(i+float2(0,1)), navierStokesHash(i+float2(1,1)), f.x), f.y);
}

float2 navierStokesVelField(float2 p, float t) {
    float2 curl = float2(navierStokesNoise(p*3.0+float2(0,0.01)+t*0.2) - navierStokesNoise(p*3.0-float2(0,0.01)+t*0.2),
                         -(navierStokesNoise(p*3.0+float2(0.01,0)+t*0.2) - navierStokesNoise(p*3.0-float2(0.01,0)+t*0.2)));
    return curl*2.0 + float2(sin(t*0.5+p.y*3.0), cos(t*0.4+p.x*2.5))*0.3;
}

fragment float4 navierStokesFluidFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float2 advUv = uv;
    for (int i = 0; i < 5; i++) { advUv -= navierStokesVelField(advUv, iTime - float(i)*0.05) * 0.02; }
    float3 dye = float3(0.0);
    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float2 ip = float2(sin(iTime*0.3+fi*1.57)*0.25, cos(iTime*0.4+fi*1.57)*0.2);
        dye += (0.5+0.5*cos(6.28*(fi*0.25+iTime*0.1+float3(0,0.33,0.67)))) * exp(-dot(advUv-ip,advUv-ip)*50.0);
    }
    float2 vel = navierStokesVelField(uv, iTime);
    float vorticity = length(vel) * 2.0;
    float turbulence = navierStokesNoise(advUv * 8.0 + iTime * 0.5) * 0.3;
    float3 col = dye;
    col += turbulence * float3(0.05, 0.05, 0.08);
    float wisps = navierStokesNoise(advUv*15.0+iTime*0.3);
    wisps = pow(wisps, 3.0)*0.2;
    col += wisps*float3(0.3,0.4,0.5);
    col *= 0.8 + 0.2 * vorticity;
    col = pow(max(col, 0.0), float3(0.85));
    return float4(col, 1.0);
}
