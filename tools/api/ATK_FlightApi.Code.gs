/**
 * ATK_FlightApi — 인천공항공사 여객기 운항 현황(StatusOfPassengerFlightsDeOdp) 조회 전용 (2026-11-05)
 * 이 프로젝트는 조회 위주 (시트 없음) → 웹앱을 '모든 사용자'로 배포해 지침서 항공 칸이 호출
 * 2026-11-09: 가이드 일정 변경(doPost act=chg) — 스크립트 속성 'chg:<슬러그>'에 변경분 저장(원본 JSON은 그대로), PIN = 지침서 가이드 전화 뒤 4자리.
 *   텔레그램 알림은 스크립트 속성 TG_TOKEN·TG_CHAT이 있을 때만 (대표가 직접 넣음 — 코드·대화에 쓰지 않음). 기록 'chglog'(최근 200건)
 * 인증키: 스크립트 속성 DATA_GO_KR_KEY (공공데이터포털 일반 인증키 Decoding 값). 코드·대화·문서에 쓰지 않음.
 * 사용: ?flight=MH38&date=20261104&dir=A&t=2055   /   ?flights=편명|YYYYMMDD|A|HHMM~편명|YYYYMMDD|D|HHMM
 * dir: A=도착(입국) D=출발(출국). date=YYYYMMDD (인천 기준 예정일, D-3~D+6만 조회됨). t=예정 HHMM(선택, 도착편 조회 범위 ±3시간). 결과 5분 캐시
 * 주의(11/5 확인): API 편명은 숫자 3자리로 0을 채움(MH38 → MH038). 도착편은 flight_id 필터가 안 먹어 시간 범위로 받아서 편명으로 직접 고름. 도착편 키는 terminalid/masterflightid 소문자
 */
var FS_BASE_ = 'https://apis.data.go.kr/B551177/StatusOfPassengerFlightsDeOdp/';
var FS_TERM_ = { P01: 'T1', P02: '탑승동', P03: 'T2' };

function doGet(e) {
  var p = (e && e.parameter) || {};
  var r;
  if (p.v) {
    var vj = voucherJson_(p.v, p.lang), key = PropertiesService.getScriptProperties().getProperty('CHGLOG_KEY'), staff = !!(key && p.st === key);
    if (vj.ok && !staff && vExpired_(p.v, vj.data)) vj = { ok: false, error: 'expired' };
    if (vj.ok) { vj.chg = chgGet_(p.v); vj.own = staff ? true : devCheck_(p.v, p.dv, vj.data); }
    return ContentService.createTextOutput(JSON.stringify(vj)).setMimeType(ContentService.MimeType.JSON);
  }
  if (p.chglog) return ContentService.createTextOutput(JSON.stringify(chgLog_(p.since, p.k))).setMimeType(ContentService.MimeType.JSON);
  if (p.dbg) return ContentService.createTextOutput(JSON.stringify(fsDbg_(p.dbg, p.q || 'KUL', p.dir))).setMimeType(ContentService.MimeType.JSON);
  try { r = p.flights ? { ok: true, list: flightStatusMany(p.flights) } : flightStatus(p.flight, p.date, p.dir, p.t); } catch (err) { r = { ok: false, error: String(err) }; }
  return ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON);
}

function fsKey_() {
  var k = PropertiesService.getScriptProperties().getProperty('DATA_GO_KR_KEY');
  if (!k) throw new Error('DATA_GO_KR_KEY 스크립트 속성 없음');
  return k;
}
function fsTime_(s) { s = String(s || ''); return s.length >= 12 ? s.slice(8, 10) + ':' + s.slice(10, 12) : ''; }
function fsDate_(s) { s = String(s || ''); return s.length >= 8 ? s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) : ''; }

