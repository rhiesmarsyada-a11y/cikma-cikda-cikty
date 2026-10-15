/* Tampilan, navigasi, dan event. Logika permainan ada di game.js. */
(function () {
  'use strict';
  var JD = window.JD, L = JD.LEVELS, G = JD.Game, St = JD.Storage, TY = JD.TYPES;
  var P = St.load(), S = { screen: 'home' }, M = null;
  var app = document.getElementById('app'), live = document.getElementById('live');
  var say = function (t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); };
  var ar = function (t) { return '<span class="ar" dir="rtl" lang="ar">' + t + '</span>'; };
  var lv = function (id) { return L.filter(function (l) { return l.id === id; })[0]; };
  var ST = { locked: ['🔒', 'Terkunci'], available: ['▶', 'Tersedia'], progress: ['◐', 'Sedang dijalani'], completed: ['✓', 'Selesai'] };
  var starTxt = function (n) { return '★★★'.slice(0, n) + '☆☆☆'.slice(0, 3 - n); };
  var persist = function () { St.save(P); };

  function render(focus) {
    app.innerHTML = V[S.screen]();
    document.getElementById('xp').textContent = P.xp > 0 ? 'XP ' + P.xp : '';
    if (focus) { var e = app.querySelector(focus); if (e) e.focus(); }
  }
  function go(screen, extra) { S = Object.assign({ screen: screen }, extra || {}); render(); app.focus(); window.scrollTo(0, 0); }

  function panel() {
    var done = L.filter(function (l) { return G.status(P, l.id) === 'completed'; }).length;
    return '<div class="panel"><div class="stats"><div><b>' + P.xp + '</b><span>Total XP</span></div><div><b>' + G.totalStars(P) + '/12</b><span>Bintang ★</span></div><div><b>' + done + '/4</b><span>Destinasi selesai</span></div></div>' +
      '<progress max="4" value="' + done + '" aria-label="Kemajuan destinasi">' + done + ' dari 4</progress>' +
      '<div class="stamps" aria-hidden="true">' + L.map(function (l) { var s = G.status(P, l.id); return '<span class="stamp ' + s + '">' + (s === 'completed' ? '✓' : l.icon) + '</span>'; }).join('') + '</div></div>';
  }
  function ill(l) {
    var art = [
      '<rect y="140" width="400" height="40" fill="#35525a"/><path d="M50 110l130-30 50 14-50 20z" fill="#fff"/><path d="M120 100l30-40 18 6-14 38z" fill="#e7c765"/><rect x="280" y="102" width="62" height="44" rx="8" fill="#c8941f"/><rect x="299" y="90" width="24" height="14" rx="4" fill="none" stroke="#7a5608" stroke-width="5"/>',
      '<rect y="150" width="400" height="30" fill="#2b6b5f"/><rect x="120" y="40" width="160" height="112" fill="#f6ecd2"/><rect x="170" y="22" width="60" height="20" rx="4" fill="#c8941f"/><path d="M140 62h26v20h-26zM187 62h26v20h-26zM234 62h26v20h-26zM140 98h26v20h-26zM234 98h26v20h-26z" fill="#14808f"/><rect x="187" y="108" width="26" height="44" fill="#7a5608"/>',
      '<rect y="130" width="400" height="50" fill="#2b8794"/><path d="M0 130l90-80 70 80zM110 130l100-100 100 100z" fill="#2f7d5b"/><path d="M190 52l20-22 20 22-20 8z" fill="#fff"/><path d="M0 150q50-10 100 0t100 0 100 0 100 0" fill="none" stroke="#d9f0f1" stroke-width="4"/>',
      '<rect y="150" width="400" height="30" fill="#b98e45"/><path d="M110 150v-28h180v28zM130 122v-26h140v26zM150 96v-24h100v24zM172 72v-22h56v22z" fill="#8d7a5c"/><path d="M190 50l10-22 10 22z" fill="#c8941f"/><path d="M70 150v-50M330 150v-60" stroke="#2f7d5b" stroke-width="10"/>'
    ][l.id - 1];
    return '<svg class="ill" viewBox="0 0 400 180" role="img" aria-label="Ilustrasi ' + l.name + '"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc8d0"/><stop offset="1" stop-color="#f6ecd2"/></linearGradient></defs><rect width="400" height="180" fill="url(#sky)"/><circle cx="340" cy="36" r="20" fill="#e7c765"/>' + art + '</svg>';
  }
  var back = function (act, txt, l) { return '<button class="btn sm" data-act="' + act + '"' + (l ? ' data-l="' + l + '"' : '') + '>← ' + txt + '</button>'; };

  var V = {
    home: function () {
      var any = Object.keys(P.done).length > 0;
      return '<section class="hero"><p class="eyebrow">Kosakata Bahasa Arab · Kelas XI · ' + ar('السِّيَاحَةُ') + '</p>' +
        '<h1 class="ar-title ar" lang="ar" dir="rtl">اِكْتَشِفِ الْوِجْهَاتِ</h1><h2>Jelajah Destinasi</h2>' +
        '<p class="sub">Berkelana ke empat destinasi, pelajari kosakata wisata, selesaikan misi, dan kumpulkan bintang!</p>' +
        '<div class="row"><button class="btn primary big" data-act="map">Mulai Petualangan</button><button class="btn" data-act="howto">Cara Bermain</button></div>' +
        (any ? panel() : '<p class="note">Belum ada progres tersimpan. Petualanganmu dimulai dari Destinasi 1.</p>') +
        (St.ok() ? '' : '<p class="warn" role="status">⚠ Penyimpanan peramban tidak tersedia. Game tetap bisa dimainkan, tetapi progres hanya bertahan selama sesi ini.</p>') + '</section>';
    },
    map: function () {
      var pts = L.map(function (l) { return l.x + ',' + l.y; }).join(' ');
      return '<h2>Peta Petualangan</h2>' + panel() +
        '<div class="map"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="#f6ecd2" stroke-width="1.2" stroke-dasharray="3 2" vector-effect="non-scaling-stroke" style="stroke-width:4px"/></svg>' +
        L.map(function (l) {
          var s = G.status(P, l.id), d = P.done[l.id];
          return '<button class="marker ' + s + '" style="--x:' + l.x + '%;--y:' + l.y + '%" data-act="open" data-l="' + l.id + '" aria-disabled="' + (s === 'locked') + '" aria-label="Destinasi ' + l.id + ': ' + l.name + ', ' + ST[s][1] + '">' +
            '<span class="pin" aria-hidden="true">' + l.icon + '</span><span><b>' + l.id + '. ' + l.name + '</b><small>' + ST[s][0] + ' ' + ST[s][1] + (d ? ' · ' + starTxt(d.stars) : '') + '</small></span></button>';
        }).join('') + '</div><p class="hint" id="hint" role="status">Pilih destinasi untuk memulai. Destinasi terkunci terbuka setelah destinasi sebelumnya selesai dengan akurasi ≥ 60%.</p>';
    },
    detail: function () {
      var l = lv(S.l), d = P.done[l.id];
      return back('map', 'Peta') + '<h2>Destinasi ' + l.id + ': ' + l.name + '</h2>' + ill(l) +
        '<p><span class="chip">' + l.title + '</span></p><p>' + l.intro + '</p>' +
        (d ? '<p class="note">Rekor terbaikmu: <b>' + d.score + ' poin</b> · <b>' + starTxt(d.stars) + '</b> (' + d.stars + ' bintang) · akurasi ' + Math.round(d.acc) + '%</p>' : '<p class="note">Kamu belum mencoba misi di destinasi ini. Ayo mulai!</p>') +
        '<h3>Kosakata (8 kata)</h3><ul class="vlist">' + G.words(l.id).map(function (w) { return '<li>' + ar(w.ar) + '<span>' + w.idn + '</span></li>'; }).join('') + '</ul>' +
        '<div class="row"><button class="btn primary" data-act="study" data-l="' + l.id + '">Pelajari Kosakata</button><button class="btn" data-act="quiz" data-l="' + l.id + '">Misi Kuis</button><button class="btn" data-act="match" data-l="' + l.id + '">Misi Mencocokkan</button></div>';
    },
    study: function () {
      var ws = G.words(S.l), w = ws[S.i], last = S.i === ws.length - 1;
      return back('detail', 'Destinasi ' + S.l, S.l) + '<div class="bar"><h2>Kartu Kosakata</h2><span>' + (S.i + 1) + '/' + ws.length + '</span></div>' +
        '<div class="card"><span class="chip">' + TY[w.type] + '</span>' + ar(w.ar) + (S.hide ? '<p class="idn">• • •</p>' : '<p class="idn">' + w.idn + '</p><p>💡 ' + w.clue + '</p>') + '</div>' +
        '<div class="row"><button class="btn" data-act="prev"' + (S.i ? '' : ' disabled') + '>← Sebelumnya</button><button class="btn" data-act="toggle" aria-pressed="' + !!S.hide + '">' + (S.hide ? 'Lihat arti' : 'Tutup arti (uji diri)') + '</button>' +
        (last ? '<button class="btn primary" data-act="quiz" data-l="' + S.l + '">Mulai Misi Kuis</button>' : '<button class="btn primary" data-act="next">Berikutnya →</button>') + '</div>';
    },
    quiz: function () {
      var q = M.qs[M.i], w = G.word(q.wid), n = M.qs.length, a = M.answered, ok = a && q.options[M.sel].wid === q.wid;
      var head = q.type === 'ar2id' ? 'Apa arti kata berikut?' + ar(w.ar) : q.type === 'id2ar' ? 'Manakah bahasa Arab untuk “' + w.idn + '”?' : 'Petunjuk: ' + w.clue + '<br>Kata Arab apa yang paling tepat?';
      var opts = q.options.map(function (o, k) {
        var cls = a ? (o.wid === q.wid ? 'ok' : k === M.sel ? 'bad' : '') : '', mark = a ? (o.wid === q.wid ? '✓ ' : k === M.sel ? '✗ ' : '') : '';
        return '<button class="opt ' + cls + '" data-act="answer" data-k="' + k + '"' + (a ? ' disabled' : '') + '>' + mark + (q.field === 'ar' ? ar(o.text) : o.text) + '</button>';
      }).join('');
      var fb = '';
      if (a) fb = ok ? '<div class="fb ok" role="status">' + ['مُمْتَازٌ! (Luar biasa!) Jawabanmu tepat.', 'Bagus sekali! Terus semangat.', 'Tepat! Kamu makin akrab dengan kosakata ini.'][M.i % 3] + '</div>'
        : '<div class="fb bad" role="status">Belum tepat, tidak apa-apa! Jawaban yang benar: ' + (q.field === 'ar' ? ar(w.ar) : w.idn) + '. ' + ar(w.ar) + ' berarti “' + w.idn + '”. ' + w.clue + '</div>';
      return '<div class="bar"><span>Soal ' + (M.i + 1) + '/' + n + '</span><span>Skor: ' + M.correct * 100 + '</span></div><progress max="' + n + '" value="' + (M.i + (a ? 1 : 0)) + '" aria-label="Kemajuan kuis"></progress>' +
        '<div class="qbox"><h2 id="qh" tabindex="-1">' + head + '</h2><div class="opts">' + opts + '</div>' + fb +
        (a ? '<div class="row"><button class="btn primary next" data-act="qnext">' + (M.i === n - 1 ? 'Lihat Hasil' : 'Soal Berikutnya →') + '</button></div>' : '') + '</div>' +
        '<button class="btn sm" data-act="detail" data-l="' + M.level + '">Keluar dari misi</button>';
    },
    match: function () {
      var f = M.flash, n = M.A.length;
      var card = function (side, id) {
        var w = G.word(id), done = M.done.indexOf(id) >= 0, sel = M.sel[side] === id, bad = f && f[side] === id;
        var cls = done ? 'done' : bad ? 'wrong' : sel ? 'sel' : '';
        return '<button class="mcard ' + cls + '" data-act="pick" data-side="' + side + '" data-w="' + id + '" aria-pressed="' + sel + '"' + (done ? ' disabled' : '') + '>' + (done ? '✓ ' : sel ? '● ' : bad ? '✗ ' : '') + (side === 'a' ? ar(w.ar) : w.idn) + '</button>';
      };
      return back('detail', 'Destinasi ' + M.level, M.level) + '<div class="bar"><h2 id="mh" tabindex="-1">Cocokkan Kosakata</h2><span>' + M.done.length + '/' + n + ' pasangan</span></div>' +
        '<p>Pilih satu kata Arab, lalu pilih artinya dalam bahasa Indonesia.</p><p class="hint" role="status">' + (M.msg || '') + '</p>' +
        '<div class="mgrid"><div class="mcol">' + M.A.map(function (id) { return card('a', id); }).join('') + '</div><div class="mcol">' + M.B.map(function (id) { return card('b', id); }).join('') + '</div></div>';
    },
    results: function () {
      var r = S.r, l = lv(S.l), nxt = lv(S.l + 1), msg = ['Ayo coba lagi! Setiap percobaan membantumu belajar.', 'Awal yang baik! Kamu sudah melangkah maju.', 'Bagus sekali! Hampir sempurna.', 'مُمْتَازٌ! (Luar biasa!) Kamu hebat.'][r.stars];
      var d = P.done[S.l];
      return '<section class="res"><h2 id="rh" tabindex="-1">Hasil Misi: ' + l.name + '</h2><p class="stars" aria-label="' + r.stars + ' dari 3 bintang">' + starTxt(r.stars) + '</p><p><b>' + msg + '</b></p>' +
        '<div class="panel"><div class="stats"><div><b>' + r.correct + '/' + r.total + '</b><span>Benar</span></div><div><b>' + Math.round(r.acc) + '%</b><span>Akurasi</span></div><div><b>' + r.base + ' + ' + r.bonus + '</b><span>Poin (+bonus misi)</span></div></div>' +
        '<p>' + (S.rec.completedNow ? '🎉 Destinasi selesai!' + (nxt ? ' Destinasi ' + nxt.id + ' (' + nxt.name + ') terbuka.' : ' Kamu telah menamatkan semua destinasi!') : r.passed ? '✓ Destinasi ini sudah selesai.' : 'Capai akurasi 60% untuk menyelesaikan destinasi ini dan membuka berikutnya.') +
        (S.rec.newBest ? ' Rekor skor baru!' : '') + '</p><p class="note">Rekor terbaik: ' + d.score + ' poin · ' + starTxt(d.stars) + '. Skor game belum tentu berarti kosakata sudah dikuasai — teruslah berlatih.</p></div>' +
        '<div class="row" style="justify-content:center">' + (nxt && d.completed ? '<button class="btn primary" data-act="open" data-l="' + nxt.id + '">Ke Destinasi ' + nxt.id + '</button>' : '') +
        '<button class="btn' + (nxt && d.completed ? '' : ' primary') + '" data-act="' + S.mode + '" data-l="' + S.l + '">Ulangi Misi</button><button class="btn" data-act="study" data-l="' + S.l + '">Pelajari Lagi</button><button class="btn" data-act="map">Peta</button></div></section>';
    }
  };

  function finish(correct, total) {
    var r = G.result(correct, total), rec = G.record(P, M.level, r);
    persist();
    go('results', { l: M.level, r: r, rec: rec, mode: M.mode });
    say('Misi selesai. Akurasi ' + Math.round(r.acc) + ' persen, ' + r.stars + ' bintang.');
  }
  var dlg = function (id) { var d = document.getElementById(id); if (d.showModal) d.showModal(); else d.setAttribute('open', ''); };
  var closeAll = function () { document.querySelectorAll('dialog').forEach(function (d) { if (d.close) d.close(); else d.removeAttribute('open'); }); };

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var d = b.dataset, l = +d.l;
    switch (d.act) {
      case 'home': go('home'); break;
      case 'map': go('map'); break;
      case 'howto': dlg('howto'); break;
      case 'settings': dlg('settings'); break;
      case 'close': closeAll(); break;
      case 'resetask': dlg('confirm'); break;
      case 'resetdo': St.reset(); P = St.defaults(); closeAll(); go('home'); say('Progres dihapus.'); break;
      case 'open':
        if (G.status(P, l) === 'locked') {
          var h = document.getElementById('hint'), t = 'Destinasi ' + l + ' masih terkunci. Selesaikan Destinasi ' + (l - 1) + ' dengan akurasi minimal 60% untuk membukanya.';
          if (h) h.textContent = t; say(t);
        } else { P.last = l; persist(); go('detail', { l: l }); }
        break;
      case 'detail': go('detail', { l: l }); break;
      case 'study': go('study', { l: l, i: 0, hide: false }); break;
      case 'prev': S.i--; render('[data-act=next],[data-act=quiz]'); break;
      case 'next': S.i++; render('[data-act=next],[data-act=quiz]'); break;
      case 'toggle': S.hide = !S.hide; render('[data-act=toggle]'); break;
      case 'quiz': M = G.makeQuiz(l); go('quiz'); break;
      case 'answer':
        var ok = G.answer(M, +d.k); if (ok === null) return;
        say(ok ? 'Benar!' : 'Belum tepat. Lihat penjelasan.'); render('.next'); break;
      case 'qnext':
        if (M.i < M.qs.length - 1) { M.i++; M.answered = false; M.sel = null; render('#qh'); }
        else finish(M.correct, M.qs.length);
        break;
      case 'match': M = G.newMatch(l); M.msg = ''; go('match'); break;
      case 'pick':
        var ev = G.pick(M, d.side, d.w); if (ev === 'ignore') return;
        M.msg = ev === 'bad' ? '✗ Belum cocok. Coba lagi!' : ev === 'ok' ? '✓ Cocok! Bagus.' : ev === 'finished' ? '✓ Semua pasangan cocok!' : '';
        if (M.msg) say(M.msg);
        if (ev === 'finished') { finish(M.first, M.A.length); break; }
        render('[data-side="' + d.side + '"][data-w="' + d.w + '"]:not(:disabled)'); break;
    }
  });
  render();
})();
