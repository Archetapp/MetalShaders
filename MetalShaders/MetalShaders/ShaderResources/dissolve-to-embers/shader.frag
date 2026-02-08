#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dteNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float dteFbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*dteNoise(p);p*=2.0;a*=0.5;}return v;}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    float cycle = mod(iTime * 0.3, 2.0);
    float burnProgress = smoothstep(0.0, 1.5, cycle);

    vec2 burnOrigin = vec2(sin(floor(iTime * 0.3 / 2.0) * 2.3) * 0.2,
                           cos(floor(iTime * 0.3 / 2.0) * 1.7) * 0.15);

    float dist = length(uv - burnOrigin);
    float noise = dteFbm(uv * 5.0) * 0.3 + dteFbm(uv * 10.0) * 0.15;
    float burnEdge = dist + noise - burnProgress * 0.8;

    float content = step(0.0, sin(uv.x * 15.0)) * step(0.0, sin(uv.y * 10.0));
    vec3 contentColor = mix(vec3(0.3, 0.5, 0.7), vec3(0.7, 0.5, 0.3), content);

    float burned = smoothstep(0.02, -0.02, burnEdge);
    float glowEdge = smoothstep(0.1, 0.0, burnEdge) - burned;
    float charEdge = smoothstep(0.15, 0.05, burnEdge) - smoothstep(0.05, 0.0, burnEdge);

    vec3 glowColor = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.2, 0.0), smoothstep(0.0, 0.08, burnEdge));
    vec3 charColor = vec3(0.1, 0.05, 0.02);

    vec3 col = vec3(0.02, 0.02, 0.03);
    col = mix(col, contentColor, 1.0 - burned);
    col = mix(col, charColor, charEdge);
    col += glowColor * glowEdge * 2.0;

    for (int i = 0; i < 15; i++) {
        float fi = float(i);
        float emberTime = mod(iTime + fi * 0.3, 3.0);
        if (emberTime > 0.0 && burnProgress > 0.1) {
            vec2 emberPos = burnOrigin + normalize(vec2(dteNoise(vec2(fi * 1.23, 0.0)) - 0.5, 0.5 + dteNoise(vec2(0.0, fi * 2.47)) * 0.5)) * burnProgress * 0.5;
            emberPos += vec2(sin(fi * 2.0 + iTime) * 0.05, emberTime * 0.15);
            float emberDist = length(uv - emberPos);
            float ember = exp(-emberDist * 100.0) * max(0.0, 1.0 - emberTime * 0.5);
            col += ember * mix(vec3(1.0, 0.5, 0.1), vec3(1.0, 0.2, 0.0), emberTime * 0.3);
        }
    }

    fragColor = vec4(col, 1.0);
}
