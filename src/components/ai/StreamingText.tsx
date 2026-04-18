import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function StreamingText({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentText = '';
    let i = 0;
    setDisplayedText('');
    setIsComplete(false);

    if (!text) return;

    const intervalId = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setDisplayedText(currentText);
        i++;
      } else {
        clearInterval(intervalId);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return (
    <span className="whitespace-pre-wrap leading-relaxed">
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-4 ml-1 bg-[#00C2A8] translate-y-0.5"
        />
      )}
    </span>
  );
}
