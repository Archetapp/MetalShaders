#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    uv.y += 0.1;
    float t = iTime * 0.3;

    vec3 skyTop = vec3(0.05, 0.0, 0.15);
    vec3 skyMid = vec3(0.4, 0.0, 0.3);
    vec3 skyBot = vec3(0.95, 0.3, 0.1);
    float skyGrad = uv.y + 0.3;
    vec3 sky;
    if (skyGrad > 0.5) {
        sky = mix(skyMid, skyTop, (skyGrad - 0.5) * 2.0);
    } else {
        sky = mix(skyBot, skyMid, skyGrad * 2.0);
    }

    float horizon = -0.05;

    vec2 sunCenter = vec2(0.0, horizon + 0.2 - mod(t * 0.1, 0.4));
    float sunDist = length(uv - sunCenter);
    float sun = smoothstep(0.22, 0.2, sunDist);

    float bandY = (uv.y - sunCenter.y) / 0.22;
    float bands = step(0.0, sin(bandY * 25.0));
    float bandMask = smoothstep(0.0, -0.15, uv.y - sunCenter.y);
    sun *= mix(1.0, bands, bandMask);

    vec3 sunColor = mix(vec3(1.0, 0.9, 0.2), vec3(1.0, 0.2, 0.4), clamp(-bandY * 0.5 + 0.5, 0.0, 1.0));
    vec3 col = mix(sky, sunColor, sun);

    col += vec3(1.0, 0.3, 0.5) * exp(-sunDist * 3.0) * 0.4;

    if (uv.y < horizon) {
        float depth = (horizon - uv.y);
        float perspZ = 0.5 / depth;
        float perspX = uv.x * perspZ;

        float scrollZ = perspZ - t * 2.0;

        float gridX = abs(fract(perspX * 0.5) - 0.5);
        float gridZ = abs(fract(scrollZ * 0.15) - 0.5);

        float lineX = smoothstep(0.02, 0.0, gridX);
        float lineZ = smoothstep(0.02, 0.0, gridZ);
        float grid = max(lineX, lineZ);

        float fade = exp(-depth * 3.0);
        vec3 gridColor = vec3(0.8, 0.1, 0.8) * grid * fade;

        vec3 floorColor = vec3(0.02, 0.0, 0.05);
        col = floorColor + gridColor;

        vec3 sunReflect = sunColor * exp(-abs(uv.x) * 5.0) * 0.3 * fade;
        col += sunReflect;

        float horizonGlow = exp(-depth * 15.0);
        col += vec3(0.8, 0.2, 0.5) * horizonGlow * 0.5;
    }

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
