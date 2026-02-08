#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float2x2 dfRot(float a) {
    float c = cos(a), s = sin(a);
    return float2x2(c, -s, s, c);
}

float dfSdCone(float3 p, float angle, float h) {
    float2 c = float2(sin(angle), cos(angle));
    float2 q = h * float2(c.x / c.y, -1.0);
    float2 w = float2(length(p.xz), p.y);
    float2 a2 = w - q * clamp(dot(w, q) / dot(q, q), 0.0, 1.0);
    float2 b = w - q * float2(clamp(w.x / q.x, 0.0, 1.0), 1.0);
    float k = sign(q.y);
    float d = min(dot(a2, a2), dot(b, b));
    float s2 = max(k * (w.x * q.y - w.y * q.x), k * (w.y - q.y));
    return sqrt(d) * sign(s2);
}

float dfDiamond(float3 p) {
    float crown = dfSdCone(p - float3(0.0, 0.15, 0.0), 0.6, 0.35);
    float pavilion = dfSdCone(float3(p.x, -p.y, p.z) - float3(0.0, -0.15, 0.0), 0.45, 0.65);
    float d = max(crown, pavilion);
    return d;
}

float3 dfNormal(float3 p) {
    float2 e = float2(0.001, 0.0);
    return normalize(float3(
        dfDiamond(p + e.xyy) - dfDiamond(p - e.xyy),
        dfDiamond(p + e.yxy) - dfDiamond(p - e.yxy),
        dfDiamond(p + e.yyx) - dfDiamond(p - e.yyx)
    ));
}

float3 dfSpectralColor(float t) {
    float3 r = float3(0.0);
    if (t < 0.17) r = mix(float3(0.3, 0.0, 0.5), float3(0.0, 0.0, 1.0), t / 0.17);
    else if (t < 0.33) r = mix(float3(0.0, 0.0, 1.0), float3(0.0, 1.0, 1.0), (t - 0.17) / 0.16);
    else if (t < 0.5) r = mix(float3(0.0, 1.0, 1.0), float3(0.0, 1.0, 0.0), (t - 0.33) / 0.17);
    else if (t < 0.67) r = mix(float3(0.0, 1.0, 0.0), float3(1.0, 1.0, 0.0), (t - 0.5) / 0.17);
    else if (t < 0.83) r = mix(float3(1.0, 1.0, 0.0), float3(1.0, 0.5, 0.0), (t - 0.67) / 0.16);
    else r = mix(float3(1.0, 0.5, 0.0), float3(1.0, 0.0, 0.0), (t - 0.83) / 0.17);
    return r;
}

fragment float4 diamondFacetsFragment(VertexOut in [[stage_in]],
                                       constant float &iTime [[buffer(0)]],
                                       constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float rotAngle = iTime * 0.3;
    float3 ro = float3(sin(rotAngle) * 2.0, 1.0, cos(rotAngle) * 2.0);
    float3 target = float3(0.0, 0.0, 0.0);
    float3 fwd = normalize(target - ro);
    float3 right = normalize(cross(fwd, float3(0.0, 1.0, 0.0)));
    float3 up = cross(right, fwd);
    float3 rd = normalize(fwd + uv.x * right + uv.y * up);

    float3 col = float3(0.02, 0.02, 0.06);

    float t = 0.0;
    bool hit = false;
    for (int i = 0; i < 100; i++) {
        float3 p = ro + rd * t;
        float d = dfDiamond(p);
        if (d < 0.001) {
            hit = true;
            break;
        }
        if (t > 10.0) break;
        t += d;
    }

    if (hit) {
        float3 hitPos = ro + rd * t;
        float3 n = dfNormal(hitPos);

        float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
        float3 refl = reflect(rd, n);

        float3 envColor = mix(float3(0.1, 0.1, 0.3), float3(0.6, 0.8, 1.0), refl.y * 0.5 + 0.5);
        envColor += pow(max(dot(refl, normalize(float3(1.0, 1.0, 0.5))), 0.0), 32.0) * float3(1.0, 0.95, 0.8);

        float3 refractCol = float3(0.0);
        int numWavelengths = 7;
        for (int w = 0; w < 7; w++) {
            float wt = float(w) / float(numWavelengths - 1);
            float ior = 2.42 + wt * 0.056 - 0.028;
            float3 refr = refract(rd, n, 1.0 / ior);
            if (length(refr) < 0.01) refr = reflect(rd, n);

            float3 internalPos = hitPos + refr * 0.5;
            float3 internalN = dfNormal(internalPos);
            float3 refr2 = refract(refr, -internalN, ior);
            if (length(refr2) < 0.01) refr2 = reflect(refr, -internalN);

            float3 internalPos2 = internalPos + refr2 * 0.3;
            float3 internalN2 = dfNormal(internalPos2);
            float3 refr3 = refract(refr2, -internalN2, ior);
            if (length(refr3) < 0.01) refr3 = reflect(refr2, -internalN2);

            float3 exitDir = refr3;
            float3 exitEnv = mix(float3(0.15, 0.1, 0.3), float3(0.7, 0.85, 1.0), exitDir.y * 0.5 + 0.5);
            exitEnv += pow(max(dot(exitDir, normalize(float3(1.0, 1.0, 0.5))), 0.0), 16.0) * 1.5;

            refractCol += dfSpectralColor(wt) * exitEnv;
        }
        refractCol /= float(numWavelengths);

        col = mix(refractCol * 1.8, envColor, fresnel);

        float3 lightDir = normalize(float3(1.0, 2.0, 1.0));
        float spec = pow(max(dot(refl, lightDir), 0.0), 128.0);
        col += float3(1.0) * spec * 2.0;

        float3 lightDir2 = normalize(float3(-1.0, 1.0, -0.5));
        float spec2 = pow(max(dot(refl, lightDir2), 0.0), 64.0);
        col += float3(0.8, 0.9, 1.0) * spec2;

        float facetPattern = abs(sin(atan2(n.x, n.z) * 8.0)) * abs(sin(n.y * 6.0));
        col += float3(0.1, 0.15, 0.2) * facetPattern * 0.3;
    }

    col = pow(col, float3(0.85));
    col *= 1.0 - 0.3 * length(uv);

    return float4(col, 1.0);
}
