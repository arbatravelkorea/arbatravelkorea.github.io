#!/usr/bin/env python3
"""할랄 식당 리스트 페이지 생성기.
Usage: gen_halal.py <sheet.csv> <repo_root>
  sheet.csv = 'ARBA 할랄 식당 리스트' 구글시트를 CSV로 내려받은 것 (헤더 1행)
  -> <repo>/halal/{seoul,busan,jeju}/index.html (한국어, 가이드·기사용)
     <repo>/halal/{seoul,busan,jeju}/en/index.html (English, 손님용)
     <repo>/halal/index.html (지역 선택)
'컴프(내부)' 칸은 어느 페이지에도 나가지 않는다. 영어판에는 담당자·가이드 메모·수용인원도 나가지 않는다.
상태가 '폐업'/'중단'이면 페이지에서 빠진다."""
import csv, sys, html, re, pathlib, datetime, json

src, root = sys.argv[1], pathlib.Path(sys.argv[2])
rows = list(csv.DictReader(open(src, encoding='utf-8-sig')))
COLS = set(rows[0].keys()) if rows else set()
HAS_H = '할랄구분' in COLS
HAS_TEL = '대표전화' in COLS
BASE = 'https://arbatravelkorea.github.io'
REG = {'서울': ('seoul', 'Seoul · Gyeonggi · Gangwon', '서울·경기·강원'),
       '부산': ('busan', 'Busan', '부산'),
       '제주': ('jeju', 'Jeju', '제주')}
HALAL = {'할랄 인증': ('c', 'Halal certified', '할랄 인증'),
         '무슬림 음식점(할랄 고기)': ('m', 'Halal / Muslim-friendly', '무슬림 음식점(할랄 고기)'),
         '돼지고기 없는 메뉴': ('p', 'No pork (seafood / veg)', '돼지고기 없는 메뉴')}
e = lambda s: html.escape(str(s or ''), quote=True)
today = (datetime.datetime.utcnow() + datetime.timedelta(hours=9)).strftime('%Y-%m-%d')

def g(r, k): return (r.get(k) or '').strip()
def tel(p):
    d = re.sub(r'[^\d]', '', p.split('/')[0])
    return d
def intl(p):
    d = tel(p)
    return ('+82-' + d[1:]) if d.startswith('0') else d
def pretty_intl(p):
    s = p.split('/')[0].strip()
    return ('+82 ' + s[1:]) if s.startswith('0') else s
HMAP=[('연중무휴','open every day'),('매일','Daily'),('평일','Weekdays'),('주말','Weekends'),('공휴일','holidays'),('브레이크 타임','break'),('브레이크타임','break'),('라스트오더','last order'),('휴무일','closed'),('정기휴무','closed'),('휴무','closed'),
('첫째 주','1st'),('셋째 주','3rd'),('첫째','1st'),('셋째','3rd'),('첫 번째','1st'),('세 번째','3rd'),('두 번째','2nd'),('네 번째','4th'),('요일',''),('24시간','24 hours'),('업체문의','ask restaurant'),
('월','Mon'),('화','Tue'),('수','Wed'),('목','Thu'),('금','Fri'),('토','Sat'),('일','Sun'),('주',''),('~','–')]
def hours_en(h):
    if not h or re.search(r'[가-힣]', re.sub('|'.join(k for k,_ in HMAP),'',h)): return '' if not h else (h if not re.search(r'[가-힣]', h) else _h(h))
    return _h(h)
def _h(h):
    for k,v in HMAP: h=h.replace(k,v)
    return '' if re.search(r'[가-힣]',h) else re.sub(r'\s+',' ',h).strip()
def linkify(s):
    s = e(s)
    return re.sub(r'(https?://[^\s<]+)', r'<a href="\1" target="_blank" rel="noopener">\1</a>', s).replace('¶', '<br>').replace('\n', '<br>')

