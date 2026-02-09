#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float rmSdSphere(float3 p, float r) {
    return length(p) - r;
}

float rmSdPlane(float3 p) {
    return p.y;
}

float rmSdBox(float3 p, float3 b) {
    float3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float rmSdTorus(float3 p, float2 t) {
    float2 q = float2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float2 rmScene(float3 p, float iTime) {
    float plane = rmSdPlane(p);
    float2 res = float2(plane, 1.0);

    float bounce = abs(sin(iTime * 1.5)) * 0.3;
    float3 spherePos = p - float3(0.0, 1.0 + bounce, 0.0);
    float sphere = rmSdSphere(spherePos, 0.8);
    if (sphere < res.x) res = float2(sphere, 2.0);

    float rot = iTime * 0.5;
    float3 bp = p - float3(2.0, 0.5, 0.0);
    float cs = cos(rot), sn = sin(rot);
    bp.xz = float2(bp.x * cs - bp.z * sn, bp.x * sn + bp.z * cs);
    bp.xy = float2(bp.x * cos(rot * 0.7) - bp.y * sin(rot * 0.7),
                    bp.x * sin(rot * 0.7) + bp.y * cos(rot * 0.7));
    float box = rmSdBox(bp, float3(0.4));
    if (box < res.x) res = float2(box, 3.0);

    float3 tp = p - float3(-2.0, 0.6, 0.0);
    tp.xz = float2(tp.x * cos(rot) - tp.z * sin(rot), tp.x * sin(rot) + tp.z * cos(rot));
    float torus = rmSdTorus(tp, float2(0.5, 0.15));
    if (torus < res.x) res = float2(torus, 4.0);

    return res;
}

float3 rmNormal(float3 p, float iTime) {
    float2 e = float2(0.0005, 0.0);
    return normalize(float3(
        rmScene(p + e.xyy, iTime).x - rmScene(p - e.xyy, iTime).x,
        rmScene(p + e.yxy, iTime).x - rmScene(p - e.yxy, iTime).x,
        rmScene(p + e.yyx, iTime).x - rmScene(p - e.yyx, iTime).x
    ));
}

float rmSoftShadow(float3 ro, float3 rd, float mint, float maxt, float iTime) {
    float res = 1.0;
    float t = mint;
    float ph = 1e10;
    for (int i = 0; i < 64; i++) {
        float h = rmScene(ro + rd * t, iTime).x;
        float y = h * h / (2.0 * ph);
        float d = sqrt(max(0.0, h * h - y * y));
        res = min(res, 10.0 * d / max(0.0, t - y));
        ph = h;
        t += h;
        if (res < 0.001 || t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
}

float rmAO(float3 pos, float3 nor, float iTime) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.01 + 0.12 * float(i) / 4.0;
        float d = rmScene(pos + h * nor, iTime).x;
        occ += (h - d) * sca;
        sca *= 0.95;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

float3 rmMaterial(float id) {
    if (id < 1.5) return float3(0.5, 0.5, 0.5);
    if (id < 2.5) return float3(0.8, 0.2, 0.2);
    if (id < 3.5) return float3(0.2, 0.6, 0.8);
    return float3(0.9, 0.7, 0.2);
}

fragment float4 rayMarch3dFragment(VertexOut in [[stage_in]],
                                    constant float &iTime [[buffer(0)]],
                                    constant float2 &iResolution [[buffer(1)]]) {
    float2 uv = (in.position.xy - 0.5 * iResolution) / iResolution.y;

    float camAngle = iTime * 0.25;
    float3 ro = float3(sin(camAngle) * 5.0, 2.5 + sin(iTime * 0.3) * 0.5, cos(camAngle) * 5.0);
    float3 target = float3(0.0, 0.8, 0.0);
    float3 fwd = normalize(target - ro);
    float3 right = normalize(cross(fwd, float3(0.0, 1.0, 0.0)));
    float3 up = cross(right, fwd);
    float3 rd = normalize(fwd + uv.x * right + uv.y * up);

    float t = 0.0;
    float2 res = float2(-1.0);
    for (int i = 0; i < 128; i++) {
        float3 p = ro + rd * t;
        res = rmScene(p, iTime);
        if (res.x < 0.001 || t > 20.0) break;
        t += res.x;
    }

    float3 col = float3(0.4, 0.6, 0.9) - rd.y * 0.3;

    if (t < 20.0) {
        float3 pos = ro + rd * t;
        float3 nor = rmNormal(pos, iTime);

        float3 matCol = rmMaterial(res.y);

        if (res.y < 1.5) {
            float checker = fmod(floor(pos.x) + floor(pos.z), 2.0);
            matCol = mix(float3(0.3), float3(0.7), checker);
        }

        float3 lightDir = normalize(float3(0.8, 0.6, 0.4));
        float3 lightCol = float3(1.0, 0.95, 0.85);

        float diff = max(dot(nor, lightDir), 0.0);
        float3 halfVec = normalize(lightDir - rd);
        float spec = pow(max(dot(nor, halfVec), 0.0), 64.0);

        float shadow = rmSoftShadow(pos + nor * 0.01, lightDir, 0.02, 10.0, iTime);
        float ao = rmAO(pos, nor, iTime);

        float fresnel = pow(1.0 - max(dot(-rd, nor), 0.0), 5.0);

        col = matCol * 0.05;
        col += matCol * lightCol * diff * shadow;
        col += lightCol * spec * shadow * 0.5;
        col *= ao;

        float3 skyCol = float3(0.4, 0.6, 0.9);
        float skyDiff = max(dot(nor, float3(0.0, 1.0, 0.0)), 0.0);
        col += matCol * skyCol * skyDiff * 0.15 * ao;

        col += fresnel * skyCol * 0.2;

        float fog = 1.0 - exp(-t * 0.04);
        float3 fogCol = float3(0.5, 0.6, 0.8);
        col = mix(col, fogCol, fog);

        if (res.y > 1.5 && res.y < 2.5) {
            col += float3(0.1, 0.02, 0.02) * (1.0 - fresnel);
        }
    }

    col = pow(col, float3(0.4545));
    col *= 1.0 - 0.2 * length(uv);

    return float4(col, 1.0);
}
