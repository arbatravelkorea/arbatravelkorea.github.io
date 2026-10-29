#!/usr/bin/env python3
"""할랄 식당 리스트 페이지 생성기 (v2, 2026-10-29 사용자 정리 시트 기준).
Usage: gen_halal.py <sheet.csv> <repo_root>
  sheet.csv = 'ARBA 할랄 식당 리스트' 구글시트 CSV (export?format=csv&gid=1637922198)
  시트 칸: ID, 지역(서울/부산/제주), Area, 식당명, Name, 네이버지도, 구글맵, 기도(가능/불가), 상태, 마지막 확인
  -> halal/index.html (한국어 전체)        halal/en/index.html (English 전체)
     halal/<seoul|busan|jeju>/index.html, .../en/index.html = 같은 목록, 해당 지역 필터가 미리 선택됨
- 어느 칸이든 '폐업'·'중단'이 있으면 제외
- 구글맵 칸이 비어 있으면 '식당명 + 지역' 구글맵 검색 링크를 자동으로 만든다
- '마지막 확인' 칸의 메모(날짜·폐업 제외)는 한국어 카드에만 ※로 표시"""
import csv, sys, html, re, pathlib, datetime, urllib.parse

src, root = sys.argv[1], pathlib.Path(sys.argv[2])
rows = list(csv.DictReader(open(src, encoding='utf-8-sig')))
BASE = 'https://arbatravelkorea.github.io'
REG = [('서울', 'seoul', 'Seoul'), ('제주', 'jeju', 'Jeju'), ('부산', 'busan', 'Busan'), ('외곽', 'outer', 'Outside Seoul')]  # 필터 순서
NOTE_EN = {'1일전 예약한경우만 할랄로 준비 가능': 'Halal only if booked 1 day in advance'}
KO2 = {k: (s, en) for k, s, en in REG}
e = lambda s: html.escape(str(s or ''), quote=True)
g = lambda r, k: (r.get(k) or '').strip()
today = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=9)).strftime('%Y-%m-%d')

items = [r for r in rows if g(r, '식당명') and not any(re.search(r'폐업|중단|삭제', v or '') for v in r.values())]

CSS = '''
:root{--red:#BE1E2D;--gold:#ECAC1B;--bg:#FAF7F5;--card:#fff;--fg:#1C1716;--muted:#6E6461;--line:#ECE4E0;--soft:#F4EEEB;
--pray:#0E7A43;--pray-bg:#DDF3E6;--gmap:#1A73E8;--link:#1A5FD0;--f:"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171313;--card:#221C1B;--fg:#F3EDEA;--muted:#AEA3A0;--line:#3A3130;--soft:#2B2423;--pray:#6FD9A0;--pray-bg:#163A27;--gmap:#8AB4F8;--link:#8DB4FF;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171313;--card:#221C1B;--fg:#F3EDEA;--muted:#AEA3A0;--line:#3A3130;--soft:#2B2423;--pray:#6FD9A0;--pray-bg:#163A27;--gmap:#8AB4F8;--link:#8DB4FF;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.55 var(--f);-webkit-text-size-adjust:100%}
.wrap{max-width:680px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
header{background:var(--red);color:#fff;position:relative;overflow:hidden}
header::after{content:"";position:absolute;right:-40px;top:-50px;width:150px;height:150px;border-radius:50%;background:var(--gold)}
header .wrap{padding-block:20px 22px;position:relative;z-index:1}
.brand{font-weight:800;letter-spacing:.3em;font-size:12px}
h1{margin:12px 0 2px;font-size:clamp(23px,6.6vw,30px);line-height:1.2;font-weight:800;text-wrap:balance}
.sub{opacity:.92;font-size:13.5px}.sub a{color:#fff}
.bar{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line);padding-block:10px}
input[type=search]{width:100%;font:inherit;font-size:16px;padding:10px 12px;border-radius:10px;border:1px solid var(--line);background:var(--card);color:var(--fg)}
.chips{display:flex;gap:5px;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;padding-top:8px}.chips::-webkit-scrollbar{display:none}
.chip{flex:1 0 auto;white-space:nowrap;font:700 13.5px var(--f);padding:7px 9px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer;min-height:36px}
.chip[aria-pressed=true]{background:var(--red);border-color:var(--red);color:#fff}
.chip.pray[aria-pressed=true]{background:var(--pray);border-color:var(--pray);color:#fff}
main .wrap{padding-block:12px 36px}
.legend{font-size:12.5px;color:var(--muted);margin:4px 0 10px}
.count{font-size:13px;color:var(--muted);margin:2px 0 10px}
ol{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
.top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
.nm{margin:0;font-size:17px;font-weight:800;line-height:1.3}.nm small{display:block;font-size:12.5px;font-weight:500;color:var(--muted);margin-top:2px}
.badge{flex:none;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:6px;white-space:nowrap;background:var(--pray-bg);color:var(--pray)}
.reg{flex:none;font-size:11.5px;font-weight:700;padding:3px 8px;border-radius:6px;background:var(--soft);color:var(--muted)}
.tags{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.note{margin:8px 0 0;font-size:13px;color:var(--red);font-weight:600}
.acts{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.act{display:flex;align-items:center;justify-content:center;min-height:44px;border-radius:10px;font-weight:700;font-size:15px;text-decoration:none;text-align:center}
.nav{background:#03C75A;color:#fff}.gmap{background:var(--card);color:var(--gmap);border:1.5px solid var(--gmap)}
.ph{display:block;width:calc(100% + 28px);margin:-14px -14px 12px;aspect-ratio:16/10;object-fit:cover;border-radius:14px 14px 0 0;background:var(--soft)}
.empty{padding:30px 0;text-align:center;color:var(--muted)}
footer{text-align:center;font-size:12px;color:var(--muted);padding-block:0 30px}
a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
'''

