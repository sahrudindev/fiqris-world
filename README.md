# Fiqri's World — Portofolio 3D Interaktif

Website portofolio berbentuk pulau 3D interaktif, terinspirasi dari
[joshuasworld.netlify.app](https://joshuasworld.netlify.app/).
Drag layar untuk memutar kamera mengelilingi pulau — setiap sudut rotasi
memunculkan satu babak cerita karier.

## Menjalankan

```bash
npm install
npm run dev      # development → http://localhost:5173
npm run build    # production → folder dist/
```

## Yang perlu Anda ganti (konten placeholder)

| Apa | Di mana |
|---|---|
| Teks cerita popup (9 babak) | [index.html](index.html) — elemen `.popup` |
| Data proyek (judul, deskripsi, gambar) | [src/content/projects.js](src/content/projects.js) |
| Gambar thumbnail/banner proyek | `public/img/thumb*.svg` & `hero*.svg` (ganti dengan jpg/png Anda) |
| Teks loading screen & nama dunia | [index.html](index.html) + logo `FIQRIs WORLD` |
| Halaman Tentang/Legal/Kontak | `about.html`, `legal.html`, `contact.html` |
| Link sosial media | `index.html` (popup kontak) & `contact.html` |

## Struktur

- `src/experience/` — semua kode Three.js (scene, kamera, pulau, vegetasi, karakter, kendaraan, popup)
- `src/ui/` — modal proyek & mode siang/malam
- `src/content/projects.js` — data proyek (meniru skema Sanity CMS)
- `public/models/` — model 3D gratis (CC0/CC-BY, atribusi di `CREDITS.txt`)

## Deploy ke Netlify

Push ke GitHub → hubungkan repo di Netlify. Konfigurasi build sudah ada di
`netlify.toml` (command `npm run build`, publish `dist`).

## Kredit model 3D

Quaternius, Kenney, Poly by Google, Jasmine Roberts, Jonathan Granskog,
serta model contoh Three.js. Daftar lengkap: `public/models/CREDITS.txt`.
