// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('webgl-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Movement controls
const moveSpeed = 0.1; // Adjust this value to change movement speed
const keys = { 
    ArrowLeft: false, 
    ArrowRight: false, 
    KeyA: false, 
    KeyD: false,
    ArrowUp: false, 
    ArrowDown: false, 
    KeyW: false, 
    KeyS: false 
}; // Track key states

// Handle keydown events
window.addEventListener('keydown', (event) => {
    if (event.code in keys) {
        keys[event.code] = true;
    }
});

// Handle keyup events
window.addEventListener('keyup', (event) => {
    if (event.code in keys) {
        keys[event.code] = false;
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // Move the cube based on key input
    if (keys.ArrowLeft || keys.KeyA) {
        cube.position.x -= moveSpeed; // Move left
    }
    if (keys.ArrowRight || keys.KeyD) {
        cube.position.x += moveSpeed; // Move right
    }
    if (keys.ArrowUp || keys.KeyW) {
        cube.position.y += moveSpeed; // Move up
    }
    if (keys.ArrowDown || keys.KeyS) {
        cube.position.y -= moveSpeed; // Move down
    }
    
    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Start the animation
animate();