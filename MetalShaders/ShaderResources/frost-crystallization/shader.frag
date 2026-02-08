#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float frostHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 frostHash2(vec2 p) {
    return vec2(fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453),
                fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453));
}

float frostNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = frostHash(i);
    float b = frostHash(i + vec2(1.0, 0.0));
    float c = frostHash(i + vec2(0.0, 1.0));
    float d = frostHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float frostFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * frostNoise(p);
        p = p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

vec3 frostVoronoi(vec2 uv, float scale) {
    vec2 id = floor(uv * scale);
    vec2 gv = fract(uv * scale);

    float minDist = 1.0;
    float secondDist = 1.0;
    vec2 closestId = vec2(0.0);

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 offset = vec2(float(x), float(y));
            vec2 cell = id + offset;
            vec2 cellPos = frostHash2(cell) + offset;
            float d = length(gv - cellPos);

            if (d < minDist) {
                secondDist = minDist;
                minDist = d;
                closestId = cell;
            } else if (d < secondDist) {
                secondDist = d;
            }
        }
    }

    return vec3(minDist, secondDist, frostHash(closestId));
}

float frostCrystalBranch(vec2 uv, float angle, float growthProgress) {
    vec2 dir = vec2(cos(angle), sin(angle));
    vec2 perp = vec2(-dir.y, dir.x);

    float along = dot(uv, dir);
    float across = abs(dot(uv, perp));

    float branchLen = growthProgress * 0.3;
    float branchWidth = 0.003 * (1.0 - along / branchLen);
    branchWidth = max(branchWidth, 0.0005);

    float branch = smoothstep(branchWidth + 0.001, branchWidth, across) *
                   step(0.0, along) * step(along, branchLen);

    for (int i = 1; i <= 4; i++) {
        float subPos = branchLen * float(i) / 5.0;
        if (along > subPos - 0.005 && along < subPos + 0.005 && growthProgress > 0.3) {
            float subGrowth = (growthProgress - 0.3) / 0.7;
            float subLen = subGrowth * 0.08;
            float subAngle = angle + 1.047; // 60 degrees
            vec2 subOrigin = dir * subPos;
            vec2 subUv = uv - subOrigin;
            vec2 subDir = vec2(cos(subAngle), sin(subAngle));
            vec2 subPerp = vec2(-subDir.y, subDir.x);
            float subAlong = dot(subUv, subDir);
            float subAcross = abs(dot(subUv, subPerp));
            float subWidth = 0.002 * (1.0 - subAlong / subLen);
            subWidth = max(subWidth, 0.0003);
            branch += smoothstep(subWidth + 0.001, subWidth, subAcross) *
                      step(0.0, subAlong) * step(subAlong, subLen) * 0.7;

            subAngle = angle - 1.047;
            subDir = vec2(cos(subAngle), sin(subAngle));
            subPerp = vec2(-subDir.y, subDir.x);
            subAlong = dot(subUv, subDir);
            subAcross = abs(dot(subUv, subPerp));
            branch += smoothstep(subWidth + 0.001, subWidth, subAcross) *
                      step(0.0, subAlong) * step(subAlong, subLen) * 0.7;
        }
    }

    return min(branch, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    float growthTime = 10.0;
    float cycleProgress = mod(iTime, growthTime) / growthTime;

    vec3 bgColor = mix(vec3(0.02, 0.04, 0.08), vec3(0.05, 0.08, 0.15), uv.y);

    float surfaceFrost = frostFbm(uv * 8.0 + iTime * 0.01);
    float frostCoverage = smoothstep(1.0 - cycleProgress * 0.8, 1.0 - cycleProgress * 0.8 + 0.3, surfaceFrost);
    bgColor = mix(bgColor, vec3(0.15, 0.2, 0.3), frostCoverage * 0.3);

    vec3 vor = frostVoronoi(uv, 8.0);
    float edgeDist = vor.y - vor.x;
    float voronoiEdge = smoothstep(0.05, 0.0, edgeDist) * frostCoverage;
    bgColor += vec3(0.2, 0.3, 0.5) * voronoiEdge * 0.5;

    float facetShading = vor.z * 0.15 * frostCoverage;
    bgColor += vec3(0.1, 0.15, 0.25) * facetShading;

    float crystalAccum = 0.0;

    int numSeeds = 5;
    for (int s = 0; s < 5; s++) {
        float seedId = float(s);
        vec2 seedPos = vec2(
            (frostHash(vec2(seedId * 1.3, 0.0)) - 0.5) * aspect * 0.8,
            (frostHash(vec2(seedId * 2.7, 1.0)) - 0.5) * 0.8
        );

        float seedDelay = frostHash(vec2(seedId, 2.0)) * 0.3;
        float localProgress = clamp((cycleProgress - seedDelay) / (1.0 - seedDelay), 0.0, 1.0);

        vec2 relP = p - seedPos;

        float centerGlow = exp(-length(relP) * 20.0) * localProgress;
        crystalAccum += centerGlow * 0.5;

        for (int b = 0; b < 6; b++) {
            float branchAngle = float(b) * 1.0472; // 60 degrees
            branchAngle += frostHash(vec2(seedId, float(b))) * 0.2;
            float branchDelay = float(b) * 0.05;
            float branchProgress = clamp((localProgress - branchDelay) / (1.0 - branchDelay), 0.0, 1.0);
            crystalAccum += frostCrystalBranch(relP, branchAngle, branchProgress);
        }
    }

    crystalAccum = min(crystalAccum, 1.0);

    vec3 crystalColor = mix(vec3(0.6, 0.8, 1.0), vec3(0.9, 0.95, 1.0), crystalAccum);

    float iceSpecular = pow(crystalAccum, 3.0) * 0.5;
    crystalColor += vec3(1.0, 1.0, 0.95) * iceSpecular;

    float rimLight = pow(frostFbm(uv * 12.0 + iTime * 0.05), 3.0) * crystalAccum;
    crystalColor += vec3(0.3, 0.5, 0.8) * rimLight;

    vec3 col = mix(bgColor, crystalColor, crystalAccum);

    float sparkle = pow(frostHash(floor(uv * iResolution * 0.5)), 20.0) * crystalAccum * 3.0;
    sparkle *= 0.5 + 0.5 * sin(iTime * 5.0 + frostHash(floor(uv * 100.0)) * 6.28);
    col += vec3(0.8, 0.9, 1.0) * sparkle;

    float vignette = 1.0 - length((uv - 0.5) * 1.3);
    col *= smoothstep(0.0, 0.8, vignette);

    fragColor = vec4(col, 1.0);
}
