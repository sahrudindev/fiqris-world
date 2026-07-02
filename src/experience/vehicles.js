import * as THREE from 'three';
import { scene } from './scene.js';
import { loadModel, enableShadows, fitObject, wrap } from './loaders.js';
import { polar, ROAD_RADIUS } from './island.js';

/**
 * Dua kendaraan di jalan melingkar:
 * - Skuter + pengendara (avatar pengunjung) yang selalu mengikuti sudut kamera
 * - Sepeda yang berkeliling otomatis
 */
export async function buildVehicles() {
    // ── Skuter dengan orang duduk di atasnya ──
    const scooterGltf = await loadModel('/models/scooter.glb');
    const manGltf = await loadModel('/models/man.glb');

    const rider = new THREE.Group();

    const scooter = enableShadows(fitObject(scooterGltf.scene, 1.1));
    rider.add(scooter);

    const man = wrap(enableShadows(fitObject(manGltf.scene, 1.35)));
    man.position.set(0, 0.3, 0.02); // duduk di jok skuter, agak maju agar tangan sampai ke setang
    rider.add(man);

    // Pose duduk dibekukan di frame pertama (mixer tidak di-update lagi),
    // lalu lengan diposekan manual agar tangan memegang setang.
    const mixer = new THREE.AnimationMixer(manGltf.scene);
    const sitClip = manGltf.animations.find((a) => /sit/i.test(a.name)) ?? manGltf.animations[0];
    mixer.clipAction(sitClip).play();
    mixer.update(sitClip.duration * 0.6); // ambil pose stabil di tengah klip (awal klip masih berdiri)

    // GLTFLoader menghapus karakter '.' dari nama node ("UpperArm.L" → "UpperArmL")
    const poseBone = (name, rx, ry, rz) => {
        const bone = manGltf.scene.getObjectByName(name)
            ?? manGltf.scene.getObjectByName(name.replace(/\./g, ''));
        if (!bone) { console.warn('bone tidak ditemukan:', name); return; }
        bone.rotation.x += rx;
        bone.rotation.y += ry;
        bone.rotation.z += rz;
    };
    poseBone('UpperArm.L', -1.15, 0, 0.12);
    poseBone('UpperArm.R', -1.15, 0, -0.12);
    poseBone('LowerArm.L', 0.1, 0, 0);
    poseBone('LowerArm.R', 0.1, 0, 0);

    scene.add(rider);

    // ── Sepeda otomatis ──
    const bicycleGltf = await loadModel('/models/bicycle.glb');
    const bicycle = enableShadows(fitObject(bicycleGltf.scene, 0.9));
    const bicycleGroup = wrap(bicycle);
    scene.add(bicycleGroup);

    let i = 0;
    return {
        update(azimuthalAngle) {
            // Skuter + pengendara mengikuti azimuth kamera di radius 11.4,
            // menghadap searah jalan (tangensial) sehingga terlihat sedang berkendara
            rider.position.copy(polar(azimuthalAngle, 11.4));
            rider.rotation.y = azimuthalAngle + Math.PI / 2;

            // Sepeda: keliling otomatis (mekanik identik referensi).
            // Model sepeda menghadap +X (bukan +Z seperti Vespa), jadi
            // rotasinya i*π tanpa offset 90° agar searah jalan.
            bicycleGroup.position.set(
                -Math.sin(i * Math.PI) * ROAD_RADIUS,
                0,
                -Math.cos(i * Math.PI) * ROAD_RADIUS
            );
            bicycleGroup.rotation.y = i * Math.PI;
            i -= 0.001;
        },
    };
}
