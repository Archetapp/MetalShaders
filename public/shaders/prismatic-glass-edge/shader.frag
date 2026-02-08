#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float pgeHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 centered = uv * 2.0 - 1.0;
    centered.x *= iResolution.x / iResolution.y;

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float tiltX = hasInput ? (mouseUV.x - 0.5) * 0.8 : sin(iTime * 0.6) * 0.4;
    float tiltY = hasInput ? (mouseUV.y - 0.5) * 0.6 : cos(iTime * 0.8) * 0.3;
    vec3 viewDir = normalize(vec3(tiltX, tiltY, 1.0));

    float cardW = 0.7;
    float cardH = 0.9;
    vec2 cardDist = abs(centered) - vec2(cardW, cardH);
    float cardSdf = max(cardDist.x, cardDist.y);

    float bevelWidth = 0.08;
    float bevel = smoothstep(0.0, -bevelWidth, cardSdf);
    float innerCard = smoothstep(-bevelWidth, -bevelWidth - 0.01, cardSdf);
    float bevelOnly = bevel - innerCard;

    vec2 edgeDir = normalize(max(cardDist, 0.0) + 0.001);
    vec3 bevelNormal = normalize(vec3(edgeDir * bevelOnly, 1.0 - bevelOnly * 0.5));

    float chromaticStr = bevelOnly * 0.03;
    vec2 refractR = centered + viewDir.xy * chromaticStr * 1.0;
    vec2 refractG = centered + viewDir.xy * chromaticStr * 0.5;
    vec2 refractB = centered + viewDir.xy * chromaticStr * 0.0;

    float patternR = sin(refractR.x * 30.0 + iTime) * sin(refractR.y * 20.0) * 0.5 + 0.5;
    float patternG = sin(refractG.x * 30.0 + iTime) * sin(refractG.y * 20.0) * 0.5 + 0.5;
    float patternB = sin(refractB.x * 30.0 + iTime) * sin(refractB.y * 20.0) * 0.5 + 0.5;

    vec3 glassBase = vec3(0.92, 0.94, 0.96);
    vec3 contentColor = vec3(patternR, patternG, patternB);

    vec3 lightDir = normalize(vec3(tiltX * 2.0, tiltY * 2.0, 1.5));
    float spec = pow(max(dot(reflect(-lightDir, bevelNormal), viewDir), 0.0), 64.0);
    float fresnel = pow(1.0 - max(dot(bevelNormal, viewDir), 0.0), 4.0);

    float dispersion = dot(bevelNormal.xy, viewDir.xy) * 3.0;
    vec3 rainbow = 0.5 + 0.5 * cos(6.28318 * (dispersion + vec3(0.0, 0.33, 0.67)));

    vec3 col = mix(contentColor * 0.3, glassBase, 0.5) * innerCard;
    col += rainbow * bevelOnly * 0.6;
    col += spec * vec3(1.0) * 0.8;
    col += fresnel * vec3(0.8, 0.85, 1.0) * 0.3;
    col *= bevel;

    float edgeHighlight = smoothstep(0.01, -0.01, cardSdf) - smoothstep(-0.005, -0.015, cardSdf);
    col += edgeHighlight * vec3(1.0) * 0.3;

    float shadow = smoothstep(0.02, 0.06, cardSdf);
    vec3 bg = vec3(0.1, 0.1, 0.12);
    col = mix(col, bg * (1.0 - shadow * 0.3), 1.0 - bevel);

    col = pow(col, vec3(0.95));
    fragColor = vec4(col, 1.0);
}
