#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float checker=mod(floor((uv.x+0.5)*10.0)+floor((uv.y+0.5)*10.0),2.0);
    vec3 scene=mix(vec3(0.2,0.3,0.6),vec3(0.3,0.5,0.8),checker);
    scene+=0.05*sin(uv.x*20.0)*sin(uv.y*20.0);
    float cycle=mod(t,2.5);
    float waveR=cycle*0.5;
    float waveWidth=0.08;
    float r=length(uv);
    float waveDist=abs(r-waveR);
    float wave=smoothstep(waveWidth,0.0,waveDist);
    float fade=1.0-cycle/2.5;
    wave*=fade;
    vec2 distortDir=normalize(uv+0.001)*wave*0.05;
    vec2 distortedUv=uv+distortDir;
    float dChecker=mod(floor((distortedUv.x+0.5)*10.0)+floor((distortedUv.y+0.5)*10.0),2.0);
    vec3 distorted=mix(vec3(0.2,0.3,0.6),vec3(0.3,0.5,0.8),dChecker);
    distorted+=0.05*sin(distortedUv.x*20.0)*sin(distortedUv.y*20.0);
    vec3 col=mix(scene,distorted,min(wave*3.0,1.0));
    float ring=smoothstep(waveWidth,waveWidth*0.5,waveDist)-smoothstep(waveWidth*0.5,0.0,waveDist);
    col+=vec3(0.5,0.7,1.0)*ring*fade*0.5;
    fragColor=vec4(col,1.0);}
