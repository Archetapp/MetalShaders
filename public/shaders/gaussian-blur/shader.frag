#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec3 gbScene(vec2 uv,float t){
    vec3 c=vec3(0.0);
    for(int i=0;i<5;i++){float fi=float(i);
        vec2 p=vec2(0.3+fi*0.12,0.5+0.2*sin(t+fi));
        float d=length(uv-p);
        vec3 col=0.5+0.5*cos(6.28*(fi*0.2+vec3(0,0.33,0.67)));
        c+=col*0.02/(d*d+0.01);}
    c+=vec3(0.05,0.05,0.1);return c;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float blurAmount=0.003+0.003*sin(t*0.5);
    vec3 col=vec3(0.0);float total=0.0;
    for(int x=-4;x<=4;x++)for(int y=-4;y<=4;y++){
        vec2 off=vec2(float(x),float(y))*blurAmount;
        float w=exp(-float(x*x+y*y)*0.2);
        col+=gbScene(uv+off,t)*w;total+=w;}
    col/=total;
    vec2 split=vec2(0.5+0.1*sin(t*0.3),0.0);
    float divider=smoothstep(0.002,0.0,abs(uv.x-split.x));
    if(uv.x>split.x)col=gbScene(uv,t);
    col+=vec3(1.0)*divider;
    fragColor=vec4(col,1.0);}
