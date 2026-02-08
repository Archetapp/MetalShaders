#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float emScene(vec2 uv,float t){
    float v=0.0;
    for(int i=0;i<5;i++){float fi=float(i);
        vec2 p=vec2(0.2+fi*0.15,0.5+0.15*sin(t*0.4+fi*1.3));
        v+=smoothstep(0.12,0.08,length(uv-p))*(0.5+fi*0.1);}
    v+=sin(uv.x*30.0)*sin(uv.y*30.0)*0.05;return v;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float angle=t*0.3;vec2 dir=vec2(cos(angle),sin(angle));
    vec2 px=1.0/iResolution;
    float tl=emScene(uv-dir*px,t);float br=emScene(uv+dir*px,t);
    float emboss=(br-tl)*3.0+0.5;
    vec3 col=vec3(emboss)*vec3(0.9,0.85,0.75);
    float original=emScene(uv,t);
    col=mix(col,col*vec3(0.7,0.8,1.0),original*0.3);
    fragColor=vec4(col,1.0);}
