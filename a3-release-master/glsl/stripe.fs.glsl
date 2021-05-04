// HINT: Don't forget to define the uniforms here after you pass them in in A3.js

uniform vec3 spherePosition;
uniform float ticks;

// The value of our shared variable is given as the interpolation between normals computed in the vertex shader
// below we can see the shared variable we passed from the vertex shader using the 'in' classifier
in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 vertexPosition;

void main() {
    // HINT: Compute the light intensity the current fragment by determining
    // the cosine angle between the surface normal and the light vector.

    // HINT: Pick any two colors and blend them based on light intensity
    // to give the 3D model some color and depth.
    vec3 color1 = vec3(1.0, 0.0, 1.0);
    vec3 color2 = vec3(0.0, 1.0, 1.0);

    // HINT: Render (or not) the current fragment based on its vertical position
    // to get the stripe effect. Think of a way to use a time component to "roll"
    // these stripes down the model over time.

    vec3 normalizedLight = normalize(lightDirection);
    vec3 normalVector = normalize(interpolatedNormal);
    vec3 normalizedVertex = normalize(vertexPosition);

    float lightIntensity = dot(normalizedLight, normalVector);

    vec4 finalColor4 = vec4(0.0, 0.0, 0.0, 0.0);
    
    // HINT: `discard` throws away (does not render) the current fragment.

    if (lightIntensity > 0.4)
        finalColor4 = vec4(1.0, 0.0, 1.0, 1.0);
    else
        finalColor4 = vec4(0.0, 1.0, 1.0,  1.0);

    

    if(mod(ticks + vertexPosition.y , 2.0) < 0.5){
       //discard;
    }
    else if( mod(ticks + vertexPosition.y , 2.0) < 1.5 &&  1.0 < mod(ticks + vertexPosition.y , 2.0) ){
        
        //discard;
    }
    else {
       discard;
    }

    // HINT: Set final rendered colour
    gl_FragColor = finalColor4;
}
