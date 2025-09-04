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

// Touch control variables
let touchStartX = null;
let touchStartY = null;
let touchActive = { left: false, right: false, up: false, down: false };

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

// Handle touchstart events
window.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

// Handle touchmove events
window.addEventListener('touchmove', (event) => {
    if (!touchStartX || !touchStartY) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const threshold = 20; // Minimum swipe distance to register movement
    
    // Reset touch states
    touchActive = { left: false, right: false, up: false, down: false };
    
    // Determine if touch is on left or right half of the screen
    const isLeftHalf = touchStartX < window.innerWidth / 2;
    
    if (isLeftHalf) {
        // Left half: control left/right movement
        if (Math.abs(deltaX) > threshold) {
            if (deltaX < 0) touchActive.left = true; // Swipe left
            else touchActive.right = true; // Swipe right
        }
    } else {
        // Right half: control up/down movement
        if (Math.abs(deltaY) > threshold) {
            if (deltaY < 0) touchActive.up = true; // Swipe up
            else touchActive.down = true; // Swipe down
        }
    }
    
    // Update touch start positions for continuous swiping
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
});

// Handle touchend events
window.addEventListener('touchend', () => {
    // Reset touch states when touch ends
    touchActive = { left: false, right: false, up: false, down: false };
    touchStartX = null;
    touchStartY = null;
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // Move the cube based on key input
    if (keys.ArrowLeft || keys.KeyA || touchActive.left) {
        cube.position.x -= moveSpeed; // Move left
    }
    if (keys.ArrowRight || keys.KeyD || touchActive.right) {
        cube.position.x += moveSpeed; // Move right
    }
    if (keys.ArrowUp || keys.KeyW || touchActive.up) {
        cube.position.y += moveSpeed; // Move up
    }
    if (keys.ArrowDown || keys.KeyS || touchActive.down) {
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
