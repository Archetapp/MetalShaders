#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float pdLineSeg(float2 p, float2 a, float2 b) {
    float2 pa = p - a;
    float2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

float pdTriangleSDF(float2 p, float2 a, float2 b, float2 c) {
    float2 e0 = b - a, e1 = c - b, e2 = a - c;
    float2 v0 = p - a, v1 = p - b, v2 = p - c;
    float2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
    float2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
    float2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
    float s = sign(e0.x * e2.y - e0.y * e2.x);
    float2 d = min(min(float2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)),
                       float2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))),
                       float2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
    return -sqrt(d.x) * sign(d.y);
}

float3 pdWavelengthToRGB(float wavelength) {
    float3 col = float3(0.0);
    if (wavelength < 440.0) {
        col = float3(-(wavelength - 440.0) / 60.0, 0.0, 1.0);
    } else if (wavelength < 490.0) {
        col = float3(0.0, (wavelength - 440.0) / 50.0, 1.0);
    } else if (wavelength < 510.0) {
        col = float3(0.0, 1.0, -(wavelength - 510.0) / 20.0);
    } else if (wavelength < 580.0) {
        col = float3((wavelength - 510.0) / 70.0, 1.0, 0.0);
    } else if (wavelength < 645.0) {
        col = float3(1.0, -(wavelength - 645.0) / 65.0, 0.0);
    } else {
        col = float3(1.0, 0.0, 0.0);
    }
    float intensity = 1.0;
    if (wavelength < 420.0) intensity = 0.3 + 0.7 * (wavelength - 380.0) / 40.0;
    else if (wavelength > 700.0) intensity = 0.3 + 0.7 * (780.0 - wavelength) / 80.0;
    return col * intensity;
}

fragment float4 prismDispersionFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv - 0.5) * float2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    float t = iTime;

    float bobY = sin(t * 0.5) * 0.02;
    float2 triA = float2(-0.05, 0.25 + bobY);
    float2 triB = float2(-0.05, -0.25 + bobY);
    float2 triC = float2(0.25, 0.0 + bobY);

    float prismDist = pdTriangleSDF(uv, triA, triB, triC);

    float3 col = float3(0.02, 0.02, 0.04);

    float beamY = bobY;
    float beamWidth = 0.015;
    float2 beamStart = float2(-0.8, beamY);
    float2 beamEnd = float2(-0.05, beamY);

    float beamDist = pdLineSeg(uv, beamStart, beamEnd);
    float beam = smoothstep(beamWidth, beamWidth * 0.3, beamDist);

    if (uv.x < beamEnd.x && uv.x > beamStart.x) {
        col += float3(0.9, 0.9, 1.0) * beam * 0.8;
        float halo = exp(-beamDist * beamDist * 800.0) * 0.3;
        col += float3(0.7, 0.8, 1.0) * halo;
    }

    float inPrism = smoothstep(0.005, -0.005, prismDist);
    float3 prismColor = float3(0.08, 0.1, 0.15);
    float prismFresnel = pow(1.0 - smoothstep(-0.1, 0.0, prismDist), 2.0) * 0.3;
    prismColor += prismFresnel;

    float numRays = 32.0;
    float3 spectrumAccum = float3(0.0);

    float2 exitPoint = float2(0.25, bobY);

    for (float i = 0.0; i < 32.0; i++) {
        float wavelength = 380.0 + (i / numRays) * 400.0;

        float angle = (i / numRays - 0.5) * 0.55;

        float2 rayDir = normalize(float2(1.0, angle));
        float2 rayStart = exitPoint;

        float rayDist = abs((uv.y - rayStart.y) * rayDir.x - (uv.x - rayStart.x) * rayDir.y);
        float rayProj = dot(uv - rayStart, rayDir);

        float rayWidth = 0.004 + rayProj * 0.003;
        float rayIntensity = smoothstep(rayWidth, rayWidth * 0.2, rayDist);
        rayIntensity *= smoothstep(0.0, 0.05, rayProj);
        rayIntensity *= smoothstep(1.2, 0.1, rayProj);

        float3 rayColor = pdWavelengthToRGB(wavelength);
        spectrumAccum += rayColor * rayIntensity * 0.12;
    }

    if (uv.x > exitPoint.x - 0.01) {
        col += spectrumAccum;
    }

    col = mix(col, prismColor, inPrism * 0.7);

    float edgeHighlight = smoothstep(0.01, -0.002, prismDist) * smoothstep(-0.015, -0.002, prismDist);
    col += float3(0.3, 0.35, 0.5) * edgeHighlight * 0.5;

    float innerLight = inPrism * 0.15;
    col += float3(0.15, 0.18, 0.25) * innerLight;

    float causticPattern = sin(uv.x * 30.0 + t) * sin(uv.y * 30.0 + t * 0.7);
    col += abs(causticPattern) * 0.01 * inPrism;

    float vignette = 1.0 - length(uv) * 0.5;
    col *= vignette;

    col = pow(col, float3(0.9));

    return float4(col, 1.0);
}
