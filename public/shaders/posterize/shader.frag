#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec3 scene=vec3(0.0);
    float d=length(uv-vec2(0.5));
    scene.r=0.5+0.5*sin(uv.x*5.0+t);
    scene.g=0.5+0.5*sin(uv.y*7.0-t*0.7);
    scene.b=0.5+0.5*cos(d*10.0+t*0.5);
    float levels=max(1.0,3.0+3.0*sin(t*0.3));
    vec3 posterized=floor(scene*levels+0.5)/levels;
    float blend=smoothstep(0.48,0.52,uv.x+0.1*sin(t*0.5));
    vec3 col=mix(scene,posterized,blend);
    col=pow(col,vec3(0.9));
    fragColor=vec4(col,1.0);}
