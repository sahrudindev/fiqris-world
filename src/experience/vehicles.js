import * as THREE from 'three';
import { scene } from './scene.js';
import { loadModel, enableShadows, fitObject, wrap } from './loaders.js';
import { polar, ROAD_RADIUS } from './island.js';
import { mixers } from './characters.js';

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
    man.position.set(0, 0.3, -0.1); // duduk di jok skuter
    rider.add(man);

    const mixer = new THREE.AnimationMixer(manGltf.scene);
    const sitClip = manGltf.animations.find((a) => /sit/i.test(a.name)) ?? manGltf.animations[0];
    const action = mixer.clipAction(sitClip);
    action.play();
    mixer.update(0); // terapkan pose duduk sejak frame pertama
    mixers.push(mixer);

    scene.add(rider);

    // ── Sepeda otomatis ──
    const bicycleGltf = await loadModel('/models/bicycle.glb');
    const bicycle = enableShadows(fitObject(bicycleGltf.scene, 1.15));
    const bicycleGroup = wrap(bicycle);
    scene.add(bicycleGroup);

    let i = 0;
    return {
        update(azimuthalAngle) {
            // Skuter + pengendara mengikuti azimuth kamera di radius 11.4,
            // menghadap searah jalan (tangensial) sehingga terlihat sedang berkendara
            rider.position.copy(polar(azimuthalAngle, 11.4));
            rider.rotation.y = azimuthalAngle + Math.PI / 2;

            // Sepeda: keliling otomatis (mekanik identik referensi)
            bicycleGroup.position.set(
                -Math.sin(i * Math.PI) * ROAD_RADIUS,
                0,
                -Math.cos(i * Math.PI) * ROAD_RADIUS
            );
            bicycleGroup.rotation.y = i * Math.PI + Math.PI / 2;
            i -= 0.001;
        },
    };
}
