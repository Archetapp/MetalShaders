#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float dwHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 pokePoint = hasInput ? mouseCentered : vec2(sin(iMouseTime * 0.6) * 0.25, cos(iMouseTime * 0.5) * 0.2);
    vec2 toPoint = uv - pokePoint;
    float dist = length(toPoint);
    float pokeRadius = 0.25;
    float pokeStrength = 0.15;
    float displacement = pokeStrength * exp(-dist * dist / (pokeRadius * pokeRadius * 0.3));
    vec2 warpedUv = uv + normalize(toPoint + 0.001) * displacement;
    float checker = step(0.0, sin(warpedUv.x * 20.0) * sin(warpedUv.y * 20.0));
    vec3 color1 = vec3(0.2, 0.4, 0.7);
    vec3 color2 = vec3(0.9, 0.85, 0.8);
    vec3 pattern = mix(color1, color2, checker);
    float ring1 = smoothstep(0.22, 0.2, abs(length(warpedUv) - 0.3));
    float ring2 = smoothstep(0.15, 0.13, abs(length(warpedUv - vec2(0.2, 0.1)) - 0.15));
    pattern = mix(pattern, vec3(0.8, 0.3, 0.2), ring1 * 0.7);
    pattern = mix(pattern, vec3(0.2, 0.7, 0.4), ring2 * 0.6);
    float depth = displacement * 3.0;
    vec3 normal = normalize(vec3(
        dFdx(depth) * 5.0,
        dFdy(depth) * 5.0,
        1.0
    ));
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    float diff = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, normal), vec3(0, 0, 1)), 0.0), 32.0);
    vec3 col = pattern * (0.4 + diff * 0.6) + spec * 0.3;
    float shadow = smoothstep(pokeRadius, 0.0, dist) * 0.15;
    col *= 1.0 - shadow;
    fragColor = vec4(col, 1.0);
}
