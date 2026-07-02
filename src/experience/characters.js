import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { scene } from './scene.js';
import { loadModel, enableShadows, fitObject, wrap } from './loaders.js';
import { chapterAngle, polar, clearings } from './island.js';

export const mixers = [];

function playClip(root, animations, nameOrIndex, timeScale = 1) {
    if (!animations || animations.length === 0) return null;
    const mixer = new THREE.AnimationMixer(root);
    let clip = null;
    if (typeof nameOrIndex === 'string') {
        clip = THREE.AnimationClip.findByName(animations, nameOrIndex);
    }
    if (!clip) clip = animations[typeof nameOrIndex === 'number' ? nameOrIndex : 0];
    if (!clip) return null;
    const action = mixer.clipAction(clip);
    action.timeScale = timeScale;
    action.play();
    mixers.push(mixer);
    return mixer;
}

/** Semua karakter hidup di pulau */
export async function buildCharacters() {
    // Robot ekspresif — melambai menyambut (babak "memperdalam 3D")
    // Catatan: model skinned (Robot, Soldier) tidak bisa diukur dengan Box3,
    // jadi skalanya ditetapkan manual berdasarkan ukuran asli model.
    const robotGltf = await loadModel('/models/RobotExpressive.glb');
    {
        const robot = enableShadows(robotGltf.scene);
        robot.scale.setScalar(0.34); // tinggi asli ±4.5 unit → ±1.5 unit
        const group = wrap(robot);
        const angle = chapterAngle(3);
        group.position.copy(polar(angle, 8.8));
        group.lookAt(polar(angle, 20));
        playClip(robot, robotGltf.animations, 'Wave');
        scene.add(group);
        clearings.push({ x: group.position.x, z: group.position.z, r: 2 });
    }

    // Kerumunan kecil — karakter low-poly beranimasi tersebar di pulau
    const manGltf = await loadModel('/models/man.glb');
    const crowdSpots = [
        { angle: chapterAngle(5) + 0.18, radius: 6.6, clip: /idle/i },
        { angle: chapterAngle(5) - 0.12, radius: 7.4, clip: /clapping/i },
        { angle: chapterAngle(2) + 0.2,  radius: 6.8, clip: /idle/i },
        { angle: chapterAngle(0) - 0.15, radius: 6.5, clip: /standing/i },
    ];
    for (const spot of crowdSpots) {
        const model = enableShadows(fitObject(SkeletonUtils.clone(manGltf.scene), 1.35));
        const group = wrap(model);
        group.position.copy(polar(spot.angle, spot.radius));
        group.rotation.y = Math.random() * Math.PI * 2;
        const clip = manGltf.animations.find((a) => spot.clip.test(a.name));
        if (clip) {
            const mixer = new THREE.AnimationMixer(model);
            mixer.clipAction(clip).play();
            mixers.push(mixer);
        }
        scene.add(group);
        clearings.push({ x: group.position.x, z: group.position.z, r: 1.4 });
    }

    // Rusa — penghuni hutan
    const stagGltf = await loadModel('/models/stag.glb');
    {
        const stag = enableShadows(fitObject(stagGltf.scene, 1.6));
        const group = wrap(stag);
        const angle = chapterAngle(7) + 0.25;
        group.position.copy(polar(angle, 6));
        group.rotation.y = Math.random() * Math.PI * 2;
        playClip(stag, stagGltf.animations, 'Idle', 1);
        scene.add(group);
        clearings.push({ x: group.position.x, z: group.position.z, r: 1.8 });
    }

    // Kuda — berlari mengelilingi bagian dalam pulau
    const horseGltf = await loadModel('/models/Horse.glb');
    const horse = enableShadows(fitObject(horseGltf.scene, 1.7));
    const horseGroup = wrap(horse);
    playClip(horse, horseGltf.animations, 0);
    scene.add(horseGroup);

    // Burung — terbang berputar di atas pulau
    const flamingoGltf = await loadModel('/models/Flamingo.glb');
    const parrotGltf = await loadModel('/models/Parrot.glb');
    const birds = new THREE.Group();
    const birdDefs = [
        { gltf: flamingoGltf, height: 0.8, orbit: 9, y: 6.5, phase: 0 },
        { gltf: parrotGltf, height: 0.5, orbit: 12, y: 8, phase: Math.PI },
    ];
    const birdItems = [];
    for (const def of birdDefs) {
        const bird = enableShadows(fitObject(def.gltf.scene, def.height));
        const group = wrap(bird);
        birds.add(group);
        playClip(bird, def.gltf.animations, 0);
        birdItems.push({ group, ...def });
    }
    scene.add(birds);

    // Mug kopi berputar — dekorasi khas referensi (di dekat rumah)
    const mugGltf = await loadModel('/models/mug.glb');
    const mug = enableShadows(fitObject(mugGltf.scene, 0.5));
    const mugGroup = wrap(mug);
    mugGroup.position.copy(polar(chapterAngle(8) + 0.35, 7.4, 0)); // ngopi di dekat rumah
    scene.add(mugGroup);
    clearings.push({ x: mugGroup.position.x, z: mugGroup.position.z, r: 1.2 });

    let horseAngle = 0;
    return {
        /** dipanggil setiap frame */
        update(delta, elapsed) {
            // kuda berlari melingkar di radius dalam
            horseAngle += delta * 0.25;
            horseGroup.position.copy(polar(horseAngle, 4.5));
            horseGroup.rotation.y = horseAngle + Math.PI / 2;

            // burung mengorbit
            for (const b of birdItems) {
                const a = elapsed * 0.35 + b.phase;
                b.group.position.set(Math.sin(a) * b.orbit, b.y, Math.cos(a) * b.orbit);
                b.group.rotation.y = a + Math.PI / 2;
            }

            // mug berputar pelan
            mugGroup.rotation.y -= 0.01;
        },
    };
}
