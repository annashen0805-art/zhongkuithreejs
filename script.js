// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const canvas = document.getElementById('webgl-canvas');
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    canvas.clientWidth / canvas.clientHeight, // Aspect ratio based on canvas size
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Use canvas dimensions

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

// Button states for touch/mouse input
const buttons = {
    left: false,
    right: false,
    up: false,
    down: false
};

// Get button elements
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const upBtn = document.getElementById('up-btn');
const downBtn = document.getElementById('down-btn');

// Handle button press (mouse or touch)
function handleButtonPress(button, state) {
    buttons[button] = state;
}

// Add event listeners for buttons (both mouse and touch)
[leftBtn, rightBtn, upBtn, downBtn].forEach((btn, index) => {
    const buttonName = ['left', 'right', 'up', 'down'][index];
    
    // Mouse events (for desktop testing)
    btn.addEventListener('mousedown', () => handleButtonPress(buttonName, true));
    btn.addEventListener('mouseup', () => handleButtonPress(buttonName, false));
    btn.addEventListener('mouseleave', () => handleButtonPress(buttonName, false)); // Stop if mouse leaves
    
    // Touch events (for mobile)
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling/zooming
        handleButtonPress(buttonName, true);
    });
    btn.addEventListener('touchend', () => handleButtonPress(buttonName, false));
    btn.addEventListener('touchcancel', () => handleButtonPress(buttonName, false)); // Handle interruptions
});

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

// Function to calculate dynamic boundaries based on canvas size
function getBoundaries() {
    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const z = camera.position.z;
    
    // Calculate visible height and width at z=0 (cube's plane)
    const visibleHeight = 2 * Math.tan(fov / 2) * z;
    const visibleWidth = visibleHeight * aspect;
    
    // Set boundaries to keep cube within visible area (accounting for cube size)
    const margin = 0.5; // Half of cube size (1x1x1) to keep edges inside
    return {
        xMin: -visibleWidth / 2 + margin,
        xMax: visibleWidth / 2 - margin,
        yMin: -visibleHeight / 2 + margin,
        yMax: visibleHeight / 2 - margin
    };
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    
    // Move the cube based on key or button input
    if (keys.ArrowLeft || keys.KeyA || buttons.left) {
        cube.position.x -= moveSpeed; // Move left
    }
    if (keys.ArrowRight || keys.KeyD || buttons.right) {
        cube.position.x += moveSpeed; // Move right
    }
    if (keys.ArrowUp || keys.KeyW || buttons.up) {
        cube.position.y += moveSpeed; // Move up
    }
    if (keys.ArrowDown || keys.KeyS || buttons.down) {
        cube.position.y -= moveSpeed; // Move down
    }
    
    // Apply dynamic boundaries
    const boundaries = getBoundaries();
    if (cube.position.x < boundaries.xMin) cube.position.x = boundaries.xMin;
    if (cube.position.x > boundaries.xMax) cube.position.x = boundaries.xMax;
    if (cube.position.y < boundaries.yMin) cube.position.y = boundaries.yMin;
    if (cube.position.y > boundaries.yMax) cube.position.y = boundaries.yMax;
    
    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight); // Update to canvas size
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
});

// Start the animation
animate();
