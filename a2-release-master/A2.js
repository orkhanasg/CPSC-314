/*
 * UBC CPSC 314, Vjan2021
 * Assignment 2 Template
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

// Initialize uniforms

// As in A1 we position the virus in the world solely using this uniform
// So the initial y-offset being 1.0 here is intended.
const virusOffset = { type: 'v3', value: new THREE.Vector3(0.0, 1.0, 0.0) };

var rotation = {
	type: 'f',
	value: 0.0
};
// Pelvis frame is set with respect to the Armadillo.
const pelvisFrame = new THREE.Object3D();
// Position the pelvis in Aramdillo's object coordinate frame (note that the Armadillo is scaled).
pelvisFrame.position.copy(new THREE.Vector3(0.0, 20.0, 10.0));

// Dodge frame with respect to the Pelvis frame
const dodgeFrame = new THREE.Object3D();
pelvisFrame.add(dodgeFrame);
// Important: since we will manually update the dodge matrix,
// don't let the automatic scene graph traversal overwrite it.
dodgeFrame.matrixAutoUpdate = false;


// Distance threshold beyond which the armadillo should shoot lasers at the sphere (needed for Q1c).
const LaserDistance = 10.0;
// Minimum safe distance to virus (needed for Q1d).
const MinDistance = 6.0;
// Maximum hieght beyond which there is no point in dodging the virus (needed for Q1d).
const MaxHeight = 10.0;

const dodgeMatrix = {type: 'm4', value: new THREE.Matrix4()};
const pelvisMatrix = {type: 'm4', value: pelvisFrame.matrix};
const pelvisPosition = {type: 'v3', value: pelvisFrame.position};
const upVector = {type: 'v3', value: pelvisFrame.up};




// Materials: specifying uniforms and shaders
const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    virusOffset: virusOffset,
    rotation: rotation,
    dodgeMatrix:  dodgeMatrix,
    pelvisMatrix: pelvisMatrix,
    pelvisPosition: pelvisPosition,
    upVector: upVector
    // HINT: to add a Matrix4 uniform use the syntax:
    // <uniform name>: { value: <matrix4 variable name> },
    // You may need to add more than one.
    // HINT: Each frame has an associated transform accessibly via the `matrix` property.
  }
});



const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    virusOffset: virusOffset
  }
});

const eyeMaterial = new THREE.ShaderMaterial();

// const laserMaterial = new THREE.ShaderMaterial({
//   uniforms: {
//     virusOffset: virusOffset,
//   }
// });

// HINT: Remember to add laser shaders if you decide to use a shader material for lasers.

// Load shaders.
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl'
 
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

  // laserMaterial.vertexShader = shaders['glsl/laser.vs.glsl'];
  // laserMaterial.fragmentShader = shaders['glsl/laser.fs.glsl'];
});

// Load and place the Armadillo geometry.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, function (armadillo) {
  armadillo.rotation.y = Math.PI;
  armadillo.scale.set(0.1, 0.1, 0.1);
  armadillo.position.set(0.0, 5.3, -8.0)
  armadillo.add(pelvisFrame);
  scene.add(armadillo);
});

// Create the main covid sphere geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(sphereLight);

// Eyes (Q1a and Q1b)
// Create the eye ball geometry
const eyeGeometry = new THREE.SphereGeometry(1, 32, 32);

// HINT: Replace the following with two eye ball meshes from the same geometry.
const LeftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
const RightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);

//LeftEye.parent = dodgeFrame;
//RightEye.parent = dodgeFrame;

//scene.add(LeftEye);
//scene.add(RightEye);

LeftEye.position.set(-7, 48, -42);
RightEye.position.set(6.5, 48, -42);

LeftEye.scale.set(4, 4, 4 );
RightEye.scale.set(4, 4, 4);

dodgeFrame.add(LeftEye);
dodgeFrame.add(RightEye);

/*
LeftEye.scale.set(0.4, 0.4, 0.4);
RightEye.scale.set(0.4, 0.4, 0.4);
LeftEye.position.set(0.75, 12, -4.7);
RightEye.position.set(-0.75, 12, -4.7);
*/
// HINT: Use one of the lookAt funcitons available in three.js to make the eyes look at the virus.
// HINT: Remember to update these matrices every time the virus changes position.

// HINT: Add the eyes to the dodgeFrame to ensure they will follow the body when you implement Q1d.

// Lasers (Q1c)
	


	var laserGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
	const laserMaterial = new THREE.MeshBasicMaterial( {color: 0xC71585});

	laserGeometry.translate(0, 1/2, 0);
	laserGeometry.rotateX(Math.PI/2);
	var virusPosition = new THREE.Vector3();
	//virusCopy.copy(virusOffset.value);
	//laserGeometry.vertices.push(LeftEye.worldToLocal(virusCopy));


	const LeftLaser = new THREE.Mesh(laserGeometry, laserMaterial);
	const RightLaser = new THREE.Mesh(laserGeometry, laserMaterial);

	RightEye.add(RightLaser);
	LeftEye.add(LeftLaser);
	LeftLaser.position.set( 0, 0, 0); 
	RightLaser.position.set(0, 0, 0);
 

 //scene.add(LeftLaser);
 //scene.add(RightLaser);


 	

