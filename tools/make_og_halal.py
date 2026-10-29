#!/usr/bin/env python3
"""할랄 식당 리스트 OG 카드: img/halal/og_<en|ko>[_<지역조합>].png
지역 조합(seoul, jeju, busan, outer의 모든 조합)마다 노란 지역 배지를 오른쪽 아래(제목 옆)에 넣는다. 예: Seoul & Jeju
지도 아이콘은 ARBA 자체 디자인(지도 핀) — 네이버·구글 공식 로고는 상표라 쓰지 않음"""
import base64, pathlib, json, subprocess
from itertools import combinations
here = pathlib.Path(__file__).parent; root = here.parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
fonts, logo = here / 'fonts', here / 'logo_white.png'
REG = [('seoul', 'Seoul', '서울'), ('jeju', 'Jeju', '제주'), ('busan', 'Busan', '부산'), ('outer', 'Outskirt', '외곽')]
NAME = {s: (en, ko) for s, en, ko in REG}
PIN = lambda c: f'''<svg viewBox="0 0 48 48" width="54" height="54"><rect width="48" height="48" rx="12" fill="#fff"/>
<path d="M24 9c-6.6 0-12 5.2-12 11.7C12 29.5 24 40 24 40s12-10.5 12-19.3C36 14.2 30.6 9 24 9z" fill="{c}"/><circle cx="24" cy="20.5" r="4.6" fill="#fff"/></svg>'''
LANG = {'en': ('Halal &amp; Muslim Friendly<br>Restaurants in Korea', 72, 'Naver Map', 'Google Maps'),
        'ko': ('할랄&amp;무슬림 프렌들리<br>식당 리스트', 80, '네이버지도', '구글맵')}
def label(slugs, lang):
    n = [NAME[s][0 if lang == 'en' else 1] for s in slugs]
    return n[0] if len(n) == 1 else (', '.join(n[:-1]) + ' &amp; ' + n[-1])
def html(lang, slugs):
    title, fs, n1, n2 = LANG[lang]
    badge = f'<div class="reg">{label(slugs, lang)}</div>' if slugs else ''
    return f"""<html><head><meta charset="utf-8"><style>
@font-face {{ font-family:P; font-weight:700; src:url(data:font/ttf;base64,{b64(fonts/'Pretendard-Bold.ttf')}) }}
*{{margin:0;box-sizing:border-box}} body{{width:1200px;height:630px;background:#BE1E2D;font-family:P;color:#fff;position:relative;overflow:hidden}}
.sun{{position:absolute;right:-120px;top:-150px;width:420px;height:420px;border-radius:50%;background:#ECAC1B}}
.wrap{{position:absolute;left:80px;top:70px;right:80px;bottom:64px;display:flex;flex-direction:column}} img{{width:250px}}
.t{{margin-top:auto;font-size:{fs}px;font-weight:700;line-height:1.12;letter-spacing:-.01em}}
.apps{{display:flex;gap:18px;margin-top:34px}} .app{{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.16);border-radius:16px;padding:10px 22px 10px 12px;font-size:30px;font-weight:700}}
.reg{{position:absolute;right:80px;bottom:64px;max-width:470px;text-align:center;background:#ECAC1B;color:#1A1A1A;border-radius:14px;padding:12px 24px;font-size:36px;font-weight:700;line-height:1.2}}
</style></head><body><div class="sun"></div><div class="wrap"><img src="data:image/png;base64,{b64(logo)}">
<div class="t">{title}</div><div class="apps"><div class="app">{PIN('#03C75A')}{n1}</div><div class="app">{PIN('#1A73E8')}{n2}</div></div></div>{badge}</body></html>"""
out_dir = root / 'img' / 'halal'; out_dir.mkdir(parents=True, exist_ok=True)
slugs_all = [s for s, _, _ in REG]
combos = [()] + [c for n in range(1, len(slugs_all) + 1) for c in combinations(slugs_all, n)]
jobs = []
for lang in ('en', 'ko'):
    for c in combos:
        name = f'og_{lang}' + ('_' + '-'.join(c) if c else '')
        f = out_dir / f'_{name}.html'; f.write_text(html(lang, c)); jobs.append((str(f), str(out_dir / f'{name}.png')))
js = "const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});for(const [f,o] of " + json.dumps(jobs) + "){await p.goto('file://'+f);await p.waitForTimeout(150);await p.screenshot({path:o});}await b.close()})()"
subprocess.run(['node', '-e', js], check=True)
for f, _ in jobs: pathlib.Path(f).unlink()
print(len(jobs), 'cards')
