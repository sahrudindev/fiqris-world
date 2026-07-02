# 📋 PLANNING: Website Portofolio 3D Interaktif
### Referensi: https://joshuasworld.netlify.app/ (Joshua's World)

Dokumen ini adalah hasil analisis menyeluruh (reverse-engineering) terhadap website referensi, beserta rencana kerja profesional untuk membangun website yang sama persis, disesuaikan dengan identitas Anda sendiri.

---

## 1. HASIL ANALISIS WEBSITE REFERENSI

### 1.1 Konsep Umum
- **Jenis**: Portofolio personal berbentuk **pulau 3D interaktif** (low-poly island).
- **Mekanik utama**: Pengunjung **men-drag layar untuk memutar kamera mengelilingi pulau**. Saat kamera berputar, cerita perjalanan karier muncul satu per satu sebagai popup (papan cerita + kartu proyek), seperti "tur berpemandu".
- **Storytelling**: Perjalanan hidup (kuliah → kerja → S2 → kerja sekarang → proyek → kontak) dipetakan ke sudut rotasi kamera 0°–360°.

### 1.2 Tech Stack (hasil inspeksi kode asli)

| Komponen | Teknologi yang dipakai website asli |
|---|---|
| Struktur | HTML + CSS + Vanilla JavaScript (ES Modules, tanpa framework) |
| 3D Engine | **Three.js** |
| Loader model | `GLTFLoader` + `DRACOLoader` (model .glb terkompresi Draco) |
| Kamera | `OrbitControls` (dibatasi: hanya rotasi horizontal) |
| Animasi kamera | `Tween.js` (fly-in saat klik "Explore my world") |
| Penyebaran vegetasi | `MeshSurfaceSampler` + `InstancedMesh` (500 bunga + 80 pohon) |
| Animasi karakter | `THREE.AnimationMixer` (karakter, rusa, robot, clapper) |
| CMS konten proyek | **Sanity.io** (fetch API → isi popup & modal secara dinamis) |
| Font | Google Fonts — **Space Grotesk** (300–700) |
| Ikon | Font Awesome 6.2 (CDN) |
| Video proyek | Vimeo embed (iframe) di dalam modal |
| Analytics | Google Analytics (gtag.js) |
| Hosting | **Netlify** (multi-halaman: `/`, `/about`, `/legal`, `/contact`) |

### 1.3 Anatomi Scene 3D (detail dari `3D.js` asli)

**Model 3D (.glb, Draco-compressed):**
| Model | Peran | Perlakuan |
|---|---|---|
| `island.glb` | Pulau utama (jalan melingkar, bangunan, landmark) | statis, cast+receive shadow |
| `treeline.glb` | Mesh permukaan tak terlihat untuk sampling posisi | `MeshSurfaceSampler` |
| `flower.glb` | 500 bunga instanced, palet biru muda `0xBDD1FF, 0xD5E1FF, 0xEEF2FF`, material emissive | `InstancedMesh` acak skala 0.02–0.05 |
| `tree.glb` | 80 pohon instanced, palet ungu `0x320DAA, 0x411BC7, 0x5028E3` | `InstancedMesh`, rotasi acak |
| `scooter.glb` | Skuter berjalan otomatis mengelilingi pulau (radius 11.8, kecepatan konstan) | update posisi tiap frame |
| `cyclist.glb` | **Pesepeda yang mengikuti sudut kamera** (radius 11.4) — avatar pengunjung | posisi = azimuthal angle kamera |
| `joshua.glb` | Karakter pemilik web (beranimasi, melambai) | AnimationMixer |
| `man.glb` ×8 | Kerumunan orang; warna baju & kulit diacak dari palet | random pos/rot |
| `clapper.glb`, `stag.glb`, `robo.glb`, `mug.glb` | Dekorasi hidup: clapperboard animasi, rusa, robot, mug berputar | AnimationMixer / rotasi |

**Kamera & Kontrol:**
- `PerspectiveCamera(fov 64, near 1, far 90)`, posisi awal `(0, 30, 30)`.
- `OrbitControls`: `enablePan = false`, polar angle dikunci `π/2.4`–`π/2.15` (sudut elevasi hampir tetap → terasa seperti "memutar meja putar"), jarak zoom 16–30, `enableDamping`, `rotateSpeed 0.25`.

