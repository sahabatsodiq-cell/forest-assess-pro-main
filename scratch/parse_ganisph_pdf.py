import pypdf
import os
import re

pdf_path = "C:/Users/BPHP IX/.gemini/antigravity-ide/brain/a0ed7cc6-53b0-4e0b-87c8-6cc7757bb147/.user_uploaded/media_1787431878466.pdf"

if not os.path.exists(pdf_path):
    pdf_path = "C:/Users/BPHP IX/.gemini/antigravity-ide/brain/a0ed7cc6-53b0-4e0b-87c8-6cc7757bb147/.user_uploaded/media_1787427059400.pdf"

reader = pypdf.PdfReader(pdf_path)
print("PDF Pages:", len(reader.pages))

for i in range(min(5, len(reader.pages))):
    print(f"--- PAGE {i+1} ---")
    print(reader.pages[i].extract_text()[:400])
