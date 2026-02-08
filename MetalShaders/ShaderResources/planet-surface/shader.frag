#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float psHash(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
}

float psNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n = mix(
        mix(mix(psHash(i), psHash(i + vec3(1, 0, 0)), f.x),
            mix(psHash(i + vec3(0, 1, 0)), psHash(i + vec3(1, 1, 0)), f.x), f.y),
        mix(mix(psHash(i + vec3(0, 0, 1)), psHash(i + vec3(1, 0, 1)), f.x),
            mix(psHash(i + vec3(0, 1, 1)), psHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
    return n;
}

float psFbm(vec3 p, int octaves) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        v += a * psNoise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

float psSphere(vec3 ro, vec3 rd, vec3 center, float radius) {
    vec3 oc = ro - center;
    float b = dot(oc, rd);
    float c = dot(oc, oc) - radius * radius;
    float h = b * b - c;
    if (h < 0.0) return -1.0;
    return -b - sqrt(h);
}

vec3 psTerrain(vec3 sphereNormal, float t) {
    vec3 rotN = sphereNormal;
    float rot = t * 0.1;
    float cs = cos(rot), sn = sin(rot);
    rotN.xz = vec2(rotN.x * cs - rotN.z * sn, rotN.x * sn + rotN.z * cs);

    float continent = psFbm(rotN * 2.0, 6);
    float detail = psFbm(rotN * 8.0, 4) * 0.3;
    float elevation = continent + detail;

    float seaLevel = 0.45;

    vec3 col;
    if (elevation < seaLevel) {
        float depth = (seaLevel - elevation) / seaLevel;
        vec3 shallowWater = vec3(0.1, 0.4, 0.6);
        vec3 deepWater = vec3(0.02, 0.08, 0.2);
        col = mix(shallowWater, deepWater, depth);
        float specular = pow(max(psNoise(rotN * 20.0 + t), 0.0), 8.0) * 0.2;
        col += vec3(specular);
    } else if (elevation < seaLevel + 0.02) {
        col = vec3(0.76, 0.7, 0.5);
    } else if (elevation < 0.6) {
        float grassT = (elevation - seaLevel - 0.02) / 0.13;
        vec3 lowGrass = vec3(0.2, 0.5, 0.15);
        vec3 highGrass = vec3(0.15, 0.35, 0.1);
        col = mix(lowGrass, highGrass, grassT);
        col += (psFbm(rotN * 15.0, 3) - 0.5) * 0.1;
    } else if (elevation < 0.7) {
        float mountT = (elevation - 0.6) / 0.1;
        col = mix(vec3(0.35, 0.3, 0.25), vec3(0.5, 0.48, 0.45), mountT);
    } else {
        col = vec3(0.9, 0.92, 0.95);
    }

    return col;
}

float psClouds(vec3 normal, float t) {
    vec3 rotN = normal;
    float rot = t * 0.15;
    float cs = cos(rot), sn = sin(rot);
    rotN.xz = vec2(rotN.x * cs - rotN.z * sn, rotN.x * sn + rotN.z * cs);

    float clouds = psFbm(rotN * 3.0 + vec3(t * 0.02), 5);
    clouds = smoothstep(0.4, 0.7, clouds);
    return clouds;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv, -1.5));

    vec3 center = vec3(0.0);
    float radius = 1.0;

    float t = psSphere(ro, rd, center, radius);

    vec3 bgCol = vec3(0.0, 0.0, 0.02);
    float starField = pow(psHash(vec3(floor(uv * 300.0), 1.0)), 20.0);
    bgCol += starField * 0.8;

    vec3 col = bgCol;

    float atmosT = psSphere(ro, rd, center, radius + 0.08);
    if (atmosT > 0.0) {
        vec3 atmosP = ro + rd * atmosT;
        vec3 atmosN = normalize(atmosP - center);
        float atmosFresnel = pow(1.0 - max(dot(-rd, atmosN), 0.0), 3.0);
        col += vec3(0.3, 0.5, 1.0) * atmosFresnel * 0.5;
    }

    if (t > 0.0) {
        vec3 hitPos = ro + rd * t;
        vec3 normal = normalize(hitPos - center);

        vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        float ambient = 0.08;

        vec3 terrain = psTerrain(normal, iTime);

        float clouds = psClouds(normal, iTime);
        vec3 cloudColor = vec3(1.0, 1.0, 1.0);
        terrain = mix(terrain, cloudColor, clouds * 0.7);

        col = terrain * (ambient + diff * 0.92);

        float fresnel = pow(1.0 - max(dot(-rd, normal), 0.0), 4.0);
        col += vec3(0.2, 0.4, 0.8) * fresnel * 0.4;

        float terminator = smoothstep(-0.1, 0.1, dot(normal, lightDir));
        col *= 0.3 + 0.7 * terminator;

        float nightGlow = (1.0 - terminator) * 0.15;
        float cityNoise = pow(psNoise(normal * 20.0), 5.0);
        col += vec3(1.0, 0.8, 0.3) * cityNoise * nightGlow * (1.0 - clouds);
    }

    col = pow(col, vec3(0.9));
    col *= 1.0 - 0.2 * length(uv);

    fragColor = vec4(col, 1.0);
}
