#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution.xy)/iResolution.y;
    float t=iTime*0.3;
    float scale=8.0;
    vec2 p=uv*scale;
    vec3 col=vec3(0.08,0.08,0.1);
    vec3 lightDir=normalize(vec3(sin(t)*0.5,cos(t)*0.3,1.0));
    for(int ox=-1;ox<=1;ox++){
        for(int oy=-1;oy<=1;oy++){
            vec2 cell=floor(p)+vec2(float(ox),float(oy));
            float offset=mod(cell.y,2.0)*0.5;
            vec2 center=cell+vec2(0.5+offset,0.5);
            vec2 d=p-center;
            float dist=length(d);
            float ringR=0.4;
            float thick=0.1;
            float ring=abs(dist-ringR)-thick;
            if(ring<0.05){
                float s=smoothstep(0.05,0.0,ring);
                float angle=atan(d.y,d.x);
                vec3 normal=normalize(vec3(cos(angle)*(dist-ringR)/thick,sin(angle)*(dist-ringR)/thick,0.5));
                float diff=max(dot(normal,lightDir),0.0);
                float spec=pow(max(dot(reflect(-lightDir,normal),vec3(0,0,1)),0.0),32.0);
                vec3 metalCol=vec3(0.6,0.6,0.65);
                vec3 ringCol=metalCol*(0.2+0.6*diff)+vec3(1.0)*spec*0.5;
                col=mix(col,ringCol,s);
            }
        }
    }
    fragColor=vec4(col,1.0);
}
