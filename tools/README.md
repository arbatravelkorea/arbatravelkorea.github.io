# ARBA 투어지침서 도구 (개인정보 없음 — 스크립트·폰트·로고만)
1. `git clone --depth 1 https://github.com/arbatravelkorea/arbatravelkorea.github.io` → `bash tools/setup.sh`
2. job.json / web.json 작성 → `python3 /home/claude/tv/gen_web.py job.json web.json /home/claude/tv/hub/v/<슬러그>/index.html`
3. 허브 게시(Artifact, file_path=/home/claude/tv/web031/index.html, root=/home/claude/tv/hub)
4. `bash tools/share.sh "<TripID>" "<가이드>" "<기간>" <DEST> <슬러그>`
- 명단 엑셀 → 가로 1장 PDF: `python3 /home/claude/tv/rl_pdf.py RoomList.xlsx out.pdf`
