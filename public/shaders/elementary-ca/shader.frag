#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float ecaRule(float l, float c, float r, float rule){
    int idx = int(l)*4 + int(c)*2 + int(r);
    return mod(floor(rule / exp2(float(idx))), 2.0);
}

float ecaHash(float p){return fract(sin(p*127.1)*43758.5453);}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float cellW = 2.0 / iResolution.x;
    float cols = floor(iResolution.x / 2.0);
    float row = floor((1.0 - uv.y + fract(t*0.2)) * cols);
    float col_idx = floor(uv.x * cols);
    float rule = 30.0 + floor(mod(t*0.05, 3.0))*60.0;
    float state = 0.0;
    if(row < 1.0){
        state = col_idx == floor(cols*0.5) ? 1.0 : 0.0;
    } else {
        float prev = 0.0;
        float current = col_idx == floor(cols*0.5) ? 1.0 : 0.0;
        for(float r = 1.0; r <= row && r < 80.0; r += 1.0){
            float newState = 0.0;
            float h = ecaHash(col_idx + r*cols);
            newState = step(0.5, fract(sin(dot(vec2(col_idx, r), vec2(127.1, 311.7)))*43758.5));
            float neighbor = sin(col_idx*0.1 + r*0.3 + t*0.5);
            newState = step(0.0, sin(col_idx*3.14159/cols*6.0 + r*0.5 - t));
            current = newState;
        }
        state = current;
    }
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
