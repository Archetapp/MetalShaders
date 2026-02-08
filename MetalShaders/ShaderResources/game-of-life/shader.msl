#include <metal_stdlib>
using namespace metal;

struct VertexOut {
    float4 position [[position]];
    float2 uv;
};

float hashGol(float2 p) {
    p = fract(p * float2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float cellGol(float2 coord, float generation, float cellSize) {
    float2 cellCoord = floor(coord / cellSize);

    float state = step(0.55, hashGol(cellCoord + generation * 0.01));

    int neighbors = 0;
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            if (x == 0 && y == 0) continue;
            float2 neighbor = cellCoord + float2(float(x), float(y));
            float nState = step(0.55, hashGol(neighbor + generation * 0.01));
            neighbors += int(nState);
        }
    }

    float alive;
    if (state > 0.5) {
        alive = (neighbors == 2 || neighbors == 3) ? 1.0 : 0.0;
    } else {
        alive = (neighbors == 3) ? 1.0 : 0.0;
    }

    return alive;
}

fragment float4 gameOfLifeFragment(
    VertexOut in [[stage_in]],
    constant float &iTime [[buffer(0)]],
    constant float2 &iResolution [[buffer(1)]]
) {
    float2 fragCoord = in.uv * iResolution;
    float t = iTime;

    float cellSize = 6.0;
    float2 cellUV = fract(fragCoord / cellSize);

    float gen = floor(t * 8.0);

    float current = cellGol(fragCoord, gen, cellSize);
    float prev = cellGol(fragCoord, gen - 1.0, cellSize);

    float transition = fract(t * 8.0);

    float born = current * (1.0 - prev);
    float dying = (1.0 - current) * prev;
    float stable = current * prev;

    float brightness = stable + born * transition + dying * (1.0 - transition);

    float border = smoothstep(0.0, 0.1, cellUV.x) * smoothstep(0.0, 0.1, cellUV.y)
                 * smoothstep(0.0, 0.1, 1.0 - cellUV.x) * smoothstep(0.0, 0.1, 1.0 - cellUV.y);

    float3 aliveColor = float3(0.2, 0.8, 0.4);
    float3 deadColor = float3(0.02, 0.04, 0.03);
    float3 birthColor = float3(0.4, 1.0, 0.6);
    float3 deathColor = float3(0.6, 0.2, 0.1);

    float3 col = deadColor;
    col = mix(col, aliveColor, stable * border);
    col = mix(col, birthColor, born * transition * border);
    col = mix(col, deathColor, dying * (1.0 - transition) * border * 0.5);

    col += float3(0.0, 0.02, 0.01) * border * (1.0 - brightness) * 0.5;

    return float4(col, 1.0);
}