CSS = '''
:root{--red:#BE1E2D;--red-ink:#fff;--gold:#ECAC1B;--bg:#FAF7F5;--card:#fff;--fg:#1C1716;--muted:#6E6461;--line:#ECE4E0;--soft:#F4EEEB;
--green:#1C8C4E;--green-bg:#E2F4E9;--c:#0E7A43;--c-bg:#DDF3E6;--m:#1B5FA8;--m-bg:#E1ECFA;--p:#7A5A12;--p-bg:#F8EED6;--link:#1A5FD0;
--f:"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171313;--card:#221C1B;--fg:#F3EDEA;--muted:#AEA3A0;--line:#3A3130;--soft:#2B2423;
--green:#5BD08D;--green-bg:#173A27;--c:#6FD9A0;--c-bg:#163A27;--m:#8DB8F0;--m-bg:#1A2B44;--p:#E9C97A;--p-bg:#3A2F17;--link:#8DB4FF;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171313;--card:#221C1B;--fg:#F3EDEA;--muted:#AEA3A0;--line:#3A3130;--soft:#2B2423;
--green:#5BD08D;--green-bg:#173A27;--c:#6FD9A0;--c-bg:#163A27;--m:#8DB8F0;--m-bg:#1A2B44;--p:#E9C97A;--p-bg:#3A2F17;--link:#8DB4FF;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 var(--f);-webkit-text-size-adjust:100%}
.wrap{max-width:680px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
header{background:var(--red);color:var(--red-ink);position:relative;overflow:hidden}
header::after{content:"";position:absolute;right:-40px;top:-50px;width:150px;height:150px;border-radius:50%;background:var(--gold)}
header .wrap{padding-block:20px 22px;position:relative;z-index:1}
.brand{font-weight:800;letter-spacing:.3em;font-size:12px}
h1{margin:12px 0 2px;font-size:clamp(23px,6.6vw,30px);line-height:1.2;font-weight:800;text-wrap:balance}
.sub{opacity:.92;font-size:13.5px}.sub a{color:#fff}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding-block:10px}
input[type=search]{width:100%;font:inherit;font-size:16px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--fg)}
.chips{display:flex;gap:6px;overflow-x:auto;padding-top:8px;scrollbar-width:none}.chips::-webkit-scrollbar{display:none}
.chip{flex:none;font:600 13px var(--f);padding:6px 11px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer;white-space:nowrap}
.chip[aria-pressed=true]{background:var(--red);border-color:var(--red);color:#fff}
main .wrap{padding-block:12px 36px}
.legend{font-size:12.5px;color:var(--muted);margin:4px 0 12px}
.count{font-size:13px;color:var(--muted);margin:2px 0 10px}
ol{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
.top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.nm{margin:0;font-size:17px;font-weight:800;line-height:1.3}.nm small{display:block;font-size:12.5px;font-weight:500;color:var(--muted);margin-top:2px}
.badge{flex:none;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:6px;white-space:nowrap}
.b-c{background:var(--c-bg);color:var(--c)}.b-m{background:var(--m-bg);color:var(--m)}.b-p{background:var(--p-bg);color:var(--p)}
.meta{margin:8px 0 0;padding:0;list-style:none;display:grid;gap:3px;font-size:14px}
.meta b{display:inline-block;min-width:62px;font-size:12px;color:var(--muted);font-weight:700}
.warn{margin:8px 0 0;font-size:13px;color:var(--red);font-weight:600}
.acts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.acts.one{grid-template-columns:1fr}
.act{display:flex;align-items:center;justify-content:center;gap:6px;min-height:44px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none}
.call{background:var(--green-bg);color:var(--green)}.map{background:#03C75A;color:#fff}.act.off{opacity:.45;pointer-events:none;background:var(--soft);color:var(--muted)}
details{margin-top:10px;font-size:13.5px;border-top:1px dashed var(--line);padding-top:8px}summary{cursor:pointer;font-weight:700;color:var(--muted)}
details p{margin:6px 0 0;overflow-wrap:anywhere}details a,.meta a{color:var(--link)}
.empty{padding:30px 0;text-align:center;color:var(--muted)}
footer{text-align:center;font-size:12px;color:var(--muted);padding-block:0 30px}
.regions{display:grid;gap:10px;margin-top:16px}.regions a{display:block;padding:16px;border-radius:14px;background:var(--card);border:1px solid var(--line);color:var(--fg);text-decoration:none;font-weight:800;font-size:18px}
.regions span{display:block;font-weight:500;font-size:13px;color:var(--muted)}
a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
'''
JS = '''
const q=document.getElementById('q'),cards=[...document.querySelectorAll('.card')],cnt=document.getElementById('cnt');
let area='',hal='';
function run(){const s=q.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=(!area||c.dataset.area===area)&&(!hal||c.dataset.h===hal)&&(!s||c.dataset.s.includes(s));c.hidden=!ok;if(ok)n++});cnt.textContent=cnt.dataset.t.replace('#',n);document.getElementById('none').hidden=n>0}
document.querySelectorAll('.chips').forEach(g=>g.addEventListener('click',ev=>{const b=ev.target.closest('.chip');if(!b)return;g.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(g.id==='fa')area=b.dataset.v;else hal=b.dataset.v;run()}));
q.addEventListener('input',run);run();
'''

