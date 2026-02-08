#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.3;
    float scale=8.0;
    vec2 p=uv*scale;
    vec2 cell=floor(p);
    vec2 f=fract(p);
    float checker=mod(cell.x+cell.y,2.0);
    float hound=0.0;
    if(checker<0.5){
        hound=(f.x<0.5&&f.y<0.5)?1.0:0.0;
        if(f.x>=0.5&&f.y<0.5&&f.x-0.5<f.y) hound=1.0;
        if(f.x<0.5&&f.y>=0.5&&f.y-0.5<f.x) hound=1.0;
    } else {
        hound=(f.x>=0.5&&f.y>=0.5)?1.0:0.0;
        if(f.x<0.5&&f.y>=0.5&&(1.0-f.x-0.5)<(1.0-f.y)) hound=1.0;
        if(f.x>=0.5&&f.y<0.5&&(1.0-f.y-0.5)<(1.0-f.x)) hound=1.0;
    }
    vec3 c1=0.5+0.3*cos(t+vec3(0,2,4));
    vec3 c2=vec3(0.95,0.92,0.88);
    vec3 col=mix(c2,c1,hound);
    float vignette=1.0-0.3*length(uv-0.5);
    col*=vignette;
    fragColor=vec4(col,1.0);
}
