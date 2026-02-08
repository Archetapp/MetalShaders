#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec3 rbScene(vec2 uv,float t){vec3 c=vec3(0.0);
    for(int i=0;i<8;i++){float fi=float(i);
        float a=fi*0.785+t*0.3;float r=0.2+fi*0.03;
        vec2 p=vec2(0.5)+vec2(cos(a),sin(a))*r;
        float d=length(uv-p);c+=vec3(0.5+0.5*sin(fi),0.5+0.5*cos(fi*1.3),0.5+0.5*sin(fi*0.7))*0.01/(d+0.01);}
    return c+vec3(0.02);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec2 center=vec2(0.5+0.1*sin(t*0.4),0.5+0.1*cos(t*0.3));
    vec3 col=vec3(0.0);float total=0.0;
    int samples=20;
    for(int i=0;i<20;i++){
        float fi=float(i)/float(samples);
        float strength=0.02+0.02*sin(t*0.5);
        vec2 dir=(uv-center)*fi*strength;
        float w=1.0-fi*0.5;
        col+=rbScene(uv-dir,t)*w;total+=w;}
    col/=total;fragColor=vec4(col,1.0);}
