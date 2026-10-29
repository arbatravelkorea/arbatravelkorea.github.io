# 일정표 PDF에서 연속된 두 날짜 행을 맞바꿈: swap_rows.py in.pdf out.pdf PAGE yA0 yA1 yB1 "dayA,ddA" "dayB,ddB" bgA bgB
# A=[yA0,yA1] 위 행, B=[yA1,yB1] 아래 행. 바꾼 뒤 첫 슬롯 라벨=dayA/ddA(원래 A 번호), 둘째=dayB/ddB. bg는 r,g,b(0-255) 원래 행 배경
import sys, pymupdf as f
src_p, out_p, pg_i = sys.argv[1], sys.argv[2], int(sys.argv[3]); yA0, yA1, yB1 = map(float, sys.argv[4:7])
labA, labB = sys.argv[7].split(','), sys.argv[8].split(',')
bgA = tuple(int(x)/255 for x in sys.argv[9].split(',')); bgB = tuple(int(x)/255 for x in sys.argv[10].split(','))
src = f.open(src_p); out = f.open(); W, H = src[pg_i].rect.width, src[pg_i].rect.height
for i in range(len(src)):
    if i != pg_i: out.insert_pdf(src, from_page=i, to_page=i); continue
    pg = out.new_page(width=W, height=H)
    put = lambda a, b, y: pg.show_pdf_page(f.Rect(0, y, W, y + b - a), src, pg_i, clip=f.Rect(0, a, W, b))
    put(0, yA0, 0); put(yA1, yB1, yA0); y2 = yA0 + (yB1 - yA1); put(yA0, yA1, y2); put(yB1, H, yB1)
    def relabel(dy, day, dd, bg):
        pg.draw_rect(f.Rect(96, dy+3.2, 106, dy+21.6), color=None, fill=bg)
        pg.insert_text((97.2, dy+18.4), day, fontname='helv', fontsize=16, color=(0xbe/255, 0x1e/255, 0x2d/255))
        pg.draw_rect(f.Rect(67.5, dy+23.2, 80.5, dy+34), color=None, fill=bg)
        pg.insert_text((68.2, dy+31.9), dd, fontname='hebo', fontsize=8.5, color=(0x3a/255, 0x40/255, 0x47/255))
    relabel(yA0, *labA, bgB); relabel(y2, *labB, bgA)
out.save(out_p)
