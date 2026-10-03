import re, zlib, base64, sys

raw = open(sys.argv[1], "rb").read()

streams = re.findall(rb"stream\r?\n(.*?)endstream", raw, re.S)
print(f"Found {len(streams)} streams", file=sys.stderr)

def decode(s):
    # strip trailing whitespace/newline before endstream
    s = s.rstrip(b"\r\n")
    try:
        data = base64.a85decode(s, adobe=True)
        return zlib.decompress(data)
    except Exception as e:
        return b""

def unescape_pdf_string(b):
    out = bytearray()
    i = 0
    while i < len(b):
        c = b[i]
        if c == 0x5C:  # backslash
            i += 1
            if i >= len(b): break
            n = b[i]
            mapping = {ord('n'):10, ord('r'):13, ord('t'):9, ord('b'):8, ord('f'):12,
                       ord('('):40, ord(')'):41, ord('\\'):92}
            if n in mapping:
                out.append(mapping[n]); i += 1
            elif 0x30 <= n <= 0x37:  # octal, up to 3 digits
                digits = chr(n); i += 1
                while i < len(b) and len(digits) < 3 and 0x30 <= b[i] <= 0x37:
                    digits += chr(b[i]); i += 1
                out.append(int(digits, 8) & 0xFF)
            else:
                out.append(n); i += 1
        else:
            out.append(c); i += 1
    return out.decode("cp1252", errors="replace")

for idx, s in enumerate(streams):
    d = decode(s)
    if not d:
        continue
    txt = d.decode("latin-1", errors="replace")
    # find text-showing operators
    pieces = []
    for m in re.finditer(r"\((?:[^()\\]|\\.)*\)\s*Tj|\[(?:[^\[\]]*)\]\s*TJ|Td|TD|T\*|Tm", txt):
        tok = m.group(0)
        if tok.endswith("Tj"):
            s_inner = re.match(r"\((.*)\)\s*Tj", tok, re.S).group(1)
            pieces.append(unescape_pdf_string(s_inner.encode("latin-1")))
        elif tok.endswith("TJ"):
            arr = re.match(r"\[(.*)\]\s*TJ", tok, re.S).group(1)
            for sm in re.finditer(r"\((?:[^()\\]|\\.)*\)", arr, re.S):
                pieces.append(unescape_pdf_string(sm.group(0)[1:-1].encode("latin-1")))
        elif tok in ("Td", "TD", "T*", "Tm"):
            pieces.append("\n")
    page_text = "".join(pieces)
    print(f"\n===== STREAM {idx+1} =====")
    print(page_text)
