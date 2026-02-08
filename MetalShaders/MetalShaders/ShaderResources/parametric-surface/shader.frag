#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.02,0.06);
    float maxT=t*0.5;
    for(float s=0.0;s<200.0;s+=1.0){
        float param=s*0.05;if(param>maxT)break;
        float butterflyR=exp(sin(param))-2.0*cos(4.0*param)+pow(sin((2.0*param-3.14159)/24.0),5.0);
        butterflyR*=0.08;
        vec2 pos=vec2(sin(param)*butterflyR,cos(param)*butterflyR);
        float d=length(uv-pos);
        float hue=param*0.05;
        vec3 c=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col+=c*0.001/(d+0.002)*(0.5+0.5*sin(s*0.1));
        float point=smoothstep(0.005,0.002,d);
        col+=c*point*0.3;}
    for(float s=0.0;s<100.0;s+=1.0){
        float param=s*0.08;
        float a=0.2+0.1*sin(t*0.3);float b=0.15+0.05*cos(t*0.4);
        vec2 pos=vec2(a*sin(param*3.0+t),b*sin(param*2.0));
        float d=length(uv-pos);
        col+=vec3(0.8,0.6,0.2)*0.001/(d+0.003)*0.5;}
    fragColor=vec4(col,1.0);}
