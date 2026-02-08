#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
vec3 kfScene(vec2 uv,float t){
    vec3 c;c.r=sin(uv.x*8.0+t)*0.4+0.5;c.g=sin(uv.y*6.0-t*0.7)*0.4+0.5;
    c.b=cos(length(uv-0.5)*12.0+t)*0.4+0.5;
    float d=smoothstep(0.2,0.15,length(uv-vec2(0.5+0.15*sin(t*0.5),0.5)));
    c=mix(c,vec3(0.9,0.3,0.2),d);return c;}
void main(){
    vec2 uv=gl_FragCoord.xy/iResolution;float t=iTime;
    int radius=3;float px=2.0/iResolution.x;
    vec3 bestMean;float bestVar=1e10;
    for(int q=0;q<4;q++){
        vec3 mean=vec3(0.0);vec3 sq=vec3(0.0);float count=0.0;
        int ox=q%2==0?-radius:0;int oy=q<2?-radius:0;
        int ex=q%2==0?0:radius;int ey=q<2?0:radius;
        for(int x=ox;x<=ex;x++)for(int y=oy;y<=ey;y++){
            vec3 s=kfScene(uv+vec2(float(x),float(y))*px,t);
            mean+=s;sq+=s*s;count+=1.0;}
        mean/=count;sq/=count;
        float var=dot(sq-mean*mean,vec3(1.0));
        if(var<bestVar){bestVar=var;bestMean=mean;}}
    fragColor=vec4(bestMean,1.0);}