JS = '''
const q=document.getElementById('q'),cards=[...document.querySelectorAll('.card')],cnt=document.getElementById('cnt'),pb=document.getElementById('pray');
let reg=document.body.dataset.reg||'',pray=false;
function sync(){document.querySelectorAll('#fr .chip').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.v===reg)));pb.setAttribute('aria-pressed',String(pray))}
function run(){const s=q.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=(!reg||c.dataset.r===reg)&&(!pray||c.dataset.p==='1')&&(!s||c.dataset.s.includes(s));c.hidden=!ok;if(ok)n++});cnt.textContent=cnt.dataset.t.replace('#',n);document.getElementById('none').hidden=n>0;sync()}
document.getElementById('fr').addEventListener('click',ev=>{const b=ev.target.closest('.chip');if(!b)return;if(b===pb){pray=!pray}else{reg=b.dataset.v}run()});
q.addEventListener('input',run);run();
'''

def gmap(r):
    u = g(r, '구글맵')
    if u: return u
    name, reg = g(r, '식당명'), g(r, '지역')
    query = name if (reg in name or reg == '외곽') else f'{name} {reg}'
    return 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote(query)

def photo(r):
    u = g(r, '사진')
    m = re.search(r'drive\.google\.com/(?:file/d/|open\?id=|uc\?id=)([\w-]+)', u)
    if m: return f'https://lh3.googleusercontent.com/d/{m.group(1)}=w800'
    return u if u.startswith('http') else ''

def note(r):
    v = g(r, '마지막 확인')
    if not v or re.fullmatch(r'[\d\-./ ]+', v): return ''
    return v

