#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec2 cmMul(vec2 a,vec2 b){return vec2(a.x*b.x-a.y*b.y,a.x*b.y+a.y*b.x);}
vec2 cmDiv(vec2 a,vec2 b){float d=dot(b,b)+1e-10;return vec2(a.x*b.x+a.y*b.y,a.y*b.x-a.x*b.y)/d;}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y*3.0;float t=iTime;
    vec2 z=uv;
    float mode=mod(t*0.15,4.0);
    vec2 w;
    if(mode<1.0)w=cmMul(z,z)+vec2(sin(t*0.3),cos(t*0.3))*0.5;
    else if(mode<2.0)w=cmDiv(vec2(1.0,0.0),z)+vec2(0.5*sin(t*0.3),0.0);
    else if(mode<3.0){w=z;for(int i=0;i<3;i++)w=cmMul(w,w)+vec2(-0.7+0.1*sin(t*0.3),0.27);}
    else w=vec2(exp(z.x)*cos(z.y+t*0.3),exp(z.x)*sin(z.y+t*0.3));
    float angle=atan(w.y,w.x);
    float mag=length(w);
    float hue=angle/6.28318+0.5;
    float brightness=1.0-1.0/(1.0+mag*0.5);
    float rings=fract(log2(mag+0.001))*0.3+0.7;
    vec3 col=0.5+0.5*cos(6.28*(hue+vec3(0.0,0.33,0.67)));
    col*=brightness*rings;
    float grid=smoothstep(0.03,0.0,abs(fract(w.x)-0.5))*0.1+smoothstep(0.03,0.0,abs(fract(w.y)-0.5))*0.1;
    col+=grid;
    fragColor=vec4(col,1.0);}
