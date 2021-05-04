/**
 * UBC CPSC 314
 * Assignment 1 Template setup
 */

/**
 * Creates a basic scene and returns necessary objects
 * to manipulate the scene, camera and render context.
 */
function setup() {
    // Check WebGL Version
    if (!WEBGL.isWebGL2Available()) {
        document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
    }

    // Get the canvas element and its drawing context from the HTML document.
    const canvas = document.getElementById('webglcanvas');
    const context = canvas.getContext('webgl2');

    // Construct a THREEjs renderer from the canvas and context.
    const renderer = new THREE.WebGLRenderer({ canvas, context });
    renderer.setClearColor(0X80CEE1); // blue background colour
    const scene = new THREE.Scene();

    // Set up the camera.
    const camera = new THREE.PerspectiveCamera(30.0, 1.0, 0.1, 1000.0); // view angle, aspect ratio, near, far
    camera.position.set(0.0, 30.0, 55.0);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Setup orbit controls for the camera.
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.damping = 0.2;
    controls.autoRotate = false;

    // Update projection matrix based on the windows size.
    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // World Coordinate Frame: other objects are defined with respect to it.
    const worldFrame = new THREE.AxesHelper(1);
    scene.add(worldFrame);

    // Diffuse texture map (this defines the main colors of the floor)
    const floorDiff = new THREE.TextureLoader().load('images/cobblestone_floor_diff.jpg');
    // Ambient occlusion map
    const floorAo = new THREE.TextureLoader().load('images/cobblestone_floor_ao.jpg');
    // Displacement map
    const floorDisp = new THREE.TextureLoader().load('images/cobblestone_floor_disp.jpg');
    // Normal map
    const floorNorm = new THREE.TextureLoader().load('images/cobblestone_floor_nor.jpg');
    // Roughness map
    const floorRoughness = new THREE.TextureLoader().load('images/cobblestone_floor_rough.jpg');

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorDiff,
        aoMap: floorAo,
        displacementMap: floorDisp,
        normalMap: floorNorm,
        roughnessMap: floorRoughness,
        side: THREE.DoubleSide
    });
    const floorGeometry = new THREE.PlaneBufferGeometry(30.0, 30.0);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2.0;
    floor.position.y = -0.3;
    scene.add(floor);
    floor.parent = worldFrame;

    // Cast a weak ambient light to make the floor visible.
    const light = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(light);

    return {
        renderer,
        scene,
        camera,
        worldFrame,
    };
}

/**
 * Utility function that loads obj files using THREE.OBJLoader
 * and places them in the scene using the given callback `place`.
 * 
 * The variable passed into the place callback is a THREE.Object3D.
 */
function loadAndPlaceOBJ(file, material, place) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100.0;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    const loader = new THREE.OBJLoader(manager);
    loader.load(file, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
        place(object);
    }, onProgress);
}

/**
 * Generate a random sampling of affine transforms (4x4 affine matrices) on the sphere
 * of the given radius centered around the origin.
 * 
 * Each returned transform rotates a spike oriented along the vector (0, 1, 0) to point away
 * from the center of the sphere.
 * 
 * See https://www.jasondavies.com/maps/random-points/ for an explanation of this algorithm.
 * 
 * @param radius Radius of the sphere around which to position the spikes.
 * @param n Number of samples to generate.
 * @param scale The scale of each spike.
 * @param xOff x coordinate of the center of the sphere.
 * @param yOff y coordinate of the center of the sphere.
 * @param zOff z coordinate of the center of the sphere.
 */
function generateSphereSampling(radius, n, scale = 1.0, xOff = 0.0, yOff = 0.0, zOff = 0.0) {
    const orientations = [];
    for (let i = 0; i < n; ++i) {
        let best;
        let maxDist = 0.0;
        for (let k = 0; k < 10; ++k) {
            const lambda = Math.random() * 2 * Math.PI - Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            // Compute position of the point on the sphere.
            // This also defines the orientation of a spike.
            const x = Math.cos(lambda) * Math.sin(phi);
            const z = Math.sin(lambda) * Math.sin(phi);
            const y = Math.cos(phi);
            const trial = new THREE.Vector3(x, y, z);
            if (orientations.length === 0) {
                best = trial;
                break;
            } else {
                // Compute minimum distance from the trial to all other samples.
                let minDist = Infinity;
                for (let j = 0; j < orientations.length; ++j) {
                    const dist = orientations[j].distanceTo(trial);
                    if (dist < minDist) {
                        minDist = dist;
                    }
                }

                // Pick the best trial.
                if (minDist > maxDist) {
                    maxDist = minDist;
                    best = trial;
                }
            }
        }
        orientations.push(best);
    }

    const affine = [];
    for (let j = 0; j < orientations.length; ++j) {
        const x = orientations[j].x;
        const y = orientations[j].y;
        const z = orientations[j].z;

        // The axis of rotation is (0,1,0) x (x,y,z).
        const axis = new THREE.Vector3(z, 0, -x);
        const theta = Math.acos(y);
        axis.normalize();

        affine.push(new THREE.Matrix4()
            .makeRotationAxis(axis, theta)
            .scale(new THREE.Vector3(scale, scale, scale))
            .setPosition(new THREE.Vector3(x * radius + xOff, y * radius + yOff, z * radius + zOff)));
    }
    return affine;
}