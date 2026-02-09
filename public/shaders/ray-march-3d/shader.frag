#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float rmSdSphere(vec3 p, float r) {
    return length(p) - r;
}

float rmSdPlane(vec3 p) {
    return p.y;
}

float rmSdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float rmSdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

vec2 rmScene(vec3 p) {
    float plane = rmSdPlane(p);
    vec2 res = vec2(plane, 1.0);

    float bounce = abs(sin(iTime * 1.5)) * 0.3;
    vec3 spherePos = p - vec3(0.0, 1.0 + bounce, 0.0);
    float sphere = rmSdSphere(spherePos, 0.8);
    if (sphere < res.x) res = vec2(sphere, 2.0);

    float rot = iTime * 0.5;
    vec3 bp = p - vec3(2.0, 0.5, 0.0);
    float cs = cos(rot), sn = sin(rot);
    bp.xz = vec2(bp.x * cs - bp.z * sn, bp.x * sn + bp.z * cs);
    bp.xy = vec2(bp.x * cos(rot * 0.7) - bp.y * sin(rot * 0.7),
                 bp.x * sin(rot * 0.7) + bp.y * cos(rot * 0.7));
    float box = rmSdBox(bp, vec3(0.4));
    if (box < res.x) res = vec2(box, 3.0);

    vec3 tp = p - vec3(-2.0, 0.6, 0.0);
    tp.xz = vec2(tp.x * cos(rot) - tp.z * sin(rot), tp.x * sin(rot) + tp.z * cos(rot));
    float torus = rmSdTorus(tp, vec2(0.5, 0.15));
    if (torus < res.x) res = vec2(torus, 4.0);

    return res;
}

vec3 rmNormal(vec3 p) {
    vec2 e = vec2(0.0005, 0.0);
    return normalize(vec3(
        rmScene(p + e.xyy).x - rmScene(p - e.xyy).x,
        rmScene(p + e.yxy).x - rmScene(p - e.yxy).x,
        rmScene(p + e.yyx).x - rmScene(p - e.yyx).x
    ));
}

float rmSoftShadow(vec3 ro, vec3 rd, float mint, float maxt) {
    float res = 1.0;
    float t = mint;
    float ph = 1e10;
    for (int i = 0; i < 64; i++) {
        float h = rmScene(ro + rd * t).x;
        float y = h * h / (2.0 * ph);
        float d = sqrt(max(0.0, h * h - y * y));
        res = min(res, 10.0 * d / max(0.0, t - y));
        ph = h;
        t += h;
        if (res < 0.001 || t > maxt) break;
    }
    return clamp(res, 0.0, 1.0);
}

float rmAO(vec3 pos, vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    for (int i = 0; i < 5; i++) {
        float h = 0.01 + 0.12 * float(i) / 4.0;
        float d = rmScene(pos + h * nor).x;
        occ += (h - d) * sca;
        sca *= 0.95;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

vec3 rmMaterial(float id) {
    if (id < 1.5) return vec3(0.5, 0.5, 0.5);
    if (id < 2.5) return vec3(0.8, 0.2, 0.2);
    if (id < 3.5) return vec3(0.2, 0.6, 0.8);
    return vec3(0.9, 0.7, 0.2);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float camAngle = iTime * 0.25;
    vec3 ro = vec3(sin(camAngle) * 5.0, 2.5 + sin(iTime * 0.3) * 0.5, cos(camAngle) * 5.0);
    vec3 target = vec3(0.0, 0.8, 0.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);

    float t = 0.0;
    vec2 res = vec2(-1.0);
    for (int i = 0; i < 128; i++) {
        vec3 p = ro + rd * t;
        res = rmScene(p);
        if (res.x < 0.001 || t > 20.0) break;
        t += res.x;
    }

    vec3 col = vec3(0.4, 0.6, 0.9) - rd.y * 0.3;

    if (t < 20.0) {
        vec3 pos = ro + rd * t;
        vec3 nor = rmNormal(pos);

        vec3 matCol = rmMaterial(res.y);

        if (res.y < 1.5) {
            float checker = mod(floor(pos.x) + floor(pos.z), 2.0);
            matCol = mix(vec3(0.3), vec3(0.7), checker);
        }

        vec3 lightDir = normalize(vec3(0.8, 0.6, 0.4));
        vec3 lightCol = vec3(1.0, 0.95, 0.85);

        float diff = max(dot(nor, lightDir), 0.0);
        vec3 halfVec = normalize(lightDir - rd);
        float spec = pow(max(dot(nor, halfVec), 0.0), 64.0);

        float shadow = rmSoftShadow(pos + nor * 0.01, lightDir, 0.02, 10.0);
        float ao = rmAO(pos, nor);

        float fresnel = pow(1.0 - max(dot(-rd, nor), 0.0), 5.0);

        col = matCol * 0.05;
        col += matCol * lightCol * diff * shadow;
        col += lightCol * spec * shadow * 0.5;
        col *= ao;

        vec3 skyCol = vec3(0.4, 0.6, 0.9);
        float skyDiff = max(dot(nor, vec3(0.0, 1.0, 0.0)), 0.0);
        col += matCol * skyCol * skyDiff * 0.15 * ao;

        col += fresnel * skyCol * 0.2;

        float fog = 1.0 - exp(-t * 0.04);
        vec3 fogCol = vec3(0.5, 0.6, 0.8);
        col = mix(col, fogCol, fog);

        if (res.y > 1.5 && res.y < 2.5) {
            col += vec3(0.1, 0.02, 0.02) * (1.0 - fresnel);
        }
    }

    col = pow(col, vec3(0.4545));
    col *= 1.0 - 0.2 * length(uv);

    fragColor = vec4(col, 1.0);
}
