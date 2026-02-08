#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float r=length(uv);float theta=atan(uv.y,uv.x);
    vec3 col=vec3(0.02,0.02,0.06);
    for(int i=0;i<4;i++){float fi=float(i);
        float n=2.0+fi+sin(t*0.3+fi);float d=3.0+fi*0.5;
        float roseR=0.35*cos(n*theta/d+t*0.5*fi*0.2);
        float dist=abs(r-abs(roseR));
        float hue=fi*0.25+t*0.05;
        vec3 rc=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col+=rc*smoothstep(0.008,0.0,dist)*0.6;
        col+=rc*0.002/(dist+0.002)*0.15;}
    float grid=smoothstep(0.002,0.0,abs(uv.x))+smoothstep(0.002,0.0,abs(uv.y));
    for(float ri=0.1;ri<=0.5;ri+=0.1)grid+=smoothstep(0.002,0.0,abs(r-ri))*0.3;
    col+=vec3(0.1)*grid;
    fragColor=vec4(col,1.0);}