def page(lang, preset):
    ko = lang == 'ko'
    cards = []
    for r in items:
        reg = g(r, '지역'); slug, reg_en = KO2.get(reg, ('', reg))
        name = g(r, '식당명') if ko else (g(r, 'Name') or g(r, '식당명'))
        sub = g(r, 'Name') if ko else g(r, '식당명')
        p = g(r, '기도') == '가능'
        nv = g(r, '네이버지도')
        if not nv.startswith('http'): nv = ''
        tags = (f'<span class="badge">{"기도 가능" if ko else "Prayer space"}</span>' if p else '') + f'<span class="reg">{e(reg if ko else reg_en)}</span>'
        nt = note(r)
        nt = nt if ko else NOTE_EN.get(nt, '')
        note_html = f'<p class="note">※ {e(nt)}</p>' if nt else ''
        acts = (f'<a class="act nav" href="{e(nv)}" target="_blank" rel="noopener">{"네이버지도" if ko else "Naver Map"}</a>' if nv else '') + \
               f'<a class="act gmap" href="{e(gmap(r))}" target="_blank" rel="noopener">{"구글맵" if ko else "Google Maps"}</a>'
        s = ' '.join([g(r, '식당명'), g(r, 'Name'), reg, reg_en]).lower()
        ph = photo(r)
        img = f'<img class="ph" src="{e(ph)}" alt="{e(name)}" loading="lazy">' if ph else ''
        cards.append(f'<li class="card" data-r="{slug}" data-p="{1 if p else 0}" data-s="{e(s)}">{img}<div class="top"><h2 class="nm">{e(name)}<small>{e(sub)}</small></h2>'
                     f'<div class="tags">{tags}</div></div>{note_html}<div class="acts"{"" if nv else " style=grid-template-columns:1fr"}>{acts}</div></li>')
    chips = f'<button type="button" class="chip" data-v="">{"전체" if ko else "All"}</button>' + ''.join(
        f'<button type="button" class="chip" data-v="{s}">{e(k if ko else en)}</button>' for k, s, en in REG) + \
        f'<button type="button" class="chip pray" id="pray">{"🕌 기도 가능" if ko else "🕌 Prayer space"}</button>'
    pre = dict((s, (k, en)) for k, s, en in REG).get(preset)
    if ko:
        title = f'{pre[0]} 할랄·무슬림 식당 리스트' if pre else '할랄·무슬림 식당 리스트'
        desc = '서울·부산·제주 · 네이버지도·구글맵 바로 연결 · ARBA Travel Korea'
        legend = '버젯 1인 평균 15,000원, 리스트 밖 식당은 회사 보고 후 방문. 고기 반찬이 나오는 곳은 미리 빼달라고 요청. 전화번호·영업시간은 지도 앱에서 확인.'
    else:
        title = f'Halal & Muslim-friendly Restaurants · {pre[1]}' if pre else 'Halal & Muslim-friendly Restaurants in Korea'
        desc = 'Seoul · Busan · Jeju · open in Naver Map or Google Maps · ARBA Travel Korea'
        legend = 'Muslim-friendly restaurants selected by ARBA Travel Korea. Tap a map button for phone number, opening hours and directions (Naver Map works best in Korea and supports English). Please confirm halal status with the staff.'
    depth = '../' if preset else ''
    if ko:
        other = f'<a href="{"en/"}">English</a>'
    else:
        other = f'<a href="../">한국어</a>'
    og = f'{BASE}/img/og_halal_{preset if preset in ("seoul", "busan", "jeju") else "seoul"}.png'
    url = f'{BASE}/halal/' + (f'{preset}/' if preset else '') + ('' if ko else 'en/')
    return f'''<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{e(title)}</title><meta name="description" content="{e(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="ARBA Travel Korea"><meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap">
<style>{CSS}</style></head><body data-reg="{preset}">
<header><div class="wrap"><div class="brand">ARBA TRAVEL KOREA</div><h1>{"할랄·무슬림 식당 리스트" if ko else "Halal & Muslim-friendly Restaurants in Korea"}</h1><div class="sub">{other} · {"업데이트" if ko else "Updated"} {today}</div></div></header>
<div class="bar"><div class="wrap"><input id="q" type="search" placeholder="{"식당 이름 검색" if ko else "Search restaurant name"}" aria-label="search">
<div class="chips" id="fr">{chips}</div></div></div>
<main><div class="wrap"><p class="legend">{e(legend)}</p><p class="count" id="cnt" data-t="{"식당 #곳" if ko else "# restaurants"}"></p>
<ol>{"".join(cards)}</ol><p class="empty" id="none" hidden>{"조건에 맞는 식당이 없습니다." if ko else "No restaurants match."}</p></div></main>
<footer>ARBA Travel Korea · korea@arbatravel.com</footer><script>{JS}</script></body></html>'''

h = root / 'halal'
for preset in [''] + [s for _, s, _ in REG]:
    d = h / preset if preset else h
    (d / 'en').mkdir(parents=True, exist_ok=True)
    (d / 'index.html').write_text(page('ko', preset), encoding='utf-8')
    (d / 'en' / 'index.html').write_text(page('en', preset), encoding='utf-8')
from collections import Counter
print(len(items), Counter(g(r, '지역') for r in items), 'prayer', sum(g(r, '기도') == '가능' for r in items))
