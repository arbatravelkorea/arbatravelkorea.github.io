#!/usr/bin/env python3
"""Mobile web version of the guide tour voucher. Usage: gen_web.py job.json web.json hub/v/<SLUG>/index.html  (hub = 공개 허브 아티팩트 폴더)
web.json = {days:[{date, dow, title, items:[..], note}], namelist_url, schedule_imgs}
합류 투어: job.trips 여러 개 → 헤더·인원·왓츠앱·정산 버튼을 Trip별로 표시, 메모는 trips[0].notes 하나로.
항공: job.flights = [{"pnr","airline","who"(선택),"legs":[{"dir":"입국","no":"MH66","when":"10/31(토) 06:30 인천 도착","from":"KUL 10/30 23:15"}]}]"""
import json, sys, re, html

job = json.load(open(sys.argv[1])); web = json.load(open(sys.argv[2])); out = sys.argv[3]
T = job['trips']; t = T[0]; multi = len(T) > 1
def short(tid): return '/'.join(tid.split('/')[2:]) if tid.count('/') >= 3 else tid
PH = re.compile(r'(01[016789])[- ]?(\d{3,4})[- ]?(\d{4})')
URL = re.compile(r'(https?://[^\s<]+)')

def e(s): return html.escape(str(s), quote=True)

def rich(s):
    s = e(s)
    s = URL.sub(lambda m: f'<a class="ext" href="{m.group(1)}" target="_blank" rel="noopener">{m.group(1)}</a>', s)
    def ph(m):
        n = ''.join(m.groups())
        return (f'<span class="ph"><a href="tel:{n}">{m.group(0)}</a>'
                f'<a class="sms" href="sms:{n}">문자</a>'
                f'<button type="button" class="cp" data-copy="{m.group(0)}">복사</button></span>')
    s = PH.sub(ph, s)
    return s.replace('\n', '<br>')

def note_html(n, i=0):
    if isinstance(n, dict):
        lis = ''
        for it in n['items']:
            if isinstance(it, list):
                lis += f'<li><b>{rich(it[0])}</b><ul class="sub">' + ''.join(f'<li>{rich(x)}</li>' for x in it[1]) + '</ul></li>'
            else:
                lis += f'<li>{rich(it)}</li>'
        return (f'<li class="note"><span class="num">{i+1}</span><div class="nb">'
                f'<p class="nh cat">{e(n["title"])}</p><ul class="bl">{lis}</ul></div></li>')
    m = re.match(r'\s*(\d+)\.\s*(.*)', n, re.S)
    num, body = (m.group(1), m.group(2)) if m else ('•', n)
    first, _, rest = body.partition('\n')
    warn = ' warn' if '(주의!)' in body else ''
    return (f'<li class="note{warn}"><span class="num">{num}</span><div class="nb">'
            f'<p class="nh">{rich(first)}</p>' + (f'<p>{rich(rest)}</p>' if rest else '') + '</div></li>')

def pax_block(tr, label=''):
    p = dict(tr['pax']); p['cwb'] = int(p.get('cwb', 0)) + int(p.pop('cts', 0))  # Child twin은 Child w bed로 합침
    labs = [('TL', 'tl'), ('Adult', 'adult'), ('Child<br>w bed', 'cwb'), ('Child<br>w/o bed', 'cnb'), ('Infant', 'inf')]
    if int(p.get('foc', 0)) > 0: labs.append(('FOC', 'foc'))
    tot = sum(int(p.get(k, 0)) for _, k in labs)
    chips = ''.join(f'<div class="px{" tl" if k == "tl" else ""}"><span>{l}</span><b>{p.get(k,0)}</b></div>' for l, k in labs)  # 0명도 항상 표시
    head = f'<p class="paxh">{e(label)}</p>' if label else ''
    return tot, head + f'<div class="pax" style="grid-template-columns:repeat({len(labs)+1},minmax(0,1fr))">{chips}<div class="px tot"><span>Total</span><b>{tot}</b></div></div>'
pax_parts = [pax_block(tr, tr['tripId'] if multi else '') for tr in T]
pax_html = ''.join(h for _, h in pax_parts)
if multi: pax_html += f'<p class="paxsum">합류 인원 합계 <b>{sum(n for n, _ in pax_parts)}명</b></p>'