/** 편명 1개 조회 → {ok, dir, flight, date, scheduled, estimated, delayMin, status, terminal, exit, belt, gate, counter, airport, airline, codeshare, fetchedAt} */
function flightStatus(flight, date, dir, t) {
  flight = String(flight || '').toUpperCase().replace(/\s+/g, '');
  date = String(date || '').replace(/-/g, '');
  dir = String(dir || 'A').toUpperCase() === 'D' ? 'D' : 'A';
  if (!/^[A-Z0-9]{2}\d{1,4}[A-Z]?$/.test(flight)) return { ok: false, error: '편명 형식' };
  if (!/^\d{8}$/.test(date)) return { ok: false, error: '날짜 형식 YYYYMMDD' };
  var cache = CacheService.getScriptCache(), ck = 'fs:' + dir + ':' + flight + ':' + date;
  var hit = cache.get(ck); if (hit) return JSON.parse(hit);
  var fn = dir === 'D' ? 'getPassengerDeparturesDeOdp' : 'getPassengerArrivalsDeOdp';
  t = String(t || '').replace(/:/g, '');
  var url = FS_BASE_ + fn + '?serviceKey=' + encodeURIComponent(fsKey_()) + '&type=json&pageNo=1&lang=K&searchday=' + date;
  if (dir === 'D') url += '&numOfRows=50&flight_id=' + encodeURIComponent(fsPad_(flight));
  else if (/^\d{4}$/.test(t)) { var h = +t.slice(0, 2); url += '&numOfRows=600&from_time=' + fsHm_(h - 3) + '&to_time=' + fsHm_(h + 3); }
  else url += '&numOfRows=2000';
  var res, body;
  try {
    res = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    body = res.getContentText();
  } catch (err) { return { ok: false, error: 'fetch ' + err }; }
  var j; try { j = JSON.parse(body); } catch (e2) { return { ok: false, error: 'API 응답 ' + res.getResponseCode() + ' ' + body.slice(0, 160) }; }
  var hdr = (j.response && j.response.header) || {};
  if (hdr.resultCode && hdr.resultCode !== '00') return { ok: false, error: 'API ' + hdr.resultCode + ' ' + (hdr.resultMsg || '') };
  var items = (j.response && j.response.body && j.response.body.items) || [];
  if (items.item) items = items.item;
  if (!Array.isArray(items)) items = items ? [items] : [];
  // 편명 정확히 일치 (코드셰어 제외) 우선, 없으면 첫 항목
  var it = null;
  for (var i = 0; i < items.length; i++) { if (fsSame_(items[i].flightId, flight)) { it = items[i]; break; } }
  if (!it && dir === 'D' && items.length) it = items[0];
  var out;
  if (!it) out = { ok: true, found: false, dir: dir, flight: flight, date: fsDate_(date), note: '조회 결과 없음 (D-3~D+6 밖이거나 편명·날짜 확인)' };
  else {
    var sch = String(it.scheduleDateTime || ''), est = String(it.estimatedDateTime || '');
    var delayMin = (sch.length >= 12 && est.length >= 12) ? Math.round((fsMs_(est) - fsMs_(sch)) / 60000) : null;
    var remark = String(it.remark || '').trim();
    out = { ok: true, found: true, dir: dir, flight: flight, date: fsDate_(sch || date),
      scheduled: fsTime_(sch), estimated: fsTime_(est), estimatedDate: fsDate_(est), delayMin: delayMin, remark: remark,
      status: fsStatus_(remark, delayMin), terminal: FS_TERM_[it.terminalId || it.terminalid] || String(it.terminalId || it.terminalid || ''),
      exit: String(it.exitnumber || '').trim(), belt: String(it.carousel || '').trim(), gate: String(it.gatenumber || '').trim(),
      counter: String(it.chkinrange || '').trim(), airport: String(it.airport || ''), airportCode: String(it.airportCode || ''),
      airline: String(it.airline || ''), codeshare: String(it.codeshare || ''), master: String(it.masterflight || it.masterflightid || '').replace(/\s+/g, ''),
      fetchedAt: Utilities.formatDate(new Date(), 'Asia/Seoul', 'HH:mm') };
  }
  cache.put(ck, JSON.stringify(out), 300);
  return out;
}
/** MH38 → MH038 (API 표기) */
function fsPad_(f) { var m = String(f).match(/^([A-Z0-9]{2})(\d+)([A-Z]?)$/); if (!m) return f; var n = m[2]; while (n.length < 3) n = '0' + n; return m[1] + n + m[3]; }
function fsSame_(a, b) { a = String(a || '').replace(/\s+/g, '').toUpperCase(); b = String(b || '').replace(/\s+/g, '').toUpperCase(); var ma = a.match(/^([A-Z0-9]{2})0*(\d+)([A-Z]?)$/), mb = b.match(/^([A-Z0-9]{2})0*(\d+)([A-Z]?)$/); return !!(ma && mb && ma[1] === mb[1] && ma[2] === mb[2] && ma[3] === mb[3]); }
function fsHm_(h) { h = Math.max(0, Math.min(23, h)); return (h < 10 ? '0' : '') + h + '00'; }
function fsMs_(s) { return new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(8, 10), +s.slice(10, 12)).getTime(); }
/** 상태 분류: cancel / divert / delay(지연 분) / landed / departed / ontime */
function fsStatus_(remark, delayMin) {
  if (/결항|취소/.test(remark)) return 'cancel';
  if (/회항/.test(remark)) return 'divert';
  if (/도착/.test(remark)) return 'landed';
  if (/출발/.test(remark)) return 'departed';
  if (/지연/.test(remark) || (delayMin != null && delayMin >= 15)) return 'delay';
  return 'ontime';
}

