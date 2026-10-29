#!/bin/bash
# 투어지침서 작업폴더 준비: bash tools/setup.sh  → /home/claude/tv 에 도구·허브 폴더 생성
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"; TV=${TV:-/home/claude/tv}
mkdir -p "$TV/hub/v" "$TV/web031" "$TV/fonts" "$TV/og"
cp "$HERE"/*.py "$HERE"/logo_white.png "$TV/"; cp "$HERE"/fonts/*.ttf "$TV/fonts/"; cp "$HERE/hub_index.html" "$TV/web031/index.html"
python3 -c "import pymupdf, pikepdf, openpyxl, reportlab" 2>/dev/null || pip install -q --break-system-packages pymupdf pikepdf openpyxl reportlab
echo "ready: $TV"
