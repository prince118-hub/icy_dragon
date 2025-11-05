import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ==================== SCENE SETUP ====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0e1a);
scene.fog = new THREE.FogExp2(0x0a0e1a, 0.08);

// ==================== CAMERA SETUP ====================
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);
camera.lookAt(0, 0, 0);

// ==================== RENDERER SETUP ====================
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
document.getElementById("canvas-container").appendChild(renderer.domElement);

// ==================== ORBIT CONTROLS ====================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.target.set(0, 0.5, 0);
controls.minDistance = 3;
controls.maxDistance = 20;
controls.minPolarAngle = Math.PI * 0.2;
controls.maxPolarAngle = Math.PI * 0.49;
controls.enabled = true;

let userIsOrbiting = false;
controls.addEventListener("start", () => (userIsOrbiting = true));
controls.addEventListener("end", () => (userIsOrbiting = false));

// ==================== LIGHTING ====================
// Ambient light for base visibility
const ambientLight = new THREE.AmbientLight(0x4a6fa5, 0.3);
scene.add(ambientLight);

// Cold blue key light (main light)
const keyLight = new THREE.DirectionalLight(0x6eb3ff, 1.8);
keyLight.position.set(-8, 12, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.width = 2048;
keyLight.shadow.mapSize.height = 2048;
keyLight.shadow.camera.near = 0.5;
keyLight.shadow.camera.far = 50;
keyLight.shadow.camera.left = -20;
keyLight.shadow.camera.right = 20;
keyLight.shadow.camera.top = 20;
keyLight.shadow.camera.bottom = -20;
scene.add(keyLight);

// Backlight for dragon silhouette
const rimLight = new THREE.DirectionalLight(0x88ccff, 1.2);
rimLight.position.set(3, 3, -8);
scene.add(rimLight);

// Accent light from below (icy reflection effect)
const accentLight = new THREE.PointLight(0xaaddff, 1.5, 30);
accentLight.position.set(0, -2, 3);
scene.add(accentLight);

// Atmospheric point lights
const glowLight1 = new THREE.PointLight(0x66aaff, 2, 20);
glowLight1.position.set(-5, 5, -3);
scene.add(glowLight1);

const glowLight2 = new THREE.PointLight(0x88ddff, 1.5, 15);
glowLight2.position.set(5, 3, 2);
scene.add(glowLight2);

// ==================== GROUND PLANE ====================
const groundGeometry = new THREE.PlaneGeometry(400, 400);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x0d1b2a,
  roughness: 0.6,
  metalness: 0.1,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.01;
ground.receiveShadow = true;
scene.add(ground);

// ==================== DRAGON MODEL ====================
const loader = new GLTFLoader();
let model;
let dragonMixer = null;
const dragonAnimations = {
  breathingScale: 0,
  headRotation: 0,
};

// Create a temporary placeholder mesh while model loads
const placeholderGeometry = new THREE.SphereGeometry(1, 32, 32);
const placeholderMaterial = new THREE.MeshStandardMaterial({
  color: 0x88ccff,
  emissive: 0x4488cc,
  emissiveIntensity: 0.5,
  metalness: 0.7,
  roughness: 0.3,
});
const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
placeholder.position.set(0, 0.5, 0);
placeholder.castShadow = true;
placeholder.receiveShadow = true;
scene.add(placeholder);

const modelPath = "/model/icy_dragon.glb";

loader.load(
  modelPath,
  (gltf) => {
    // Success! Remove placeholder
    scene.remove(placeholder);

    model = gltf.scene;

    // Center and scale the model BEFORE adding to scene
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    model.position.sub(center);
    model.position.set(0, 0, 0);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 12 / maxDim;
    model.scale.setScalar(scale);

    scene.add(model);

    // Enable shadows and materials
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;

        // Make sure geometry is available for raycasting
        if (node.geometry) {
          node.geometry.computeBoundingBox();
          node.geometry.computeBoundingSphere();
        }

        // Enhance material with icy appearance
        if (node.material) {
          node.material.metalness = 0.6;
          node.material.roughness = 0.3;
          node.material.envMapIntensity = 1.5;
        }
      }
    });

    // Check for animations in the model
    if (gltf.animations && gltf.animations.length > 0) {
      dragonMixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        dragonMixer.clipAction(clip).play();
      });
    }

    // Create an invisible clickable box around the dragon for easier interaction
    const clickBoxGeometry = new THREE.BoxGeometry(
      size.x * scale * 1.2,
      size.y * scale * 1.2,
      size.z * scale * 1.2
    );
    const clickBoxMaterial = new THREE.MeshBasicMaterial({
      visible: false,
    });
    const clickBox = new THREE.Mesh(clickBoxGeometry, clickBoxMaterial);
    clickBox.name = "dragonClickBox";
    model.add(clickBox);
  },
  undefined,
  (error) => {
    console.error("Error loading dragon model:", error.message);
    model = placeholder;
  }
);

