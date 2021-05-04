#version 300 es

out vec3 texCoord;

uniform samplerCube skyboxCubemap;

void main() {
    // Q1c) HINT : The cube that the texture is mapped to is centered at the origin, using this information
    // calculate the correct direction vector in the world coordinate system
    // which is used to sample a color from the cubemap

	
	vec3 worldPosition = vec3(modelMatrix * vec4(position, 1.0));
	texCoord = worldPosition;

    // Q1c) HINT : Offset your pixel vertex position by the cameraPostion (given to you in world space)
    // so that the cube is always in front of the camera even with zoom
    

    gl_Position = projectionMatrix * viewMatrix *  vec4(position + cameraPosition, 1.0);
	
	// to bind the vertices from -1 to 1
	gl_Position.z = gl_Position.w;
}

