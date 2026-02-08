#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float svpHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 vortexCenter = hasInput ? mouseCentered : vec2(sin(iMouseTime * 0.3) * 0.1, cos(iMouseTime * 0.2) * 0.1);
    vec2 toCenter = uv - vortexCenter;
    float dist = length(toCenter);
    float angle = atan(toCenter.y, toCenter.x);

    float swirlStrength = 3.0 * exp(-dist * 2.0);
    float swirlAngle = angle + swirlStrength - iMouseTime * 1.5;

    vec2 swirlUv = vec2(cos(swirlAngle), sin(swirlAngle)) * dist;

    float spiralArms = sin(swirlAngle * 4.0 - dist * 15.0 + iMouseTime * 2.0) * 0.5 + 0.5;
    spiralArms = pow(spiralArms, 2.0);

    float innerGlow = exp(-dist * 5.0);
    float eventHorizon = smoothstep(0.08, 0.05, dist);

    float ring1 = exp(-pow(dist - 0.15, 2.0) * 200.0);
    float ring2 = exp(-pow(dist - 0.25, 2.0) * 150.0);
    float ring3 = exp(-pow(dist - 0.4, 2.0) * 80.0);

    vec3 portalColor1 = vec3(0.2, 0.1, 0.5);
    vec3 portalColor2 = vec3(0.0, 0.4, 0.8);
    vec3 portalColor3 = vec3(0.1, 0.8, 0.6);

    vec3 col = vec3(0.02, 0.01, 0.05);
    col += spiralArms * mix(portalColor1, portalColor2, dist * 2.0) * (1.0 - eventHorizon);
    col += ring1 * portalColor3 * 0.8;
    col += ring2 * portalColor2 * 0.5;
    col += ring3 * portalColor1 * 0.3;
    col += innerGlow * vec3(0.5, 0.3, 0.8) * 0.5;

    float stars = svpHash(floor(swirlUv * 30.0));
    stars = pow(stars, 25.0) * 3.0 * (1.0 - innerGlow);
    col += stars * vec3(0.8, 0.9, 1.0);

    vec3 portalInside = mix(vec3(0.1, 0.0, 0.3), vec3(0.3, 0.1, 0.5), sin(iMouseTime * 2.0 + dist * 10.0) * 0.5 + 0.5);
    col = mix(col, portalInside, eventHorizon);

    float edgeDistort = exp(-pow(dist - 0.1, 2.0) * 50.0);
    col += edgeDistort * vec3(0.4, 0.2, 0.8) * 0.4;

    col = pow(col, vec3(0.85));
    fragColor = vec4(col, 1.0);
}
