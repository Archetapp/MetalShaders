#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float lmmNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f*f*(3.0-2.0*f);
    float a = fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);
    float b = fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
    float c = fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);
    float d = fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
    return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / min(iResolution.x, iResolution.y);
    float blobDist = length(uv);
    float deform = 0.0;
    for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float angle = atan(uv.y, uv.x) + fi * 1.257;
        deform += sin(angle * (3.0+fi) + iTime * (0.5+fi*0.2)) * 0.03 / (1.0+fi*0.3);
    }
    deform += lmmNoise(uv * 5.0 + iTime * 0.2) * 0.05;
    float surface = blobDist - 0.3 - deform;
    float mask = smoothstep(0.01, -0.01, surface);

    vec2 eps = vec2(0.003, 0.0);
    float d1 = length(uv+eps) - 0.3 - lmmNoise((uv+eps)*5.0+iTime*0.2)*0.05;
    float d2 = length(uv+eps.yx) - 0.3 - lmmNoise((uv+eps.yx)*5.0+iTime*0.2)*0.05;
    vec3 normal = normalize(vec3(d1-surface, d2-surface, 0.08));

    vec3 viewDir = vec3(0,0,1);
    vec3 reflected = reflect(-viewDir, normal);

    vec3 envColor = mix(vec3(0.1,0.15,0.2), vec3(0.4,0.5,0.6), reflected.y*0.5+0.5);
    envColor += vec3(0.3,0.35,0.4) * pow(max(reflected.x*0.5+0.5, 0.0), 4.0);
    float envBand = sin(reflected.x * 10.0 + reflected.y * 5.0 + iTime) * 0.1;
    envColor += envBand;

    float fresnel = pow(1.0-max(dot(normal,viewDir),0.0), 4.0);
    float spec = pow(max(dot(reflected, normalize(vec3(0.5,0.8,0.5))), 0.0), 64.0);
    float spec2 = pow(max(dot(reflected, normalize(vec3(-0.3,0.6,0.7))), 0.0), 32.0);

    vec3 col = vec3(0.02, 0.02, 0.04);
    vec3 metalColor = envColor * 0.8;
    metalColor += spec * vec3(1.0) * 0.8 + spec2 * vec3(0.8,0.85,0.9) * 0.4;
    metalColor += fresnel * vec3(0.5,0.55,0.6) * 0.3;
    col = mix(col, metalColor, mask);

    float shadow = smoothstep(0.3, 0.0, surface) * 0.1;
    col *= 1.0 + shadow;

    fragColor = vec4(col, 1.0);
}
