#!/bin/bash
# 카톡 공유 카드 + 공유 페이지 만들고 push
# 사용: bash tools/share.sh "<표시 TripID>" "<가이드>" "<기간 예: 03 – 08 Nov 2026>" "<Seoul|Busan|Jeju|Seoul+Jeju|Seoul+Busan>" <슬러그>
set -e
TRIP="$1"; GUIDE="$2"; PERIOD="$3"; DEST="$4"; SLUG="$5"
R="$(cd "$(dirname "$0")/.." && pwd)"; TV=${TV:-/home/claude/tv}
HUB=https://claude.ai/artifact/HHcp1Xh2ytfgtfk5tmwoMw
python3 "$TV/make_og.py" "$TRIP" "$GUIDE" "$PERIOD" "$DEST" "$R/img/og_$SLUG.png"
python3 "$TV/make_share.py" "$TRIP" "$GUIDE" "$HUB#$SLUG" https://arbatravelkorea.github.io "$R" "$DEST" "" "$SLUG"
cd "$R" && git add "img/og_$SLUG.png" "v/$SLUG/index.html"
git -c user.name=Claude -c user.email=noreply@anthropic.com commit -q -m "Tour voucher share card: $TRIP" -m "Co-Authored-By: Claude <noreply@anthropic.com>"
git fetch -q origin main && git rebase -q origin/main && git push -q origin HEAD:main
echo "https://arbatravelkorea.github.io/v/$SLUG/"
