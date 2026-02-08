#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
fragment float4 pageCurlFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;float t=iTime;float curlPos=fract(t*0.15);float curlX=curlPos*1.4-0.2;
    float curlRadius=0.08+0.05*sin(t*0.5);
    float3 pageTop=float3(0.95,0.93,0.88),pageBottom=float3(0.2,0.4,0.8);
    float distToCurl=uv.x-curlX;float3 col;
    if(distToCurl>curlRadius){col=pageTop+sin(uv.x*30.0)*sin(uv.y*30.0)*0.05;}
    else if(distToCurl>0.0){float angle=distToCurl/curlRadius*M_PI_F;
        col=mix(pageTop*(1.0-distToCurl/curlRadius*0.5),pageBottom,sin(angle)*0.5+0.5)+pow(sin(angle),8.0)*0.3;}
    else{col=pageBottom+fmod(floor(uv.x*10.0)+floor(uv.y*10.0),2.0)*0.1-exp(-abs(distToCurl)*15.0)*0.3;}
    return float4(col,1.0);}
