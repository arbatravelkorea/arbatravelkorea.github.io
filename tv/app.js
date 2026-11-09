/* ARBA 투어지침서 렌더러 v2 (A안, 2026-11-06) — 내용 JSON은 Apps Script(ATK_FlightApi ?v=<슬러그>)가 Google Drive ATK_Vouchers/<슬러그>.json에서 내려줌.
   이 파일에는 손님·예약 정보가 없음. 사용: ATK.render('<슬러그>') */
(function () {
  var API = 'https://script.google.com/macros/s/AKfycbysvuoEsBZzKvuVvfSqg3P7rqQcaaLyUz1U-gwm11YwkIaC86-v5vQRE9Kb2WPoGvzfRA/exec';
  var WA_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.84 9.84 0 0 1 7 2.9 9.82 9.82 0 0 1 2.9 7c0 5.45-4.44 9.88-9.9 9.88m8.42-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.33.16 11.89c0 2.1.55 4.14 1.59 5.95L0 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.33 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41"/></svg>';
  var KA_SVG = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.31 4.66 6.73l-.98 3.67c-.09.33.29.6.57.4l4.2-2.86c.5.06 1.02.09 1.55.09 5.52 0 10-3.58 10-8s-4.48-8-10-8z"/></svg>';
  var L_KO = { voucher: 'TOUR VOUCHER · 가이드용', guide: ' 가이드님', in: '입국', out: '출국', city: '도시', tl: '인솔자', none: '없음', links: '🔗 링크', flights: '✈️ 항공 · 실시간', hotel: '🏨 호텔', days: '📅 일정', memo: '📌 전체 메모 (투어 내내)', contacts: '☎️ 비상 연락처',
    sched: '예정', est: '변경', term: '터미널', exit: '출구', counter: '카운터', checking: '조회 중…', fsOnly: ' 공항은 FlightStats로 확인', track: '실시간 추적 (FlightStats)', notYet: '아직 공항 조회 전 (3일 전부터 조회됨)', liveFail: '실시간 조회 실패 — FlightStats로 확인', belt: '벨트 ', sign: '공항 피켓 보기/인쇄',
    status: { ontime: '정시', delay: '지연', landed: '도착함', departed: '출발함', cancel: '결항', divert: '회항' }, tba: '미정', meals: '식사 포함', noMeals: '식사 불포함 (자유 식사)', paxSum: '합류 합계', waTwo: '단톡방이 팀별로 2개입니다 — 두 방 모두 들어가 같은 인사·공지를 보내주세요.', settleTwo: '정산은 팀별 링크로 나눠서 — 일비는 두 링크에 반반, 입장료·차량비는 팀 인원대로 나눠 결제, 한 팀만 간 일정은 그 팀 링크에만.',
    booking: '예약번호', checkin: '체크인', checkout: '체크아웃', bf: '조식', rooms: '객실', pay: '결제', addr: '주소', tel: '전화', map: '📍 지도', call: '📞 전화', reserve: '예약', sms: '💬 문자', copy: '복사', copied: '복사됨', namelist: '📋 명단(룸리스트) 보기', nonamelist: '📋 명단 — 아직 없음 (받는 대로 여기에)',
    today: '오늘', meal: ['아침', '점심', '저녁'], free: '손님 자유', pray: '오늘 기도', after: ' 이후', before: ' 전에', left: '해 지기까지 ', h: '시간 ', m: '분', sunset: '해 졌음 → Maghrib+Isha', draft: '초안 · 확정 전', waBtn: '단톡방 입장하기', halal: '할랄&무슬림 프렌들리 식당 리스트', season: '시즌 추천 · 지금 가볼 만한 곳', settle: '정산하기 · 정산하는 법', kakao: '아르바트래블 비즈카톡', greet: '인사말 복사하기', greetHo: '교대 인사말 복사', copiedGreet: '복사됨 — 왓츠앱 단톡방에 붙여넣기', greetHint: '① 단톡방 입장하기 → ② 인사말 복사하기 → 단톡방 입력창을 길게 눌러 붙여넣기 후 보내기. 공항에서 만나기 전날까지 보내주세요. 내용은 고쳐서 보내셔도 됩니다.', greetHintHo: '① 단톡방 입장하기 → ② 교대 인사말 복사 → 단톡방 입력창을 길게 눌러 붙여넣기 후 보내기. 맡는 날 전날 보내주세요 (만나는 시간·장소는 직접 적어 주세요).',
    foot: 'ARBA Travel Korea · 지침서 내용은 바뀔 수 있으니 투어 전날 다시 열어 확인해주세요.' };
  var L_EN = { voucher: 'TOUR VOUCHER · FOR GUIDE', guide: '', in: 'Arrival', out: 'Departure', city: 'City', tl: 'Tour leader', none: 'None', links: '🔗 LINKS', flights: '✈️ FLIGHTS · LIVE', hotel: '🏨 HOTEL', days: '📅 ITINERARY', memo: '📌 NOTES FOR THE WHOLE TOUR', contacts: '☎️ EMERGENCY CONTACT',
    sched: 'Sched.', est: 'Est.', term: 'Terminal', exit: 'Exit', counter: 'Counter', checking: 'Checking…', fsOnly: ' airport: check on FlightStats', track: 'Live tracking (FlightStats)', notYet: 'Not in the airport system yet (opens 3 days before)', liveFail: 'Live lookup unavailable — use FlightStats', belt: 'belt ', sign: 'Airport sign — view / print',
    status: { ontime: 'On time', delay: 'Delayed', landed: 'Landed', departed: 'Departed', cancel: 'Cancelled', divert: 'Diverted' }, tba: 'TBA', meals: 'meals included', noMeals: 'meals not included (own arrangement)', paxSum: 'Combined total', waTwo: 'There are 2 WhatsApp groups (one per team) — please join both and send the same greeting and notices.', settleTwo: 'Settle per team link — split the guide fee half/half, split entrance and vehicle costs by each team\'s headcount, and put a one-team-only activity on that team\'s link only.',
    booking: 'Booking no.', checkin: 'Check-in', checkout: 'Check-out', bf: 'Breakfast', rooms: 'Rooms', pay: 'Payment', addr: 'Address', tel: 'Phone', map: '📍 Map', call: '📞 Call', reserve: 'Book', sms: '💬 SMS', copy: 'Copy', copied: 'Copied', namelist: '📋 Name list (rooming list)', nonamelist: '📋 Name list — not yet',
    today: 'TODAY', meal: ['Breakfast', 'Lunch', 'Dinner'], free: 'own arrangement', pray: 'Prayer today', after: ' onwards', before: ' before', left: 'Sunset in ', h: 'h ', m: 'min', sunset: 'Sun has set → Maghrib+Isha', draft: 'DRAFT · not final', waBtn: 'Join the group', halal: 'Halal & Muslim-friendly restaurants', season: 'Seasonal picks on our route', settle: 'Settle expenses · how to', kakao: 'ARBA Travel on KakaoTalk', greet: 'Copy greeting', greetHo: 'Copy handover greeting', copiedGreet: 'Copied — paste it in the WhatsApp group', greetHint: '① Join the group → ② Copy greeting → long-press the message box in the group, paste and send. Please send it by the day before you meet at the airport. Feel free to edit it.', greetHintHo: '① Join the group → ② Copy handover greeting → long-press the message box, paste and send. Send it the day before your first day (add the meeting time and place yourself).',
    foot: 'ARBA Travel Korea · Details can change — please reopen this page the day before the tour.' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function num(p) { return esc(String(p || '').replace(/[^\d+]/g, '')); }
  function cpBtn(v) { return '<button type="button" class="cp" data-copy="' + esc(v) + '">' + L.copy + '</button>'; }
  function tel(p) { return p ? '<a href="tel:' + num(p) + '">' + esc(p) + '</a> ' + cpBtn(p) : ''; }
  // 담당자·전화·문자 묶음: {contact:'박현성', phone:'010-…', sms:true, note:'문자 예약'}
  // 식당 등: 전화·문자 옆에 네이버 지도 아이콘(place 또는 "점심/저녁 — 식당명"에서 자동) — 지도가 없으면 [복사]
  function placeOf(c) { if (c.place) return c.place; var t = String(c.text || ''); if (/불포함|할랄 식당|자유|가이드 선택|가이드님 식당 결정|Guide's choice|Not included|own expense|free time|halal restaurant/i.test(t)) return ''; var m = t.match(/^(?:점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]?\s*([^(—–\-·]+)/); return m ? m[1].trim() : ''; }
  // 할랄 리스트에 있는 식당이면 리스트의 정확한 네이버지도 링크 (이름 앞부분 일치: "고삼이 신촌점", "EID (이태원)…" → "EID 할랄 코리안푸드")
  function halalLink(pl) { var H = window.HALAL_LINKS || {}; if (!pl) return ''; var k = pl.replace(/\s*\(.*$/, '').replace(/\s+/g, ' ').trim().toLowerCase(); var best = ''; Object.keys(H).forEach(function (n) { var nn = n.toLowerCase(); if (nn === k || nn.indexOf(k) === 0 || k.indexOf(nn) === 0) { if (!best || n.length > best.length) best = n; } }); if (!best) Object.keys(H).forEach(function (n) { var w = n.toLowerCase().split(' ')[0]; if (w.length >= 2 && k.indexOf(w) === 0 && !best) best = n; }); return best ? H[best] : ''; }
  // 문자 버튼 기본 양식 (2026-11-09 대표 지시): 인사 + 날짜·끼니 + 인원 + 도착 시간. 식당은 항상 한국어
  function smsBody(c, d) {
    if (c.jmsg) return c.jmsg;
    var D = CUR || {}, g = D.guide || {}, px = mealPx(D), nm = EN ? (g.name || '') : (g.ko || g.name || '');
    var dt = d && d.d ? new Date(d.d + 'T00:00:00') : null;
    var t = String(c.text || ''), mm = t.match(/^(점심|저녁|아침|Lunch|Dinner|Breakfast)/), gim = !mm && /김밥|gimbap/i.test(t);
    if (gim) mm = [0, EN ? 'Breakfast' : '아침'];
    if (!mm) return EN ? 'Hello,\nThis is ' + nm + ', tour guide from ARBA Travel' + (D.tripId ? ' (' + D.tripId + ')' : '') + '.' : '안녕하세요\n아르바트래블 ' + nm + ' 가이드입니다.' + (D.tripId ? '\n' + D.tripId + ' 팀 관련 연락드립니다.' : '');
    var meal = { 점심: 'L', Lunch: 'L', 저녁: 'D', Dinner: 'D', 아침: 'B', Breakfast: 'B' }[mm[1]];
    var dl = /배달|delivery/i.test(t), tl = +px.tl || 0, inf = +px.inf || 0, H = null, tm = /^\d\d:\d\d$/.test(c.tm || '') ? c.tm : '';
    if (gim && /공항|airport/i.test(t)) { var df = (D.flights || []).filter(function (f) { return f.dir === 'D'; })[0]; H = { name: EN ? 'Incheon Airport ' + ((df && df.term) || 'T1') : '인천공항 ' + ((df && df.term) || 'T1') + (df ? ' (' + df.no + ' ' + df.time + ' 출발)' : ''), address: '' }; dl = true; }
    if (dl && !H) {
      var hs = D.hotels || [], st = String((d && d.stay) || ''); hs.forEach(function (h) { if (!H && h.name && st.indexOf(h.name) >= 0) H = h; }); H = H || hs[0] || {};
      var xm = String(c.x || '').match(/(\d{1,2}:\d{2})\s*까지|until\s*(\d{1,2}:\d{2})/i); if (!tm && xm) tm = xm[1] || xm[2];
    }
    var J = d && d.joint, ex = null; if (dl && !gim && J && J.hotel && c.jt) H = { name: J.hotel, address: J.addr || '' }; if (J && c.jt && J.pax) ex = { label: J.label || J.team, guests: +J.pax, tl: +J.tl || 0 };
    return window.ATK_SMS({ en: EN, name: nm, date: dt, meal: meal, guests: (+px.total || 0) - tl - inf, tl: tl, inf: inf, dl: dl, hotel: H ? H.name : '', addr: H ? H.address : '', time: tm, extra: ex });
  }
  // 할랄 리스트에 가이드·인원·호텔을 넘겨 문자하기 양식을 채움
  function halalUrl(u, D) {
    var g = D.guide || {}, px = mealPx(D), tl = +px.tl || 0, inf = +px.inf || 0, h = (D.hotels || [])[0] || {};
    var q = { g: EN ? (g.name || '') : (g.ko || g.name || ''), n: (+px.total || 0) - tl - inf, tl: tl, inf: inf, h: h.name || '', ha: h.address || '' };
    if (EN) q.en = 1;
    return u + (u.indexOf('?') >= 0 ? '&' : '?') + Object.keys(q).filter(function (k) { return q[k] !== '' && q[k] !== 0 || k === 'n'; }).map(function (k) { return k + '=' + encodeURIComponent(q[k]); }).join('&');
  }
  // 🤝 같은 날 같은 곳에 가는 다른 팀과 합동 (예약 한 건으로·뷔페 최소 인원·합동 발권). joint = {team, guide, phone, pax, tl, lead, items:[], meals:['l','d']}
  // 🤝 합동 — 해당 항목 바로 아래 (에버랜드·비발디 발권 / 김밥 / 신촌버거 / 캄풍쿠 15명 뷔페만). d.joint = 상대 팀 정보, item.jt = 그 항목의 합동 내용
  // 🤝 합동 가이드 문자 양식 — 항목별(에버랜드·신촌버거·김밥·캄풍쿠), 주도(인원 많은 팀)/상대 구분 (대표 11/9 22:18)
  function jointMsg(j, it, d) {
    var D = CUR || {}, g = D.guide || {}, nm = EN ? (g.name || '') : (g.ko || g.name || ''), px = mealPx(D), tl = +px.tl || 0, inf = +px.inf || 0, my = (+px.total || 0) - tl - inf;
    // 입장·식사 인원: 단체(JT)는 가이드도 입장 → 포함 / 프라이빗(PT) 드라이빙 가이드는 입장 안 함 → 제외 (대표 11/9 22:35)
    var isJT = /\/JT\//.test(String(D.tripId || '')), oJT = /\/JT\//.test(String(j.team || '')), myG = isJT ? 1 : 0, oG = oJT ? 1 : 0;
    var ot = +j.pax || 0, otl = +j.tl || 0, myT = my + tl + myG, oT = ot + otl + oG, lead = (my + tl + 1) >= (ot + otl + 1), t = String(it.text || ''), dd = fmtD(d.d), tm = it.tm || '';
    function L_(gu, t2, gd, tot) { return EN ? gu + ' guests' + (t2 ? ' + ' + t2 + ' TL' : '') + (gd ? ' + 1 guide' : '') + ' = ' + tot : '손님 ' + gu + '명' + (t2 ? ' + 인솔자 ' + t2 + '명' : '') + (gd ? ' + 가이드 1' : '') + ' = ' + tot + '명'; }
    var myL = L_(my, tl, myG, myT), otL = L_(ot, otl, oG, oT), oName = j.guide + (EN ? "'s team" : ' 팀');
    var gNote = EN ? (isJT ? ' (group tour — guide enters too, unless a free guide ticket is issued)' : ' (private tour — driving guide does not enter)') : (isJT ? ' (단체라 가이드도 입장 — 가이드 무료 티켓 안 나오면 발권)' : ' (프라이빗 — 드라이빙 가이드는 입장 안 함)');
    var oNote = EN ? (oJT ? ' (group — guide enters)' : ' (private — guide does not enter)') : (oJT ? ' (단체 — 가이드 입장)' : ' (프라이빗 — 가이드 입장 안 함)');
    var hi = EN ? 'Hello ' + j.guide + ',\nThis is ' + nm + ', the guide joining you at ' : '안녕하세요 ' + j.guide + ' 가이드님\n' + dd + ' ';
    var body;
    if (/신촌버거|sinchon burger/i.test(t)) {
      body = EN ? hi + 'Everland on ' + dd + '.\n\n' + (lead ? 'I will order Sinchon Burger for both teams.\n· Yours: ' + oT + ' sets (' + otL + ')' + oNote + ' — correct?\n· Delivered to our hotel by 08:00.\n· Shall I hand yours over at Everland (packed), or will your team eat separately inside? Please let me know.' : 'You are ordering Sinchon Burger for both teams.\n· Ours: ' + myT + ' sets (' + myL + ')' + gNote + '\n· Please hand ours over at Everland (packed) / we will eat separately inside — I will confirm which.') + '\nThank you!'
        : hi + '에버랜드 같이 가는 ' + nm + ' 가이드입니다.\n\n' + (lead ? '신촌버거는 저희가 두 팀 것 함께 주문할게요.\n· ' + oName + ': ' + oT + '개 (' + otL + ')' + oNote + ' 맞으실까요?\n· 저희 호텔로 08:00까지 받아요.\n· 에버랜드에서 포장 전달드릴지, 안에서 따로 드실지 알려주세요.' : '신촌버거 함께 주문 부탁드려요.\n· 저희 팀: ' + myT + '개 (' + myL + ')' + gNote + '\n· 에버랜드에서 포장 전달 / 안에서 따로 식사 — 어느 쪽인지 확정해서 알려드릴게요.') + '\n감사합니다!';
    } else if (/에버랜드|everland|비발디|vivaldi|스키|ski/i.test(t)) {
      var pl = /비발디|vivaldi|스키|ski/i.test(t) ? (EN ? 'Vivaldi Park' : '비발디파크') : (EN ? 'Everland' : '에버랜드');
      body = EN ? hi + pl + ' on ' + dd + '.\n\n' + (lead ? 'I will buy the group tickets for both teams, so please confirm your headcount.\n· Ours: ' + myL + gNote + '\n· Yours: ' + otL + oNote + ' — correct?\n· Our arrival: ' + (tm || '__:__') + ' — what time will you arrive?\n· Meet at the ticket office.' : 'You are buying the group tickets for both teams — please check our headcount.\n· Ours: ' + myL + gNote + '\n· Our arrival: ' + (tm || '__:__') + '\n· Where shall we meet?') + '\nThank you!'
        : hi + pl + ' 같이 가는 ' + nm + ' 가이드입니다.\n\n' + (lead ? '저희가 두 팀 합쳐 발권하니 인원 확인 부탁드려요.\n· 저희: ' + myL + gNote + '\n· ' + oName + ': ' + otL + oNote + ' 맞으실까요?\n· 저희 도착 예정 ' + (tm || '__:__') + ' — 도착 시간 알려주세요.\n· 매표소 앞에서 만나요.' : '가이드님이 두 팀 합쳐 발권해 주시니 저희 인원 확인 부탁드려요.\n· 저희: ' + myL + gNote + '\n· 도착 예정 ' + (tm || '__:__') + '\n· 만나는 장소 알려주세요.') + '\n감사합니다!';
    } else if (/김밥|gimbap/i.test(t)) {
      var mK = my + tl + 1, oK = ot + otl + 1, myK = L_(my, tl, 1, mK), otK = L_(ot, otl, 1, oK);
      body = EN ? hi + 'the airport on ' + dd + '.\n\n' + (lead ? 'I will order the gimbap for both teams (one airport delivery).\n· Yours: ' + oK + ' rolls (' + otK + ') — tuna without ham / spicy squid, please tell me the split by the day before.' : 'You are ordering the gimbap for both teams.\n· Ours: ' + mK + ' rolls (' + myK + ') — I will send the tuna / spicy squid split by the day before.\n· I will collect them at the airport.') + '\nThank you!'
        : hi + '같은 편으로 출국하는 ' + nm + ' 가이드입니다.\n\n' + (lead ? '김밥은 저희가 두 팀 것 함께 주문할게요 (공항 배달 1회).\n· ' + oName + ': ' + oK + '줄 (' + otK + ') — 햄 뺀 참치 / 매콤오징어 몇 줄씩인지 전날까지 알려주세요.' : '김밥 함께 주문 부탁드려요.\n· 저희 팀: ' + mK + '줄 (' + myK + ') — 참치 / 매콤오징어 구분은 전날까지 보내드릴게요.\n· 공항에서 받을게요.') + '\n감사합니다!';
    } else if (/캄풍쿠|kampungku/i.test(t)) {
      var mB = my + tl + 1, oB = ot + otl + 1;
      body = EN ? hi + 'Kampungku on ' + dd + '.\n\n' + (lead ? 'I will book the buffet for both teams (15+ pax).\n· Yours: ' + oB + ' (' + L_(ot, otl, 1, oB) + ') — correct?\n· Our arrival: ' + (tm || '__:__') + ' — please match the time.' : 'You are booking the Kampungku buffet for both teams.\n· Ours: ' + mB + ' (' + L_(my, tl, 1, mB) + ')\n· What time shall we arrive?') + '\nThank you!'
        : hi + '캄풍쿠 같이 가는 ' + nm + ' 가이드입니다.\n\n' + (lead ? '뷔페는 저희가 두 팀 합쳐 예약할게요 (15명 이상).\n· ' + oName + ': ' + oB + '명 (' + L_(ot, otl, 1, oB) + ') 맞으실까요?\n· 저희 도착 예정 ' + (tm || '__:__') + ' — 시간 맞춰 주세요.' : '캄풍쿠 뷔페 합쳐서 예약 부탁드려요.\n· 저희 팀: ' + mB + '명 (' + L_(my, tl, 1, mB) + ')\n· 몇 시 도착으로 할까요?') + '\n감사합니다!';
    } else {
      var mX = my + tl + 1;
      body = EN ? hi + mealName(t) + ' on ' + dd + '.\n· Ours: ' + L_(my, tl, 1, mX) + '\n· Our arrival: ' + (tm || '__:__') + '\nThank you!' : hi + (mealName(t) || t) + ' 같이 하는 ' + nm + ' 가이드입니다.\n· 저희: ' + L_(my, tl, 1, mX) + '\n· 도착 예정 ' + (tm || '__:__') + '\n감사합니다!';
    }
    return body;
  }
  function jointHtml(j, d, txt, it) {
    var c = j.phone ? who({ contact: j.guide, phone: j.phone, sms: true, nomap: true, jmsg: jointMsg(j, it || {}, d) }, d) : '';
    return '<span class="joint"><b>🤝 ' + (EN ? 'Joint · ' : '합동 · ') + esc(j.team) + '</b>' + c + '<span class="jt">' + esc(txt).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</span>' +
      '<span class="x">' + (EN ? '💳 Whoever pays with the corporate card settles the receipt' : '💳 법인카드로 결제한 가이드가 영수증 정산') + '</span></span>';
  }
  // 시간 입력 정리: "1100"→"11:00", "930"→"09:30" (대표 11/9 21:57)
  function normTm(v) { v = String(v || '').trim(); var m = v.match(/^(\d{1,2})[:.]?(\d{2})$/); if (!m) return ''; var h = +m[1], mi = +m[2]; if (h > 23 || mi > 59) return ''; return (h < 10 ? '0' : '') + h + ':' + (mi < 10 ? '0' : '') + mi; }
  var WK2 = ['일', '월', '화', '수', '목', '금', '토'], WE2 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ME2 = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtD(dd) { var t = new Date(dd + 'T00:00:00'); if (isNaN(t)) return dd; return EN ? WE2[t.getDay()] + ', ' + t.getDate() + ' ' + ME2[t.getMonth()] : (t.getMonth() + 1) + '월 ' + t.getDate() + '일(' + WK2[t.getDay()] + ')'; }
  function LS(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  // 예약 시간 변경 문자 (이미 시간이 있는데 다른 시간을 넣으면 신규 예약이 아니라 변경, 대표 11/9 22:35)
  function chgTimeMsg(it, d, prev, next) {
    var D = CUR || {}, g = D.guide || {}, nm = EN ? (g.name || '') : (g.ko || g.name || ''), px = mealPx(D), tl = +px.tl || 0, inf = +px.inf || 0, gu = (+px.total || 0) - tl - inf, tot = gu + tl + 1;
    var mk = mealKey(it.text), mealW = EN ? ({ b: 'breakfast', l: 'lunch', d: 'dinner' })[mk] || '' : ({ b: '아침', l: '점심', d: '저녁' })[mk] || '', dd = fmtD(d.d);
    return EN ? 'Hello,\nThis is ' + nm + ', tour guide from ARBA Travel.\nPlease change our booking time.\n\nFrom: ' + dd + ' ' + mealW + ' ' + prev + '\nTo: ' + dd + ' ' + mealW + ' ' + next + '\nPax: ' + tot + ' (' + gu + ' guests' + (tl ? ' + ' + tl + ' tour leader' : '') + ' + 1 guide)\n\nPlease confirm. Thank you!'
      : '안녕하세요\n아르바트래블 ' + nm + ' 가이드입니다.\n예약 시간 변경 부탁드립니다.\n\n기존: ' + dd + ' ' + mealW + ' ' + prev + '\n변경: ' + dd + ' ' + mealW + ' ' + next + '\n인원: 총 ' + tot + '명 (손님 ' + gu + '명' + (tl ? ' + 인솔자 ' + tl + '명' : '') + ' + 가이드 1명)\n\n확인 부탁드립니다. 감사합니다!';
  }
  var RT = {}; // 식당 예약 시간 (가이드가 문자 버튼 누를 때 입력, 이 휴대폰 저장)
  // 🔒 이름 워터마크: 본인 기기 0.8% (거의 안 보임) / 다른 기기 진하게 / 인쇄·PDF 진하게 (대표 11/9 23:08)
  // 대표 확인 전: 예시 지침서(demo)와 secure:true 인 지침서만. 확정되면 기본 켜기로 바꿈
  function SECURE(D) { return D.secure !== false; } // 11/9 대표 확정: 모든 지침서 (끄려면 "secure":false)
  function watermark(D) {
    var g = D.guide || {}, nm = (g.ko || g.name || ''), ph = String(g.phone || '').replace(/\D/g, ''), sub = (D.tripId || '') + (ph ? ' · 010-****-' + ph.slice(-4) : '');
    function svg(a, big) { var w = big ? 280 : 260, h = big ? 190 : 170; return 'url("data:image/svg+xml;utf8,' + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'><g transform='rotate(-24 " + w / 2 + " " + h / 2 + ")' font-family='sans-serif' font-weight='800' fill='rgba(176,38,75," + a + ")'><text x='8' y='" + (h / 2 - 4) + "' font-size='" + (big ? 20 : 17) + "'>" + nm + " 가이드님 전용</text><text x='12' y='" + (h / 2 + 18) + "' font-size='11'>" + sub + "</text></g></svg>") + '")'; }
    var old = document.getElementById('atkwm'); if (old) old.remove();
    var wm = document.createElement('div'); wm.id = 'atkwm'; wm.className = OWN ? 'wm own' : 'wm other'; wm.style.backgroundImage = svg(OWN ? 0.008 : 0.24, !OWN); document.body.appendChild(wm);
    var st = document.getElementById('atkwmp'); if (!st) { st = document.createElement('style'); st.id = 'atkwmp'; document.head.appendChild(st); }
    st.textContent = '@media print{#atkwm{background-image:' + svg(0.22, true) + ' !important;position:fixed;-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
  }
  function smsHref(c, d) { return 'sms:' + num(c.phone) + '?&body=' + encodeURIComponent(smsBody(c, d)); }
  function who(c, d) {
    if (!c) return '';
    var pl = c.nomap ? '' : placeOf(c), mp = c.map || halalLink(pl);
    if (!c.phone) { if (c.nomap || !(c.map || (pl && /^(점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]/.test(c.text || '')))) return ''; return '<span class="who"><a class="mini nm" target="_blank" rel="noopener" href="' + esc(mp || ('https://map.naver.com/p/search/' + encodeURIComponent(pl))) + '"><img src="/img/naver_map.png" alt="' + L.map + '"></a>' + (c.note ? ' <span class="x">' + esc(c.note).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</span>' : '') + '</span>'; }
    return '<span class="who">' + (c.contact ? esc(c.contact) + ' ' : '') + '<a class="mini" href="tel:' + num(c.phone) + '">' + ((c.callLabel || (/^(점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]/.test(c.text || '') ? L.reserve : '')) ? '📞 ' + esc(c.callLabel || L.reserve) : L.call) + '</a>' + (c.sms ? '<a class="mini" href="' + esc(smsHref(c, d)) + '">' + L.sms + '</a>' : '') +
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
    var GH = D.greet || {};
    if (GH.handover) {
      var gg = D.guide || {}, nm = gg.eng || gg.name || '', hd = GH.handover, hm = +hd.slice(5, 7), hdd = +hd.slice(8, 10);
      var dl = (D.days || []).map(function (d) { return d.d; }).filter(Boolean), last = GH.until || dl[dl.length - 1] || hd;
      var lm = +last.slice(5, 7), ldd = +last.slice(8, 10);
      var span = GH.span ? GH.span : last === hd ? hdd + ' ' + MON[hm - 1] : (hm === lm ? hdd + '–' + ldd + ' ' + MON[hm - 1] : hdd + ' ' + MON[hm - 1] + '–' + ldd + ' ' + MON[lm - 1]);
      return 'Hi everyone! 😊\nI\'m ' + nm + ', and I\'ll be your tour guide on ' + span + (GH.prev ? ', taking over from ' + GH.prev : '') + '. Thank you for traveling with ARBA Travel!\n\n' +
        (GH.prev ? GH.prev + ' has shared your preferences with me, so please feel free to tell me anything else you\'d like.\n' : '') +
        '🕌 I\'ll arrange suitable places for prayer, and all meals will be Halal.\n\n' +
        '⏰ Tomorrow I\'ll pick you up at: (time) / (place)\n\nFeel free to message me here anytime. See you tomorrow! 🇰🇷\n— ' + nm;
    }
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
  var L = L_KO, EN = false, SLUG = '', CUR = {}, ORIG = null, CHG = null, OWN = true;

  function render(slug) {
    SLUG = slug;
    var P = new URLSearchParams(location.search); EN = P.get('lang') === 'en'; L = EN ? L_EN : L_KO;
    document.documentElement.lang = EN ? 'en' : 'ko';
    var app = document.getElementById('app'); app.innerHTML = '<p class="loading">' + (EN ? 'Loading…' : '지침서를 여는 중…') + '</p>';
    fetch(API + '?v=' + encodeURIComponent(slug) + (EN ? '&lang=en' : '')).then(function (r) { return r.json(); }).then(function (j) {
      if (j.error === 'expired') { app.innerHTML = '<p class="loading">🔒 ' + (EN ? 'This tour voucher is closed (7 days after the tour ended). Please contact ARBA Travel Korea if you need it.' : '이 투어지침서는 열람 기간이 끝났습니다 (투어 종료 7일 뒤).<br>필요하면 회사로 연락해주세요.') + '</p>'; return; }
      OWN = true; // 기기 등록·다른 기기 판별은 쓰지 않음 (11/9 대표 결정)
      if (!j.ok || !j.data) { app.innerHTML = '<p class="loading">' + (EN ? 'Voucher not found.' : '지침서를 찾을 수 없습니다. 회사로 연락해주세요.') + '</p>'; return; }
      ORIG = JSON.parse(JSON.stringify(j.data)); CHG = j.chg || null; if (CHG) applyChg(j.data, CHG); draw(j.data);
    }).catch(function () { app.innerHTML = '<p class="loading">' + (EN ? 'Could not load. Please try again.' : '불러오지 못했습니다. 다시 열어주세요.') + '</p>'; });
  }

  function paxGrid(px) { return '<div class="pax"><div><small>TL</small><b>' + (px.tl || 0) + '</b></div><div><small>Adult</small><b>' + (px.adult || 0) + '</b></div><div><small>Child<br>w bed</small><b>' + (px.cwb || 0) + '</b></div><div><small>Child<br>w/o bed</small><b>' + (px.cnb || 0) + '</b></div><div><small>Infant</small><b>' + (px.inf || 0) + '</b></div><div class="tot"><small>Total</small><b>' + (px.total || 0) + '</b></div></div>'; }
  // 식당 예약 인원 = 식사 포함 팀(합류 투어면 meals:true 팀)만
  function mealPx(D) { var t = (D.trips || []).filter(function (x) { return x.meals; })[0]; return (t && t.pax) || D.pax || {}; }
  function draw(D) {
    CUR = D; var h = '';
    // 합류 투어(STD+BSC, 가이드 1명): D.trips = [{tripId,short,title,pax,tlName,wa,settle,meals}] — 2026-11-09 대표
    var TR = (D.trips && D.trips.length > 1) ? D.trips : null;
    var alt = EN ? '?lang=ko' : '?lang=en';
    h += '<header>' + (D.draft ? '<span class="draft">' + L.draft + '</span>' : '') + '<a class="lang" href="' + alt + '">' + (EN ? '한국어' : 'English') + '</a><div class="t">ARBA TRAVEL KOREA · ' + L.voucher + '</div>' + (TR ? TR.map(function (t) { return '<h1>' + esc(t.tripId) + '</h1><div class="m">' + esc(t.title || '') + '</div>'; }).join('') : '<h1>' + esc(D.tripId) + '</h1><div class="m">' + esc(D.title) + '</div>') + '</header>';
    // 가이드 카드
    var g = D.guide || {}, px = D.pax || {};
    h += '<div class="card gd"><b class="gn">' + esc(g.name) + L.guide + (g.eng ? ' <span style="font-size:14px;color:var(--mut)">(' + esc(g.eng) + ')</span>' : '') + '</b>' +
      '<div class="kv2"><div><small>' + L.in + '</small>' + esc(D.arrival) + '</div><div><small>' + L.out + '</small>' + esc(D.departure) + '</div><div><small>' + L.city + '</small>' + esc(D.dest) + '</div><div><small>' + L.tl + '</small><b>' + (TR ? TR.map(function (t) { return esc((t.short || t.tripId) + ': ' + (t.tlName || L.none)); }).join('<br>') : esc(D.tlName || L.none)) + '</b></div></div>' +
      (TR ? TR.map(function (t) { return '<div class="paxl">' + esc(t.short || t.tripId) + (t.meals === false ? ' · ' + L.noMeals : t.meals ? ' · ' + L.meals : '') + '</div>' + paxGrid(t.pax || {}); }).join('') + '<div class="paxl">' + L.paxSum + '</div>' + paxGrid(px) : paxGrid(px)) +
      (D.chips && D.chips.length ? '<div style="margin-top:12px">' + D.chips.map(function (c) { return '<span class="hon' + (c.amber ? ' amber' : '') + '">' + esc(c.text || c) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    // 링크: 왓츠앱(왼쪽 위) 할랄(오른쪽 위) 시즌(왼쪽 아래) 정산(오른쪽 아래)
    var K = D.links || {}; var HO = !!((D.greet || {}).handover);
    // 왓츠앱: 팀별 단톡방이 다르면 버튼 2개, 한 방에 다 모여 있으면(같은 주소·links.wa만) 1개
    var WAS = []; if (TR) TR.forEach(function (t) { var u = t.wa || ''; if (u && !WAS.some(function (w) { return w.u === u; })) WAS.push({ u: u, n: t.short || t.tripId }); }); if (!WAS.length && K.wa) WAS.push({ u: K.wa, n: '' });
    var SET = TR ? TR.filter(function (t) { return t.settle; }).map(function (t) { return { u: t.settle, n: t.short || t.tripId }; }) : (K.settle ? [{ u: K.settle, n: '' }] : []);
    // 2026-11-06 대표: 버튼 5개를 한 격자(투어 전 → 투어 중 → 투어 후 순)로, 설명은 격자 아래 한 번만
    h += '<h2>' + L.links + '</h2><div class="linkgrid">' +
      (WAS.length > 1 ? WAS.map(function (w) { return '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(w.u) + '">' + WA_SVG + '① ' + L.waBtn + ' — ' + esc(w.n) + '</a>'; }).join('') : WAS.length ? '<a class="btn wa" target="_blank" rel="noopener" href="' + esc(WAS[0].u) + '">' + WA_SVG + '① ' + L.waBtn + '</a>' : '<span class="btn wa dis">' + WA_SVG + L.waBtn + ' (' + L.tba + ')</span>') +
      '<button type="button" class="btn wa greet cp' + (WAS.length > 1 ? ' wide2' : '') + '" data-label="💬 ② ' + esc(HO ? L.greetHo : L.greet) + '" data-copy="' + esc(greet(D)) + '">💬 ② ' + (HO ? L.greetHo : L.greet) + '</button>' +
      (K.season ? '<a class="btn season" target="_blank" rel="noopener" href="' + esc(K.season) + '">🌸 ' + L.season + '</a>' : '') +
      (K.halal ? '<a class="btn halal' + (K.season ? '' : ' wide2') + '" target="_blank" rel="noopener" href="' + esc(halalUrl(K.halal, D)) + '">🕌 ' + L.halal + '</a>' : '') +
      SET.map(function (x) { return '<a class="btn red wide2" target="_blank" rel="noopener" href="' + esc(x.u) + '">🧾 ' + L.settle + (x.n ? ' — ' + esc(x.n) : '') + '</a>'; }).join('') + '</div>' +
      '<p class="hint linkhint">' + (K.hint ? esc(K.hint) + '<br>' : '') + (HO ? L.greetHintHo : L.greetHint) + (WAS.length > 1 ? '<br>' + L.waTwo : '') + (SET.length > 1 ? '<br>' + L.settleTwo : '') + '</p>';
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
          (K.namelists && K.namelists.length ? '<button type="button" class="btn wide nlbtn">' + L.namelist + (K.namelists.length > 1 ? ' (' + K.namelists.map(function (x) { return esc(x.n); }).join(' + ') + ')' : '') + '</button>' : K.namelist ? '<a class="btn wide" target="_blank" rel="noopener" href="' + esc(K.namelist) + '">' + L.namelist + '</a>' : '<span class="btn wide dis">' + L.nonamelist + '</span>') +
          (D.honorific && !/없음|none|해당 없|N\/A/i.test(D.honorific) ? '<p class="hint" style="margin:6px 2px 4px">👑 ' + esc(D.honorific) + '</p>' : '') +
          ((ht.map || ht.phone) ? '<div class="btnrow" style="margin-top:8px">' + (ht.map ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(ht.map) + '"><img class="nmap" src="/img/naver_map.png" alt="' + L.map + '"></a>' : '') + (ht.phone ? '<a class="btn" href="tel:' + num(ht.phone) + '">' + L.call + '</a>' : '') + '</div>' : '') + '</div>';
      });
    }
    // 날짜 카드
    h += '<h2>' + L.days + '</h2>';
    if (editOn(D)) h += '<div class="editbar">' + (CHG ? '<span class="chgnote">📅 ' + esc(CHG.at || '') + ' ' + esc(CHG.by || '') + (EN ? ' changed the schedule (reported to the office)' : ' 가이드님이 일정 변경 (회사 보고됨)') + '</span>' : '') + '<button type="button" class="btn editbtn" id="openEdit">📅 ' + (EN ? 'Change schedule' : '일정 변경하기') + '</button>' + (pendingActs().length ? '<button type="button" class="btn editbtn acts" id="openActs">📨 ' + (EN ? 'Contacts to make' : '연락할 곳') + ' ' + pendingActs().length + '</button>' : '') + '</div>';
    (D.days || []).forEach(function (d, di) {
      var meals = d.meals || {};
      function mealSpan(i, key) { var mm = meals[key]; if (!mm) return '<span class="no">' + L.meal[i] + '</span>'; if (mm.ok === false) return '<span class="no">' + L.meal[i] + (mm.txt ? ' — ' + esc(mm.txt) : ' — ' + L.free) + '</span>'; return '<span class="' + (mm.alt ? 'alt' : '') + '">' + L.meal[i] + (mm.txt ? ' ' + esc(mm.txt) : '') + '</span>'; }
      h += '<details class="day" data-d="' + esc(d.d) + '" data-loc="' + esc(d.loc || D.loc || 'SEL') + '"><summary><span class="d" data-today="' + L.today + '">' + esc(d.label) + '</span><span class="s">' + esc(d.summary) + '</span><span class="ar">▶</span></summary><div class="body">' +
        '<ul class="tl" data-d="' + esc(d.d) + '">' + (d.items || []).map(function (it, ii) { return '<li data-i="' + ii + '" data-r="' + esc(it._r || (d.d + ':' + ii)) + '"' + (it.chg ? ' class="chg"' : '') + (mealKey(it.text) && it.phone ? ' data-meal="1"' : '') + '><span class="tm">' + esc(it.tm || '') + '</span><span>' + esc(it.text) + (it.chg ? ' <span class="chgb" title="' + (EN ? 'changed by guide' : '가이드가 변경') + '">✎</span>' : '') + (it.cnote ? '<span class="x cnote">📝 ' + esc(it.cnote) + '</span>' : '') + who(it, d) + (it.x ? '<span class="x">' + nl(it.x).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</span>' : '') + (it.jt && d.joint ? jointHtml(d.joint, d, it.jt, it) : '') + '</span></li>'; }).join('') + '</ul>' +
        (D.reorder ? '<div class="reo"><button type="button" class="rbtn" data-reo="' + esc(d.d) + '">✏️ ' + (EN ? 'Change order' : '순서 바꾸기') + '</button><span class="rst" data-rst="' + esc(d.d) + '"></span></div>' : '') +
        '<div class="row"><span class="i">🍽</span><div class="meal">' + mealSpan(0, 'b') + mealSpan(1, 'l') + mealSpan(2, 'd') + '</div></div>' +
        (d.move ? '<div class="row"><span class="i">🚐</span><div>' + esc(d.move) + who(d.moveWho, d) + (d.moveSub ? '<br><span class="x">' + esc(d.moveSub) + '</span>' : '') + '</div></div>' : '') +
        (d.stay ? '<div class="row"><span class="i">🏨</span><div>' + esc(d.stay) + '</div></div>' : '') +
        (d.todo && d.todo.length ? '<div class="row"><span class="i">✅</span><ul class="todo">' + d.todo.map(function (t, ti) { return '<li data-k="' + esc(d.d + ':' + ti) + '"><label><input type="checkbox"> <span>' + esc(t) + '</span></label></li>'; }).join('') + '</ul></div>' : '') +
        (d.notes && d.notes.length ? '<div class="row"><span class="i">📝</span><div>' + d.notes.map(function (n) { return '<div style="margin-bottom:4px">' + esc(n) + '</div>'; }).join('') + '</div></div>' : '') +
        (d.warn ? '<div class="warn">' + esc(d.warn) + '</div>' : '') +
        (d.chips && d.chips.length ? '<div class="chips">' + d.chips.map(function (c) { return '<span' + (c.s ? ' class="s"' : '') + '>' + esc(c.text || c) + '</span>'; }).join('') + '</div>' : '') +
        (d.pray !== false ? '<div class="pray" data-pray="' + esc(d.d) + '" data-loc="' + esc(d.loc || D.loc || 'SEL') + '"><span class="i">☪️</span><div><b>' + L.pray + '</b> <span class="cd" data-cd></span>' + (d.prayPlace ? '<div class="pp">' + esc(d.prayPlace) + '</div>' : '') + '<div class="tm" data-tm></div></div></div>' : '') +
        '</div></details>';
    });
    // 전체 메모
    if (D.memo && D.memo.length) h += '<h2>' + L.memo + '</h2><div class="card"><ul class="memo">' + D.memo.map(function (m) { return '<li>' + esc(m).replace(/\*\*(.+?)\*\*/g, '<b class="imp">$1</b>') + '</li>'; }).join('') + '</ul></div>';
    // 비상 연락처: 회사 전화 + 비즈카톡
    var C = D.company || {};
    h += '<h2>' + L.contacts + '</h2><div class="card tel"><b>' + esc(C.name || 'ARBA Travel Korea') + '</b>' + (C.phone ? '<br>' + tel(C.phone) : '') +
      (C.kakao ? '<a class="btn kakao" target="_blank" rel="noopener" href="' + esc(C.kakao) + '">' + KA_SVG + L.kakao + '</a>' : '') + '</div>';
    h += '<p class="foot">' + L.foot + (D.issued ? ' · ' + esc(D.issued) : '') + '</p>';
    var gw = (D.guide || {}), gnm = EN ? (gw.name || '') : (gw.ko || gw.name || '');
    if (SECURE(D)) h += '<div class="secure">🔒 <b>' + (EN ? 'ARBA Travel Korea property — do not share or copy' : 'ARBA Travel Korea 자산 — 외부 공유·복제 금지') + '</b><br>' + (EN ? 'This tour voucher link was issued only to guide <b>' + esc(gnm) + '</b>. Opening it on another device is recorded. It contains guest information, restaurants and supplier contacts, so it must not be passed to anyone else or to another travel agency.' : '이 지침서는 <b>' + esc(gnm) + ' 가이드님</b>께만 발급된 링크입니다. 타인 열람시 열람 기록이 남으며 손님 정보·식당·거래처 연락처가 포함되어 있어 다른 사람이나 다른 여행사에 전달할 수 없습니다.') + '<br><span>© 2026 ARBA Travel Korea · ' + (EN ? 'Viewing closes 7 days after the tour ends.' : '투어 종료 7일 뒤 열람이 닫힙니다.') + '</span></div>';
    document.getElementById('app').innerHTML = h;
    if (SECURE(D)) watermark(D);
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
    // 식당 문자 버튼 → 예약 시간 입력(이 휴대폰 저장) → 문자에 도착 시간 자동, 일정 변경 화면에도 자동 반영 (대표 11/9 21:57)
    var IT = {}; (CUR.days || []).forEach(function (d) { (d.items || []).forEach(function (it, i) { IT[it._r || (d.d + ':' + i)] = { it: it, d: d }; }); });
    document.querySelectorAll('.tl li[data-meal]').forEach(function (li) {
      var r = li.dataset.r, saved = LS('atk:rt:' + SLUG + ':' + r), saved0 = saved; if (saved) RT[r] = saved;
      var a = li.querySelector('a[href^="sms:"]'); if (!a) return;
      function badge() { var b = li.querySelector('.rt'); if (saved) { if (!b) { b = document.createElement('span'); b.className = 'rt'; li.querySelector('span:nth-child(2)').appendChild(b); } b.textContent = (EN ? '📞 booked ' : '📞 예약 ') + saved; } else if (b) b.remove(); }
      badge();
      a.addEventListener('click', function (ev) {
        ev.preventDefault(); var x = IT[r]; if (!x) { location.href = a.getAttribute('href'); return; }
        var v = prompt(EN ? 'Arrival time for the booking (e.g. 1100 → 11:00). Leave empty if not decided.' : '예약(도착) 시간을 넣어주세요 (예: 1100 → 11:00). 아직 모르면 비워두세요.', saved || x.it.tm || '');
        if (v === null) return; var t = normTm(v); if (v.trim() && !t) { alert(EN ? 'Time format: 1100 or 11:00' : '시간은 1100 또는 11:00 형식으로 넣어주세요'); return; }
        saved = t || ''; LS('atk:rt:' + SLUG + ':' + r, saved || null); if (saved) RT[r] = saved; else delete RT[r]; badge();
        var prev = saved0 || x.it.tm || '';
        if (prev && saved && saved !== prev) { location.href = 'sms:' + num(x.it.phone) + '?&body=' + encodeURIComponent(chgTimeMsg(x.it, x.d, prev, saved)); saved0 = saved; return; }
        saved0 = saved; var c2 = JSON.parse(JSON.stringify(x.it)); if (saved) c2.tm = saved; location.href = smsHref(c2, x.d);
      });
    });
    document.addEventListener('click', function (ev) { if (ev.target.closest('#openActs')) { ev.preventDefault(); showActs(loadActs(), null); } });
    // 할 일 체크 — 이 휴대폰에 저장 (다시 열어도 유지)
    document.querySelectorAll('.todo li[data-k]').forEach(function (li) {
      var key = 'atk:' + SLUG + ':' + li.dataset.k, cb = li.querySelector('input');
      try { if (localStorage.getItem(key) === '1') { cb.checked = true; li.classList.add('done'); } } catch (e) { }
      cb.addEventListener('change', function () { li.classList.toggle('done', cb.checked); try { localStorage.setItem(key, cb.checked ? '1' : '0'); } catch (e) { } });
    });
    // ✏️ 순서 바꾸기 (D.reorder) — ▲▼로 이동, 이 휴대폰에 저장, 회사에 문자로 알리기 (2026-11-09 대표 요청, 예시 지침서부터)
    if (CUR.reorder) (function () {
      var T = EN ? { chg: 'Changed', reset: 'Reset', done: 'Done', tell: '📨 Tell the office', mv: 'Meal moved — re-confirm the restaurant booking', msg: '[Schedule change] ' } : { chg: '변경됨', reset: '원래대로', done: '완료', tell: '📨 회사에 알리기', mv: '식사 순서가 바뀜 — 식당 예약 시간 다시 확인', msg: '[일정 변경] ' };
      function key(dd) { return 'atk:order:' + SLUG + ':' + dd; }
      function apply(ul, ord) { var lis = [].slice.call(ul.children); ord.forEach(function (i) { var li = lis.filter(function (l) { return +l.dataset.i === i; })[0]; if (li) ul.appendChild(li); }); }
      function cur(ul) { return [].slice.call(ul.children).map(function (l) { return +l.dataset.i; }); }
      function changed(ul) { return cur(ul).some(function (v, i) { return v !== i; }); }
      function status(dd) { var ul = document.querySelector('.tl[data-d="' + dd + '"]'), st = document.querySelector('.rst[data-rst="' + dd + '"]'); if (!ul || !st) return; if (!changed(ul)) { st.innerHTML = ''; return; }
        var mealMoved = cur(ul).some(function (v, i) { var li = ul.children[i]; return v !== i && /^(점심|저녁|아침|Lunch|Dinner|Breakfast)/.test(li.textContent.trim()); });
        st.innerHTML = '<span class="chg">' + T.chg + '</span> <button type="button" class="rbtn" data-reset="' + dd + '">' + T.reset + '</button> <button type="button" class="rbtn tell" data-tell="' + dd + '">' + T.tell + '</button>' + (mealMoved ? '<div class="x" style="color:var(--red);font-weight:700">⚠️ ' + T.mv + '</div>' : ''); }
      document.querySelectorAll('.tl[data-d]').forEach(function (ul) { try { var o = JSON.parse(localStorage.getItem(key(ul.dataset.d)) || 'null'); if (o) apply(ul, o); } catch (e) { } status(ul.dataset.d); });
      document.addEventListener('click', function (ev) {
        var b = ev.target.closest('[data-reo],[data-reset],[data-tell],[data-up],[data-dn]'); if (!b) return; ev.preventDefault();
        var dd = b.dataset.reo || b.dataset.reset || b.dataset.tell || b.dataset.up || b.dataset.dn, ul = document.querySelector('.tl[data-d="' + dd + '"]'); if (!ul) return;
        if (b.dataset.reo) { var on = ul.classList.toggle('edit'); b.textContent = on ? '✅ ' + T.done : '✏️ ' + (EN ? 'Change order' : '순서 바꾸기');
          [].slice.call(ul.children).forEach(function (li) { var h = li.querySelector('.ud'); if (on && !h) { h = document.createElement('span'); h.className = 'ud'; h.innerHTML = '<button type="button" data-up="' + dd + '">▲</button><button type="button" data-dn="' + dd + '">▼</button>'; li.appendChild(h); } else if (!on && h) h.remove(); }); return; }
        if (b.dataset.reset) { try { localStorage.removeItem(key(dd)); } catch (e) { } apply(ul, cur(ul).slice().sort(function (a, c) { return a - c; })); status(dd); return; }
        if (b.dataset.tell) { var lines = [].slice.call(ul.children).map(function (li, i) { return (i + 1) + '. ' + (li.querySelector('.tm').textContent ? li.querySelector('.tm').textContent + ' ' : '') + li.querySelector('.tm').nextSibling.firstChild.textContent.trim(); });
          var dl = (document.querySelector('.day[data-d="' + dd + '"] summary .d') || {}).textContent || dd;
          location.href = 'sms:' + num((CUR.company || {}).phone || '') + '?&body=' + encodeURIComponent(T.msg + (CUR.tripId || '') + ' ' + dl + '\n' + ((CUR.guide || {}).name || '') + '\n' + lines.join('\n')); return; }
        var li = b.closest('li'); if (b.dataset.up && li.previousElementSibling) ul.insertBefore(li, li.previousElementSibling); if (b.dataset.dn && li.nextElementSibling) ul.insertBefore(li.nextElementSibling, li);
        try { changed(ul) ? localStorage.setItem(key(dd), JSON.stringify(cur(ul))) : localStorage.removeItem(key(dd)); } catch (e) { } status(dd);
      });
    })();
    // 기도 시간
    if (window.prayerTimes) document.querySelectorAll('.pray[data-pray]').forEach(function (p) {
      var loc = PRAYER_LOC[p.dataset.loc] || PRAYER_LOC.SEL, t = prayerTimes(loc[0], loc[1], p.dataset.pray);
      p.querySelector('[data-tm]').innerHTML = '<span class="ok">✅ Dhuhr ' + t.dhuhr + L.after + '</span><span class="dl">⛔ Maghrib ' + t.maghrib + L.before + '</span>';
      if (p.dataset.pray === ymd) { var cd = p.querySelector('[data-cd]'); var tick = function () { var now = new Date(); var left = (+t.maghrib.slice(0, 2)) * 60 + (+t.maghrib.slice(3)) - (now.getHours() * 60 + now.getMinutes()); cd.textContent = left > 0 ? '· ' + L.left + Math.floor(left / 60) + L.h + (left % 60) + L.m : '· ' + L.sunset; }; tick(); setInterval(tick, 30000); }
    });
    // 복사
    function copyText(v) { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(v); return new Promise(function (res, rej) { var t = document.createElement('textarea'); t.value = v; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); try { document.execCommand('copy') ? res() : rej(); } catch (e) { rej(e); } document.body.removeChild(t); }); }
    // 명단 여러 장(합류 투어): 버튼 한 번에 Drive 미리보기를 위아래로 (2026-11-09 대표 — 파일 내용은 Drive에만, 이 페이지엔 파일 id만)
    document.addEventListener('click', function (ev) {
      var nb = ev.target.closest('.nlbtn'), cl = ev.target.closest('.nlx');
      if (cl) { var o = document.getElementById('nlov'); if (o) o.remove(); document.body.style.overflow = ''; return; }
      if (!nb) return; var K = (CUR.links || {}).namelists || [];
      var ov = document.createElement('div'); ov.id = 'nlov'; ov.className = 'nlov';
      ov.innerHTML = '<div class="nlbar"><b>' + L.namelist + '</b><button type="button" class="nlx">✕</button></div>' + K.map(function (x) { var id = String(x.id || '').replace(/[^\w-]/g, ''); return '<div class="nlh">' + esc(x.n || '') + '</div><iframe class="nlf" src="https://drive.google.com/file/d/' + id + '/preview" allow="autoplay"></iframe><a class="nlo" target="_blank" rel="noopener" href="https://drive.google.com/file/d/' + id + '/view">' + (EN ? 'Open in new tab' : '새 창으로 열기') + ' ↗</a>'; }).join('');
      document.body.appendChild(ov); document.body.style.overflow = 'hidden';
    });
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
  /* ───────── 📅 일정 변경 (2026-11-09 대표 지시) ─────────
     원본 JSON은 그대로, 변경분(ov)만 Apps Script 스크립트 속성에 저장 → 열 때 applyChg로 덮어씀.
     ov = {days: {'2026-11-16': [{r:'2026-11-16:0', tm:'18:00', note:'…', rest:{text,contact,phone,sms,place}}, …]}} (r = 원래 날짜:순번) */
  function mealKey(t) { var m = String(t || '').match(/^(점심|저녁|아침|Lunch|Dinner|Breakfast)/); return m ? ({ 점심: 'l', Lunch: 'l', 저녁: 'd', Dinner: 'd', 아침: 'b', Breakfast: 'b' })[m[1]] : ''; }
  function mealName(t) { return String(t || '').replace(/^(점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]\s*/, '').replace(/\s*\(.*$/, '').trim(); }
  function applyChg(D, ov) {
    if (!ov || !ov.days) return;
    var M = {}; (D.days || []).forEach(function (d) { (d.items || []).forEach(function (it, i) { M[d.d + ':' + i] = it; }); });
    (D.days || []).forEach(function (d) {
      var list = ov.days[d.d]; if (!list) return;
      var before = (d.items || []).map(function (it) { return mealKey(it.text); }).join(','), items = [];
      list.forEach(function (x, i) {
        var o = M[x.r]; if (!o) return; var it = JSON.parse(JSON.stringify(o)), ch = false;
        if (x.r.split(':')[0] !== d.d || +x.r.split(':')[1] !== i) ch = true;
        if (x.tm !== undefined && x.tm !== (o.tm || '')) { it.tm = x.tm; ch = true; }
        if (x.rest) { ['text', 'contact', 'phone', 'sms', 'place', 'map', 'pick', 'nomap'].forEach(function (k) { if (x.rest[k] !== undefined) it[k] = x.rest[k]; else if (k !== 'text') delete it[k]; }); delete it.note; delete it.jt; ch = true; }
        if (x.note) { it.cnote = x.note; ch = true; }
        if (ch) it.chg = true; it._r = x.r; items.push(it);
      });
      d.items = items;
      // 식사 칸: 그날 점심·저녁 항목에서 다시
      if (items.map(function (it) { return mealKey(it.text); }).join(',') !== before || items.some(function (it) { return it.chg && mealKey(it.text); })) {
        d.meals = d.meals || {};
        ['l', 'd'].forEach(function (k) { var f = items.filter(function (it) { return mealKey(it.text) === k; })[0]; if (f) d.meals[k] = { txt: mealName(f.text) }; else if (d.meals[k] && d.meals[k].ok !== false) d.meals[k] = { txt: EN ? 'see schedule' : '일정 확인', alt: true }; });
      }
    });
  }
  // ☔ 비 예보면 합동 야외 일정(에버랜드·비발디)과 그날 합동 배달(신촌버거) 잠금 해제 (대표 11/9 21:38)
  var RAINY = {};
  function rainy(w) { if (!w) return false; var c = +w.c; return (c >= 51 && c <= 67) || (c >= 80 && c <= 82) || c >= 95 || w.mm >= 5 || w.pp >= 70; }
  function rainOpen(it, dd) { return !!(dd && RAINY[dd] && it.jt && /에버랜드|everland|비발디|vivaldi|스키|ski|신촌버거|sinchon burger/i.test(String(it.text || ''))); }
  function lockOf(it, dd) {
    if (rainOpen(it, dd)) return '';
    var t = String(it.text || '');
    if (it.lock) return EN ? 'Fixed by the office' : '회사 고정 일정';
    if (it.jt && !/^(점심|저녁|Lunch|Dinner)/.test(t)) return EN ? 'Joint with another team (tickets/order)' : '다른 팀과 합동 (발권·주문)';
    if (it.jt && /배달|delivery|김밥|gimbap/i.test(t)) return EN ? 'Joint delivery with another team' : '다른 팀과 합동 배달';
    if (/공항|airport|인천|incheon|T1 |T2 |미팅|meeting|체크인|check-in|체크아웃|check-out|콜밴|call-van|호텔 출발|hotel departure|OD\d|MH\d|AK\d|D7\d|TR\d|7C\d/i.test(t)) return EN ? 'Flight / hotel / vehicle' : '항공·호텔·차량 일정';
    return '';
  }
  function dlabel(dd) { var d = (ORIG.days || []).filter(function (x) { return x.d === dd; })[0]; return d ? d.label : dd; }
  function openEdit() {
    var O = ORIG, st = {}; // st[day] = [{r, tm, note, rest}]
    var M = {}; O.days.forEach(function (d) { d.items.forEach(function (it, i) { M[d.d + ':' + i] = it; }); });
    O.days.forEach(function (d) { st[d.d] = (CHG && CHG.days && CHG.days[d.d]) ? JSON.parse(JSON.stringify(CHG.days[d.d])) : d.items.map(function (it, i) { return { r: d.d + ':' + i }; }); });
    days_prefill: { var dk = Object.keys(st); dk.forEach(function (dd) { st[dd].forEach(function (x) { var rt = RT[x.r]; if (rt && x.tm === undefined && !(M[x.r] || {}).tm) { x.tm = rt; x.rt = true; } }); }); }
    var T = EN ? { t: '📅 Change schedule', hint: 'Drag items to reorder or move to another day. Tap an item to change time, restaurant or add a note. 🔒 = cannot change (joint tickets/orders, flights, hotel, vehicles, another guide\'s day) — call the office. ☔ = joint item unlocked by rain forecast.', pin: 'Last 4 digits of your phone', apply: 'Apply', reset: 'Back to the original schedule', close: 'Close', rest: '🍽 Change restaurant', memo: 'Note (e.g. Tom yum set 7+1)', own: 'Type a name…', done: 'Applied — the office has been notified', send: 'Please send these messages', bad: 'Wrong PIN', fail: 'Could not save. Please try again or call the office.', tm: 'Time', other: ' — guide ', otherE: '\'s day (cannot change)', ok: 'OK' }
      : { t: '📅 일정 변경', hint: '항목을 끌어서 순서·날짜를 옮기세요. 항목을 누르면 시간·식당·메모를 바꿀 수 있어요. 🔒 = 변경 불가 (합동 발권·주문, 항공, 호텔, 차량, 다른 가이드 담당일) — 회사에 전화해주세요. ☔ = 비 예보로 잠금 해제된 합동 일정.', pin: '전화번호 뒤 4자리', apply: '적용하기', reset: '원래 일정으로 되돌리기', close: '닫기', rest: '🍽 식당 바꾸기', memo: '메모 (예: 똠얌 세트 7+1)', own: '직접 입력…', done: '적용 완료 — 회사에 보고되었습니다', send: '아래 연락을 꼭 해주세요', bad: '전화번호 뒤 4자리가 맞지 않습니다', fail: '저장하지 못했습니다. 다시 시도하거나 회사로 전화해주세요.', tm: '시간', other: ' · ', otherE: ' 가이드님 담당 (변경 불가)', ok: '확인' };
    var ov = document.createElement('div'); ov.className = 'edit'; document.body.appendChild(ov); document.body.style.overflow = 'hidden'; pushOv(ov);
    var days = O.days.map(function (d) { return d.d; });
    // 다른 가이드 담당일 (day.other 또는 첫 항목 "○○ 가이드님 진행")
    var OTH = {}; O.days.forEach(function (d) { var o = d.other; if (!o) { var m = String(((d.items || [])[0] || {}).text || '').match(/^(\S+?)(\(.*?\))?\s*가이드님 진행|^Guide (.+?) runs this day/); if (m) o = m[1] || m[3]; } if (o) OTH[d.d] = o; });
    function item(x) { var o = M[x.r] || {}, it = JSON.parse(JSON.stringify(o)); if (x.tm !== undefined) it.tm = x.tm; if (x.rest) { it.text = x.rest.text; it.phone = x.rest.phone; it.pick = !!x.rest.pick; } return it; }
    function short(t) { var s = mealName(t) || String(t || ''); s = s.replace(/\s*[—–(].*$/, '').trim() || s; return s.length > 14 ? s.slice(0, 13) + '…' : s; }
    var SEL = null; // {d, i}
    function draw2() {
      var h = '<div class="eh"><b>' + T.t + '</b><button type="button" class="x2" data-a="close">✕</button></div><p class="hint">' + esc(T.hint) + '</p><div class="eg">';
      days.forEach(function (dd) {
        var oth = OTH[dd];
        h += '<div class="erow' + (oth ? ' oth' : '') + '"><div class="edl">' + esc(dlabel(dd)).replace(' ', '<br>') + (WX[dd] ? '<span class="ewx">' + wxIcon(WX[dd].c) + '</span>' : '') + '</div><div class="eli" data-d="' + dd + '">';
        st[dd].forEach(function (x, i) {
          var it = item(x), lk = oth ? 'oth' : lockOf(M[x.r] || {}, x.r.split(':')[0]), rn = !lk && rainOpen(M[x.r] || {}, x.r.split(':')[0]), moved = x.r.split(':')[0] !== dd, mk = mealKey(it.text), ch = moved || x.tm !== undefined || x.rest || x.note;
          h += '<div class="ec2' + (lk ? ' lk' : '') + (mk ? ' ml' : '') + (it.pick ? ' pk' : '') + (ch ? ' ch' : '') + (SEL && SEL.d === dd && SEL.i === i ? ' sel' : '') + '" data-r="' + esc(x.r) + '" data-d="' + dd + '" data-i="' + i + '">' + (it.tm ? '<small>' + esc(it.tm) + '</small>' : '') + (lk && !oth ? '🔒' : rn ? '☔' : '') + esc(short(it.text)) + (x.note ? ' 📝' : '') + '</div>';
        });
        h += '</div></div>';
        if (oth) h += '<div class="eoth">' + esc(dlabel(dd)) + T.other + esc(oth) + T.otherE + '</div>';
      });
      h += '</div><div id="edet"></div>';
      h += '<div class="ef"><input id="epin" inputmode="numeric" maxlength="4" placeholder="' + esc(T.pin) + '"><div id="emsg"></div><button type="button" class="btn apply" data-a="apply">' + T.apply + '</button>' +
        '<div class="erst"><button type="button" class="lnk" data-a="undo">' + (EN ? '↩ Undo changes on this screen' : '↩ 이 화면에서 바꾼 것 되돌리기') + '</button>' + (CHG ? '<button type="button" class="lnk" data-a="reset">' + (EN ? '🏢 Back to the office schedule (cancel saved changes)' : '🏢 회사 원래 일정으로 (저장된 변경 모두 취소)') + '</button>' : '') + '</div></div>';
      var pin = (document.getElementById('epin') || {}).value || '';
      ov.innerHTML = h; document.getElementById('epin').value = pin;
      if (window.Sortable) [].slice.call(ov.querySelectorAll('.eli')).forEach(function (el) {
        var oth = !!OTH[el.dataset.d];
        Sortable.create(el, { group: { name: 'days', pull: !oth, put: !oth }, disabled: oth, animation: 150, delay: 120, delayOnTouchOnly: true, filter: '.lk', preventOnFilter: false, ghostClass: 'ghost', onMove: function (ev) { return !ev.related.classList.contains('lk'); },
          onEnd: function () { var old = {}; days.forEach(function (d) { st[d].forEach(function (x) { old[x.r] = x; }); }); days.forEach(function (d) { var e = ov.querySelector('.eli[data-d="' + d + '"]'); st[d] = [].slice.call(e.children).map(function (c) { return old[c.dataset.r]; }); }); SEL = null; draw2(); } });
      });
      if (SEL) det();
    }
    function det() {
      var x = st[SEL.d][SEL.i], it = item(x), o = M[x.r] || {}, lk = OTH[SEL.d] ? T.other + OTH[SEL.d] + T.otherE : lockOf(o, x.r.split(':')[0]), mk = mealKey(it.text), box = document.getElementById('edet');
      var h = '<div class="edt"><b>' + esc(dlabel(SEL.d)) + ' · ' + esc(it.text) + '</b>';
      if (lk) h += '<div class="lkr">🔒 ' + esc(lk) + '</div>';
      else if (rainOpen(o, x.r.split(':')[0])) h += '<div class="pkh">☔ ' + (EN ? 'Rain forecast — unlocked. If you move it, you must tell the joint guide (button after applying).' : '비 예보로 잠금 해제 — 옮기면 합동 가이드님께 꼭 알려 일정을 같이 조율해주세요 (적용 후 문자 버튼).') + '</div>';
      else {
        h += '<label>' + T.tm + ' <input class="tmi" data-a="tm" inputmode="numeric" value="' + esc(it.tm || '') + '" placeholder="1100"></label>';
        if (mk) { var dl0 = (O.days.filter(function (d) { return d.d === SEL.d; })[0] || {}).loc || O.loc || 'SEL', RG = { SEL: ['seoul', 'outer'], JJU: ['jeju'], BUS: ['busan'] }[dl0] || ['seoul', 'outer'];
          if (it.pick && !x.rest) h += '<div class="pkh">' + (EN ? '👉 Once you decide, pick the restaurant below — it is reported to the office.' : '👉 식당을 정하면 아래에서 골라주세요 — 회사에 보고됩니다.') + '</div>';
          h += '<select data-a="rest"><option value="">' + T.rest + '</option>' + (window.HALAL_CONTACTS || []).map(function (r, ri) { return RG.indexOf(r.g) >= 0 ? '<option value="' + ri + '">' + esc(r.n) + '</option>' : ''; }).join('') + '<option value="pick">' + (EN ? '🧭 Guide\'s choice (decide on site)' : '🧭 가이드 선택 (현장에서 결정)') + '</option><option value="own">' + T.own + '</option></select>'; }
        h += '<input class="memo" data-a="note" value="' + esc(x.note || '') + '" placeholder="' + esc(T.memo) + '">';
      }
      h += '<button type="button" class="btn ok" data-a="desel">' + T.ok + '</button></div>';
      box.innerHTML = h; box.scrollIntoView({ block: 'nearest' });
    }
    var SNAP = JSON.stringify(st), WX = {};
    weather(O.loc || 'SEL').then(function (W) { days.forEach(function (dd) { if (W[dd]) { WX[dd] = W[dd]; if (rainy(W[dd])) RAINY[dd] = 1; } }); draw2(); });
    function loadSortable(cb) { if (window.Sortable) return cb(); var s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.2/Sortable.min.js'; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
    loadSortable(draw2); draw2();
    ov.addEventListener('change', function (ev) {
      var e = ev.target, a = e.dataset.a; if (!a || !SEL) return; var x = st[SEL.d][SEL.i];
      if (a === 'tm') { var tv = normTm(e.value); if (e.value.trim() && !tv) { alert(EN ? 'Time format: 1100 or 11:00' : '시간은 1100 또는 11:00 형식으로 넣어주세요'); draw2(); return; } x.tm = tv; if (x.rt && tv !== RT[x.r]) delete x.rt; draw2(); }
      if (a === 'note') { x.note = e.value.trim(); if (!x.note) delete x.note; draw2(); }
      if (a === 'rest') { var o = M[x.r], pre = (String(o.text).match(/^(점심|저녁|아침|Lunch|Dinner|Breakfast)\s*[—–-]\s*/) || [''])[0], r;
        if (e.value === 'own') { var nm = prompt(EN ? 'Restaurant name' : '식당 이름'); if (!nm) { draw2(); return; } var ph = prompt(EN ? 'Phone (optional)' : '전화번호 (없으면 비워두기)') || ''; r = { n: nm, p: ph, s: /^01/.test(ph.replace(/\D/g, '')) }; }
        else if (e.value === 'pick') { x.rest = { text: pre + (EN ? "Guide's choice (halal street)" : '가이드 선택 (할랄거리)'), pick: true, nomap: true }; draw2(); return; }
        else if (e.value !== '') r = window.HALAL_CONTACTS[+e.value];
        if (r) x.rest = { text: pre + r.n, contact: r.c || '', phone: r.p || '', sms: !!r.s, place: r.n }; draw2(); }
    });
    ov.addEventListener('click', function (ev) {
      var c = ev.target.closest('.ec2'); if (c) { SEL = { d: c.dataset.d, i: +c.dataset.i }; draw2(); return; }
      var b = ev.target.closest('[data-a]'); if (!b || b.tagName === 'SELECT' || b.tagName === 'INPUT') return; var a = b.dataset.a;
      if (a === 'desel') { SEL = null; draw2(); return; }
      if (a === 'undo') { st = JSON.parse(SNAP); SEL = null; draw2(); var m0 = document.getElementById('emsg'); if (m0) m0.textContent = EN ? 'Restored to the schedule before this screen.' : '이 화면을 열기 전 일정으로 되돌렸습니다.'; return; }
      if (a === 'close') { backOv(ov); return; }
      if (a === 'apply' || a === 'reset') send(a === 'reset');
    });
    function diffWarn() {
      var diff = [], warn = [], acts = [], imp = false, px = mealPx(CUR), tl = +px.tl || 0, inf = +px.inf || 0, gn = (CUR.guide || {}).name || '';
      var JG = {}; // 합동 가이드별 묶음 {guide, phone, title, lines[], rain}
      days.forEach(function (dd) {
        var origOrder = O.days.filter(function (d) { return d.d === dd; })[0].items.map(function (it, i) { return dd + ':' + i; }).join(','), now = st[dd].map(function (x) { return x.r; }).join(',');
        st[dd].forEach(function (x) {
          var o = M[x.r] || {}, od = x.r.split(':')[0], it = item(x), ch = [], moved = od !== dd, prevTm = RT[x.r] || o.tm || '', tmCh = x.tm !== undefined && x.tm !== (o.tm || ''), tmReal = x.tm !== undefined && !x.rt && x.tm !== prevTm, mk = mealKey(o.text);
          if (moved) ch.push(dlabel(od) + ' → ' + dlabel(dd));
          if (tmCh) ch.push((EN ? 'time ' : '시간 ') + (x.tm || '-') + (x.rt ? (EN ? ' (booked)' : ' (예약)') : ''));
          if (x.rest) ch.push(mealName(o.text) + ' → ' + mealName(x.rest.text));
          if (x.note) ch.push((EN ? 'note: ' : '메모: ') + x.note);
          if (!ch.length) return;
          diff.push(dlabel(od) + ' ' + o.text + ' — ' + ch.join(' · '));
          var J = (O.days.filter(function (d) { return d.d === od; })[0] || {}).joint;
          if (o.jt && J && J.phone && (moved || x.rest || (tmCh && !x.rt))) {
            imp = true; var key = num(J.phone), g = JG[key] || (JG[key] = { guide: J.guide, phone: J.phone, title: short(o.text), date: od, lines: [], rain: false });
            if (RAINY[od]) g.rain = true;
            g.lines.push('· ' + short(o.text) + ': ' + fmtD(od) + (moved ? ' → ' + fmtD(dd) : '') + (tmCh ? ' ' + (x.tm || '') : '') + (x.rest ? ' → ' + mealName(x.rest.text) : ''));
          }
          // 식당 연락: 날짜·식당·시간이 바뀐 경우 (예약 시간 기록만 한 것은 제외)
          if (mk && o.phone && !o.pick && !moved && !x.rest && tmReal && !prevTm && x.tm) { acts.push({ k: 'b:' + x.r, t: (EN ? 'Book: ' : '예약 문자: ') + mealName(o.text), sub: (o.contact || '') + ' ' + (o.phone || ''), phone: o.phone, body: window.ATK_SMS({ en: EN, name: gn, date: new Date(dd + 'T00:00:00'), meal: mk.toUpperCase(), guests: (+px.total || 0) - tl - inf, tl: tl, inf: inf, time: x.tm }) }); }
          else if (mk && o.phone && !o.pick && (moved || x.rest || (tmReal && prevTm))) {
            var who = EN ? 'Hello,\nThis is ' + gn + ', tour guide from ARBA Travel.\n' : '안녕하세요\n아르바트래블 ' + gn + ' 가이드입니다.\n';
            var mealW = EN ? ({ b: 'breakfast', l: 'lunch', d: 'dinner' })[mk] : ({ b: '아침', l: '점심', d: '저녁' })[mk];
            var pxL = EN ? 'Pax: ' + ((+px.total || 0) - tl - inf + tl + 1) + ' (' + ((+px.total || 0) - tl - inf) + ' guests' + (tl ? ' + ' + tl + ' tour leader' : '') + ' + 1 guide)' : '인원: 총 ' + ((+px.total || 0) - tl - inf + tl + 1) + '명 (손님 ' + ((+px.total || 0) - tl - inf) + '명' + (tl ? ' + 인솔자 ' + tl + '명' : '') + ' + 가이드 1명)';
            var body = x.rest
              ? who + (EN ? 'Please cancel our booking for ' + fmtD(od) + ' ' + mealW + '. (schedule change)\nSorry for the trouble, thank you!' : fmtD(od) + ' ' + mealW + ' 예약을 취소 부탁드립니다. (일정 변경)\n죄송합니다. 감사합니다!')
              : who + (EN ? 'Please change our booking.\n\nFrom: ' + fmtD(od) + ' ' + mealW + (prevTm ? ' ' + prevTm : '') + '\nTo: ' + fmtD(dd) + ' ' + mealW + (x.tm || it.tm ? ' ' + (x.tm || it.tm) : '') + '\n' + pxL + '\n\nPlease confirm. Thank you!'
                : '예약 변경 부탁드립니다.\n\n기존: ' + fmtD(od) + ' ' + mealW + (prevTm ? ' ' + prevTm : '') + '\n변경: ' + fmtD(dd) + ' ' + mealW + (x.tm || it.tm ? ' ' + (x.tm || it.tm) : '') + '\n' + pxL + '\n\n확인 부탁드립니다. 감사합니다!');
            acts.push({ k: 'r:' + x.r, t: (x.rest ? (EN ? 'Cancel: ' : '예약 취소: ') : (EN ? 'Change booking: ' : '예약 변경: ')) + mealName(o.text), sub: (o.contact || '') + ' ' + (o.phone || ''), phone: o.phone, body: body });
          }
          if (x.rest && x.rest.phone) acts.push({ k: 'n:' + x.r, t: (EN ? 'New booking: ' : '새 식당 예약: ') + mealName(x.rest.text), sub: (x.rest.contact || '') + ' ' + x.rest.phone, phone: x.rest.phone, body: window.ATK_SMS({ en: EN, name: gn, date: new Date(dd + 'T00:00:00'), meal: mk.toUpperCase(), guests: (+px.total || 0) - tl - inf, tl: tl, inf: inf, time: x.tm || it.tm || '' }) });
          if (/하루 전|1 day ahead|halal preparation/i.test((o.note || '') + (o.jt || '')) && (moved || x.rest)) { var days2 = (new Date(dd + 'T00:00:00') - new Date(new Date().toDateString())) / 864e5; if (days2 < 2) warn.push((EN ? 'Halal needs a booking 1 day ahead — ' : '할랄은 하루 전 예약 필수 — ') + mealName(o.text) + (EN ? ': too late?' : ': 시간이 부족할 수 있어요')); }
        });
        var movedIO = st[dd].some(function (x) { return x.r.split(':')[0] !== dd; }) || O.days.filter(function (d) { return d.d === dd; })[0].items.some(function (it, i) { return !st[dd].some(function (x) { return x.r === dd + ':' + i; }); });
        if (origOrder !== now && !movedIO) diff.push(dlabel(dd) + (EN ? ' order: ' : ' 순서: ') + st[dd].map(function (x) { return mealName(item(x).text) || item(x).text; }).join(' → '));
      });
      // 합동 가이드 문자 — 가이드 한 명당 한 통 (맨 앞)
      Object.keys(JG).forEach(function (k) {
        var g = JG[k], body = EN
          ? 'Hello ' + g.guide + ',\nThis is ' + gn + ', the guide joining you at ' + g.title + ' on ' + fmtD(g.date) + '.\n\n' + (g.rain ? '☔ Rain is forecast, so I would like to move:' : 'Our schedule has changed:') + '\n' + g.lines.join('\n') + '\n\nThe joint tickets / order need to move too — could we arrange it together? Thank you!'
          : '안녕하세요 ' + g.guide + ' 가이드님\n' + fmtD(g.date) + ' ' + g.title + ' 같이 가는 ' + gn + ' 가이드입니다.\n\n' + (g.rain ? '☔ 비 예보로 아래 일정을 옮기려고 합니다.' : '아래 일정이 바뀌었습니다.') + '\n' + g.lines.join('\n') + '\n\n합동 발권·주문도 같이 옮겨야 해서 일정 조율 부탁드립니다. 감사합니다!';
        acts.unshift({ k: 'j:' + k, t: '🤝 ' + g.guide + (EN ? ' (joint guide)' : ' 가이드님 (합동)'), sub: g.phone, phone: g.phone, body: body, joint: true });
        warn.push((g.rain ? '☔ ' : '') + (EN ? 'Joint schedule changed — tell ' + g.guide : '합동 일정 변경 — ' + g.guide + ' 가이드님께 꼭 알려주세요'));
      });
      return { diff: diff, warn: warn, acts: acts, imp: imp };
    }
    function send(reset) {
      var pin = (document.getElementById('epin').value || '').replace(/\D/g, ''), msg = document.getElementById('emsg');
      if (pin.length !== 4) { msg.textContent = (EN ? '⬆ Enter the last 4 digits of your phone first' : '⬆ 먼저 전화번호 뒤 4자리를 넣어주세요'); var pe = document.getElementById('epin'); if (pe) pe.focus(); return; }
      if (reset && !confirm(EN ? 'Cancel all saved changes and go back to the office schedule?' : '저장된 변경을 모두 취소하고 회사가 정한 원래 일정으로 되돌릴까요?')) return;
      if (!reset) { var bad = []; days.forEach(function (dd) { var c = {}; st[dd].forEach(function (x) { var k = mealKey(item(x).text); if (k) c[k] = (c[k] || 0) + 1; }); Object.keys(c).forEach(function (k) { if (c[k] > 1) bad.push(dlabel(dd) + ' ' + (EN ? { b: 'breakfast', l: 'lunch', d: 'dinner' }[k] : { b: '아침', l: '점심', d: '저녁' }[k]) + ' ' + c[k] + (EN ? '' : '곳')); }); });
        if (bad.length) { msg.textContent = (EN ? '❌ Only one restaurant per meal: ' : '❌ 한 끼에 식당은 한 곳만 — ') + bad.join(', ') + (EN ? '. Move one to another day.' : '. 하나를 다른 날로 옮겨주세요.'); return; } }
      var W = reset ? { diff: [], warn: [], acts: [], imp: !!(CHG && CHG.imp) } : diffWarn();
      if (!reset && !W.diff.length) { backOv(ov); return; }
      var body = { act: 'chg', slug: SLUG, pin: pin, ov: reset ? null : { v: 1, days: st, imp: W.imp }, diff: W.diff, warn: W.warn, imp: W.imp };
      msg.textContent = '…';
      fetch(API, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.ok) { msg.textContent = j.error === 'pin' ? T.bad : T.fail; return; }
        saveActs(reset ? [] : W.acts);
        closeOv(ov);
        if (W.acts.length || W.warn.length) { try { history.replaceState({}, ''); } catch (e) { } OVS.length = 0; showActs(W.acts, W.warn, true); } else { try { history.back(); } catch (e) { } render(SLUG); }
      }).catch(function () { msg.textContent = T.fail; });
    }
  }
  // 📅 일정 변경하기 기본 켜짐: 11/13 이후 입국 팀(A안 지침서) + 투어 안 끝남. edit:false 로 끄기, edit:true 로 강제 (대표 11/9 22:35)
  function editOn(D) { if (D.edit === false) return false; if (D.edit === true) return true; var ds = D.days || []; if (!ds.length) return false; var tdy = new Date(); var today = tdy.getFullYear() + '-' + ('0' + (tdy.getMonth() + 1)).slice(-2) + '-' + ('0' + tdy.getDate()).slice(-2); return ds[0].d >= '2026-11-13' && ds[ds.length - 1].d >= today && !D.draft; }
  // 뒤로가기 = 화면 닫기 (지침서 밖으로 나가지 않게, 대표 11/9 22:18)
  var OVS = [];
  function pushOv(ov) { OVS.push(ov); try { history.pushState({ atkov: OVS.length }, ''); } catch (e) { } }
  function closeOv(ov) { var i = OVS.indexOf(ov); if (i >= 0) OVS.splice(i, 1); ov.remove(); document.body.style.overflow = ''; }
  window.addEventListener('popstate', function () { var ov = OVS.pop(); if (ov) { ov.remove(); document.body.style.overflow = ''; if (ov.className.indexOf('acts') >= 0) render(SLUG); } });
  function backOv(ov) { if (OVS.indexOf(ov) >= 0) history.back(); else closeOv(ov); }
  // ───── 적용 후 연락 목록 (체크하면 취소선, 이 휴대폰에 저장) ─────
  function loadActs() { try { return JSON.parse(LS('atk:acts:' + SLUG) || '[]'); } catch (e) { return []; } }
  function saveActs(a) { LS('atk:acts:' + SLUG, a.length ? JSON.stringify(a) : null); }
  function pendingActs() { return loadActs().filter(function (a) { return !a.done; }); }
  function showActs(acts, warn, fresh) {
    var ov = document.createElement('div'); ov.className = 'edit acts'; document.body.appendChild(ov); document.body.style.overflow = 'hidden'; pushOv(ov);
    function draw3() {
      var h = '<div class="eh"><b>' + (fresh ? '✅ ' + (EN ? 'Applied — ' : '적용 완료 — ') : '📨 ') + (EN ? 'Contacts to make' : '연락할 곳') + '</b><button type="button" class="x2" data-a="close3">✕</button></div>';
      if (fresh && (!acts || !acts.length)) h += '<p class="hint">' + (EN ? 'Reported to the office.' : '회사에 보고되었습니다.') + '</p>';
      if (warn && warn.length) h += '<div class="ew">' + warn.map(function (w) { return '⚠️ ' + esc(w); }).join('<br>') + '</div>';
      if (acts && acts.length) h += '<p class="hint">' + (EN ? 'Tap 💬 to send. Tick the box when done.' : '💬 눌러서 보내고, 연락이 끝나면 체크해주세요.') + '</p>';
      (acts || []).forEach(function (a, i) {
        h += '<div class="act' + (a.done ? ' done' : '') + (a.joint ? ' joint' : '') + '"><label class="act-h"><input type="checkbox" data-i="' + i + '"' + (a.done ? ' checked' : '') + '><span><b>' + esc(a.t) + '</b><small>' + esc(a.sub || '') + '</small></span></label>' +
          '<pre class="act-b">' + esc(a.body) + '</pre><a class="btn act-s" href="sms:' + num(a.phone) + '?&body=' + encodeURIComponent(a.body) + '">💬 ' + (EN ? 'Send SMS' : '문자 보내기') + '</a></div>';
      });
      h += '<div class="ef"><button type="button" class="btn apply" data-a="close3">' + (EN ? 'Close' : '닫기') + '</button></div>';
      ov.innerHTML = h;
    }
    draw3();
    ov.addEventListener('change', function (ev) { var cb = ev.target; if (cb.type !== 'checkbox') return; acts[+cb.dataset.i].done = cb.checked; saveActs(acts); draw3(); });
    ov.addEventListener('click', function (ev) { if (ev.target.closest('[data-a="close3"]')) { if (OVS.indexOf(ov) >= 0) history.back(); else { closeOv(ov); render(SLUG); } } });
  }
  document.addEventListener('click', function (ev) { if (ev.target.closest('#openEdit')) { ev.preventDefault(); openEdit(); } });
  window.ATK = { render: render };
})();
