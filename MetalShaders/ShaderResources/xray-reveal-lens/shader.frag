#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float xrlHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float xrlNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(xrlHash(i), xrlHash(i + vec2(1, 0)), f.x),
               mix(xrlHash(i + vec2(0, 1)), xrlHash(i + vec2(1, 1)), f.x), f.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 lensPos = vec2(sin(iTime * 0.5) * 0.3, cos(iTime * 0.4) * 0.25);
    float lensRadius = 0.2;

    vec3 surfaceColor = vec3(0.15, 0.12, 0.1);
    float woodGrain = sin(uv.x * 20.0 + xrlNoise(uv * 5.0) * 3.0) * 0.5 + 0.5;
    surfaceColor += woodGrain * vec3(0.08, 0.05, 0.02);
    float plank = smoothstep(0.01, 0.0, abs(fract(uv.y * 4.0) - 0.5) - 0.48);
    surfaceColor += plank * 0.03;

    vec3 xrayColor = vec3(0.0);
    float skeleton = 0.0;

    float spine = smoothstep(0.03, 0.0, abs(uv.x));
    skeleton += spine;
    for (int i = -3; i <= 3; i++) {
        float ribY = float(i) * 0.08;
        float ribCurve = abs(uv.x) * 3.0;
        float rib = smoothstep(0.015, 0.0, abs(uv.y - ribY - ribCurve * ribCurve * 0.5 * sign(float(i))));
        rib *= smoothstep(0.3, 0.0, abs(uv.x));
        skeleton += rib;
    }
    float skull = smoothstep(0.12, 0.1, length(uv - vec2(0.0, 0.35)));
    float eyeL = smoothstep(0.03, 0.02, length(uv - vec2(-0.04, 0.38)));
    float eyeR = smoothstep(0.03, 0.02, length(uv - vec2(0.04, 0.38)));
    skull -= eyeL + eyeR;
    skeleton += max(skull, 0.0);

    xrayColor = vec3(0.0, 0.15, 0.1) + skeleton * vec3(0.6, 0.8, 0.7);
    float scanLine = sin(uv.y * 200.0 + iTime * 5.0) * 0.03;
    xrayColor += scanLine;
    xrayColor += xrlNoise(uv * 50.0 + iTime) * 0.03;

    float lensDist = length(uv - lensPos);
    float lensMask = smoothstep(lensRadius, lensRadius - 0.02, lensDist);

    float lensDistort = smoothstep(lensRadius, 0.0, lensDist) * 0.3;
    vec2 lensUv = uv + normalize(uv - lensPos) * lensDistort * 0.05;

    vec3 col = mix(surfaceColor, xrayColor, lensMask);

    float lensEdge = smoothstep(lensRadius - 0.02, lensRadius - 0.01, lensDist) *
                     smoothstep(lensRadius + 0.01, lensRadius, lensDist);
    col += lensEdge * vec3(0.3, 0.4, 0.35) * 0.5;

    float lensRim = smoothstep(lensRadius + 0.01, lensRadius, lensDist) *
                    smoothstep(lensRadius - 0.015, lensRadius - 0.005, lensDist);
    col += lensRim * vec3(0.5, 0.55, 0.5);

    float lensGlare = pow(max(0.0, 1.0 - lensDist / lensRadius), 8.0) * lensMask * 0.1;
    col += lensGlare * vec3(0.3, 0.5, 0.4);

    fragColor = vec4(col, 1.0);
}
