import { scene } from './scene.js';
import { loadModel, enableShadows, fitObject, wrap } from './loaders.js';
import { polar, ROAD_RADIUS } from './island.js';

/**
 * Dua kendaraan khas referensi:
 * - Vespa berjalan otomatis mengelilingi jalan
 * - Sepeda "avatar pengunjung" yang selalu mengikuti sudut kamera
 */
export async function buildVehicles() {
    const scooterGltf = await loadModel('/models/scooter.glb');
    const scooter = enableShadows(fitObject(scooterGltf.scene, 1.1));
    const scooterGroup = wrap(scooter);
    scene.add(scooterGroup);

    const bicycleGltf = await loadModel('/models/bicycle.glb');
    const bicycle = enableShadows(fitObject(bicycleGltf.scene, 1.15));
    const bicycleGroup = wrap(bicycle);
    scene.add(bicycleGroup);

    let i = 0;
    return {
        update(azimuthalAngle) {
            // Vespa: keliling otomatis (identik dengan mekanik referensi)
            scooterGroup.position.set(
                -Math.sin(i * Math.PI) * ROAD_RADIUS,
                0,
                -Math.cos(i * Math.PI) * ROAD_RADIUS
            );
            scooterGroup.rotation.y = i * Math.PI + Math.PI / 2;
            i -= 0.001;

            // Sepeda: mengikuti azimuth kamera di radius 11.4
            bicycleGroup.position.copy(polar(azimuthalAngle, 11.4));
            bicycleGroup.rotation.y = azimuthalAngle;
        },
    };
}
