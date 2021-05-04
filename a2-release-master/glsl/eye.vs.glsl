out vec3 modelPos;

void main() {
    // Pass on the model position so we can color the pupil.
    modelPos = position;

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
