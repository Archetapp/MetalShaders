#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float laHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float gridSize = 64.0;
    vec2 cell = floor(uv * gridSize);
    vec2 cellUv = fract(uv * gridSize);
    float pattern = 0.0;
    float highway = 0.0;
    float dx = cell.x - 32.0;
    float dy = cell.y - 32.0;
    float angle = atan(dy, dx) + t*0.2;
    float radius = length(vec2(dx, dy));
    highway = sin(angle*4.0 + radius*0.5 - t*2.0)*0.5+0.5;
    highway *= exp(-radius*0.03);
    float timeLayer = sin(cell.x*0.3+t)*sin(cell.y*0.3+t*1.3)*0.5+0.5;
    pattern = mix(highway, timeLayer, 0.3);
    vec3 col = vec3(0.0);
    vec3 onCol = vec3(0.1, 0.6, 0.9);
    vec3 offCol = vec3(0.05, 0.05, 0.1);
    col = mix(offCol, onCol, pattern);
    float border = step(cellUv.x, 0.05)+step(cellUv.y, 0.05);
    border = min(border, 1.0);
    col = mix(col, col*0.7, border*0.3);
    float antDist = length(cell - vec2(32.0+10.0*sin(t), 32.0+10.0*cos(t*0.7)));
    float ant = smoothstep(2.0, 0.0, antDist);
    col += vec3(1.0, 0.3, 0.1)*ant;
    fragColor = vec4(col, 1.0);
}
