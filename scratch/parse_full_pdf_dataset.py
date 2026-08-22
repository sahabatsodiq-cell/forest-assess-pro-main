import pypdf
import os
import re
import json

pdf_path = "C:/Users/BPHP IX/.gemini/antigravity-ide/brain/a0ed7cc6-53b0-4e0b-87c8-6cc7757bb147/.user_uploaded/media_1787431878466.pdf"
if not os.path.exists(pdf_path):
    pdf_path = "C:/Users/BPHP IX/.gemini/antigravity-ide/brain/a0ed7cc6-53b0-4e0b-87c8-6cc7757bb147/.user_uploaded/media_1787427059400.pdf"

reader = pypdf.PdfReader(pdf_path)

# List of standard GANISPH qualification names
KNOWN_QUALIFICATIONS = [
    "GANISPH PENGUKURAN DAN PERPETAAN HUTAN",
    "GANISPH PEMANFAATAN JASA LINGKUNGAN KARBON",
    "GANISPH PENGUJIAN KELOMPOK GETAH",
    "GANISPH PENGUJIAN KELOMPOK BATANG",
    "GANISPH PENGUJIAN KELOMPOK RESIN",
    "GANISPH PENGUJIAN KAYU GERGAJIAN",
    "GANISPH PENGUJIAN SERPIH KAYU",
    "GANISPH PEMANDU WISATA ALAM",
    "GANISPH PENGUJIAN KAYU BULAT",
    "GANISPH PENGUJIAN KAYU LAPIS",
    "GANISPH PERENCANAAN HUTAN",
    "GANISPH PEMANENAN HUTAN",
    "GANISPH PEMBINAAN HUTAN",
]

def clean_qualification(raw):
    raw_upper = raw.upper()
    for kq in KNOWN_QUALIFICATIONS:
        if kq in raw_upper:
            return kq
    return raw.split(" Jl.")[0].split(" JL.")[0].split(" Komplek")[0].split(" Komp")[0].strip()

# 1. Extract Names (Pages 0 to 20)
names = []
for page_num in range(0, 21):
    text = reader.pages[page_num].extract_text()
    lines = text.split("\n")
    for l in lines:
        l = l.strip()
        if not l or l.startswith("NO") or l.startswith("NAMA"):
            continue
        match = re.match(r"^(\d+)\s+(.+)$", l)
        if match:
            idx = int(match.group(1))
            name = match.group(2).strip()
            names.append((idx, name))

print(f"Total names extracted: {len(names)}")

# 2. Extract Qualifications (Pages 21 to 41)
qualifications = []
for page_num in range(21, 42):
    text = reader.pages[page_num].extract_text()
    lines = text.split("\n")
    for l in lines:
        l = l.strip()
        if not l or "KUALIFIKASI" in l or "ALAMAT" in l:
            continue
        if "GANISPH" in l:
            q_clean = clean_qualification(l)
            qualifications.append(q_clean)

print(f"Total qualifications extracted: {len(qualifications)}")

# 3. Extract Emails (Pages 42 to 62)
emails = []
for page_num in range(42, 63):
    text = reader.pages[page_num].extract_text()
    lines = text.split("\n")
    for l in lines:
        l = l.strip()
        if not l or "EMAIL" in l or "JENIS KELAMIN" in l:
            continue
        parts = l.split()
        if len(parts) > 0 and "@" in parts[0]:
            emails.append(parts[0].strip())

print(f"Total emails extracted: {len(emails)}")

# 4. Extract Registration Numbers (Pages 84 to 104)
reg_numbers = []
for page_num in range(84, 105):
    text = reader.pages[page_num].extract_text()
    lines = text.split("\n")
    for l in lines:
        l = l.strip()
        if not l or "MASA BERLAKU" in l or "NOMOR REGISTER" in l:
            continue
        tokens = l.split()
        reg_found = None
        for tok in tokens:
            cleaned = tok.strip()
            if re.match(r"^\d{10,16}$", cleaned):
                reg_found = cleaned
                break
        if reg_found:
            reg_numbers.append(reg_found)

print(f"Total registration numbers extracted: {len(reg_numbers)}")

# Merge & Build JSON dataset
dataset = []
total_records = min(len(names), len(qualifications), len(emails), len(reg_numbers))
print(f"Building clean dataset for {total_records} records...")

for i in range(total_records):
    idx, name = names[i]
    qual = qualifications[i]
    email = emails[i]
    reg_no = reg_numbers[i]

    dataset.append({
        "id": idx,
        "name": name,
        "qualification_name": qual,
        "registration_number": reg_no,
        "email": email,
    })

with open("scratch/master_ganisph_data.json", "w", encoding="utf-8") as out:
    json.dump(dataset, out, indent=2, ensure_ascii=False)

print(f"Saved scratch/master_ganisph_data.json with {len(dataset)} clean items!")