// ==================== SNOW PARTICLE SYSTEM ====================
const snowParticles = [];
const snowGeometry = new THREE.BufferGeometry();
const snowCount = 3000;
const snowPositions = new Float32Array(snowCount * 3);
const snowVelocities = [];

for (let i = 0; i < snowCount; i++) {
  snowPositions[i * 3] = (Math.random() - 0.5) * 100;
  snowPositions[i * 3 + 1] = Math.random() * 50 - 10;
  snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;

  snowVelocities.push({
    x: Math.random() * 0.02 - 0.01,
    y: -(Math.random() * 0.05 + 0.02),
    z: Math.random() * 0.02 - 0.01,
  });
}

snowGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(snowPositions, 3)
);

const snowMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.15,
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const snow = new THREE.Points(snowGeometry, snowMaterial);
scene.add(snow);

// ==================== FOG/MIST PARTICLES ====================
const mistParticles = [];
const mistGeometry = new THREE.BufferGeometry();
const mistCount = 800;
const mistPositions = new Float32Array(mistCount * 3);

for (let i = 0; i < mistCount; i++) {
  mistPositions[i * 3] = (Math.random() - 0.5) * 60;
  mistPositions[i * 3 + 1] = Math.random() * 30 - 5;
  mistPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

  mistParticles.push({
    velocity: {
      x: Math.random() * 0.01 - 0.005,
      z: Math.random() * 0.01 - 0.005,
    },
  });
}

mistGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(mistPositions, 3)
);

