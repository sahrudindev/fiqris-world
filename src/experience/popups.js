const popups = document.getElementsByClassName('popup');
const instructions = document.getElementById('instructions');

/**
 * Jantung UX referensi: sudut rotasi kamera (0..2π) dinormalisasi jadi
 * cyclePos (0..1); popup ke-i tampil saat cyclePos berada di jendela segmennya.
 */
export function updatePopups(azimuthalAngle) {
    let cyclePos = azimuthalAngle / (Math.PI * 2);
    if (cyclePos < 0) {
        cyclePos = 0.5 + (0.5 + cyclePos);
    }

    if (azimuthalAngle >= 0.1 || azimuthalAngle < -0.1) {
        instructions.classList.add('hidden');
    }

    for (let i = 0; i < popups.length; i++) {
        const lower = 0.025 + i / popups.length;
        const upper = 0.08 + i / popups.length;
        if (cyclePos >= lower && cyclePos < upper) {
            popups[i].classList.remove('hidden');
            popups[i].classList.add('visible');
        } else {
            popups[i].classList.add('hidden');
            popups[i].classList.remove('visible');
        }
    }
}
