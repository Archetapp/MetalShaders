#include <metal_stdlib>
using namespace metal;
struct VertexOut { float4 position [[position]]; float2 uv; };

fragment float4 audioReactiveBlobFragment(
    VertexOut in [[stage_in]],constant float &iTime [[buffer(0)]],constant float2 &iResolution [[buffer(1)]]
) {
    float2 uv = (in.uv-0.5)*float2(iResolution.x/min(iResolution.x,iResolution.y),iResolution.y/min(iResolution.x,iResolution.y));
    float bass=sin(iTime*2.0)*0.5+0.5, mid=sin(iTime*4.0+1.0)*0.3+0.5, treble=sin(iTime*8.0+2.0)*0.2+0.5;
    float amplitude=(bass+mid+treble)/3.0;
    float dist=length(uv); float angle=atan2(uv.y,uv.x);
    float deform = sin(angle*2.0+iTime*1.5)*bass*0.06+sin(angle*4.0-iTime*2.0)*mid*0.04+sin(angle*8.0+iTime*4.0)*treble*0.025+sin(angle*3.0+iTime)*amplitude*0.03;
    float surface = dist-0.25-deform;
    float mask = smoothstep(0.01,-0.01,surface);
    float2 eps=float2(0.003,0);
    float3 normal = normalize(float3(length(uv+eps)-0.25-surface, length(uv+eps.yx)-0.25-surface, 0.15));
    float3 lightDir=normalize(float3(0.5,0.8,1.0));
    float diff=max(dot(normal,lightDir),0.0);
    float spec=pow(max(dot(reflect(-lightDir,normal),float3(0,0,1)),0.0),32.0);
    float fresnel=pow(1.0-max(dot(normal,float3(0,0,1)),0.0),3.0);
    float3 blobColor=mix(float3(0.2,0.1,0.5),float3(0.1,0.5,0.8),mid);
    blobColor=mix(blobColor,float3(0.8,0.2,0.3),bass*0.3);
    float pulse=amplitude*0.3;
    float3 glowColor=mix(float3(0.5,0.2,0.8),float3(0.2,0.8,0.5),sin(iTime)*0.5+0.5);
    float3 col=float3(0.02,0.02,0.04);
    col=mix(col, blobColor*(0.2+diff*0.6)+spec*0.5+fresnel*glowColor*0.3, mask);
    col+=exp(-surface*10.0)*amplitude*0.3*glowColor;
    float pulseRing=exp(-pow(surface-pulse*0.1,2.0)*500.0)*amplitude;
    col+=pulseRing*glowColor*0.5;
    return float4(col, 1.0);
}