def flights_html():
    fl = job.get('flights') or []
    if not fl: return ''
    out = ''
    for f in fl:
        legs = ''.join(f'<li><span class="fd">{e(l["dir"])}</span><b>{e(l["no"])}</b> {e(l["when"])}' + (f'<br><span class="fs">{e(l["from"])}</span>' if l.get('from') else '') + '</li>' for l in f['legs'])
        who = f'<p class="fw">{e(f["who"])}</p>' if f.get('who') else ''
        pnr = f'<p class="pnr">PNR <b>{e(f["pnr"])}</b> <button type="button" class="cp" data-copy="{e(f["pnr"])}">복사</button>' + (f' <span class="fs">{e(f.get("airline",""))}</span>' if f.get('airline') else '') + '</p>' if f.get('pnr') else '<p class="pnr">PNR 없음</p>'
        out += f'<div class="flt">{who}{pnr}<ul class="legs">{legs}</ul></div>'
    return f'<section><h2>항공</h2><div class="card fl">{out}</div></section>'

days = ''.join(
    f'<li class="day{" free" if d.get("free") else ""}"><div class="dd"><b>{e(d["date"])}</b><span>{e(d["dow"])}</span></div>'
    f'<div class="dc"><p class="dt">{e(d["title"])}</p><p class="di">{" · ".join(e(i) for i in d["items"])}</p>'
    + (f'<p class="dn">{rich(d["note"])}</p>' if d.get('note') else '') + '</div></li>' for d in web['days'])

imgs = web.get('schedule_imgs') or []
sched_btn = (('<button type="button" class="btn sec" id="sched-toggle" aria-expanded="false">일정표 보기</button>'
              '<div id="sched" class="sched" hidden>' + ''.join(f'<img src="{e(x)}" alt="일정표 {k+1}쪽" loading="lazy">' for k, x in enumerate(imgs)) + '</div>') if imgs else '')
days_block = '' if imgs else f'<section><h2>일정</h2><ol class="days">{days}</ol></section>'
guide_phone = rich(job.get('guidePhone', '')) if job.get('guidePhone') else ''
notes = ''.join(note_html(n, i) for i, n in enumerate(t['notes']))

nls = web.get("namelists") or ([["", web["namelist_url"]]] if web.get("namelist_url") else [])  # [[라벨, 드라이브 링크], ...]
namelist_btn = (''.join(f'<a class="btn sec" href="{e(u)}" target="_blank" rel="noopener">명단(룸리스트) 보기{(" · " + e(lb)) if lb else ""}</a>' for lb, u in nls)
                if nls else '<p class="hint wa-hint">명단은 아직 없습니다. 받는 대로 따로 전달드리겠습니다.</p>')
HAL = {'seoul': '서울', 'busan': '부산', 'jeju': '제주'}
_regs = []
for _x in T:
    for _d in str(_x.get('dest', 'Seoul')).split('+'):
        _k = _d.strip().lower()
        if _k in HAL and _k not in _regs: _regs.append(_k)
HALAL_BASE = 'https://arbatravelkorea.github.io/halal/'
_hq = ('?r=' + ','.join(_regs)) if _regs else ''  # 일정에 있는 지역들이 미리 선택된 채로 열림 (여러 개 가능)
halal_btn = ''
if _regs:
    halal_btn = (f'<a class="btn halal" href="{HALAL_BASE}{_hq}" target="_blank" rel="noopener">🕌 할랄&amp;무슬림 프렌들리 식당 리스트</a>'
                 f'<p class="hint">손님용 영어 리스트 (왓츠앱방에 공유해주세요. 자유일정 날 네이버지도·구글맵 바로 연결): '
                 f'<span class="ph"><a href="{HALAL_BASE}en/{_hq}" target="_blank" rel="noopener">English</a>'
                 f'<button type="button" class="cp" data-copy="{HALAL_BASE}en/{_hq}">복사</button></span></p>')
