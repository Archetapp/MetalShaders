#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));

    vec3 skyColor = mix(vec3(0.4, 0.5, 0.6), vec3(0.6, 0.65, 0.7), uv.y + 0.5);
    float reflectY = abs(uv.y);

    float rippleHeight = 0.0;
    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float dropInterval = 1.5 + fi * 0.7;
        float dropTime = mod(iMouseTime + fi * 2.3, dropInterval);
        vec2 dropPos = (i == 0 && hasInput) ? mouseCentered : vec2(sin(fi * 3.1 + floor((iMouseTime + fi * 2.3) / dropInterval) * 1.7) * 0.3,
                            cos(fi * 2.7 + floor((iMouseTime + fi * 2.3) / dropInterval) * 2.1) * 0.2);

        float dist = length(uv - dropPos);
        float waveSpeed = 0.4;
        float waveRadius = dropTime * waveSpeed;
        float decay = exp(-dropTime * 1.5);
        float wavelength = 0.05;

        float wave = sin((dist - waveRadius) * 6.28 / wavelength) * decay;
        wave *= smoothstep(waveRadius + wavelength, waveRadius - wavelength * 2.0, dist);
        wave *= smoothstep(0.0, wavelength, dist);

        rippleHeight += wave * 0.02;
    }

    vec3 normal = normalize(vec3(
        dFdx(rippleHeight) * 30.0,
        dFdy(rippleHeight) * 30.0,
        1.0
    ));

    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 reflectDir = reflect(-viewDir, normal);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

    vec3 reflectedSky = mix(vec3(0.4, 0.5, 0.6), vec3(0.7, 0.75, 0.8), reflectDir.y * 0.5 + 0.5);
    vec3 waterColor = vec3(0.1, 0.15, 0.2);
    vec3 puddleColor = mix(waterColor, reflectedSky, 0.3 + fresnel * 0.5);

    vec3 lightDir = normalize(vec3(0.3, 0.8, 0.5));
    float spec = pow(max(dot(reflectDir, lightDir), 0.0), 64.0);
    puddleColor += spec * vec3(1.0, 0.98, 0.95) * 0.6;

    float puddleMask = smoothstep(0.5, 0.45, length(uv * vec2(0.8, 1.0)));
    float puddleEdge = smoothstep(0.45, 0.42, length(uv * vec2(0.8, 1.0)));
    vec3 groundColor = vec3(0.25, 0.22, 0.2);

    vec3 col = mix(groundColor, puddleColor, puddleMask);
    col += (puddleMask - puddleEdge) * 0.05;

    fragColor = vec4(col, 1.0);
}
