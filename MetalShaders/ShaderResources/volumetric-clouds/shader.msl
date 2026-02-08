#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float vcHash(float3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vcNoise(float3 x) {
    float3 i = floor(x);
    float3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(vcHash(i + float3(0, 0, 0)), vcHash(i + float3(1, 0, 0)), f.x),
                   mix(vcHash(i + float3(0, 1, 0)), vcHash(i + float3(1, 1, 0)), f.x), f.y),
               mix(mix(vcHash(i + float3(0, 0, 1)), vcHash(i + float3(1, 0, 1)), f.x),
                   mix(vcHash(i + float3(0, 1, 1)), vcHash(i + float3(1, 1, 1)), f.x), f.y), f.z);
}

float vcFbm(float3 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
        f += amp * vcNoise(p);
        p *= 2.01;
        amp *= 0.5;
    }
    return f;
}

float vcCloudDensity(float3 p, float t) {
    float3 wind = float3(t * 0.3, 0.0, t * 0.1);
    float density = vcFbm(p * 0.3 + wind) * 2.0 - 1.0;
    density += vcFbm(p * 0.6 + wind * 1.5) * 0.5;

    float heightFade = 1.0 - smoothstep(0.0, 4.0, abs(p.y - 5.0));
    density *= heightFade;

    return max(0.0, density);
}

fragment float4 volumetricCloudsFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    float3 ro = float3(0.0, 3.0, -5.0);
    float3 rd = normalize(float3(uv.x, uv.y + 0.2, 1.0));

    float3 sunDir = normalize(float3(0.5, 0.3, -0.5));
    float3 sunColor = float3(1.0, 0.9, 0.7) * 2.0;

    float skyT = max(0.0, rd.y);
    float3 skyColor = mix(float3(0.5, 0.6, 0.7), float3(0.2, 0.4, 0.8), skyT);
    float sunDot = max(0.0, dot(rd, sunDir));
    skyColor += float3(1.0, 0.8, 0.5) * pow(sunDot, 32.0);
    skyColor += float3(0.8, 0.6, 0.3) * pow(sunDot, 4.0) * 0.3;

    float3 col = skyColor;
    float transmittance = 1.0;

    float tMax = 30.0;
    float stepSize = 0.5;
    float rayT = 0.0;

    for (int i = 0; i < 60; i++) {
        if (transmittance < 0.01 || rayT > tMax) break;

        float3 pos = ro + rd * rayT;
        float density = vcCloudDensity(pos, t);

        if (density > 0.001) {
            float shadowDensity = 0.0;
            float3 shadowPos = pos;
            for (int s = 0; s < 4; s++) {
                shadowPos += sunDir * 0.8;
                shadowDensity += vcCloudDensity(shadowPos, t) * 0.8;
            }

            float shadow = exp(-shadowDensity * 0.5);

            float3 lightColor = sunColor * shadow;
            lightColor += float3(0.4, 0.5, 0.7) * 0.3;

            float phase = 0.5 + 0.5 * dot(rd, sunDir);
            float silver = pow(max(0.0, dot(rd, sunDir)), 8.0) * 2.0;
            lightColor += float3(1.0, 0.95, 0.8) * silver * shadow;

            float3 cloudCol = lightColor * float3(1.0, 0.98, 0.96);

            float absorption = density * stepSize * 0.4;
            col += cloudCol * absorption * transmittance * phase;
            transmittance *= exp(-absorption);
        }

        rayT += stepSize;
    }

    float3 horizonHaze = float3(0.7, 0.75, 0.8);
    float haze = exp(-max(0.0, rd.y) * 3.0);
    col = mix(col, horizonHaze, haze * 0.5);

    col = 1.0 - exp(-col * 0.8);
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
