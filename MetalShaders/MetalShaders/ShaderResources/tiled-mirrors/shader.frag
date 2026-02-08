#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.3;
    float scale=3.0;
    vec2 p=uv*scale;
    vec2 cell=floor(p);
    vec2 f=fract(p);
    f=abs(f*2.0-1.0);
    float angle=t*0.5+cell.x*0.7+cell.y*1.3;
    float c=cos(angle),s=sin(angle);
    vec2 rf=mat2(c,-s,s,c)*f;
    vec3 col=vec3(0.0);
    for(int i=0;i<6;i++){
        float fi=float(i);
        float a=fi*1.0472+t*0.2;
        vec2 d=vec2(cos(a),sin(a));
        float v=sin(dot(rf,d)*8.0+t*2.0+fi);
        vec3 hue=0.5+0.5*cos(fi*0.9+t*0.3+vec3(0,2,4));
        col+=hue*v*0.2;
    }
    col=abs(col);
    col=pow(col,vec3(0.8));
    float edge=min(min(f.x,f.y),min(1.0-f.x,1.0-f.y));
    float border=1.0-smoothstep(0.0,0.05,edge);
    col=mix(col,vec3(1),border*0.3);
    fragColor=vec4(col,1.0);
}
