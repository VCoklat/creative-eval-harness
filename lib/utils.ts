export function parseJsonFromLlm<T>(rawText: string): T {
  // 1. Bersihkan pembungkus markdown ```json ... ```
  let cleaned = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  // 2. Coba parse langsung jika format sudah bersih
  try {
    return JSON.parse(cleaned) as T;
  } catch (e) {
    // Jika gagal, lanjutkan ke algoritma extraction
  }

  // 3. Cari '{' pertama
  const startIdx = cleaned.indexOf('{');
  if (startIdx === -1) {
    throw new Error('No JSON object found in LLM response.');
  }

  // 4. Hitung kedalaman kurung kurawal untuk menemukan '}' penutup objek PERTAMA
  let depth = 0;
  let endIdx = -1;
  let inString = false;
  let escape = false;

  for (let i = startIdx; i < cleaned.length; i++) {
    const char = cleaned[i];

    // Abaikan tanda kurung yang ada di dalam string text ("...")
    if (char === '"' && !escape) {
      inString = !inString;
    }
    escape = char === '\\' && !escape;

    if (!inString) {
      if (char === '{') depth++;
      else if (char === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break; // Berhenti tepat di penutup objek JSON pertama
        }
      }
    }
  }

  if (endIdx === -1) {
    throw new Error('Malformed JSON: Unmatched braces in LLM response.');
  }

  // Potong hanya objek JSON pertama yang valid
  const jsonSubstring = cleaned.substring(startIdx, endIdx + 1);
  return JSON.parse(jsonSubstring) as T;
}