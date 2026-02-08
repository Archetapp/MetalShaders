#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float bhHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float bhStars(vec2 uv) {
    vec2 id = floor(uv);
    vec2 f = fract(uv);
    float star = 0.0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 p = vec2(bhHash(id + neighbor), bhHash(id + neighbor + 99.0));
            vec2 diff = neighbor + p - f;
            float d = length(diff);
            float brightness = bhHash(id + neighbor + 50.0);
            float flicker = 0.8 + 0.2 * sin(iTime * 2.0 + brightness * 30.0);
            star += smoothstep(0.05, 0.0, d) * brightness * flicker;
        }
    }
    return star;
}

vec3 bhAccretionDisk(vec3 ro, vec3 rd, float t, vec3 bhPos) {
    vec3 col = vec3(0.0);
    float diskInner = 1.5;
    float diskOuter = 4.0;

    for (int i = 0; i < 40; i++) {
        vec3 p = ro + rd * t;
        vec3 rel = p - bhPos;
        float distXZ = length(rel.xz);
        float distY = abs(rel.y);

        if (distXZ > diskInner && distXZ < diskOuter && distY < 0.15) {
            float diskFactor = smoothstep(diskInner, diskInner + 0.5, distXZ) *
                               smoothstep(diskOuter, diskOuter - 1.0, distXZ);
            float angle = atan(rel.z, rel.x) + iTime * 0.5;
            float spiral = sin(angle * 3.0 + distXZ * 2.0 - iTime * 2.0) * 0.5 + 0.5;
            float temp = diskFactor * (0.5 + 0.5 * spiral);

            float doppler = 1.0 + 0.3 * sin(angle);

            vec3 hotColor = mix(
                vec3(1.0, 0.3, 0.05),
                vec3(1.0, 0.9, 0.7),
                temp * doppler
            );
            hotColor += vec3(0.2, 0.1, 0.4) * (1.0 - temp);

            float density = diskFactor * smoothstep(0.15, 0.0, distY) * 0.08;
            col += hotColor * density;
        }
        t += 0.15;
    }
    return col;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float camAngle = iTime * 0.15;
    vec3 ro = vec3(sin(camAngle) * 8.0, 3.0 + sin(iTime * 0.1) * 1.0, cos(camAngle) * 8.0);
    vec3 target = vec3(0.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);

    vec3 bhPos = vec3(0.0);
    float rs = 1.0;

    vec3 p = ro;
    vec3 vel = rd;
    float dt = 0.1;
    bool hitHorizon = false;

    for (int i = 0; i < 200; i++) {
        vec3 diff = bhPos - p;
        float dist = length(diff);

        if (dist < rs * 0.5) {
            hitHorizon = true;
            break;
        }
        if (dist > 50.0) break;

        float force = rs / (dist * dist);
        vel += normalize(diff) * force * dt;
        vel = normalize(vel);
        p += vel * dt;
    }

    vec3 col = vec3(0.0);

    if (hitHorizon) {
        col = vec3(0.0);
    } else {
        float theta = atan(vel.z, vel.x);
        float phi = asin(vel.y);
        vec2 starUV = vec2(theta, phi) * 10.0;
        float stars = bhStars(starUV);
        col = vec3(stars) * vec3(0.9, 0.95, 1.0);
    }

    col += bhAccretionDisk(ro, rd, 0.0, bhPos);

    float distToCenter = length(uv);
    float lensGlow = 0.02 / (distToCenter + 0.1);
    col += vec3(0.4, 0.2, 0.05) * lensGlow * 0.3;

    col = 1.0 - exp(-col * 1.5);
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
