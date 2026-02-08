#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float caScene(vec2 uv,float t){
    float v=0.0;
    for(int i=0;i<6;i++){float fi=float(i);
        vec2 p=vec2(0.5+0.25*cos(t*0.5+fi),0.5+0.25*sin(t*0.3+fi*1.3));
        v+=0.02/(length(uv-p)+0.02);}
    v+=sin(uv.x*20.0+t)*sin(uv.y*20.0-t)*0.1;return v;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec2 center=vec2(0.5);vec2 dir=uv-center;
    float dist=length(dir);
    float strength=0.01+0.005*sin(t*0.7);
    float r=caScene(uv+dir*strength*dist,t);
    float g=caScene(uv,t);
    float b=caScene(uv-dir*strength*dist,t);
    vec3 col=vec3(r,g,b);
    col*=0.95+0.05*cos(dist*20.0);
    fragColor=vec4(col,1.0);}
