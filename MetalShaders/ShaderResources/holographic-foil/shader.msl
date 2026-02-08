#include <metal_stdlib>
using namespace metal;

struct VertexOut { float4 position [[position]]; float2 uv; };

float3 holoRainbow(float phase) {
    return float3(
        sin(phase) * 0.5 + 0.5,
        sin(phase + 2.094) * 0.5 + 0.5,
        sin(phase + 4.189) * 0.5 + 0.5
    );
}

fragment float4 holographicFoilFragment(VertexOut in [[stage_in]],
                                         constant float &iTime [[buffer(0)]],
                                         constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = in.uv;
    float t = iTime * 0.5;
    
    float2 tilt = float2(sin(t * 0.7), cos(t * 0.5)) * 0.3;
    float viewAngle = dot(uv - 0.5, tilt);
    
    float grating = uv.x * 80.0 + uv.y * 40.0;
    float diffraction = sin(grating) * 0.5 + 0.5;
    
    float phase = viewAngle * 20.0 + diffraction * 6.28318 + grating * 0.1;
    float3 rainbow = holoRainbow(phase);
    
    float microPattern = sin(uv.x * 200.0) * sin(uv.y * 200.0) * 0.1 + 0.9;
    
    float sparkle = pow(abs(sin(grating * 0.5 + t * 3.0)), 20.0) * 0.5;
    
    float3 col = rainbow * 0.8 * microPattern;
    col += sparkle * float3(1.0);
    col *= 0.7 + 0.3 * diffraction;
    
    float fresnel = pow(1.0 - abs(dot(normalize(float3(uv - 0.5, 1.0)), float3(0,0,1))), 2.0);
    col += fresnel * float3(0.5, 0.5, 0.6) * 0.3;
    
    return float4(col, 1.0);
}
