#!/usr/bin/env python3
"""할랄 식당 리스트 OG 카드 2장: img/og_halal_en.png (손님용), img/og_halal_ko.png (가이드용)
지도 아이콘은 ARBA 자체 디자인(지도 핀) — 네이버·구글 공식 로고는 상표라 쓰지 않음"""
import base64, pathlib, subprocess, json
here = pathlib.Path(__file__).parent; root = here.parent
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
fonts, logo = here / 'fonts', here / 'logo_white.png'
PIN = lambda c: f'''<svg viewBox="0 0 48 48" width="54" height="54"><rect width="48" height="48" rx="12" fill="#fff"/>
<path d="M24 9c-6.6 0-12 5.2-12 11.7C12 29.5 24 40 24 40s12-10.5 12-19.3C36 14.2 30.6 9 24 9z" fill="{c}"/><circle cx="24" cy="20.5" r="4.6" fill="#fff"/></svg>'''
CARDS = {
 'en': ('Halal &amp; Muslim Friendly<br>Restaurants in Korea', 72, 'Naver Map', 'Google Maps'),
 'ko': ('할랄&amp;무슬림 프렌들리<br>식당 리스트', 80, '네이버지도', '구글맵'),
}
for k, (title, fs, n1, n2) in CARDS.items():
    html = f"""<html><head><meta charset="utf-8"><style>
@font-face {{ font-family:P; font-weight:700; src:url(data:font/ttf;base64,{b64(fonts/'Pretendard-Bold.ttf')}) }}
@font-face {{ font-family:P; font-weight:500; src:url(data:font/ttf;base64,{b64(fonts/'Pretendard-Medium.ttf')}) }}
*{{margin:0;box-sizing:border-box}} body{{width:1200px;height:630px;background:#BE1E2D;font-family:P;color:#fff;position:relative;overflow:hidden}}
.sun{{position:absolute;right:-120px;top:-150px;width:420px;height:420px;border-radius:50%;background:#ECAC1B}}
.wrap{{position:absolute;left:80px;top:70px;right:80px;bottom:64px;display:flex;flex-direction:column}} img{{width:250px}}
.t{{margin-top:auto;font-size:{fs}px;font-weight:700;line-height:1.12;letter-spacing:-.01em}}
.apps{{display:flex;gap:18px;margin-top:34px}} .app{{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.16);border-radius:16px;padding:10px 22px 10px 12px;font-size:30px;font-weight:700}}
</style></head><body><div class="sun"></div><div class="wrap"><img src="data:image/png;base64,{b64(logo)}">
<div class="t">{title}</div><div class="apps"><div class="app">{PIN('#03C75A')}{n1}</div><div class="app">{PIN('#1A73E8')}{n2}</div></div></div></body></html>"""
    f = root / 'img' / f'_og_{k}.html'; f.write_text(html)
    out = root / 'img' / f'og_halal_{k}.png'
    js = f"const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1200,height:630}}}});await p.goto('file://{f}');await p.waitForTimeout(300);await p.screenshot({{path:{json.dumps(str(out))}}});await b.close()}})()"
    subprocess.run(['node', '-e', js], check=True); f.unlink(); print(out)
