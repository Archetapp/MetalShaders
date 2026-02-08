#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float saturnNoise(float x) { return fract(sin(x * 127.1) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float tilt = 0.3;
    float rotation = iTime * 0.2;
    vec2 ruv = vec2(uv.x * cos(rotation) - uv.y * sin(rotation),
                    uv.x * sin(rotation) + uv.y * cos(rotation));

    vec3 col = vec3(0.005, 0.005, 0.02);

    float planetR = 0.15;
    vec2 planetUV = ruv;
    planetUV.y /= cos(tilt * 0.3);
    float planetDist = length(planetUV);
    float planet = smoothstep(planetR + 0.002, planetR - 0.002, planetDist);

    vec3 planetCol = mix(vec3(0.8, 0.7, 0.5), vec3(0.6, 0.5, 0.35), ruv.y / planetR * 0.5 + 0.5);
    float bands = sin(ruv.y * 80.0) * 0.1;
    planetCol += bands;
    col = mix(col, planetCol, planet);

    float ringInner = 0.2;
    float ringOuter = 0.42;
    vec2 ringUV = vec2(ruv.x, ruv.y / (0.3 + 0.05 * sin(iTime * 0.5)));
    float ringR = length(ringUV);
    float ringMask = smoothstep(ringInner, ringInner + 0.01, ringR) *
                     smoothstep(ringOuter + 0.01, ringOuter, ringR);

    float ringDensity = 0.0;
    float r = ringR;
    ringDensity += smoothstep(0.01, 0.0, abs(r - 0.22)) * 0.5;
    ringDensity += smoothstep(0.02, 0.0, abs(r - 0.26)) * 0.7;
    ringDensity += smoothstep(0.03, 0.0, abs(r - 0.31)) * 0.9;
    ringDensity += smoothstep(0.02, 0.0, abs(r - 0.36)) * 0.6;
    ringDensity += smoothstep(0.015, 0.0, abs(r - 0.4)) * 0.4;

    float cassiniGap = smoothstep(0.005, 0.0, abs(r - 0.285));
    ringDensity *= 1.0 - cassiniGap * 0.8;

    float ringParticles = saturnNoise(floor(atan(ringUV.y, ringUV.x) * 100.0) + floor(r * 200.0));
    ringDensity *= 0.8 + 0.2 * ringParticles;

    vec3 ringCol = mix(vec3(0.7, 0.65, 0.55), vec3(0.85, 0.8, 0.7), (r - ringInner) / (ringOuter - ringInner));

    float shadow = 1.0 - smoothstep(-0.01, 0.01, ringUV.x) * smoothstep(planetR * 0.9, planetR * 1.1, ringR) *
                   step(ringUV.y, 0.05) * step(-0.05, ringUV.y) * 0.5;
    ringCol *= shadow;

    bool inFront = ruv.y < 0.0;
    if (inFront) {
        col = mix(col, ringCol, ringMask * ringDensity);
    } else {
        float behindPlanet = 1.0 - planet;
        col = mix(col, ringCol, ringMask * ringDensity * behindPlanet);
    }

    fragColor = vec4(col, 1.0);
}
