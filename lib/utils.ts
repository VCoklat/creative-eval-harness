export function cleanJsonResponse(rawText: string): string {
  // Hapus pembungkus markdown ```json ... ``` jika ada
  let cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();

  // Ambil karakter dari '{' pertama hingga '}' terakhir untuk membuang teks pembuka/penutup
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}