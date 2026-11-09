#!/usr/bin/env python3
"""공항 피켓(사인보드) 페이지 — A4 가로, 흰 바탕, ARBA 로고만 빨강, 손님 이름 검정.
사용: PT python3 make_sign.py "<Trip ID 또는 손님 이름>" <슬러그> <repo 경로>
     JT python3 make_sign.py "JT|<상품명(화면엔 안 씀)>|<가이드 영문>|<버스 번호>" <슬러그> <repo 경로>  (단체 미팅보드 — 11/9부터 로고·GUIDE·BUS만)
 → <repo>/v/<슬러그>/sign/index.html  (주소: https://arbatravelkorea.github.io/v/<슬러그>/sign/)
이름 규칙(guest_title.py): 'Trip ID 숫자_'·괄호 부분 빼고, 이름 앞 Title(Puan·Datin·Dato'·Dr. 등)은 유지, Bin/Binti 뒤 생략, 대문자.
GitHub에는 손님 이름·로고만 올라감 (명단·여권 정보 없음).
"""
import base64, html, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))


sys.path.insert(0, HERE)
from guest_title import sign_name  # Title(Puan·Datin·Dato' 등)은 앞에 유지, Bin/Binti 뒤 생략


def build(name: str) -> str:
    logo = base64.b64encode(open(os.path.join(HERE, 'logo_red.png'), 'rb').read()).decode()
    n = html.escape(name)
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{n} — ARBA 공항 피켓</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css">
<style>
@page {{ size: A4 landscape; margin: 0 }}
* {{ box-sizing: border-box }}
html, body {{ margin: 0; background: #E9E6E4; font-family: Pretendard, "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif }}
.bar {{ position: sticky; top: 0; z-index: 2; display: flex; gap: 10px; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: #fff; border-bottom: 1px solid #ddd }}
.bar p {{ margin: 0; font-size: 13px; color: #555; line-height: 1.4 }}
.bar button {{ flex: none; min-height: 44px; padding: 0 18px; border-radius: 10px; border: 1.5px solid #BE1E2D; background: #fff;
  color: #111; font: 700 16px Pretendard, system-ui, sans-serif; cursor: pointer }}
.wrap {{ padding: 16px; overflow: hidden }}
.frame {{ margin: 0 auto; position: relative }}
.sheet {{ position: absolute; left: 0; top: 0; width: 1123px; height: 794px; background: #fff; transform-origin: 0 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.15) }}
.logo {{ position: absolute; left: 50%; top: 83px; width: 359px; transform: translateX(-50%) }}
.name {{ position: absolute; left: 68px; right: 68px; top: 250px; bottom: 68px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; color: #000; font-weight: 800; line-height: 1.08; text-align: center; white-space: nowrap }}
@media print {{
  html, body {{ background: #fff }}
  .bar {{ display: none }}
  .wrap {{ padding: 0 }}
  .frame {{ width: 297mm !important; height: 210mm !important }}
  .sheet {{ transform: none !important; box-shadow: none; width: 297mm; height: 210mm }}
}}
</style></head>
<body>
<div class="bar"><p>A4 <b>가로</b>로 인쇄하세요.<br>컬러 인쇄면 로고만 빨강으로 나옵니다.</p>
<button type="button" onclick="window.print()">인쇄하기</button></div>
<div class="wrap"><div class="frame" id="frame"><div class="sheet" id="sheet">
<img class="logo" src="data:image/png;base64,{logo}" alt="ARBA TRAVEL">
<div class="name" id="name" data-name="{n}"></div>
</div></div></div>
<script>
(function () {{
  var box = document.getElementById('name'), full = box.dataset.name, words = full.split(' ');
  var W = 1123 - 136, H = 794 - 250 - 68, cv = document.createElement('canvas').getContext('2d');
  function wid(t) {{ cv.font = '800 100px Pretendard, "Noto Sans KR", sans-serif'; return cv.measureText(t).width; }}
  function fit() {{
    var cands = [[full]];
    for (var i = 1; i < words.length; i++) cands.push([words.slice(0, i).join(' '), words.slice(i).join(' ')]);
    var best = null;
    cands.forEach(function (ls) {{
      var w = Math.max.apply(null, ls.map(wid));
      var s = Math.min(W / w * 100, H / (ls.length * 1.08), 227);
      if (!best || s > best.s + 0.5) best = {{ s: s, ls: ls }};
    }});
    box.style.fontSize = Math.floor(best.s) + 'px';
    box.innerHTML = best.ls.map(function (l) {{ var d = document.createElement('div'); d.textContent = l; return d.outerHTML; }}).join('');
  }}
  function scale() {{
    var avail = Math.min(document.documentElement.clientWidth - 32, 1123), k = avail / 1123, f = document.getElementById('frame');
    f.style.width = avail + 'px'; f.style.height = (794 * k) + 'px';
    document.getElementById('sheet').style.transform = 'scale(' + k + ')';
  }}
  fit(); scale();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener('resize', scale);
}})();
</script>
</body></html>
'''



def build_jt(product: str, guide: str, bus: str = '') -> str:
    """단체(JT) 미팅보드: 로고 크게 · GUIDE <영문 이름> 크게 · BUS <차량번호>(받았을 때만, 얇은 테두리 박스).
    2026-11-09 대표: 상품명(패키지명)은 넣지 않음 — product 인자는 호환용으로만 받고 화면에 쓰지 않음 (합류 투어도 같음)."""
    logo = base64.b64encode(open(os.path.join(HERE, 'logo_red.png'), 'rb').read()).decode()
    P, G, B = html.escape(product.upper()), html.escape('GUIDE  ' + guide.upper()), html.escape(bus)
    busbox = f'<div class="bus" data-t="BUS  {B}">BUS&nbsp;&nbsp;{B}</div>' if bus else ''
    return f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>{G} — ARBA 미팅보드</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css">
<style>
@page {{ size: A4 landscape; margin: 0 }}
* {{ box-sizing: border-box }}
html, body {{ margin: 0; background: #E9E6E4; font-family: Pretendard, "Noto Sans KR", "Malgun Gothic", system-ui, sans-serif }}
.bar {{ position: sticky; top: 0; z-index: 2; display: flex; gap: 10px; align-items: center; justify-content: space-between;
  padding: 12px 16px; background: #fff; border-bottom: 1px solid #ddd }}
.bar p {{ margin: 0; font-size: 13px; color: #555; line-height: 1.4 }}
.bar button {{ flex: none; min-height: 44px; padding: 0 18px; border-radius: 10px; border: 1.5px solid #BE1E2D; background: #fff;
  color: #111; font: 700 16px Pretendard, system-ui, sans-serif; cursor: pointer }}
.wrap {{ padding: 16px; overflow: hidden }}
.frame {{ margin: 0 auto; position: relative }}
.sheet {{ position: absolute; left: 0; top: 0; width: 1123px; height: 794px; background: #fff; transform-origin: 0 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.15) }}
.logo {{ position: absolute; left: 50%; top: 60px; width: 605px; transform: translateX(-50%) }}
.body {{ position: absolute; left: 68px; right: 68px; top: 275px; bottom: 45px; display: flex; flex-direction: column;
  align-items: center; justify-content: space-evenly; color: #000; font-weight: 800; white-space: nowrap; line-height: 1 }}
.bus {{ border: 2.6px solid #000; border-radius: 15px; padding: 16px 48px; font-size: 72px }}
@media print {{
  html, body {{ background: #fff }}
  .bar {{ display: none }}
  .wrap {{ padding: 0 }}
  .frame {{ width: 297mm !important; height: 210mm !important }}
  .sheet {{ transform: none !important; box-shadow: none; width: 297mm; height: 210mm }}
}}
</style></head>
<body>
<div class="bar"><p>A4 <b>가로</b>로 인쇄하세요.<br>컬러 인쇄면 로고만 빨강으로 나옵니다.</p>
<button type="button" onclick="window.print()">인쇄하기</button></div>
<div class="wrap"><div class="frame" id="frame"><div class="sheet" id="sheet">
<img class="logo" src="data:image/png;base64,{logo}" alt="ARBA TRAVEL">
<div class="body"><div class="fit" data-cap="130">{G}</div>{busbox}</div>
</div></div></div>
<script>
(function () {{
  var cv = document.createElement('canvas').getContext('2d'), W = 987;
  function fit() {{
    document.querySelectorAll('.fit').forEach(function (el) {{
      cv.font = '800 100px Pretendard, "Noto Sans KR", sans-serif';
      var w = cv.measureText(el.textContent).width;
      el.style.fontSize = Math.floor(Math.min(W / w * 100, +el.dataset.cap)) + 'px';
    }});
  }}
  function scale() {{
    var avail = Math.min(document.documentElement.clientWidth - 32, 1123), k = avail / 1123, f = document.getElementById('frame');
    f.style.width = avail + 'px'; f.style.height = (794 * k) + 'px';
    document.getElementById('sheet').style.transform = 'scale(' + k + ')';
  }}
  fit(); scale();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  window.addEventListener('resize', scale);
}})();
</script>
</body></html>
'''

if __name__ == '__main__':
    # PT: make_sign.py "<숫자ID_손님이름>" <슬러그> <repo>
    # JT: make_sign.py "JT|<상품명>|<가이드 영문 이름>|<버스 차량번호(없으면 비움)>" <슬러그> <repo>
    raw, slug, repo = sys.argv[1], sys.argv[2], sys.argv[3]
    d = os.path.join(repo, 'v', slug, 'sign'); os.makedirs(d, exist_ok=True)
    if raw.startswith('JT|'):
        parts = (raw.split('|') + ['', '', ''])[1:4]
        page = build_jt(*parts); label = ' / '.join(x for x in parts if x)
    else:
        label = sign_name(raw); page = build(label)
    open(os.path.join(d, 'index.html'), 'w').write(page)
    print(label, f'https://arbatravelkorea.github.io/v/{slug}/sign/')
