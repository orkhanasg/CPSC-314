#version 300 es

out vec4 out_FragColor;


in vec3 texCoord;
uniform samplerCube skyboxCubemap;

// Q1c) HINT : The cubemap texture is of type samplerCube

void main() {
    // Q1c) HINT : Sample the texture from the samplerCube object, rememeber that cubeMaps are sampled
    // using a direction vector that you calculated in the vertex shader

    // Q1c) HINT : REPLACE THIS LINE
    out_FragColor = textureCube(skyboxCubemap, texCoord);
}