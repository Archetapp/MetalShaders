#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dewHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 dewHash2(vec2 p) { return vec2(dewHash(p), dewHash(p + vec2(37.0, 91.0))); }

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec3 leafColor = vec3(0.15, 0.4, 0.1);
    float vein = abs(sin(centered.x * 20.0 + centered.y * 5.0)) * 0.1;
    leafColor += vein * vec3(0.0, 0.15, 0.0);
    float leafTexture = sin(centered.x * 40.0) * sin(centered.y * 30.0) * 0.03;
    leafColor += leafTexture;

    vec3 col = leafColor;

    float scale = 12.0;
    for (int layer = 0; layer < 3; layer++) {
        float s = scale + float(layer) * 8.0;
        vec2 gridUv = uv * s;
        vec2 cellId = floor(gridUv);

        for (int dy = -1; dy <= 1; dy++) {
            for (int dx = -1; dx <= 1; dx++) {
                vec2 id = cellId + vec2(float(dx), float(dy));
                vec2 h = dewHash2(id + float(layer) * 100.0);

                float birthPhase = h.x * 6.28;
                float growSpeed = 0.1 + h.y * 0.15;
                float maxRadius = 0.15 + h.x * 0.2;
                float radius = min(maxRadius, (sin(iTime * growSpeed + birthPhase) * 0.5 + 0.5) * maxRadius);

                vec2 dropCenter = (id + 0.5 + (h - 0.5) * 0.4) / s;
                vec2 dropUv = uv - dropCenter;
                float dist = length(dropUv * s);

                if (dist < radius * s) {
                    float normalizedDist = dist / (radius * s);
                    float sphereHeight = sqrt(max(0.0, 1.0 - normalizedDist * normalizedDist));

                    vec2 refractOffset = dropUv * (1.0 - sphereHeight * 0.5) * 0.3;
                    vec3 refractedLeaf = leafColor + 0.1 * sin((uv + refractOffset) * 40.0).x;

                    float highlight = pow(max(0.0, 1.0 - length(dropUv * s - vec2(-radius * 0.3, radius * 0.3) * s) / (radius * s * 0.4)), 3.0);
                    float rim = pow(normalizedDist, 4.0) * 0.3;
                    float caustic = pow(sphereHeight, 0.5) * 0.15;

                    float dropMask = smoothstep(radius * s, radius * s * 0.9, dist);
                    vec3 dropColor = refractedLeaf * (1.0 + caustic);
                    dropColor += highlight * vec3(0.8, 0.9, 1.0);
                    dropColor += rim * vec3(0.3, 0.4, 0.35);

                    col = mix(col, dropColor, 1.0 - dropMask);
                }
            }
        }
    }

    fragColor = vec4(col, 1.0);
}
