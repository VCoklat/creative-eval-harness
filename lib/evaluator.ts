import { GoogleGenerativeAI } from '@google/generative-ai';
import { SceneDraft, EvalScore } from './types';
import { cleanJsonResponse } from './utils';

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

  Kembalikan HANYA JSON murni dengan format persis:
  {
    "cinematic_lighting": 4,
    "action_clarity": 4,
    "feedback": "...",
    "approved": true
  }
  `;

  const result = await model.generateContent([
    { text: 'Kamu adalah juri penilai kualitas visual naskah yang ketat dan objektif. Balas HANYA dengan objek JSON valid.' },
    { text: prompt },
  ]);

  const rawText = result.response.text();
  const cleanedText = cleanJsonResponse(rawText);

  return JSON.parse(cleanedText) as EvalScore;
}