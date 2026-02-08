#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float soCircle(vec2 p,float r){return length(p)-r;}
float soBox(vec2 p,vec2 b){vec2 d=abs(p)-b;return length(max(d,0.0))+min(max(d.x,d.y),0.0);}
float soTriangle(vec2 p,float r){float k=sqrt(3.0);p.x=abs(p.x)-r;p.y=p.y+r/k;
    if(p.x+k*p.y>0.0)p=vec2(p.x-k*p.y,-k*p.x-p.y)/2.0;p.x-=clamp(p.x,-2.0*r,0.0);return -length(p)*sign(p.y);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.95,0.93,0.9);
    float d1=soCircle(uv-vec2(-0.3,0.0),0.2);
    float d2=soBox(uv-vec2(0.0,0.0),vec2(0.15));
    float d3=soTriangle(uv-vec2(0.3,0.0),0.2);
    float w=0.003;
    float outline1=smoothstep(w,0.0,abs(d1)-0.005);
    float outline2=smoothstep(w,0.0,abs(d2)-0.005);
    float angle3=atan(uv.y,uv.x-0.3);float dash3=step(0.0,sin(angle3*8.0+t*3.0));
    float outline3=smoothstep(w,0.0,abs(d3)-0.005)*dash3;
    float fill1=smoothstep(0.005,0.0,d1)*0.1;
    float fill2=smoothstep(0.005,0.0,d2)*0.1;
    col-=fill1*vec3(0.0,0.0,0.3);col-=fill2*vec3(0.0,0.3,0.0);
    col=mix(col,vec3(0.1,0.2,0.8),outline1);
    col=mix(col,vec3(0.2,0.7,0.3),outline2);
    col=mix(col,vec3(0.8,0.2,0.1),outline3);
    float anim=sin(t*2.0)*0.5+0.5;
    float grow=soCircle(uv-vec2(-0.3,0.0),0.2*anim);
    float animOutline=smoothstep(w,0.0,abs(grow)-0.003);
    col=mix(col,vec3(0.8,0.5,0.1),animOutline*0.5);
    fragColor=vec4(col,1.0);}
