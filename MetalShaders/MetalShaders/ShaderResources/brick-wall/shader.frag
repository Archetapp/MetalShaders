#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float bwHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float bwNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(bwHash(i),bwHash(i+vec2(1,0)),f.x),mix(bwHash(i+vec2(0,1)),bwHash(i+vec2(1,1)),f.x),f.y);
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float t=iTime*0.1;
    vec2 brickSize=vec2(0.15,0.075);
    float row=floor(uv.y/brickSize.y);
    float offset=mod(row,2.0)*0.5*brickSize.x;
    vec2 brickUV=vec2((uv.x+offset)/brickSize.x,uv.y/brickSize.y);
    vec2 cell=floor(brickUV);
    vec2 f=fract(brickUV);
    float mortar=0.06;
    float mx=smoothstep(0.0,mortar,f.x)*smoothstep(1.0,1.0-mortar,f.x);
    float my=smoothstep(0.0,mortar,f.y)*smoothstep(1.0,1.0-mortar,f.y);
    float m=mx*my;
    float h=bwHash(cell);
    float n=bwNoise(cell*5.0+f*3.0);
    vec3 brickCol=vec3(0.65+0.15*h,0.25+0.1*h,0.15+0.08*h);
    brickCol+=0.05*n;
    brickCol+=0.03*sin(t+cell.x*2.0+vec3(0,1,2));
    vec3 mortarCol=vec3(0.75,0.73,0.7);
    vec3 col=mix(mortarCol,brickCol,m);
    float ao=smoothstep(0.0,0.15,f.x)*smoothstep(0.0,0.15,f.y)*smoothstep(1.0,0.85,f.x)*smoothstep(1.0,0.85,f.y);
    col*=0.85+0.15*ao;
    fragColor=vec4(col,1.0);
}
