import * as THREE from 'three';

export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

export const scene = new THREE.Scene();
scene.background = null; // langit = CSS gradient di belakang canvas

export const canvas = document.querySelector('canvas.webgl');

// Kamera — parameter sama dengan referensi (fov 64, near 1, far 90)
export const camera = new THREE.PerspectiveCamera(64, sizes.width / sizes.height, 1, 90);
camera.position.set(0, 30, 30);
scene.add(camera);

export const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xffffff, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
