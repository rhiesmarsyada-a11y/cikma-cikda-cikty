/* Logika permainan murni (tanpa DOM): kuis, mencocokkan, skor, bintang, pembukaan level. */
(function () {
  var JD = window.JD, V = JD.VOCAB, C = JD.CONFIG, G = (JD.Game = {});
  var shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  G.shuffle = shuffle;
  G.words = function (l) { return V.filter(function (v) { return v.level === l; }); };
  G.word = function (id) { return V.filter(function (v) { return v.id === id; })[0]; };
  G.stars = function (acc) { return acc >= 90 ? 3 : acc >= 75 ? 2 : acc >= 60 ? 1 : 0; };
  G.result = function (correct, total) {
    var acc = total ? (correct / total) * 100 : 0, base = correct * C.pointsCorrect;
    return { correct: correct, total: total, acc: acc, base: base, bonus: C.bonus, points: base + C.bonus, stars: G.stars(acc), passed: acc >= C.passAcc };
  };
  G.status = function (P, l) {
    var d = P.done[l];
    if (d && d.completed) return 'completed';
    if (l > 1 && !(P.done[l - 1] && P.done[l - 1].completed)) return 'locked';
    return d ? 'progress' : 'available';
  };
  G.totalXp = function (P) { var s = 0; for (var k in P.done) s += P.done[k].score; return s; };
  G.totalStars = function (P) { var s = 0; for (var k in P.done) s += P.done[k].stars; return s; };
  G.record = function (P, l, r) {
    var p = P.done[l] || { score: 0, stars: 0, acc: 0, completed: false };
    P.done[l] = { score: Math.max(p.score, r.points), stars: Math.max(p.stars, r.stars), acc: Math.max(p.acc, r.acc), completed: p.completed || r.passed };
    P.last = l; P.xp = G.totalXp(P);
    return { newBest: r.points > p.score, completedNow: r.passed && !p.completed };
  };
  function distractors(w, field) {
    var pool = shuffle(V.filter(function (v) { return v.id !== w.id && v[field] !== w[field]; }));
    var pr = function (v) { return (v.level === w.level ? 2 : 0) + (v.type === w.type ? 1 : 0) + (v.cat === w.cat ? 1 : 0); };
    pool.sort(function (a, b) { return pr(b) - pr(a); });
    return pool.slice(0, C.options - 1);
  }
  var TYPES = ['ar2id', 'id2ar', 'clue'];
  G.makeQuiz = function (l) {
    var qs = shuffle(G.words(l)).map(function (w, i) {
      var type = TYPES[i % 3], field = type === 'ar2id' ? 'idn' : 'ar';
      var opts = shuffle([w].concat(distractors(w, field))).map(function (v) { return { wid: v.id, text: v[field] }; });
      return { wid: w.id, type: type, field: field, options: opts };
    });
    return { mode: 'quiz', level: l, qs: shuffle(qs), i: 0, correct: 0, answered: false, sel: null };
  };
  G.answer = function (m, k) {
    var q = m.qs[m.i];
    if (m.answered || !q.options[k]) return null; // satu soal hanya dinilai sekali
    m.answered = true; m.sel = k;
    var ok = q.options[k].wid === q.wid;
    if (ok) m.correct++;
    return ok;
  };
  G.newMatch = function (l) {
    var ids = G.words(l).map(function (w) { return w.id; });
    return { mode: 'match', level: l, A: shuffle(ids), B: shuffle(ids), sel: { a: null, b: null }, done: [], missed: [], first: 0, flash: null };
  };
  G.pick = function (m, side, id) {
    if (m.done.indexOf(id) >= 0) return 'ignore';
    m.flash = null;
    m.sel[side] = m.sel[side] === id ? null : id;
    if (!m.sel.a || !m.sel.b) return 'select';
    var a = m.sel.a, b = m.sel.b;
    m.sel = { a: null, b: null };
    if (a === b) {
      m.done.push(a);
      if (m.missed.indexOf(a) < 0) m.first++; // hanya pasangan benar pada percobaan pertama dihitung
      return m.done.length === m.A.length ? 'finished' : 'ok';
    }
    [a, b].forEach(function (x) { if (m.missed.indexOf(x) < 0) m.missed.push(x); });
    m.flash = { a: a, b: b };
    return 'bad';
  };
})();
