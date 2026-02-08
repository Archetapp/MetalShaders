#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float dmPattern(vec2 p,float t){
    float wave=sin(p.x*0.3-t*2.0)*0.5+0.5;
    float wave2=sin(p.y*0.5+t*1.5)*0.5+0.5;
    float circle=sin(length(p-vec2(16.0,8.0))*0.5-t*3.0)*0.5+0.5;
    return max(wave*wave2,circle);
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime;
    float gridW=64.0;
    float gridH=32.0;
    vec2 grid=vec2(gridW,gridH);
    vec2 cellUV=uv*grid;
    vec2 cell=floor(cellUV);
    vec2 f=fract(cellUV)-0.5;
    float dotR=0.35;
    float d=length(f);
    float brightness=dmPattern(cell,t);
    float scanline=0.95+0.05*sin(cell.y*3.14159);
    brightness*=scanline;
    vec3 onColor=mix(vec3(0.0,0.8,0.0),vec3(0.0,1.0,0.3),brightness);
    vec3 offColor=vec3(0.02,0.05,0.02);
    float dot_mask=smoothstep(dotR+0.05,dotR-0.05,d);
    vec3 col=mix(offColor,onColor*brightness,dot_mask);
    float glow=exp(-d*d*8.0)*brightness*0.2;
    col+=vec3(0.0,0.3,0.0)*glow;
    col*=0.9+0.1*sin(uv.y*iResolution.y*0.5);
    fragColor=vec4(col,1.0);
}
