#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);

    float bass = sin(iTime * 2.0) * 0.5 + 0.5;
    float mid = sin(iTime * 4.0 + 1.0) * 0.3 + 0.5;
    float treble = sin(iTime * 8.0 + 2.0) * 0.2 + 0.5;
    float amplitude = (bass + mid + treble) / 3.0;

    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    float baseRadius = 0.25;
    float deform = 0.0;
    deform += sin(angle * 2.0 + iTime * 1.5) * bass * 0.06;
    deform += sin(angle * 4.0 - iTime * 2.0) * mid * 0.04;
    deform += sin(angle * 8.0 + iTime * 4.0) * treble * 0.025;
    deform += sin(angle * 3.0 + iTime) * amplitude * 0.03;

    float surface = dist - baseRadius - deform;
    float mask = smoothstep(0.01, -0.01, surface);

    vec2 eps = vec2(0.003, 0.0);
    float d1 = length(uv + eps) - baseRadius;
    float d2 = length(uv + eps.yx) - baseRadius;
    vec3 normal = normalize(vec3(d1 - surface, d2 - surface, 0.15));

    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float diff = max(dot(normal, lightDir), 0.0);
    float spec = pow(max(dot(reflect(-lightDir, normal), viewDir), 0.0), 32.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 blobColor = mix(vec3(0.2, 0.1, 0.5), vec3(0.1, 0.5, 0.8), mid);
    blobColor = mix(blobColor, vec3(0.8, 0.2, 0.3), bass * 0.3);

    float pulse = amplitude * 0.3;
    vec3 glowColor = mix(vec3(0.5, 0.2, 0.8), vec3(0.2, 0.8, 0.5), sin(iTime) * 0.5 + 0.5);

    vec3 col = vec3(0.02, 0.02, 0.04);
    vec3 blobLit = blobColor * (0.2 + diff * 0.6);
    blobLit += spec * vec3(1.0) * 0.5;
    blobLit += fresnel * glowColor * 0.3;

    col = mix(col, blobLit, mask);

    float outerGlow = exp(-surface * 10.0) * amplitude * 0.3;
    col += outerGlow * glowColor;

    float pulseRing = exp(-pow(surface - pulse * 0.1, 2.0) * 500.0) * amplitude;
    col += pulseRing * glowColor * 0.5;

    fragColor = vec4(col, 1.0);
}
