#version 300 es

in vec3 vcsNormal;
in vec3 vcsPosition;

out vec4 out_FragColor;
uniform samplerCube skyboxCubemap;


void main() {
    // Q1d) HINT : Calculate the vector that can be used to sample from the cubemap
    vec3 normal = normalize(vcsNormal);
    vec3 reflected = reflect(normalize(vec3(-vcsPosition)), normal);
    vec4 texColor0 = textureCube(skyboxCubemap, reflected);
    out_FragColor = vec4(texColor0.r, texColor0.g, texColor0.b, 1.0);
    
}