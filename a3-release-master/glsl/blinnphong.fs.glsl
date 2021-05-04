// HINT: Don't forget to define the uniforms here after you pass them in in A3.js
uniform vec3 spherePosition;
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
    // HINT: Compute the ambient component as you did in the Phong shader.

    // HINT: Compute the diffuse component as you did in the Phong shader.

    // HINT: Compute the specular component. Recall from the specs that the
    // difference between the specular terms in the Phong and Blinn-Phong models

    vec3 normalizedLight = normalize(lightDirection);
	vec3 normalVector = normalize(interpolatedNormal);
	float diffuse = max(0.0, dot(normalVector, normalizedLight));
	
	
	vec3 halfway = normalize(0.5 * (interpolatedNormal - viewPosition));

	// instead of pow(dot(halfway, normalVector), 10), since it was giving an error.

	float specular = max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector)) * max(0.0, dot(halfway, normalVector));

	//AMBIENT
	vec3 amb = kAmbient * ambientColor;

	//DIFFUSE
	vec3 diff = diffuse * diffuseColor * kDiffuse;

	//SPECULAR
	vec3 spec = specular * specularColor * kSpecular;

	//TOTAL
	vec3 color = amb + diff + spec;
	
	gl_FragColor = vec4(color, 1.0);

    // HINT: Set final rendered colour to be a combination of the three components
   }
