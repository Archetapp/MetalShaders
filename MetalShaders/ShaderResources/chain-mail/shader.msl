#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 chainMailFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=(in.position.xy-0.5*iResolution)/iResolution.y;
    float t=iTime*0.3;
    float scale=8.0;
    float2 p=uv*scale;
    float3 col=float3(0.08,0.08,0.1);
    float3 lightDir=normalize(float3(sin(t)*0.5,cos(t)*0.3,1.0));
    for(int ox=-1;ox<=1;ox++){
        for(int oy=-1;oy<=1;oy++){
            float2 cell=floor(p)+float2(float(ox),float(oy));
            float offset=fmod(cell.y,2.0)*0.5;
            float2 center=cell+float2(0.5+offset,0.5);
            float2 d=p-center;
            float dist=length(d);
            float ringR=0.4;
            float thick=0.1;
            float ring=abs(dist-ringR)-thick;
            if(ring<0.05){
                float s=smoothstep(0.05,0.0,ring);
                float angle=atan2(d.y,d.x);
                float3 normal=normalize(float3(cos(angle)*(dist-ringR)/thick,sin(angle)*(dist-ringR)/thick,0.5));
                float diff=max(dot(normal,lightDir),0.0);
                float spec=pow(max(dot(reflect(-lightDir,normal),float3(0,0,1)),0.0),32.0);
                float3 metalCol=float3(0.6,0.6,0.65);
                float3 ringCol=metalCol*(0.2+0.6*diff)+float3(1.0)*spec*0.5;
                col=mix(col,ringCol,s);
            }
        }
    }
    return float4(col,1.0);
}
