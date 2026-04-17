import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import { generateNarrativePrompt } from '../../services/gemini';
import { StreamingText } from './StreamingText';

interface InsightCardProps {
  metrics: any;
}

export function InsightCard({ metrics }: InsightCardProps) {
  const { streamResponse, isStreaming } = useGemini();
  const [content, setContent] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  const generateInsight = async () => {
    setContent('');
    setHasStarted(true);
    let fullResponse = '';
    
    await streamResponse(
      generateNarrativePrompt(JSON.stringify(metrics, null, 2)),
      (chunk) => {
        fullResponse += chunk;
        setContent(fullResponse);
      }
    );
  };

  useEffect(() => {
    // Generate insight on mount
    generateInsight();
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#6C47FF]/10 to-[#00C2A8]/5 border border-[#6C47FF]/20 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#6C47FF] to-[#00C2A8]"></div>
      
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-[#6C47FF]">
          <Sparkles className="w-5 h-5" /> AI Insight
        </h3>
        <button 
          onClick={generateInsight}
          disabled={isStreaming}
          className="text-gray-400 hover:text-white p-1 rounded transition-colors disabled:opacity-50"
          title="Regenerate"
        >
          <RefreshCw className={`w-4 h-4 ${isStreaming ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="text-gray-200 text-sm">
        {hasStarted && content ? (
          <StreamingText text={content} speed={15} />
        ) : (
          <span className="text-gray-500 animate-pulse">Analyzing fairness metrics...</span>
        )}
      </div>
    </div>
  );
}
