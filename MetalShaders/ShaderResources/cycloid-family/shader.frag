#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.02,0.06);
    float R=0.2;float r1=0.08+0.03*sin(t*0.3);
    for(float s=0.0;s<500.0;s+=1.0){
        float param=s*0.013;
        float epiX=(R+r1)*cos(param)-(r1)*cos((R+r1)/r1*param);
        float epiY=(R+r1)*sin(param)-(r1)*sin((R+r1)/r1*param);
        vec2 epiPos=vec2(epiX,epiY+0.2);
        float d=length(uv-epiPos);
        float hue=param*0.05+t*0.1;
        vec3 c=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col+=c*smoothstep(0.004,0.001,d)*0.1;
        col+=c*0.0002/(d+0.002)*0.2;}
    float r2=0.12+0.04*cos(t*0.4);
    for(float s=0.0;s<500.0;s+=1.0){
        float param=s*0.013;
        float hypoX=(R-r2)*cos(param)+(r2)*cos((R-r2)/r2*param);
        float hypoY=(R-r2)*sin(param)-(r2)*sin((R-r2)/r2*param);
        vec2 hypoPos=vec2(hypoX,hypoY-0.2);
        float d=length(uv-hypoPos);
        float hue=param*0.05+t*0.1+0.5;
        vec3 c=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        col+=c*smoothstep(0.004,0.001,d)*0.1;
        col+=c*0.0002/(d+0.002)*0.2;}
    fragColor=vec4(col,1.0);}
