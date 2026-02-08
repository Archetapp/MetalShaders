#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float magnetHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 magnetHash2(vec2 p) {
    return vec2(fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453),
                fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453));
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    float aspect = iResolution.x / iResolution.y;
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

    vec2 attractor = vec2(
        0.3 * cos(iTime * 0.5) * sin(iTime * 0.3),
        0.3 * sin(iTime * 0.4) * cos(iTime * 0.2)
    );

    vec2 attractor2 = vec2(
        0.2 * cos(iTime * 0.7 + 2.0),
        0.2 * sin(iTime * 0.6 + 1.0)
    );

    vec3 col = vec3(0.01, 0.01, 0.02);

    float glow1 = exp(-length(p - attractor) * 8.0) * 0.3;
    float glow2 = exp(-length(p - attractor2) * 8.0) * 0.2;
    col += vec3(0.3, 0.5, 1.0) * glow1;
    col += vec3(1.0, 0.3, 0.5) * glow2;

    float totalBrightness = 0.0;
    vec3 particleColor = vec3(0.0);

    for (int i = 0; i < 200; i++) {
        float id = float(i);
        vec2 seed = vec2(id * 0.73, id * 1.37);

        vec2 basePos = magnetHash2(seed) * 2.0 - 1.0;
        basePos *= 0.6;

        float angle = atan(basePos.y - attractor.y, basePos.x - attractor.x);
        float dist = length(basePos - attractor);

        float orbitSpeed = 1.0 / (dist + 0.1);
        float currentAngle = angle + iTime * orbitSpeed * 0.3 + id * 0.1;

        float spiralFactor = 0.02 * sin(iTime * 0.5 + id);
        float currentDist = dist + spiralFactor;
        currentDist *= 0.5 + 0.5 * sin(iTime * 0.2 + id * 0.5);
        currentDist = max(currentDist, 0.02);

        vec2 particlePos = attractor + vec2(cos(currentAngle), sin(currentAngle)) * currentDist;

        float dist2 = length(basePos - attractor2);
        float influence2 = exp(-dist2 * 3.0) * 0.3;
        vec2 toAttractor2 = normalize(attractor2 - particlePos);
        particlePos += toAttractor2 * influence2 * 0.1 * sin(iTime + id);

        float d = length(p - particlePos);
        float size = 0.002 + magnetHash(seed * 3.0) * 0.003;
        float brightness = smoothstep(size * 3.0, 0.0, d);
        brightness *= 0.5 + 0.5 * sin(iTime * 2.0 + id * 0.7);

        float hue = fract(id * 0.13 + iTime * 0.05);
        vec3 pCol;
        if (hue < 0.33) {
            pCol = mix(vec3(0.3, 0.5, 1.0), vec3(0.5, 0.3, 1.0), hue * 3.0);
        } else if (hue < 0.66) {
            pCol = mix(vec3(0.5, 0.3, 1.0), vec3(1.0, 0.3, 0.6), (hue - 0.33) * 3.0);
        } else {
            pCol = mix(vec3(1.0, 0.3, 0.6), vec3(0.3, 0.5, 1.0), (hue - 0.66) * 3.0);
        }

        particleColor += pCol * brightness;
        totalBrightness += brightness;
    }

    col += particleColor * 1.5;

    for (int i = 0; i < 50; i++) {
        float id = float(i) + 200.0;
        vec2 seed = vec2(id * 0.53, id * 1.17);
        vec2 basePos = magnetHash2(seed) * 2.0 - 1.0;
        basePos *= 0.4;

        float angle = atan(basePos.y - attractor2.y, basePos.x - attractor2.x);
        float dist = length(basePos - attractor2);
        float orbitSpeed = 1.0 / (dist + 0.1);
        float currentAngle = angle - iTime * orbitSpeed * 0.4 + id * 0.1;
        float currentDist = dist * (0.3 + 0.7 * sin(iTime * 0.3 + id * 0.3));
        currentDist = max(currentDist, 0.015);

        vec2 particlePos = attractor2 + vec2(cos(currentAngle), sin(currentAngle)) * currentDist;

        float d = length(p - particlePos);
        float size = 0.003;
        float brightness = smoothstep(size * 2.5, 0.0, d) * 0.7;

        col += vec3(1.0, 0.5, 0.7) * brightness;
    }

    col += vec3(0.05, 0.08, 0.15) * (1.0 - length(p) * 0.8);

    col = 1.0 - exp(-col * 2.0);

    fragColor = vec4(col, 1.0);
}
