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
    vec2 dragPos = hasInput ? mouseCentered : vec2(sin(iMouseTime * 0.7) * 0.3, cos(iMouseTime * 0.5) * 0.25);

    float field = 0.0;
    vec3 colorField = vec3(0.0);

    float mainBlob = 0.12 / (length(uv - dragPos) + 0.0001);
    field += mainBlob;
    colorField += mainBlob * vec3(0.3, 0.6, 1.0);

    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float angle = fi * 1.047 + iMouseTime * 0.3;
        float radius = 0.2 + 0.1 * sin(iMouseTime * 0.4 + fi);
        vec2 blobPos = vec2(cos(angle), sin(angle)) * radius;

        float dist = length(uv - blobPos);
        float blobSize = 0.06 + 0.02 * sin(iMouseTime * 0.5 + fi * 2.0);
        float blob = blobSize / (dist + 0.0001);
        field += blob;

        vec3 blobColor = 0.5 + 0.5 * cos(6.28 * (fi * 0.15 + vec3(0.0, 0.33, 0.67)));
        colorField += blob * blobColor;
    }

    for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 trailPos = dragPos - normalize(vec2(cos(iMouseTime * 0.7), -sin(iMouseTime * 0.5))) * (fi + 1.0) * 0.06;
        float trailBlob = (0.04 - fi * 0.008) / (length(uv - trailPos) + 0.0001);
        field += trailBlob;
        colorField += trailBlob * vec3(0.2, 0.4, 0.9);
    }

    vec3 col = vec3(0.02, 0.02, 0.05);

    float surface = smoothstep(0.9, 1.1, field);
    vec3 blobColor = colorField / max(field, 0.001);

    float edge = smoothstep(0.85, 1.0, field) - smoothstep(1.0, 1.15, field);

    float highlight = smoothstep(1.5, 2.5, field);

    col = mix(col, blobColor * 0.6, surface);
    col += edge * vec3(0.4, 0.6, 1.0) * 0.5;
    col += highlight * vec3(0.8, 0.9, 1.0) * 0.4;

    float glow = smoothstep(2.0, 0.5, field) * 0.1;
    col += glow * blobColor;

    col = pow(col, vec3(0.9));
    fragColor = vec4(col, 1.0);
}
