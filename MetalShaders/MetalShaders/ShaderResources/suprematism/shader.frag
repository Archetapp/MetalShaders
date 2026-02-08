#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float spHash(float p){return fract(sin(p*127.1)*43758.5);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.95,0.93,0.9);
    for(int i=0;i<8;i++){float fi=float(i);
        vec2 pos=vec2(spHash(fi*3.0)-0.5,spHash(fi*3.0+1.0)-0.5)*0.6;
        pos+=vec2(sin(t*0.2+fi),cos(t*0.15+fi*1.3))*0.03;
        float angle=spHash(fi*3.0+2.0)*3.14+t*0.1*(spHash(fi)-0.5);
        float w=0.05+spHash(fi*5.0)*0.15;float h=0.02+spHash(fi*5.0+1.0)*0.1;
        vec2 d=uv-pos;float cs=cos(angle),sn=sin(angle);
        vec2 rd=vec2(d.x*cs-d.y*sn,d.x*sn+d.y*cs);
        float rect=step(abs(rd.x),w)*step(abs(rd.y),h);
        vec3 shapeCol;float ci=mod(fi,4.0);
        if(ci<1.0)shapeCol=vec3(0.85,0.1,0.1);
        else if(ci<2.0)shapeCol=vec3(0.1,0.1,0.1);
        else if(ci<3.0)shapeCol=vec3(0.1,0.15,0.55);
        else shapeCol=vec3(0.9,0.75,0.1);
        col=mix(col,shapeCol,rect);}
    float cross1=step(abs(uv.x),0.005)*step(abs(uv.y-0.1),0.15);
    float cross2=step(abs(uv.y),0.005)*step(abs(uv.x+0.1),0.15);
    col=mix(col,vec3(0.1),max(cross1,cross2)*0.5);
    fragColor=vec4(col,1.0);}
