#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

fragment float4 wovenBasketFragment(VertexOut in[[stage_in]],constant float&iTime[[buffer(0)]],constant float2&iResolution[[buffer(1)]]){
    float2 uv=in.position.xy/iResolution;
    float t=iTime*0.2;
    float scale=8.0;
    float2 p=uv*scale;
    float2 cell=floor(p);
    float2 f=fract(p);
    float stripW=0.85;
    float gap=(1.0-stripW)*0.5;
    bool inHStrip=f.y>gap&&f.y<1.0-gap;
    bool inVStrip=f.x>gap&&f.x<1.0-gap;
    float checker=fmod(cell.x+cell.y,2.0);
    float3 hColor=float3(0.7+0.1*sin(t),0.5,0.25);
    float3 vColor=float3(0.55,0.4+0.1*cos(t),0.2);
    float3 bgColor=float3(0.15,0.1,0.05);
    float3 col=bgColor;
    if(inHStrip&&inVStrip){
        float fy=(f.y-gap)/stripW;
        float fx=(f.x-gap)/stripW;
        float hShade=0.8+0.2*sin(fy*M_PI_F);
        float vShade=0.8+0.2*sin(fx*M_PI_F);
        if(checker<0.5){
            col=hColor*hShade;
        } else {
            col=vColor*vShade;
        }
    } else if(inHStrip){
        float fy=(f.y-gap)/stripW;
        col=hColor*(0.8+0.2*sin(fy*M_PI_F));
    } else if(inVStrip){
        float fx=(f.x-gap)/stripW;
        col=vColor*(0.8+0.2*sin(fx*M_PI_F));
    }
    float shadow=1.0;
    if(inHStrip&&inVStrip){
        float edgeDist=min(min(f.x-gap,1.0-gap-f.x),min(f.y-gap,1.0-gap-f.y));
        shadow=0.85+0.15*smoothstep(0.0,0.1,edgeDist);
    }
    col*=shadow;
    return float4(col,1.0);
}
