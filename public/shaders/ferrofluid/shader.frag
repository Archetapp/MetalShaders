#version 300 es
precision highp float;
uniform float iTime;
uniform float iMouseTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float ffHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float ffNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = ffHash(i);
    float b = ffHash(i + vec2(1.0, 0.0));
    float c = ffHash(i + vec2(0.0, 1.0));
    float d = ffHash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float ffFbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * ffNoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);

    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 magnetPos = hasInput ? mouseCentered : vec2(cos(iMouseTime * 0.7) * 0.35, sin(iMouseTime * 0.9) * 0.35);
    vec2 toMagnet = magnetPos - uv;
    float distToMagnet = length(toMagnet);
    vec2 magnetDir = normalize(toMagnet);

    float baseSurface = length(uv) - 0.35;

    float spikeFreq = 12.0;
    float angle = atan(uv.y, uv.x);
    float spikePattern = sin(angle * spikeFreq + iMouseTime * 2.0) * 0.5 + 0.5;
    spikePattern *= sin(angle * spikeFreq * 1.618 - iMouseTime * 1.5) * 0.5 + 0.5;

    float magnetInfluence = exp(-distToMagnet * 3.0);
    float magnetAngle = atan(magnetDir.y, magnetDir.x);
    float directionalSpikes = pow(max(0.0, cos(angle - magnetAngle)), 2.0);

    float spikeHeight = 0.08 * spikePattern + 0.15 * magnetInfluence * directionalSpikes;
    spikeHeight += 0.03 * sin(angle * 24.0 + iMouseTime * 3.0) * magnetInfluence;

    float noiseDetail = ffFbm(uv * 8.0 + iTime * 0.3) * 0.04;
    float surface = baseSurface - spikeHeight - noiseDetail;

    vec2 eps = vec2(0.002, 0.0);
    float nx = length(uv + eps.xy) - 0.35 - length(uv - eps.xy) + 0.35;
    float ny = length(uv + eps.yx) - 0.35 - length(uv - eps.yx) + 0.35;
    vec3 normal = normalize(vec3(nx, ny, 0.15));

    vec3 lightDir1 = normalize(vec3(magnetPos - uv, 0.8));
    vec3 lightDir2 = normalize(vec3(0.5, 0.8, 0.6));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0);

    vec3 halfDir1 = normalize(lightDir1 + viewDir);
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec1 = pow(max(dot(normal, halfDir1), 0.0), 64.0);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 32.0);

    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.0);

    vec3 baseColor = vec3(0.02, 0.02, 0.03);
    vec3 specColor = vec3(0.7, 0.75, 0.8);
    vec3 rimColor = vec3(0.15, 0.18, 0.25);

    vec3 col = baseColor;
    col += diff1 * 0.15 * vec3(0.4, 0.45, 0.5);
    col += diff2 * 0.1 * vec3(0.3, 0.3, 0.35);
    col += spec1 * specColor * 0.8;
    col += spec2 * specColor * 0.4;
    col += fresnel * rimColor;

    float edgeGlow = smoothstep(0.01, -0.01, surface);
    col *= edgeGlow;

    float magnetGlow = exp(-distToMagnet * 5.0) * 0.08;
    col += vec3(0.3, 0.35, 0.5) * magnetGlow * edgeGlow;

    vec3 bg = vec3(0.01, 0.01, 0.015);
    bg += 0.02 * ffFbm(uv * 3.0 + iTime * 0.1);
    col = mix(bg, col, edgeGlow);

    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
