#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float dbHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    float rotX = hasInput ? (mouseUV.x - 0.5) * 6.0 : iTime * 0.8;
    float rotY = hasInput ? (mouseUV.y - 0.5) * 3.0 : iTime * 0.3;
    vec3 col = vec3(0.02, 0.02, 0.05);

    float spotLight = 0.0;
    for (int i = 0; i < 30; i++) {
        float fi = float(i);
        float theta = fi * 0.4 + rotX;
        float phi = fi * 0.7 + rotY;
        vec2 spotPos = vec2(sin(theta) * cos(phi), sin(phi)) * 0.8;
        spotPos += vec2(sin(fi * 1.3 + iTime * 0.5), cos(fi * 0.9 + iTime * 0.4)) * 0.3;

        float dist = length(uv - spotPos);
        float spot = exp(-dist * dist * 30.0);
        float flicker = max(sin(theta * 3.0 + iTime * 2.0), 0.0);

        vec3 spotColor = 0.5 + 0.5 * cos(6.28 * (fi * 0.1 + vec3(0.0, 0.33, 0.67)));
        col += spotColor * spot * flicker * 0.3;
    }

    float ballDist = length(uv);
    float ballMask = smoothstep(0.15, 0.13, ballDist);
    float facetAngle = atan(uv.y, uv.x) + rotX;
    float facetRing = acos(clamp(ballDist / 0.15, -1.0, 1.0)) + rotY;
    float facetGrid = step(0.5, fract(facetAngle * 4.0)) * step(0.5, fract(facetRing * 3.0));
    float facetSpec = dbHash(floor(vec2(facetAngle * 4.0, facetRing * 3.0)));
    facetSpec = pow(facetSpec, 3.0);

    vec3 ballColor = vec3(0.5, 0.5, 0.55) * (0.3 + facetSpec * 0.7);
    ballColor += facetGrid * 0.1;
    float ballHighlight = pow(max(0.0, 1.0 - length(uv - vec2(-0.04, 0.04)) / 0.1), 3.0) * ballMask;
    ballColor += ballHighlight * 0.5;

    col = mix(col, ballColor, ballMask);

    float centerGlow = exp(-ballDist * 5.0) * 0.1;
    col += centerGlow * vec3(0.5, 0.5, 0.6);

    fragColor = vec4(col, 1.0);
}
