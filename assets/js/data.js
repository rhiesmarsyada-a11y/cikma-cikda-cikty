/* Namespace bersama: window.JD (data -> game -> storage -> app). */
(function () {
  var JD = (window.JD = window.JD || {});
  JD.CONFIG = { levelCount: 4, pointsCorrect: 100, bonus: 50, passAcc: 60, options: 4 };
  JD.TYPES = {
    isim: 'Kata benda (اسم)', frasa: 'Frasa benda', fiil: 'Kata kerja (فعل)', masdar: 'Kata benda aktivitas (مصدر)'
  };
  JD.LEVELS = [
    { id: 1, name: 'Gerbang Persiapan', title: 'Persiapan Perjalanan', icon: '✈', x: 14, y: 70,
      intro: 'Sebelum berangkat, kamu perlu menyiapkan koper, peta, dan dokumen perjalanan. Kenali kosakata penting di bandara dan pelabuhan.' },
    { id: 2, name: 'Kota Penginapan', title: 'Perjalanan dan Penginapan', icon: '🏨', x: 38, y: 28,
      intro: 'Perjalananmu tiba di kota wisata. Temui pemandu, kunjungi objek wisata, dan pilih tempat menginap yang nyaman.' },
    { id: 3, name: 'Pulau Alam', title: 'Wisata Alam', icon: '🏝', x: 62, y: 72,
      intro: 'Jelajahi hutan, air terjun, pantai, gunung, dan danau. Alam menyimpan banyak kosakata baru untukmu.' },
    { id: 4, name: 'Lembah Budaya', title: 'Budaya dan Aktivitas Wisata', icon: '🏛', x: 86, y: 28,
      intro: 'Di destinasi terakhir kamu mengunjungi candi dan museum, lalu mencoba berbagai aktivitas wisata seru.' }
  ];
  // [Arab, Indonesia, kategori, jenis kata, petunjuk konteks]. ID & level dibuat otomatis (8 kata per level).
  var R = [
    ['حَقِيبَةُ سَفَرٍ', 'Koper', 'perlengkapan', 'frasa', 'Tempat membawa pakaian dan barang saat bepergian.'],
    ['خَرِيطَةٌ سِيَاحِيَّةٌ', 'Peta wisata', 'perlengkapan', 'frasa', 'Peta yang menunjukkan tempat-tempat menarik untuk dikunjungi.'],
    ['بُوصَلَةٌ', 'Kompas', 'perlengkapan', 'isim', 'Alat penunjuk arah utara, selatan, timur, dan barat.'],
    ['مَطَارٌ', 'Bandara', 'transportasi', 'isim', 'Tempat pesawat naik dan turun.'],
    ['مِينَاءٌ', 'Pelabuhan', 'transportasi', 'isim', 'Tempat kapal bersandar dan penumpang naik kapal.'],
    ['تَذْكِرَةٌ', 'Tiket', 'dokumen', 'isim', 'Bukti pembayaran untuk naik pesawat, kapal, atau kereta.'],
    ['جَوَازُ سَفَرٍ', 'Paspor', 'dokumen', 'frasa', 'Dokumen identitas yang dibawa saat pergi ke luar negeri.'],
    ['تَأْشِيرَةٌ', 'Visa', 'dokumen', 'isim', 'Izin resmi untuk masuk ke negara tujuan.'],
    ['رِحْلَةٌ', 'Perjalanan', 'perjalanan', 'isim', 'Kegiatan pergi dari satu tempat ke tempat lain.'],
    ['يَتَنَزَّهُ', 'Berwisata', 'aktivitas', 'fiil', 'Kata kerja: ia pergi bersenang-senang melihat tempat yang indah.'],
    ['مَعْلَمٌ سِيَاحِيٌّ', 'Objek wisata', 'tempat wisata', 'frasa', 'Tempat menarik yang banyak dikunjungi wisatawan.'],
    ['مُرْشِدٌ سِيَاحِيٌّ', 'Pemandu wisata', 'profesi', 'frasa', 'Orang yang menjelaskan tempat wisata kepada para pengunjung.'],
    ['فُنْدُقٌ', 'Hotel', 'penginapan', 'isim', 'Tempat menginap dengan banyak kamar dan layanan.'],
    ['مُنْتَجَعٌ', 'Resor', 'penginapan', 'isim', 'Tempat menginap mewah untuk berlibur dan bersantai.'],
    ['فِيلَّا', 'Vila', 'penginapan', 'isim', 'Rumah peristirahatan yang disewa saat liburan.'],
    ['نُزُلٌ', 'Penginapan', 'penginapan', 'isim', 'Tempat menginap sederhana bagi para musafir.'],
    ['غَابَةٌ', 'Hutan', 'alam', 'isim', 'Kawasan luas yang dipenuhi pohon-pohon lebat.'],
    ['شَلَّالٌ', 'Air terjun', 'alam', 'isim', 'Air sungai yang jatuh dari tempat yang tinggi.'],
    ['الشُّعَبُ الْمَرْجَانِيَّةُ', 'Terumbu karang', 'alam', 'frasa', 'Rumah ikan warna-warni di dasar laut.'],
    ['مَحْمِيَّةٌ طَبِيعِيَّةٌ', 'Cagar alam', 'alam', 'frasa', 'Kawasan alam yang dijaga agar tumbuhan dan hewannya lestari.'],
    ['حَدِيقَةٌ وَطَنِيَّةٌ', 'Taman nasional', 'alam', 'frasa', 'Kawasan alam luas yang dilindungi oleh negara.'],
    ['شَاطِئٌ', 'Pantai', 'alam', 'isim', 'Tepi laut dengan pasir dan ombak.'],
    ['جَبَلٌ', 'Gunung', 'alam', 'isim', 'Bagian bumi yang sangat tinggi dan bisa didaki.'],
    ['بُحَيْرَةٌ', 'Danau', 'alam', 'isim', 'Air tenang yang dikelilingi daratan.'],
    ['مَعْبَدٌ أَثَرِيٌّ', 'Candi', 'budaya', 'frasa', 'Bangunan ibadah peninggalan zaman kuno, seperti Borobudur.'],
    ['مُتْحَفٌ', 'Museum', 'budaya', 'isim', 'Tempat menyimpan dan memamerkan benda-benda bersejarah.'],
    ['السِّبَاحَةُ', 'Berenang', 'aktivitas', 'masdar', 'Bergerak di dalam air dengan tangan dan kaki.'],
    ['الْغَوْصُ', 'Menyelam', 'aktivitas', 'masdar', 'Masuk ke bawah permukaan laut untuk melihat terumbu karang.'],
    ['التَّصْوِيرُ', 'Memotret', 'aktivitas', 'masdar', 'Mengambil gambar pemandangan dengan kamera.'],
    ['التَّسَلُّقُ', 'Mendaki', 'aktivitas', 'masdar', 'Naik ke puncak gunung atau tebing.'],
    ['التَّنَزُّهُ', 'Jalan-jalan', 'aktivitas', 'masdar', 'Berjalan santai untuk menikmati suasana tempat wisata.'],
    ['وِجْهَةٌ سِيَاحِيَّةٌ', 'Destinasi wisata', 'tempat wisata', 'frasa', 'Tempat tujuan yang menarik untuk dikunjungi turis.']
  ];
  JD.VOCAB = R.map(function (r, i) {
    return { id: 'w' + (i < 9 ? '0' : '') + (i + 1), level: Math.floor(i / 8) + 1, ar: r[0], idn: r[1], cat: r[2], type: r[3], clue: r[4] };
  });
})();
