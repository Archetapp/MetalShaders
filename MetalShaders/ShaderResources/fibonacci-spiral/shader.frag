#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.04,0.02);
    float goldenAngle=2.39996;
    int count=int(50.0+50.0*sin(t*0.3));
    for(int i=0;i<200;i++){if(i>=count)break;
        float fi=float(i);float angle=fi*goldenAngle;
        float r=0.02*sqrt(fi);
        vec2 pos=vec2(cos(angle+t*0.2),sin(angle+t*0.2))*r;
        float d=length(uv-pos);
        float seedSize=0.008+0.004*sin(fi*0.1+t);
        float seed=smoothstep(seedSize,seedSize-0.003,d);
        float hue=fi/float(count);
        vec3 seedCol=mix(vec3(0.6,0.4,0.1),vec3(0.2,0.5,0.1),hue);
        col+=seedCol*seed;
        col+=seedCol*0.0003/(d+0.003)*0.5;}
    float spiral=0.0;
    for(float s=0.0;s<50.0;s+=0.1){
        float angle=s*goldenAngle;float r=0.02*sqrt(s);
        vec2 pos=vec2(cos(angle+t*0.2),sin(angle+t*0.2))*r;
        float d=length(uv-pos);
        spiral+=0.0001/(d+0.002);}
    col+=vec3(0.3,0.5,0.1)*spiral*0.3;
    fragColor=vec4(col,1.0);}
