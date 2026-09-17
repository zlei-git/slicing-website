# NOTOSAN — VISITE (Noto Nature Park) | Tugas Magang No. 3

Website interaktif hasil slicing desain referensi Pinterest ([pin.it/2AkWKyN8s](https://pin.it/2AkWKyN8s)) menggunakan **HTML5, CSS3, dan Vanilla JavaScript**.

Mengusung tema perjalanan petualangan alam Jepang (*Japanese Nature & Travel Adventure*) dengan **Continuous Vertical Parallax Storytelling**, di mana pengguna menuruni puncak gunung emas (*Zenith*), jurang air terjun mistis (*Tranquility*), hingga lembah habitat rusa tutul (*Biodiversity*), dilengkapi beragam animasi gerak-gerak hidup.

---

## 🌸 Animasi Gerak & Visual Interaktif (Sesuai Referensi)

1. **Continuous Parallax Scroll Scrubbing (60 FPS)**:
   - Video visual alam bergeser mulus mengikuti alur scroll mouse pengguna:
     - **Scene 1 (VISITE)**: Pengelana bertopi caping jerami (*sugegasa*) dan jubah merah memandang gunung Noto di bawah langit senja keemasan.
     - **Scene 2 (Tranquility)**: Kamera menukik ke bawah menembus air terjun vertikal ke gua basar bercahaya di mana pengelana beristirahat dekat lentera.
     - **Scene 3 (Biodiversity)**: Air terjun bermuara ke sungai berbunga di mana seekor rusa tutul (*shika*) berdiri tenang di alam liar.
     - **Scene 4 (Sanctuary)**: Formulir reservasi ekspedisi suci dengan cap segel merah tradisional (*goshuin*).

2. **Canvas Dynamic Nature Particle Engine**:
   - **Kawanan Burung Bangau Mahkota Merah (*Tancho Crane*)**: Terbang mengepakkan sayap anggun melintasi langit puncak gunung.
   - **Kelopak Bunga Sakura & Dedaunan Melayang**: Berputar dan tertiup angin sepoi-sepoi melintasi layar.
   - **Buih Percikan Air Terjun (*Waterfall Spray Mist*)**: Percikan air berkilau menuruni lereng tebing.
   - **Kunang-Kunang Hutan (*Enchanted Forest Fireflies*)**: Cahaya lembut yang berkedip dan berpendar di kedalaman grotto.

3. **Audio Meditasi Tradisional Jepang (Web Audio API)**:
   - Harmonik tangga nada tradisional Jepang (*Insen Scale*) berpadu dengan gemericik air sungai alami tanpa perlu memuat MP3 eksternal.
   - Dilengkapi efek suara tetesan air (*water droplet*) saat klik menu dan genta kuil (*temple bell*) saat pengiriman reservasi berhasil.

4. **Komponen Interaktif**:
   - Tombol utama: `Start the journey ▸` dengan animasi panah meluncur.
   - Tombol `Register` membuka pop-up kartu keanggotaan *Notosan Community*.
   - Widget telemetri hidrologi & daftar satwa terlindungi (*Honshu Sika Deer, Red-Crowned Crane, Noto Alpine Flora*).
   - Formulir reservasi ekspedisi lengkap dengan pemilihan musim (*Autumn Momiji, Spring Sakura, Summer Cascade, Winter Serenity*).

---

## 🚀 Cara Menjalankan

### Cara 1: Local Server (HTTP 206 Range Scrubbing)
Server bawaan sudah aktif di:
👉 **[http://localhost:3000](http://localhost:3000)**

Untuk menjalankan ulang jika terminal ditutup:
```bash
cd D:\segesta-interactive
node server.js
```

### Cara 2: Live Server (VS Code / Browser)
Buka file `D:\segesta-interactive\index.html` langsung di browser atau klik kanan -> **Open with Live Server**.
