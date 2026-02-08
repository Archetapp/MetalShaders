#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float globeHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float globeNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = globeHash(i);
    float b = globeHash(i + vec2(1.0, 0.0));
    float c = globeHash(i + vec2(0.0, 1.0));
    float d = globeHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float globeSdCircle(vec2 p, float r) {
    return length(p) - r;
}

float globeSdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float globeSdTriangle(vec2 p, float h, float w) {
    p.y -= h * 0.5;
    float slope = w / h;
    float d = max(abs(p.x) - w * (1.0 - p.y / h), -p.y);
    d = max(d, p.y - h);
    return d;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    vec3 bgCol = mix(vec3(0.15, 0.1, 0.08), vec3(0.08, 0.05, 0.04), uv.y);

    vec2 globeCenter = vec2(0.0, 0.05);
    float globeRadius = 0.35;
    float distToGlobe = length(p - globeCenter);

    vec2 baseCenter = vec2(0.0, globeCenter.y - globeRadius - 0.02);
    float baseWidth = 0.25;
    float baseHeight = 0.08;

    float baseDist = globeSdBox(p - baseCenter, vec2(baseWidth, baseHeight));
    float baseMask = smoothstep(0.005, 0.0, baseDist);
    vec3 baseColor = mix(vec3(0.3, 0.2, 0.1), vec3(0.5, 0.35, 0.2), (p.y - baseCenter.y + baseHeight) / (baseHeight * 2.0));
    baseColor += vec3(0.1) * pow(max(1.0 - abs(p.x) / baseWidth, 0.0), 4.0);

    vec3 col = bgCol;
    col = mix(col, baseColor, baseMask);

    if (distToGlobe < globeRadius) {
        vec2 localP = p - globeCenter;

        vec3 insideBg = mix(vec3(0.1, 0.15, 0.25), vec3(0.05, 0.08, 0.15), (localP.y + globeRadius) / (globeRadius * 2.0));

        float groundY = -globeRadius * 0.6;
        float groundNoise = globeNoise(vec2(localP.x * 20.0, 0.0)) * 0.02;
        float ground = smoothstep(groundY + groundNoise + 0.01, groundY + groundNoise - 0.01, localP.y);
        vec3 groundCol = vec3(0.85, 0.9, 0.95);
        insideBg = mix(insideBg, groundCol, ground);

        vec2 treePos = vec2(0.0, groundY + 0.06);
        float trunk = step(abs(localP.x - treePos.x), 0.008) * step(treePos.y - 0.06, localP.y) * step(localP.y, treePos.y + 0.02);
        insideBg = mix(insideBg, vec3(0.3, 0.2, 0.1), trunk);

        for (int i = 0; i < 3; i++) {
            float layer = float(i);
            float treeY = treePos.y + 0.02 + layer * 0.04;
            float treeW = 0.06 - layer * 0.015;
            float treeH = 0.05;
            float treeDist = max(abs(localP.x - treePos.x) - treeW * (1.0 - (localP.y - treeY) / treeH), -(localP.y - treeY));
            treeDist = max(treeDist, localP.y - treeY - treeH);
            float treeMask = smoothstep(0.003, 0.0, treeDist);
            vec3 treeColor = mix(vec3(0.1, 0.4, 0.15), vec3(0.15, 0.5, 0.2), layer / 2.0);
            float snowOnTree = smoothstep(treeY + treeH - 0.01, treeY + treeH, localP.y) * treeMask;
            treeColor = mix(treeColor, vec3(0.9, 0.95, 1.0), snowOnTree * 0.5);
            insideBg = mix(insideBg, treeColor, treeMask);
        }

        float snowAccum = 0.0;
        for (int i = 0; i < 80; i++) {
            float id = float(i);
            vec2 seed = vec2(id * 0.73, id * 1.37);

            float shakePhase = sin(iTime * 0.5) * 0.5 + 0.5;
            float settleTime = 3.0;
            float age = mod(iTime + globeHash(seed) * settleTime, settleTime);
            float settled = smoothstep(settleTime * 0.7, settleTime, age);

            vec2 startPos = vec2(
                (globeHash(seed) - 0.5) * globeRadius * 1.6,
                (globeHash(seed * 2.0) - 0.5) * globeRadius * 1.6
            );

            float fallProgress = age / settleTime;
            vec2 snowPos = startPos;
            snowPos.y -= fallProgress * globeRadius * 0.8;
            snowPos.x += sin(age * 2.0 + id) * 0.03;
            snowPos.x += sin(iTime * 0.3) * 0.02 * (1.0 - settled);

            if (length(snowPos) > globeRadius * 0.9) {
                snowPos = normalize(snowPos) * globeRadius * 0.9;
            }

            float snowSize = 0.003 + globeHash(seed * 3.0) * 0.004;
            float flakeDist = length(localP - snowPos);
            float flake = smoothstep(snowSize, snowSize * 0.2, flakeDist);
            flake *= (1.0 - settled * 0.8);

            snowAccum += flake;
        }

        insideBg += vec3(0.9, 0.95, 1.0) * min(snowAccum, 1.0);

        float rimDist = globeRadius - distToGlobe;
        float glassEdge = smoothstep(0.05, 0.0, rimDist);
        float fresnel = pow(1.0 - rimDist / globeRadius, 4.0);

        vec3 refractColor = vec3(0.7, 0.8, 1.0);
        insideBg = mix(insideBg, refractColor, fresnel * 0.4);
        insideBg += vec3(0.3, 0.35, 0.4) * glassEdge;

        float specAngle = atan(localP.y, localP.x);
        float spec1 = pow(max(sin(specAngle - 0.8), 0.0), 20.0) * smoothstep(globeRadius * 0.5, globeRadius, distToGlobe);
        float spec2 = pow(max(sin(specAngle + 1.5), 0.0), 30.0) * smoothstep(globeRadius * 0.6, globeRadius * 0.9, distToGlobe);
        insideBg += vec3(1.0) * (spec1 * 0.4 + spec2 * 0.2);

        float globeMask = smoothstep(globeRadius + 0.003, globeRadius - 0.003, distToGlobe);
        col = mix(col, insideBg, globeMask);
    }

    float shadowDist = length(vec2(p.x * 1.2, p.y - (globeCenter.y - globeRadius - 0.12)));
    float shadow = exp(-shadowDist * 5.0) * 0.3;
    col -= vec3(shadow);

    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
