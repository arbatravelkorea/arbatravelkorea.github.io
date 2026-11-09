#!/usr/bin/env python3
"""tv/halal_contacts.js 만들기 — 지침서 '일정 변경하기'의 식당 바꾸기 목록 (2026-11-09).
tools/halal_contacts.csv(담당자·전화) + tools/halal_links.json(이름) + halal/index.html(지역 data-r: seoul/jeju/busan/outer)."""
import csv, json, re, pathlib
R = pathlib.Path(__file__).resolve().parent.parent
rows = list(csv.DictReader(open(R / 'tools/halal_contacts.csv', encoding='utf-8-sig')))
links = json.load(open(R / 'tools/halal_links.json'))
reg = {m.group(2).strip(): m.group(1) for m in re.finditer(r'<li class="card" data-r="(\w*)"[^>]*>.*?<h2 class="nm">(.*?)<small>', (R / 'halal/index.html').read_text(), re.S)}
EXTRA = {'아이러브신당동': 'seoul'}  # 할랄 리스트 밖 식당 지역
def region(n): return reg.get(n) or next((v for k, v in reg.items() if k.startswith(n) or n.startswith(k)), None) or EXTRA.get(n, '')
out, seen = [], set()
for r in rows:
    n = r['식당명'].strip()
    if not n: continue
    out.append({'n': n, 'c': r['담당자'].strip(), 'p': r['전화'].strip(), 's': r['문자'].strip().upper() not in ('X', 'N', '불가', '없음'), 'g': region(n)}); seen.add(n)
for n in links:
    if n not in seen and not any(n in s or s in n for s in seen): out.append({'n': n, 'g': region(n)}); seen.add(n)
(R / 'tv/halal_contacts.js').write_text('/* 일정 변경 화면의 식당 바꾸기 목록 — tools/make_halal_contacts.py로 생성. g = 지역(seoul/jeju/busan/outer) */\nwindow.HALAL_CONTACTS=' + json.dumps(out, ensure_ascii=False) + ';\n')
print(len(out), 'no region:', [o['n'] for o in out if not o['g']])
