#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};
float lmNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);}
fragment float4 liquidMorphFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=(in.uv-0.5)*float2(iResolution.x/iResolution.y,1.0);float t=iTime;
    float morph=sin(t*0.8)*0.5+0.5;float r=length(uv);float angle=atan2(uv.y,uv.x);
    float sides=4.0+floor(morph*4.0);
    float polygon=cos(M_PI_F/sides)/cos(fmod(angle+M_PI_F/sides,2.0*M_PI_F/sides)-M_PI_F/sides);
    float shape=mix(r,r/polygon*0.5,morph)+lmNoise(float2(angle*3.0,t*2.0))*0.02+sin(t*8.0)*exp(-fmod(t,2.0)*3.0)*0.02;
    float surface=smoothstep(0.2,0.19,shape);float edge=surface-smoothstep(0.19,0.18,shape);
    float3 shapeCol=mix(float3(0.3,0.5,0.9),float3(0.9,0.3,0.5),morph);
    float3 col=mix(float3(0.1,0.1,0.15),shapeCol,surface)+float3(1.0)*edge*0.3+shapeCol*0.005/(abs(shape-0.2)+0.005)*0.2;
    return float4(col,1.0);}
