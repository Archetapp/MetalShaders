#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float bubHash(float n){return fract(sin(n)*43758.5453);}

vec3 bubIridescence(float angle,float thickness){
    float d=thickness*cos(angle)*2.0;
    vec3 col;
    col.r=0.5+0.5*cos(d*12.0+0.0);
    col.g=0.5+0.5*cos(d*12.0+2.1);
    col.b=0.5+0.5*cos(d*12.0+4.2);
    return col;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime;
    vec3 col=vec3(0.05,0.08,0.15);
    for(int i=0;i<15;i++){
        float fi=float(i);
        float h=bubHash(fi*7.3);
        float speed=0.15+h*0.2;
        vec2 center;
        center.x=sin(fi*2.4+t*0.3+h*6.28)*0.5;
        center.y=mod(-0.7+fi*0.12+t*speed,1.8)-0.9;
        float radius=0.05+h*0.08;
        vec2 d=uv-center;
        float dist=length(d);
        if(dist<radius){
            float normDist=dist/radius;
            vec3 normal=normalize(vec3(d/radius,sqrt(max(0.0,1.0-normDist*normDist))));
            float fresnel=pow(1.0-normal.z,3.0);
            float angle=acos(normal.z);
            float thickness=0.3+0.2*sin(fi*3.7+t);
            vec3 irid=bubIridescence(angle,thickness);
            float spec=pow(max(dot(normal,normalize(vec3(0.3,0.5,1.0))),0.0),64.0);
            vec3 bubCol=irid*fresnel*0.8+vec3(1.0)*spec*0.6;
            bubCol+=vec3(0.1,0.15,0.2)*(1.0-fresnel)*0.3;
            float edge=smoothstep(radius,radius-0.005,dist);
            float rim=smoothstep(0.7,1.0,normDist)*0.4;
            col=mix(col,bubCol,edge*(0.5+rim));
        }
    }
    fragColor=vec4(col,1.0);
}
