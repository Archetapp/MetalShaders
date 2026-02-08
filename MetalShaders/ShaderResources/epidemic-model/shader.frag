#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float emHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float grid = 50.0;
    vec2 cell = floor(uv*grid);
    vec2 cellUv = fract(uv*grid);
    float id = emHash(cell);
    vec2 infectionCenter = vec2(0.5 + 0.2*sin(t*0.3), 0.5 + 0.2*cos(t*0.4));
    float dist = length(cell/grid - infectionCenter);
    float spreadSpeed = 0.15;
    float infectionTime = dist / spreadSpeed;
    float localTime = t - infectionTime + id*0.5;
    float susceptible = smoothstep(0.0, -0.5, localTime);
    float infected = smoothstep(-0.5, 0.0, localTime) * smoothstep(3.0, 2.0, localTime);
    float recovered = smoothstep(2.0, 3.5, localTime);
    vec3 susCol = vec3(0.2, 0.4, 0.8);
    vec3 infCol = vec3(0.9, 0.2, 0.1);
    vec3 recCol = vec3(0.1, 0.7, 0.3);
    vec3 col = susCol*susceptible + infCol*infected + recCol*recovered;
    float person = smoothstep(0.35, 0.3, length(cellUv-vec2(0.5)));
    col *= 0.3 + person*0.7;
    float pulse = sin(t*5.0 + dist*20.0)*0.5+0.5;
    col += infCol*pulse*infected*0.2;
    float border = smoothstep(0.0, 0.05, cellUv.x)*smoothstep(0.0, 0.05, cellUv.y);
    col *= border;
    fragColor = vec4(col, 1.0);
}
