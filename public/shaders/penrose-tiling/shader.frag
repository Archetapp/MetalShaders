#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float penHash(vec2 p){return fract(sin(dot(p,vec2(41.1,67.7)))*4758.5);}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.2;
    float minD=1e9;
    vec3 col=vec3(0.02,0.02,0.05);
    for(int i=0;i<5;i++){
        float angle=float(i)*3.14159265/5.0+t*0.1;
        float ca=cos(angle),sa=sin(angle);
        vec2 ruv=mat2(ca,-sa,sa,ca)*uv;
        float s=0.3;
        vec2 cell=floor(ruv/s+0.5)*s;
        float d=length(ruv-cell);
        float h=penHash(cell+float(i)*100.0);
        if(d<minD){
            minD=d;
            vec3 hc=0.5+0.4*cos(t*0.5+h*6.28+vec3(0,2,4)+float(i)*1.2);
            col=hc;
        }
    }
    float edge=smoothstep(0.0,0.01,abs(minD-0.06));
    col*=mix(1.5,1.0,edge);
    float grid=0.0;
    for(int i=0;i<5;i++){
        float angle=float(i)*3.14159265/5.0+t*0.1;
        float ca=cos(angle),sa=sin(angle);
        vec2 ruv=mat2(ca,-sa,sa,ca)*uv;
        float s=0.3;
        vec2 f=fract(ruv/s+0.5)-0.5;
        float d=min(abs(f.x),abs(f.y));
        grid=max(grid,1.0-smoothstep(0.0,0.008,d));
    }
    col=mix(col,vec3(0.9,0.85,0.7),grid*0.4);
    fragColor=vec4(col,1.0);
}
