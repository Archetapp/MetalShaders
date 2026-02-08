#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.2;
    float scale=8.0;
    vec2 p=uv*scale;
    vec2 cell=floor(p);
    vec2 f=fract(p);
    float stripW=0.85;
    float gap=(1.0-stripW)*0.5;
    bool inHStrip=f.y>gap&&f.y<1.0-gap;
    bool inVStrip=f.x>gap&&f.x<1.0-gap;
    float checker=mod(cell.x+cell.y,2.0);
    vec3 hColor=vec3(0.7+0.1*sin(t),0.5,0.25);
    vec3 vColor=vec3(0.55,0.4+0.1*cos(t),0.2);
    vec3 bgColor=vec3(0.15,0.1,0.05);
    vec3 col=bgColor;
    if(inHStrip&&inVStrip){
        float fy=(f.y-gap)/stripW;
        float fx=(f.x-gap)/stripW;
        float hShade=0.8+0.2*sin(fy*3.14159);
        float vShade=0.8+0.2*sin(fx*3.14159);
        if(checker<0.5){
            col=hColor*hShade;
        } else {
            col=vColor*vShade;
        }
    } else if(inHStrip){
        float fy=(f.y-gap)/stripW;
        col=hColor*(0.8+0.2*sin(fy*3.14159));
    } else if(inVStrip){
        float fx=(f.x-gap)/stripW;
        col=vColor*(0.8+0.2*sin(fx*3.14159));
    }
    float shadow=1.0;
    if(inHStrip&&inVStrip){
        float edgeDist=min(min(f.x-gap,1.0-gap-f.x),min(f.y-gap,1.0-gap-f.y));
        shadow=0.85+0.15*smoothstep(0.0,0.1,edgeDist);
    }
    col*=shadow;
    fragColor=vec4(col,1.0);
}
