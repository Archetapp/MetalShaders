#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 lfRandom2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}

float lfVoronoi(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);
    float minD=1.0;
    for(int x=-1;x<=1;x++){
        for(int y=-1;y<=1;y++){
            vec2 neighbor=vec2(float(x),float(y));
            vec2 point=lfRandom2(i+neighbor);
            point=0.5+0.5*sin(iTime*0.3+6.2832*point);
            float d=length(neighbor+point-f);
            minD=min(minD,d);
        }
    }
    return minD;
}

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.2;
    vec2 p=uv*4.0+vec2(t*0.5,t*0.3);
    float v1=lfVoronoi(p);
    float v2=lfVoronoi(p*2.0+5.0);
    float cracks=smoothstep(0.1,0.0,v1)*0.8+smoothstep(0.05,0.0,v2)*0.4;
    vec3 crustCol=vec3(0.08,0.05,0.04);
    vec3 lavaCol=mix(vec3(1.0,0.3,0.0),vec3(1.0,0.8,0.1),cracks);
    vec3 col=mix(crustCol,lavaCol,cracks);
    float heat=smoothstep(0.3,0.0,v1);
    col+=vec3(0.3,0.05,0.0)*heat;
    float pulse=0.5+0.5*sin(t*3.0+v1*10.0);
    col+=vec3(0.2,0.05,0.0)*pulse*cracks;
    float glow=exp(-v1*5.0)*0.2;
    col+=vec3(0.5,0.1,0.0)*glow;
    fragColor=vec4(col,1.0);
}
