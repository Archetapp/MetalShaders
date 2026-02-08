#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.01,0.05);
    for(int i=0;i<30;i++){
        float fi=float(i);float theta=fi*0.21+t*0.1;float phi=fi*0.34+t*0.15;
        float ct=cos(theta),st=sin(theta),cp=cos(phi),sp=sin(phi);
        for(float s=0.0;s<100.0;s+=1.0){
            float psi=s*0.063;
            float a=ct*cos(psi)-st*sin(psi);
            float b=ct*sin(psi)+st*cos(psi);
            float c=cp*cos(psi+t*0.2)-sp*sin(psi+t*0.2);
            float d_val=cp*sin(psi+t*0.2)+sp*cos(psi+t*0.2);
            float w=1.0/(2.5+d_val);
            vec2 proj=vec2(a,b)*w*0.8;
            float dist=length(uv-proj);
            float hue=fi/30.0;
            vec3 fiberCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
            float depthFade=0.3+0.7*w;
            col+=fiberCol*0.00005/(dist+0.002)*depthFade;}}
    col=1.0-exp(-col*3.0);
    fragColor=vec4(col,1.0);}
