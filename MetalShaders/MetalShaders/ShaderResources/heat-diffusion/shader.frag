#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float hdNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);
}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution;
    float t = iTime;
    float heat = 0.0;
    for(int i=0;i<5;i++){
        float fi=float(i);
        vec2 src=vec2(0.2+fi*0.15, 0.3+0.2*sin(t*0.3+fi));
        float d=length(uv-src);
        float spread=0.1+0.08*sin(t*0.5+fi*1.2);
        heat += exp(-d*d/(2.0*spread*spread)) * (0.6+0.4*sin(t+fi));
    }
    heat += hdNoise(uv*5.0+t*0.2)*0.15;
    heat = clamp(heat, 0.0, 1.5);
    vec3 cold = vec3(0.0, 0.0, 0.3);
    vec3 warm = vec3(0.8, 0.2, 0.0);
    vec3 hot = vec3(1.0, 0.9, 0.2);
    vec3 white = vec3(1.0);
    vec3 col;
    if(heat < 0.33) col = mix(cold, warm, heat*3.0);
    else if(heat < 0.66) col = mix(warm, hot, (heat-0.33)*3.0);
    else col = mix(hot, white, (heat-0.66)*3.0);
    float shimmer = hdNoise(uv*20.0+t*2.0)*0.1*heat;
    col += shimmer;
    fragColor = vec4(col, 1.0);
}
