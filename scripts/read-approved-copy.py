"""Extract the approved DOCX without paraphrasing; print an apply_patch payload.

Usage: bundled-python scripts/read-approved-copy.py path/to/MedWHOLE-Website-Copy.docx
The output is reviewed/applied with apply_patch, never written by this script.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph

sys.stdout.reconfigure(encoding="utf-8")
source = Path(sys.argv[1])
document = Document(source)
pages = {}
notes = []
page = section = None
paragraph_index = -1
list_mode = False
skip = False

for element in document.element.body:
    if element.tag.endswith("}tbl"):
        table = Table(element, document)
        if page and section and not skip:
            rows = [[cell.text.strip() for cell in row.cells] for row in table.rows]
            if rows[0] == ["Number", "Label"]:
                section["blocks"].append({"kind": "figures", "items": [" ".join(row) for row in rows[1:]]})
        continue
    if not element.tag.endswith("}p"):
        continue
    paragraph_index += 1
    paragraph = Paragraph(element, document)
    text = paragraph.text.strip()
    if not text:
        continue
    # The source explicitly labels these ranges as editorial/working material.
    if paragraph_index >= 1288:
        break
    if paragraph_index in range(938, 942):
        continue
    route = re.match(r"^(/\S*)\s*· Page title (.*?) · Meta description (.*)$", text)
    if route:
        path, title, description = route.groups()
        page = {"path": path, "title": title, "description": description, "breadcrumb": "", "sections": []}
        pages[path] = page
        section = None
        skip = list_mode = False
        continue
    if text.startswith(("Note for build", "For reference only", "Note on wording")):
        notes.append({"paragraph": paragraph_index, "path": page["path"] if page else None, "text": text})
        continue
    if paragraph.style.name.startswith("Heading"):
        # Document outline entries delimit pages; they are not page content.
        if paragraph_index in (838, 1110, 1148):
            page = section = None
        continue
    if not page:
        continue
    numbered = re.match(r"^(\d+)\. (.*)$", text)
    if numbered:
        number, label = numbered.groups()
        # Contact's footer is shared globally. It is not duplicated in main.
        skip = page["path"] == "/contact" and label == "Footer"
        # CIC outcomes must be omitted until supplied, per source paragraph 781.
        skip = skip or (page["path"].endswith("community-innovation-challenge") and label == "Results")
        section = {"number": int(number), "label": label, "blocks": []}
        if not skip:
            page["sections"].append(section)
        list_mode = False
        continue
    if text.startswith("Breadcrumb — "):
        page["breadcrumb"] = text.removeprefix("Breadcrumb — ")
        continue
    if not section or skip:
        continue
    if text in ("List", "Figures"):
        list_mode = text == "List"
        continue
    labelled = re.match(r"^(Heading|Subheading|Body|Pull quote|Figures|Buttons|Label) — (.*)$", text)
    if labelled:
        kind, value = labelled.groups()
        list_mode = False
        kind = {"Heading": "heading", "Subheading": "subheading", "Body": "paragraph", "Pull quote": "quote", "Figures": "figures", "Buttons": "buttons", "Label": "label"}[kind]
        block = {"kind": kind}
        if kind in ("figures", "buttons"):
            block["items"] = value.split(" · ")
        else:
            block["text"] = value
        # The document's later confirmed correction supersedes its older figure.
        if page["path"] == "/academy" and kind == "paragraph" and value.startswith("We publish attendance"):
            block["text"] = value.replace("450+ and 250+ are the season figures for Gosa and Kunyami.", "Gosa's season figure is 450+; Kunyami's 2026 Summer School averaged 280 children a day.")
        section["blocks"].append(block)
        continue
    if text.startswith(("Slide ", "This section is built to grow.", "Auto-advance is fine.")):
        notes.append({"paragraph": paragraph_index, "path": page["path"], "text": text})
        continue
    # Compact paragraphs following a List are the actual list entries.
    if list_mode or paragraph.style.name == "Compact":
        if not section["blocks"] or section["blocks"][-1]["kind"] != "list":
            section["blocks"].append({"kind": "list", "items": []})
        section["blocks"][-1]["items"].append(text)
    else:
        section["blocks"].append({"kind": "paragraph", "text": text})

assert len(pages) == 39, f"Expected 39 pages, got {len(pages)}"
payload = {"source": source.name, "sha256": hashlib.sha256(source.read_bytes()).hexdigest(), "pages": pages}
files = {
    "lib/approved-website-copy.json": json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
    "docs/website-copy-build-notes.json": json.dumps(notes, ensure_ascii=False, indent=2) + "\n",
}
print("*** Begin Patch")
for path, contents in files.items():
    target = Path(path)
    if target.exists():
        print(f"*** Update File: {path}\n@@")
        for line in target.read_text(encoding="utf-8").splitlines():
            print("-" + line)
    else:
        print(f"*** Add File: {path}")
    for line in contents.splitlines():
        print("+" + line)
print("*** End Patch")
