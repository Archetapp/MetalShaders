#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec3 bgScene(vec2 uv,float t){vec3 c=vec3(0.02,0.02,0.04);
    for(int i=0;i<5;i++){float fi=float(i);
        vec2 p=vec2(0.2+fi*0.15,0.5+0.2*sin(t+fi));
        float d=length(uv-p);float bright=step(d,0.03);
        vec3 col=0.6+0.4*cos(6.28*(fi*0.2+vec3(0,0.33,0.67)));
        c+=col*bright+col*0.01/(d+0.01);}return c;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene=bgScene(uv,t);
    vec3 bloom=vec3(0.0);float total=0.0;
    for(int x=-6;x<=6;x++)for(int y=-6;y<=6;y++){
        vec2 off=vec2(float(x),float(y))*0.005;
        float w=exp(-float(x*x+y*y)*0.08);
        vec3 s=bgScene(uv+off,t);
        float bright=max(max(s.r,s.g),s.b);
        bloom+=s*max(0.0,bright-0.5)*w;total+=w;}
    bloom/=total;
    vec3 col=scene+bloom*2.0;
    col=1.0-exp(-col*1.5);
    fragColor=vec4(col,1.0);}