const mistMaterial = new THREE.PointsMaterial({
  color: 0x88ccff,
  size: 1.5,
  transparent: true,
  opacity: 0.15,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const mist = new THREE.Points(mistGeometry, mistMaterial);
scene.add(mist);

// ==================== ICE SPARKLE PARTICLES ====================
const sparkleGeometry = new THREE.BufferGeometry();
const sparkleCount = 500;
const sparklePositions = new Float32Array(sparkleCount * 3);

for (let i = 0; i < sparkleCount; i++) {
  sparklePositions[i * 3] = (Math.random() - 0.5) * 40;
  sparklePositions[i * 3 + 1] = Math.random() * 20 - 2;
  sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
}

sparkleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(sparklePositions, 3)
);

const sparkleMaterial = new THREE.PointsMaterial({
  color: 0xddffff,
  size: 0.08,
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const sparkles = new THREE.Points(sparkleGeometry, sparkleMaterial);
scene.add(sparkles);

// ==================== RAYCASTER & SCROLL SETUP ====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isHoveringDragon = false;
let heroViewMode = false;
let hoveredMesh = null;
let hoveredPrevEmissive = null;
let hoveredPrevEmissiveIntensity = 0;

// Scroll state (0.0 - 1.0)
let scrollProgress = 0;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Hero view settings (like Dota 2)
const heroViewSettings = {
  background: new THREE.Color(0x2a3f5f),
  cameraPosition: { x: 0, y: 1.2, z: 4.5 },
  fogDensity: 0.02,
};

const normalSettings = {
  background: new THREE.Color(0x0a0e1a),
  fogDensity: 0.08,
};

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
  // Perform raycasting on click
  if (model) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(model, true);

    if (intersects.length > 0 || isHoveringDragon) {
      // Toggle Hero View Mode on click
      heroViewMode = !heroViewMode;

      if (heroViewMode) {
        // Dota 2-style hero background - gradient blue
        scene.background = new THREE.Color(0x1a3050);
        scene.fog.density = 0.03;

        // Dramatic lighting for hero showcase
        keyLight.intensity = 2.5;
        rimLight.intensity = 2.2;
        ambientLight.intensity = 0.6;

        // Add rim glow effect
        glowLight1.intensity = 3.0;
        glowLight2.intensity = 2.5;

        // Update UI
        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.textContent = "🐉 Dragon Hero View - Click to exit";
          statusElement.style.color = "#88ddff";
        }
        controls.enabled = false;
      } else {
        console.log("🌨️ Returning to Normal View");

        // Return to icy atmosphere
        scene.background = new THREE.Color(0x0a0e1a);
        scene.fog.density = 0.08;

        // Normal lighting
        keyLight.intensity = 1.8;
        rimLight.intensity = 1.2;
        ambientLight.intensity = 0.3;

        glowLight1.intensity = 2.0;
        glowLight2.intensity = 1.5;

        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.textContent = "Hover over dragon to view";
          statusElement.style.color = "#ffffff";
        }
        controls.enabled = true;
      }
    }
  }
}

// Scroll handler drives scene animation via scrollProgress
function onScroll() {
  const doc = document.documentElement;
  const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  const raw = doc.scrollTop || window.scrollY || 0;
  scrollProgress = clamp01(raw / maxScroll);
}

// Double-click for fullscreen
function onDoubleClick(event) {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Keyboard shortcut for hero view toggle
function onKeyPress(event) {
  if (event.key === "h" || event.key === "H") {
    if (model && model !== placeholder) {
      heroViewMode = !heroViewMode;

      if (heroViewMode) {
        scene.background = new THREE.Color(0x1a3050);
        scene.fog.density = 0.03;
        keyLight.intensity = 2.5;
        rimLight.intensity = 2.2;
        ambientLight.intensity = 0.6;
        glowLight1.intensity = 3.0;
        glowLight2.intensity = 2.5;

        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.textContent = "🐉 Dragon Hero View - Press 'H' to exit";
          statusElement.style.color = "#88ddff";
        }
        controls.enabled = false;
      } else {
        scene.background = new THREE.Color(0x0a0e1a);
        scene.fog.density = 0.08;
        keyLight.intensity = 1.8;
        rimLight.intensity = 1.2;
        ambientLight.intensity = 0.3;
        glowLight1.intensity = 2.0;
        glowLight2.intensity = 1.5;

        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.textContent = "Press 'H' for Hero View";
          statusElement.style.color = "#ffffff";
        }
        controls.enabled = true;
      }
    }
  }
}

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("click", onMouseClick);
window.addEventListener("dblclick", onDoubleClick);
window.addEventListener("keydown", onKeyPress);
window.addEventListener("scroll", onScroll, { passive: true });

// ==================== CAMERA ANIMATION ====================
const cameraTarget = new THREE.Vector3(0, 0, 0);
let cameraAngle = 0;
const baseCameraRadius = 8;
const baseCameraHeight = 2;
const cameraSpeed = 0.0003;
let currentCameraRadius = baseCameraRadius;
let currentCameraHeight = baseCameraHeight;

