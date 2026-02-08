#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float padHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float panels=3.0;vec2 panel=floor(uv*vec2(panels,panels));
    vec2 panelUv=fract(uv*vec2(panels,panels));
    float panelId=padHash(panel+floor(t*0.1));
    vec3 bgCol,dotCol;
    if(panelId>0.8){bgCol=vec3(1.0,0.2,0.3);dotCol=vec3(1.0,0.8,0.2);}
    else if(panelId>0.6){bgCol=vec3(0.1,0.3,0.8);dotCol=vec3(1.0,1.0,1.0);}
    else if(panelId>0.4){bgCol=vec3(1.0,0.8,0.0);dotCol=vec3(0.9,0.2,0.1);}
    else if(panelId>0.2){bgCol=vec3(0.2,0.7,0.3);dotCol=vec3(0.05,0.1,0.05);}
    else{bgCol=vec3(0.9,0.4,0.7);dotCol=vec3(0.2,0.1,0.3);}
    float dotScale=15.0+5.0*sin(t*0.5+panelId*3.0);
    vec2 dotUv=fract(panelUv*dotScale)-0.5;
    float dotDist=length(dotUv);
    float dotSize=0.3+0.1*sin(t+panelId*5.0);
    float dot_val=smoothstep(dotSize,dotSize-0.05,dotDist);
    vec3 col=mix(bgCol,dotCol,dot_val);
    float border=smoothstep(0.01,0.02,panelUv.x)*smoothstep(0.01,0.02,panelUv.y)*
                 smoothstep(0.99,0.98,panelUv.x)*smoothstep(0.99,0.98,panelUv.y);
    col*=0.8+0.2*border;
    fragColor=vec4(col,1.0);}
