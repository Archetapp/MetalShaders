#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 hopfFibrationFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.01,0.05);
    for(int i=0;i<30;i++){float fi=float(i);float theta=fi*0.21+t*0.1;float phi=fi*0.34+t*0.15;
        float ct=cos(theta),st=sin(theta),cp=cos(phi),sp=sin(phi);
        for(float s=0.0;s<100.0;s+=1.0){float psi=s*0.063;
            float a=ct*cos(psi)-st*sin(psi),b=ct*sin(psi)+st*cos(psi);
            float d_val=cp*sin(psi+t*0.2)+sp*cos(psi+t*0.2);
            float w=1.0/(2.5+d_val);float2 proj=float2(a,b)*w*0.8;
            float dist=length(uv-proj);float3 fiberCol=0.5+0.5*cos(6.28*(fi/30.0+float3(0,0.33,0.67)));
            col+=fiberCol*0.00005/(dist+0.002)*(0.3+0.7*w);}}
    col=1.0-exp(-col*3.0);return float4(col,1.0);}
