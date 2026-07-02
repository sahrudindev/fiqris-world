import { setDaylight } from '../experience/lights.js';

const checkbox = document.getElementById('myCheckbox');

function apply() {
    const isDay = checkbox.checked;
    setDaylight(isDay);
    // gradient langit (siang/malam + bintang) diatur lewat CSS body.night
    document.body.classList.toggle('night', !isDay);
}

/** Mode siang/malam: otomatis mengikuti jam lokal, bisa dioverride via toggle */
export function initDayNight() {
    const hour = new Date().getHours();
    checkbox.checked = !(hour < 6 || hour > 21) ? true : false;
    apply();

    checkbox.addEventListener('change', apply);
}
