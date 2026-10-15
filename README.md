# Jelajah Destinasi — اِكْتَشِفِ الْوِجْهَاتِ

Game edukatif kosakata bahasa Arab bertema **السِّيَاحَةُ (pariwisata)** untuk siswa Kelas XI. Siswa menjelajahi empat destinasi virtual, mempelajari 32 kosakata, menyelesaikan misi, dan mengumpulkan poin serta bintang. Hanya HTML, CSS, dan JavaScript murni: tanpa framework, build, backend, atau aset eksternal.

## Fitur
- Alur: Beranda → Cara Bermain → Peta → Detail Destinasi → Kartu Kosakata → Misi (Kuis / Mencocokkan) → Hasil → Destinasi berikutnya atau ulangi.
- Peta interaktif dengan 4 penanda; status terkunci, tersedia, sedang dijalani, dan selesai ditandai dengan ikon dan teks (bukan hanya warna).
- Kartu kosakata dengan mode uji diri (tutup arti), kuis pilihan ganda (Arab→Indonesia, Indonesia→Arab, petunjuk konteks), dan permainan mencocokkan.
- Aksesibel: HTML semantik, navigasi keyboard, fokus terlihat, `aria-live`, dialog asli, dan `prefers-reduced-motion`.
- Berfungsi offline sepenuhnya; progres opsional disimpan di `localStorage`.

## Struktur
```
index.html
favicon.svg
assets/css/styles.css
assets/js/data.js      # kosakata, destinasi, konfigurasi (namespace window.JD)
assets/js/game.js      # kuis, mencocokkan, skor, bintang, pembukaan level
assets/js/storage.js   # localStorage berversi + validasi
assets/js/app.js       # tampilan, navigasi, event
tests/check.js         # pemeriksaan logika (Node, tanpa dependensi)
.github/workflows/deploy.yml
```
Skrip klasik dimuat berurutan (`data → game → storage → app`) dan berbagi satu namespace global `window.JD`.

## Menjalankan secara lokal
Buka `index.html` di peramban, atau jalankan server statis: `python3 -m http.server 8000` lalu buka `http://localhost:8000`.
Pemeriksaan logika (opsional, perlu Node.js): `node tests/check.js`.

## Aturan permainan
- Jawaban benar **100 poin**; salah 0 poin; menyelesaikan misi **+50 poin** bonus.
- Akurasi = jawaban benar ÷ total soal (bonus tidak dihitung). Pada misi mencocokkan, hanya pasangan yang benar pada percobaan pertama (tanpa salah pilih sebelumnya) dihitung benar.
- Bintang: 90–100% = 3, 75–89% = 2, 60–74% = 1, di bawah 60% = 0.
- Akurasi ≥ 60% = destinasi selesai dan destinasi berikutnya terbuka.
- Skor terbaik dan bintang terbaik disimpan dan tidak tertimpa hasil yang lebih rendah. Total XP = jumlah skor terbaik tiap destinasi. Tidak ada batas waktu dan boleh mengulang tanpa batas.

## Mengubah konten
Edit `assets/js/data.js`: daftar `R` (Arab, Indonesia, kategori, jenis kata, petunjuk). Setiap level otomatis berisi 8 kata berurutan (kata 1–8 level 1, dst.). Soal kuis dihasilkan dari data ini; pengecoh diambil dari kosakata lain. Jalankan `node tests/check.js` setelah mengubah data.

## Catatan untuk guru
Ejaan Arab, harakat, terjemahan, kategori, dan klasifikasi jenis kata (isim, frasa, fi'il, mashdar) mengikuti daftar yang diberikan dan **sebaiknya ditinjau guru bahasa Arab** sebelum dipakai di kelas. Skor game tidak menunjukkan penguasaan materi.

## Penyimpanan lokal
Progres disimpan di `localStorage` dengan kunci `jelajah-destinasi:v1` pada **peramban dan origin yang sama**. Progres tidak berpindah antarperangkat atau pengguna, bisa hilang jika data peramban dihapus, dan tidak tersimpan jika penyimpanan diblokir (game tetap jalan selama sesi). Tidak ada data pribadi yang dikumpulkan. Tombol *Pengaturan → Hapus Semua Progres* hanya menghapus kunci milik aplikasi ini, setelah konfirmasi.

## Deploy ke GitHub Pages
1. Dorong proyek ke repositori GitHub pada branch `main` (jika branch utama Anda berbeda, ubah `branches` di `deploy.yml`).
2. Di repositori: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push ke `main` memicu workflow *Deploy to GitHub Pages*. URL situs tampil di tab Actions setelah selesai.

Semua path bersifat relatif sehingga berfungsi di subpath repositori. *Tangkapan layar:* tambahkan sendiri ke folder `docs/` setelah game dijalankan.

## Lisensi
MIT — lihat `LICENSE`.
