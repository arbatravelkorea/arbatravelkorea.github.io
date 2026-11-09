/* 식당 예약 문자 기본 양식 — 투어지침서(app.js)·할랄 식당 리스트 공용 (2026-11-09 대표 지시)
   o = {en, name, date(Date|null), meal('B'|'L'|'D'|''), guests, tl, inf, dl(배달), hotel, addr, time} */
(function () {
  var WK = ['일', '월', '화', '수', '목', '금', '토'], WE = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], ME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function form(o) {
    var en = !!o.en, dt = o.date, n = o.guests, tl = +o.tl || 0, inf = +o.inf || 0, has = n != null && n !== '' && !isNaN(n);
    var tot = has ? (+n + tl + 1) : '';
    var meal = { B: en ? 'Breakfast' : '아침', L: en ? 'Lunch' : '점심', D: en ? 'Dinner' : '저녁' }[o.meal] || '';
    var ds = dt ? (en ? WE[dt.getDay()] + ', ' + dt.getDate() + ' ' + ME[dt.getMonth()] : (dt.getMonth() + 1) + '월 ' + dt.getDate() + '일(' + WK[dt.getDay()] + ')') : (en ? '(date)' : '   월   일(  )');
    var day = ds + (meal ? (en ? ' — ' : ' ') + meal : '');
    var br = has ? (en ? '(' + n + ' guests' + (tl ? ' + ' + tl + ' tour leader' : '') + ' + 1 guide)' : '(손님 ' + n + '명' + (tl ? ' + 인솔자 ' + tl + '명' : '') + ' + 가이드 1명)') : (en ? '(guests + tour leader + 1 guide)' : '(손님   명 + 인솔자   명 + 가이드 1명)');
    var X = o.extra, xg = X ? (+X.guests || 0) + (+X.tl || 0) + 1 : 0; if (X) tot = (tot || 0) + xg;
    var xL = X ? (en ? '\n+ ' + X.label + ': ' + X.guests + ' guests' + (X.tl ? ' + ' + X.tl + ' tour leader' : '') + ' + 1 guide (joint booking)' : '\n+ ' + X.label + ' 팀 ' + X.guests + '명' + (X.tl ? ' + 인솔자 ' + X.tl + '명' : '') + ' + 가이드 1명 (합동 예약)') : '';
    var infL = inf ? (en ? '\n※ ' + inf + ' infant' + (inf > 1 ? 's' : '') + ' not included (no meal)' : '\n※ 유아 ' + inf + '명 별도 (식사 없음)') : '';
    if (en) {
      return 'Hello,\nThis is ' + (o.name || '') + ', tour guide from ARBA Travel.\n' + (o.dl ? 'I would like to order a delivery as below.' : 'I would like to make a reservation as below.') + '\n\n' + day +
        (o.dl ? '\n- Quantity: ' + (tot || '   ') + ' sets\n' + br + xL + infL + '\n- Deliver to: ' + (o.hotel || '') + (o.addr ? '\n' + o.addr : '') + '\n- Delivery time: ' + (o.time ? 'by ' + o.time : '')
              : '\n- Total: ' + (tot || '   ') + ' pax\n' + br + xL + infL + '\n- Arrival time: ' + (o.time || '')) +
        '\n\nPlease confirm. Thank you!';
    }
    return '안녕하세요\n아르바트래블 ' + (o.name || '') + ' 가이드입니다.\n아래와 같이 ' + (o.dl ? '배달 ' : '') + '예약 부탁드립니다.\n\n' + day +
      (o.dl ? '\n- 수량: 총 ' + (tot || '   ') + '인분\n' + br + xL + infL + '\n- 배달 장소: ' + (o.hotel || '') + (o.addr ? '\n' + o.addr : '') + '\n- 배달 시간: ' + (o.time ? o.time + '까지' : '')
            : '\n- 인원: 총 ' + (tot || '   ') + '명\n' + br + xL + infL + '\n- 도착 예정: ' + (o.time || '')) +
      '\n\n확인 부탁드립니다. 감사합니다!';
  }
  window.ATK_SMS = form;
})();
