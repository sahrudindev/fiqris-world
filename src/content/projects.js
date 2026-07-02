/**
 * Data proyek — struktur meniru skema Sanity CMS milik referensi:
 * { title, subtitle, thumbnail, herobanner, sections[] }
 *
 * Urutan array = urutan popup proyek di pulau (modal 1–4).
 * Ganti isi di sini dengan proyek Anda sendiri; section bertipe:
 *   - subheadline : judul bagian
 *   - text        : paragraf
 *   - image       : gambar lebar penuh
 *   - video       : URL embed (YouTube/Vimeo)
 */
export const projects = [
    {
        title: 'Tugas Akhir',
        subtitle: 'Proyek penutup masa studi saya',
        thumbnail: '/img/thumb1.svg',
        herobanner: '/img/hero1.svg',
        sections: [
            { type: 'subheadline', value: 'Latar Belakang' },
            { type: 'text', value: 'Tuliskan deskripsi tugas akhir Anda di sini — masalah yang diangkat, proses riset, dan hasil akhirnya.' },
            { type: 'image', value: '/img/thumb1.svg' },
            { type: 'text', value: 'Tambahkan detail proses, tools yang digunakan, dan pembelajaran yang Anda dapatkan.' },
        ],
    },
    {
        title: 'Proyek Studi',
        subtitle: 'Eksperimen 3D web interaktif',
        thumbnail: '/img/thumb2.svg',
        herobanner: '/img/hero2.svg',
        sections: [
            { type: 'subheadline', value: 'Tentang Proyek' },
            { type: 'text', value: 'Ceritakan proyek eksplorasi Anda — misalnya eksperimen Three.js, WebGL, atau interaksi baru yang Anda coba.' },
            { type: 'image', value: '/img/thumb2.svg' },
        ],
    },
    {
        title: 'Proyek Klien A',
        subtitle: 'Website interaktif untuk klien',
        thumbnail: '/img/thumb3.svg',
        herobanner: '/img/hero3.svg',
        sections: [
            { type: 'subheadline', value: 'Ringkasan' },
            { type: 'text', value: 'Deskripsikan peran Anda, tantangan teknis, dan dampak yang dihasilkan untuk klien.' },
            { type: 'image', value: '/img/thumb3.svg' },
        ],
    },
    {
        title: 'Proyek Klien B',
        subtitle: 'Aplikasi web modern',
        thumbnail: '/img/thumb4.svg',
        herobanner: '/img/hero4.svg',
        sections: [
            { type: 'subheadline', value: 'Ringkasan' },
            { type: 'text', value: 'Deskripsikan proyek kedua Anda di sini, lengkap dengan gambar atau video demo.' },
            { type: 'image', value: '/img/thumb4.svg' },
        ],
    },
];
