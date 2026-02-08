#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
float edScene(vec2 uv,float t){
    float v=0.0;
    for(int i=0;i<4;i++){float fi=float(i);
        vec2 p=vec2(0.3+fi*0.15,0.5+0.2*sin(t*0.5+fi));
        v+=smoothstep(0.1,0.08,length(uv-p));}
    v+=step(0.5,mod(floor(uv.x*10.0)+floor(uv.y*10.0),2.0))*0.3;
    return v;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    vec2 px=1.0/iResolution*2.0;
    float tl=edScene(uv+vec2(-px.x,px.y),t);float tc=edScene(uv+vec2(0,px.y),t);
    float tr=edScene(uv+vec2(px.x,px.y),t);float ml=edScene(uv+vec2(-px.x,0),t);
    float mr=edScene(uv+vec2(px.x,0),t);float bl=edScene(uv+vec2(-px.x,-px.y),t);
    float bc=edScene(uv+vec2(0,-px.y),t);float br=edScene(uv+vec2(px.x,-px.y),t);
    float gx=-tl-2.0*ml-bl+tr+2.0*mr+br;float gy=-tl-2.0*tc-tr+bl+2.0*bc+br;
    float edge=sqrt(gx*gx+gy*gy);
    float hue=atan(gy,gx)/6.28+0.5;
    vec3 edgeCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
    vec3 col=edgeCol*edge*2.0;
    col+=vec3(0.02,0.02,0.05);
    fragColor=vec4(col,1.0);}
