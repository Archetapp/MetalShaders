#!/bin/bash
# Helper script to copy files to both directories
BASE_DIR="/Users/jareddavidson/Documents/Brainblast/MetalShaders"
WEB_DIR="$BASE_DIR/public/shaders"
IOS_DIR="$BASE_DIR/MetalShaders/ShaderResources"

copy_shader() {
    local slug=$1
    cp "$WEB_DIR/$slug/meta.json" "$IOS_DIR/$slug/meta.json"
    cp "$WEB_DIR/$slug/shader.frag" "$IOS_DIR/$slug/shader.frag"
    cp "$WEB_DIR/$slug/shader.metal" "$IOS_DIR/$slug/shader.msl"
}

# Will be called after each shader is written
echo "Helper script ready"
