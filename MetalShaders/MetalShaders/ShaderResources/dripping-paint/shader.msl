#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float dpHash(float n){return fract(sin(n)*43758.5453);}

fragment float4 drippingPaintFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.5;
    float3 col=float3(0.92,0.9,0.87);
    for(int i=0;i<8;i++){
        float fi=float(i);
        float h=dpHash(fi*13.7);
        float x=h;
        float speed=0.1+dpHash(fi*7.1)*0.15;
        float dripLen=fmod(t*speed+h*3.0,1.2);
        float dripTop=1.0;
        float dripBot=max(dripTop-dripLen,0.0);
        float width=0.015+dpHash(fi*3.3)*0.02;
        float bulge=width*2.0;
        float dx=abs(uv.x-x);
        float inDrip=smoothstep(width,width-0.005,dx);
        float inBulge=smoothstep(bulge,bulge-0.01,length(float2(uv.x-x,uv.y-dripBot)*float2(1.0,3.0)));
        float mask=max(inDrip*step(dripBot,uv.y)*step(uv.y,dripTop),inBulge);
        float3 paintCol=0.5+0.5*cos(fi*1.5+float3(0,2,4));
        float shade=0.8+0.2*smoothstep(width,0.0,dx);
        float highlight=pow(max(0.0,1.0-dx/width*2.0),4.0)*0.3;
        float3 dripCol=paintCol*shade+float3(1.0)*highlight;
        col=mix(col,dripCol,mask*0.9);
    }
    return float4(col,1.0);
}
