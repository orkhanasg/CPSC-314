// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform vec3 spherePosition;
uniform vec3 tangentDirection;
uniform vec3 lightColor;
uniform vec3 ambientColor;
uniform vec3 diffuseColor; 
uniform vec3 specularColor; 
uniform float kAmbient;
uniform float kDiffuse;
uniform float kSpecular; 
uniform float shininess;


// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 viewPosition;


void main() {
    // HINT: You may find it helpful to pre-compute some values here (e.g. normalized vectors)

    // HINT: Compute the ambient component. Like in Phong, this component is uniform across surface.

    // HINT: Compute the diffuse component, according to the Heidrich-Seidel model.
    // You may find this link helpful:
    // https://en.wikipedia.org/wiki/Specular_highlight#Heidrich%E2%80%93Seidel_anisotropic_distribution

    // HINT: Compute the specular component. This will depend on the view direction.
    // you are allowed to use the optimized formula as well (see above link).
    
    // HINT: Make sure that the light only affects vertices facing towards the light.

    // HINT: Set final rendered colour to be a combination of the three components
    vec3 normalizedLight = normalize(lightDirection);
    vec3 normalVector = normalize(interpolatedNormal);

    vec3 h = normalize(reflect(-normalizedLight, normalVector));
   
    vec3 normalizedTangentDirection = normalize(tangentDirection);
    vec3 normalizedView = normalize(-viewPosition);

    vec3 normalizedTangent = normalize(normalizedTangentDirection + dot(-normalizedTangentDirection, normalVector) * normalVector);

    float diffuse = sqrt(1.0 - (dot(normalizedTangent, normalizedLight) * dot(normalizedTangent, normalizedLight)));

    //float cosAngle = dot(normalizedTangent, normalizedLight) + dot(normalizedTangent, normalizedView);

    float specularComp = ((diffuse * sqrt(1.0 - (dot(normalizedTangent, normalizedView) * dot(normalizedTangent, normalizedView)))) - (dot(normalizedTangent, normalizedLight) * dot(normalizedTangent, normalizedView))); 


    float specular = max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp) * max(0.0, specularComp);    

    //float specular =  cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) * cos(cosAngle) ;


    //AMBIENT
    vec3 amb = kAmbient * ambientColor;

    //DIFFUSE
    vec3 diff = diffuse * diffuseColor * kDiffuse;

    //SPECULAR
    vec3 spec = specular * specularColor * kSpecular;

    //TOTAL
    vec3 color = amb + diff + spec;
    
    gl_FragColor = vec4(color, 1.0);

}
