#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.03,0.08);
    float sum=0.0;
    for(int i=0;i<7;i++){float fi=float(i);
        float freq=1.0+fi*0.7;float amp=0.15/(1.0+fi*0.3);
        float phase=t*(0.5+fi*0.2)+fi*0.5;
        float wave=sin(uv.x*freq*6.28+phase)*amp;
        sum+=wave;
        float wd=abs(uv.y-wave);
        float hue=fi/7.0;
        vec3 wc=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col+=wc*smoothstep(0.008,0.0,wd)*0.4;
        col+=wc*0.002/(wd+0.002)*0.1;}
    float sumDist=abs(uv.y-sum);
    col+=vec3(1.0,0.9,0.5)*smoothstep(0.005,0.0,sumDist);
    col+=vec3(1.0,0.9,0.5)*0.003/(sumDist+0.003)*0.3;
    float axis=smoothstep(0.002,0.0,abs(uv.y))+smoothstep(0.002,0.0,abs(uv.x));
    col+=vec3(0.15)*axis;
    fragColor=vec4(col,1.0);}