def page(code, items, lang):
    slug, en_title, ko_title = code
    ko = lang == 'ko'
    areas = []
    for r in items:
        a = g(r, '구역') if ko else g(r, 'Area')
        if a and a not in areas: areas.append(a)
    cards = []
    for r in items:
        hc, hen, hko = HALAL.get(g(r, '할랄구분'), ('', g(r, '할랄구분'), g(r, '할랄구분')))
        area = g(r, '구역') if ko else g(r, 'Area')
        name = g(r, '식당명') if ko else g(r, 'Name')
        sub = g(r, 'Name') if ko else g(r, '식당명')
        cuisine = g(r, '음식') if ko else g(r, 'Cuisine')
        menu = g(r, '대표메뉴') if ko else g(r, 'Menu')
        price = g(r, '1인 가격') if ko else g(r, 'Price/person')
        phone = g(r, '대표전화')
        nav = g(r, '네이버지도')
        pray = g(r, '기도')
        pray_en = {'가능': 'Prayer space available', '불가': '', '식당과 협의': 'Ask restaurant for prayer space'}.get(pray, '')
        meta = []
        if ko:
            meta += [('음식', cuisine), ('메뉴', menu), ('1인', price), ('영업', g(r, '영업시간')), ('기도', g(r, '기도(원문)') or ('가능' if pray == '가능' else '')), ('수용', g(r, '수용인원')), ('주소', g(r, '주소'))]
        else:
            meta += [('Food', cuisine), ('Menu', menu), ('Price', price), ('Hours', hours_en(g(r, '영업시간'))), ('Prayer', pray_en)]
        meta_html = ''.join(f'<li><b>{e(k)}</b>{e(v)}</li>' for k, v in meta if v)
        warn = g(r, '확인필요')
        warn_html = f'<p class="warn">※ {e(warn)}</p>' if ko and warn else ''
        if not HAS_TEL:
            call = ''
        elif phone:
            call = f'<a class="act call" href="tel:{tel(phone) if ko else intl(phone)}">{"전화" if ko else "Call"} {e(phone.split("/")[0].strip() if ko else pretty_intl(phone))}</a>'
        else:
            call = f'<span class="act call off">{"전화번호 없음" if ko else "No phone"}</span>'
        mapb = f'<a class="act map" href="{e(nav)}" target="_blank" rel="noopener">{"네이버지도" if ko else "Naver Map"}</a>' if nav else f'<span class="act map off">{"지도 없음" if ko else "No map"}</span>'
        det = ''
        if ko:
            inner = ''.join(f'<p><b>{e(k)}</b><br>{linkify(v)}</p>' for k, v in [('담당자', g(r, '담당자 연락처')), ('주차·예약', g(r, '가이드 메모(주차·예약)'))] if v)
            if inner: det = f'<details><summary>가이드 메모 (담당자·주차·예약)</summary>{inner}</details>'
        s = ' '.join([name, sub, cuisine, menu, area, g(r, 'Cuisine'), g(r, 'Menu'), g(r, '음식'), g(r, '대표메뉴')]).lower()
        cards.append(f'<li class="card" data-area="{e(area)}" data-h="{hc}" data-s="{e(s)}"><div class="top"><h2 class="nm">{e(name)}<small>{e(area)}{(" · " + e(sub)) if sub else ""}</small></h2>' +
                     (f'<span class="badge b-{hc}">{e(hko if ko else hen)}</span>' if hc else '') + '</div>' + f'<ul class="meta">{meta_html}</ul>{warn_html}<div class="acts{"" if call else " one"}">{call}{mapb}</div>{det}</li>')
    used = [h for h in ('c', 'm', 'p') if any(HALAL.get(g(r, '할랄구분'), ('',))[0] == h for r in items)]
    hl = {v[0]: (v[2] if ko else v[1]) for v in HALAL.values()}
    chips_a = f'<button type="button" class="chip" data-v="" aria-pressed="true">{"전체" if ko else "All areas"}</button>' + ''.join(f'<button type="button" class="chip" data-v="{e(a)}" aria-pressed="false">{e(a)}</button>' for a in areas)
    chips_h = f'<button type="button" class="chip" data-v="" aria-pressed="true">{"전체 구분" if ko else "All types"}</button>' + ''.join(f'<button type="button" class="chip" data-v="{h}" aria-pressed="false">{e(hl[h])}</button>' for h in used)
    title = (f'{ko_title} 할랄·무슬림 식당 리스트' if ko else f'Halal & Muslim-friendly Restaurants · {en_title}')
    desc = ('ARBA Travel Korea 가이드·기사용 식당 리스트 · 전화·네이버지도 바로 연결' if ko else 'Tap to call or open in Naver Map · by ARBA Travel Korea')
    other = (f'<a href="en/">English version for guests</a>' if ko else f'<a href="../">한국어</a>')
    legend = ('할랄 인증 = 인증서 확인 / 무슬림 음식점 = 무슬림 운영·할랄 고기 사용(식당에 확인) / 돼지고기 없는 메뉴 = 해산물·채식 위주, 고기 반찬 빼달라고 요청. 버젯 1인 평균 15,000원, 리스트 밖 식당은 회사 보고 후 방문.'
              if ko else 'Halal certified = certificate checked · Halal / Muslim-friendly = Muslim-run or halal meat (please confirm with staff) · No pork = seafood or vegetarian dishes; ask to remove any meat side dishes. Information may change — call before you go. Naver Map works in English.')
    if not used:
        legend = ('버젯 1인 평균 15,000원, 리스트 밖 식당은 회사 보고 후 방문. 고기 반찬이 나오는 곳은 미리 빼달라고 요청. 전화번호·영업시간·길찾기는 네이버지도 버튼에서 확인.'
                  if ko else 'Muslim-friendly restaurants selected by ARBA Travel Korea. Tap "Naver Map" for phone number, opening hours and directions (Naver Map works in English). Please confirm halal status with the staff.')
    og = f'{BASE}/img/og_halal_{slug}.png'
    url = f'{BASE}/halal/{slug}/' + ('' if ko else 'en/')
    return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="ARBA Travel Korea"><meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap">
