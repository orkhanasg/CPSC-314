/*
 * UBC CPSC 314, Vjan2021
 * Assignment 1 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniform
const virusPosition = { type: 'v3', value: new THREE.Vector3(0.0, 1.0, 0.0) };

// Materials: specifying uniforms and shaders
const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    virusPosition: virusPosition // was updated 
  }
});
const spikeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    virusPosition: virusPosition
  }
});
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    virusPosition: virusPosition
  }
});

// Load shaders.
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/spike.vs.glsl',
  'glsl/spike.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  spikeMaterial.vertexShader = shaders['glsl/spike.vs.glsl'];
  spikeMaterial.fragmentShader = shaders['glsl/spike.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];
})

// Load and place the Armadillo geometry
// Look at the definition of loadOBJ to familiarize yourself with how each parameter
// affects the loaded object.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, function (armadillo) {
  armadillo.position.set(0.0, 5.3, -8.0);
  armadillo.rotation.y = Math.PI;
  armadillo.scale.set(0.1, 0.1, 0.1);
  armadillo.parent = worldFrame;
  scene.add(armadillo);
});

loadAndPlaceOBJ('obj/coronavirus_arm.obj', spikeMaterial, function (spike) {
  const spikeGeometry = new THREE.InstancedBufferGeometry().copy(spike.children[0].geometry);

  const defaultTransform = new THREE.Matrix4()
    .setPosition(0.0, 1.0, 0.0);



  // HINT: Use the `generateSphereSampling` function in setup.js to generate random orientations.
  const count = 100;
  //const defaultTransform 
  spikeGeometry.instanceCount = count;
  const transforms = generateSphereSampling(1.0, count, 0.1, 0,0,0 );
  
//virusPosition.value.x, virusPosition.value.y, virusPosition.value.z
  //const transforms = [defaultTransform];

  // Construct an array of 4 matrix row data.
  // This is used to construct the instance matrix in the spike shader.
  const matrixRowArray = [
    new Float32Array(count * 4),
    new Float32Array(count * 4),
    new Float32Array(count * 4),
    new Float32Array(count * 4)
  ];

  for (let j = 0; j < count; ++j) {
    for (let r = 0; r < 4; ++r) {
      for (let c = 0; c < 4; ++c) {
        matrixRowArray[r][4 * j + c] = transforms[j].elements[4 * r + c];
      }
    }
  }

  for (let i = 0; i < matrixRowArray.length; ++i) {
    spikeGeometry.setAttribute(
      `instanceMatrixRow${i}`,
      new THREE.InstancedBufferAttribute(matrixRowArray[i], 4)
    );
  }

  const spikeMesh = new THREE.Mesh(spikeGeometry, spikeMaterial);

  spikeMesh.parent = worldFrame;
  scene.add(spikeMesh);
});

// Create Covid geometries

// Create the main covid sphere geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0.0, 1.0, 0.0);
sphere.parent = worldFrame;
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(sphereLight);

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    virusPosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    virusPosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    virusPosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    virusPosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    virusPosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    virusPosition.value.y += 0.3;

  // The following tells three.js that some uniforms might have changed
  armadilloMaterial.needsUpdate = true;
  spikeMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;

  // Move the sphere light in the scene. This allows the floor to reflect the light as it moves.
  sphereLight.position.set(virusPosition.value.x, virusPosition.value.y, virusPosition.value.z);
  sphere.position.set(virusPosition.value.x, virusPosition.value.y, virusPosition.value.z);
  //spikeMesh.transforms[1].position.set(virusPosition.value.x, virusPosition.value.y, virusPosition.value.z);
}

// Setup update callback
function update() {
  checkKeyboard();

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
