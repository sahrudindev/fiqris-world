import * as THREE from 'three';
import { Tween, Easing, Group as TweenGroup } from '@tweenjs/tween.js';
import { scene, camera, renderer } from './experience/scene.js';
import { controls } from './experience/controls.js';
import { spotLight } from './experience/lights.js';
import { buildIsland, buildLandmarks, buildDecor } from './experience/island.js';
import { buildVegetation } from './experience/vegetation.js';
import { buildCharacters, mixers } from './experience/characters.js';
import { buildVehicles } from './experience/vehicles.js';
import { updatePopups } from './experience/popups.js';
import { initDayNight } from './ui/daynight.js';
import { initModals } from './ui/modal.js';

initDayNight();
initModals();

buildIsland();

let characters = null;
let vehicles = null;
let decor = null;

// Landmark & vegetasi berbagi daftar "clearing", jadi landmark dulu baru vegetasi
const ready = (async () => {
    await buildLandmarks();
    const [c, v, d] = await Promise.all([
        buildCharacters(),
        buildVehicles(),
        buildDecor(),
    ]);
    characters = c;
    vehicles = v;
    decor = d;
    await buildVegetation();
})();
ready.catch((err) => console.error('Gagal memuat scene:', err));

// ── Intro: tombol "Jelajahi duniaku" → kamera terbang masuk ──
const tweenGroup = new TweenGroup();
let introPlaying = true;

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', () => {
    document.getElementById('loadingscreen').classList.add('done');

    // Posisi akhir memenuhi batas OrbitControls (jarak 16–30, polar terkunci)
    const flyIn = new Tween(camera.position)
        .to({ x: 0, y: 5.2, z: 19.5 }, 2600)
        .easing(Easing.Cubic.Out)
        .onComplete(() => { introPlaying = false; })
        .start();
    tweenGroup.add(flyIn);
});

// ── Loop utama ──
const clock = new THREE.Clock();

function tick(time) {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    tweenGroup.update(time);

    if (!introPlaying) {
        controls.update();
    }

    const azimuthalAngle = controls.getAzimuthalAngle();

    // Lampu sorot malam mengikuti kamera (identik referensi)
    spotLight.position.x = Math.sin(azimuthalAngle) * 12.4;
    spotLight.position.z = Math.cos(azimuthalAngle) * 12.4;
    spotLight.target.position.x = Math.sin(azimuthalAngle) * 9;
    spotLight.target.position.z = Math.cos(azimuthalAngle) * 9;

    if (!introPlaying) {
        updatePopups(azimuthalAngle);
    }

    vehicles?.update(azimuthalAngle);
    characters?.update(delta, elapsed);
    if (decor) decor.clouds.rotation.y += delta * 0.02;

    for (const mixer of mixers) mixer.update(delta);

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);
