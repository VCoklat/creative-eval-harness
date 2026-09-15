import { GoogleGenerativeAI } from '@google/generative-ai';
import { SceneDraft } from './types';
import { cleanJsonResponse } from './utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateScene(idea: string, feedback?: string): Promise<SceneDraft> {
  const model = genAI.getGenerativeModel({
    model: 'gemma-4-26b-a4b-it',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = feedback
    ? `Ide Adegan: ${idea}\n\n[PENTING] Masukan dan perbaikan dari Sutradara (harus diterapkan): ${feedback}`
    : `Ide Adegan: ${idea}`;

  const result = await model.generateContent([
    {
      text: 'Kamu adalah penulis naskah film profesional. Kembalikan HANYA objek JSON tanpa teks tambahan dengan format: {"scene_heading": "...", "action_description": "...", "camera_angle": "..."}',
    },
    { text: prompt },
  ]);

  const rawText = result.response.text();
  const cleanedText = cleanJsonResponse(rawText);

  return JSON.parse(cleanedText) as SceneDraft;
}