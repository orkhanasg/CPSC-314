#version 300 es

out vec4 out_FragColor;

in vec3 vcsNormal;
in vec3 vcsPosition;
in vec2 texCoord;
in vec4 shadowCoord;

uniform vec3 lightColor;
uniform float kDiffuse;
uniform vec3 lightDirection;
uniform sampler2D shayDColorTexture;
uniform sampler2D shayDNormalTexture;
// Q1b) HINT : Remember to list uniforms here


void main() {
    // Some pre-calculations for Blinn-Phong lighting
    vec3 N = normalize(vcsNormal);
    vec3 L = normalize(vec3(viewMatrix * vec4(lightDirection, 0.0)));
    vec3 V = normalize(-vcsPosition);

    vec4 texColor = texture2D(shayDColorTexture, texCoord);
    

    // Q1b) HINT : Compute the ambient, diffuse, and specular components
    // for Blinn-Phong. We've already done diffuse for you.
	vec3 light_AMB = 0.1 * lightColor;
    light_AMB *= vec3(texColor);

    vec3 diffuse = kDiffuse * lightColor;
	vec3 light_DFF = diffuse * max(0.0, dot(N, L));
    light_DFF *= vec3(texColor);
    

    //vec3 N = normalize(texture2D(shayDColorTexture, texCoord).rgb);

  
    vec3 halfway = normalize(0.5 * (N + V));
    float specular = max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N)) * max(0.0, dot(halfway, N));


    vec3 light_SPC = 0.4 * lightColor * specular;

    vec3 light_TOTAL = light_AMB + light_DFF + light_SPC;
    
    // Q1b) HINT : Multiply the diffuse color with the color sampled from the texture 

    // Q1b) HINT : REPLACE THIS LINE
    //out_FragColor = texture2D(shayDColorTexture, texCoord);
    out_FragColor = vec4(light_TOTAL, 1.0);
}