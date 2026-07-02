import * as THREE from 'three';
import { scene } from './scene.js';

// ── Cahaya langit/tanah ──
export const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.6);
hemiLight.color.setHSL(0.6, 1, 0.6);
hemiLight.groundColor.setHSL(0.095, 1, 0.75);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);

// ── Matahari (mode siang) ──
const shadowMapSize = 13;
export const sunLight = new THREE.DirectionalLight(0xffffff, 2.6);
sunLight.position.set(0, 12, 12);
sunLight.color.setHSL(0.1, 1, 0.95);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = shadowMapSize * 4;
sunLight.shadow.camera.top = shadowMapSize;
sunLight.shadow.camera.bottom = -shadowMapSize;
sunLight.shadow.camera.left = -shadowMapSize;
sunLight.shadow.camera.right = shadowMapSize;
sunLight.shadow.normalBias = 0.02;
sunLight.shadow.radius = 4;
scene.add(sunLight);
scene.add(sunLight.target);

// ── Lampu sorot (mode malam) — mengikuti posisi kamera ──
export const spotLight = new THREE.SpotLight(0xffffff, 60, 26, Math.PI / 5, 0.6, 1);
spotLight.position.set(0, 8, 0);
spotLight.visible = false;
spotLight.castShadow = false;
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 0.5;
spotLight.shadow.camera.far = 30;
spotLight.shadow.normalBias = 0.02;
scene.add(spotLight);
scene.add(spotLight.target);

/** Terapkan mode siang (true) / malam (false) ke pencahayaan */
export function setDaylight(isDay) {
    sunLight.visible = isDay;
    sunLight.castShadow = isDay;
    spotLight.visible = !isDay;
    spotLight.castShadow = !isDay;
    hemiLight.intensity = isDay ? 1.6 : 0.15;
}
