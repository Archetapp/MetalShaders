#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float sgHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 sgRandom(vec2 p){return vec2(sgHash(p),sgHash(p+vec2(37.0,71.0)));}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    float scale=6.0;vec2 p=uv*scale;
    float minDist=10.0;float secondDist=10.0;vec2 closestCell=vec2(0.0);
    for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){
        vec2 cell=floor(p)+vec2(float(x),float(y));
        vec2 point=cell+sgRandom(cell)*0.8+0.1;
        float d=length(p-point);
        if(d<minDist){secondDist=minDist;minDist=d;closestCell=cell;}
        else if(d<secondDist){secondDist=d;}}
    float edge=secondDist-minDist;
    float lead=1.0-smoothstep(0.0,0.08,edge);
    float cellId=sgHash(closestCell);
    vec3 glassColors[6];
    glassColors[0]=vec3(0.8,0.1,0.1);glassColors[1]=vec3(0.1,0.2,0.8);
    glassColors[2]=vec3(0.9,0.7,0.1);glassColors[3]=vec3(0.1,0.6,0.2);
    glassColors[4]=vec3(0.6,0.1,0.6);glassColors[5]=vec3(0.8,0.4,0.1);
    int idx=int(cellId*6.0);
    vec3 glass=glassColors[idx];
    float lightAngle=t*0.3;
    float light=0.6+0.4*sin(uv.x*3.14159+lightAngle)*sin(uv.y*3.14159+lightAngle*0.7);
    vec3 col=glass*light*(1.0-lead*0.8);
    col=mix(col,vec3(0.02),lead);
    float glow=exp(-minDist*2.0)*0.2;
    col+=glass*glow;
    fragColor=vec4(col,1.0);}
