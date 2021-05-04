/*
 * UBC CPSC 314, Vfeb2021
 * Assignment 3 Template
 */

// Setup the renderer
// You should look into js/setup.js to see what exactly is done here.
const { renderer, canvas } = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Uniforms - Pass these into the appropriate vertex and fragment shader files
const spherePosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 0.0) };
const tangentDirection = { type: 'v3', value: new THREE.Vector3(0.5, 0.0, 1.0) };

const ambientColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 1.0) };
const diffuseColor = { type: 'c', value: new THREE.Color(0.0, 1.0, 1.0) };
const specularColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const lightColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const toonColor = { type: 'c', value: new THREE.Color(1.0, 0.8, 0.4) };
const toonColor2 = { type: 'c', value: new THREE.Color(0.8, 0.1, 0.35) };
const outlineColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 0.0) };

const kAmbient = { type: "f", value: 0.3 };
const kDiffuse = { type: "f", value: 0.6 };
const kSpecular = { type: "f", value: 1.0 };
const shininess = { type: "f", value: 10.0 };
const ticks = { type: "f", value: 0.0 };

// Shader materials
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition
  }
});

const phongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    diffuseColor: diffuseColor, 
    specularColor: specularColor, 
    lightColor:  lightColor,
    ambientColor: ambientColor,
    kAmbient: kAmbient, 
    kDiffuse: kDiffuse, 
    kSpecular: kSpecular, 
    shininess: shininess
  }
});

const blinnPhongMaterial = new THREE.ShaderMaterial({
  uniforms: {
    spherePosition: spherePosition,
    diffuseColor: diffuseColor, 
    specularColor: specularColor, 
    lightColor:  lightColor,
    ambientColor: ambientColor,
    kAmbient: kAmbient, 
    kDiffuse: kDiffuse, 
    kSpecular: kSpecular, 
    shininess: shininess
  }
});

const anisotropicMaterial = new THREE.ShaderMaterial({
   uniforms: {
    tangentDirection: tangentDirection,
    spherePosition: spherePosition,
    diffuseColor: diffuseColor, 
    specularColor: specularColor, 
    lightColor:  lightColor,
    ambientColor: ambientColor,
    kAmbient: kAmbient, 
    kDiffuse: kDiffuse, 
    kSpecular: kSpecular, 
    shininess: shininess
  }
});

const toonMaterial = new THREE.ShaderMaterial({
  uniforms: {
    toonColor: toonColor,
    toonColor2: toonColor2,
    spherePosition: spherePosition,
    diffuseColor: diffuseColor, 
    specularColor: specularColor, 
    lightColor:  lightColor,
    ambientColor: ambientColor,
    kAmbient: kAmbient, 
    kDiffuse: kDiffuse, 
    kSpecular: kSpecular, 
    shininess: shininess
  }
});

const stripeMaterial = new THREE.ShaderMaterial({
 uniforms: {
  spherePosition: spherePosition, 
  ticks: ticks
  }
});

// Load shaders
const shaderFiles = [
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/blinnphong.vs.glsl',
  'glsl/blinnphong.fs.glsl',
  'glsl/anisotropic.vs.glsl',
  'glsl/anisotropic.fs.glsl',
  'glsl/toon.vs.glsl',
  'glsl/toon.fs.glsl',
  'glsl/stripe.vs.glsl',
  'glsl/stripe.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
  phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];

  blinnPhongMaterial.vertexShader = shaders['glsl/blinnphong.vs.glsl'];
  blinnPhongMaterial.fragmentShader = shaders['glsl/blinnphong.fs.glsl'];

  anisotropicMaterial.vertexShader = shaders['glsl/anisotropic.vs.glsl'];
  anisotropicMaterial.fragmentShader = shaders['glsl/anisotropic.fs.glsl'];

  toonMaterial.vertexShader = shaders['glsl/toon.vs.glsl'];
  toonMaterial.fragmentShader = shaders['glsl/toon.fs.glsl'];

  stripeMaterial.vertexShader = shaders['glsl/stripe.vs.glsl'];
  stripeMaterial.fragmentShader = shaders['glsl/stripe.fs.glsl'];
});

// Define the shader modes
const shaders = {
  PHONG: { key: 0, material: phongMaterial },
  BLINNPHONG: { key: 1, material: blinnPhongMaterial },
  ANISOTROPIC: { key: 2, material: anisotropicMaterial },
  TOON: { key: 3, material: toonMaterial },
  STRIPE: { key: 4, material: stripeMaterial },
};

let mode = shaders.PHONG.key; // Default



// Set up scenes
let scenes = [];
for (let shader of Object.values(shaders)) {
  // Create the scene
  const { scene, camera, worldFrame } = createScene(canvas);

  // Create the main sphere geometry (light source)
  // https://threejs.org/docs/#api/en/geometries/SphereGeometry
  const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0.0, 1.5, 0.0);
  sphere.parent = worldFrame;
  scene.add(sphere);

  // Look at the definition of loadOBJ to familiarize yourself with
  // how each parameter affects the loaded object.
  loadAndPlaceOBJ('obj/armadillo.obj', shader.material, function (armadillo) {
    armadillo.position.set(0.0, 0.0, -10.0);
    armadillo.rotation.y = Math.PI;
    armadillo.scale.set(0.2, 0.2, 0.2);
    armadillo.parent = worldFrame;
    scene.add(armadillo);
  });

  scenes.push({ scene, camera });
}

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("1"))
    mode = shaders.PHONG.key;
  else if (keyboard.pressed("2"))
    mode = shaders.BLINNPHONG.key;
  else if (keyboard.pressed("3"))
    mode = shaders.ANISOTROPIC.key;
  else if (keyboard.pressed("4"))
    mode = shaders.TOON.key;
  else if (keyboard.pressed("5"))
    mode = shaders.STRIPE.key;

  if (keyboard.pressed("W"))
    spherePosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    spherePosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    spherePosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    spherePosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    spherePosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    spherePosition.value.y += 0.3;

  // The following tells three.js that some uniforms might have changed
  sphereMaterial.needsUpdate = true;
  phongMaterial.needsUpdate = true;
  blinnPhongMaterial.needsUpdate = true;
  anisotropicMaterial.needsUpdate = true;
  toonMaterial.needsUpdate = true;
  stripeMaterial.needsUpdate = true;
}

// clock = THREE.Clock;

// Setup update callback
function update() {
  checkKeyboard();
  ticks.value += 0.05;

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  const { scene, camera } = scenes[mode];
  renderer.render(scene, camera);
}

// Start the animation loop.
update();


