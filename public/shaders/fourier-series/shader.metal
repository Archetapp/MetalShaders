#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 fourierSeriesFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float3 col=float3(0.02,0.02,0.06);int terms=int(fmod(t*0.5,12.0))+1;
    float squareApprox=0.0;float triApprox=0.0;
    for(int n=0;n<12;n++){if(n>=terms)break;float fn=float(n);float k=2.0*fn+1.0;
        squareApprox+=sin(uv.x*k*8.0+t)/(k)*0.3;
        triApprox+=(fmod(fn,2.0)==0.0?1.0:-1.0)*sin(uv.x*k*8.0+t)/(k*k)*0.4;}
    float sd=abs(uv.y-0.15-squareApprox);col+=float3(0.2,0.6,1.0)*smoothstep(0.005,0.0,sd);
    col+=float3(0.2,0.6,1.0)*0.002/(sd+0.002)*0.2;
    float td=abs(uv.y+0.15-triApprox);col+=float3(1.0,0.4,0.2)*smoothstep(0.005,0.0,td);
    col+=float3(1.0,0.4,0.2)*0.002/(td+0.002)*0.2;
    return float4(col,1.0);}