page = f'''<title>{e(t["tripId"])} 투어지침서</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap">
<style>
/* Layout: single mobile column — red brand band, then stacked sections a guide scrolls on the bus */
:root {{
  --red:#BE1E2D; --red-ink:#fff; --gold:#ECAC1B; --bg:#FAF7F5; --card:#FFFFFF; --fg:#1C1716; --muted:#6E6461;
  --line:#ECE4E0; --soft:#F4EEEB; --tl:#DCD3CF; --green:#1C8C4E; --green-bg:#E2F4E9; --warn-bg:#FFF1F2; --link:#1A5FD0;
  --f-body:"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg:#171313; --card:#221C1B; --fg:#F3EDEA; --muted:#AEA3A0; --line:#3A3130; --soft:#2B2423; --tl:#463C3A;
  --green:#5BD08D; --green-bg:#173A27; --warn-bg:#3A1C1F; --link:#8DB4FF; color-scheme:dark }} }}
:root[data-theme="dark"] {{ --bg:#171313; --card:#221C1B; --fg:#F3EDEA; --muted:#AEA3A0; --line:#3A3130; --soft:#2B2423; --tl:#463C3A;
  --green:#5BD08D; --green-bg:#173A27; --warn-bg:#3A1C1F; --link:#8DB4FF; color-scheme:dark }}
* {{ box-sizing:border-box }}
body {{ background:var(--bg); color:var(--fg); font:15px/1.6 var(--f-body); -webkit-text-size-adjust:100% }}
.wrap {{ max-width:640px; margin:0 auto; padding-left:max(16px, env(safe-area-inset-left,0px)); padding-right:max(16px, env(safe-area-inset-right,0px)) }}
header {{ background:var(--red); color:var(--red-ink); position:relative; overflow:hidden }}
header::after {{ content:""; position:absolute; right:-40px; top:-50px; width:150px; height:150px; border-radius:50%; background:var(--gold) }}
header .wrap {{ padding-block:22px 26px; position:relative; z-index:1 }}
.brand {{ font-weight:800; letter-spacing:.32em; font-size:13px }}
.kicker {{ display:inline-block; margin-top:18px; font-size:11px; letter-spacing:.18em; font-weight:700; background:rgba(255,255,255,.18); padding:3px 9px; border-radius:4px }}
h1 {{ margin:6px 0 2px; font-size:clamp(24px,7vw,32px); line-height:1.15; font-weight:800; text-wrap:balance; overflow-wrap:anywhere }}
.sub {{ opacity:.9; font-size:14px }}
main .wrap {{ padding-block:18px 40px; display:grid; gap:22px }}
section h2 {{ margin:0 0 10px; font-size:13px; letter-spacing:.14em; color:var(--red); font-weight:800 }}
:root[data-theme="dark"] section h2 {{ color:#FF8A94 }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) section h2 {{ color:#FF8A94 }} }}
.card {{ background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 16px }}
.guide {{ display:flex; flex-wrap:wrap; align-items:baseline; gap:6px 14px }}
.guide b {{ font-size:22px }}
.guide .ph a {{ font-size:15px }}
.facts {{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px 16px; margin-top:12px; font-size:14px }}
.facts span {{ display:block; font-size:11px; letter-spacing:.12em; color:var(--muted); font-weight:700 }}
.pax {{ display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:5px; margin-top:12px }}
.px {{ background:var(--soft); border-radius:8px; padding:7px 2px; justify-content:space-between; min-height:62px; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:11px; text-align:center; line-height:1.2 }}
.px span {{ font-size:10.5px; letter-spacing:-.02em; white-space:nowrap }}
.px b {{ font-size:18px; font-variant-numeric:tabular-nums }}
.px.tl {{ background:var(--tl) }}
.paxh {{ margin:12px 0 -6px; font-size:12.5px; font-weight:700; color:var(--muted) }}
.paxsum {{ margin:10px 0 0; font-size:14px; text-align:right }}
.paxsum b {{ color:var(--red); font-size:17px }}
h1.multi {{ font-size:clamp(20px,6vw,28px) }}
.fl {{ display:grid; gap:12px }}
.flt + .flt {{ border-top:1px solid var(--line); padding-top:12px }}
.fw {{ margin:0 0 4px; font-weight:700; font-size:13px; color:var(--red) }}
.pnr {{ margin:0 0 6px; font-size:15px }}
.pnr b {{ font-size:19px; letter-spacing:.06em; font-variant-numeric:tabular-nums }}
.legs {{ list-style:none; margin:0; padding:0; display:grid; gap:6px; font-size:14px }}
.fd {{ display:inline-block; min-width:34px; font-size:11.5px; font-weight:700; color:var(--muted) }}
.fs {{ font-size:12.5px; color:var(--muted) }}
.px.tot {{ background:var(--red); color:var(--red-ink) }}
.btns {{ display:grid; gap:10px }}
.btn {{ display:flex; align-items:center; justify-content:center; gap:8px; min-height:50px; border-radius:12px; font-weight:700; font-size:16px; text-decoration:none; padding:10px 14px; text-align:center }}
.btn.wa {{ background:var(--green-bg); color:var(--green) }}
.btn.pay {{ background:var(--red); color:var(--red-ink) }}
.btn.sec {{ background:var(--card); color:var(--fg); border:1px solid var(--line) }}
.btn.halal {{ background:#F7F5F0; color:#174C3C; border:1.5px solid #C5A46D }}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) .btn.halal {{ background:#1C2823; color:#E6D3A8; border-color:#C5A46D }} }}
:root[data-theme="dark"] .btn.halal {{ background:#1C2823; color:#E6D3A8; border-color:#C5A46D }}

.hint.wa-hint {{ text-align:center; font-weight:700; margin-top:-6px !important; color:var(--fg) }}
.hint {{ font-size:12.5px; color:var(--muted); margin:6px 2px 0 }}
ol {{ list-style:none; margin:0; padding:0 }}
.notes {{ display:grid; gap:10px }}
.note {{ display:flex; gap:12px; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:14px 14px 14px 12px }}
.note.warn {{ background:var(--warn-bg) }}
.num {{ flex:none; width:24px; height:24px; border-radius:50%; background:var(--red); color:var(--red-ink); font-weight:700; font-size:13px; display:grid; place-items:center; margin-top:1px }}
.nb {{ min-width:0 }}
.nb p {{ margin:0; overflow-wrap:anywhere }}
.nh {{ font-weight:700; margin-bottom:4px !important }}
.ph {{ display:inline-flex; align-items:center; gap:4px; white-space:nowrap }}
.ph a {{ color:var(--link); font-weight:700; text-decoration:underline; text-underline-offset:2px }}
.ph a.sms, .cp {{ font:700 11px var(--f-body); color:var(--green); background:var(--green-bg); border:0; border-radius:6px; padding:2px 7px; text-decoration:none; cursor:pointer }}
ul.bl {{ margin:2px 0 0; padding-left:18px; display:grid; gap:5px }}
ul.bl > li::marker {{ color:var(--red) }}
ul.sub {{ margin:4px 0 2px; padding-left:16px; display:grid; gap:4px; list-style:'– '; color:var(--fg) }}
.nh.cat {{ font-size:16px }}
button.btn {{ width:100%; border:1px solid var(--line); cursor:pointer; font-family:var(--f-body) }}
.sched {{ display:grid; gap:10px }}
.sched[hidden] {{ display:none }}
.sched img {{ width:100%; border-radius:10px; border:1px solid var(--line); background:#fff }}
.ext {{ color:var(--link); overflow-wrap:anywhere }}
.days {{ display:grid; gap:8px }}
.day {{ display:flex; gap:14px; background:var(--card); border:1px solid var(--line); border-radius:12px; padding:12px 14px }}
.day.free {{ background:var(--soft) }}
.dd {{ flex:none; width:52px; text-align:center }}
.dd b {{ display:block; font-size:18px; color:var(--red); font-variant-numeric:tabular-nums }}
.dd span {{ font-size:12px; color:var(--muted) }}
.dc {{ min-width:0 }}
.dc p {{ margin:0 }}
.dt {{ font-weight:700 }}
.di {{ color:var(--muted); font-size:14px }}
.dn {{ font-size:13px; margin-top:4px !important }}
footer {{ text-align:center; font-size:12px; color:var(--muted); padding-block:0 30px }}
a:focus-visible, button:focus-visible {{ outline:3px solid var(--gold); outline-offset:2px }}
</style>

<header><div class="wrap">
  <div class="brand">ARBA TRAVEL KOREA</div>
  <div class="kicker">TOUR VOUCHER · 가이드용</div>
  <h1{' class="multi"' if multi else ''}>{"<br>".join(e(x["tripId"]) for x in T)}</h1>
  <div class="sub">{e(" + ".join(x.get("title","") for x in T) if multi else t.get("title",""))} · {e(t["arrival"])} – {e(t["departure"])}{" · 합류 투어" if multi else ""}</div>
</div></header>

<main><div class="wrap">
  <section>
    <div class="card">
      <div class="guide"><b>{e(job["guide"])} 가이드님</b>{guide_phone}</div>
      <div class="facts">
        <div><span>입국</span>{e(t["arrival"])}</div><div><span>출국</span>{e(t["departure"])}</div>
        <div><span>도시</span>{e(t.get("dest","Seoul"))}</div><div><span>예약명</span>{"<br>".join(e(x["tripId"]) for x in T)}</div>
      </div>
      {pax_html}
      <p class="hint">{e(t.get("attachNote","")).replace("이 PDF 뒤쪽에 명단(룸리스트)과 일정표가 붙어 있습니다.","").replace("이 PDF 뒤쪽에 일정표가 붙어 있습니다.","").replace("명단은 아직 받지 못해 받는 대로 따로 전달드리겠습니다.","").strip()}</p>
    </div>
  </section>

{flights_html()}
  <section class="btns">
    {"".join((f'<a class="btn wa" href="{e(x["wa"])}" target="_blank" rel="noopener">WhatsApp 단톡방 입장하기' + (f' · {e(short(x["tripId"]))}' if multi else '') + '</a>') if x.get("wa") else '<p class="hint wa-hint">왓츠앱 단톡방은 아직 만들어지지 않았습니다. 만들어지는 대로 링크를 따로 보내드리겠습니다.</p>' for x in T)}
    <p class="hint wa-hint">투어 시작 최소 이틀 전 입장해 필요한 정보 전달과 인사 나눠주세요.{" 두 방 모두 입장하고 공지는 두 방에 다 올려주세요." if multi else ""}</p>
    {namelist_btn}
    {sched_btn}
    {halal_btn}
  </section>

{days_block}

  <section>
    <h2>가이드님 확인사항</h2>
    <ol class="notes">{notes}</ol>
  </section>

  <section class="btns">
    <h2>투어 종료 후 정산</h2>
    {"".join(f'<a class="btn pay" href="{e(x["settlement"])}" target="_blank" rel="noopener">{e(x["tripId"])} 정산링크</a>' for x in T)}
    <p class="hint">전화번호를 눌러도 전화가 안 열리면 [복사]를 눌러 붙여넣어 주세요.</p>
  </section>
</div></main>
<footer>ARBA Travel Korea Co., Ltd. · License 239-88-01134 · korea@arbatravel.com · 발행 {e(job["issued"])}</footer>
<script>
const st = document.getElementById('sched-toggle');
if (st) st.addEventListener('click', () => {{ const box = document.getElementById('sched'); box.hidden = !box.hidden; st.setAttribute('aria-expanded', String(!box.hidden)); st.textContent = box.hidden ? '일정표 보기' : '일정표 닫기'; }});
document.addEventListener('click', async ev => {{
  const b = ev.target.closest('.cp'); if (!b) return;
  const v = b.dataset.copy;
  try {{ await navigator.clipboard.writeText(v); b.textContent = '복사됨'; }}
  catch (e) {{ const r = document.createRange(); r.selectNodeContents(b.previousElementSibling.previousElementSibling || b.previousElementSibling); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = '선택됨'; }}
  setTimeout(() => b.textContent = '복사', 1600);
}});
</script>
'''
# 허브 아티팩트 안의 하위 페이지로 게시되므로 문서 골격을 직접 붙인다
page = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + page
open(out, 'w').write(page)
print(out, len(page))
