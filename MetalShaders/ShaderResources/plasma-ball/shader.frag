#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float pbNoise(float p){float i=floor(p);float f=fract(p);f=f*f*(3.0-2.0*f);return mix(fract(sin(i)*43758.5),fract(sin(i+1.0)*43758.5),f);}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 col=vec3(0.01,0.0,0.02);
    float sphereR=0.38;
    float r=length(uv);
    float sphereMask=smoothstep(sphereR,sphereR-0.01,r);
    float glassEdge=smoothstep(sphereR+0.01,sphereR-0.02,r)-smoothstep(sphereR-0.02,sphereR-0.05,r);
    col+=vec3(0.1,0.1,0.15)*glassEdge;
    float a=atan(uv.y,uv.x);
    for(int i=0;i<8;i++){
        float fi=float(i);
        float angle=fi*0.785+t*0.3+sin(t+fi)*0.5;
        vec2 target=vec2(cos(angle),sin(angle))*sphereR*0.9;
        vec2 dir=target;
        float len=length(dir);
        for(float s=0.0;s<1.0;s+=0.01){
            vec2 pos=dir*s;
            float wobble=pbNoise(s*10.0+t*8.0+fi*5.0)*0.04;
            pos+=vec2(cos(angle+1.57),sin(angle+1.57))*wobble*(1.0-s*0.5);
            float d=length(uv-pos);
            float width=0.003*(1.0-s*0.5);
            float glow=width/(d+0.001);
            float flicker=0.7+0.3*pbNoise(t*12.0+fi*3.0);
            vec3 filCol=mix(vec3(0.4,0.2,1.0),vec3(0.8,0.5,1.0),s);
            col+=filCol*glow*0.02*flicker*sphereMask;
        }
    }
    float coreGlow=0.02/(r*r+0.001)*sphereMask;
    col+=vec3(0.5,0.3,1.0)*coreGlow*0.03;
    float refl=pow(max(0.0,1.0-r/sphereR),0.5)*0.1;
    col+=vec3(0.15,0.1,0.2)*refl*sphereMask;
    fragColor=vec4(col,1.0);
}