function updateCamera(time) {
  if (heroViewMode) {
    // Hero View Mode: Static camera like Dota 2 hero view
    const targetX = heroViewSettings.cameraPosition.x;
    const targetZ = heroViewSettings.cameraPosition.z;
    const targetY = heroViewSettings.cameraPosition.y;

    // Smooth transition to hero view position
    camera.position.x += (targetX - camera.position.x) * 0.08;
    camera.position.y += (targetY - camera.position.y) * 0.08;
    camera.position.z += (targetZ - camera.position.z) * 0.08;

    // Look directly at dragon center
    cameraTarget.set(0, 0.5, 0);
    camera.lookAt(cameraTarget);
  } else {
    // Normal Mode: Smooth orbital movement influenced by scroll (paused while user orbits)
    const eased = easeInOut(scrollProgress);
    currentCameraRadius = baseCameraRadius * (1 - 0.35 * eased);
    currentCameraHeight = baseCameraHeight + 1.2 * eased;

    if (!userIsOrbiting && controls.enabled) {
      cameraAngle = time * cameraSpeed;

      const targetX = Math.sin(cameraAngle) * currentCameraRadius;
      const targetZ = Math.cos(cameraAngle) * currentCameraRadius;
      const targetY = currentCameraHeight + Math.sin(time * 0.0002) * 0.5;

      // Smooth camera position interpolation
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (targetY - camera.position.y) * 0.02;
      camera.position.z += (targetZ - camera.position.z) * 0.02;

      // Look at dragon with slight variation
      cameraTarget.y = Math.sin(time * 0.0003) * 0.3;
      controls.target.lerp(cameraTarget, 0.1);
    }
    camera.lookAt(controls.target);
  }
}

// ==================== DRAGON IDLE ANIMATION ====================
function updateDragonAnimation(time) {
  if (!model) return;

  // Subtle breathing animation
  dragonAnimations.breathingScale = Math.sin(time * 0.001) * 0.02;

  // Store the base scale
  const baseScale =
    model.scale.x / (1 + Math.sin((time - 16.67) * 0.001) * 0.02);
  model.scale.y = baseScale * (1 + dragonAnimations.breathingScale);

  // Gentle head/body sway (only if not the placeholder sphere)
  if (model !== placeholder) {
    dragonAnimations.headRotation = Math.sin(time * 0.0008) * 0.08;
    model.rotation.y = dragonAnimations.headRotation;
    model.rotation.x = Math.sin(time * 0.0005) * 0.03;
  } else {
    // Simple rotation for placeholder
    model.rotation.y += 0.002;
  }
}

// ==================== PARTICLE PHYSICS UPDATE ====================
function updateSnowParticles() {
  const positions = snow.geometry.attributes.position.array;
  const time = Date.now() * 0.001;
  const speedFactor = 1 + scrollProgress * 0.8;

  for (let i = 0; i < snowCount; i++) {
    const i3 = i * 3;

    // Apply velocity with wind effect
    positions[i3] +=
      (snowVelocities[i].x + Math.sin(time + i) * 0.001) * speedFactor;
    positions[i3 + 1] += snowVelocities[i].y * speedFactor;
    positions[i3 + 2] +=
      (snowVelocities[i].z + Math.cos(time + i) * 0.001) * speedFactor;

    // Reset particles that fall too low
    if (positions[i3 + 1] < -10) {
      positions[i3 + 1] = 40;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
    }

    // Wrap around edges
    if (Math.abs(positions[i3]) > 50) {
      positions[i3] = -Math.sign(positions[i3]) * 50;
    }
    if (Math.abs(positions[i3 + 2]) > 50) {
      positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * 50;
    }
  }

  snow.geometry.attributes.position.needsUpdate = true;
}

function updateMistParticles() {
  const positions = mist.geometry.attributes.position.array;

  for (let i = 0; i < mistCount; i++) {
    const i3 = i * 3;

    positions[i3] += mistParticles[i].velocity.x;
    positions[i3 + 2] += mistParticles[i].velocity.z;

    // Wrap around
    if (Math.abs(positions[i3]) > 30) {
      positions[i3] = -Math.sign(positions[i3]) * 30;
    }
    if (Math.abs(positions[i3 + 2]) > 30) {
      positions[i3 + 2] = -Math.sign(positions[i3 + 2]) * 30;
    }
  }

  mist.geometry.attributes.position.needsUpdate = true;
}

