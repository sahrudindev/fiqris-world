import * as THREE from 'three';
import { scene } from './scene.js';
import { loadModel, enableShadows, fitObject, wrap } from './loaders.js';

export const ISLAND_RADIUS = 13.4;
export const ROAD_RADIUS = 11.8;   // radius jalan melingkar (sama dengan referensi)
export const CHAPTERS = 9;          // jumlah popup cerita

/** Sudut tengah segmen cerita ke-i (selaras dengan jendela popup 0.025–0.08) */
export function chapterAngle(i) {
    return Math.PI * 2 * (0.0525 + i / CHAPTERS);
}

/** Posisi di atas pulau pada sudut & radius tertentu */
export function polar(angle, radius, y = 0) {
    return new THREE.Vector3(Math.sin(angle) * radius, y, Math.cos(angle) * radius);
}

// Titik yang harus bebas dari vegetasi (landmark, karakter, dekorasi)
export const clearings = [];

function addClearing(pos, r = 2.4) {
    clearings.push({ x: pos.x, z: pos.z, r });
}

/** Pulau prosedural: rumput + tebing tanah + pasir + jalan melingkar */
export function buildIsland() {
    const island = new THREE.Group();

    const grassMat = new THREE.MeshLambertMaterial({ color: 0x8fcb7f });
    const dirtMat = new THREE.MeshLambertMaterial({ color: 0x8b6a4f });
    const sandMat = new THREE.MeshLambertMaterial({ color: 0xefe0ac });
    const roadMat = new THREE.MeshLambertMaterial({ color: 0xf5f1e8 });

    // Permukaan rumput
    const grass = new THREE.Mesh(
        new THREE.CylinderGeometry(ISLAND_RADIUS - 0.6, ISLAND_RADIUS, 0.5, 64),
        grassMat
    );
    grass.position.y = -0.25;
    grass.receiveShadow = true;
    island.add(grass);

    // Bibir pasir di tepi
    const sand = new THREE.Mesh(
        new THREE.CylinderGeometry(ISLAND_RADIUS + 0.35, ISLAND_RADIUS + 0.55, 0.34, 64),
        sandMat
    );
    sand.position.y = -0.42;
    sand.receiveShadow = true;
    island.add(sand);

    // Tebing tanah (pulau melayang)
    const cliff = new THREE.Mesh(
        new THREE.CylinderGeometry(ISLAND_RADIUS + 0.4, ISLAND_RADIUS * 0.45, 5.4, 64),
        dirtMat
    );
    cliff.position.y = -3.28;
    island.add(cliff);

    // Jalan melingkar
    const road = new THREE.Mesh(
        new THREE.RingGeometry(ROAD_RADIUS - 0.85, ROAD_RADIUS + 0.85, 96),
        roadMat
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.012;
    road.receiveShadow = true;
    island.add(road);

    // Garis putus-putus di tengah jalan
    const dashMat = new THREE.MeshLambertMaterial({ color: 0xc9bfae });
    const dashGeo = new THREE.BoxGeometry(0.1, 0.012, 0.55);
    for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const dash = new THREE.Mesh(dashGeo, dashMat);
        dash.position.copy(polar(angle, ROAD_RADIUS, 0.02));
        dash.rotation.y = angle;
        island.add(dash);
    }

    // Kolam kecil di dekat pelabuhan (babak kontak)
    const pond = new THREE.Mesh(
        new THREE.CircleGeometry(2.1, 32),
        new THREE.MeshLambertMaterial({ color: 0x9fd4f5 })
    );
    pond.rotation.x = -Math.PI / 2;
    pond.position.copy(polar(chapterAngle(8), 10.6, 0.015));
    pond.receiveShadow = true;
    island.add(pond);

    scene.add(island);
    return island;
}

/**
 * Landmark per babak cerita — model gratis dari poly.pizza,
 * ditempatkan pada sudut yang sama dengan momen popup-nya muncul.
 */
export async function buildLandmarks() {
    const defs = [
        { file: 'school.glb',  chapter: 0, height: 2.6, radius: 8.6 },  // bangku sekolah
        { file: 'sign.glb',    chapter: 1, height: 1.3, radius: 9.6 },  // tugas akhir / lulus
        { file: 'office.glb',  chapter: 2, height: 2.8, radius: 8.4 },  // PT. LSKK (machine learning)
        { file: 'sign.glb',    chapter: 3, height: 1.3, radius: 9.6 },  // proyek LSKK
        { file: 'bps.glb',     chapter: 4, height: 3.0, radius: 8.4 },  // BPS
        { file: 'sign.glb',    chapter: 5, height: 1.3, radius: 9.6 },  // proyek BPS
        { file: 'idn.glb',     chapter: 6, height: 3.0, radius: 8.4 },  // IDNFinancials
        { file: 'sign.glb',    chapter: 7, height: 1.3, radius: 9.6 },  // proyek IDNFinancials
        { file: 'house.glb',   chapter: 8, height: 2.4, radius: 8.6 },  // rumah (kontak)
        { file: 'boat.glb',    chapter: 8, height: 2.2, radius: 10.6 }, // pelabuhan kecil
    ];

    await Promise.all(defs.map(async (def) => {
        const gltf = await loadModel('/models/' + def.file);
        const model = enableShadows(fitObject(gltf.scene.clone(true), def.height));
        const group = wrap(model);
        const angle = chapterAngle(def.chapter);
        group.position.copy(polar(angle, def.radius));
        group.lookAt(polar(angle, def.radius + 10)); // menghadap keluar, ke arah kamera
        scene.add(group);
        addClearing(group.position, Math.max(2.2, def.height));
    }));
}

/** Dekorasi: batu di beberapa titik + awan melayang mengitari pulau */
export async function buildDecor() {
    const rockGltf = await loadModel('/models/rock.glb');
    const rockAngles = [0.9, 2.2, 3.6, 5.1];
    for (const a of rockAngles) {
        const rock = enableShadows(fitObject(rockGltf.scene.clone(true), 0.55 + Math.random() * 0.5));
        const group = wrap(rock);
        group.position.copy(polar(a + Math.random() * 0.4, 10.2 + Math.random() * 1.2));
        group.rotation.y = Math.random() * Math.PI * 2;
        scene.add(group);
    }

    // Awan putih melayang tinggi — di atas jangkauan kamera (y kamera maks ±7.8)
    const cloudGltf = await loadModel('/models/cloud.glb');
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x445577, emissiveIntensity: 0.25 });
    const clouds = new THREE.Group();
    for (let i = 0; i < 6; i++) {
        const cloud = fitObject(cloudGltf.scene.clone(true), 1.2 + Math.random() * 1.4);
        cloud.traverse((n) => { if (n.isMesh) n.material = cloudMat; });
        const group = wrap(cloud);
        const angle = (i / 6) * Math.PI * 2 + Math.random();
        group.position.copy(polar(angle, 13.5 + Math.random() * 5, 9.5 + Math.random() * 3.5));
        clouds.add(group);
    }
    scene.add(clouds);
    return { clouds };
}
