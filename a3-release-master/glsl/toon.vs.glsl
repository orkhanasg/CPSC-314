// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 spherePosition;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 diffuseColor; 
uniform vec3 specularColor;
uniform vec3 toonColor;
uniform vec3 toonColor2; 
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular; 
uniform float shininess;

// The shared variable is initialized in the vertex shader and attached to the current vertex being processed,
// such that each vertex is given a shared variable and when passed to the fragment shader,
// these values are interpolated between vertices and across fragments,
// below we can see the shared variable is initialized in the vertex shader using the 'out' classifier
out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 viewPosition;
out float fresnel;

void main() {
    // Compute the vertex position in VCS
    
    viewPosition = vec3(modelViewMatrix * vec4(position, 1.0));


    // Compute the light direction in VCS
    lightDirection = vec3(viewMatrix * vec4(spherePosition, 1.0)) - viewPosition;


    // HINT: Compute the light direction in VCS
    
    // HINT: Interpolate the normal
    interpolatedNormal = normalMatrix * normal;


    // HINT: Use the surface normal in VCS and the eye direction to determine
    // if the current vertex lies on the silhouette edge of the model.
    //vec3 viewDirection = vec3(0.0, 0.0, 1.0); // Point at camera/eye
    //vec4 viewNormal = vec4(normal, 0.0); // HINT: Needs to be in VCS
    //fresnel = 0.0;

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
