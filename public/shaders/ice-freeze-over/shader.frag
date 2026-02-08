#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
out vec4 fragColor;

float ifNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    float cycle = mod(iTime * 0.3, 2.0);
    float freezeProgress = smoothstep(0.0, 1.5, cycle);

    vec2 freezeOrigin = vec2(sin(floor(iTime * 0.15) * 2.3) * 0.2,
                             cos(floor(iTime * 0.15) * 1.7) * 0.15);

    vec3 warmContent = vec3(0.8, 0.4, 0.2);
    warmContent += sin(uv.x * 10.0) * 0.1 * vec3(0.1, 0.05, 0.0);

    float dist = length(uv - freezeOrigin);
    float fractalNoise = ifNoise(uv * 8.0) * 0.2 + ifNoise(uv * 16.0) * 0.1;
    float freezeEdge = dist + fractalNoise - freezeProgress * 0.8;
    float frozen = smoothstep(0.02, -0.02, freezeEdge);

    float crystal = 0.0;
    for (int i = 0; i < 6; i++) {
        float angle = float(i) * 1.047;
        vec2 dir = vec2(cos(angle), sin(angle));
        float branch = abs(dot(uv - freezeOrigin, dir));
        float along = dot(uv - freezeOrigin, vec2(-dir.y, dir.x));
        float fern = sin(along * 30.0) * 0.01;
        crystal += smoothstep(0.008 + fern, 0.0, branch) * smoothstep(freezeProgress * 0.5, 0.0, abs(along));
    }

    vec3 iceColor = vec3(0.7, 0.85, 0.95);
    iceColor += ifNoise(uv * 20.0) * 0.1;
    float iceHighlight = pow(ifNoise(uv * 30.0 + iTime * 0.1), 4.0) * 0.3;
    iceColor += iceHighlight;

    float frostEdge = smoothstep(0.05, 0.0, freezeEdge) - frozen;
    vec3 frostColor = vec3(0.85, 0.9, 1.0);

    vec3 col = warmContent;
    col = mix(col, iceColor, frozen);
    col = mix(col, frostColor, frostEdge * 0.7);
    col += crystal * frozen * vec3(0.5, 0.7, 0.9) * 0.5;

    fragColor = vec4(col, 1.0);
}
