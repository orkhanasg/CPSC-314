// The value of the shared "varying" variable (with "in" qualifier" is interpolated to the fragment)
in vec3 colour;

void main() {
	gl_FragColor = vec4(colour, 1.0);
}
