// The uniform variable is set up in the javascript code and the same for all vertices.
uniform vec3 virusPosition;

// Position and orientation of each spike instance.
// This is broken down into matrix rows due to limations of ThreeJS.
attribute vec4 instanceMatrixRow0;
attribute vec4 instanceMatrixRow1;
attribute vec4 instanceMatrixRow2;
attribute vec4 instanceMatrixRow3;

void main() {

    // Assemble instance matrix.
    mat4 instanceMatrix = mat4(
        instanceMatrixRow0,
        instanceMatrixRow1,
        instanceMatrixRow2,
        instanceMatrixRow3
     );

    // Translate each vertex to where the virus is located and convert to a point.
    vec4 instanceVertexPosition = instanceMatrix * vec4(position, 1.0) + vec4(virusPosition, 0.0) ;

    
    // Orient each vertex according to the current instance.
    // Then multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // Finally multiply the projection matrix to get final vertex position.
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceVertexPosition; 

}
