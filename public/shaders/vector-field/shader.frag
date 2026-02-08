#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float grid=16.0;vec2 cell=floor(uv*grid+0.5);vec2 cellUv=fract(uv*grid+0.5)-0.5;
    vec2 p=cell/grid;
    vec2 field=vec2(sin(p.y*6.28+t),cos(p.x*6.28+t*0.7));
    float mag=length(field);vec2 dir=field/(mag+0.001);
    float angle=atan(dir.y,dir.x);
    float cs=cos(-angle),sn=sin(-angle);
    vec2 rp=vec2(cellUv.x*cs-cellUv.y*sn,cellUv.x*sn+cellUv.y*cs);
    float shaft=smoothstep(0.03,0.01,abs(rp.y))*smoothstep(-0.3,0.0,rp.x)*smoothstep(0.4,0.2,rp.x);
    float head=smoothstep(0.0,-0.1,rp.x-0.2+abs(rp.y)*2.0)*smoothstep(0.2,0.3,rp.x);
    float arrow=(shaft+head)*min(mag*0.5,1.0);
    float hue=angle/6.28+0.5;
    vec3 arrowCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    vec3 col=vec3(0.03,0.03,0.08);
    col+=arrowCol*arrow*0.8;
    float dot_marker=smoothstep(0.06,0.04,length(cellUv));
    col+=vec3(0.15)*dot_marker;
    fragColor=vec4(col,1.0);}
