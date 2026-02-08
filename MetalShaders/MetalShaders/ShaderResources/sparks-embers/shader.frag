#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float seHash(float n){return fract(sin(n)*43758.5453);}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 col=vec3(0.02,0.01,0.01);
    float glowBase=exp(-length(uv-vec2(0,-0.4))*3.0)*0.15;
    col+=vec3(0.3,0.1,0.02)*glowBase;
    for(int i=0;i<50;i++){
        float fi=float(i);
        float h1=seHash(fi*7.3);
        float h2=seHash(fi*13.1);
        float h3=seHash(fi*19.7);
        float life=mod(t*0.3+h1*3.0,1.5);
        float alive=smoothstep(0.0,0.05,life)*smoothstep(1.5,1.2,life);
        float x=h2*0.6-0.3+sin(life*4.0+h1*6.28)*0.1;
        float y=-0.35+life*0.6;
        float wind=sin(t*0.5+h1*10.0)*0.05*life;
        x+=wind;
        vec2 sparkPos=vec2(x,y);
        float d=length(uv-sparkPos);
        float size=0.003+h3*0.004;
        float spark=size/(d*d+0.0001)*alive;
        float heat=1.0-life/1.5;
        vec3 sparkCol=mix(vec3(1.0,0.3,0.0),vec3(1.0,0.8,0.2),heat);
        sparkCol=mix(sparkCol,vec3(0.5,0.1,0.0),1.0-heat);
        col+=sparkCol*spark*0.015;
    }
    col=pow(col,vec3(0.9));
    fragColor=vec4(col,1.0);
}
