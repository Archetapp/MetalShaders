#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float polaroidNoise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.9, 0.88, 0.85);

    float frameW = 0.3, frameH = 0.38;
    float frameMask = step(abs(uv.x), frameW) * step(abs(uv.y + 0.03), frameH);
    col = mix(col, vec3(0.95, 0.93, 0.9), frameMask);

    float borderTop = 0.04, borderSide = 0.03, borderBottom = 0.1;
    float photoW = frameW - borderSide;
    float photoTop = frameH - 0.03 - borderTop;
    float photoBottom = -frameH + 0.03 + borderBottom;
    float photoH = (photoTop - photoBottom) * 0.5;
    float photoY = (photoTop + photoBottom) * 0.5;

    float photoMask = step(abs(uv.x), photoW) * step(abs(uv.y - photoY), photoH);

    vec2 puv = vec2(uv.x / photoW, (uv.y - photoY) / photoH);

    vec3 scene = vec3(0.0);
    float sky = smoothstep(-0.2, 0.5, puv.y);
    scene = mix(vec3(0.2, 0.5, 0.1), vec3(0.4, 0.6, 0.9), sky);
    float sun = smoothstep(0.2, 0.1, length(puv - vec2(0.3, 0.6)));
    scene = mix(scene, vec3(1.0, 0.9, 0.5), sun);
    float hills = smoothstep(-0.1, -0.15, puv.y - 0.05 * sin(puv.x * 5.0));
    scene = mix(scene, vec3(0.15, 0.35, 0.1), hills);
    float tree = step(length((puv - vec2(-0.3, 0.1)) * vec2(1.0, 0.5)), 0.15);
    scene = mix(scene, vec3(0.1, 0.25, 0.05), tree);

    float develop = mod(iTime * 0.15, 1.2);
    float developMask = smoothstep(0.0, 0.8, develop);

    float devNoise = polaroidNoise(puv * 5.0 + iTime * 0.1);
    developMask *= 0.7 + 0.3 * devNoise;
    developMask = clamp(developMask, 0.0, 1.0);

    vec3 undeveloped = vec3(0.85, 0.82, 0.75);
    vec3 developing = mix(undeveloped, scene, developMask);

    float sepia = dot(developing, vec3(0.299, 0.587, 0.114));
    float sepiaAmount = smoothstep(0.6, 1.0, developMask);
    developing = mix(vec3(sepia * 1.1, sepia * 0.9, sepia * 0.7), developing, sepiaAmount);

    developing *= 0.95 + 0.05 * polaroidNoise(gl_FragCoord.xy);

    col = mix(col, developing, photoMask);

    float shadow = frameMask * 0.05;
    col -= shadow * smoothstep(0.0, 0.01, abs(uv.x) - frameW + 0.01);

    fragColor = vec4(col, 1.0);
}
