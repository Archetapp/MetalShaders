#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

vec2 vgsHash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    float shatterProgress = smoothstep(0.0, 0.5, iMouseTime);
    float fallProgress = smoothstep(0.5, 3.5, iMouseTime);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 impactPoint = hasInput ? mouseCentered : vec2(0.0, 0.0);

    float scale = 8.0;
    vec2 cellUv = uv * scale;
    vec2 cellId = floor(cellUv);

    float minDist = 10.0;
    float secondDist = 10.0;
    vec2 nearestId = vec2(0.0);
    vec2 nearestPoint = vec2(0.0);

    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 id = cellId + neighbor;
            vec2 point = neighbor + vgsHash2(id) - fract(cellUv);
            float d = length(point);
            if (d < minDist) {
                secondDist = minDist;
                minDist = d;
                nearestId = id;
                nearestPoint = point;
            } else if (d < secondDist) {
                secondDist = d;
            }
        }
    }

    float edge = secondDist - minDist;
    float edgeLine = smoothstep(0.05, 0.0, edge);

    float distFromImpact = length(nearestId / scale - impactPoint);
    float shardShatter = smoothstep(0.0, 0.8, shatterProgress - distFromImpact * 0.5);

    vec2 shardHash = vgsHash2(nearestId + 100.0);
    float fallAngle = (shardHash.x - 0.5) * 3.14159;
    float fallSpeed = 0.5 + shardHash.y * 1.5;
    float shardFall = fallProgress * fallSpeed * shardShatter;

    vec2 offset = vec2(sin(fallAngle), -1.0) * shardFall * 0.3;
    float rotation = shardFall * (shardHash.x - 0.5) * 4.0;

    float crack = edgeLine * shatterProgress * smoothstep(0.8, 0.0, distFromImpact);

    vec3 glassColor = vec3(0.85, 0.9, 0.95);
    float reflection = pow(max(0.0, dot(normalize(vec3(nearestPoint, 1.0)), vec3(0.3, 0.5, 0.8))), 4.0);

    vec3 behindColor = vec3(0.1, 0.15, 0.2);
    behindColor += 0.1 * sin(uv.x * 10.0 + iTime) * vec3(0.3, 0.5, 0.7);

    float opacity = 1.0 - shardFall;
    opacity = max(opacity, 0.0);

    vec3 shardColor = glassColor + reflection * 0.3;
    shardColor += crack * vec3(0.8, 0.85, 1.0);

    float radialCrack = 0.0;
    for (int i = 0; i < 12; i++) {
        float a = float(i) * 0.5236;
        vec2 dir = vec2(cos(a), sin(a));
        float lineDist = abs(dot(uv - impactPoint, vec2(-dir.y, dir.x)));
        float along = dot(uv - impactPoint, dir);
        radialCrack += smoothstep(0.003, 0.0, lineDist) * smoothstep(0.0, 0.4, along) * shatterProgress;
    }
    shardColor += radialCrack * vec3(0.5, 0.6, 0.8) * 0.3;

    vec3 col = mix(behindColor, shardColor, opacity);

    fragColor = vec4(col, 1.0);
}
