/**
 * Data proyek — struktur meniru skema Sanity CMS milik referensi:
 * { title, subtitle, thumbnail, herobanner, sections[] }
 *
 * Urutan array = urutan popup proyek di pulau (modal 1–4),
 * mengikuti alur cerita: sekolah → lulus → PT. LSKK → BPS → IDNFinancials.
 * Section bertipe:
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
        title: 'Machine Learning — PT. LSKK',
        subtitle: 'Pekerjaan pertama saya setelah lulus',
        thumbnail: '/img/thumb2.svg',
        herobanner: '/img/hero2.svg',
        sections: [
            { type: 'subheadline', value: 'Tentang Pekerjaan' },
            { type: 'text', value: 'Ceritakan proyek machine learning yang Anda kerjakan di PT. LSKK — model yang dibangun, data yang diolah, dan dampaknya.' },
            { type: 'image', value: '/img/thumb2.svg' },
        ],
    },
    {
        title: 'BPS — Badan Pusat Statistik',
        subtitle: 'Berkontribusi pada data statistik nasional',
        thumbnail: '/img/thumb3.svg',
        herobanner: '/img/hero3.svg',
        sections: [
            { type: 'subheadline', value: 'Ringkasan' },
            { type: 'text', value: 'Deskripsikan peran dan proyek Anda selama di BPS — sistem yang dibangun, teknologi yang dipakai, dan hasilnya.' },
            { type: 'image', value: '/img/thumb3.svg' },
        ],
    },
    {
        title: 'IDNFinancials',
        subtitle: 'Tempat saya berkarya hari ini',
        thumbnail: '/img/thumb4.svg',
        herobanner: '/img/hero4.svg',
        sections: [
            { type: 'subheadline', value: 'Ringkasan' },
            { type: 'text', value: 'Deskripsikan pekerjaan Anda di IDNFinancials — produk yang dikembangkan, peran Anda di tim, dan pencapaian terbaik.' },
            { type: 'image', value: '/img/thumb4.svg' },
        ],
    },
];
