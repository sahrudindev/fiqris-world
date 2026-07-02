import { setDaylight } from '../experience/lights.js';
import { canvas } from '../experience/scene.js';

const DAY_SKY = 'linear-gradient(0deg, hsl(200, 50%, 100%) 50%, hsl(214, 80%, 70%) 100%)';
const NIGHT_SKY = 'linear-gradient(0deg, hsl(220, 50%, 20%) 50%, hsl(220, 80%, 5%) 100%)';

const checkbox = document.getElementById('myCheckbox');

function apply() {
    const isDay = checkbox.checked;
    setDaylight(isDay);
    canvas.style.background = isDay ? DAY_SKY : NIGHT_SKY;
    document.body.classList.toggle('night', !isDay);
}

/** Mode siang/malam: otomatis mengikuti jam lokal, bisa dioverride via toggle */
export function initDayNight() {
    const hour = new Date().getHours();
    checkbox.checked = !(hour < 6 || hour > 21) ? true : false;
    apply();

    checkbox.addEventListener('change', apply);
}
