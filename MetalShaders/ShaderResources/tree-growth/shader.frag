#version 300 es
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float treeHash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float treeBranch(vec2 p, vec2 a, vec2 b, float w) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    float d = length(pa - ba * h);
    return smoothstep(w, w * 0.3, d);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    float growth = clamp(iTime * 0.3, 0.0, 1.0);
    vec3 col = vec3(0.02, 0.01, 0.04);

    float trunk = treeBranch(uv, vec2(0.0, -0.5), vec2(0.0, -0.1), 0.015);
    col += trunk * vec3(0.4, 0.25, 0.1);

    float angle = 0.5;
    float len = 0.2;
    float totalBranch = 0.0;
    float totalLeaf = 0.0;

    for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float branchGrowth = clamp(growth * 6.0 - fi, 0.0, 1.0);
        if (branchGrowth <= 0.0) break;

        float spread = angle + fi * 0.15;
        float l = len * pow(0.72, fi) * branchGrowth;
        float w = 0.012 * pow(0.65, fi);

        for (int j = 0; j < 4; j++) {
            float fj = float(j);
            float side = fj < 2.0 ? -1.0 : 1.0;
            float tier = mod(fj, 2.0);

            vec2 base = vec2(side * 0.05 * (fi + 1.0), -0.1 + fi * 0.06);
            float a = spread * side + sin(iTime + fi + fj) * 0.05;
            vec2 tip = base + vec2(cos(a + 1.5708) * l, sin(a + 1.5708) * l);

            totalBranch += treeBranch(uv, base, tip, w);

            float leafSize = 0.02 * branchGrowth * (1.0 + 0.3 * sin(iTime * 2.0 + fi + fj));
            float leafDist = length(uv - tip);
            totalLeaf += smoothstep(leafSize, leafSize * 0.2, leafDist);
        }
    }

    col += totalBranch * vec3(0.35, 0.2, 0.08);
    vec3 leafCol = mix(vec3(0.1, 0.5, 0.15), vec3(0.3, 0.7, 0.1), sin(iTime) * 0.5 + 0.5);
    col += totalLeaf * leafCol;

    col += vec3(0.02, 0.03, 0.0) * smoothstep(0.5, 0.0, length(uv));

    fragColor = vec4(col, 1.0);
}
