/* Penyimpanan lokal berversi. Satu kunci: jelajah-destinasi:v1. Aman terhadap data rusak / storage tidak tersedia. */
(function () {
  var JD = window.JD, KEY = 'jelajah-destinasi:v1', persistent = true, S = (JD.Storage = {});
  var ls = function () { try { return window.localStorage || null; } catch (e) { return null; } };
  var def = function () { return { v: 1, done: {}, xp: 0, last: null, settings: {} }; };
  var int = function (n, a, b) { n = Math.round(Number(n)); return isFinite(n) ? Math.min(b, Math.max(a, n)) : a; };
  function clean(o) {
    var p = def(), n = JD.CONFIG.levelCount;
    if (!o || typeof o !== 'object' || o.v !== 1) return p;
    var d = o.done && typeof o.done === 'object' ? o.done : {};
    for (var l = 1; l <= n; l++) {
      var e = d[l];
      if (e && typeof e === 'object') p.done[l] = { score: int(e.score, 0, 850), stars: int(e.stars, 0, 3), acc: int(e.acc, 0, 100), completed: e.completed === true };
    }
    if (o.last >= 1 && o.last <= n) p.last = int(o.last, 1, n);
    p.xp = JD.Game.totalXp(p);
    return p;
  }
  S.defaults = def;
  S.ok = function () { return persistent; };
  S.load = function () {
    var s = ls();
    if (!s) { persistent = false; return def(); }
    try { var raw = s.getItem(KEY); persistent = true; return raw ? clean(JSON.parse(raw)) : def(); }
    catch (e) { return def(); }
  };
  S.save = function (p) {
    var s = ls();
    try { if (!s) throw 0; s.setItem(KEY, JSON.stringify(p)); persistent = true; return true; }
    catch (e) { persistent = false; return false; }
  };
  S.reset = function () { var s = ls(); try { if (s) s.removeItem(KEY); return true; } catch (e) { return false; } };
})();
