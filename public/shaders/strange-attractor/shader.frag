#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec3 saLorenz(vec3 p) {
    float sigma = 10.0;
    float rho = 28.0;
    float beta = 8.0 / 3.0;
    return vec3(
        sigma * (p.y - p.x),
        p.x * (rho - p.z) - p.y,
        p.x * p.y - beta * p.z
    );
}

float saDensity(vec3 ro, vec3 rd, float iTime) {
    float density = 0.0;
    float dt = 0.01;
    float scale = 0.04;

    vec3 state = vec3(1.0, 1.0, 1.0);
    float phaseShift = iTime * 0.5;

    for (int i = 0; i < 300; i++) {
        vec3 deriv = saLorenz(state);
        state += deriv * dt;

        vec3 worldPos = (state - vec3(0.0, 0.0, 25.0)) * scale;

        vec3 toPoint = worldPos - ro;
        float proj = dot(toPoint, rd);
        if (proj < 0.0) continue;

        vec3 closest = ro + rd * proj;
        float dist = length(closest - worldPos);

        float radius = 0.03 + 0.01 * sin(float(i) * 0.05 + phaseShift);
        float contrib = exp(-dist * dist / (radius * radius * 2.0));

        float heat = length(deriv) * 0.01;
        density += contrib * (0.5 + heat);
    }

    return density;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float camAngle = iTime * 0.2;
    float camHeight = sin(iTime * 0.15) * 0.5;
    vec3 ro = vec3(sin(camAngle) * 3.0, camHeight + 0.5, cos(camAngle) * 3.0);
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 forward = normalize(target - ro);
    vec3 right = normalize(cross(forward, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, forward);
    vec3 rd = normalize(forward + uv.x * right + uv.y * up);

    float d = saDensity(ro, rd, iTime);

    vec3 coldColor = vec3(0.1, 0.2, 0.8);
    vec3 warmColor = vec3(1.0, 0.5, 0.1);
    vec3 hotColor = vec3(1.0, 1.0, 0.9);

    float t = clamp(d * 0.02, 0.0, 1.0);
    vec3 col = vec3(0.0);
    if (t < 0.5) {
        col = mix(coldColor, warmColor, t * 2.0);
    } else {
        col = mix(warmColor, hotColor, (t - 0.5) * 2.0);
    }

    col *= d * 0.015;

    float bloom = d * 0.005;
    col += vec3(0.05, 0.1, 0.3) * bloom;

    vec3 bgColor = vec3(0.01, 0.01, 0.03);
    float bgGrad = 1.0 - length(uv) * 0.5;
    col += bgColor * bgGrad;

    col = 1.0 - exp(-col * 2.0);
    col = pow(col, vec3(0.9));

    fragColor = vec4(col, 1.0);
}
