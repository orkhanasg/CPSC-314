// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 virusOffset;
uniform float rotation;
uniform mat4 dodgeMatrix;
uniform mat4 pelvisMatrix;
uniform vec3 pelvisPosition;
uniform vec3 upVector;

// The shared variable is initialized in the vertex shader and attached to the current vertex being processed,
// such that each vertex is given a shared variable and when passed to the fragment shader,
// these values are interpolated between vertices and across fragments,
// below we can see the shared variable is initialized in the vertex shader using the 'out' qualifier
out vec3 colour;

void main() {
    // Vertex position in world coordinates.
    // HINT: You will need to change worldPos to make the Armadillo dodge the virus.
    // HINT: Q1e should be done entirely in this shader.
    vec4 worldPos = vec4(position, 1.0);

    vec3 vertexNormal = normalize(normalMatrix*normal);

    // Set light direction, in camera frame.
    vec3 lightDirection = normalize(vec3(viewMatrix*(vec4(virusOffset - worldPos.xyz, 0.0))));

    float vertexColour = dot(lightDirection, vertexNormal);
    colour = vec3(vertexColour);

    //vec4 worldPelvis = vec4(0.0, 20.0, 10.0, 1);

    vec4 word = modelMatrix * vec4(position, 1.0);
    float rotation = dot(normalize(pelvisPosition), normalize(virusOffset - word.xyz));


    

    if (position.y > pelvisPosition.y) {
        
        float s = sin(rotation);
        float c = cos(rotation);
        
         
         mat4 XdodgeMatrix = mat4(   1.0, 0.0, 0.0, 0.0,
                                    0.0, c,    -s, 0.0, 
                                    0.0, s,     c, 0.0,
                                    0.0, 0.0, 0.0, 1.0);


        mat4 YdodgeMatrix = mat4(   c, 0.0, s, 0.0,
                                    0.0, 1, 0, 0.0, 
                                    -s, 0.0, c, 0.0,
                                    0.0, 0.0, 0.0, 1.0);



         mat4 ZdodgeMatrix = mat4(   c, -s, 0.0, 0.0,
                                    s, c,  0.0, 0.0, 
                                    0.0, 0.0, 1.0, 0.0,
                                   0.0, 0.0, 0.0, 1.0);

       mat4 inversePelvisMatrix = inverse(pelvisMatrix);

    worldPos = pelvisMatrix * YdodgeMatrix * XdodgeMatrix * ZdodgeMatrix * inversePelvisMatrix *  worldPos;
    
    } 

    // This should really be transformed by the pelvis transform if on the upper body
    // vertex normal in camera frame, but we won't worry about correct shading for this assignment.
   


    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * modelViewMatrix * worldPos;
    
}
