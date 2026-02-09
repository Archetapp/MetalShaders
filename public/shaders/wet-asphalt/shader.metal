#include <metal_stdlib>
using namespace metal;
struct VertexOut{float4 position[[position]];float2 uv;};

float waNoise(float2 p){
    float2 i=floor(p);float2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,0),float2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+float2(0,1),float2(127.1,311.7)))*43758.5),fract(sin(dot(i+float2(1,1),float2(127.1,311.7)))*43758.5),f.x),f.y);
}

fragment float4 wetAsphaltFragment(VertexOut in[[stage_in]],constant float &iTime[[buffer(0)]],constant float2 &iResolution[[buffer(1)]]){
    float2 uv=in.uv;
    float aspect=iResolution.x/iResolution.y;
    float2 uvA=float2(uv.x*aspect,uv.y);
    float t=iTime;

    float grain=waNoise(uv*80.0)*0.08+waNoise(uv*160.0)*0.04+waNoise(uv*320.0)*0.02;
    float3 asphalt=float3(0.12,0.12,0.13)+grain;
    asphalt+=waNoise(uv*40.0+3.0)*0.03*float3(0.9,0.85,0.8);

    float puddle=waNoise(uv*2.5)*0.5+waNoise(uv*5.0)*0.3+waNoise(uv*11.0)*0.15;
    puddle=smoothstep(0.42,0.58,puddle);

    float ripple=0.0;
    for(int i=0;i<12;i++){
        float fi=float(i);
        float2 drop=float2(waNoise(float2(fi*7.0,floor(t*0.8+fi))),waNoise(float2(fi*13.0,floor(t*0.8+fi)+0.5)));
        float age=fract(t*0.4+fi*0.083);
        float r=age*0.12;
        float ring=abs(length(uvA-drop*float2(aspect,1.0))-r);
        float w=0.003+age*0.004;
        ripple+=smoothstep(w,0.0,ring)*(1.0-age*age)*puddle;
    }

    float3 col=asphalt;

    float3 skyRef=mix(float3(0.08,0.09,0.12),float3(0.15,0.16,0.2),uv.y);
    skyRef+=waNoise(uv*6.0+t*0.02)*0.04*float3(0.7,0.8,1.0);
    col=mix(col,col*0.7+skyRef,puddle*0.6);

    col+=float3(0.35,0.3,0.25)*ripple;

    float2 lights[3]={float2(0.3,0.85),float2(0.7,0.9),float2(0.5,0.75)};
    float3 lightCols[3]={float3(1.0,0.85,0.6),float3(0.7,0.85,1.0),float3(1.0,0.9,0.75)};
    for(int i=0;i<3;i++){
        float d=length(uvA-lights[i]*float2(aspect,1.0));
        float spec=pow(max(0.0,1.0-d*2.5),8.0)*puddle;
        float shimmer=1.0+sin(t*2.0+float(i)*2.1)*0.15;
        col+=lightCols[i]*spec*0.35*shimmer;
        float glow=exp(-d*d*8.0)*puddle*0.08;
        col+=lightCols[i]*glow;
    }

    float scatter=waNoise(uv*50.0+t*0.3)*puddle;
    col+=float3(0.08,0.09,0.1)*pow(scatter,2.0);

    float wetSheen=puddle*(0.03+0.02*sin(uv.y*40.0+t*0.5));
    col+=float3(0.9,0.92,0.95)*wetSheen;

    return float4(col,1.0);
}
