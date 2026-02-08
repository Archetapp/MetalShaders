#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float bhHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453123);
}

float bhStars(float2 uv, float iTime) {
    float2 id = floor(uv);
    float2 f = fract(uv);
    float star = 0.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            float2 neighbor = float2(float(x), float(y));
            float2 p = float2(bhHash(id + neighbor), bhHash(id + neighbor + 99.0));
            float2 diff = neighbor + p - f;
            float d = length(diff);
            float brightness = bhHash(id + neighbor + 50.0);
            float flicker = 0.8 + 0.2 * sin(iTime * 2.0 + brightness * 30.0);
            star += smoothstep(0.05, 0.0, d) * brightness * flicker;
        }
    }
    return star;
}

float3 bhAccretionDisk(float3 ro, float3 rd, float t, float3 bhPos, float iTime) {
    float3 col = float3(0.0);
    float diskInner = 1.5;
    float diskOuter = 4.0;

    for (int i = 0; i < 40; i++) {
        float3 p = ro + rd * t;
        float3 rel = p - bhPos;
        float distXZ = length(rel.xz);
        float distY = abs(rel.y);

        if (distXZ > diskInner && distXZ < diskOuter && distY < 0.15) {
            float diskFactor = smoothstep(diskInner, diskInner + 0.5, distXZ) *
                               smoothstep(diskOuter, diskOuter - 1.0, distXZ);
            float angle = atan2(rel.z, rel.x) + iTime * 0.5;
            float spiral = sin(angle * 3.0 + distXZ * 2.0 - iTime * 2.0) * 0.5 + 0.5;
            float temp = diskFactor * (0.5 + 0.5 * spiral);

            float doppler = 1.0 + 0.3 * sin(angle);

            float3 hotColor = mix(
                float3(1.0, 0.3, 0.05),
                float3(1.0, 0.9, 0.7),
                temp * doppler
            );
            hotColor += float3(0.2, 0.1, 0.4) * (1.0 - temp);

            float density = diskFactor * smoothstep(0.15, 0.0, distY) * 0.08;
            col += hotColor * density;
        }
        t += 0.15;
    }
    return col;
}

fragment float4 blackHoleFragment(VertexOut in [[stage_in]],
                                   constant float &iTime [[buffer(0)]],
                                   constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float camAngle = iTime * 0.15;
    float3 ro = float3(sin(camAngle) * 8.0, 3.0 + sin(iTime * 0.1) * 1.0, cos(camAngle) * 8.0);
    float3 target = float3(0.0);
    float3 fwd = normalize(target - ro);
    float3 right = normalize(cross(fwd, float3(0.0, 1.0, 0.0)));
    float3 up = cross(right, fwd);
    float3 rd = normalize(fwd + uv.x * right + uv.y * up);

    float3 bhPos = float3(0.0);
    float rs = 1.0;

    float3 p = ro;
    float3 vel = rd;
    float dt = 0.1;
    bool hitHorizon = false;

    for (int i = 0; i < 200; i++) {
        float3 diff = bhPos - p;
        float dist = length(diff);

        if (dist < rs * 0.5) {
            hitHorizon = true;
            break;
        }
        if (dist > 50.0) break;

        float force = rs / (dist * dist);
        vel += normalize(diff) * force * dt;
        vel = normalize(vel);
        p += vel * dt;
    }

    float3 col = float3(0.0);

    if (hitHorizon) {
        col = float3(0.0);
    } else {
        float theta = atan2(vel.z, vel.x);
        float phi = asin(vel.y);
        float2 starUV = float2(theta, phi) * 10.0;
        float stars = bhStars(starUV, iTime);
        col = float3(stars) * float3(0.9, 0.95, 1.0);
    }

    col += bhAccretionDisk(ro, rd, 0.0, bhPos, iTime);

    float distToCenter = length(uv);
    float lensGlow = 0.02 / (distToCenter + 0.1);
    col += float3(0.4, 0.2, 0.05) * lensGlow * 0.3;

    col = 1.0 - exp(-col * 1.5);
    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
