#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

float metaball(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center);
    float r = radius;
    if (d > r * 3.0) return 0.0;
    float x = d / r;
    float f = 1.0 - x * x;
    return max(f * f * f, 0.0);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float t = iTime * 0.5;

    vec2 centers[7];
    float radii[7];
    vec3 colors[7];

    centers[0] = vec2(sin(t * 0.71) * 0.35, cos(t * 0.93) * 0.28);
    centers[1] = vec2(cos(t * 0.83) * 0.30, sin(t * 1.07) * 0.32);
    centers[2] = vec2(sin(t * 0.97 + 2.0) * 0.28, cos(t * 0.61 + 1.0) * 0.35);
    centers[3] = vec2(cos(t * 0.53 + 3.0) * 0.38, sin(t * 0.73 + 2.0) * 0.22);
    centers[4] = vec2(sin(t * 0.89 + 1.5) * 0.22, cos(t * 1.17 + 0.5) * 0.30);
    centers[5] = vec2(cos(t * 0.67 + 4.0) * 0.33, sin(t * 0.47 + 3.0) * 0.36);
    centers[6] = vec2(sin(t * 1.13 + 0.7) * 0.26, cos(t * 0.79 + 1.3) * 0.24);

    radii[0] = 0.22; radii[1] = 0.18; radii[2] = 0.25;
    radii[3] = 0.15; radii[4] = 0.19; radii[5] = 0.16; radii[6] = 0.20;

    colors[0] = vec3(1.0, 0.35, 0.5);
    colors[1] = vec3(0.3, 0.6, 1.0);
    colors[2] = vec3(0.2, 0.9, 0.6);
    colors[3] = vec3(1.0, 0.7, 0.2);
    colors[4] = vec3(0.7, 0.3, 1.0);
    colors[5] = vec3(0.2, 0.85, 0.9);
    colors[6] = vec3(1.0, 0.5, 0.7);

    float field = 0.0;
    vec3 weightedColor = vec3(0.0);

    for (int i = 0; i < 7; i++) {
        float f = metaball(uv, centers[i], radii[i]);
        field += f;
        weightedColor += colors[i] * f;
    }

    if (field > 0.001) {
        weightedColor /= field;
    }

    float threshold = 0.6;
    float surface = smoothstep(threshold - 0.15, threshold + 0.05, field);

    float eps = 0.003;
    float fx = 0.0, fy = 0.0;
    for (int i = 0; i < 7; i++) {
        fx += metaball(uv + vec2(eps, 0.0), centers[i], radii[i]);
        fx -= metaball(uv - vec2(eps, 0.0), centers[i], radii[i]);
        fy += metaball(uv + vec2(0.0, eps), centers[i], radii[i]);
        fy -= metaball(uv - vec2(0.0, eps), centers[i], radii[i]);
    }
    vec2 grad = vec2(fx, fy) / (2.0 * eps);
    vec3 normal = normalize(vec3(-grad, 1.5));

    vec3 lightDir = normalize(vec3(0.4, 0.6, 1.0));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float ambient = 0.35;
    float lighting = ambient + diffuse * 0.65;

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 40.0);

    float rim = 1.0 - max(dot(normal, viewDir), 0.0);
    rim = pow(rim, 2.5) * 0.4;

    float innerGlow = smoothstep(threshold, threshold + 1.5, field);

    vec3 surfaceCol = weightedColor * lighting;
    surfaceCol += vec3(1.0) * spec * 0.6;
    surfaceCol += weightedColor * rim;
    surfaceCol = mix(surfaceCol, weightedColor * 1.2, innerGlow * 0.3);

    vec3 bg = vec3(0.01, 0.01, 0.03);

    float outerGlow = smoothstep(threshold - 0.4, threshold - 0.05, field);
    vec3 glowCol = weightedColor * 0.15 * outerGlow * (1.0 - surface);

    vec3 finalCol = bg + glowCol;
    finalCol = mix(finalCol, surfaceCol, surface);

    finalCol = pow(finalCol, vec3(0.95));

    fragColor = vec4(finalCol, 1.0);
}
