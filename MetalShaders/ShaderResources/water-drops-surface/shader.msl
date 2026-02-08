#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float waterDropHash(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float2 waterDropHash2(float2 p) {
    return float2(fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453),
                  fract(sin(dot(p, float2(269.5, 183.3))) * 43758.5453));
}

float waterDropNoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = waterDropHash(i);
    float b = waterDropHash(i + float2(1.0, 0.0));
    float c = waterDropHash(i + float2(0.0, 1.0));
    float d = waterDropHash(i + float2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float3 waterDropSurfacePattern(float2 uv) {
    float3 col1 = float3(0.2, 0.22, 0.25);
    float3 col2 = float3(0.18, 0.19, 0.22);
    float n = waterDropNoise(uv * 5.0);
    float3 surface = mix(col1, col2, n);

    float brushX = sin(uv.x * 200.0 + uv.y * 3.0) * 0.01;
    float brushY = sin(uv.y * 150.0 + uv.x * 5.0) * 0.005;
    surface += float3(brushX + brushY);

    return surface;
}

fragment float4 waterDropsSurfaceFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = in.uv;
    float aspect = iResolution.x / iResolution.y;

    float3 surface = waterDropSurfacePattern(uv);

    float gridSize = 6.0;
    float3 totalColor = surface;
    float totalDropMask = 0.0;

    int maxGX = int(gridSize * aspect) + 1;
    int maxGY = int(gridSize) + 1;

    for (int gx = -1; gx <= 12; gx++) {
        if (gx > maxGX) break;
        for (int gy = -1; gy <= 7; gy++) {
            if (gy > maxGY) break;
            float2 cell = float2(float(gx), float(gy));
            float2 cellHash = waterDropHash2(cell + 100.0);

            float growCycle = 8.0 + cellHash.x * 4.0;
            float phase = fract(iTime / growCycle + cellHash.y);

            float maxRadius = 0.03 + cellHash.x * 0.04;
            float radius = maxRadius * smoothstep(0.0, 0.6, phase);

            if (phase > 0.9) {
                radius *= smoothstep(1.0, 0.9, phase);
            }

            float2 dropCenter = (cell + 0.3 + cellHash * 0.4) / gridSize;
            dropCenter.x /= aspect;

            float wobble = sin(iTime * 0.5 + cellHash.x * 6.28) * 0.002;
            dropCenter += float2(wobble, wobble * 0.5);

            float2 diff = uv - dropCenter;
            diff.x *= aspect;
            float dist = length(diff);

            if (dist < radius) {
                float normalizedDist = dist / radius;
                float height = sqrt(max(1.0 - normalizedDist * normalizedDist, 0.0));

                float2 normal = diff / radius;
                float3 normal3d = normalize(float3(normal * 0.8, height));

                float2 refractOffset = normal3d.xy * 0.02 * height;
                float2 refractedUv = uv + refractOffset;
                float3 refractedSurface = waterDropSurfacePattern(refractedUv);
                refractedSurface *= 1.1;

                float3 lightDir = normalize(float3(0.3, 0.5, 1.0));
                float diffuseLight = max(dot(normal3d, lightDir), 0.0);

                float3 viewDir = float3(0.0, 0.0, 1.0);
                float3 halfVec = normalize(lightDir + viewDir);
                float specular = pow(max(dot(normal3d, halfVec), 0.0), 64.0);

                float fresnel = pow(1.0 - max(dot(normal3d, viewDir), 0.0), 3.0);

                float3 dropColor = refractedSurface * (0.7 + diffuseLight * 0.3);
                dropColor += float3(1.0, 1.0, 0.95) * specular * 0.8;
                dropColor += float3(0.6, 0.7, 0.8) * fresnel * 0.3;

                float edgeHighlight = smoothstep(0.8, 1.0, normalizedDist) * 0.2;
                dropColor += float3(0.5, 0.55, 0.6) * edgeHighlight;

                float dropMask = smoothstep(radius, radius - 0.002, dist);
                totalColor = mix(totalColor, dropColor, dropMask);
                totalDropMask = max(totalDropMask, dropMask);
            } else if (dist < radius * 1.3) {
                float shadow = smoothstep(radius * 1.3, radius, dist) * 0.08;
                totalColor -= float3(shadow);
            }
        }
    }

    float ambient = 0.95 + waterDropNoise(uv * 3.0 + iTime * 0.01) * 0.05;
    totalColor *= ambient;

    float vignette = 1.0 - length((uv - 0.5) * 1.1);
    totalColor *= smoothstep(0.0, 0.8, vignette);

    return float4(totalColor, 1.0);
}
