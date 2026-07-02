import { projects } from '../content/projects.js';

/**
 * Isi popup proyek & modal dari data lokal (meniru mekanik sanity.js referensi),
 * lalu pasang perilaku buka/tutup modal.
 */
export function initModals() {
    const thumbnails = document.getElementsByClassName('thumbnail');
    const headers = document.querySelectorAll('.modal .header');
    const projectTitles = document.getElementsByClassName('projecttitle');
    const subtitles = document.getElementsByClassName('subtitle');
    const headlines = document.getElementsByClassName('projectheadline');
    const modalSubtitles = document.getElementsByClassName('modal-subtitle');
    const wrappers = document.getElementsByClassName('modal-content-wrapper');

    projects.forEach((project, i) => {
        if (!thumbnails[i]) return;
        thumbnails[i].src = project.thumbnail;
        headers[i].style.backgroundImage =
            `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.85)), url(${project.herobanner})`;
        projectTitles[i].textContent = project.title;
        subtitles[i].textContent = project.subtitle;
        headlines[i].textContent = project.title;
        modalSubtitles[i].textContent = project.subtitle;

        for (const section of project.sections) {
            if (section.type === 'subheadline') {
                wrappers[i].insertAdjacentHTML('beforeend', `<h1>${section.value}</h1>`);
            }
            if (section.type === 'text') {
                wrappers[i].insertAdjacentHTML('beforeend', `<p2>${section.value}</p2>`);
            }
            if (section.type === 'image') {
                const img = document.createElement('img');
                img.classList.add('project-img');
                img.src = section.value;
                wrappers[i].appendChild(img);
            }
            if (section.type === 'video') {
                wrappers[i].insertAdjacentHTML(
                    'beforeend',
                    `<div class="embed-container"><iframe class="video" src="${section.value}" allowfullscreen></iframe></div>`
                );
            }
        }
    });

    // Buka modal dari tombol popup
    document.querySelectorAll('[data-modal]').forEach((button) => {
        button.addEventListener('click', () => {
            document.getElementById(button.dataset.modal)?.classList.add('open');
        });
    });

    // Tutup modal
    document.querySelectorAll('.modal .close').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.remove('open');
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.open').forEach((m) => m.classList.remove('open'));
        }
    });
}
