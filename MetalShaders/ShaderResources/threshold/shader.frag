#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float thHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float scene=0.0;
    scene+=sin(uv.x*8.0+t)*sin(uv.y*6.0-t*0.8)*0.25;
    scene+=smoothstep(0.25,0.0,length(uv-vec2(0.5+0.2*sin(t*0.4),0.5+0.2*cos(t*0.3))))*0.5;
    scene+=0.4;
    float thresh=0.5+0.1*sin(t*0.5);
    float dither=thHash(gl_FragCoord.xy+fract(t)*100.0)*0.1-0.05;
    float bw=step(thresh,scene+dither);
    vec3 col=vec3(bw);
    float edgeDist=abs(scene-thresh);
    if(edgeDist<0.05){float stipple=thHash(floor(gl_FragCoord.xy*0.5)+floor(t*3.0));
        col=vec3(step(edgeDist*20.0,stipple));}
    fragColor=vec4(col,1.0);}
