#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float lmNoise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);}
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float morph=sin(t*0.8)*0.5+0.5;
    float r=length(uv);float angle=atan(uv.y,uv.x);
    float circle=r;
    float sides=4.0+floor(morph*4.0);
    float polygon=cos(3.14159/sides)/cos(mod(angle+3.14159/sides,2.0*3.14159/sides)-3.14159/sides);
    polygon=r/polygon;
    float shape=mix(circle,polygon*0.5,morph);
    float wobble=lmNoise(vec2(angle*3.0,t*2.0))*0.02;
    float spring=sin(t*8.0)*exp(-mod(t,2.0)*3.0)*0.02;
    shape+=wobble+spring;
    float surface=smoothstep(0.2,0.19,shape);
    float edge=smoothstep(0.2,0.19,shape)-smoothstep(0.19,0.18,shape);
    vec3 col=vec3(0.1,0.1,0.15);
    vec3 shapeCol=mix(vec3(0.3,0.5,0.9),vec3(0.9,0.3,0.5),morph);
    col=mix(col,shapeCol,surface);
    col+=vec3(1.0)*edge*0.3;
    float glow=0.005/(abs(shape-0.2)+0.005);
    col+=shapeCol*glow*0.2;
    fragColor=vec4(col,1.0);}