// ==================== RAYCASTER UPDATE ====================
function updateRaycaster() {
  if (!model || model === placeholder) return;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(model, true);

  const wasHovering = isHoveringDragon;
  isHoveringDragon = intersects.length > 0;

  // Visual feedback on hover (cursor change and subtle highlight)
  if (isHoveringDragon !== wasHovering) {
    if (isHoveringDragon) {
      // Hover started - show it's clickable
      document.body.style.cursor = "pointer";

      // Subtle highlight effect (only if not in hero mode)
      if (!heroViewMode) {
        rimLight.intensity = 1.8;
      }

      // Update UI hint
      if (!heroViewMode) {
        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.textContent = "🐉 Click dragon to enter Hero View";
          statusElement.style.color = "#88ccff";
        }
      }
    } else {
      // Hover ended
      document.body.style.cursor = "default";

      // Remove highlight (only if not in hero mode)
      if (!heroViewMode) {
        rimLight.intensity = 1.2;

        const statusElement = document.getElementById("status");
        if (statusElement) {
          statusElement.textContent =
            "Press 'H' for Hero View or hover/click dragon";
          statusElement.style.color = "#ffffff";
        }
      }
    }
  }

  // Emissive highlight on the topmost intersected mesh
  const newHovered = intersects.length > 0 ? intersects[0].object : null;
  if (newHovered !== hoveredMesh) {
    // restore previous
    if (
      hoveredMesh &&
      hoveredMesh.material &&
      "emissive" in hoveredMesh.material
    ) {
      hoveredMesh.material.emissive.set(hoveredPrevEmissive || 0x000000);
      hoveredMesh.material.emissiveIntensity = hoveredPrevEmissiveIntensity;
    }
    hoveredMesh = null;

    if (
      newHovered &&
      newHovered.material &&
      "emissive" in newHovered.material
    ) {
      hoveredMesh = newHovered;
      hoveredPrevEmissive = newHovered.material.emissive.clone();
      hoveredPrevEmissiveIntensity = newHovered.material.emissiveIntensity || 1;
      newHovered.material.emissive.setHex(0x66aaff);
      newHovered.material.emissiveIntensity = 1.5;
    }
  }
}

// ==================== DYNAMIC LIGHTING ====================
function updateDynamicLighting(time) {
  // Pulsing glow lights
  const eased = easeInOut(scrollProgress);
  glowLight1.intensity = 2 + Math.sin(time * 0.001) * 0.5 + 0.8 * eased;
  glowLight2.intensity = 1.5 + Math.cos(time * 0.0012) * 0.4 + 0.6 * eased;

  // Subtle light movement
  glowLight1.position.x = -5 + Math.sin(time * 0.0005) * 2;
  glowLight2.position.z = 2 + Math.cos(time * 0.0006) * 1.5;

  // Sparkle effect animation
  sparkleMaterial.opacity = 0.4 + Math.sin(time * 0.002) * 0.3 + 0.2 * eased;

  // Fog density influenced by scroll (unless in hero view)
  if (!heroViewMode) {
    scene.fog.density = THREE.MathUtils.lerp(0.08, 0.03, eased);
  }
}

// ==================== ANIMATION LOOP ====================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now();
  const delta = clock.getDelta();

  // Apply subtle scroll-driven sway to dragon scale/rotation (non-hero mode)
  if (!heroViewMode && model) {
    const eased = easeInOut(scrollProgress);
    model.rotation.y += 0.0005 * (1 + eased);
  }

  // Update all systems
  updateCamera(time);
  updateDragonAnimation(time);
  updateSnowParticles();
  updateMistParticles();
  updateRaycaster();
  updateDynamicLighting(time);

  // Update dragon animations if mixer exists
  if (dragonMixer) {
    dragonMixer.update(delta);
  }

  // Render scene
  controls.update();
  renderer.render(scene, camera);
}

animate();

// ==================== WINDOW RESIZE ====================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
