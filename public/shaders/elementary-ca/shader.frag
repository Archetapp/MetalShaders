#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float cols = floor(iResolution.x / 2.0);
    float row = floor((1.0 - uv.y + fract(t*0.2)) * cols);
    float col_idx = floor(uv.x * cols);
    float cellState = step(0.5, fract(sin(dot(vec2(col_idx, row), vec2(12.9898, 78.233)))*43758.5 + t*0.3));
    float pattern = sin(col_idx*0.2 + row*0.3)*sin(row*0.1 - t);
    cellState = step(0.0, pattern);
    vec2 cellUv = fract(vec2(uv.x*cols, (1.0-uv.y+fract(t*0.2))*cols));
    float border = smoothstep(0.0, 0.1, cellUv.x)*smoothstep(0.0, 0.1, cellUv.y);
    vec3 onColor = 0.5+0.5*cos(6.28*(row*0.01+t*0.1+vec3(0.0,0.33,0.67)));
    vec3 offColor = vec3(0.05, 0.05, 0.08);
    vec3 finalCol = mix(offColor, onColor, cellState);
    finalCol *= border;
    fragColor = vec4(finalCol, 1.0);
}
