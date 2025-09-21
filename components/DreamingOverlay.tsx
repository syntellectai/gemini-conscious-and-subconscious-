import React, { useState, useEffect } from 'react';
import { MoonIcon } from './Icons';

interface DreamingOverlayProps {
  isDreaming: boolean;
  keywords: string[];
}

const DreamingOverlay: React.FC<DreamingOverlayProps> = ({ isDreaming, keywords }) => {
  const [currentKeyword, setCurrentKeyword] = useState<string>('');
  const [keywordVisible, setKeywordVisible] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isDreaming && keywords.length > 0) {
      let index = 0;
      
      const cycleKeywords = () => {
        setKeywordVisible(false); // Start fade out
        setTimeout(() => {
          index = (index + 1) % keywords.length;
          setCurrentKeyword(keywords[index].toUpperCase());
          setKeywordVisible(true); // Start fade in
        }, 500); // Time for fade-out
      };
      
      // Initial keyword
      setCurrentKeyword(keywords[0].toUpperCase());
      setKeywordVisible(true);

      intervalId = setInterval(cycleKeywords, 2000); // Change every 2 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDreaming, keywords]);

  return (
    <div 
      className={`absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out ${isDreaming ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-hidden={!isDreaming}
      role="status"
    >
      <div className="relative">
        <MoonIcon className="w-24 h-24 text-indigo-400 animate-pulse" />
        <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
      </div>
      <p className="mt-8 text-xl font-bold text-indigo-200 font-roboto-mono tracking-widest animate-pulse">
        DREAMING...
      </p>
      <div className="mt-4 text-center h-8">
        <span
          key={currentKeyword}
          className={`text-lg text-slate-400 font-roboto-mono transition-opacity duration-500 ease-in-out ${keywordVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {currentKeyword}
        </span>
      </div>
    </div>
  );
};

export default DreamingOverlay;
