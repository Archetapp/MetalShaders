#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float wsHash(float n){return fract(sin(n)*43758.5453);}

fragment float4 weldingSparksFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime;
    float3 col=float3(0.01,0.01,0.02);
    float2 weldPt=float2(sin(t*0.5)*0.1,0.0);
    float weldDist=length(uv-weldPt);
    float weldGlow=0.005/(weldDist*weldDist+0.0002);
    col+=float3(1.0,0.95,0.9)*weldGlow*0.15;
    col+=float3(0.3,0.5,1.0)*exp(-weldDist*20.0)*0.5;
    for(int i=0;i<40;i++){
        float fi=float(i);
        float h1=wsHash(fi*7.3+floor(t*2.0)*0.1);
        float h2=wsHash(fi*13.1+floor(t*2.0)*0.3);
        float h3=wsHash(fi*19.7+floor(t*2.0)*0.7);
        float angle=h1*6.2832;
        float speed=0.3+h2*0.7;
        float life=fract(t*0.8+h3);
        float gravity=life*life*0.4;
        float2 vel=float2(cos(angle),sin(angle))*speed;
        float2 sparkPos=weldPt+vel*life+float2(0,-gravity);
        float d=length(uv-sparkPos);
        float brightness=(1.0-life);
        brightness*=brightness;
        float spark=0.0005/(d*d+0.00005)*brightness;
        float3 sparkCol=mix(float3(1.0,0.9,0.5),float3(1.0,0.4,0.1),life);
        col+=sparkCol*spark*0.05;
    }
    return float4(col,1.0);
}
