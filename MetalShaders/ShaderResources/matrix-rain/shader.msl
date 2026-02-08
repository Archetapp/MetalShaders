#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hashMatrix(float2 p) {
    return fract(sin(dot(p, float2(127.1, 311.7))) * 43758.5453);
}

float characterMatrix(float2 uv, float charId) {
    uv = clamp(uv, 0.0, 1.0);

    float cols = 5.0;
    float rows = 7.0;
    float2 grid = floor(float2(uv.x * cols, uv.y * rows));
    float idx = grid.y * cols + grid.x;

    float pattern = step(0.45, hashMatrix(float2(idx, charId)));

    float edgeMask = step(0.1, uv.x) * step(uv.x, 0.9) *
                     step(0.05, uv.y) * step(uv.y, 0.95);

    return pattern * edgeMask;
}

fragment float4 matrixRainFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float t = iTime;

    float charSize = 14.0;
    float columns = floor(iResolution.x / charSize);
    float rows = floor(iResolution.y / charSize);

    float2 cellCoord = floor(fragCoord / charSize);
    float2 cellUV = fract(fragCoord / charSize);

    float colId = cellCoord.x;
    float rowId = cellCoord.y;

    float speed = 3.0 + hashMatrix(float2(colId, 0.0)) * 8.0;
    float offset = hashMatrix(float2(colId, 1.0)) * rows;

    float rainPos = fmod(t * speed + offset, rows + 20.0);
    float rowFromTop = rows - rowId;
    float distFromHead = rowFromTop - rainPos;

    float trailLength = 15.0 + hashMatrix(float2(colId, 2.0)) * 10.0;

    float brightness = 0.0;
    if (distFromHead >= 0.0 && distFromHead < trailLength) {
        brightness = 1.0 - distFromHead / trailLength;
        brightness = pow(brightness, 1.5);
    }

    float isHead = smoothstep(1.0, 0.0, abs(distFromHead));

    float charSpeed = floor(t * 10.0);
    float charId = hashMatrix(float2(colId, rowId + charSpeed * 0.1));
    float slowChange = hashMatrix(float2(colId, rowId + floor(t * 2.0)));
    charId = mix(charId, slowChange, 0.5);

    float ch = characterMatrix(cellUV, charId * 100.0);

    float3 col = float3(0.0);

    float3 greenTrail = float3(0.0, 0.6, 0.1) * brightness * ch;
    float3 whiteHead = float3(0.7, 1.0, 0.8) * isHead * ch;

    col += greenTrail;
    col += whiteHead;
    col += float3(0.0, 0.05, 0.0) * brightness * 0.5;

    return float4(col, 1.0);
}
