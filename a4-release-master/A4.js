/*
* UBC CPSC 314, Vmar2021
* Assignment 4 Template
*/

// Setup the renderer and create the scene
// You should look into js/setup.js to see what exactly is done here.
const { renderer, canvas } = setup();
const { scene, camera, worldFrame } = createScene(canvas);
renderer.shadowMap.enabled = true;

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Light(s)
const light = new THREE.DirectionalLight( 0xffffff, 1 );
light.position.set(20.0,20.0,20.0);
light.target = worldFrame;

// Q1e) HINT : This light source casts the shadows, set up this light source as the shadow camera
// to be used for shadow mapping
// WRITE YOUR CODE HERE
light.castShadow = true;
light.shadow.camera.zoom = 0.5;
scene.add(light);

const lightDirection = new THREE.Vector3();
lightDirection.copy(light.position);
lightDirection.sub(light.target.position);
// Q1e) HINT : adjust the view frustum for the shadow camera to include the entire shadow of our
// armadillo, without being too large. Experiment with a few different values.
// WRITE YOUR CODE HERE

// Q1e) HINT : Optional, but you can visualise the light and the frustum of the shadow camera todebug shadow mapping
// Uncomment the lines below
const lightHelper = new THREE.CameraHelper(light.shadow.camera);
scene.add(lightHelper);

// Load floor textures
const floorColorTexture = new THREE.TextureLoader().load('images/color.jpg');
floorColorTexture.minFilter = THREE.LinearFilter;
floorColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

const floorNormalTexture = new THREE.TextureLoader().load('images/normal.png');
floorNormalTexture.minFilter = THREE.LinearFilter;
floorNormalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Load pixel textures
const shayDColorTexture = new THREE.TextureLoader().load( 'images/Pixel_Model_BaseColor.jpg' );
shayDColorTexture.minFilter = THREE.LinearFilter;
shayDColorTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
shayDColorTexture.rotation = Math.PI;
//shayDColorTexture.wrapT = THREE.RepeatWrapping;
//shayDColorTexture.center.set(0.5, 0.5);
//shayDColorTexture.repeat.set(-1,1);


const shayDNormalTexture = new THREE.TextureLoader().load('images/Pixel_Model_Normal.jpg');
shayDNormalTexture.minFilter = THREE.LinearFilter;
shayDNormalTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();


// Uniforms
const cameraPositionUniform = {type: "v3", value: camera.position};
const lightColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0)};
const ambientColorUniform = {type: "c", value: new THREE.Vector3(1.0, 1.0, 1.0)};
const lightDirectionUniform = {type: "v3", value: lightDirection};
const kAmbientUniform = {type: "f", value: 0.1};
const kDiffuseUniform = {type: "f", value: 0.8};
const kSpecularUniform = {type: "f", value: 0.4};
const shininessUniform = {type: "f", value: 50.0};
const lightPositionUniform = { type: "v3", value: light.position};

// Load the skybox textures
const skyboxCubemap = new THREE.CubeTextureLoader()
  .setPath('images/cubemap/')
  .load([
    'cube1.png', 'cube2.png',
    'cube3.png', 'cube4.png',
    'cube5.png', 'cube6.png'
    // Q1c HINT :
    // Load the images for the sides of the cubemap here. Note that order is important
    // See documentation for more detail
  ]);
skyboxCubemap.format = THREE.RGBFormat;

// Materials

// Q1a) HINT : Pass the uniforms to the floorMaterial
const floorMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  map: floorColorTexture,
  normalMap: floorNormalTexture,

});

// Q1b) HINT : Pass the uniforms for Blinn-Phong shading, colorMap, normalMap, etc. to the shaderMaterial
// Q1b) HINT : You may have to create uniforms for the textures

const shayDMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  uniforms: {
    lightColor: lightColorUniform,
    kDiffuse: kDiffuseUniform,
    lightDirection: lightDirectionUniform,
    shayDColorTexture:{ type: "t", value: shayDColorTexture},
    shayDNormalTexture:{ type: "t", value: shayDNormalTexture},
  }
});

