// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
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

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;
in float fresnel;

void main() {
    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector

    vec3 normalizedLight = normalize(lightDirection);
    vec3 normalVector = normalize(interpolatedNormal);
    vec3 normalizedView = normalize(-viewPosition);

    // HINT: Define ranges of light intensity values to shade. GLSL has a
    // built-in `ceil` function that you could use to determine the nearest
    // light intensity range.

    // HINT: You should use two tones of colors here; `toonColor` is a yellow
    // color for brighter areas and `toonColor2` is a red color for darker areas.
    // Use the light intensity to blend the two colors.

    // HINT: To achieve the toon silhouette outline, set a dark fragment color
    // if the current fragment is located near the edge of the 3D model.
    // Use a reasonable value as the threshold for the silhouette thickness
    // (i.e. proximity to edge).

    float lightIntensity = dot(normalizedLight, normalVector); 

    vec4 color = vec4(0.0,0.0,0.0,0.0);

    if (lightIntensity > 0.4)
        color = vec4(1.0, 0.8, 0.4, 1.0);
    else if (lightIntensity > 0.2)
        color = vec4(1, 0.65, 0.0, 1.0);
    else if (lightIntensity > 0.0)
        color = vec4(1, 0.55, 0.0, 1.0);
    else
        color = vec4(0.8, 0.1, 0.35,  1.0);
        
    // check for silhouette edges
    float silhouette = abs(dot(normalVector, normalizedView));
    if (silhouette < 0.5)
        color = vec4(0.0, 0.0, 0.0, 1.0);
    
    
    gl_FragColor = color;

    // HINT: Set final rendered colour
   
}
