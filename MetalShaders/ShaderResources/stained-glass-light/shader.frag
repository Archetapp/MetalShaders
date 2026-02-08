#version 300 es
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
out vec4 fragColor;

vec2 sglHash2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453);}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5*iResolution)/min(iResolution.x,iResolution.y);
    float scale = 5.0;
    vec2 cellUv = uv * scale;
    vec2 cellId = floor(cellUv);
    float minDist = 10.0, secondDist = 10.0;
    vec2 nearestId = vec2(0.0);
    for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
        vec2 nb = vec2(float(x),float(y));
        vec2 id = cellId+nb;
        vec2 pt = nb+sglHash2(id)-fract(cellUv);
        float d = length(pt);
        if(d<minDist){secondDist=minDist;minDist=d;nearestId=id;}
        else if(d<secondDist) secondDist=d;
    }
    float edge = secondDist - minDist;
    float leadLine = smoothstep(0.08, 0.04, edge);

    vec2 h = sglHash2(nearestId+100.0);
    vec3 glassColor = 0.5 + 0.5 * cos(6.28*(h.x + vec3(0.0,0.33,0.67)));
    glassColor = pow(glassColor, vec3(0.7)) * 0.8;

    vec2 lightDir = vec2(sin(iTime*0.3), cos(iTime*0.4));
    float lightAngle = dot(normalize(uv+0.001), lightDir)*0.5+0.5;
    float lightIntensity = 0.5 + 0.5 * lightAngle;
    float lightBeam = pow(max(dot(normalize(uv-vec2(0.0,0.5)), vec2(0.0,-1.0)), 0.0), 2.0);

    vec3 col = glassColor * lightIntensity;
    col *= 1.0 + lightBeam * 0.5;
    col = mix(col, vec3(0.05, 0.04, 0.03), leadLine);

    float glow = pow(1.0 - minDist * 0.5, 3.0) * lightIntensity * 0.2;
    col += glow * glassColor;

    float vignette = 1.0 - 0.3*length(uv);
    col *= vignette;
    fragColor = vec4(col, 1.0);
}
