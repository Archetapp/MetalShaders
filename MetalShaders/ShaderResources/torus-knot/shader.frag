#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    vec3 col=vec3(0.02,0.02,0.06);
    float p_val=3.0;float q_val=2.0+sin(t*0.2);
    float R=0.25;float r_val=0.1;
    for(float s=0.0;s<300.0;s+=1.0){
        float param=s*0.021;
        float cp=cos(p_val*param+t*0.3);float sp=sin(p_val*param+t*0.3);
        float cq=cos(q_val*param);float sq_val=sin(q_val*param);
        float x=(R+r_val*cq)*cp;float y=(R+r_val*cq)*sp;float z=r_val*sq_val;
        float viewAngle=t*0.2;
        float px=x*cos(viewAngle)-z*sin(viewAngle);
        float py=y;
        float pz=x*sin(viewAngle)+z*cos(viewAngle);
        float scale=1.0/(2.0+pz);
        vec2 proj=vec2(px,py)*scale;
        float d=length(uv-proj);
        float thickness=0.004*(0.5+scale);
        float hue=param*0.3;
        vec3 knotCol=0.5+0.5*cos(6.28*(hue+vec3(0,0.33,0.67)));
        float bright=0.5+0.5*pz;
        col+=knotCol*smoothstep(thickness,thickness-0.002,d)*bright*0.15;
        col+=knotCol*0.0002/(d+0.002)*bright*0.3;}
    fragColor=vec4(col,1.0);}