//if ((Math.sqrt((Math.pow((virusOffset.value.x - 0.75), 2)) + (Math.pow((virusOffset.value.y - 12), 2)) + (Math.pow((virusOffset.value.z +4.7), 2)))) < LaserDistance) 
 	

//RightEye.add(RightLaser);
//scene.add(LeftLaser);
//scene.add(RightLaser);

//LeftLaser.rotation.x = (Math.PI / 5);
//
// const axesHelper = new Three.AxesHelper(5);
// LeftLaser.add(axesHelper);

// HINT: You can use THREE.CylinderGeometry to create lasers easily:
//       https://threejs.org/docs/index.html#api/en/geometries/CylinderGeometry
// NOTE: These could also be made with two camera facing trinagles or quads instead of a full blown
//       cylinder.

// HINT: To have lasers inherit the eye transforms, make them children of the eyeballs you created
// above.

// HINT: Remember that LaserDistance is given in world space units, but the actual scale of the
// lasers may be set in a different (possibly scaled) frame.

// HINT: As with eyes, remember that these need to be updated with every time the virus position
// changes.

// Dodge (Q1d)
// Make the armadillo dodge the virus by rotating the body away from the virus.

//dodgeFrame.rotateZ(Math.PI/2);
//pelvisFrame.rotateX(Math.PI/2);
//dodgeFrame.matrix.makeRotationX(rotation);


// HINT: Like with lasers, remember that MaxHeight and MinDistance is given in world space 
// units, but the actual transformation will happen in a different (possibly scaled) frame.

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    virusOffset.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    virusOffset.value.z += 0.3;

  if (keyboard.pressed("A"))
    virusOffset.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    virusOffset.value.x += 0.3;

  if (keyboard.pressed("E"))
    virusOffset.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    virusOffset.value.y += 0.3;

  // HINT: You may need to place code or call functions here to make sure your tranforms are updated
  // whenever the virus position changes.

  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;
  laserMaterial.needsUpdate = true;


  LeftEye.lookAt(virusOffset.value.x, virusOffset.value.y, virusOffset.value.z);
  RightEye.lookAt(virusOffset.value.x, virusOffset.value.y, virusOffset.value.z);


//   if(virusOffset.value.x < MinDistance && virusOffset.value.y < MaxHeight){
//   dodgeMatrix.value.set(dodgeFrame.matrix);
// }
 	
	let virusPosition = LeftEye.worldToLocal(virusOffset.value.clone());
	 let virusDistance = LeftEye.position.distanceTo(virusPosition);


 	if (virusDistance < MinDistance*12 ) {
		  // tilt head up
		rotation.value += 1;
	 } 

	 
  	//dodgeFrame.matrix.makeRotationX(rotation);

 	if ( (Math.sqrt((Math.pow((virusPosition.x - LeftEye.position.x), 2)) + (Math.pow((virusPosition.y - LeftEye.position.y), 2)) + (Math.pow((virusPosition.z - LeftEye.position.z), 2)))) < LaserDistance*7.5) {
 			LeftLaser.material.opacity = 1;
 			LeftLaser.scale.set(1, 1, virusDistance/7.5);
  			RightLaser.scale.set(1, 1, (Math.sqrt((Math.pow((virusPosition.x - LeftEye.position.x), 2)) + (Math.pow((virusPosition.y - LeftEye.position.y), 2)) + (Math.pow((virusPosition.z - LeftEye.position.z), 2))))/7.5);
  				
 	}else{
 		LeftLaser.material.transparent = true;
 		LeftLaser.material.opacity = 0;
 	}

 	//&& (virusPosition.y - LeftEye.position.y) < MaxHeight*8
 	//(Math.sqrt((Math.pow((virusPosition.x - LeftEye.position.x), 2)) + (Math.pow((virusPosition.y - LeftEye.position.y), 2)) + (Math.pow((virusPosition.z - LeftEye.position.z), 2)))) 	//&& (virusPosition.y - LeftEye.position.y) < MaxHeight*8

  LeftLaser.lookAt(virusOffset.value.x, virusOffset.value.y, virusOffset.value.z);
  RightLaser.lookAt(virusOffset.value.x, virusOffset.value.y, virusOffset.value.z);

  // Move the sphere light in the scene. This allows the floor to reflect the light as it moves.
  sphereLight.position.set(virusOffset.value.x, virusOffset.value.y, virusOffset.value.z);
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
