#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float srNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float progress=fract(t*0.2);
    vec3 sceneA=vec3(0.2,0.3,0.5)+vec3(0.1)*sin(uv.x*10.0+t)*sin(uv.y*10.0);
    vec3 sceneB=vec3(0.5,0.2,0.3)+vec3(0.1)*cos(uv.x*8.0-t)*cos(uv.y*8.0);
    float angle=0.7854;float cs=cos(angle),sn=sin(angle);
    float diag=uv.x*cs+uv.y*sn;
    float wipePos=progress*2.0-0.5;
    float feather=0.05+0.03*sin(t*2.0);
    float noise=srNoise(uv*20.0)*0.03;
    float wipe=smoothstep(wipePos-feather,wipePos+feather,diag+noise);
    vec3 col=mix(sceneA,sceneB,wipe);
    float edge=smoothstep(wipePos-feather*0.5,wipePos,diag+noise)-smoothstep(wipePos,wipePos+feather*0.5,diag+noise);
    col+=vec3(1.0)*edge*0.3;
    fragColor=vec4(col,1.0);}
