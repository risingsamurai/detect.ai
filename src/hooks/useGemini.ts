import { useState } from 'react';
import { getGeminiModel } from '../services/gemini';
import toast from 'react-hot-toast';

export function useGemini() {
  const [isStreaming, setIsStreaming] = useState(false);

  const streamResponse = async (
    prompt: string, 
    onChunk: (text: string) => void,
    systemInstruction?: string
  ) => {
    setIsStreaming(true);
    try {
      const model = getGeminiModel();
      // Gemini 1.5 Pro allows passing system instructions in a specific way or just prepending.
      // For simplicity in this demo, we'll prepend if provided.
      const fullPrompt = systemInstruction ? `${systemInstruction}\n\nUser: ${prompt}` : prompt;
      
      const result = await model.generateContentStream(fullPrompt);
      
      for await (const chunk of result.stream) {
        onChunk(chunk.text());
      }
    } catch (error: any) {
      console.error('Gemini Stream Error:', error);
      toast.error(error.message || 'Failed to connect to AI service');
      // If mock, just output a fake response
      if (error.message.includes('API key is missing')) {
        const mockChunks = "I'm running in demo mode without an API key, but normally I would provide a detailed analysis of your metrics here.".split(' ');
        for (const word of mockChunks) {
          onChunk(word + ' ');
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return { streamResponse, isStreaming };
}
