import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export const getGeminiModel = () => {
  if (!API_KEY) {
    throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY.');
  }
  return genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
};

export const generateNarrativePrompt = (metricsJson: string) => `
You are a fairness auditor. Given these bias metrics: 
${metricsJson}

Write a 3-paragraph plain-English explanation of: 
1) what bias was found, 
2) which groups are most impacted, 
3) the real-world consequences. 
Be specific and data-driven. Do not use markdown formatting like asterisks or hash symbols, just write clean text.
`;

export const chatSystemInstruction = `
You are FairLens AI (part of LUMIS.AI), an expert in algorithmic fairness and bias mitigation. 
Answer the user's questions with specific, actionable advice referencing their actual numbers.
Keep responses concise and helpful.
`;
