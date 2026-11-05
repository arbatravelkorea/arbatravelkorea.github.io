/* ARBA 투어지침서 렌더러 v2 (A안, 2026-11-06) — 내용 JSON은 Apps Script(ATK_FlightApi ?v=<슬러그>)가 Google Drive ATK_Vouchers/<슬러그>.json에서 내려줌.
   이 파일에는 손님·예약 정보가 없음. 사용: ATK.render('<슬러그>') */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbysvuoEsBZzKvuVvfSqg3P7rqQcaaLyUz1U-gwm11YwkIaC86-v5vQRE9Kb2WPoGvzfRA/exec';
  var WA_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.84 9.84 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.88-9.9 9.88m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/></svg>';
  var KA_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.31 4.66 6.73l-.98 3.67c-.09.33.29.6.57.4l4.2-2.86c.5.06 1.02.09 1.55.09 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>';
  var L_KO = { voucher: 'TOUR VOUCHER · 가이드용', guide: ' 가이드님', in: '입국', out: '출국', city: '도시', tl: '인솔자', none: '없음', links: '🔗 링크', flights: '✈️ 항공 · 실시간', hotel: '🏨 호텔', days: '📅 일정', memo: '📌 전체 메모 (투어 내내)', contacts: '☎️ 비상 연락처',
    sched: '예정', est: '변경', term: '터미널', exit: '출구', counter: '카운터', checking: '조회 중…', fsOnly: ' 공항은 FlightStats로 확인', track: '실시간 추적 (FlightStats)', notYet: '아직 공항 조회 전 (3일 전부터 조회됨)', liveFail: '실시간 조회 실패 — FlightStats로 확인', belt: '벨트 ', sign: '공항 피켓 보기/인쇄',
    status: { ontime: '정시', delay: '지연', landed: '도착함', departed: '출발함', cancel: '결항', divert: '회항' }, tba: '미정',
    booking: '예약번호', checkin: '체크인', checkout: '체크아웃', bf: '조식', rooms: '객실', pay: '결제', addr: '주소', tel: '전화', map: '📍 지도', call: '📞 전화', reserve: '예약', sms: '💬 문자', copy: '복사', copied: '복사됨', namelist: '📋 명단(룸리스트) 보기', nonamelist: '📋 명단 — 아직 없음 (받는 대로 여기에)',
    today: '오늘', meal: ['아침', '점심', '저녁'], free: '손님 자유', pray: '오늘 기도', after: ' 이후', before: ' 전에', left: '해 지기까지 ', h: '시간 ', m: '분', sunset: '해 졌음 → Maghrib+Isha', draft: '초안 · 확정 전', waBtn: 'WhatsApp', halal: '할랄&무슬림 프렌들리 식당 리스트', season: '시즌 추천 · 지금 가볼 만한 곳', settle: '정산하기 · 정산하는 법', kakao: '아르바트래블 비즈카톡', greet: '손님께 첫 인사 복사', copiedGreet: '복사됨 — 왓츠앱 단톡방에 붙여넣기', greetHint: '① WhatsApp 버튼으로 단톡방에 들어간 뒤 → ② 첫 인사 버튼을 눌러 복사하고 단톡방에 붙여넣기 하세요. 내용은 고쳐서 보내셔도 됩니다.',
    foot: 'ARBA Travel Korea · 지침서 내용은 바뀔 수 있으니 투어 전날 다시 열어 확인해주세요.' };
  var L_EN = { voucher: 'TOUR VOUCHER · FOR GUIDE', guide: '', in: 'Arrival', out: 'Departure', city: 'City', tl: 'Tour leader', none: 'None', links: '🔗 LINKS', flights: '✈️ FLIGHTS · LIVE', hotel: '🏨 HOTEL', days: '📅 ITINERARY', memo: '📌 NOTES FOR THE WHOLE TOUR', contacts: '☎️ EMERGENCY CONTACT',
    sched: 'Sched.', est: 'Est.', term: 'Terminal', exit: 'Exit', counter: 'Counter', checking: 'Checking…', fsOnly: ' airport: check on FlightStats', track: 'Live tracking (FlightStats)', notYet: 'Not in the airport system yet (opens 3 days before)', liveFail: 'Live lookup unavailable — use FlightStats', belt: 'belt ', sign: 'Airport sign — view / print',
    status: { ontime: 'On time', delay: 'Delayed', landed: 'Landed', departed: 'Departed', cancel: 'Cancelled', divert: 'Diverted' }, tba: 'TBA',
    booking: 'Booking no.', checkin: 'Check-in', checkout: 'Check-out', bf: 'Breakfast', rooms: 'Rooms', pay: 'Payment', addr: 'Address', tel: 'Phone', map: '📍 Map', call: '📞 Call', reserve: 'Book', sms: '💬 SMS', copy: 'Copy', copied: 'Copied', namelist: '📋 Name list (rooming list)', nonamelist: '📋 Name list — not yet',
    today: 'TODAY', meal: ['Breakfast', 'Lunch', 'Dinner'], free: 'own arrangement', pray: 'Prayer today', after: ' onwards', before: ' before', left: 'Sunset in ', h: 'h ', m: 'min', sunset: 'Sun has set → Maghrib+Isha', draft: 'DRAFT · not final', waBtn: 'WhatsApp', halal: 'Halal & Muslim-friendly restaurants', season: 'Seasonal picks on our route', settle: 'Settle expenses · how to', kakao: 'ARBA Travel on KakaoTalk', greet: 'Copy first greeting', copiedGreet: 'Copied — paste it in the WhatsApp group', greetHint: '① Join the group with WhatsApp → ② tap the greeting button to copy, then paste it in the group. Feel free to edit it.',
    foot: 'ARBA Travel Korea · Details can change — please reopen this page the day before the tour.' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function num(p) { return esc(String(p || '').replace(/[^\d+]/g, '')); }
  function cpBtn(v) { return '<button type="button" class="cp" data-copy="' + esc(v) + '">' + L.copy + '</button>'; }
  function tel(p) { return p ? '<a href="tel:' + num(p) + '">' + esc(p) + '</a> ' + cpBtn(p) : ''; }
  // 담당자·전화·문자 묶음: {contact:'박현성', phone:'010-…', sms:true, note:'문자 예약'}
  // 식당 등: 전화·문자 옆에 네이버 지도 아이콘(place 또는 "점심/저녁 — 식당명"에서 자동) — 지도가 없으면 [복사]
  function placeOf(c) { if (c.place) return c.place; var t = String(c.text || ''); if (/불포함|할랄 식당|자유|Not included|own expense|free time|halal restaurant/i.test(t)) return ''; var m = t.match(/^(?:점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]?\s*([^(—–\-·]+)/); return m ? m[1].trim() : ''; }
  // 할랄 리스트에 있는 식당이면 리스트의 정확한 네이버지도 링크 (이름 앞부분 일치: "고삼이 신촌점", "EID (이태원)…" → "EID 할랄 코리안푸드")
  function halalLink(pl) { var H = window.HALAL_LINKS || {}; if (!pl) return ''; var k = pl.replace(/\s*\(.*$/, '').replace(/\s+/g, ' ').trim().toLowerCase(); var best = ''; Object.keys(H).forEach(function (n) { var nn = n.toLowerCase(); if (nn === k || nn.indexOf(k) === 0 || k.indexOf(nn) === 0) { if (!best || n.length > best.length) best = n; } }); if (!best) Object.keys(H).forEach(function (n) { var w = n.toLowerCase().split(' ')[0]; if (w.length >= 2 && k.indexOf(w) === 0 && !best) best = n; }); return best ? H[best] : ''; }
  function who(c) {
    if (!c) return '';
    var pl = c.nomap ? '' : placeOf(c), mp = c.map || halalLink(pl);
    if (!c.phone) { if (c.nomap || !(c.map || (pl && /^(점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]/.test(c.text || '')))) return ''; return '<span class="who"><a class="mini nm" target="_blank" rel="noopener" href="' + esc(mp || ('https://map.naver.com/p/search/' + encodeURIComponent(pl))) + '"><img src="/img/naver_map.png" alt="' + L.map + '"></a>' + (c.note ? ' <span class="x">' + esc(c.note).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</span>' : '') + '</span>'; }
    return '<span class="who">' + (c.contact ? esc(c.contact) + ' ' : '') + '<a class="mini" href="tel:' + num(c.phone) + '">' + ((c.callLabel || (/^(점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]/.test(c.text || '') ? L.reserve : '')) ? '📞 ' + esc(c.callLabel || L.reserve) : L.call) + '</a>' + (c.sms ? '<a class="mini" href="sms:' + num(c.phone) + '">' + L.sms + '</a>' : '') +
      ((pl || mp) ? '<a class="mini nm" target="_blank" rel="noopener" href="' + esc(mp || ('https://map.naver.com/p/search/' + encodeURIComponent(pl))) + '"><img src="/img/naver_map.png" alt="' + L.map + '"></a>' : (c.nomap ? '' : cpBtn(c.phone))) + (c.note ? ' <span class="x">' + esc(c.note).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</span>' : '') + '</span>';
  }

  // 손님 첫 인사 (영어) — 대표 확정 템플릿 (claude/tour_voucher/가이드_왓츠앱_자기소개_템플릿.md 2026-11-06). WhatsApp wa.me/?text= 로 자동 입력
  var WX_LO = { SEL: [-6, -4, 1, 7, 12, 18, 23, 24, 18, 10, 3, -3], JJU: [2, 2, 6, 10, 15, 19, 24, 25, 21, 15, 9, 4], BUS: [-1, 1, 5, 10, 15, 19, 23, 25, 20, 14, 8, 2] };
  var WX_HI = { SEL: [2, 5, 11, 18, 23, 27, 30, 31, 27, 20, 12, 5], JJU: [9, 10, 13, 18, 22, 25, 29, 31, 27, 22, 16, 11], BUS: [8, 10, 13, 18, 22, 24, 28, 30, 26, 22, 15, 10] };
  var FRUIT = ['🍓🍊 strawberries & Jeju tangerines (gyul)', '🍓🍊 strawberries & Hallabong oranges', '🍓🍊 strawberries & Cheonhyehyang oranges', '🍓🍈 strawberries & Korean melon (chamoe, early)', '🍈🍅 Korean melon (chamoe) & cherry tomatoes', '🍈🍉 Korean melon & watermelon', '🍉🍑 watermelon & peaches', '🍑🍇 peaches & grapes', '🍇🍐 Shine Muscat grapes & Korean pears', '🍎🍐 apples & Korean pears', '🍎🟠 apples & persimmons', '🍊🍓 Jeju tangerines & strawberries'];
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WXR = null; // 투어 기간 실제 예보 {lo,hi} (Open-Meteo 받으면 채움)
  function greet(D) {
    if (D.greeting) return D.greeting;
    var g = D.guide || {}, name = g.eng || g.name || '', G = D.greet || {}, loc = D.loc || 'SEL';
    var ds = (D.days || []).map(function (d) { return d.d; }).filter(Boolean), d0 = ds[0] || '', d1 = ds[ds.length - 1] || d0;
    var m0 = +d0.slice(5, 7) || 11, m1 = +d1.slice(5, 7) || m0, y = d0.slice(0, 4);
    var per = m0 === m1 ? (+d0.slice(8)) + '–' + (+d1.slice(8)) + ' ' + MON[m0 - 1] + ' ' + y : (+d0.slice(8)) + ' ' + MON[m0 - 1] + '–' + (+d1.slice(8)) + ' ' + MON[m1 - 1] + ' ' + y;
    var lo = WXR ? WXR.lo : (WX_LO[loc] || WX_LO.SEL)[m0 - 1], hi = WXR ? WXR.hi : (WX_HI[loc] || WX_HI.SEL)[m0 - 1];
    var wl = lo < 0 ? 'very cold, below 0°C at night. Please bring a thick winter coat, gloves and a scarf.' : lo <= 5 ? 'cold in the morning and evening. A warm jacket and layers are recommended.' : hi >= 28 ? 'hot and humid. Light clothes, a hat and sunscreen are recommended.' : lo >= 15 ? 'pleasant but cooler at night. A light jacket is enough.' : 'cool, especially in the morning and evening. A jacket and layers are recommended.';
    if (m0 >= 7 && m0 <= 9) wl += ' Rain is likely — please bring a small umbrella.';
    var exp = G.exp === 'new' ? "I'm really looking forward to meeting you all and making this a comfortable, memorable trip." : G.exp === 'before' ? "I've guided Muslim groups with ARBA before, so you're in good hands." : "I've guided many Muslim groups with ARBA, so you're in good hands.";
    var taxi = G.taxi != null ? G.taxi : /\/JT\//.test(D.tripId || '');
    var ap = loc === 'JJU' ? 'Jeju Airport' : loc === 'BUS' ? 'Gimhae Airport' : 'Incheon Airport';
    var tips = ["🗺️ Use Naver Map instead of Google Maps — it's much more accurate in Korea."];
    if (lo < 0) tips.push('🔥 Hand warmers (hot packs) are sold at convenience stores — very useful on freezing days!');
    if (taxi) tips.push('🚕 For taxis, please use the Kakao T app.');
    tips.push("🛂 With K-ETA, you don't need the Arrival Card. Keep your passport handy.");
    return 'Hi everyone! 😊\nI\'m ' + name + ', your tour guide in Korea for ' + per + '. Thank you for choosing ARBA Travel!\n\n' + exp + '\n\n' +
      '🍽️ All meals are Halal — please tell me about any allergies in advance.\n🕌 I\'ll arrange suitable places for prayer during the trip.\n' +
      '🧥 Weather: ' + lo + '–' + hi + '°C, ' + wl + '\n' + FRUIT[m0 - 1].split(' ')[0] + ' Seasonal fruit now: ' + FRUIT[m0 - 1].split(' ').slice(1).join(' ') + " — I'll stop by a fruit shop if you're interested!\n\n" +
      'Useful tips:\n' + tips.join('\n') + '\n\n' +
      "✈️ I'll meet you at the " + ap + ' arrival exit with an ARBA Travel sign.\n\n' +
      'Feel free to message me here anytime. See you soon in Korea! 🇰🇷\n— ' + name;
  }
  // 날씨 (Open-Meteo, 키 없음, 16일 예보) — WMO 코드 → 이모지
  function wxIcon(c) { c = +c; if (c === 0) return '☀️'; if (c <= 2) return '🌤'; if (c === 3) return '☁️'; if (c <= 49) return '🌫'; if (c <= 57) return '🌦'; if (c <= 67) return '🌧'; if (c <= 77) return '🌨'; if (c <= 82) return '🌧'; if (c <= 86) return '🌨'; return '⛈'; }
  function weather(loc) {
    var ll = (window.PRAYER_LOC || {})[loc] || (window.PRAYER_LOC || {}).SEL || [37.57, 126.98];
    var u = 'https://api.open-meteo.com/v1/forecast?latitude=' + ll[0] + '&longitude=' + ll[1] + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FSeoul&forecast_days=16';
    return fetch(u).then(function (r) { return r.json(); }).then(function (j) {
      var d = j.daily || {}, out = {}; (d.time || []).forEach(function (t, i) { out[t] = { c: d.weather_code[i], hi: Math.round(d.temperature_2m_max[i]), lo: Math.round(d.temperature_2m_min[i]), mm: Math.round((d.precipitation_sum[i] || 0) * 10) / 10, pp: d.precipitation_probability_max[i] }; });
      return out;
    }).catch(function () { return {}; });
  }
  var L = L_KO, EN = false, SLUG = '', CUR = {};

  function render(slug) {
    SLUG = slug;
    var P = new URLSearchParams(location.search); EN = P.get('lang') === 'en'; L = EN ? L_EN : L_KO;
    document.documentElement.lang = EN ? 'en' : 'ko';
    var app = document.getElementById('app'); app.innerHTML = '<p class="loading">' + (EN ? 'Loading…' : '지침서를 여는 중…') + '</p>';
    fetch(API + '?v=' + encodeURIComponent(slug) + (EN ? '&lang=en' : '')).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.ok || !j.data) { app.innerHTML = '<p class="loading">' + (EN ? 'Voucher not found.' : '지침서를 찾을 수 없습니다. 회사로 연락해주세요.') + '</p>'; return; }
      draw(j.data);
    }).catch(function () { app.innerHTML = '<p class="loading">' + (EN ? 'Could not load. Please try again.' : '불러오지 못했습니다. 다시 열어주세요.') + '</p>'; });
  }

  function draw(D) {
    CUR = D; var h = '';
    var alt = EN ? '?lang=ko' : '?lang=en';
    h += '<header>' + (D.draft ? '<span class="draft">' + L.draft + '</span>' : '') + '<a class="lang" href="' + alt + '">' + (EN ? '한국어' : 'English') + '</a><div class="t">ARBA TRAVEL KOREA · ' + L.voucher + '</div><h1>' + esc(D.tripId) + '</h1><div class="m">' + esc(D.title) + '</div></header>';
    // 가이드 카드
    var g = D.guide || {}, px = D.pax || {};
    h += '<div class="card gd"><b class="gn">' + esc(g.name) + L.guide + (g.eng ? ' <span style="font-size:14px;color:var(--mut)">(' + esc(g.eng) + ')</span>' : '') + '</b>' +
      '<div class="kv2"><div><small>' + L.in + '</small>' + esc(D.arrival) + '</div><div><small>' + L.out + '</small>' + esc(D.departure) + '</div><div><small>' + L.city + '</small>' + esc(D.dest) + '</div><div><small>' + L.tl + '</small><b>' + esc(D.tlName || L.none) + '</b></div></div>' +
      '<div class="pax"><div><small>TL</small><b>' + (px.tl || 0) + '</b></div><div><small>Adult</small><b>' + (px.adult || 0) + '</b></div><div><small>Child<br>w bed</small><b>' + (px.cwb || 0) + '</b></div><div><small>Child<br>w/o bed</small><b>' + (px.cnb || 0) + '</b></div><div><small>Infant</small><b>' + (px.inf || 0) + '</b></div><div class="tot"><small>Total</small><b>' + (px.total || 0) + '</b></div></div>' +
      (D.chips && D.chips.length ? '<div style="margin-top:12px">' + D.chips.map(function (c) { return '<span class="hon' + (c.amber ? ' amber' : '') + '">' + esc(c.text || c) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    // 링크: 왓츠앱(왼쪽 위) 할랄(오른쪽 위) 시즌(왼쪽 아래) 정산(오른쪽 아래)
    var K = D.links || {};
    // 2026-11-06 대표: 버튼 5개를 한 격자(투어 전 → 투어 중 → 투어 후 순)로, 설명은 격자 아래 한 번만
    h += '<h2>' + L.links + '</h2><div class="linkgrid">' +
      (K.wa ? '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(K.wa) + '">' + WA_SVG + '① ' + L.waBtn + '</a>' : '<span class="btn wa dis">' + WA_SVG + L.waBtn + ' (' + L.tba + ')</span>') +
      '<button type="button" class="btn wa greet cp" data-label="💬 ② ' + esc(L.greet) + '" data-copy="' + esc(greet(D)) + '">💬 ② ' + L.greet + '</button>' +
      (K.season ? '<a class="btn season" target="_blank" rel="noopener" href="' + esc(K.season) + '">🌸 ' + L.season + '</a>' : '') +
      (K.halal ? '<a class="btn halal' + (K.season ? '' : ' wide2') + '" target="_blank" rel="noopener" href="' + esc(K.halal) + '">🕌 ' + L.halal + '</a>' : '') +
      (K.settle ? '<a class="btn red wide2" target="_blank" rel="noopener" href="' + esc(K.settle) + '">🧾 ' + L.settle + '</a>' : '') + '</div>' +
      '<p class="hint linkhint">' + (K.hint ? esc(K.hint) + '<br>' : '') + L.greetHint + '</p>';
    // 항공
    h += '<h2>' + L.flights + '</h2>';
    (D.flights || []).forEach(function (f) {
      var icn = f.ap === 'ICN', m = (f.no || '').match(/^([A-Z0-9]{2})(\d+)/i), ymd = (f.date || '').split('-');
      var fs = m ? 'https://www.flightstats.com/v2/flight-tracker/' + m[1] + '/' + m[2] + '?year=' + ymd[0] + '&month=' + (+ymd[1]) + '&date=' + (+ymd[2]) : '';
      h += '<div class="card"><div class="fl"><b>' + esc(f.no) + '</b><span class="dir">' + (f.dir === 'A' ? L.in : L.out) + ' · ' + esc(f.ap) + '</span><div class="when">' + esc(f.when) + '</div>' + (f.sub ? '<div class="sub">' + esc(f.sub) + '</div>' : '') + '</div>' +
        (f.pnr ? '<p class="pnr">PNR <b>' + esc(f.pnr) + '</b>' + cpBtn(f.pnr) + (f.airline ? ' · ' + esc(f.airline) : '') + '</p>' : '') +
        (icn ? '<div class="live" data-f="' + esc(f.no + '|' + (f.date || '').replace(/-/g, '') + '|' + f.dir + '|' + (f.time || '').replace(':', '')) + '"><div><small>' + L.sched + '</small><span>' + esc(f.time) + '</span></div><div><small>' + L.est + '</small><span class="est">—</span></div><div><small>' + L.term + '</small><span class="term">' + esc(f.term || '—') + '</span></div><div><small>' + (f.dir === 'A' ? L.exit : L.counter) + '</small><span class="exit">—</span></div></div><span class="st na">' + L.checking + '</span>' : '<span class="st na">' + esc(f.ap) + L.fsOnly + '</span>') +
        (f.note ? '<p class="hint" style="margin-top:8px">' + esc(f.note) + '</p>' : '') +
        (fs ? '<a class="lnk" target="_blank" rel="noopener" href="' + esc(fs) + '">' + L.track + '</a>' : '') + (f.dir === 'A' && K.sign ? '<a class="lnk" target="_blank" rel="noopener" href="' + esc(K.sign) + '">🪧 ' + L.sign + '</a>' : '') + '</div>';
    });
    // 호텔 (체크인 순서대로 카드 여러 장)
    if (D.hotels && D.hotels.length) {
      h += '<h2>' + L.hotel + '</h2>';
      D.hotels.forEach(function (ht) {
        h += '<div class="card ht"><b class="n">' + esc(ht.name) + '</b>' + (ht.en ? '<span class="en">' + esc(ht.en) + '</span>' : '') + '<dl class="kv">' +
          (ht.booking ? '<dt>' + L.booking + '</dt><dd><b>' + esc(ht.booking) + '</b> ' + cpBtn(ht.booking) + '</dd>' : '') +
          (ht.checkin ? '<dt>' + L.checkin + '</dt><dd>' + esc(ht.checkin) + '</dd>' : '') + (ht.checkout ? '<dt>' + L.checkout + '</dt><dd>' + esc(ht.checkout) + '</dd>' : '') +
          (ht.breakfast ? '<dt>' + L.bf + '</dt><dd>' + esc(ht.breakfast) + '</dd>' : '') + (ht.rooms ? '<dt>' + L.rooms + '</dt><dd>' + nl(ht.rooms) + '</dd>' : '') + (ht.pay ? '<dt>' + L.pay + '</dt><dd>' + esc(ht.pay) + '</dd>' : '') +
          (ht.address ? '<dt>' + L.addr + '</dt><dd>' + esc(ht.address) + ' ' + cpBtn(ht.address) + '</dd>' : '') + (ht.phone ? '<dt>' + L.tel + '</dt><dd>' + tel(ht.phone) + '</dd>' : '') +
          (ht.notes || []).map(function (n) { return '<dt>·</dt><dd>' + esc(n) + '</dd>'; }).join('') + '</dl>' +
          (K.namelist ? '<a class="btn wide" target="_blank" rel="noopener" href="' + esc(K.namelist) + '">' + L.namelist + '</a>' : '<span class="btn wide dis">' + L.nonamelist + '</span>') +
          (D.honorific ? '<p class="hint" style="margin:6px 2px 4px">👑 ' + esc(D.honorific) + '</p>' : '') +
          ((ht.map || ht.phone) ? '<div class="btnrow" style="margin-top:8px">' + (ht.map ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(ht.map) + '"><img class="nmap" src="/img/naver_map.png" alt="' + L.map + '"></a>' : '') + (ht.phone ? '<a class="btn" href="tel:' + num(ht.phone) + '">' + L.call + '</a>' : '') + '</div>' : '') + '</div>';
      });
    }
    // 날짜 카드
    h += '<h2>' + L.days + '</h2>';
    (D.days || []).forEach(function (d, di) {
      var meals = d.meals || {};
      function mealSpan(i, key) { var mm = meals[key]; if (!mm) return '<span class="no">' + L.meal[i] + '</span>'; if (mm.ok === false) return '<span class="no">' + L.meal[i] + (mm.txt ? ' — ' + esc(mm.txt) : ' — ' + L.free) + '</span>'; return '<span class="' + (mm.alt ? 'alt' : '') + '">' + L.meal[i] + (mm.txt ? ' ' + esc(mm.txt) : '') + '</span>'; }
      h += '<details class="day" data-d="' + esc(d.d) + '" data-loc="' + esc(d.loc || D.loc || 'SEL') + '"><summary><span class="d" data-today="' + L.today + '">' + esc(d.label) + '</span><span class="s">' + esc(d.summary) + '</span><span class="ar">▶</span></summary><div class="body">' +
        '<ul class="tl">' + (d.items || []).map(function (it) { return '<li><span class="tm">' + esc(it.tm || '') + '</span><span>' + esc(it.text) + who(it) + (it.x ? '<span class="x">' + nl(it.x).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</span>' : '') + '</span></li>'; }).join('') + '</ul>' +
        '<div class="row"><span class="i">🍽</span><div class="meal">' + mealSpan(0, 'b') + mealSpan(1, 'l') + mealSpan(2, 'd') + '</div></div>' +
        (d.move ? '<div class="row"><span class="i">🚐</span><div>' + esc(d.move) + who(d.moveWho) + (d.moveSub ? '<br><span class="x">' + esc(d.moveSub) + '</span>' : '') + '</div></div>' : '') +
        (d.stay ? '<div class="row"><span class="i">🏨</span><div>' + esc(d.stay) + '</div></div>' : '') +
        (d.todo && d.todo.length ? '<div class="row"><span class="i">✅</span><ul class="todo">' + d.todo.map(function (t, ti) { return '<li data-k="' + esc(d.d + ':' + ti) + '"><label><input type="checkbox"> <span>' + esc(t) + '</span></label></li>'; }).join('') + '</ul></div>' : '') +
        (d.notes && d.notes.length ? '<div class="row"><span class="i">📝</span><div>' + d.notes.map(function (n) { return '<div style="margin-bottom:4px">' + esc(n) + '</div>'; }).join('') + '</div></div>' : '') +
        (d.warn ? '<div class="warn">' + esc(d.warn) + '</div>' : '') +
        (d.chips && d.chips.length ? '<div class="chips">' + d.chips.map(function (c) { return '<span' + (c.s ? ' class="s"' : '') + '>' + esc(c.text || c) + '</span>'; }).join('') + '</div>' : '') +
        (d.pray !== false ? '<div class="pray" data-pray="' + esc(d.d) + '" data-loc="' + esc(d.loc || D.loc || 'SEL') + '"><span class="i">☪️</span><div><b>' + L.pray + '</b> <span class="cd" data-cd></span><div class="tm" data-tm></div>' + (d.prayPlace ? esc(d.prayPlace) : '') + '</div></div>' : '') +
        '</div></details>';
    });
    // 전체 메모
    if (D.memo && D.memo.length) h += '<h2>' + L.memo + '</h2><div class="card"><ul class="memo">' + D.memo.map(function (m) { return '<li>' + esc(m).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</li>'; }).join('') + '</ul></div>';
    // 비상 연락처: 회사 전화 + 비즈카톡
    var C = D.company || {};
    h += '<h2>' + L.contacts + '</h2><div class="card tel"><b>' + esc(C.name || 'ARBA Travel Korea') + '</b>' + (C.phone ? '<br>' + tel(C.phone) : '') +
      (C.kakao ? '<a class="btn kakao" target="_blank" rel="noopener" href="' + esc(C.kakao) + '">' + KA_SVG + L.kakao + '</a>' : '') + '</div>';
    h += '<p class="foot">' + L.foot + (D.issued ? ' · ' + esc(D.issued) : '') + '</p>';
    document.getElementById('app').innerHTML = h;
    document.title = esc(D.tripId) + ' — ' + (EN ? 'Tour Voucher' : '투어지침서');
    afterDraw();
  }

  function afterDraw() {
    var n = new Date(), ymd = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
    var P = new URLSearchParams(location.search); if (P.get('today')) ymd = P.get('today');
    var days = [].slice.call(document.querySelectorAll('.day')), hit = null;
    days.forEach(function (d) { if (d.dataset.d === ymd) { d.open = true; d.classList.add('today'); hit = d; } });
    if (!hit && days.length) { var up = days.filter(function (d) { return d.dataset.d >= ymd; })[0] || days[0]; up.open = true; }
    else if (hit) setTimeout(function () { hit.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    // 날씨 (지역별 1회 조회) — 날짜 옆에 아이콘·기온·강수
    var locs = {}; days.forEach(function (d) { var p = d.querySelector('.pray'); locs[(p && p.dataset.loc) || d.dataset.loc || 'SEL'] = 1; });
    Object.keys(locs).forEach(function (loc) { weather(loc).then(function (W) { if (loc === (CUR.loc || 'SEL')) { var los = [], his = []; days.forEach(function (d) { var w = W[d.dataset.d]; if (w) { los.push(w.lo); his.push(w.hi); } }); if (los.length) { WXR = { lo: Math.min.apply(null, los), hi: Math.max.apply(null, his) }; var gb = document.querySelector('.btn.greet'); if (gb) gb.dataset.copy = greet(CUR); } } days.forEach(function (d) { var p = d.querySelector('.pray'); var l = (p && p.dataset.loc) || d.dataset.loc || 'SEL'; if (l !== loc) return; var w = W[d.dataset.d]; if (!w) return; var el = d.querySelector('summary .d'); if (!el || el.querySelector('.wx')) return; var sp = document.createElement('span'); sp.className = 'wx'; sp.textContent = wxIcon(w.c) + ' ' + w.lo + '°/' + w.hi + '°' + (w.mm > 0 ? ' · ' + w.mm + 'mm' : (w.pp >= 40 ? ' · ' + (EN ? 'rain ' : '비 ') + w.pp + '%' : '')); el.appendChild(sp); }); }); });
    // 할 일 체크 — 이 휴대폰에 저장 (다시 열어도 유지)
    document.querySelectorAll('.todo li[data-k]').forEach(function (li) {
      var key = 'atk:' + SLUG + ':' + li.dataset.k, cb = li.querySelector('input');
      try { if (localStorage.getItem(key) === '1') { cb.checked = true; li.classList.add('done'); } } catch (e) { }
      cb.addEventListener('change', function () { li.classList.toggle('done', cb.checked); try { localStorage.setItem(key, cb.checked ? '1' : '0'); } catch (e) { } });
    });
    // 기도 시간
    if (window.prayerTimes) document.querySelectorAll('.pray[data-pray]').forEach(function (p) {
      var loc = PRAYER_LOC[p.dataset.loc] || PRAYER_LOC.SEL, t = prayerTimes(loc[0], loc[1], p.dataset.pray);
      p.querySelector('[data-tm]').innerHTML = '<span class="ok">✅ Dhuhr ' + t.dhuhr + L.after + '</span><span class="dl">⛔ Maghrib ' + t.maghrib + L.before + '</span>';
      if (p.dataset.pray === ymd) { var cd = p.querySelector('[data-cd]'); var tick = function () { var now = new Date(); var left = (+t.maghrib.slice(0, 2)) * 60 + (+t.maghrib.slice(3)) - (now.getHours() * 60 + now.getMinutes()); cd.textContent = left > 0 ? '· ' + L.left + Math.floor(left / 60) + L.h + (left % 60) + L.m : '· ' + L.sunset; }; tick(); setInterval(tick, 30000); }
    });
    // 복사
    function copyText(v) { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(v); return new Promise(function (res, rej) { var t = document.createElement('textarea'); t.value = v; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } document.body.removeChild(t); }); }
    document.addEventListener('click', function (ev) { var b = ev.target.closest('.cp'); if (!b) return; ev.preventDefault(); var lab = b.dataset.label || L.copy; copyText(b.dataset.copy).then(function () { b.textContent = b.dataset.label ? '✅ ' + L.copiedGreet : L.copied; setTimeout(function () { b.textContent = lab; }, 2500); }).catch(function () { }); });
    // 항공 실시간
    var LV = [].slice.call(document.querySelectorAll('.live[data-f]')); if (!LV.length) return;
    function go() {
      fetch(API + '?flights=' + encodeURIComponent(LV.map(function (x) { return x.dataset.f; }).join('~'))).then(function (r) { return r.json(); }).then(function (j) {
        (j.list || []).forEach(function (d, i) {
          var el = LV[i]; if (!el) return; var st = el.parentNode.querySelector('.st');
          if (!d.ok || !d.found) { st.className = 'st na'; st.textContent = L.notYet; return; }
          el.querySelector('.est').textContent = d.estimated && d.estimated !== d.scheduled ? d.estimated : (d.estimated ? '=' : '—');
          if (d.terminal) el.querySelector('.term').textContent = d.terminal === '탑승동' ? (EN ? 'T1 (Concourse)' : 'T1 (탑승동)') : d.terminal;
          el.querySelector('.exit').textContent = (d.dir === 'A' ? d.exit : d.counter) || L.tba;
          var txt = L.status[d.status] || d.status;
          if (d.status === 'delay' && d.delayMin > 0) txt += ' ' + (d.delayMin >= 60 ? Math.floor(d.delayMin / 60) + L.h : '') + (d.delayMin % 60) + L.m;
          if (d.belt) txt += ' · ' + L.belt + d.belt;
          txt += ' · ' + d.fetchedAt; st.className = 'st ' + d.status; st.textContent = txt;
        });
      }).catch(function () { LV.forEach(function (el) { var st = el.parentNode.querySelector('.st'); st.className = 'st na'; st.textContent = L.liveFail; }); });
    }
    go(); setInterval(go, 60000);
  }
  window.ATK = { render: render };
})();
