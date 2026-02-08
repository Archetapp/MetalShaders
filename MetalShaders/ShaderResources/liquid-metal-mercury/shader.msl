#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float liquidMercuryNoise(float2 p) {
    float2 i = floor(p); float2 f = fract(p); f = f*f*(3.0-2.0*f);
    float a = fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);
    float b = fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
    float c = fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);
    float d = fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

fragment float4 liquidMetalMercuryFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y), iResolution.y/min(iResolution.x,iResolution.y));
    float deform = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = atan2(uv.y, uv.x)+fi*1.257;
        deform += sin(angle*(3.0+fi)+iTime*(0.5+fi*0.2))*0.03/(1.0+fi*0.3);
    }
    deform += liquidMercuryNoise(uv*5.0+iTime*0.2)*0.05;
    float surface = length(uv)-0.3-deform;
    float mask = smoothstep(0.01,-0.01, surface);
    float2 eps = float2(0.003,0.0);
    float d1 = length(uv+eps)-0.3-liquidMercuryNoise((uv+eps)*5.0+iTime*0.2)*0.05;
    float d2 = length(uv+eps.yx)-0.3-liquidMercuryNoise((uv+eps.yx)*5.0+iTime*0.2)*0.05;
    float3 normal = normalize(float3(d1-surface, d2-surface, 0.08));
    float3 viewDir = float3(0,0,1);
    float3 reflected = reflect(-viewDir, normal);
    float3 envColor = mix(float3(0.1,0.15,0.2), float3(0.4,0.5,0.6), reflected.y*0.5+0.5);
    float fresnel = pow(1.0-max(dot(normal,viewDir),0.0), 4.0);
    float spec = pow(max(dot(reflected, normalize(float3(0.5,0.8,0.5))), 0.0), 64.0);
    float3 col = float3(0.02);
    float3 metalColor = envColor*0.8 + spec*float3(1.0)*0.8 + fresnel*float3(0.5,0.55,0.6)*0.3;
    col = mix(col, metalColor, mask);
    return float4(col, 1.0);
}
