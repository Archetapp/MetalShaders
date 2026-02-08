#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 dlnRandPt(float i,float t){
    float a=i*2.399+t*0.3;
    float r=0.3+0.15*sin(i*1.7+t*0.5);
    return vec2(0.5+r*cos(a),0.5+r*sin(a));
}

float dlnSegDist(vec2 p,vec2 a,vec2 b){
    vec2 pa=p-a,ba=b-a;
    float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);
    return length(pa-ba*h);
}

void main(){
    vec2 uv=gl_FragCoord.xy/iResolution.xy;
    float aspect=iResolution.x/iResolution.y;
    uv.x*=aspect;
    float t=iTime;
    const int N=12;
    vec2 pts[12];
    for(int i=0;i<N;i++){
        pts[i]=dlnRandPt(float(i),t);
        pts[i].x*=aspect;
    }
    vec3 col=vec3(0.03,0.03,0.08);
    float minEdge=1e9;
    for(int i=0;i<N;i++){
        for(int j=i+1;j<N;j++){
            float d=length(pts[i]-pts[j]);
            if(d<0.6*aspect){
                float sd=dlnSegDist(uv,pts[i],pts[j]);
                float glow=0.002/max(sd,0.001);
                float hue=float(i+j)*0.3+t*0.2;
                vec3 lc=0.5+0.5*cos(hue+vec3(0,2,4));
                col+=lc*glow*0.3;
                minEdge=min(minEdge,sd);
            }
        }
    }
    for(int i=0;i<N;i++){
        float d=length(uv-pts[i]);
        float dot_g=0.004/(d*d+0.0001);
        col+=vec3(0.8,0.9,1.0)*dot_g*0.05;
    }
    col=pow(col,vec3(0.9));
    fragColor=vec4(col,1.0);
}
