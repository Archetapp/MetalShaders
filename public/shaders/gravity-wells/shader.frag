#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float gwHash(float n) { return fract(sin(n)*43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x, iResolution.y) / min(iResolution.x, iResolution.y);

    vec2 wells[3];
    wells[0] = hasInput ? mouseCentered : vec2(sin(iTime*0.3)*0.25, cos(iTime*0.4)*0.2);
    wells[1] = vec2(sin(iTime*0.4+2.0)*0.3, cos(iTime*0.3+1.0)*0.25);
    wells[2] = vec2(sin(iTime*0.25+4.0)*0.2, cos(iTime*0.35+3.0)*0.3);

    vec3 col = vec3(0.01, 0.01, 0.02);

    for (int w = 0; w < 3; w++) {
        float wellDist = length(uv - wells[w]);
        float wellGlow = 0.01 / (wellDist*wellDist + 0.01);
        vec3 wellColor = w == 0 ? vec3(0.3,0.1,0.5) : w == 1 ? vec3(0.1,0.3,0.5) : vec3(0.5,0.2,0.1);
        col += wellColor * wellGlow * 0.02;

        float gridWarp = sin(wellDist * 30.0 - iTime) * exp(-wellDist * 3.0) * 0.03;
        col += abs(gridWarp) * wellColor * 0.5;
    }

    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        float seed = fi * 1.618;
        vec2 pos = vec2(gwHash(seed) - 0.5, gwHash(seed + 100.0) - 0.5) * 0.8;
        vec2 vel = vec2(gwHash(seed + 200.0) - 0.5, gwHash(seed + 300.0) - 0.5) * 0.3;

        for (int step = 0; step < 20; step++) {
            vec2 accel = vec2(0.0);
            for (int w = 0; w < 3; w++) {
                vec2 toWell = wells[w] - pos;
                float dist = max(length(toWell), 0.02);
                accel += normalize(toWell) * 0.001 / (dist * dist);
            }
            vel += accel;
            vel *= 0.99;
            pos += vel * 0.05;
        }

        float particleDist = length(uv - pos);
        float glow = exp(-particleDist * 100.0) * 0.5;
        float core = exp(-particleDist * 300.0) * 1.0;

        float hue = gwHash(seed + 400.0);
        vec3 pColor = 0.5 + 0.5 * cos(6.28*(hue + vec3(0.0,0.33,0.67)));
        col += pColor * glow + vec3(1.0) * core;
    }

    col = pow(col, vec3(0.85));
    fragColor = vec4(col, 1.0);
}
