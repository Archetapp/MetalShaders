#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

float waNoise(vec2 p){
    vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),f.x),
               mix(fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5),f.x),f.y);
}

void main(){
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    float aspect = iResolution.x / iResolution.y;
    vec2 uvA = vec2(uv.x * aspect, uv.y);
    float t = iTime;

    float grain = waNoise(uv*80.0)*0.08 + waNoise(uv*160.0)*0.04 + waNoise(uv*320.0)*0.02;
    vec3 asphalt = vec3(0.12, 0.12, 0.13) + grain;
    asphalt += waNoise(uv*40.0+3.0)*0.03*vec3(0.9,0.85,0.8);

    float puddle = waNoise(uv*2.5)*0.5 + waNoise(uv*5.0)*0.3 + waNoise(uv*11.0)*0.15;
    puddle = smoothstep(0.42, 0.58, puddle);

    float ripple = 0.0;
    for(int i=0;i<12;i++){
        float fi = float(i);
        vec2 drop = vec2(waNoise(vec2(fi*7.0,floor(t*0.8+fi))), waNoise(vec2(fi*13.0,floor(t*0.8+fi)+0.5)));
        float age = fract(t*0.4+fi*0.083);
        float r = age*0.12;
        float ring = abs(length(uvA - drop*vec2(aspect,1.0)) - r);
        float w = 0.003 + age*0.004;
        ripple += smoothstep(w, 0.0, ring)*(1.0-age*age)*puddle;
    }

    vec3 col = asphalt;

    vec3 skyRef = mix(vec3(0.08,0.09,0.12), vec3(0.15,0.16,0.2), uv.y);
    skyRef += waNoise(uv*6.0+t*0.02)*0.04*vec3(0.7,0.8,1.0);
    col = mix(col, col*0.7 + skyRef, puddle*0.6);

    col += vec3(0.35, 0.3, 0.25)*ripple;

    vec2 lights[3];
    lights[0] = vec2(0.3, 0.85);
    lights[1] = vec2(0.7, 0.9);
    lights[2] = vec2(0.5, 0.75);
    vec3 lightCols[3];
    lightCols[0] = vec3(1.0, 0.85, 0.6);
    lightCols[1] = vec3(0.7, 0.85, 1.0);
    lightCols[2] = vec3(1.0, 0.9, 0.75);
    for(int i=0;i<3;i++){
        float d = length(uvA - lights[i]*vec2(aspect,1.0));
        float spec = pow(max(0.0, 1.0 - d*2.5), 8.0)*puddle;
        float shimmer = 1.0 + sin(t*2.0+float(i)*2.1)*0.15;
        col += lightCols[i]*spec*0.35*shimmer;
        float glow = exp(-d*d*8.0)*puddle*0.08;
        col += lightCols[i]*glow;
    }

    float scatter = waNoise(uv*50.0+t*0.3)*puddle;
    col += vec3(0.08,0.09,0.1)*pow(scatter, 2.0);

    float wetSheen = puddle * (0.03 + 0.02*sin(uv.y*40.0+t*0.5));
    col += vec3(0.9,0.92,0.95)*wetSheen;

    fragColor = vec4(col, 1.0);
}
