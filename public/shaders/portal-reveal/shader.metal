#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

float portalRevealNoise(float2 p){float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
float a=fract(sin(dot(i,float2(127.1,311.7)))*43758.5453);float b=fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5453);
float c=fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5453);float d=fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5453);
return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}

fragment float4 portalRevealFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float2 pc = float2(sin(iTime*0.3)*0.1,cos(iTime*0.2)*0.08);
    float pr = 0.2+0.05*sin(iTime*0.5); float dist = length(uv-pc);
    float3 w1 = float3(0.15,0.12,0.1);
    float3 w2 = float3(0.05,0.1,0.2)+pow(portalRevealNoise(uv*40.0+iTime*0.1),12.0)*2.0;
    float nebula = portalRevealNoise(uv*3.0+iTime*0.05)*0.2;
    w2 += nebula * float3(0.2,0.1,0.3);
    float edgeN = portalRevealNoise(float2(atan2(uv.y-pc.y,uv.x-pc.x)*5.0,iTime*2.0))*0.03;
    float pe = dist-pr+edgeN;
    float pm = smoothstep(0.02,-0.02,pe);
    float rg = exp(-pe*pe*500.0);
    float shimmer = sin(atan2(uv.y-pc.y,uv.x-pc.x)*8.0+iTime*3.0)*0.5+0.5;
    float3 rc = mix(float3(0.2,0.5,1),float3(0.8,0.3,1),shimmer);
    float3 col = mix(w1,w2,pm)+rg*rc*1.5;
    float innerRing = exp(-pow(dist-pr*0.8,2.0)*300.0)*pm;
    col += innerRing*float3(0.3,0.5,0.8)*0.3;
    float particles = 0.0;
    for(int i=0;i<8;i++){float fi=float(i);
        float pAngle=fi*0.785+iTime*(1.0+fi*0.1);
        float pR=pr+sin(iTime*2.0+fi)*0.03;
        float2 pPos=pc+float2(cos(pAngle),sin(pAngle))*pR;
        particles+=exp(-length(uv-pPos)*100.0);}
    col+=particles*rc*0.5;
    return float4(col, 1.0);
}
