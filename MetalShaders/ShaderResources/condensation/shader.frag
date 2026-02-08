#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float condHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 condHash2(vec2 p) { return vec2(condHash(p), condHash(p + vec2(37.0, 91.0))); }

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec3 behindGlass = vec3(0.15, 0.2, 0.25);
    behindGlass += 0.05 * sin(centered.x * 3.0 + iTime * 0.1);

    vec3 col = behindGlass;
    float totalDroplet = 0.0;

    for (float scale = 20.0; scale <= 60.0; scale += 20.0) {
        vec2 gridUv = uv * scale;
        vec2 cellId = floor(gridUv);
        vec2 cellLocal = fract(gridUv) - 0.5;

        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                vec2 neighbor = vec2(float(x), float(y));
                vec2 id = cellId + neighbor;
                vec2 h = condHash2(id);

                float birthTime = h.x * 10.0;
                float alive = smoothstep(birthTime, birthTime + 0.5, iTime);
                float maxSize = 0.1 + h.y * 0.3;
                float growRate = 0.02 + h.x * 0.03;
                float size = min(maxSize, (iTime - birthTime) * growRate) * alive;

                vec2 offset = (h - 0.5) * 0.6;
                vec2 dropPos = neighbor + offset - cellLocal;
                float dist = length(dropPos);

                float droplet = smoothstep(size, size * 0.3, dist);
                float highlight = smoothstep(size * 0.6, size * 0.2, length(dropPos - vec2(-0.05, 0.05) * size * 5.0));

                float refract = droplet * 0.02;
                vec3 refractedBg = vec3(0.15, 0.2, 0.25) + 0.08 * sin((centered.x + refract) * 5.0);

                col = mix(col, refractedBg * 1.1, droplet * 0.3);
                col += highlight * vec3(0.4, 0.45, 0.5) * droplet;
                totalDroplet = max(totalDroplet, droplet);
            }
        }
    }

    float fogLayer = 0.3 + 0.1 * sin(centered.y * 2.0 + iTime * 0.1);
    col = mix(col, vec3(0.6, 0.65, 0.7), fogLayer * (1.0 - totalDroplet));

    float condenseMicro = condHash(floor(uv * 200.0)) * 0.05;
    col += condenseMicro * (1.0 - totalDroplet);

    fragColor = vec4(col, 1.0);
}