<style>{CSS}</style></head><body>
<header><div class="wrap"><div class="brand">ARBA TRAVEL KOREA</div><h1>{e(title)}</h1><div class="sub">{other} · {"업데이트" if ko else "Updated"} {today}</div></div></header>
<div class="bar"><div class="wrap"><input id="q" type="search" placeholder="{"식당·메뉴·지역 검색" if ko else "Search restaurant, food, area"}" aria-label="search">
<div class="chips" id="fa">{chips_a}</div>{('<div class="chips" id="fh">' + chips_h + '</div>') if used else ''}</div></div>
<main><div class="wrap"><p class="legend">{e(legend)}</p><p class="count" id="cnt" data-t="{"식당 #곳" if ko else "# restaurants"}"></p>
<ol>{"".join(cards)}</ol><p class="empty" id="none" hidden>{"조건에 맞는 식당이 없습니다." if ko else "No restaurants match."}</p></div></main>
<footer>ARBA Travel Korea · korea@arbatravel.com</footer><script>{JS}</script></body></html>'''

alive = [r for r in rows if g(r, '식당명') and not any(re.search(r'폐업|중단|삭제', v or '') for v in r.values())]  # 어느 칸이든 '폐업'이면 제외
for kr, code in REG.items():
    items = [r for r in alive if g(r, '지역') == kr]
    d = root / 'halal' / code[0]; (d / 'en').mkdir(parents=True, exist_ok=True)
    (d / 'index.html').write_text(page(code, items, 'ko'), encoding='utf-8')
    (d / 'en' / 'index.html').write_text(page(code, items, 'en'), encoding='utf-8')
    print(code[0], len(items))
links = ''.join(f'<a href="{c[0]}/">{e(c[2])} (한국어)<span>가이드·기사용</span></a><a href="{c[0]}/en/">{e(c[1])} (English)<span>For guests</span></a>' for c in REG.values())
(root / 'halal' / 'index.html').write_text(f'''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ARBA 할랄 식당 리스트</title><meta property="og:title" content="ARBA 할랄 식당 리스트 · Halal Restaurants"><meta property="og:image" content="{BASE}/img/og_halal_seoul.png">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap"><style>{CSS}</style></head><body>
<header><div class="wrap"><div class="brand">ARBA TRAVEL KOREA</div><h1>할랄 식당 리스트 · Halal Restaurants</h1><div class="sub">업데이트 {today}</div></div></header>
<main><div class="wrap"><div class="regions">{links}</div></div></main></body></html>''', encoding='utf-8')