**Pencahayaan & Render:**
- `HemisphereLight` (langit/tanah, HSL) + `DirectionalLight` "matahari" dengan shadow map 2048², tipe `VSMShadowMap`.
- `SpotLight` sebagai "lampu sorot malam" yang **mengikuti posisi kamera** (mode malam).
- Renderer: `sRGBEncoding`, `pixelRatio` maks 2, `clearColor` transparan — **langit = CSS gradient di belakang canvas** (murah & mudah dianimasikan).

**Mode Siang/Malam:**
- Toggle checkbox (ikon 🌙/💡). Otomatis malam jika jam lokal < 06:00 atau > 21:00.
- Siang: sun on, gradient `hsl(200,50%,100%) → hsl(214,80%,70%)`.
- Malam: spotlight on, hemi light 0.01, gradient `hsl(220,50%,20%) → hsl(220,80%,5%)`.

**Mekanik Popup Berbasis Rotasi (jantung UX website ini):**
```js
azimuthalAngle = controls.getAzimuthalAngle();      // sudut kamera saat ini
cyclePos = azimuthalAngle / (2π);                    // dinormalisasi 0..1
// popup ke-i tampil jika: 0.025 + i/N ≤ cyclePos < 0.08 + i/N
```
→ 9 popup (papan cerita + kartu proyek) tersebar merata di lingkaran; drag = maju di cerita.

**Loading Screen:**
- `THREE.LoadingManager` → progress bar real (persentase aset termuat).
- Setelah selesai: tombol **"Explore my world →"** muncul → klik → `TWEEN` menerbangkan kamera masuk (easing Cubic.Out) → hint "Drag to explore" (hilang setelah user mulai drag).

### 1.4 UI/Desain
- **Font**: Space Grotesk. Judul besar 96px/600, sub 48px, body 18–22px.
- **Warna brand**: ungu `#542BEC` (tombol primary), `#5c30fd` (link), `#757BFD` (aksen); hitam/putih untuk netral.
- **Komponen**: logo pojok ("JOSHUAs WORLD"), hamburger menu fullscreen (CSS checkbox trick), tombol bulat toggle siang/malam, popup card, modal proyek fullscreen (hero banner + konten dari CMS + embed Vimeo).
- **Halaman lain**: About, Legal, Contact (halaman HTML statis biasa).

---

## 2. RENCANA PEMBANGUNAN (PROJECT PLAN)

### 2.1 Scope & Deliverables
Membangun replika fungsional 1:1 dari Joshua's World dengan konten milik Anda:
1. Scene pulau 3D low-poly dengan mekanik drag-to-explore + popup berbasis rotasi.
2. Loading screen + progress bar + intro camera fly-in.
3. Mode siang/malam (manual + otomatis by jam).
4. Elemen hidup: kendaraan keliling, avatar pengikut kamera, karakter beranimasi, vegetasi instanced.
5. Modal proyek dinamis (CMS/JSON) + halaman About/Legal/Contact.
6. Responsif desktop & mobile (touch drag), lalu deploy ke Netlify.

### 2.2 Tech Stack yang Direkomendasikan

| Komponen | Pilihan | Alasan |
|---|---|---|
| Build tool | **Vite** (vanilla JS) | Modern, hot-reload, bundling otomatis (situs asli memakai file manual — Vite hasil sama tapi dev experience jauh lebih baik) |
| 3D | **Three.js (npm)** + GLTFLoader, DRACOLoader, OrbitControls, MeshSurfaceSampler | Sama persis dengan asli |
| Tween | `@tweenjs/tween.js` | Sama dengan asli |
| 3D Modeling | **Blender** (gratis) + export glTF/.glb + kompresi Draco | Standar industri |
| Konten proyek | Tahap awal: **JSON lokal** → upgrade: **Sanity.io** (persis asli) | Sanity gratis untuk personal |
| Font/Ikon | Google Fonts (Space Grotesk) + Font Awesome | Sama dengan asli |
| Hosting | **Netlify** (gratis, auto-deploy dari GitHub) | Sama dengan asli |

### 2.3 Struktur Proyek

