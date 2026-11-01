"""손님 이름 앞 존칭·칭호(Title) 찾기 — 공항 피켓(make_sign.py)과 지침서 메모(gen_web.py)에서 같이 씀.
2026-11-01 사용자 지시: 이름 앞에 Title이 있으면 피켓에 꼭 붙이고, 지침서에 Title 설명 + 'Title + 이름'으로 부르라는 메모.
"""
import re

# (이름 앞 표기 정규식, 표시, 설명) — 긴 것부터 검사
TITLES = [
    (r"dato'?\s*seri", "Dato' Seri", "Dato'보다 한 단계 높은 말레이시아 훈작 칭호입니다"),
    (r"datuk\s*seri", "Datuk Seri", "Datuk보다 한 단계 높은 말레이시아 훈작 칭호입니다"),
    (r"datin\s*seri", "Datin Seri", "Dato' Seri·Datuk Seri의 부인에게 쓰는 칭호입니다"),
    (r"datin\s*paduka", "Datin Paduka", "말레이시아 주(州)에서 여성에게 주는 높은 훈작 칭호입니다"),
    (r"tan\s*sri", "Tan Sri", "말레이시아 국왕이 주는 높은 훈작 칭호입니다 (Datuk보다 높음)"),
    (r"puan\s*sri", "Puan Sri", "Tan Sri의 부인에게 쓰는 칭호입니다"),
    (r"toh\s*puan", "Toh Puan", "Tun의 부인에게 쓰는 칭호입니다"),
    (r"tun", "Tun", "말레이시아 최고 등급의 훈작 칭호입니다 (매우 드묾)"),
    (r"datuk", "Datuk", "말레이시아 국왕·주(州)에서 주는 훈작 칭호입니다 (영국의 Sir와 비슷)"),
    (r"dato'?", "Dato'", "말레이시아 주(州) 술탄·주지사가 주는 훈작 칭호입니다 (영국의 Sir와 비슷)"),
    (r"datin", "Datin", "Dato'·Datuk 칭호를 받은 분의 부인에게 쓰는 칭호입니다"),
    (r"prof(?:essor)?\.?", "Prof.", "교수 칭호입니다"),
    (r"dr\.?", "Dr.", "박사 또는 의사 칭호입니다"),
    (r"haji", "Haji", "메카 성지순례(하지)를 다녀온 남성에게 쓰는 존칭입니다"),
    (r"hajah", "Hajah", "메카 성지순례(하지)를 다녀온 여성에게 쓰는 존칭입니다"),
    (r"puan|pn\.?", "Puan", "기혼 여성에게 쓰는 말레이어 존칭입니다 (Mrs.와 비슷)"),
    (r"encik|en\.?", "Encik", "남성에게 쓰는 말레이어 존칭입니다 (Mr.와 비슷)"),
    (r"cik", "Cik", "여성(주로 미혼)에게 쓰는 말레이어 존칭입니다 (Ms.와 비슷)"),
    (r"mrs\.?", "Mrs.", "기혼 여성 존칭입니다"),
    (r"mr\.?", "Mr.", "남성 존칭입니다"),
    (r"ms\.?|miss", "Ms.", "여성 존칭입니다"),
]
HONOR = {"Dato' Seri", "Datuk Seri", "Datin Seri", "Datin Paduka", "Tan Sri", "Puan Sri", "Toh Puan", "Tun", "Datuk", "Dato'", "Datin"}


def clean(raw: str) -> str:
    """Trip ID 숫자_ 와 괄호 부분, ' · ' 뒤(상품명)를 뺀 손님 이름."""
    s = re.sub(r'^\s*(?:PT\s*)?\d+[_\s]*', '', raw.strip())
    s = s.split(' · ')[0]
    s = re.sub(r'\(.*?\)', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def split_title(name: str):
    """'Puan Badariah Binti Ismail' → (['Puan'], 'Badariah Binti Ismail'). 칭호 여러 개(예: Datuk Dr.)도 순서대로."""
    found, rest = [], name.strip()
    while True:
        for pat, disp, _ in TITLES:
            m = re.match(r'(?:' + pat + r')(?=\s|$)\s*', rest, flags=re.I)
            if m and rest[m.end():].strip():
                found.append(disp); rest = rest[m.end():].strip(); break
        else:
            return found, rest


def no_bin(s: str) -> str:
    return re.split(r'\s+(?:bin|binti|bte|bt)\s+', s, flags=re.I)[0].strip()


def sign_name(raw: str) -> str:
    """피켓 이름: Title은 앞에 그대로 + 이름(Bin/Binti 뒤 생략), 대문자."""
    titles, rest = split_title(clean(raw))
    return ' '.join(titles + [no_bin(rest)]).upper()


def title_note(raw: str):
    """지침서 메모 한 항목 (소제목, [하위...]) 또는 None."""
    titles, rest = split_title(clean(raw))
    if not titles:
        return None
    nm = ' '.join(w if w.isupper() and len(w) <= 3 else w.capitalize() for w in no_bin(rest).split(' '))
    call = ' '.join(titles) + ' ' + nm
    desc = {d: x for _, d, x in TITLES}
    subs = [f"'{t}' — {desc[t]}." for t in titles]
    subs.append(f"손님을 부를 때는 이름만 부르지 말고 꼭 '{call}'처럼 칭호 + 이름으로 불러주세요. 소개할 때도 같은 호칭을 써주세요.")
    if any(t in HONOR for t in titles):
        subs.append("말레이시아에서 이런 칭호는 국가·주(州)에서 받은 것이라 매우 중요하게 여깁니다. 칭호를 빼고 부르면 실례가 될 수 있습니다.")
    return [f"손님 호칭 — {call} (꼭 지켜주세요)", subs]


if __name__ == '__main__':
    for n in ["Puan Badariah Binti Ismail", "20260721135856891_SAIDATUL RASHIDA MOHD RASHID",
              "Dato' Seri Ahmad Zahid bin Hamidi", "Datin Che Teh Ija", "Tan Sri Muhyiddin Yassin",
              "Dr. Siti Aminah binti Ali", "Datuk Dr. Ramlee Awang", "Noor Zafirah Binti Zulfaqar", "Mr. John Tan"]:
        print(sign_name(n), '|', title_note(n))
