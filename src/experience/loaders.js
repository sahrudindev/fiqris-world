import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

THREE.Cache.enabled = true;

export const loadingManager = new THREE.LoadingManager();

const progressContainer = document.getElementById('progress');
const progressBar = document.getElementById('progress-bar');

loadingManager.onProgress = (url, loaded, total) => {
    progressBar.style.width = (loaded / total) * 100 + '%';
};

loadingManager.onLoad = () => {
    progressContainer.style.display = 'none';
    document.getElementById('start-button').style.display = 'inline-flex';
};

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

export const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);

/** Load .glb sebagai Promise → { scene, animations } */
export function loadModel(path) {
    return new Promise((resolve, reject) => {
        gltfLoader.load(path, (gltf) => resolve(gltf), undefined, reject);
    });
}

/** Aktifkan bayangan untuk semua mesh di dalam objek */
export function enableShadows(object) {
    object.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    return object;
}

/**
 * Normalisasi model dari sumber berbeda-beda:
 * skala seragam agar tingginya = height, lalu duduk tepat di y=0
 * dengan pusat X/Z di titik origin.
 */
export function fitObject(object, height) {
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const scale = height / Math.max(size.y, 0.0001);
    object.scale.setScalar(scale);

    const box2 = new THREE.Box3().setFromObject(object);
    const center = box2.getCenter(new THREE.Vector3());
    object.position.x -= center.x;
    object.position.z -= center.z;
    object.position.y -= box2.min.y;
    return object;
}

/**
 * Bungkus model dalam Group agar posisi/rotasi bisa diatur bebas
 * tanpa merusak offset hasil normalisasi.
 */
export function wrap(object) {
    const group = new THREE.Group();
    group.add(object);
    return group;
}
