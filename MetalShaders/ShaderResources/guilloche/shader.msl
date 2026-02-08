#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 guillocheFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.15;
    float3 col=float3(0.95,0.93,0.88);
    float acc=0.0;
    for(int i=0;i<8;i++){
        float fi=float(i);
        float a=fi*0.785398+t;
        float R=0.3+0.05*fi;
        float r=0.08+0.02*sin(t+fi);
        float d=0.1+0.03*cos(t*0.7+fi*0.5);
        for(float s=0.0;s<62.83;s+=0.05){
            float x=(R-r)*cos(s)+d*cos((R-r)/r*s+a);
            float y=(R-r)*sin(s)+d*sin((R-r)/r*s+a);
            float dist=length(uv-float2(x,y));
            acc+=0.00003/(dist*dist+0.00001);
        }
    }
    acc=clamp(acc,0.0,1.0);
    float3 inkColor=float3(0.1,0.35,0.2);
    col=mix(col,inkColor,acc*0.8);
    col*=0.95+0.05*sin(uv.x*200.0)*sin(uv.y*200.0);
    return float4(col,1.0);
}
