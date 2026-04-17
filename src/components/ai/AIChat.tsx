import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { useGemini } from '../../hooks/useGemini';
import { chatSystemInstruction } from '../../services/gemini';
import { ChatMessage } from '../../types';

export function AIChat() {
  const { streamResponse, isStreaming } = useGemini();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm FairLens AI. I've reviewed your audit results. The most pressing issue is the disparate impact regarding gender. How can I help you mitigate this?",
      timestamp: new Date().toISOString()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const assistantId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString()
    }]);

    let currentResponse = '';
    
    await streamResponse(
      userMessage.content,
      (chunk) => {
        currentResponse += chunk;
        setMessages(prev => 
          prev.map(m => m.id === assistantId ? { ...m, content: currentResponse } : m)
        );
      },
      chatSystemInstruction
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A24] rounded-2xl border border-white/5 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'assistant' ? 'bg-[#6C47FF]/20 text-[#6C47FF]' : 'bg-white/10'
            }`}>
              {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div className={`p-3 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-[#6C47FF] text-white rounded-tr-sm' 
                : 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-sm'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#12121A] border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your metrics or mitigation..."
            className="w-full bg-[#1A1A24] border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-[#6C47FF] transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#6C47FF] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#5835ED] transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["Explain statistical parity", "How to fix disparate impact?", "What does average odds mean?"].map((q, i) => (
            <button 
              key={i} 
              onClick={() => setInput(q)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-[#6C47FF]/50 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
