#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float vcHash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float vcNoise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(vcHash(i + vec3(0, 0, 0)), vcHash(i + vec3(1, 0, 0)), f.x),
                   mix(vcHash(i + vec3(0, 1, 0)), vcHash(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(vcHash(i + vec3(0, 0, 1)), vcHash(i + vec3(1, 0, 1)), f.x),
                   mix(vcHash(i + vec3(0, 1, 1)), vcHash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}

float vcFbm(vec3 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
        f += amp * vcNoise(p);
        p *= 2.01;
        amp *= 0.5;
    }
    return f;
}

float vcCloudDensity(vec3 p, float t) {
    vec3 wind = vec3(t * 0.3, 0.0, t * 0.1);
    float density = vcFbm(p * 0.3 + wind) * 2.0 - 1.0;
    density += vcFbm(p * 0.6 + wind * 1.5) * 0.5;

    float heightFade = 1.0 - smoothstep(0.0, 4.0, abs(p.y - 5.0));
    density *= heightFade;

    return max(0.0, density);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution) / iResolution.y;
    float t = iTime;

    vec3 ro = vec3(0.0, 3.0, -5.0);
    vec3 rd = normalize(vec3(uv.x, uv.y + 0.2, 1.0));

    vec3 sunDir = normalize(vec3(0.5, 0.3, -0.5));
    vec3 sunColor = vec3(1.0, 0.9, 0.7) * 2.0;

    float skyT = max(0.0, rd.y);
    vec3 skyColor = mix(vec3(0.5, 0.6, 0.7), vec3(0.2, 0.4, 0.8), skyT);
    float sunDot = max(0.0, dot(rd, sunDir));
    skyColor += vec3(1.0, 0.8, 0.5) * pow(sunDot, 32.0);
    skyColor += vec3(0.8, 0.6, 0.3) * pow(sunDot, 4.0) * 0.3;

    vec3 col = skyColor;
    float transmittance = 1.0;

    float tMin = 0.0;
    float tMax = 30.0;
    float stepSize = 0.5;
    float rayT = tMin;

    for (int i = 0; i < 60; i++) {
        if (transmittance < 0.01 || rayT > tMax) break;

        vec3 pos = ro + rd * rayT;
        float density = vcCloudDensity(pos, t);

        if (density > 0.001) {
            float shadowDensity = 0.0;
            vec3 shadowPos = pos;
            for (int s = 0; s < 4; s++) {
                shadowPos += sunDir * 0.8;
                shadowDensity += vcCloudDensity(shadowPos, t) * 0.8;
            }

            float shadow = exp(-shadowDensity * 0.5);

            vec3 lightColor = sunColor * shadow;
            lightColor += vec3(0.4, 0.5, 0.7) * 0.3;

            float phase = 0.5 + 0.5 * dot(rd, sunDir);
            float silver = pow(max(0.0, dot(rd, sunDir)), 8.0) * 2.0;
            lightColor += vec3(1.0, 0.95, 0.8) * silver * shadow;

            vec3 cloudCol = lightColor * vec3(1.0, 0.98, 0.96);

            float absorption = density * stepSize * 0.4;
            col += cloudCol * absorption * transmittance * phase;
            transmittance *= exp(-absorption);
        }

        rayT += stepSize;
    }

    vec3 horizonHaze = vec3(0.7, 0.75, 0.8);
    float haze = exp(-max(0.0, rd.y) * 3.0);
    col = mix(col, horizonHaze, haze * 0.5);

    col = 1.0 - exp(-col * 0.8);
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
