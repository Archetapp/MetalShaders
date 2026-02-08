#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float scratchHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float scratchNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = scratchHash(i);
    float b = scratchHash(i + vec2(1.0, 0.0));
    float c = scratchHash(i + vec2(0.0, 1.0));
    float d = scratchHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float scratchFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * scratchNoise(p);
        p = p * 2.0 + vec2(100.0);
        a *= 0.5;
    }
    return v;
}

float scratchPath(vec2 uv, vec2 start, vec2 end, float width) {
    vec2 pa = uv - start;
    vec2 ba = end - start;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    float noiseWidth = width * (0.7 + scratchNoise(uv * 20.0) * 0.6);
    return smoothstep(noiseWidth, noiseWidth * 0.3, d);
}

vec3 revealContent(vec2 uv) {
    vec3 col1 = vec3(0.9, 0.2, 0.3);
    vec3 col2 = vec3(0.2, 0.7, 0.9);
    vec3 col3 = vec3(0.95, 0.8, 0.2);
    vec3 col4 = vec3(0.3, 0.9, 0.4);

    float angle = atan(uv.y - 0.5, uv.x - 0.5);
    float dist = length(uv - 0.5);

    float pattern = sin(angle * 3.0 + dist * 10.0) * 0.5 + 0.5;
    float pattern2 = sin(uv.x * 15.0) * sin(uv.y * 15.0) * 0.5 + 0.5;

    vec3 col = mix(col1, col2, pattern);
    col = mix(col, col3, pattern2 * 0.5);

    float star = pow(max(sin(angle * 5.0) * sin(dist * 20.0), 0.0), 2.0);
    col += col4 * star * 0.5;

    float sparkle = pow(scratchHash(floor(uv * 30.0)), 15.0) * 2.0;
    col += vec3(1.0, 0.9, 0.5) * sparkle;

    return col;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;

    float cycleTime = 12.0;
    float t = iMouseTime;

    float scratchMask = 0.0;

    float scratchWidth = 0.04;
    int numPaths = 15;

    for (int i = 0; i < 15; i++) {
        float pathTime = float(i) * cycleTime / float(numPaths);
        if (t < pathTime) continue;

        float pathProgress = clamp((t - pathTime) / 1.5, 0.0, 1.0);

        float id = float(i);
        vec2 start = (i == 0 && hasInput) ? mouseUV : vec2(
            scratchHash(vec2(id * 1.3, 0.0)),
            scratchHash(vec2(id * 2.7, 1.0))
        );

        float angle = scratchHash(vec2(id * 3.1, 2.0)) * 6.28;
        float pathLen = 0.2 + scratchHash(vec2(id * 4.3, 3.0)) * 0.4;
        vec2 end = start + vec2(cos(angle), sin(angle)) * pathLen;

        vec2 currentEnd = mix(start, end, pathProgress);
        float width = scratchWidth * (0.5 + scratchHash(vec2(id * 5.7, 4.0)) * 1.0);

        scratchMask += scratchPath(uv, start, currentEnd, width);

        if (pathProgress > 0.3) {
            float subAngle = angle + (scratchHash(vec2(id, 5.0)) - 0.5) * 1.5;
            vec2 branchStart = mix(start, end, 0.3 + scratchHash(vec2(id, 6.0)) * 0.4);
            vec2 branchEnd = branchStart + vec2(cos(subAngle), sin(subAngle)) * pathLen * 0.5;
            vec2 currentBranchEnd = mix(branchStart, branchEnd, clamp((pathProgress - 0.3) / 0.7, 0.0, 1.0));
            scratchMask += scratchPath(uv, branchStart, currentBranchEnd, width * 0.6);
        }
    }

    scratchMask = clamp(scratchMask, 0.0, 1.0);

    float edgeNoise = scratchFbm(uv * 15.0) * 0.3;
    scratchMask = smoothstep(0.2 - edgeNoise, 0.5 + edgeNoise, scratchMask);

    vec3 reveal = revealContent(uv);

    vec3 metalBase = vec3(0.75, 0.75, 0.78);
    float metalNoise = scratchFbm(uv * 8.0);
    metalBase += vec3(metalNoise * 0.1 - 0.05);

    float brushAngle = uv.x * 40.0 + uv.y * 5.0;
    float brushMark = sin(brushAngle) * 0.02;
    metalBase += vec3(brushMark);

    float viewAngle = sin(iTime * 0.5) * 0.3;
    float specHighlight = pow(max(sin(uv.x * 10.0 + viewAngle * 5.0) * cos(uv.y * 8.0 + viewAngle * 3.0), 0.0), 8.0);
    metalBase += vec3(0.3) * specHighlight;

    float scratchEdge = smoothstep(0.4, 0.5, scratchMask) - smoothstep(0.5, 0.6, scratchMask);
    vec3 edgeHighlight = vec3(0.9, 0.9, 0.95) * scratchEdge;

    vec3 col = mix(metalBase + edgeHighlight, reveal, scratchMask);

    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    col *= smoothstep(0.0, 0.8, vignette);

    fragColor = vec4(col, 1.0);
}
