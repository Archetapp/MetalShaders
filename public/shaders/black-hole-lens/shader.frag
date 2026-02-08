#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float bhHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float bhStarField(vec2 uv, float scale) {
    vec2 id = floor(uv * scale);
    vec2 f = fract(uv * scale);
    float star = 0.0;
    for (int y = -1; y <= 1; y++)
    for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 point = vec2(bhHash(id + neighbor), bhHash(id + neighbor + 71.0));
        float d = length(f - neighbor - point);
        float brightness = bhHash(id + neighbor + 137.0);
        if (brightness > 0.92) {
            star += exp(-d * d * 300.0) * (brightness - 0.92) * 12.5;
        }
    }
    return star;
}

vec3 bhStarColor(vec2 uv) {
    float h = bhHash(floor(uv * 50.0));
    if (h < 0.3) return vec3(0.8, 0.85, 1.0);
    if (h < 0.5) return vec3(1.0, 0.95, 0.8);
    if (h < 0.65) return vec3(1.0, 0.8, 0.6);
    return vec3(0.9, 0.9, 1.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 bhPos = hasInput ? mouseCentered : vec2(0.0, 0.0);
    float dist = length(uv - bhPos);

    float schwarzschild = 0.08;
    float lensStrength = 0.04;

    vec2 dir = normalize(uv - bhPos);
    float deflection = lensStrength / (dist * dist + 0.001);
    deflection = min(deflection, 2.0);

    vec2 lensedUV = uv + dir * deflection;

    float starLayer1 = bhStarField(lensedUV + t * 0.01, 30.0);
    float starLayer2 = bhStarField(lensedUV * 1.5 + t * 0.005 + 5.0, 50.0);
    float starLayer3 = bhStarField(lensedUV * 0.7 - t * 0.008 + 10.0, 20.0);

    vec3 starColor = bhStarColor(lensedUV);
    float totalStars = starLayer1 + starLayer2 * 0.6 + starLayer3 * 0.3;

    vec3 col = vec3(0.005, 0.005, 0.015);
    vec3 nebulaCol = vec3(0.03, 0.01, 0.05) * (bhHash(floor(lensedUV * 5.0)) * 0.5 + 0.5);
    col += nebulaCol;
    col += starColor * totalStars;

    float einsteinRing = abs(dist - schwarzschild * 2.5);
    float ringGlow = exp(-einsteinRing * einsteinRing * 800.0);
    float ringBrightness = 1.0 + 0.3 * sin(t * 2.0);
    col += vec3(0.6, 0.7, 1.0) * ringGlow * 0.5 * ringBrightness;

    float diskAngle = atan(uv.y, uv.x) + t * 0.3;
    float diskR = dist;
    float innerDisk = schwarzschild * 1.5;
    float outerDisk = schwarzschild * 6.0;
    float diskMask = smoothstep(innerDisk, innerDisk + 0.02, diskR) *
                     smoothstep(outerDisk, outerDisk - 0.05, diskR);

    float tilt = abs(uv.y * 2.0 - uv.x * 0.1);
    float diskThin = exp(-tilt * tilt * 80.0);

    float diskSpiral = sin(diskAngle * 3.0 + log(diskR + 0.01) * 8.0 - t * 2.0) * 0.5 + 0.5;
    float diskNoise = sin(diskAngle * 7.0 - t * 5.0) * 0.3 + 0.7;

    float diskBrightness = diskMask * diskThin * diskSpiral * diskNoise;

    float diskTemp = 1.0 - smoothstep(innerDisk, outerDisk, diskR);
    vec3 hotColor = vec3(1.0, 0.9, 0.7);
    vec3 warmColor = vec3(1.0, 0.5, 0.2);
    vec3 coolColor = vec3(0.8, 0.2, 0.1);
    vec3 diskColor = mix(coolColor, mix(warmColor, hotColor, diskTemp), diskTemp);

    col += diskColor * diskBrightness * 2.0;

    float eventHorizon = smoothstep(schwarzschild + 0.01, schwarzschild - 0.01, dist);
    col *= (1.0 - eventHorizon);

    float brightening = 1.0 + 2.0 * exp(-(dist - schwarzschild * 2.0) * (dist - schwarzschild * 2.0) * 50.0);
    col *= brightening;

    float jetMask = exp(-abs(uv.x) * 50.0) * smoothstep(schwarzschild, schwarzschild + 0.3, abs(uv.y));
    float jetFade = exp(-abs(uv.y) * 3.0);
    col += vec3(0.3, 0.4, 0.8) * jetMask * jetFade * 0.2;

    col = 1.0 - exp(-col * 1.5);
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
