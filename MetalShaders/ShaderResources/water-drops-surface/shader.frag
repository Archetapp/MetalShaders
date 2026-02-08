#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dropHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 dropHash2(vec2 p) {
    return vec2(fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453),
                fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453));
}

float dropNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = dropHash(i);
    float b = dropHash(i + vec2(1.0, 0.0));
    float c = dropHash(i + vec2(0.0, 1.0));
    float d = dropHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

vec3 dropSurfacePattern(vec2 uv) {
    vec3 col1 = vec3(0.2, 0.22, 0.25);
    vec3 col2 = vec3(0.18, 0.19, 0.22);
    float n = dropNoise(uv * 5.0);
    vec3 surface = mix(col1, col2, n);

    float brushX = sin(uv.x * 200.0 + uv.y * 3.0) * 0.01;
    float brushY = sin(uv.y * 150.0 + uv.x * 5.0) * 0.005;
    surface += vec3(brushX + brushY);

    return surface;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 uvAspect = vec2(uv.x * aspect, uv.y);

    vec3 surface = dropSurfacePattern(uv);

    float gridSize = 6.0;
    vec3 totalColor = surface;
    float totalDropMask = 0.0;

    for (int gx = -1; gx <= int(gridSize * aspect) + 1; gx++) {
        for (int gy = -1; gy <= int(gridSize) + 1; gy++) {
            vec2 cell = vec2(float(gx), float(gy));
            vec2 cellHash = dropHash2(cell + 100.0);

            float growCycle = 8.0 + cellHash.x * 4.0;
            float phase = fract(iTime / growCycle + cellHash.y);

            float maxRadius = 0.03 + cellHash.x * 0.04;
            float radius = maxRadius * smoothstep(0.0, 0.6, phase);

            if (phase > 0.9) {
                radius *= smoothstep(1.0, 0.9, phase);
            }

            vec2 dropCenter = (cell + 0.3 + cellHash * 0.4) / gridSize;
            dropCenter.x /= aspect;

            float wobble = sin(iTime * 0.5 + cellHash.x * 6.28) * 0.002;
            dropCenter += vec2(wobble, wobble * 0.5);

            vec2 diff = uv - dropCenter;
            diff.x *= aspect;
            float dist = length(diff);

            if (dist < radius) {
                float normalizedDist = dist / radius;
                float height = sqrt(max(1.0 - normalizedDist * normalizedDist, 0.0));

                vec2 normal = vec2(diff.x, diff.y) / radius;
                float normalLen = length(normal);
                vec3 normal3d = vec3(normal * 0.8, height);
                normal3d = normalize(normal3d);

                vec2 refractOffset = normal3d.xy * 0.02 * height;
                vec2 refractedUv = uv + refractOffset;
                vec3 refractedSurface = dropSurfacePattern(refractedUv);

                refractedSurface *= 1.1;

                vec3 lightDir = normalize(vec3(0.3, 0.5, 1.0));
                float diffuseLight = max(dot(normal3d, lightDir), 0.0);

                vec3 viewDir = vec3(0.0, 0.0, 1.0);
                vec3 halfVec = normalize(lightDir + viewDir);
                float specular = pow(max(dot(normal3d, halfVec), 0.0), 64.0);

                float fresnel = pow(1.0 - max(dot(normal3d, viewDir), 0.0), 3.0);

                vec3 dropColor = refractedSurface * (0.7 + diffuseLight * 0.3);
                dropColor += vec3(1.0, 1.0, 0.95) * specular * 0.8;
                dropColor += vec3(0.6, 0.7, 0.8) * fresnel * 0.3;

                float edgeHighlight = smoothstep(0.8, 1.0, normalizedDist) * 0.2;
                dropColor += vec3(0.5, 0.55, 0.6) * edgeHighlight;

                float contactShadow = smoothstep(radius * 1.2, radius * 0.8, dist + 0.005);
                float dropMask = smoothstep(radius, radius - 0.002, dist);

                totalColor = mix(totalColor, dropColor, dropMask);
                totalDropMask = max(totalDropMask, dropMask);

                if (dropMask < 0.1) {
                    totalColor -= vec3(0.03) * contactShadow * (1.0 - dropMask);
                }
            } else if (dist < radius * 1.3) {
                float shadow = smoothstep(radius * 1.3, radius, dist) * 0.08;
                totalColor -= vec3(shadow);
            }
        }
    }

    float ambient = 0.95 + dropNoise(uv * 3.0 + iTime * 0.01) * 0.05;
    totalColor *= ambient;

    float vignette = 1.0 - length((uv - 0.5) * 1.1);
    totalColor *= smoothstep(0.0, 0.8, vignette);

    fragColor = vec4(totalColor, 1.0);
}