```
portofoloi_3D/
├── index.html              # halaman utama (canvas 3D + popups + modals)
├── about.html
├── legal.html
├── contact.html
├── public/
│   ├── models/             # island.glb, tree.glb, flower.glb, character.glb, dst.
│   ├── draco/              # decoder Draco
│   └── img/                # favicon, thumbnail OG, drag_animation.svg
├── src/
│   ├── main.js             # entry — orkestrasi
│   ├── experience/
│   │   ├── scene.js        # scene, kamera, renderer, resize
│   │   ├── lights.js       # hemi + sun + spotlight, mode siang/malam
│   │   ├── controls.js     # OrbitControls terkunci + hint drag
│   │   ├── loaders.js      # LoadingManager + progress bar + start button
│   │   ├── island.js       # load pulau
│   │   ├── vegetation.js   # MeshSurfaceSampler + InstancedMesh
│   │   ├── characters.js   # karakter animasi (AnimationMixer)
│   │   ├── vehicles.js     # skuter otomatis + avatar pengikut kamera
│   │   └── popups.js       # logika cyclePos → show/hide popup
│   ├── ui/
│   │   ├── menu.js         # hamburger menu
│   │   ├── modal.js        # buka/tutup modal proyek
│   │   └── daynight.js     # toggle + auto by jam
│   ├── content/
│   │   └── projects.js     # fetch Sanity / JSON lokal → isi popup & modal
│   └── styles/
│       ├── style.css       # tipografi, warna, popup, modal
│       ├── loader.css      # loading screen
│       └── menu.css        # navigasi
├── package.json
└── vite.config.js
```

### 2.4 Fase Pengerjaan & Estimasi

> Estimasi untuk 1 orang, kerja part-time. Fase 2 (asset 3D) adalah pekerjaan terbesar & penentu kualitas visual.

#### **FASE 0 — Setup (½–1 hari)**
- [ ] `npm create vite@latest` (vanilla), install `three`, `@tweenjs/tween.js`.
- [ ] Setup repo GitHub + koneksi Netlify (auto-deploy sejak hari pertama).
- [ ] Salin decoder Draco ke `public/draco/`.

#### **FASE 1 — Fondasi 3D (2–3 hari)**
- [ ] Scene + PerspectiveCamera (fov 64) + renderer (sRGB, shadow VSM, pixelRatio ≤ 2, clearColor transparan).
- [ ] Langit CSS gradient di belakang canvas.
- [ ] OrbitControls terkunci (no pan, polar π/2.4–π/2.15, distance 16–30, damping, rotateSpeed 0.25).
- [ ] Lighting: HemisphereLight + DirectionalLight shadow 2048.
- [ ] Uji dengan geometri placeholder (silinder = pulau, kubus = bangunan).
- ✅ **Milestone**: bisa drag memutari "pulau placeholder" dengan bayangan bagus.

