#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*iResolution)/iResolution.y;float t=iTime;
    float sep=sin(t*0.8)*0.25;
    vec2 blob1=vec2(-sep,0.05*sin(t*1.5));
    vec2 blob2=vec2(sep,0.05*cos(t*1.3));
    vec2 blob3=vec2(0.05*sin(t*2.0),sep*0.5);
    float d1=length(uv-blob1);float d2=length(uv-blob2);float d3=length(uv-blob3);
    float r1=0.12,r2=0.1,r3=0.08;
    float field=r1*r1/(d1*d1+0.001)+r2*r2/(d2*d2+0.001)+r3*r3/(d3*d3+0.001);
    float threshold=1.0;
    float blob=smoothstep(threshold-0.1,threshold+0.1,field);
    vec3 col=vec3(0.95,0.95,0.97);
    vec3 blobCol=mix(vec3(0.9,0.2,0.4),vec3(0.3,0.2,0.8),sin(t*0.5)*0.5+0.5);
    col=mix(col,blobCol,blob);
    float edge=smoothstep(threshold-0.2,threshold,field)-smoothstep(threshold,threshold+0.2,field);
    col+=vec3(0.3)*edge;
    float spec=pow(max(0.0,1.0-d1*5.0),8.0)*blob*0.3;
    spec+=pow(max(0.0,1.0-d2*5.0),8.0)*blob*0.3;
    col+=vec3(1.0)*spec;
    fragColor=vec4(col,1.0);}
