#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene;scene.r=0.5+0.3*sin(uv.x*8.0+t);
    scene.g=0.4+0.3*sin(uv.y*6.0-t*0.8);
    scene.b=0.3+0.4*cos(length(uv-0.5)*10.0+t*0.5);
    float temp=sin(t*0.3)*0.3;
    scene.r+=temp*0.15;scene.b-=temp*0.15;
    float tint=cos(t*0.4)*0.2;
    scene.g+=tint*0.1;
    float luma=dot(scene,vec3(0.299,0.587,0.114));
    float contrast=1.2+0.3*sin(t*0.5);
    scene=(scene-0.5)*contrast+0.5;
    float saturation=1.0+0.5*sin(t*0.6);
    scene=mix(vec3(luma),scene,saturation);
    float lift=0.02*sin(t*0.7);float gamma=1.0+0.1*cos(t*0.4);float gain=1.0+0.1*sin(t*0.3);
    scene=(scene+lift)*gain;scene=pow(max(scene,0.0),vec3(1.0/gamma));
    scene=clamp(scene,0.0,1.0);
    fragColor=vec4(scene,1.0);}
