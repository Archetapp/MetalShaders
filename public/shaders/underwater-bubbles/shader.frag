#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float ubHash(float n) { return fract(sin(n) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec3 waterColor = mix(vec3(0.0, 0.08, 0.15), vec3(0.0, 0.15, 0.3), uv.y + 0.5);
    float caustic = sin(uv.x * 15.0 + iTime) * sin(uv.y * 12.0 + iTime * 0.7) * 0.05;
    waterColor += caustic;

    vec3 col = waterColor;
    for (int i = 0; i < 20; i++) {
        float fi = float(i);
        float speed = 0.1 + ubHash(fi * 1.23) * 0.15;
        float xBase = (i == 0 && hasInput) ? mouseCentered.x : (ubHash(fi * 2.47) - 0.5) * 0.8;
        float wobble = sin(iTime * (1.0 + ubHash(fi * 3.71)) + fi) * 0.03;
        float yPos = mod(-0.6 + iTime * speed + fi * 0.3, 1.4) - 0.7;
        float size = 0.02 + ubHash(fi * 4.93) * 0.03;
        float squash = 1.0 + sin(iTime * 3.0 + fi) * 0.1;

        vec2 bubblePos = vec2(xBase + wobble, yPos);
        vec2 toBubble = uv - bubblePos;
        toBubble.y *= squash;
        float dist = length(toBubble);

        if (dist < size * 1.5) {
            float bubbleMask = smoothstep(size, size * 0.8, dist);
            float normalizedDist = dist / size;
            float sphereZ = sqrt(max(0.0, 1.0 - normalizedDist * normalizedDist));

            vec2 refractUv = uv + toBubble * sphereZ * 0.1;
            vec3 refractedWater = mix(vec3(0.0, 0.08, 0.15), vec3(0.0, 0.2, 0.35), refractUv.y + 0.5);

            float highlight = pow(max(0.0, 1.0 - length(toBubble / size - vec2(-0.3, 0.3)) * 1.5), 3.0);
            float rim = pow(normalizedDist, 6.0) * 0.4;
            float bottomLight = pow(max(0.0, 1.0 - length(toBubble / size - vec2(0.1, -0.25)) * 2.0), 4.0) * 0.3;

            vec3 bubbleColor = refractedWater * 1.2;
            bubbleColor += highlight * vec3(0.7, 0.85, 1.0);
            bubbleColor += rim * vec3(0.3, 0.5, 0.6);
            bubbleColor += bottomLight * vec3(0.4, 0.6, 0.7);

            col = mix(col, bubbleColor, bubbleMask * 0.7);
        }
    }

    float vignette = 1.0 - 0.3 * length(uv);
    col *= vignette;
    fragColor = vec4(col, 1.0);
}