// Q1c) HINT : Pass the necessary uniforms (skybox and camera position)
const skyboxMaterial = new THREE.ShaderMaterial({
   side: THREE.DoubleSide,
  uniforms: {
    skyboxCubemap: { type: "t", value: skyboxCubemap },
    lightDirection: lightDirectionUniform,
  }
});

// Q1d) HINT : Pass the necessary uniforms
const envmapMaterial = new THREE.ShaderMaterial({
	side: THREE.DoubleSide,
	envmap: skyboxCubemap,
  uniforms: {
    skyboxCubemap: { type: "t", value: skyboxCubemap },
    lightDirection: lightDirectionUniform,
  }});

// Load shaders
const shaderFiles = [
  'glsl/envmap.vs.glsl',
  'glsl/envmap.fs.glsl',
  'glsl/skybox.vs.glsl',
  'glsl/skybox.fs.glsl',
  'glsl/shay.vs.glsl',
  'glsl/shay.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  shayDMaterial.vertexShader = shaders['glsl/shay.vs.glsl'];
  shayDMaterial.fragmentShader = shaders['glsl/shay.fs.glsl'];
  
  skyboxMaterial.vertexShader = shaders['glsl/skybox.vs.glsl'];
  skyboxMaterial.fragmentShader = shaders['glsl/skybox.fs.glsl'];
  
  envmapMaterial.vertexShader = shaders['glsl/envmap.vs.glsl'];
  envmapMaterial.fragmentShader = shaders['glsl/envmap.fs.glsl'];
});


//shayDColorTexture.center.set(0.5, 0.5);
//shayDColorTexture.repeat.set(-1,1);

// Loaders for object geometry
// Load the pixel gltf
const gltfFileName = 'gltf/pixel_v4.glb';
let object;
{
  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load(gltfFileName, (gltf) => {
    object = gltf.scene;
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = shayDMaterial;
        // Q1e) Enable shadows for the gltf model
        // This is already done for you, as you aren't familiar with the gltf loader
        child.castShadow = true;
      }
    });
    object.scale.set(10.0, 10.0, 10.0);
    object.position.set(0.0, 0.0, -8.0);

    scene.add(object);
  });
}


const terrainGeometry = new THREE.PlaneBufferGeometry(20, 20);
const terrain = new THREE.Mesh(terrainGeometry, floorMaterial);

// Q1e) HINT : Enable the terrain to receive shadows
terrain.rotation.set(- Math.PI / 2, 0, 0);
terrain.receiveShadow = true;
scene.add(terrain);

// Q1c) HINT : Create the geometry for the skybox and link it with the skyboxMaterial
const skybox = new THREE.Mesh(
  new THREE.BoxGeometry(100, 100, 100),
  skyboxMaterial
);
scene.add(skybox);

// Q1e) HINT : Enable shadows for the environment mapped armadillo
// You will need to make changes in loadAndPlaceOBJ in setup.js.

// Look at the definition of loadOBJ to familiarize yourself with
// how each parameter affects the loaded object.
loadAndPlaceOBJ('gltf/armadillo.obj', envmapMaterial, function (armadillo) {
  armadillo.castShadow = true;
  armadillo.position.set(0.0, 4.0, 6.0);
  armadillo.scale.set(0.075, 0.075, 0.075);
  armadillo.parent = worldFrame;
  scene.add(armadillo);
});

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
  if (keyboard.pressed("A"))
  light.position.x -= 0.2;
  if (keyboard.pressed("D"))
  light.position.x += 0.2;
  if (keyboard.pressed("W"))
  light.position.z -= 0.2;
  if (keyboard.pressed("S"))
  light.position.z += 0.2;
  if (keyboard.pressed("Q"))
  light.position.y += 0.2;
  if (keyboard.pressed("E"))
  light.position.y -= 0.2;
  
  lightDirection.copy(light.position);
  lightDirection.sub(light.target.position);
}

function updateMaterials() {
  envmapMaterial.needsUpdate = true;
  shayDMaterial.needsUpdate = true;
  skyboxMaterial.needsUpdate = true;
}

// Setup update callback
function update() {
  checkKeyboard();
  updateMaterials();

  cameraPositionUniform.value = camera.position;
  
  requestAnimationFrame(update);
  renderer.clear();
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
