import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera, canvas } from './scene.js';

// Kontrol "meja putar" — parameter identik dengan referensi:
// tanpa pan, sudut elevasi hampir terkunci, hanya rotasi horizontal + zoom terbatas
export const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 2.4;
controls.maxPolarAngle = Math.PI / 2.15;
controls.minDistance = 16;
controls.maxDistance = 30;
controls.enableDamping = true;
controls.rotateSpeed = 0.25;
