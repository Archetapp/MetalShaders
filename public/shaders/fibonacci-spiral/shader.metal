#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 fibonacciSpiralFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.04,0.02);float goldenAngle=2.39996;
    int count=int(50.0+50.0*sin(t*0.3));
    for(int i=0;i<200;i++){if(i>=count)break;float fi=float(i);
        float angle=fi*goldenAngle;float r=0.02*sqrt(fi);
        float2 pos=float2(cos(angle+t*0.2),sin(angle+t*0.2))*r;
        float d=length(uv-pos);float seedSize=0.008+0.004*sin(fi*0.1+t);
        float3 seedCol=mix(float3(0.6,0.4,0.1),float3(0.2,0.5,0.1),fi/float(count));
        col+=seedCol*smoothstep(seedSize,seedSize-0.003,d)+seedCol*0.0003/(d+0.003)*0.5;}
    return float4(col,1.0);}
