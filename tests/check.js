// Pemeriksaan logika tanpa dependensi: node tests/check.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
function boot(ls) {
  const ctx = { Math, JSON }; ctx.window = ctx; if (ls !== undefined) Object.defineProperty(ctx, 'localStorage', { get() { if (ls instanceof Error) throw ls; return ls; } });
  ['data', 'game', 'storage'].forEach(f => vm.runInNewContext(fs.readFileSync(`assets/js/${f}.js`, 'utf8'), ctx));
  return ctx.JD;
}
const mem = () => { const d = {}; return { d, getItem: k => (k in d ? d[k] : null), setItem: (k, v) => (d[k] = String(v)), removeItem: k => delete d[k] }; };
let JD = boot(mem()), G = JD.Game, V = JD.VOCAB;
assert.equal(V.length, 32);
assert.equal(new Set(V.map(v => v.id)).size, 32); assert.equal(new Set(V.map(v => v.ar)).size, 32);
for (let l = 1; l <= 4; l++) assert.equal(G.words(l).length, 8);
V.forEach(v => assert(v.ar && v.idn && v.cat && v.type && v.clue && /[\u064B-\u0652]/.test(v.ar)));
for (let t = 0; t < 300; t++) for (let l = 1; l <= 4; l++) {
  const m = G.makeQuiz(l); assert.equal(m.qs.length, 8); assert.equal(new Set(m.qs.map(q => q.wid)).size, 8);
  m.qs.forEach(q => { assert.equal(q.options.length, 4); assert.equal(q.options.filter(o => o.wid === q.wid).length, 1);
    assert.equal(new Set(q.options.map(o => o.text)).size, 4); assert(G.word(q.wid)); q.options.forEach(o => assert(G.word(o.wid))); });
}
const m = G.makeQuiz(1), q = m.qs[0], ci = q.options.findIndex(o => o.wid === q.wid);
assert.strictEqual(G.answer(m, ci), true); assert.strictEqual(G.answer(m, ci), null); assert.equal(m.correct, 1);
[[0, 0, 0], [5, 62.5, 1], [6, 75, 2], [7, 87.5, 2], [8, 100, 3], [4, 50, 0]].forEach(([c, a, s]) => { const r = G.result(c, 8); assert.equal(r.acc, a); assert.equal(r.stars, s); assert.equal(r.points, c * 100 + 50); });
assert.equal(G.stars(89.9), 2); assert.equal(G.stars(90), 3); assert.equal(G.stars(59.9), 0); assert.equal(G.result(5, 8).passed, true); assert.equal(G.result(4, 8).passed, false);
const mm = G.newMatch(1), [a, b] = mm.A;
assert.equal(G.pick(mm, 'a', a), 'select'); assert.equal(G.pick(mm, 'b', mm.B.find(x => x !== a)), 'bad'); assert(mm.flash);
G.pick(mm, 'a', a); assert.equal(G.pick(mm, 'b', a), 'ok'); assert.equal(mm.first, 0); assert.equal(G.pick(mm, 'a', a), 'ignore');
mm.A.filter(x => x !== a).forEach((x, i, arr) => { G.pick(mm, 'a', x); assert.equal(G.pick(mm, 'b', x), i === arr.length - 1 ? 'finished' : 'ok'); });
assert.equal(mm.first, 6); assert.equal(mm.done.length, 8); // kata yang terlibat salah pilih (2 kata) tidak dihitung
const P = JD.Storage.defaults();
assert.deepEqual([1, 2, 3, 4].map(l => G.status(P, l)), ['available', 'locked', 'locked', 'locked']);
let rec = G.record(P, 1, G.result(8, 8)); assert(rec.completedNow && rec.newBest);
assert.equal(G.status(P, 2), 'available'); G.record(P, 1, G.result(2, 8));
assert.deepEqual([P.done[1].score, P.done[1].stars, P.done[1].completed], [850, 3, true]);
G.record(P, 2, G.result(3, 8)); assert.equal(G.status(P, 2), 'progress'); assert.equal(G.status(P, 3), 'locked');
const S = JD.Storage; assert(S.save(P)); const L = S.load(); assert.deepEqual(L.done[1], P.done[1]); assert.equal(L.xp, G.totalXp(P));
const store = mem(); JD = boot(store); store.setItem('lain', 'x'); store.setItem('jelajah-destinasi:v1', '{rusak');
assert.deepEqual(JD.Storage.load(), JD.Storage.defaults());
store.setItem('jelajah-destinasi:v1', JSON.stringify({ v: 1, done: { 1: { score: 'x', stars: 99, acc: -5, completed: 1 }, 9: {} }, last: 99 }));
const c = JD.Storage.load(); assert.deepEqual(c.done[1], { score: 0, stars: 3, acc: 0, completed: false }); assert(!c.done[9]); assert.equal(c.last, null);
JD.Storage.reset(); assert.equal(store.getItem('jelajah-destinasi:v1'), null); assert.equal(store.getItem('lain'), 'x');
JD = boot(new Error('blocked')); assert.deepEqual(JD.Storage.load(), JD.Storage.defaults()); assert.equal(JD.Storage.save({}), false); assert.equal(JD.Storage.ok(), false);
JD = boot(undefined); assert.equal(JD.Storage.save({}), false); assert.equal(JD.Storage.reset(), true);
console.log('Semua pemeriksaan lulus.');
