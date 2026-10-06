#!/usr/bin/env python3
"""Assemble the site: src/layout.html + src/partials/* + src/pages/<key>.html -> <key>.html in the repo root.

Each page file starts with a few `key: value` lines (title, desc, titlekey), a line with `---`, then the
page's <main> content. Run `python3 tools/build.py` after editing anything in src/, and commit the output.
"""
import glob, os, re, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
read = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

layout = read("src/layout.html")
header = read("src/partials/header.html")
footer = read("src/partials/footer.html")

for path in sorted(glob.glob(os.path.join(ROOT, "src/pages/*.html"))):
    key = os.path.splitext(os.path.basename(path))[0]
    raw = open(path, encoding="utf-8").read()
    meta_text, main = raw.split("\n---\n", 1)
    meta = dict(line.split(": ", 1) for line in meta_text.strip().splitlines())
    # mark the current page in the header nav
    hdr = header.replace(f'data-nav="{key}"', f'data-nav="{key}" aria-current="page"')
    out = (layout.replace("{{header}}", hdr).replace("{{footer}}", footer).replace("{{main}}", main.strip("\n"))
           .replace("{{title}}", html.escape(meta["title"], quote=False))
           .replace("{{desc}}", html.escape(meta["desc"], quote=True))
           .replace("{{titlekey}}", meta["titlekey"]).replace("{{key}}", key))
    leftover = re.findall(r"\{\{[a-z]+\}\}", out)
    assert not leftover, (key, leftover)
    open(os.path.join(ROOT, f"{key}.html"), "w", encoding="utf-8").write(out)
    print("built", f"{key}.html")