#### **FASE 2 — Asset 3D di Blender (5–10 hari — terbesar)**
Cerita Anda sendiri harus dipetakan dulu (lihat 2.5), lalu modelkan:
- [ ] **Pulau utama**: bentuk bundar, jalan melingkar radius ±11.8 unit di tepi, area landmark per babak cerita (kampus, kantor, dsb).
- [ ] **Vegetasi**: 1 pohon low-poly + 1 bunga (cukup satu — akan di-instance ratusan kali) + mesh "treeline" tak terlihat untuk area sebaran.
- [ ] **Karakter Anda** (avatar melambai) — bisa pakai [Mixamo](https://www.mixamo.com) untuk rigging+animasi gratis.
- [ ] **Kendaraan** (skuter/mobil) + **pesepeda** (avatar pengunjung).
- [ ] Dekorasi: 3–5 objek hidup (hewan, robot, benda ikonik profesi Anda).
- [ ] Export .glb + **kompresi Draco** (`gltf-pipeline` / gltfpack). Target total aset < 10 MB.
- 💡 *Jalur cepat*: pakai asset gratis low-poly dari [Poly Pizza](https://poly.pizza), [Sketchfab (CC)](https://sketchfab.com), [Quaternius](https://quaternius.com), lalu modifikasi — memangkas fase ini jadi 2–3 hari.
- ✅ **Milestone**: pulau tampil di browser dengan gaya visual konsisten.

#### **FASE 3 — Kehidupan & Mekanik Inti (3–4 hari)**
- [ ] MeshSurfaceSampler → InstancedMesh bunga (±500) & pohon (±80) dengan palet warna acak.
- [ ] AnimationMixer untuk semua karakter beranimasi.
- [ ] Skuter berjalan otomatis melingkar (radius jalan).
- [ ] **Pesepeda mengikuti `getAzimuthalAngle()` kamera** — fitur khas paling penting.
- [ ] **Sistem popup berbasis cyclePos**: bagi 360° menjadi N segmen cerita, show/hide class `hidden/visible` dengan transisi CSS.
- ✅ **Milestone**: drag → cerita muncul berurutan, pesepeda ikut berputar.

#### **FASE 4 — UI, Loading & Siang/Malam (2–3 hari)**
- [ ] Loading screen: judul sambutan, progress bar dari LoadingManager, tombol "Explore my world →".
- [ ] TWEEN camera fly-in saat tombol diklik + hint "Drag to explore" (auto-hide).
- [ ] Toggle siang/malam + otomatis berdasar jam lokal (malam: <06 / >21).
- [ ] Hamburger menu fullscreen, logo, tombol bulat.
- [ ] Tipografi Space Grotesk + palet warna (tentukan warna brand Anda; asli: ungu `#542BEC`).
- ✅ **Milestone**: pengalaman first-visit lengkap dari loading → explore.

#### **FASE 5 — Konten Proyek & Halaman Sekunder (2–3 hari)**
- [ ] Modal proyek fullscreen: hero banner, judul, subjudul, seksi teks/gambar, embed video (Vimeo/YouTube).
- [ ] Sumber data: mulai dari `projects.json` lokal; opsional migrasi ke Sanity.io (struktur asli: `project { title, subtitle, thumbnail, herobanner, sections[], order }`).
- [ ] Halaman About / Legal / Contact.
- [ ] Meta tag OG (title, description, thumbnail 1200×627) + favicon.

#### **FASE 6 — Optimasi, Mobile & Rilis (2–3 hari)**
- [ ] Uji touch-drag di HP; sesuaikan ukuran font/popup mobile.
- [ ] Audit performa: target 60 fps desktop / 30+ fps mobile (Draco, InstancedMesh, shadow 1 sumber, pixelRatio ≤ 2, `THREE.Cache.enabled`).
- [ ] Lighthouse + kompresi gambar CMS.
- [ ] Google Analytics (opsional), deploy final Netlify + custom domain (opsional).
- ✅ **Milestone**: LIVE 🚀

**Total estimasi: ±3–4 minggu** (atau ±2 minggu jika memakai asset 3D siap pakai).

### 2.5 PR Anda Sebelum Mulai (Konten)
Website ini pada dasarnya adalah **cerita** — siapkan dulu:
1. **6–9 babak cerita karier Anda** (contoh asli: kuliah → kerja motion designer → S2 → kerja sekarang → 2 proyek → kontak). Tiap babak = 1 popup = 1 segmen rotasi = 1 area di pulau.
2. **2–4 proyek unggulan** (judul, subjudul, thumbnail, banner, deskripsi, gambar/video).
3. **Identitas visual**: nama "dunia" Anda (mis. "FIQRIs WORLD"), warna brand, gaya avatar.
4. Teks About & Contact + link sosial media.

### 2.6 Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Belum mahir Blender | Fase 2 molor | Pakai asset gratis (Poly Pizza/Quaternius) + tutorial low-poly island (banyak di YouTube) |
| Performa buruk di HP | Pengunjung kabur | Draco + instancing + shadow minimal; uji di HP sejak Fase 2 |
| Ukuran aset besar | Loading lama | Target < 10 MB; loading screen menutupi sisa waktu |
| Scope creep | Tidak selesai | Kunci fitur = persis daftar di 2.1; ide baru masuk backlog v2 |

---

## 3. LANGKAH PERTAMA (bisa dikerjakan hari ini)
1. Tulis 6–9 babak cerita + pilih nama dunia Anda (poin 2.5).
2. Jalankan Fase 0: setup Vite + Three.js + repo GitHub + Netlify.
3. Kerjakan Fase 1 dengan placeholder — mekanik drag bisa selesai **tanpa menunggu model 3D**.
