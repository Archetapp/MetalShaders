#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    vec3 col = vec3(0.0);

    float horizonY = 0.0;

    if (uv.y > horizonY + 0.15) {
        float t = (uv.y - horizonY) / 0.5;
        col = mix(vec3(1.0, 0.3, 0.5), vec3(0.2, 0.0, 0.4), t);
    } else if (uv.y > horizonY) {
        float t = (uv.y - horizonY) / 0.15;
        col = mix(vec3(1.0, 0.5, 0.2), vec3(1.0, 0.3, 0.5), t);
    }

    float sunY = horizonY + 0.12;
    float sunDist = length(uv - vec2(0.0, sunY));
    float sun = smoothstep(0.1, 0.09, sunDist);
    float sunBands = step(0.5, fract(uv.y * 30.0));
    sun *= 1.0 - sunBands * 0.3 * step(uv.y, sunY);
    col = mix(col, vec3(1.0, 0.8, 0.2), sun);
    col += vec3(1.0, 0.3, 0.1) * exp(-sunDist * 5.0) * 0.3;

    float mtX = uv.x;
    float mt1 = horizonY + 0.02 + 0.08 * exp(-mtX * mtX * 8.0) + 0.03 * sin(mtX * 8.0);
    float mt2 = horizonY + 0.01 + 0.06 * exp(-(mtX - 0.2) * (mtX - 0.2) * 6.0) + 0.02 * sin(mtX * 12.0);
    float mountain = max(step(uv.y, mt1), step(uv.y, mt2)) * step(horizonY, uv.y);
    col = mix(col, vec3(0.15, 0.0, 0.2), mountain);

    if (uv.y < horizonY) {
        float depth = -0.3 / (uv.y - horizonY + 0.001);
        float roadX = uv.x;
        float roadWidth = 0.3 / depth;

        float isRoad = step(abs(roadX), roadWidth);

        float stripeZ = depth - iTime * 5.0;
        float stripes = step(0.5, fract(stripeZ * 0.3));
        float centerLine = step(abs(roadX), 0.005 / depth) * stripes;

        float edgeLine = smoothstep(0.003, 0.001, abs(abs(roadX) - roadWidth)) / depth * 2.0;

        float fade = exp((uv.y - horizonY) * 3.0);

        vec3 groundCol = mix(vec3(0.4, 0.1, 0.3), vec3(0.2, 0.0, 0.15), stripes) * fade;
        vec3 roadCol = vec3(0.1, 0.05, 0.1) * fade;

        col = mix(groundCol, roadCol, isRoad);
        col += vec3(1.0, 1.0, 1.0) * centerLine * fade;
        col += vec3(1.0, 0.3, 0.5) * edgeLine * fade;

        float gridZ = smoothstep(0.02, 0.0, abs(fract(stripeZ * 0.15) - 0.5) - 0.48);
        col += vec3(0.5, 0.1, 0.3) * gridZ * fade * (1.0 - isRoad) * 0.3;
    }

    fragColor = vec4(col, 1.0);
}
