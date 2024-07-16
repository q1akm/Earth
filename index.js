import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from './src/getStarfield.js'
import getFresnelMat from './src/getFresnelMat.js'

const w = window.innerWidth;
const h = window.innerHeight;

// Renderer 
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera 
const camera = new THREE.PerspectiveCamera( 75, w/h, 0.1, 1000);
camera.position.z = 4;

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.dampingFactor = 0.03;


// Scene 
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, 12);
const mat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/00_earthmap1k.jpg"),
});

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup)

const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

// LightsTexture
const lightMat = new THREE.MeshBasicMaterial({
    map: loader.load("./textures/03_earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
})
const lightMesh = new THREE.Mesh(geo, lightMat);
earthGroup.add(lightMesh)

// CloudsTexture
const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/05_earthcloudmaptrans.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
})
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

// Glow texture
const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

//Stars
const stars = getStarfield({numStars: 3000});
scene.add(stars);

//Sun Light
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate (t = 0) {
    requestAnimationFrame(animate) ;
    earthMesh.rotation.y += 0.002;
    lightMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0023;
    glowMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
    controls.update();
}

animate();
