#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.02,0.04);
    float r=length(uv);float angle=atan(uv.y,uv.x);
    float breathe=sin(t*1.5)*0.3+0.7;
    float radius=0.2*breathe;
    float ringWidth=0.02+0.01*sin(t*3.0);
    float ring=smoothstep(ringWidth,0.0,abs(r-radius));
    float waveRing=sin(angle*6.0+t*2.0)*0.005;
    float ring2=smoothstep(ringWidth,0.0,abs(r-radius+waveRing));
    ring=max(ring,ring2*0.7);
    float hue=fract(t*0.1);
    vec3 glowCol1=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    vec3 glowCol2=0.5+0.5*cos(6.28*(hue+0.3+vec3(0,0.33,0.67)));
    vec3 ringCol=mix(glowCol1,glowCol2,sin(angle*2.0+t)*0.5+0.5);
    col+=ringCol*ring;
    float glow=0.01/(abs(r-radius)+0.01)*breathe;
    col+=ringCol*glow*0.15;
    float innerGlow=exp(-r*r*30.0/breathe)*0.1*breathe;
    col+=ringCol*innerGlow;
    for(int i=1;i<=3;i++){float fi=float(i);
        float outerR=radius+fi*0.04*breathe;
        float outerRing=smoothstep(0.005,0.0,abs(r-outerR));
        col+=ringCol*outerRing*(0.3/fi);}
    fragColor=vec4(col,1.0);}
