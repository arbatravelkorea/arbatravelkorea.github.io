// 기도 시간 계산 (JAKIM 기준: Fajr 20°, Isha 18°, Asr 샤피이 1배 그림자) — 지침서 날짜 카드용. 오차 ±2분
// prayerTimes(lat, lng, 'YYYY-MM-DD') → {fajr, sunrise, dhuhr, asr, maghrib, isha} (KST HH:MM)
function prayerTimes(lat, lng, ymd, tz) {
  tz = tz == null ? 9 : tz;
  var p = ymd.split('-').map(Number), y = p[0], m = p[1], d = p[2];
  function jd(y, m, d) { if (m <= 2) { y -= 1; m += 12; } var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
  var J = jd(y, m, d) - lng / 360, D = J - 2451545.0;
  var g = (357.529 + 0.98560028 * D) % 360, q = (280.459 + 0.98564736 * D) % 360;
  var L = (q + 1.915 * Math.sin(rad(g)) + 0.020 * Math.sin(rad(2 * g))) % 360;
  var e = 23.439 - 0.00000036 * D, RA = deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))) / 15;
  RA = (RA + 24) % 24; var decl = deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), EqT = q / 15 - RA;
  if (EqT > 12) EqT -= 24; if (EqT < -12) EqT += 24;
  var noon = 12 + tz - lng / 15 - EqT;
  function ang(a) { var v = (-Math.sin(rad(a)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) / (Math.cos(rad(lat)) * Math.cos(rad(decl))); return deg(Math.acos(Math.max(-1, Math.min(1, v)))) / 15; }
  function asrT() { var a = deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(lat - decl)))))); var v = (Math.sin(rad(a)) - Math.sin(rad(lat)) * Math.sin(rad(decl))) / (Math.cos(rad(lat)) * Math.cos(rad(decl))); return deg(Math.acos(Math.max(-1, Math.min(1, v)))) / 15; }
  var r = 0.833; // 일출·일몰 굴절
  var t = { fajr: noon - ang(20), sunrise: noon - ang(r), dhuhr: noon + 2 / 60, asr: noon + asrT(), maghrib: noon + ang(r) + 1 / 60, isha: noon + ang(18) };
  var out = {}; for (var k in t) out[k] = hm(t[k]); return out;
  function rad(x) { return x * Math.PI / 180; } function deg(x) { return x * 180 / Math.PI; }
  function hm(h) { h = (h + 24) % 24; var H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { H++; M = 0; } return (H < 10 ? '0' : '') + H + ':' + (M < 10 ? '0' : '') + M; }
}
var PRAYER_LOC = { SEL: [37.5665, 126.978], JJU: [33.4996, 126.5312], BUS: [35.1796, 129.0756], ICN: [37.4602, 126.4407] };
if (typeof module !== 'undefined') module.exports = { prayerTimes: prayerTimes, PRAYER_LOC: PRAYER_LOC };
