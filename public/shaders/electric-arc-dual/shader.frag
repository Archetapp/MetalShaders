#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float eadHash(float n){return fract(sin(n)*43758.5453);}
float eadNoise(float p){float i=floor(p);float f=fract(p);f=f*f*(3.0-2.0*f);return mix(eadHash(i),eadHash(i+1.0),f);}

float eadArc(vec2 uv,vec2 a,vec2 b,float t,float seed){
    vec2 ab=b-a;
    float len=length(ab);
    vec2 dir=ab/len;
    vec2 n=vec2(-dir.y,dir.x);
    vec2 ap=uv-a;
    float along=dot(ap,dir)/len;
    float perp=dot(ap,n);
    if(along<0.0||along>1.0) return 0.0;
    float displacement=0.0;
    float amp=0.08;
    for(int i=0;i<5;i++){
        float fi=float(i);
        float freq=3.0+fi*4.0;
        displacement+=amp*eadNoise(along*freq+t*15.0+seed+fi*7.3);
        amp*=0.5;
    }
    displacement-=0.08;
    float dist=abs(perp-displacement);
    float taper=smoothstep(0.0,0.1,along)*smoothstep(1.0,0.9,along);
    float glow=0.003/(dist+0.001)*taper;
    return glow;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 col=vec3(0.02,0.02,0.05);
    vec2 p1=vec2(-0.35,0.0);
    vec2 p2=vec2(0.35,0.0);
    for(int i=0;i<5;i++){
        float fi=float(i);
        float arc=eadArc(uv,p1,p2,t+fi*0.1,fi*13.7);
        float flicker=0.5+0.5*eadNoise(t*10.0+fi*5.0);
        vec3 arcCol=mix(vec3(0.3,0.4,1.0),vec3(0.7,0.8,1.0),arc*0.1);
        col+=arcCol*arc*flicker*0.3;
    }
    for(int i=0;i<2;i++){
        vec2 pt=i==0?p1:p2;
        float d=length(uv-pt);
        float glow=0.01/(d*d+0.001);
        col+=vec3(0.3,0.5,1.0)*glow*0.05;
    }
    col=pow(col,vec3(0.85));
    fragColor=vec4(col,1.0);
}
