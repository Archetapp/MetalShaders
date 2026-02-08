#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float mnHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float seed=floor(t*0.1);
    vec3 col=vec3(0.95,0.93,0.88);
    float gridX=floor(uv.x*(4.0+2.0*mnHash(vec2(seed,0.0))))/6.0;
    float gridY=floor(uv.y*(4.0+2.0*mnHash(vec2(seed,1.0))))/6.0;
    vec2 cell=vec2(gridX,gridY);
    float id=mnHash(cell+seed);
    if(id>0.75)col=vec3(0.85,0.15,0.1);
    else if(id>0.55)col=vec3(0.1,0.2,0.6);
    else if(id>0.4)col=vec3(0.9,0.8,0.15);
    float lineW=0.008;
    float lineH=smoothstep(lineW,0.0,fract(uv.x*6.0))+smoothstep(1.0-lineW,1.0,fract(uv.x*6.0));
    float lineV=smoothstep(lineW,0.0,fract(uv.y*6.0))+smoothstep(1.0-lineW,1.0,fract(uv.y*6.0));
    float lines=min(max(lineH,lineV),1.0);
    col=mix(col,vec3(0.05),lines);
    float borderW=0.015;
    float border=step(uv.x,borderW)+step(1.0-borderW,uv.x)+step(uv.y,borderW)+step(1.0-borderW,uv.y);
    col=mix(col,vec3(0.05),min(border,1.0));
    fragColor=vec4(col,1.0);}
