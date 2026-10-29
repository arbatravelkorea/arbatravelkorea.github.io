#!/usr/bin/env python3
"""Share page (OG card + redirect to the claude.ai voucher). Usage: make_share.py TRIPID GUIDE ARTIFACT_URL BASE_URL out_dir [DEST] [SUFFIX]
[SLUG] 9번째 인자로 슬러그 직접 지정 가능 (합류 투어: SEL-JT-STD-301026_SEL-JT-BSC-301026)
SUFFIX: 2-guide tours (e.g. seoul / jeju) -> v/<TRIP>-<suffix>/
Page holds only Trip ID / guide name / image; the voucher content stays on claude.ai."""
import sys, html, pathlib
trip, guide, target, base, outdir = sys.argv[1:6]
dest = sys.argv[6] if len(sys.argv) > 6 else ''
suffix = sys.argv[7] if len(sys.argv) > 7 else ''
slug = trip.replace('/', '-').replace(' ', '-') + (f'-{suffix}' if suffix else '')
if len(sys.argv) > 8 and sys.argv[8]: slug = sys.argv[8]  # SLUG override (합류 투어 등)
e = lambda s: html.escape(s, quote=True)
import time
img = f"{base.rstrip('/')}/img/og_{slug}.png?v={int(time.time())}"  # 이미지 바꿀 때 카카오 캐시 회피
page = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>{e(guide)} 가이드님 투어지침서 · {e(trip)}</title>
<meta property="og:type" content="website"><meta property="og:site_name" content="ARBA Travel Korea">
<meta property="og:title" content="{e(guide)} 가이드님 투어지침서 · {e(trip)}">
<meta property="og:description" content="ARBA Travel Korea Tour Voucher{(" · " + e(dest.replace("+"," + "))) if dest else ""} · 눌러서 지침서 열기">
<meta property="og:image" content="{e(img)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta http-equiv="refresh" content="0;url={e(target)}">
<style>body{{font-family:system-ui,sans-serif;background:#BE1E2D;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0;text-align:center}}a{{color:#fff;font-weight:700}}</style>
</head><body><p>투어지침서로 이동 중…<br><a href="{e(target)}">바로 열기</a></p>
<script>location.replace({target!r});</script></body></html>"""
d = pathlib.Path(outdir) / 'v' / slug; d.mkdir(parents=True, exist_ok=True)
(d / 'index.html').write_text(page)
print(d / 'index.html')
