#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float sandHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float sandHash3(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
}

float sandNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = sandHash(i);
    float b = sandHash(i + vec2(1.0, 0.0));
    float c = sandHash(i + vec2(0.0, 1.0));
    float d = sandHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 sandColor(float id) {
    float h = fract(id * 0.618);
    if (h < 0.2) return vec3(0.85, 0.75, 0.5);
    if (h < 0.4) return vec3(0.7, 0.3, 0.2);
    if (h < 0.6) return vec3(0.4, 0.6, 0.3);
    if (h < 0.8) return vec3(0.3, 0.4, 0.7);
    return vec3(0.7, 0.5, 0.7);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;

    float gridRes = 80.0;
    vec2 gridUv = floor(uv * gridRes) / gridRes;
    vec2 cellUv = fract(uv * gridRes);

    float cellX = gridUv.x;
    float cellY = gridUv.y;
    float cellId = sandHash(gridUv * gridRes);

    float numStreams = 6.0;
    float sandPresence = 0.0;
    float streamId = 0.0;

    for (float s = 0.0; s < 6.0; s++) {
        float streamX = (s == 0.0 && hasInput) ? mouseUV.x : (0.1 + s / numStreams * 0.8 + sin(iTime * 0.3 + s * 2.0) * 0.08);
        float streamWidth = 0.03 + 0.02 * sin(iTime * 0.5 + s);

        float inStream = smoothstep(streamWidth, 0.0, abs(cellX - streamX));

        float fallSpeed = 0.4 + sandHash(vec2(s, 0.0)) * 0.3;
        float fallPhase = fract(iTime * fallSpeed + sandHash(vec2(s, 1.0)));

        float spawnRate = 0.7 + 0.3 * sin(iTime * 0.2 + s);
        float grain = sandHash3(vec3(gridUv * gridRes, floor(iTime * 10.0 + s * 100.0)));

        float pileHeight = 0.0;
        float timeFactor = min(iTime * 0.05, 0.6);

        float noiseOffset = sandNoise(vec2(cellX * 10.0 + s * 7.0, s)) * 0.1;
        float distFromStream = abs(cellX - streamX);
        float pileWidth = 0.15 + timeFactor * 0.2;
        float pileShape = max(0.0, 1.0 - distFromStream / pileWidth);
        pileShape = pileShape * pileShape;
        pileHeight = pileShape * timeFactor * (0.5 + s * 0.08) + noiseOffset * timeFactor;

        float inPile = step(cellY, pileHeight);

        float fallingGrain = inStream * step(grain, spawnRate * 0.3) * step(pileHeight, cellY);
        float grainJitter = sandHash(gridUv * gridRes + s * 100.0 + floor(iTime * 15.0));
        fallingGrain *= step(0.6, grainJitter);

        if (inPile > 0.5 || fallingGrain > 0.3) {
            sandPresence = 1.0;
            streamId = s;
        }
    }

    vec3 col;

    if (sandPresence > 0.5) {
        vec3 baseCol = sandColor(streamId);
        float grainNoise = sandHash(gridUv * gridRes + streamId * 50.0);
        baseCol *= 0.8 + grainNoise * 0.4;

        float shadow = smoothstep(0.0, 0.5, cellY) * 0.3;
        baseCol *= 1.0 - shadow;

        float highlight = pow(grainNoise, 4.0) * 0.3;
        baseCol += vec3(highlight);

        float edgeShadow = smoothstep(0.5, 0.0, min(cellUv.x, min(cellUv.y, min(1.0 - cellUv.x, 1.0 - cellUv.y))));
        baseCol *= 1.0 - edgeShadow * 0.15;

        col = baseCol;
    } else {
        vec3 bgTop = vec3(0.12, 0.12, 0.15);
        vec3 bgBottom = vec3(0.08, 0.08, 0.1);
        col = mix(bgBottom, bgTop, uv.y);

        float gridLine = smoothstep(0.02, 0.0, min(cellUv.x, cellUv.y));
        col += vec3(0.03) * gridLine;

        for (float s = 0.0; s < 6.0; s++) {
            float streamX = (s == 0.0 && hasInput) ? mouseUV.x : (0.1 + s / numStreams * 0.8 + sin(iTime * 0.3 + s * 2.0) * 0.08);
            float funnelGlow = exp(-abs(cellX - streamX) * 40.0) * smoothstep(0.8, 1.0, uv.y);
            col += sandColor(s) * funnelGlow * 0.3;
        }
    }

    fragColor = vec4(col, 1.0);
}
