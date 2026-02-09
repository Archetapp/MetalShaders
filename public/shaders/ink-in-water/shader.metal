#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float iiwHash(float2 p){return fract(sin(dot(p,float2(127.1,311.7)))*43758.5453);}
float iiwNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(iiwHash(i),iiwHash(i+float2(1,0)),f.x),mix(iiwHash(i+float2(0,1)),iiwHash(i+float2(1,1)),f.x),f.y);
}
float iiwFbm(float2 p,float t){
    float v=0.0;float a=0.5;
    float2x2 rot=float2x2(0.8,-0.6,0.6,0.8);
    for(int i=0;i<6;i++){v+=a*iiwNoise(p+t*0.1);p=rot*p*2.0;a*=0.5;}
    return v;
}

fragment float4 inkInWaterFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.4;
    float spread=min(t*0.3,0.8);
    float ink=0.0;
    for(int i=0;i<3;i++){
        float fi=float(i);
        float angle=fi*2.094+t*0.2;
        float2 offset=float2(cos(angle),sin(angle))*spread*0.3;
        float2 p=uv-offset;
        float n=iiwFbm(p*3.0+fi*5.0,t);
        float tendril=exp(-length(p)*3.0/max(spread,0.01));
        ink+=n*tendril;
    }
    ink=smoothstep(0.1,0.6,ink);
    float3 waterCol=float3(0.85,0.9,0.95);
    float3 inkCol1=float3(0.05,0.02,0.15);
    float3 inkCol2=float3(0.15,0.05,0.3);
    float3 inkMix=mix(inkCol2,inkCol1,ink);
    float edge=smoothstep(0.3,0.5,ink)-smoothstep(0.5,0.8,ink);
    inkMix+=float3(0.1,0.05,0.2)*edge;
    float3 col=mix(waterCol,inkMix,smoothstep(0.05,0.3,ink));
    float swirl=iiwNoise(uv*5.0+t*0.3)*0.03;
    col+=swirl;
    return float4(col,1.0);
}
