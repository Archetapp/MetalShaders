#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 vsHash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

vec3 vsVoronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float md = 8.0;
    vec2 mr;
    vec2 cellId;
    for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = vsHash2(n + g);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < md) {
            md = d;
            mr = r;
            cellId = n + g;
        }
    }
    float md2 = 8.0;
    for (int j = -2; j <= 2; j++)
    for (int i = -2; i <= 2; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = vsHash2(n + g);
        vec2 r = g + o - f;
        if (dot(r - mr, r - mr) > 0.00001) {
            md2 = min(md2, dot(0.5 * (mr + r), normalize(r - mr)));
        }
    }
    return vec3(md, md2, cellId.x + cellId.y * 37.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 uvOrig = gl_FragCoord.xy / iResolution;

    float cycle = mod(iTime, 6.0);
    float shatterProgress = smoothstep(1.0, 3.5, cycle);
    float reformProgress = smoothstep(4.0, 5.8, cycle);
    float progress = shatterProgress * (1.0 - reformProgress);

    float scale = 6.0;
    vec3 vor = vsVoronoi(uv * scale);
    float cellDist = vor.x;
    float edgeDist = vor.y;
    float cellHash = fract(vor.z * 0.1731);

    float fallDelay = cellHash * 0.5;
    float cellProgress = clamp((progress - fallDelay) / (1.0 - fallDelay), 0.0, 1.0);

    float fallDist = cellProgress * cellProgress * 0.8;
    float rotation = cellProgress * (cellHash - 0.5) * 3.14159;
    vec2 fallDir = normalize(vec2(cellHash - 0.5, -1.0));

    vec2 offset = fallDir * fallDist * progress;

    vec2 sampleUV = uvOrig - offset;
    float cosR = cos(rotation * progress);
    float sinR = sin(rotation * progress);
    vec2 center = vec2(0.5);
    sampleUV = center + mat2(cosR, -sinR, sinR, cosR) * (sampleUV - center);

    vec3 sceneColor = vec3(0.0);
    sceneColor += 0.15 * vec3(0.3 + 0.7 * sin(sampleUV.x * 6.28 + iTime),
                               0.3 + 0.7 * sin(sampleUV.y * 6.28 + iTime * 1.3 + 2.0),
                               0.3 + 0.7 * sin((sampleUV.x + sampleUV.y) * 4.0 + iTime * 0.7 + 4.0));
    sceneColor += 0.3;

    float refraction = progress * 0.02 * (1.0 - edgeDist);
    vec3 col = vec3(0.0);
    col.r = (vec3(0.3 + 0.7 * sin((sampleUV.x + refraction) * 6.28 + iTime),
                   0.3 + 0.7 * sin(sampleUV.y * 6.28 + iTime * 1.3 + 2.0),
                   0.3 + 0.7 * sin(((sampleUV.x + refraction) + sampleUV.y) * 4.0 + iTime * 0.7 + 4.0)) * 0.15 + 0.3).r;
    col.g = sceneColor.g;
    col.b = (vec3(0.3 + 0.7 * sin((sampleUV.x - refraction) * 6.28 + iTime),
                   0.3 + 0.7 * sin(sampleUV.y * 6.28 + iTime * 1.3 + 2.0),
                   0.3 + 0.7 * sin(((sampleUV.x - refraction) + sampleUV.y) * 4.0 + iTime * 0.7 + 4.0)) * 0.15 + 0.3).b;

    float edge = 1.0 - smoothstep(0.0, 0.05, edgeDist);
    vec3 edgeColor = vec3(0.8, 0.85, 0.9);
    col = mix(col, edgeColor, edge * 0.7 * progress);

    float highlight = pow(max(0.0, 1.0 - cellDist * 2.0), 3.0);
    col += highlight * 0.15 * progress * vec3(0.9, 0.95, 1.0);

    float glassReflect = pow(1.0 - abs(dot(normalize(vec3(uv, 1.0)), vec3(0.0, 0.0, 1.0))), 3.0);
    col += glassReflect * 0.1 * progress * vec3(0.7, 0.8, 1.0);

    float alpha = 1.0 - cellProgress * 0.3;
    col *= alpha;

    float shadow = smoothstep(0.0, 0.3, progress) * 0.2;
    vec3 bgColor = vec3(0.05, 0.05, 0.07);
    float fragMask = 1.0 - step(0.99, cellProgress);
    col = mix(bgColor + shadow, col, fragMask + (1.0 - progress));

    fragColor = vec4(col, 1.0);
}
