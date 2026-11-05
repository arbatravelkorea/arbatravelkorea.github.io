/* ARBA 투어지침서 렌더러 (A안, 2026-11-06) — 내용 JSON은 Apps Script(ATK_FlightApi ?v=<슬러그>)가 Google Drive ATK_Vouchers/<슬러그>.json에서 내려줌.
   이 파일에는 손님·예약 정보가 없음. 사용: ATK.render('<슬러그>') */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbysvuoEsBZzKvuVvfSqg3P7rqQcaaLyUz1U-gwm11YwkIaC86-v5vQRE9Kb2WPoGvzfRA/exec';
  var L_KO = { voucher: 'TOUR VOUCHER · 가이드용', guide: ' 가이드님', in: '입국', out: '출국', city: '도시', tl: '인솔자', none: '없음', links: '🔗 링크', flights: '✈️ 항공 · 실시간', hotel: '🏨 호텔', days: '📅 일정 · 하루 한 장', memo: '📌 전체 메모 (투어 내내)', contacts: '☎️ 연락처',
    sched: '예정', est: '변경', term: '터미널', exit: '출구', counter: '카운터', checking: '조회 중…', fsOnly: ' 공항은 FlightStats로 확인', track: '실시간 추적 (FlightStats)', notYet: '아직 공항 조회 전 (3일 전부터 조회됨)', liveFail: '실시간 조회 실패 — FlightStats로 확인', belt: '벨트 ',
    status: { ontime: '정시', delay: '지연', landed: '도착함', departed: '출발함', cancel: '결항', divert: '회항' }, tba: '미정',
    booking: '예약번호', bf: '조식', rooms: '객실', pay: '결제', addr: '주소', tel: '전화', map: '📍 지도', call: '📞 전화', copy: '복사', copied: '복사됨',
    today: '오늘', meal: ['아침', '점심', '저녁'], free: '손님 자유', todo: '오늘 할 일', pray: '오늘 기도', before: ' 전에', left: '해 지기까지 ', h: '시간 ', m: '분', sunset: '해 졌음 → Maghrib+Isha', nights: '박', draft: '초안 · 확정 전', edPreview: '',
    foot: 'ARBA Travel Korea · 지침서 내용은 바뀔 수 있으니 투어 전날 다시 열어 확인해주세요.' };
  var L_EN = { voucher: 'TOUR VOUCHER · FOR GUIDE', guide: '', in: 'Arrival', out: 'Departure', city: 'City', tl: 'Tour leader', none: 'None', links: '🔗 LINKS', flights: '✈️ FLIGHTS · LIVE', hotel: '🏨 HOTEL', days: '📅 ITINERARY · ONE CARD A DAY', memo: '📌 NOTES FOR THE WHOLE TOUR', contacts: '☎️ CONTACTS',
    sched: 'Sched.', est: 'Est.', term: 'Terminal', exit: 'Exit', counter: 'Counter', checking: 'Checking…', fsOnly: ' airport: check on FlightStats', track: 'Live tracking (FlightStats)', notYet: 'Not in the airport system yet (opens 3 days before)', liveFail: 'Live lookup unavailable — use FlightStats', belt: 'belt ',
    status: { ontime: 'On time', delay: 'Delayed', landed: 'Landed', departed: 'Departed', cancel: 'Cancelled', divert: 'Diverted' }, tba: 'TBA',
    booking: 'Booking no.', bf: 'Breakfast', rooms: 'Rooms', pay: 'Payment', addr: 'Address', tel: 'Phone', map: '📍 Map', call: '📞 Call', copy: 'Copy', copied: 'Copied',
    today: 'TODAY', meal: ['Breakfast', 'Lunch', 'Dinner'], free: 'own arrangement', todo: 'To do today', pray: 'Prayer today', before: ' before', left: 'Sunset in ', h: 'h ', m: 'min', sunset: 'Sun has set → Maghrib+Isha', nights: ' nights', draft: 'DRAFT · not final', edPreview: '',
    foot: 'ARBA Travel Korea · Details can change — please reopen this page the day before the tour.' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tel(p) { return p ? '<a href="tel:' + esc(String(p).replace(/[^\d+]/g, '')) + '">' + esc(p) + '</a> <button type="button" class="cp" data-copy="' + esc(p) + '">' + L.copy + '</button>' : ''; }
  var L = L_KO, EN = false;

  function render(slug) {
    var P = new URLSearchParams(location.search); EN = P.get('lang') === 'en'; L = EN ? L_EN : L_KO;
    document.documentElement.lang = EN ? 'en' : 'ko';
    var app = document.getElementById('app'); app.innerHTML = '<p class="loading">' + (EN ? 'Loading…' : '지침서를 여는 중…') + '</p>';
    fetch(API + '?v=' + encodeURIComponent(slug) + (EN ? '&lang=en' : '')).then(function (r) { return r.json(); }).then(function (j) {
      if (!j.ok || !j.data) { app.innerHTML = '<p class="loading">' + (EN ? 'Voucher not found.' : '지침서를 찾을 수 없습니다. 회사로 연락해주세요.') + '</p>'; return; }
      draw(j.data, slug);
    }).catch(function () { app.innerHTML = '<p class="loading">' + (EN ? 'Could not load. Please try again.' : '불러오지 못했습니다. 다시 열어주세요.') + '</p>'; });
  }

  function draw(D, slug) {
    var h = '';
    var alt = EN ? '?lang=ko' : '?lang=en';
    h += '<header>' + (D.draft ? '<span class="draft">' + L.draft + '</span>' : '') + '<a class="lang" href="' + alt + '">' + (EN ? '한국어' : 'English') + '</a><div class="t">ARBA TRAVEL KOREA · ' + L.voucher + '</div><h1>' + esc(D.tripId) + '</h1><div class="m">' + esc(D.title) + ' · ' + esc(D.period) + '</div></header>';
    // 가이드 카드
    var g = D.guide || {}, px = D.pax || {};
    h += '<div class="card gd"><b class="gn">' + esc(g.name) + L.guide + (g.eng ? ' <span style="font-size:14px;color:var(--mut)">(' + esc(g.eng) + ')</span>' : '') + '</b>' +
      '<div class="kv2"><div><small>' + L.in + '</small>' + esc(D.arrival) + '</div><div><small>' + L.out + '</small>' + esc(D.departure) + '</div><div><small>' + L.city + '</small>' + esc(D.dest) + '</div><div><small>' + L.tl + '</small>' + esc(D.tlNote || (px.tl ? px.tl : L.none)) + '</div></div>' +
      '<div class="pax"><div><small>TL</small><b>' + (px.tl || 0) + '</b></div><div><small>Adult</small><b>' + (px.adult || 0) + '</b></div><div><small>Child<br>w bed</small><b>' + (px.cwb || 0) + '</b></div><div><small>Child<br>w/o bed</small><b>' + (px.cnb || 0) + '</b></div><div><small>Infant</small><b>' + (px.inf || 0) + '</b></div><div class="tot"><small>Total</small><b>' + (px.total || 0) + '</b></div></div>' +
      (D.chips && D.chips.length ? '<div>' + D.chips.map(function (c) { return '<span class="hon' + (c.amber ? ' amber' : '') + '">' + esc(c.text || c) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    // 링크
    var K = D.links || {};
    h += '<h2>' + L.links + '</h2><div class="btnrow">' +
      (K.wa ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(K.wa) + '">💬 WhatsApp</a>' : '<span class="btn dis">💬 WhatsApp (' + L.tba + ')</span>') +
      (K.halal ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(K.halal) + '">🕌 ' + (EN ? 'Halal list' : '할랄 식당 리스트') + '</a>' : '') +
      (K.settle ? '<a class="btn red" target="_blank" rel="noopener" href="' + esc(K.settle) + '">🧾 ' + (EN ? 'Settle expenses · how to' : '정산하기 · 정산하는 법') + '</a>' : '') +
      (K.orig ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(K.orig) + '">📄 ' + (EN ? 'Guest itinerary (original)' : '손님 일정표 원본') + '</a>' : '') +
      (K.namelist ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(K.namelist) + '">📋 ' + (EN ? 'Name list' : '명단(룸리스트)') + '</a>' : '<span class="btn dis">📋 ' + (EN ? 'Name list (not yet)' : '명단 (아직 없음)') + '</span>') +
      (K.sign ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(K.sign) + '">🪧 ' + (EN ? 'Airport sign' : '공항 피켓 보기/인쇄') + '</a>' : '') + '</div>' + (K.hint ? '<p class="hint">' + esc(K.hint) + '</p>' : '');
    // 항공
    h += '<h2>' + L.flights + '</h2>';
    (D.flights || []).forEach(function (f) {
      var icn = f.ap === 'ICN', m = (f.no || '').match(/^([A-Z0-9]{2})(\d+)/i), ymd = (f.date || '').split('-');
      var fs = m ? 'https://www.flightstats.com/v2/flight-tracker/' + m[1] + '/' + m[2] + '?year=' + ymd[0] + '&month=' + (+ymd[1]) + '&date=' + (+ymd[2]) : '';
      h += '<div class="card"><div class="fl"><b>' + esc(f.no) + '</b><span class="dir">' + (f.dir === 'A' ? L.in : L.out) + ' · ' + esc(f.ap) + '</span><div class="when">' + esc(f.when) + '</div>' + (f.sub ? '<div class="sub">' + esc(f.sub) + '</div>' : '') + '</div>' +
        (f.pnr ? '<p class="pnr">PNR <b>' + esc(f.pnr) + '</b><button type="button" class="cp" data-copy="' + esc(f.pnr) + '">' + L.copy + '</button>' + (f.airline ? ' · ' + esc(f.airline) : '') + '</p>' : '') +
        (icn ? '<div class="live" data-f="' + esc(f.no + '|' + (f.date || '').replace(/-/g, '') + '|' + f.dir + '|' + (f.time || '').replace(':', '')) + '"><div><small>' + L.sched + '</small><span>' + esc(f.time) + '</span></div><div><small>' + L.est + '</small><span class="est">—</span></div><div><small>' + L.term + '</small><span class="term">—</span></div><div><small>' + (f.dir === 'A' ? L.exit : L.counter) + '</small><span class="exit">—</span></div></div><span class="st na">' + L.checking + '</span>' : '<span class="st na">' + esc(f.ap) + L.fsOnly + '</span>') +
        (f.note ? '<p class="hint" style="margin-top:8px">' + esc(f.note) + '</p>' : '') +
        (fs ? '<a class="lnk" target="_blank" rel="noopener" href="' + esc(fs) + '">' + L.track + '</a>' : '') + (f.dir === 'A' && K.sign ? '<a class="lnk" target="_blank" rel="noopener" href="' + esc(K.sign) + '">' + (EN ? 'Airport sign' : '공항 피켓 보기/인쇄') + '</a>' : '') + '</div>';
    });
    // 호텔
    if (D.hotels && D.hotels.length) {
      h += '<h2>' + L.hotel + '</h2>';
      D.hotels.forEach(function (ht) {
        h += '<div class="card ht"><b class="n">' + esc(ht.name) + '</b> <span style="color:var(--mut);font-size:13px">' + esc(ht.period) + '</span><dl class="kv">' +
          (ht.booking ? '<dt>' + L.booking + '</dt><dd>' + esc(ht.booking) + ' <button type="button" class="cp" data-copy="' + esc(ht.booking) + '">' + L.copy + '</button></dd>' : '') +
          (ht.breakfast ? '<dt>' + L.bf + '</dt><dd>' + esc(ht.breakfast) + '</dd>' : '') + (ht.rooms ? '<dt>' + L.rooms + '</dt><dd>' + esc(ht.rooms) + '</dd>' : '') + (ht.pay ? '<dt>' + L.pay + '</dt><dd>' + esc(ht.pay) + '</dd>' : '') +
          (ht.address ? '<dt>' + L.addr + '</dt><dd>' + esc(ht.address) + ' <button type="button" class="cp" data-copy="' + esc(ht.address) + '">' + L.copy + '</button></dd>' : '') + (ht.phone ? '<dt>' + L.tel + '</dt><dd>' + tel(ht.phone) + '</dd>' : '') +
          (ht.notes || []).map(function (n) { return '<dt>·</dt><dd>' + esc(n) + '</dd>'; }).join('') + '</dl>' +
          ((ht.map || ht.phone) ? '<div class="btnrow" style="margin-top:10px">' + (ht.map ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(ht.map) + '">' + L.map + '</a>' : '') + (ht.phone ? '<a class="btn" href="tel:' + esc(String(ht.phone).replace(/[^\d+]/g, '')) + '">' + L.call + '</a>' : '') + '</div>' : '') + '</div>';
      });
    }
    // 날짜 카드
    h += '<h2>' + L.days + '</h2>';
    (D.days || []).forEach(function (d) {
      var meals = d.meals || {};
      function mealSpan(i, key) { var mm = meals[key]; if (!mm) return '<span class="no">' + L.meal[i] + '</span>'; if (mm.ok === false) return '<span class="no">' + L.meal[i] + (mm.txt ? ' — ' + esc(mm.txt) : ' — ' + L.free) + '</span>'; return '<span class="' + (mm.alt ? 'alt' : '') + '">' + L.meal[i] + (mm.txt ? ' ' + esc(mm.txt) : '') + '</span>'; }
      h += '<details class="day" data-d="' + esc(d.d) + '"><summary><span class="d" data-today="' + L.today + '">' + esc(d.label) + '</span><span class="s">' + esc(d.summary) + '</span><span class="ar">▶</span></summary><div class="body">' +
        '<ul class="tl">' + (d.items || []).map(function (it) { return '<li><span class="tm">' + esc(it.tm || '') + '</span><span>' + esc(it.text) + (it.x ? '<span class="x">' + esc(it.x) + '</span>' : '') + '</span></li>'; }).join('') + '</ul>' +
        '<div class="row"><span class="i">🍽</span><div class="meal">' + mealSpan(0, 'b') + mealSpan(1, 'l') + mealSpan(2, 'd') + '</div></div>' +
        (d.move ? '<div class="row"><span class="i">🚐</span><div>' + esc(d.move) + (d.moveSub ? '<br><span style="color:var(--mut);font-size:13px">' + esc(d.moveSub) + '</span>' : '') + '</div></div>' : '') +
        (d.stay ? '<div class="row"><span class="i">🏨</span><div>' + esc(d.stay) + '</div></div>' : '') +
        (d.todo && d.todo.length ? '<div class="row"><span class="i">✅</span><ul class="todo">' + d.todo.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' : '') +
        (d.notes && d.notes.length ? '<div class="row"><span class="i">📝</span><div>' + d.notes.map(function (n) { return '<div style="margin-bottom:4px">' + esc(n) + '</div>'; }).join('') + '</div></div>' : '') +
        (d.warn ? '<div class="warn">' + esc(d.warn) + '</div>' : '') +
        (d.chips && d.chips.length ? '<div class="chips">' + d.chips.map(function (c) { return '<span' + (c.s ? ' class="s"' : '') + '>' + esc(c.text || c) + '</span>'; }).join('') + '</div>' : '') +
        (d.pray !== false ? '<div class="pray" data-pray="' + esc(d.d) + '" data-loc="' + esc(d.loc || D.loc || 'SEL') + '"><span class="i">☪️</span><div><b>' + L.pray + '</b> <span class="cd" data-cd></span><div class="tm" data-tm></div>' + (d.prayPlace ? esc(d.prayPlace) : '') + '</div></div>' : '') +
        '</div></details>';
    });
    // 전체 메모
    if (D.memo && D.memo.length) h += '<h2>' + L.memo + '</h2><div class="card"><ul class="memo">' + D.memo.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    // 연락처
    if (D.contacts && D.contacts.length) h += '<h2>' + L.contacts + '</h2><div class="card tel">' + D.contacts.map(function (c) { return esc(c.name) + (c.role ? ' <span style="color:var(--mut);font-size:13px">' + esc(c.role) + '</span>' : '') + ' ' + tel(c.phone); }).join('<br>') + '</div>';
    h += '<p class="foot">' + L.foot + (D.issued ? ' · ' + esc(D.issued) : '') + '</p>';
    document.getElementById('app').innerHTML = h;
    document.title = esc(D.tripId) + ' — ' + (EN ? 'Tour Voucher' : '투어지침서');
    afterDraw();
  }

  function afterDraw() {
    // 오늘 카드
    var n = new Date(), ymd = n.getFullYear() + '-' + String(n.getMonth() + 1).padStart(2, '0') + '-' + String(n.getDate()).padStart(2, '0');
    var P = new URLSearchParams(location.search); if (P.get('today')) ymd = P.get('today');
    var days = [].slice.call(document.querySelectorAll('.day')), hit = null;
    days.forEach(function (d) { if (d.dataset.d === ymd) { d.open = true; d.classList.add('today'); hit = d; } });
    if (!hit && days.length) { var up = days.filter(function (d) { return d.dataset.d >= ymd; })[0] || days[0]; up.open = true; }
    else if (hit) setTimeout(function () { hit.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    // 기도 시간
    if (window.prayerTimes) document.querySelectorAll('.pray[data-pray]').forEach(function (p) {
      var loc = PRAYER_LOC[p.dataset.loc] || PRAYER_LOC.SEL, t = prayerTimes(loc[0], loc[1], p.dataset.pray);
      p.querySelector('[data-tm]').innerHTML = '<span>Fajr ' + t.fajr + '</span><span>Dhuhr ' + t.dhuhr + '</span><span>Asr ' + t.asr + '</span><span class="dl">⛔ Maghrib ' + t.maghrib + L.before + '</span><span>Isha ' + t.isha + '</span>';
      if (p.dataset.pray === ymd) { var cd = p.querySelector('[data-cd]'); var tick = function () { var now = new Date(); var left = (+t.maghrib.slice(0, 2)) * 60 + (+t.maghrib.slice(3)) - (now.getHours() * 60 + now.getMinutes()); cd.textContent = left > 0 ? '· ' + L.left + Math.floor(left / 60) + L.h + (left % 60) + L.m : '· ' + L.sunset; }; tick(); setInterval(tick, 30000); }
    });
    // 복사
    document.addEventListener('click', function (ev) { var b = ev.target.closest('.cp'); if (!b) return; var v = b.dataset.copy; try { navigator.clipboard.writeText(v).then(function () { b.textContent = L.copied; setTimeout(function () { b.textContent = L.copy; }, 1500); }); } catch (e) { } });
    // 항공 실시간
    var LV = [].slice.call(document.querySelectorAll('.live[data-f]')); if (!LV.length) return;
    function go() {
      fetch(API + '?flights=' + encodeURIComponent(LV.map(function (x) { return x.dataset.f; }).join('~'))).then(function (r) { return r.json(); }).then(function (j) {
        (j.list || []).forEach(function (d, i) {
          var el = LV[i]; if (!el) return; var st = el.parentNode.querySelector('.st');
          if (!d.ok || !d.found) { st.className = 'st na'; st.textContent = L.notYet; return; }
          el.querySelector('.est').textContent = d.estimated && d.estimated !== d.scheduled ? d.estimated : (d.estimated ? '=' : '—');
          el.querySelector('.term').textContent = d.terminal || '—';
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
