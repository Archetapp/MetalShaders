#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float3 saLorenz(float3 p) {
    float sigma = 10.0;
    float rho = 28.0;
    float beta = 8.0 / 3.0;
    return float3(
        sigma * (p.y - p.x),
        p.x * (rho - p.z) - p.y,
        p.x * p.y - beta * p.z
    );
}

float saDensity(float3 ro, float3 rd, float iTime) {
    float density = 0.0;
    float dt = 0.01;
    float scale = 0.04;

    float3 state = float3(1.0, 1.0, 1.0);
    float phaseShift = iTime * 0.5;

    for (int i = 0; i < 300; i++) {
        float3 deriv = saLorenz(state);
        state += deriv * dt;

        float3 worldPos = (state - float3(0.0, 0.0, 25.0)) * scale;

        float3 toPoint = worldPos - ro;
        float proj = dot(toPoint, rd);
        if (proj < 0.0) continue;

        float3 closest = ro + rd * proj;
        float dist = length(closest - worldPos);

        float radius = 0.03 + 0.01 * sin(float(i) * 0.05 + phaseShift);
        float contrib = exp(-dist * dist / (radius * radius * 2.0));

        float heat = length(deriv) * 0.01;
        density += contrib * (0.5 + heat);
    }

    return density;
}

fragment float4 strangeAttractorFragment(VertexOut in [[stage_in]],
                                          constant float &iTime [[buffer(0)]],
                                          constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float camAngle = iTime * 0.2;
    float camHeight = sin(iTime * 0.15) * 0.5;
    float3 ro = float3(sin(camAngle) * 3.0, camHeight + 0.5, cos(camAngle) * 3.0);
    float3 target = float3(0.0, 0.0, 0.0);
    float3 fwd = normalize(target - ro);
    float3 right = normalize(cross(fwd, float3(0.0, 1.0, 0.0)));
    float3 up = cross(right, fwd);
    float3 rd = normalize(fwd + uv.x * right + uv.y * up);

    float d = saDensity(ro, rd, iTime);

    float3 coldColor = float3(0.1, 0.2, 0.8);
    float3 warmColor = float3(1.0, 0.5, 0.1);
    float3 hotColor = float3(1.0, 1.0, 0.9);

    float t = clamp(d * 0.02, 0.0, 1.0);
    float3 col = float3(0.0);
    if (t < 0.5) {
        col = mix(coldColor, warmColor, t * 2.0);
    } else {
        col = mix(warmColor, hotColor, (t - 0.5) * 2.0);
    }

    col *= d * 0.015;

    float bloom = d * 0.005;
    col += float3(0.05, 0.1, 0.3) * bloom;

    float3 bgColor = float3(0.01, 0.01, 0.03);
    float bgGrad = 1.0 - length(uv) * 0.5;
    col += bgColor * bgGrad;

    col = 1.0 - exp(-col * 2.0);
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
