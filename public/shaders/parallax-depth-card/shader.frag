#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float pdcHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float pdcNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(pdcHash(i), pdcHash(i + vec2(1, 0)), f.x),
               mix(pdcHash(i + vec2(0, 1)), pdcHash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float tiltX = hasInput ? (mouseUV.x - 0.5) * 0.6 : sin(iTime * 0.5) * 0.3;
    float tiltY = hasInput ? (mouseUV.y - 0.5) * 0.4 : cos(iTime * 0.7) * 0.2;

    vec3 bgColor = vec3(0.08, 0.06, 0.15);
    float bgStars = pdcHash(floor(uv * 100.0));
    bgStars = pow(bgStars, 20.0) * 2.0;
    vec3 col = bgColor + bgStars;

    vec2 layer1Uv = centered + vec2(tiltX, tiltY) * 0.05;
    float nebula = pdcNoise(layer1Uv * 2.0 + iTime * 0.02);
    nebula += pdcNoise(layer1Uv * 4.0 - iTime * 0.03) * 0.5;
    vec3 nebulaColor = mix(vec3(0.1, 0.0, 0.2), vec3(0.0, 0.1, 0.3), nebula);
    col += nebulaColor * 0.3;

    vec2 layer2Uv = centered + vec2(tiltX, tiltY) * 0.15;
    float ring1 = abs(length(layer2Uv - vec2(0.2, 0.1)) - 0.3);
    ring1 = smoothstep(0.02, 0.0, ring1);
    float ring2 = abs(length(layer2Uv + vec2(0.1, 0.2)) - 0.2);
    ring2 = smoothstep(0.015, 0.0, ring2);
    col += ring1 * vec3(0.3, 0.5, 1.0) * 0.6;
    col += ring2 * vec3(1.0, 0.3, 0.5) * 0.5;

    vec2 layer3Uv = centered + vec2(tiltX, tiltY) * 0.3;
    float shape1 = smoothstep(0.12, 0.1, length(layer3Uv - vec2(-0.3, 0.2)));
    float shape2 = smoothstep(0.08, 0.06, length(layer3Uv - vec2(0.25, -0.15)));
    float shape3 = smoothstep(0.15, 0.13, length(layer3Uv));
    col = mix(col, vec3(0.2, 0.6, 1.0), shape1 * 0.8);
    col = mix(col, vec3(1.0, 0.4, 0.2), shape2 * 0.8);
    col = mix(col, vec3(0.9, 0.8, 0.3), shape3 * 0.6);

    vec2 layer4Uv = centered + vec2(tiltX, tiltY) * 0.5;
    for (int i = 0; i < 5; i++) {
        vec2 particlePos = vec2(
            sin(float(i) * 2.4 + iTime * 0.3) * 0.4,
            cos(float(i) * 1.7 + iTime * 0.2) * 0.3
        );
        float particle = smoothstep(0.04, 0.02, length(layer4Uv - particlePos));
        vec3 particleColor = 0.5 + 0.5 * cos(6.28 * (float(i) * 0.2 + vec3(0.0, 0.33, 0.67)));
        col += particle * particleColor * 0.7;
    }

    vec2 layer5Uv = centered + vec2(tiltX, tiltY) * 0.7;
    float grid = smoothstep(0.01, 0.0, abs(fract(layer5Uv.x * 5.0) - 0.5) - 0.48) +
                 smoothstep(0.01, 0.0, abs(fract(layer5Uv.y * 5.0) - 0.5) - 0.48);
    col += grid * vec3(0.15, 0.2, 0.3) * 0.3;

    float shadow = smoothstep(0.0, 0.1, length(vec2(tiltX, tiltY))) * 0.2;
    col *= 1.0 - shadow * (0.5 + 0.5 * dot(normalize(centered), normalize(vec2(tiltX, tiltY))));

    float cardMask = smoothstep(0.0, 0.02, 0.85 - max(abs(centered.x / (iResolution.x / iResolution.y)), abs(centered.y)));
    col *= cardMask;
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
