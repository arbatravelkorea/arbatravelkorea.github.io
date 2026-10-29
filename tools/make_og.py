#!/usr/bin/env python3
"""OG preview image (1200x630) for KakaoTalk/WhatsApp link card. Usage: make_og.py TRIPID GUIDE PERIOD DEST out.png
DEST = Seoul | Busan | Jeju | Seoul+Busan | Seoul+Jeju (Schedule-Tour 일정 기준)"""
import sys, base64, pathlib, subprocess, json
trip, guide, period, dest, out = sys.argv[1:6]
dest = ' + '.join(x.strip() for x in dest.split('+'))
here = pathlib.Path(__file__).parent
b64 = lambda p: base64.b64encode((here / p).read_bytes()).decode()
html = f"""<html><head><meta charset="utf-8"><style>
@font-face {{ font-family:P; font-weight:700; src:url(data:font/ttf;base64,{b64('fonts/Pretendard-Bold.ttf')}) }}
@font-face {{ font-family:P; font-weight:500; src:url(data:font/ttf;base64,{b64('fonts/Pretendard-Medium.ttf')}) }}
* {{ margin:0; box-sizing:border-box }}
body {{ width:1200px; height:630px; background:#BE1E2D; font-family:P; color:#fff; position:relative; overflow:hidden }}
.sun {{ position:absolute; right:-120px; top:-150px; width:420px; height:420px; border-radius:50%; background:#ECAC1B }}
.stripes {{ position:absolute; inset:0; background:repeating-linear-gradient(115deg, rgba(255,255,255,.05) 0 40px, transparent 40px 90px) }}
.wrap {{ position:absolute; left:80px; top:70px; right:80px; bottom:60px; display:flex; flex-direction:column }}
img {{ width:250px }}
.tags {{ margin-top:auto; display:flex; gap:14px; align-items:center }}
.dest {{ background:#ECAC1B; color:#1A1A1A; border-radius:8px; padding:8px 18px; font-size:28px; font-weight:700; letter-spacing:.06em }}
.tag {{ background:rgba(255,255,255,.18); border-radius:8px; padding:8px 18px; font-size:28px; font-weight:700; letter-spacing:.18em }}
.trip {{ font-size:{96 if len(trip) <= 18 else 74}px; white-space:nowrap; font-weight:700; letter-spacing:-.01em; margin-top:18px; line-height:1 }}
.row {{ display:flex; align-items:center; gap:24px; margin-top:28px; font-size:40px; font-weight:500 }}
.guide {{ background:#fff; color:#BE1E2D; border-radius:999px; padding:8px 28px; font-weight:700 }}
</style></head><body><div class="stripes"></div><div class="sun"></div>
<div class="wrap"><img src="data:image/png;base64,{b64('logo_white.png')}">
<div class="tags"><div class="tag">TOUR VOUCHER</div><div class="dest">{dest.upper()}</div></div><div class="trip">{trip}</div>
<div class="row"><span class="guide">{guide} 가이드님</span><span>{period}</span></div></div></body></html>"""
(here / 'og').mkdir(exist_ok=True)
(here / 'og' / '_og.html').write_text(html)
js = f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1200,height:630}}}});
await p.goto('file://{here}/og/_og.html');await p.waitForTimeout(300);await p.screenshot({{path:{json.dumps(out)}}});await b.close()}})()"""
subprocess.run(['node', '-e', js], check=True)
print(out)
