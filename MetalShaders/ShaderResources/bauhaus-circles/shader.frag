#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.95,0.92,0.85);
    vec3 colors[6];
    colors[0]=vec3(0.85,0.15,0.1);colors[1]=vec3(0.1,0.2,0.65);
    colors[2]=vec3(0.9,0.75,0.1);colors[3]=vec3(0.15,0.15,0.15);
    colors[4]=vec3(0.85,0.4,0.1);colors[5]=vec3(0.2,0.55,0.3);
    for(int i=0;i<6;i++){float fi=float(i);
        float angle=fi*1.047+t*0.2;
        float radius=0.15+0.05*sin(t*0.3+fi);
        vec2 center=vec2(cos(angle),sin(angle))*(0.12+0.05*sin(t*0.5+fi));
        float d=length(uv-center);
        float circle=smoothstep(radius,radius-0.003,d);
        col=mix(col,colors[i],circle*0.85);
        float ring=smoothstep(radius+0.003,radius,d)-smoothstep(radius,radius-0.003,d);
        col=mix(col,vec3(0.1),ring*0.5);}
    float outerRing=abs(length(uv)-0.35);
    col=mix(col,vec3(0.1),smoothstep(0.005,0.0,outerRing));
    fragColor=vec4(col,1.0);}
