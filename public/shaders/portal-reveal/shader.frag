#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float prNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    vec2 mouseUV = iMouse / iResolution;
    bool hasInput = iMouse.x > 0.0 || iMouse.y > 0.0;
    vec2 mouseCentered = (mouseUV - 0.5) * vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
    vec2 portalCenter = hasInput ? mouseCentered : vec2(sin(iTime*0.3)*0.1, cos(iTime*0.2)*0.08);
    float portalRadius = 0.2 + 0.05 * sin(iTime * 0.5);
    float dist = length(uv - portalCenter);

    vec3 world1 = vec3(0.15, 0.12, 0.1);
    world1 += sin(uv.x * 10.0 + prNoise(uv * 5.0) * 3.0) * 0.05 * vec3(0.1, 0.08, 0.05);

    vec3 world2 = vec3(0.05, 0.1, 0.2);
    float stars = pow(prNoise(uv * 40.0 + iTime * 0.1), 12.0) * 2.0;
    world2 += stars;
    float nebula = prNoise(uv * 3.0 + iTime * 0.05) * 0.2;
    world2 += nebula * vec3(0.2, 0.1, 0.3);

    float edgeNoise = prNoise(vec2(atan(uv.y - portalCenter.y, uv.x - portalCenter.x) * 5.0, iTime * 2.0)) * 0.03;
    float portalEdge = dist - portalRadius + edgeNoise;
    float portalMask = smoothstep(0.02, -0.02, portalEdge);

    float rimGlow = exp(-portalEdge * portalEdge * 500.0);
    float shimmer = sin(atan(uv.y - portalCenter.y, uv.x - portalCenter.x) * 8.0 + iTime * 3.0) * 0.5 + 0.5;
    vec3 rimColor = mix(vec3(0.2, 0.5, 1.0), vec3(0.8, 0.3, 1.0), shimmer);

    vec3 col = mix(world1, world2, portalMask);
    col += rimGlow * rimColor * 1.5;

    float innerRing = exp(-pow(dist - portalRadius * 0.8, 2.0) * 300.0) * portalMask;
    col += innerRing * vec3(0.3, 0.5, 0.8) * 0.3;

    float particles = 0.0;
    for (int i = 0; i < 8; i++) {
        float fi = float(i);
        float angle = fi * 0.785 + iTime * (1.0 + fi * 0.1);
        float r = portalRadius + sin(iTime * 2.0 + fi) * 0.03;
        vec2 pPos = portalCenter + vec2(cos(angle), sin(angle)) * r;
        particles += exp(-length(uv - pPos) * 100.0);
    }
    col += particles * rimColor * 0.5;

    fragColor = vec4(col, 1.0);
}
