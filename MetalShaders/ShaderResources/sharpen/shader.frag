#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float shScene(vec2 uv,float t){
    float v=sin(uv.x*15.0+t)*sin(uv.y*15.0-t*0.7)*0.3+0.5;
    v+=smoothstep(0.15,0.1,length(uv-vec2(0.5+0.2*sin(t),0.5)))*0.4;
    v+=smoothstep(0.1,0.05,length(uv-vec2(0.3,0.6+0.1*cos(t))))*0.3;return v;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec2 px=1.0/iResolution;
    float center=shScene(uv,t);float blur=0.0;float total=0.0;
    for(int x=-2;x<=2;x++)for(int y=-2;y<=2;y++){
        float w=exp(-float(x*x+y*y)*0.3);
        blur+=shScene(uv+vec2(float(x),float(y))*px*2.0,t)*w;total+=w;}
    blur/=total;
    float strength=1.0+1.5*sin(t*0.4)*sin(t*0.4);
    float sharp=center+(center-blur)*strength;
    vec3 col=vec3(sharp)*vec3(0.9,0.85,0.8);
    float split=0.5+0.2*sin(t*0.2);
    if(uv.x>split)col=vec3(center)*vec3(0.9,0.85,0.8);
    col+=vec3(1.0)*smoothstep(0.002,0.0,abs(uv.x-split));
    fragColor=vec4(col,1.0);}
