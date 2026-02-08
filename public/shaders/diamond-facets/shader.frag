#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

mat2 dfRot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

float dfSdCone(vec3 p, float angle, float h) {
    vec2 c = vec2(sin(angle), cos(angle));
    vec2 q = h * vec2(c.x / c.y, -1.0);
    vec2 w = vec2(length(p.xz), p.y);
    vec2 a2 = w - q * clamp(dot(w, q) / dot(q, q), 0.0, 1.0);
    vec2 b = w - q * vec2(clamp(w.x / q.x, 0.0, 1.0), 1.0);
    float k = sign(q.y);
    float d = min(dot(a2, a2), dot(b, b));
    float s2 = max(k * (w.x * q.y - w.y * q.x), k * (w.y - q.y));
    return sqrt(d) * sign(s2);
}

float dfDiamond(vec3 p) {
    float crown = dfSdCone(p - vec3(0.0, 0.15, 0.0), 0.6, 0.35);
    float pavilion = dfSdCone(vec3(p.x, -p.y, p.z) - vec3(0.0, -0.15, 0.0), 0.45, 0.65);
    float girdle = length(max(abs(p) - vec3(0.5, 0.02, 0.5), 0.0)) - 0.02;
    float d = max(crown, pavilion);
    return d;
}

vec3 dfNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        dfDiamond(p + e.xyy) - dfDiamond(p - e.xyy),
        dfDiamond(p + e.yxy) - dfDiamond(p - e.yxy),
        dfDiamond(p + e.yyx) - dfDiamond(p - e.yyx)
    ));
}

vec3 dfSpectralColor(float t) {
    vec3 r = vec3(0.0);
    if (t < 0.17) r = mix(vec3(0.3, 0.0, 0.5), vec3(0.0, 0.0, 1.0), t / 0.17);
    else if (t < 0.33) r = mix(vec3(0.0, 0.0, 1.0), vec3(0.0, 1.0, 1.0), (t - 0.17) / 0.16);
    else if (t < 0.5) r = mix(vec3(0.0, 1.0, 1.0), vec3(0.0, 1.0, 0.0), (t - 0.33) / 0.17);
    else if (t < 0.67) r = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), (t - 0.5) / 0.17);
    else if (t < 0.83) r = mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.5, 0.0), (t - 0.67) / 0.16);
    else r = mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 0.0, 0.0), (t - 0.83) / 0.17);
    return r;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float rotAngle = iTime * 0.3;
    vec3 ro = vec3(sin(rotAngle) * 2.0, 1.0, cos(rotAngle) * 2.0);
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);

    vec3 col = vec3(0.02, 0.02, 0.06);

    float t = 0.0;
    bool hit = false;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = dfDiamond(p);
        if (d < 0.001) {
            hit = true;
            break;
        }
        if (t > 10.0) break;
        t += d;
    }

    if (hit) {
        vec3 hitPos = ro + rd * t;
        vec3 n = dfNormal(hitPos);

        float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
        vec3 refl = reflect(rd, n);

        vec3 envColor = mix(vec3(0.1, 0.1, 0.3), vec3(0.6, 0.8, 1.0), refl.y * 0.5 + 0.5);
        envColor += pow(max(dot(refl, normalize(vec3(1.0, 1.0, 0.5))), 0.0), 32.0) * vec3(1.0, 0.95, 0.8);

        vec3 refractCol = vec3(0.0);
        int numWavelengths = 7;
        for (int w = 0; w < 7; w++) {
            float wt = float(w) / float(numWavelengths - 1);
            float ior = 2.42 + wt * 0.056 - 0.028;
            vec3 refr = refract(rd, n, 1.0 / ior);
            if (length(refr) < 0.01) refr = reflect(rd, n);

            vec3 internalPos = hitPos + refr * 0.5;
            vec3 internalN = dfNormal(internalPos);
            vec3 refr2 = refract(refr, -internalN, ior);
            if (length(refr2) < 0.01) refr2 = reflect(refr, -internalN);

            vec3 internalPos2 = internalPos + refr2 * 0.3;
            vec3 internalN2 = dfNormal(internalPos2);
            vec3 refr3 = refract(refr2, -internalN2, ior);
            if (length(refr3) < 0.01) refr3 = reflect(refr2, -internalN2);

            vec3 exitDir = refr3;
            vec3 exitEnv = mix(vec3(0.15, 0.1, 0.3), vec3(0.7, 0.85, 1.0), exitDir.y * 0.5 + 0.5);
            exitEnv += pow(max(dot(exitDir, normalize(vec3(1.0, 1.0, 0.5))), 0.0), 16.0) * 1.5;

            refractCol += dfSpectralColor(wt) * exitEnv;
        }
        refractCol /= float(numWavelengths);

        col = mix(refractCol * 1.8, envColor, fresnel);

        vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
        float spec = pow(max(dot(refl, lightDir), 0.0), 128.0);
        col += vec3(1.0) * spec * 2.0;

        vec3 lightDir2 = normalize(vec3(-1.0, 1.0, -0.5));
        float spec2 = pow(max(dot(refl, lightDir2), 0.0), 64.0);
        col += vec3(0.8, 0.9, 1.0) * spec2;

        float facetPattern = abs(sin(atan(n.x, n.z) * 8.0)) * abs(sin(n.y * 6.0));
        col += vec3(0.1, 0.15, 0.2) * facetPattern * 0.3;
    }

    col = pow(col, vec3(0.85));
    col *= 1.0 - 0.3 * length(uv);

    fragColor = vec4(col, 1.0);
}
