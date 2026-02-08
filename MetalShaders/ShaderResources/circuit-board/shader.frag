#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float cbHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float grid = 20.0;
    vec2 cell = floor(uv*grid);
    vec2 f = fract(uv*grid);
    float id = cbHash(cell);
    vec3 pcbGreen = vec3(0.0, 0.25, 0.1);
    vec3 pcbDark = vec3(0.0, 0.15, 0.05);
    vec3 col = mix(pcbDark, pcbGreen, 0.5 + 0.5*cbHash(cell*7.0));
    float traceH = smoothstep(0.04, 0.0, abs(f.y - 0.5)) * step(0.3, id);
    float traceV = smoothstep(0.04, 0.0, abs(f.x - 0.5)) * step(0.5, id);
    float traceCorner = 0.0;
    if(id > 0.7){
        float d = length(f - vec2(step(0.5, cbHash(cell+vec2(1,0))), step(0.5, cbHash(cell+vec2(0,1)))));
        traceCorner = smoothstep(0.54, 0.46, d) * smoothstep(0.42, 0.46, d);
    }
    float trace = max(max(traceH, traceV), traceCorner);
    vec3 copperCol = vec3(0.7, 0.5, 0.2);
    vec3 solderCol = vec3(0.75, 0.75, 0.7);
    col = mix(col, copperCol, trace*0.8);
    float via = smoothstep(0.12, 0.08, length(f-vec2(0.5)));
    float viaHole = smoothstep(0.05, 0.07, length(f-vec2(0.5)));
    if(id > 0.85){
        col = mix(col, solderCol, via);
        col = mix(col, vec3(0.05), (1.0-viaHole)*via);
    }
    float pad = 0.0;
    if(id > 0.6 && id < 0.7){
        vec2 padSize = vec2(0.35, 0.2);
        vec2 d = abs(f-vec2(0.5)) - padSize;
        pad = smoothstep(0.02, 0.0, max(d.x, d.y));
        col = mix(col, solderCol, pad);
    }
    float pulse = sin(cell.x*0.5+cell.y*0.5+t*3.0)*0.5+0.5;
    float signal = trace * pulse * step(0.8, cbHash(cell+floor(t)));
    col += vec3(0.0, 0.5, 0.0)*signal*0.3;
    vec2 lp = vec2(0.5+0.3*sin(t*0.5), 0.5+0.3*cos(t*0.3));
    float spec = exp(-length(uv-lp)*3.0);
    col += spec*0.1;
    fragColor = vec4(col, 1.0);
}
