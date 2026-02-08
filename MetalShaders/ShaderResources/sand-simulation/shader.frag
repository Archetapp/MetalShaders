#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ssHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float gridRes = 100.0;
    vec2 cell = floor(uv * gridRes);
    float sandHeight = 0.0;
    for(int i = 0; i < 8; i++){
        float fi = float(i);
        float dropX = fract(fi*0.618 + floor(t*2.0+fi)*0.1);
        float dist = abs(uv.x - dropX);
        float pile = max(0.0, 0.3 - dist*2.0);
        pile *= pile;
        float timeOff = max(0.0, t - fi*0.5);
        pile *= smoothstep(0.0, 1.0, timeOff);
        sandHeight += pile;
    }
    float baseHeight = 0.05 + 0.03*sin(uv.x*10.0);
    sandHeight += baseHeight;
    sandHeight += ssHash(cell)*0.02;
    float falling = 0.0;
    for(int i = 0; i < 5; i++){
        float fi = float(i);
        float dropX = fract(fi*0.618 + floor(t*2.0)*0.1 + 0.5);
        float dropY = fract(t*1.5 + fi*0.37);
        dropY = 1.0 - dropY;
        float d = length(uv - vec2(dropX, dropY));
        falling += smoothstep(0.01, 0.0, d);
    }
    vec3 sandCol = vec3(0.76, 0.60, 0.35);
    vec3 darkSand = vec3(0.55, 0.42, 0.25);
    float grain = ssHash(cell*7.0)*0.3;
    vec3 col = vec3(0.1, 0.12, 0.2);
    if(uv.y < sandHeight){
        col = mix(darkSand, sandCol, 0.5+grain*0.5);
        float depth = sandHeight - uv.y;
        col *= 0.8 + 0.2*exp(-depth*5.0);
    }
    col += vec3(0.8, 0.7, 0.4)*falling;
    fragColor = vec4(col, 1.0);
}
