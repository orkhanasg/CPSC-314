#version 300 es

out vec3 vcsPosition;
out vec3 vcsNormal;
out vec2 texCoord;
out vec4 shadowCoord;

void main() {
    // Write here the required lighting calculations for Blinn-Phong
    vcsNormal = normalMatrix * normal;
    vcsPosition = vec3(modelViewMatrix * vec4(position, 1.0));

    // Q1b) HINT : Assign texture coordinates to the texCoord variable.
    // Remember the texture for Shay D Pixel is flipped along the vertical axis.
    // WRITE YOUR CODE HERE
    

    
    
    texCoord = vec2(uv.x, 1.0 - uv.y);


   

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}