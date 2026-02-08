#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 pokePos = vec2(sin(iTime*0.6)*0.2, cos(iTime*0.5)*0.15);
    float gridSize = 15.0;
    vec2 gridUv = uv * gridSize;
    vec2 cellId = floor(gridUv);
    vec2 cellLocal = fract(gridUv) - 0.5;

    float distToPoke = length(cellId/gridSize - pokePos);
    float pokePower = exp(-distToPoke*distToPoke*8.0);
    float wave = sin(distToPoke*20.0 - iTime*4.0) * pokePower * 0.3;
    float wave2 = sin(distToPoke*15.0 - iTime*3.0 + 1.0) * pokePower * 0.15;

    vec2 displacement = normalize(cellId/gridSize - pokePos + 0.001) * (wave + wave2);
    float jiggle = sin(iTime*8.0 + cellId.x*2.0 + cellId.y*3.0) * pokePower * 0.1;
    displacement += vec2(jiggle, jiggle*0.7);

    vec2 movedLocal = cellLocal - displacement;

    float nodeSize = 0.08 + pokePower * 0.04;
    float node = smoothstep(nodeSize, nodeSize*0.5, length(movedLocal));

    float springH = smoothstep(0.04, 0.0, abs(movedLocal.y - displacement.y*0.5));
    springH *= step(-0.5, movedLocal.x) * step(movedLocal.x, 0.5);
    float springV = smoothstep(0.04, 0.0, abs(movedLocal.x - displacement.x*0.5));
    springV *= step(-0.5, movedLocal.y) * step(movedLocal.y, 0.5);

    float height = wave + wave2;
    vec3 col = vec3(0.05, 0.05, 0.08);
    vec3 nodeColor = mix(vec3(0.2, 0.5, 0.8), vec3(0.8, 0.3, 0.2), pokePower);
    vec3 springColor = vec3(0.15, 0.3, 0.5);

    col = mix(col, springColor * 0.5, max(springH, springV) * 0.5);
    col = mix(col, nodeColor, node);
    col += node * height * vec3(0.3, 0.5, 0.8);

    float glow = exp(-distToPoke * 3.0) * 0.1;
    col += glow * vec3(0.2, 0.4, 0.7);

    fragColor = vec4(col, 1.0);
}
