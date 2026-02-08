#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene=vec3(0.0);
    float checker=mod(floor(uv.x*20.0)+floor(uv.y*20.0),2.0);
    scene=mix(vec3(0.3,0.5,0.7),vec3(0.7,0.5,0.3),checker);
    scene+=0.1*sin(uv.x*10.0+t)*sin(uv.y*10.0-t);
    vec2 center=vec2(0.5);float d=length((uv-center)*vec2(iResolution.x/iResolution.y,1.0));
    float mode=mod(floor(t*0.2),4.0);
    float vig;
    if(mode<1.0)vig=1.0-d*d*1.5;
    else if(mode<2.0)vig=smoothstep(0.8,0.2,d);
    else if(mode<3.0)vig=1.0-pow(d*1.2,3.0);
    else vig=cos(d*1.57)*cos(d*1.57);
    vig=clamp(vig,0.0,1.0);
    float strength=0.5+0.3*sin(t*0.5);
    vig=mix(1.0,vig,strength);
    scene*=vig;
    fragColor=vec4(scene,1.0);}
