#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float blockSize=4.0+12.0*(sin(t*0.3)*0.5+0.5);
    vec2 blocks=floor(uv*blockSize)/blockSize;
    vec3 scene;
    float d=length(blocks-vec2(0.5+0.2*sin(t),0.5+0.2*cos(t*0.7)));
    scene=0.5+0.5*cos(6.28*(d*3.0+t*0.5+vec3(0,0.33,0.67)));
    float circle=smoothstep(0.3,0.25,d);
    scene=mix(vec3(0.1),scene,circle);
    scene+=sin(blocks.x*20.0)*sin(blocks.y*20.0)*0.1;
    vec2 cellUv=fract(uv*blockSize);
    float border=smoothstep(0.0,0.05,cellUv.x)*smoothstep(0.0,0.05,cellUv.y)*
                 smoothstep(1.0,0.95,cellUv.x)*smoothstep(1.0,0.95,cellUv.y);
    scene*=0.9+border*0.1;
    fragColor=vec4(scene,1.0);}
