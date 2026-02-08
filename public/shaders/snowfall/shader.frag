#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float snowHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float snowNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = snowHash(i);
    float b = snowHash(i + vec2(1.0, 0.0));
    float c = snowHash(i + vec2(0.0, 1.0));
    float d = snowHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float snowflake(vec2 uv, vec2 pos, float size) {
    float d = length(uv - pos);
    float core = smoothstep(size, size * 0.2, d);

    float angle = atan(uv.y - pos.y, uv.x - pos.x);
    float arms = abs(sin(angle * 3.0));
    float armShape = smoothstep(size * 2.0, size * 0.5, d) * smoothstep(0.3, 0.7, arms);

    return core + armShape * 0.3;
}

float snowLayer(vec2 uv, float depth, float time, vec2 windBias) {
    float result = 0.0;
    float gridSize = 4.0 + depth * 3.0;
    float fallSpeed = 0.15 + depth * 0.05;
    float windStrength = 0.3 + depth * 0.1;

    float wind = sin(time * 0.3 + depth) * windStrength + windBias.x;
    uv.x += wind * time * 0.1;
    uv.y += time * fallSpeed + windBias.y * time * 0.02;

    vec2 grid = floor(uv * gridSize);
    vec2 gridUv = fract(uv * gridSize);

    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 cell = grid + neighbor;
            float h = snowHash(cell + depth * 100.0);

            if (h > 0.4) continue;

            vec2 offset = vec2(snowHash(cell * 1.7 + depth * 50.0),
                              snowHash(cell * 2.3 + depth * 70.0));

            float wobbleX = sin(time * (0.5 + h) + h * 6.28) * 0.15;
            float wobbleY = sin(time * (0.3 + h * 0.5) + h * 3.14) * 0.05;

            vec2 pos = neighbor + offset + vec2(wobbleX, wobbleY);
            float size = 0.02 + h * 0.04;
            size *= (0.5 + depth * 0.5);

            result += snowflake(gridUv, pos, size) * (0.3 + h * 0.7);
        }
    }

    return result;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;

    vec3 skyTop = vec3(0.05, 0.07, 0.15);
    vec3 skyBottom = vec3(0.15, 0.18, 0.28);
    vec3 col = mix(skyBottom, skyTop, uv.y / aspect);

    float atmosphericGlow = exp(-length(vec2(uv.x / aspect - 0.5, uv.y / aspect - 0.3)) * 3.0) * 0.15;
    col += vec3(0.2, 0.25, 0.4) * atmosphericGlow;

    float groundY = 0.08;
    float groundMask = smoothstep(groundY + 0.02, groundY - 0.01, uv.y / aspect);
    vec3 groundColor = vec3(0.6, 0.65, 0.75) * (0.3 + snowNoise(uv * 20.0) * 0.1);
    col = mix(col, groundColor, groundMask);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 windBias = hasInput ? (mouseUV - 0.5) * vec2(0.5, 0.3) : vec2(0.0);

    for (int i = 0; i < 6; i++) {
        float depth = float(i) / 5.0;
        float layerIntensity = snowLayer(uv, depth, iTime, windBias);
        float brightness = 0.4 + depth * 0.6;
        float opacity = (0.3 + depth * 0.7);

        vec3 snowColor = mix(vec3(0.6, 0.7, 0.85), vec3(1.0, 1.0, 1.0), depth);
        col += snowColor * layerIntensity * brightness * opacity;
    }

    float fog = (1.0 - uv.y / aspect) * 0.15;
    col = mix(col, vec3(0.3, 0.35, 0.45), fog);

    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
