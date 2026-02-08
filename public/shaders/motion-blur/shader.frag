#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec3 mbScene(vec2 uv,float t){
    float d=length(uv-vec2(0.5+0.3*sin(t*2.0),0.5+0.2*cos(t*1.5)));
    vec3 c=vec3(0.8,0.3,0.1)*0.03/(d+0.02);
    d=length(uv-vec2(0.3+0.2*cos(t*1.7),0.5+0.25*sin(t*1.3)));
    c+=vec3(0.1,0.3,0.8)*0.02/(d+0.02);
    d=length(uv-vec2(0.7+0.15*sin(t*2.3),0.4+0.2*cos(t*1.8)));
    c+=vec3(0.1,0.8,0.3)*0.02/(d+0.02);
    return c+vec3(0.02,0.02,0.04);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float angle=t*0.3;vec2 dir=vec2(cos(angle),sin(angle));
    float strength=0.015;
    vec3 col=vec3(0.0);float total=0.0;
    for(int i=-10;i<=10;i++){float fi=float(i)*strength;
        float w=exp(-float(i*i)*0.05);
        col+=mbScene(uv+dir*fi,t)*w;total+=w;}
    col/=total;fragColor=vec4(col,1.0);}
