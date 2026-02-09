#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y*3.0;float t=iTime;
    float mode=mod(t*0.1,3.0);
    vec2 field;
    if(mode<1.0){field=vec2(-uv.y-uv.x*(uv.x*uv.x+uv.y*uv.y-1.0),uv.x-uv.y*(uv.x*uv.x+uv.y*uv.y-1.0));}
    else if(mode<2.0){field=vec2(uv.y,-sin(uv.x)+0.1*uv.y*sin(t*0.5));}
    else{field=vec2(uv.x-uv.x*uv.y,uv.x*uv.y-uv.y);}
    float mag=length(field);vec2 dir=field/(mag+0.001);
    float angle=atan(dir.y,dir.x);
    float arrows=sin(dot(uv,dir)*20.0+mag*5.0-t*3.0)*0.5+0.5;
    float hue=angle/6.28+0.5;
    vec3 col=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    col*=0.3+0.5*arrows*min(mag*0.5,1.0);
    float streamline=0.0;
    vec2 pos=uv;
    for(int i=0;i<30;i++){
        vec2 f2;
        if(mode<1.0)f2=vec2(-pos.y-pos.x*(dot(pos,pos)-1.0),pos.x-pos.y*(dot(pos,pos)-1.0));
        else if(mode<2.0)f2=vec2(pos.y,-sin(pos.x)+0.1*pos.y*sin(t*0.5));
        else f2=vec2(pos.x-pos.x*pos.y,pos.x*pos.y-pos.y);
        pos-=normalize(f2+0.001)*0.05;
        float d=length(uv-pos);
        streamline+=0.001/(d+0.005)*(1.0-float(i)/30.0);}
    col+=vec3(1.0)*streamline*0.3;
    col+=vec3(0.1)*smoothstep(0.03,0.0,abs(uv.x))+vec3(0.1)*smoothstep(0.03,0.0,abs(uv.y));
    fragColor=vec4(col,1.0);}
