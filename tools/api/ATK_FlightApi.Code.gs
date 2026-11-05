/**
 * ATK_FlightApi — 인천공항공사 여객기 운항 현황(StatusOfPassengerFlightsDeOdp) 조회 전용 (2026-11-05)
 * 이 프로젝트는 읽기 전용 조회만 함 (시트·텔레그램 없음) → 웹앱을 '모든 사용자'로 배포해 지침서 항공 칸이 호출
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
