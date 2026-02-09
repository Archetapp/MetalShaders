#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float drHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 drFrame(vec2 uv, float t) {
    vec3 col = vec3(0.0);

    float inner = 0.35;
    vec2 auv = abs(uv);

    bool isFrame = auv.x > inner || auv.y > inner;
    bool inBounds = auv.x < 0.5 && auv.y < 0.5;

    if (isFrame && inBounds) {
        float checker = mod(floor(uv.x * 8.0) + floor(uv.y * 8.0), 2.0);
        vec3 frameCol1 = vec3(0.6, 0.3, 0.1);
        vec3 frameCol2 = vec3(0.4, 0.2, 0.08);
        col = mix(frameCol1, frameCol2, checker);

        float ornament = sin(uv.x * 40.0 + t) * sin(uv.y * 40.0 + t * 0.7) * 0.15;
        col += ornament;

        float frameBorder = smoothstep(0.0, 0.02, min(auv.x - inner, auv.y - inner));
        float outerBorder = smoothstep(0.0, 0.02, min(0.5 - auv.x, 0.5 - auv.y));
        col *= frameBorder * outerBorder * 3.0;
        col += vec3(0.8, 0.6, 0.2) * (1.0 - frameBorder) * 0.5;
    }

    if (!isFrame && inBounds) {
        vec2 innerUV = uv / inner;

        float circles = sin(length(innerUV) * 10.0 - t * 2.0);
        float rays = sin(atan(innerUV.y, innerUV.x) * 6.0 + t);

        vec3 pattern1 = vec3(0.2, 0.4, 0.7);
        vec3 pattern2 = vec3(0.7, 0.3, 0.2);
        vec3 pattern3 = vec3(0.3, 0.7, 0.4);

        col = mix(pattern1, pattern2, circles * 0.5 + 0.5);
        col = mix(col, pattern3, rays * 0.3 + 0.3);

        float stars = pow(drHash(floor(innerUV * 10.0)), 15.0);
        col += vec3(1.0, 0.9, 0.7) * stars;
    }

    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float r = length(uv);
    float theta = atan(uv.y, uv.x);

    float logr = log(max(r, 0.001));
    float scaleRatio = log(3.5);

    float zoom = iTime * 0.3;
    logr += zoom;

    float level = logr / scaleRatio;
    float fractLevel = fract(level);

    float mappedR = exp(fractLevel * scaleRatio - scaleRatio * 0.5);

    float spiralTwist = 0.3;
    float adjustedTheta = theta + level * spiralTwist + iTime * 0.1;

    vec2 mappedUV = mappedR * vec2(cos(adjustedTheta), sin(adjustedTheta));

    vec3 col = drFrame(mappedUV, iTime);

    float fade = smoothstep(0.0, 0.05, r) * smoothstep(2.0, 1.5, r);
    col *= fade;

    float levelShift = floor(level);
    float hueShift = fract(levelShift * 0.1 + iTime * 0.05);
    float cs = cos(hueShift * 6.28318), sn = sin(hueShift * 6.28318);
    mat3 hueRot = mat3(
        0.57 + 0.43 * cs, 0.57 - 0.57 * cs + 0.33 * sn, 0.57 - 0.57 * cs - 0.33 * sn,
        0.57 - 0.57 * cs - 0.33 * sn, 0.57 + 0.43 * cs, 0.57 - 0.57 * cs + 0.33 * sn,
        0.57 - 0.57 * cs + 0.33 * sn, 0.57 - 0.57 * cs - 0.33 * sn, 0.57 + 0.43 * cs
    );
    col = hueRot * col;

    col *= 1.0 - 0.3 * length(uv);
    col = pow(col, vec3(0.95));

    fragColor = vec4(col, 1.0);
}
