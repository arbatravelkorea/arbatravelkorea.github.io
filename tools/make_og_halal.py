#!/usr/bin/env python3
"""할랄 식당 리스트 OG 카드 3장 (img/og_halal_<region>.png)"""
import base64, pathlib, subprocess, json, sys
here = pathlib.Path(__file__).parent; root = here.parent
fonts = here / 'fonts' if (here / 'fonts').exists() else pathlib.Path('/home/claude/tv/fonts')
logo = here / 'logo_white.png' if (here / 'logo_white.png').exists() else pathlib.Path('/home/claude/tv/logo_white.png')
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
for slug, ko, en in [('seoul','서울 · 경기 · 강원','SEOUL'),('busan','부산','BUSAN'),('jeju','제주','JEJU')]:
    html = f"""<html><head><meta charset="utf-8"><style>
@font-face {{ font-family:P; font-weight:700; src:url(data:font/ttf;base64,{b64(fonts/'Pretendard-Bold.ttf')}) }}
@font-face {{ font-family:P; font-weight:500; src:url(data:font/ttf;base64,{b64(fonts/'Pretendard-Medium.ttf')}) }}
*{{margin:0;box-sizing:border-box}} body{{width:1200px;height:630px;background:#BE1E2D;font-family:P;color:#fff;position:relative;overflow:hidden}}
.sun{{position:absolute;right:-120px;top:-150px;width:420px;height:420px;border-radius:50%;background:#ECAC1B}}
.wrap{{position:absolute;left:80px;top:70px;right:80px;bottom:60px;display:flex;flex-direction:column}} img{{width:250px}}
.tags{{margin-top:auto;display:flex;gap:14px}} .tag{{background:rgba(255,255,255,.18);border-radius:8px;padding:8px 18px;font-size:28px;font-weight:700;letter-spacing:.16em}}
.dest{{background:#ECAC1B;color:#1A1A1A;border-radius:8px;padding:8px 18px;font-size:28px;font-weight:700;letter-spacing:.06em}}
.t{{font-size:92px;font-weight:700;margin-top:18px;line-height:1}} .s{{font-size:40px;font-weight:500;margin-top:24px}}
</style></head><body><div class="sun"></div><div class="wrap"><img src="data:image/png;base64,{b64(logo)}">
<div class="tags"><div class="tag">HALAL RESTAURANTS</div><div class="dest">{en}</div></div><div class="t">할랄 식당 리스트</div><div class="s">{ko} · 전화 · 네이버지도</div></div></body></html>"""
    f = root / 'img' / f'_og_{slug}.html'; f.write_text(html)
    out = root / 'img' / f'og_halal_{slug}.png'
    js = f"const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1200,height:630}}}});await p.goto('file://{f}');await p.waitForTimeout(300);await p.screenshot({{path:{json.dumps(str(out))}}});await b.close()}})()"
    subprocess.run(['node','-e',js],check=True); f.unlink(); print(out)
