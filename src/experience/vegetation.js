import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { scene } from './scene.js';
import { loadModel } from './loaders.js';
import { ISLAND_RADIUS, ROAD_RADIUS, clearings } from './island.js';

// Palet warna sama dengan referensi: bunga biru muda, pohon ungu
const BLOSSOM_PALETTE = [0xbdd1ff, 0xd5e1ff, 0xeef2ff];
const TREE_PALETTE = [0x320daa, 0x411bc7, 0x5028e3];

/** Ambil semua mesh varian dari sebuah pack model, geometri dibake & dinormalisasi */
function extractVariants(gltfScene, targetHeight) {
    const variants = [];
    gltfScene.updateWorldMatrix(true, true);
    gltfScene.traverse((node) => {
        if (!node.isMesh) return;
        const geometry = node.geometry.clone();
        geometry.applyMatrix4(node.matrixWorld);
        geometry.computeBoundingBox();
        const box = geometry.boundingBox;
        const size = box.getSize(new THREE.Vector3());
        const scale = targetHeight / Math.max(size.y, 0.0001);
        const center = box.getCenter(new THREE.Vector3());
        geometry.translate(-center.x, -box.min.y, -center.z);
        geometry.scale(scale, scale, scale);
        variants.push(geometry);
    });
    return variants;
}

/** Titik acak di permukaan pulau, menghindari jalan & area landmark */
function makeSampler() {
    const surface = new THREE.Mesh(
        new THREE.CircleGeometry(ISLAND_RADIUS - 0.8, 48).rotateX(-Math.PI / 2)
    );
    const sampler = new MeshSurfaceSampler(surface).build();
    const temp = new THREE.Vector3();

    return function sample() {
        for (let attempt = 0; attempt < 40; attempt++) {
            sampler.sample(temp);
            const dist = Math.hypot(temp.x, temp.z);
            if (dist > ROAD_RADIUS - 1.5 && dist < ROAD_RADIUS + 1.5) continue; // jalan
            const blocked = clearings.some(
                (c) => Math.hypot(temp.x - c.x, temp.z - c.z) < c.r
            );
            if (blocked) continue;
            return temp.clone();
        }
        return null;
    };
}

function scatter(variants, material, count, { minScale, maxScale, palette, sample }) {
    const color = new THREE.Color();
    const dummy = new THREE.Object3D();
    const perVariant = Math.ceil(count / variants.length);

    for (const geometry of variants) {
        const mesh = new THREE.InstancedMesh(geometry, material, perVariant);
        for (let i = 0; i < perVariant; i++) {
            const pos = sample();
            if (!pos) continue;
            dummy.position.copy(pos);
            dummy.rotation.y = Math.random() * Math.PI * 2;
            dummy.scale.setScalar(minScale + Math.random() * (maxScale - minScale));
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            color.setHex(palette[Math.floor(Math.random() * palette.length)]);
            mesh.setColorAt(i, color.convertSRGBToLinear());
        }
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
    }
}

/** Sebar pohon ungu (±80) dan bunga biru muda (±250) — InstancedMesh */
export async function buildVegetation() {
    const sample = makeSampler();

    const treeGltf = await loadModel('/models/tree.glb');
    const treeVariants = extractVariants(treeGltf.scene, 1);
    scatter(treeVariants, new THREE.MeshLambertMaterial(), 80, {
        minScale: 1.1, maxScale: 2.4,
        palette: TREE_PALETTE,
        sample,
    });

    const flowerGltf = await loadModel('/models/flower.glb');
    const flowerVariants = extractVariants(flowerGltf.scene, 1);
    scatter(flowerVariants, new THREE.MeshLambertMaterial({
        emissive: new THREE.Color(0xbdd1ff).convertSRGBToLinear(),
        emissiveIntensity: 0.5,
    }), 250, {
        minScale: 0.22, maxScale: 0.4,
        palette: BLOSSOM_PALETTE,
        sample,
    });
}
