#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float gridSize = 20.0;
    vec2 cell = floor(uv * gridSize);
    vec2 cellUv = fract(uv * gridSize);
    vec3 col = vec3(0.02, 0.03, 0.08);
    vec2 disturb = vec2(0.5 + 0.3*sin(t*0.7), 0.5 + 0.3*cos(t*0.5));
    float dist = length(cell/gridSize - disturb);
    float displacement = sin(dist*15.0 - t*4.0) * exp(-dist*3.0) * 0.3;
    vec2 offset = normalize(cell/gridSize - disturb + 0.001) * displacement;
    vec2 nodePos = cellUv - 0.5 + offset;
    float node = smoothstep(0.12, 0.08, length(nodePos));
    float hue = dist*2.0 + t*0.2;
    vec3 nodeCol = 0.5+0.5*cos(6.28*(hue+vec3(0.0,0.33,0.67)));
    col += nodeCol * node * 0.8;
    float lineH = smoothstep(0.02, 0.0, abs(nodePos.y)) * step(abs(nodePos.x), 0.5);
    float lineV = smoothstep(0.02, 0.0, abs(nodePos.x)) * step(abs(nodePos.y), 0.5);
    col += nodeCol * (lineH+lineV) * 0.3;
    float glow = 0.01/(length(nodePos)*length(nodePos)+0.01);
    col += nodeCol * glow * 0.02;
    fragColor = vec4(col, 1.0);
}
