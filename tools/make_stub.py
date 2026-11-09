#!/usr/bin/env python3
"""A안 지침서 페이지 (2026-11-06): v/<슬러그>/index.html — OG 카드 + tv/app.js 렌더러 (내용은 Apps Script JSON). 사용: make_stub.py <슬러그> "<TripID>" "<가이드>" "<DEST>" <repo>"""
import sys, html, pathlib, time
slug, trip, guide, dest, repo = sys.argv[1:6]
e = lambda s: html.escape(s, quote=True)
img = f"https://arbatravelkorea.github.io/img/og_{slug}.png?v={int(time.time())}"
page = f"""<!doctype html><html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow">
<title>{e(guide)} 가이드님 투어지침서 · {e(trip)}</title>
<meta property="og:type" content="website"><meta property="og:site_name" content="ARBA Travel Korea">
<meta property="og:title" content="{e(guide)} 가이드님 투어지침서 · {e(trip)}">
<meta property="og:description" content="ARBA Travel Korea Tour Voucher · {e(dest)} · 눌러서 지침서 열기">
<meta property="og:image" content="{e(img)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32.png"><link rel="icon" type="image/png" href="/img/favicon.png"><link rel="apple-touch-icon" href="/img/favicon.png">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/static/pretendard.min.css">
<link rel="stylesheet" href="/tv/app.css?v=23">
</head><body><div class="wrap" id="app"><p class="loading">투어지침서를 여는 중…</p></div>
<script src="/tv/prayer.js?v=1"></script><script src="/tv/halal_links.js?v=2"></script><script src="/tv/smsform.js?v=3"></script><script src="/tv/halal_contacts.js?v=2"></script><script src="/tv/app.js?v=37"></script>
<script>ATK.render({slug!r});</script></body></html>"""
d = pathlib.Path(repo) / 'v' / slug; d.mkdir(parents=True, exist_ok=True)
(d / 'index.html').write_text(page); print(d / 'index.html')
