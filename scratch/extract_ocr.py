import os

log_path = "C:/Users/BPHP IX/.gemini/antigravity-ide/brain/a0ed7cc6-53b0-4e0b-87c8-6cc7757bb147/.system_generated/logs/transcript_full.jsonl"

with open(log_path, "r", encoding="utf-8") as f:
    text = f.read()

start_tag = "==Start of OCR for page 1=="
end_tag = "==End of PDF=="

start_idx = text.find(start_tag)
end_idx = text.find(end_tag)

print("start_idx:", start_idx, "end_idx:", end_idx)

if start_idx != -1 and end_idx != -1:
    ocr_text = text[start_idx : end_idx + len(end_tag)]
    ocr_text = ocr_text.replace("\\n", "\n").replace('\\"', '"')
    
    os.makedirs("scratch", exist_ok=True)
    with open("scratch/ocr_dump.txt", "w", encoding="utf-8") as out:
        out.write(ocr_text)
    print("Successfully wrote scratch/ocr_dump.txt! Length:", len(ocr_text))
else:
    print("Tags not found!")