/** 여러 편 한 번에: ?flights=MH38|20261104|A|2055~D7504|20261105|A|0620 (최대 6편) */
function flightStatusMany(spec) {
  return String(spec || '').split('~').filter(Boolean).slice(0, 6).map(function (x) { var a = x.split('|'); return flightStatus(a[0], a[1], a[2], a[3]); });
}
/** 편집기에서 직접 시험 */
function fsTest() { Logger.log(JSON.stringify(flightStatus('AK1624', Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd'), 'D'))); }

/** 지침서 JSON (A안, 2026-11-06): Google Drive 폴더 ATK_Vouchers 안의 <슬러그>.json (영문은 <슬러그>-EN.json, 없으면 한국어) → {ok, data}. 60초 캐시 */
function voucherJson_(slug, lang) {
  slug = String(slug || '').replace(/[^A-Za-z0-9_-]/g, '');
  if (!slug) return { ok: false, error: 'slug' };
  var name = slug + (String(lang || '') === 'en' ? '-EN' : '') + '.json';
  var cache = CacheService.getScriptCache(), ck = 'v:' + name, hit = cache.get(ck);
  if (hit) return { ok: true, data: JSON.parse(hit), cached: true };
  var fo = DriveApp.getFoldersByName('ATK_Vouchers'); if (!fo.hasNext()) return { ok: false, error: 'folder' };
  var folder = fo.next(), fs = folder.getFilesByName(name);
  if (!fs.hasNext() && name.indexOf('-EN.json') > 0) fs = folder.getFilesByName(slug + '.json');
  if (!fs.hasNext()) return { ok: false, error: 'not found' };
  var txt = fs.next().getBlob().getDataAsString('UTF-8');
  var data; try { data = JSON.parse(txt); } catch (err) { return { ok: false, error: 'json ' + err }; }
  if (txt.length < 90000) cache.put(ck, txt, 60);
  return { ok: true, data: data };
}
/** 디버그: ?dbg=YYYYMMDD&q=KUL&dir=A|D → 그날 편 중 공항코드/편명에 q 포함 (최대 40) */
function fsDbg_(date, q, dir) {
  var fn = String(dir || 'A').toUpperCase() === 'D' ? 'getPassengerDeparturesDeOdp' : 'getPassengerArrivalsDeOdp';
  var url = FS_BASE_ + fn + '?serviceKey=' + encodeURIComponent(fsKey_()) + '&type=json&pageNo=1&lang=K&numOfRows=2000&searchday=' + date;
  var body = UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getContentText();
  var j = JSON.parse(body); var items = (j.response && j.response.body && j.response.body.items) || [];
  var out = []; for (var i = 0; i < items.length; i++) { var it = items[i]; var s = (it.flightId || '') + ' ' + (it.airportCode || '') + ' ' + (it.airport || ''); if (s.indexOf(q) >= 0) out.push([it.flightId, it.airportCode, it.scheduleDateTime, it.estimatedDateTime, it.terminalid || it.terminalId, it.exitnumber || it.chkinrange, it.carousel || it.gatenumber, it.remark, it.codeshare].join('|')); }
  return { total: items.length, hits: out.slice(0, 40) };
}

/* ───────── 가이드 일정 변경 (2026-11-09) ───────── */
function chgGet_(slug) {
  slug = String(slug || '').replace(/[^A-Za-z0-9_-]/g, '');
  var t = PropertiesService.getScriptProperties().getProperty('chg:' + slug);
  if (!t) return null; try { return JSON.parse(t); } catch (e) { return null; }
}
function doPost(e) {
  var r;
  try {
    var b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (b.act === 'chg') r = chgSave_(b); else r = { ok: false, error: 'act' };
  } catch (err) { r = { ok: false, error: String(err) }; }
  return ContentService.createTextOutput(JSON.stringify(r)).setMimeType(ContentService.MimeType.JSON);
}
function chgSave_(b) {
  var slug = String(b.slug || '').replace(/[^A-Za-z0-9_-]/g, '');
  var vj = voucherJson_(slug, 'ko'); if (!vj.ok) return { ok: false, error: 'voucher' };
  var ph = String(((vj.data || {}).guide || {}).phone || '').replace(/\D/g, '');
  if (!ph || String(b.pin || '').replace(/\D/g, '') !== ph.slice(-4)) return { ok: false, error: 'pin' };
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var P = PropertiesService.getScriptProperties(), now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
    var ov = b.ov || null;
    if (ov) { ov.at = now; ov.by = String(((vj.data || {}).guide || {}).name || ''); var t = JSON.stringify(ov); if (t.length > 8500) return { ok: false, error: 'too big' }; P.setProperty('chg:' + slug, t); }
    else P.deleteProperty('chg:' + slug);
    var lines = (b.diff || []).map(String).slice(0, 30);
    var log = []; try { log = JSON.parse(P.getProperty('chglog') || '[]'); } catch (x) { }
    log.push({ at: now, slug: slug, trip: (vj.data || {}).tripId || '', by: ov ? ov.by : String(((vj.data || {}).guide || {}).name || ''), reset: !ov, diff: lines, warn: (b.warn || []).map(String).slice(0, 10), imp: !!b.imp });
    while (JSON.stringify(log).length > 8500 && log.length > 1) log.shift();
    P.setProperty('chglog', JSON.stringify(log));
    if (b.imp) chgTg_(log[log.length - 1]); // 텔레그램은 중요 변경(합동·비 예보 이동)만 — 대표 11/9 21:57
    return { ok: true, at: now };
  } finally { lock.releaseLock(); }
}
function chgTg_(x) {
  var P = PropertiesService.getScriptProperties(), tok = P.getProperty('TG_TOKEN'), chat = P.getProperty('TG_CHAT');
  if (!tok || !chat) return;
  var txt = '📅 지침서 일정 변경 ' + x.trip + ' — ' + x.by + ' (' + x.at + ')\n' + (x.reset ? '원래 일정으로 되돌림' : x.diff.join('\n')) + (x.warn.length ? '\n⚠️ ' + x.warn.join('\n⚠️ ') : '') + '\nhttps://arbatravelkorea.github.io/v/' + x.slug + '/';
  try { UrlFetchApp.fetch('https://api.telegram.org/bot' + tok + '/sendMessage', { method: 'post', payload: { chat_id: chat, text: txt.slice(0, 3900), disable_web_page_preview: 'true' }, muteHttpExceptions: true }); } catch (e) { }
}
/** 회사만: ?chglog=1&k=<스크립트 속성 CHGLOG_KEY>&since=yyyy-MM-dd HH:mm  (키는 chgInitKey 한 번 실행으로 만듦) */
function chgLog_(since, k) {
  var key = PropertiesService.getScriptProperties().getProperty('CHGLOG_KEY');
  if (!key || String(k || '') !== key) return { ok: false, error: 'auth' };
  var log = []; try { log = JSON.parse(PropertiesService.getScriptProperties().getProperty('chglog') || '[]'); } catch (x) { }
  if (since) log = log.filter(function (x) { return x.at > since; });
  return { ok: true, list: log };
}
function chgInitKey() { var P = PropertiesService.getScriptProperties(); if (!P.getProperty('CHGLOG_KEY')) P.setProperty('CHGLOG_KEY', Utilities.getUuid().replace(/-/g, '').slice(0, 16)); Logger.log('CHGLOG_KEY set'); }

/* ───────── 열람 기한 · 본인 기기 (2026-11-09 대표) ─────────
   열람 기한: 마지막 날 + 7일 지나면 내용 안 줌 (속성 'ext:<슬러그>' = yyyy-MM-dd 이면 그날까지 연장). 회사(st=CHGLOG_KEY)는 항상 열람
   본인 기기: 처음 연 기기(dv)를 본인으로 기억(속성 'dev:<슬러그>'). 다른 기기는 own:false → 진한 워터마크 + 처음 열릴 때 텔레그램 */
function vExpired_(slug, D) {
  var days = (D && D.days) || []; if (!days.length) return false;
  var P = PropertiesService.getScriptProperties(), ext = P.getProperty('ext:' + String(slug).replace(/[^A-Za-z0-9_-]/g, ''));
  var last = String(days[days.length - 1].d || ''); if (!/^\d{4}-\d{2}-\d{2}$/.test(last)) return false;
  var lim = new Date(last + 'T00:00:00+09:00'); lim.setDate(lim.getDate() + 8); // 마지막 날 + 7일 끝까지
  if (ext && /^\d{4}-\d{2}-\d{2}$/.test(ext)) { var e2 = new Date(ext + 'T00:00:00+09:00'); e2.setDate(e2.getDate() + 1); if (e2 > lim) lim = e2; }
  return new Date() >= lim;
}
function devCheck_(slug, dv, D) {
  slug = String(slug || '').replace(/[^A-Za-z0-9_-]/g, ''); dv = String(dv || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 24);
  if (!dv) return true;
  var lock = LockService.getScriptLock(); try { lock.waitLock(5000); } catch (e) { return true; }
  try {
    var P = PropertiesService.getScriptProperties(), list = []; try { list = JSON.parse(P.getProperty('dev:' + slug) || '[]'); } catch (x) { }
    if (!list.length) { P.setProperty('dev:' + slug, JSON.stringify([dv])); return true; }
    if (list[0] === dv) return true;
    if (list.indexOf(dv) < 0) {
      list.push(dv); if (list.length > 12) list = [list[0]].concat(list.slice(-11)); P.setProperty('dev:' + slug, JSON.stringify(list));
      var g = ((D || {}).guide || {}), now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'MM/dd HH:mm');
      chgTg_({ at: now, slug: slug, trip: (D || {}).tripId || '', by: (g.ko || g.name || ''), reset: false, diff: ['🔓 등록 안 된 기기에서 지침서가 열렸습니다 (' + (list.length - 1) + '번째 다른 기기) — 링크가 공유됐을 수 있어요'], warn: [] });
    }
    return false;
  } finally { lock.releaseLock(); }
}
