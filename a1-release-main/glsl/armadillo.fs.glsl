// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in float light;
in float dist;

void main() {
	
	// The direction of the light (normalized) is important for calculating shading that results from light hitting an object
  	vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));

  	// HINT: GLSL PROVIDES THE DOT() FUNCTION 
  	// HINT: SHADING IS CALCULATED BY TAKING THE DOT PRODUCT OF THE NORMAL AND LIGHT DIRECTION VECTORS

  	
	

 	// Set final rendered colour to shaded grey, unless virus is nearby.
	
	if (dist > 3.0) {
       gl_FragColor = vec4(-light, -light, -light, 1.0);
	  } else {
	 gl_FragColor = vec4(0, -light, 0, 1.0);
	 }	 
}
