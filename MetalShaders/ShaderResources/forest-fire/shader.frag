#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ffHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ffNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(ffHash(i),ffHash(i+vec2(1,0)),f.x),mix(ffHash(i+vec2(0,1)),ffHash(i+vec2(1,1)),f.x),f.y);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float grid = 40.0;
    vec2 cell = floor(uv*grid);
    vec2 cellUv = fract(uv*grid);
    float cellH = ffHash(cell);
    float fireWave = sin(cell.x*0.15 - t*1.5 + sin(cell.y*0.2)*2.0)*0.5+0.5;
    float spreadNoise = ffNoise(cell*0.1 + t*0.3);
    float fireProb = fireWave * spreadNoise;
    float isBurning = smoothstep(0.4, 0.6, fireProb);
    float burnPhase = fract(fireProb*3.0 + t*0.5 + cellH);
    vec3 treeCol = mix(vec3(0.05, 0.25, 0.05), vec3(0.1, 0.4, 0.1), cellH);
    vec3 fireCol = mix(vec3(1.0, 0.3, 0.0), vec3(1.0, 0.8, 0.1), burnPhase);
    vec3 ashCol = vec3(0.15, 0.1, 0.08);
    float burnedOut = smoothstep(0.7, 1.0, fireProb + spreadNoise*0.3);
    vec3 col = treeCol;
    col = mix(col, fireCol, isBurning*(1.0-burnedOut));
    col = mix(col, ashCol, burnedOut*isBurning);
    float treeTrunk = smoothstep(0.1, 0.0, abs(cellUv.x-0.5)) * step(0.0, cellUv.y) * step(cellUv.y, 0.4);
    float treeTop = smoothstep(0.35, 0.0, length(cellUv - vec2(0.5, 0.6)));
    float tree = max(treeTrunk*0.5, treeTop)*(1.0-burnedOut*isBurning);
    col *= 0.5 + tree*0.5;
    float flicker = ffHash(cell+floor(t*10.0))*0.3;
    col += fireCol*flicker*isBurning*(1.0-burnedOut)*0.5;
    fragColor = vec4(col, 1.0);
}
