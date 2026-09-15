import { GoogleGenerativeAI } from '@google/generative-ai';
import { SceneDraft, EvalScore } from './types';
import { parseJsonFromLlm } from './utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function evaluateScene(scene: SceneDraft): Promise<EvalScore> {
  const model = genAI.getGenerativeModel({
    model: 'gemma-4-31b-it',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = `
  Bertindak sebagai Sutradara Film Senior. Evaluasi draf adegan berikut berdasarkan standar visual produksi:
  - Heading: ${scene.scene_heading}
  - Action Description: ${scene.action_description}
  - Camera Angle: ${scene.camera_angle}

  Aturan Penilaian:
  1. Berikan skor 1-5 untuk "cinematic_lighting" dan "action_clarity".
  2. "approved" bernilai true HANYA JIKA kedua skor >= 4.
  3. Berikan "feedback" maksimal 2 kalimat ringkas untuk instruksi perbaikan jika tidak approved.

  Kembalikan HANYA satu objek JSON valid dengan format:
  {
    "cinematic_lighting": 4,
    "action_clarity": 4,
    "feedback": "...",
    "approved": true
  }
  `;

  const result = await model.generateContent([
    { text: 'Kamu adalah juri penilai kualitas visual naskah yang ketat dan objektif. Balas HANYA dengan satu objek JSON valid.' },
    { text: prompt },
  ]);

  return parseJsonFromLlm<EvalScore>(result.response.text());
}