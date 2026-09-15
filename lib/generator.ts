import { GoogleGenerativeAI } from '@google/generative-ai';
import { SceneDraft } from './types';
import { parseJsonFromLlm } from './utils';

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
      text: 'Kamu adalah penulis naskah film profesional. Kembalikan HANYA satu objek JSON valid dengan kunci: "scene_heading", "action_description", "camera_angle". Jangan tambahkan teks percakapan atau JSON lain.',
    },
    { text: prompt },
  ]);

  return parseJsonFromLlm<SceneDraft>(result.response.text());
}