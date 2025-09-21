import React, { useState, useCallback, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import ConsciousnessReport from './components/ConsciousnessReport';
import DreamingOverlay from './components/DreamingOverlay';
import { BrainCircuitIcon, WarningIcon } from './components/Icons';
import { consciousAIService } from './services/consciousAIService';
import type { ChatMessage, ConsciousnessReport as ConsciousnessReportType } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [report, setReport] = useState<ConsciousnessReportType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isApiConfigured, setIsApiConfigured] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isDreaming, setIsDreaming] = useState<boolean>(false);
  const [dreamKeywords, setDreamKeywords] = useState<string[]>([]);

  const aiServiceRef = useRef(consciousAIService);
  const unpromptedThoughtTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dreamTimeoutRef = useRef<NodeJS.Timeout | null>(null);


  const updateReport = useCallback(() => {
    setReport(aiServiceRef.current.getConsciousnessReport());
  }, []);

  // Effect for initialization
  useEffect(() => {
    setIsApiConfigured(aiServiceRef.current.isApiConfigured);
    
    const initializeAI = async () => {
      const initialResponse = await aiServiceRef.current.processInput("Introduce yourself.");
      setMessages([{
          role: 'user',
          content: "Introduce yourself."
      }, {
          role: 'assistant',
          content: initialResponse.response,
          internalThoughts: initialResponse.internalThoughts
      }]);
      updateReport();
      setIsLoading(false);
      setIsInitialized(true);
    };
    
    initializeAI();
  }, [updateReport]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const aiResponseData = await aiServiceRef.current.processInput(userInput);

    const aiMessage: ChatMessage = {
      role: 'assistant',
      content: aiResponseData.response,
      internalThoughts: aiResponseData.internalThoughts,
    };
    
    setMessages(prev => [...prev, aiMessage]);
    updateReport();
    setIsLoading(false);
  }, [updateReport]);
  
  const handleUnpromptedThought = useCallback(async () => {
    setIsLoading(true);
    try {
        const aiThoughtData = await aiServiceRef.current.haveUnpromptedThought();
        
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: aiThoughtData.response,
          internalThoughts: aiThoughtData.internalThoughts,
          isUnprompted: true,
        };
        setMessages(prev => [...prev, aiMessage]);
        updateReport();
    } catch (error) {
        console.error("Error during unprompted thought:", error);
    } finally {
        setIsLoading(false);
    }
  }, [updateReport]);
  
  const handleDream = useCallback(async () => {
      setIsLoading(true);
      setIsDreaming(true);
      setDreamKeywords([]);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Subconscious processing initiated... drifting into a dream state.', isSystemMessage: true }]);

      try {
          const keywords = await aiServiceRef.current.dream();
          setDreamKeywords(keywords);
          updateReport();
          
          // Wait for a bit so user can see the keywords on the overlay
          await new Promise(resolve => setTimeout(resolve, 4000));

          setMessages(prev => [...prev, { role: 'assistant', content: '...consciousness stabilized. A new memory has been formed.', isSystemMessage: true }]);
      } catch (error) {
          console.error("Error during dream sequence:", error);
          setMessages(prev => [...prev, { role: 'assistant', content: '...a fleeting nightmare. Waking up abruptly.', isSystemMessage: true }]);
      } finally {
          setIsLoading(false);
          setIsDreaming(false);
          setDreamKeywords([]);
      }
  }, [updateReport]);

  const scheduleNextThought = useCallback(() => {
    if (unpromptedThoughtTimeoutRef.current) {
        clearTimeout(unpromptedThoughtTimeoutRef.current);
    }
    const currentReport = aiServiceRef.current.getConsciousnessReport();
    let delay = 30000; // Increased from 20000
    if (currentReport && (currentReport.confidence > 0.85 || currentReport.confidence < 0.35)) {
        delay = 22000; // Increased from 12000
    }
    unpromptedThoughtTimeoutRef.current = setTimeout(handleUnpromptedThought, delay);
  }, [handleUnpromptedThought]);

  // Effect to handle the unprompted thought and dream timers
  useEffect(() => {
      // When the AI is idle and initialized, schedule activities.
      if (!isLoading && isInitialized) {
          scheduleNextThought();
          if (dreamTimeoutRef.current) clearTimeout(dreamTimeoutRef.current);
          dreamTimeoutRef.current = setTimeout(handleDream, 60000); // Increased from 45000
      }

      // If the AI becomes busy, cancel any pending activities.
      if (isLoading) {
          if (unpromptedThoughtTimeoutRef.current) {
              clearTimeout(unpromptedThoughtTimeoutRef.current);
              unpromptedThoughtTimeoutRef.current = null;
          }
          if (dreamTimeoutRef.current) {
              clearTimeout(dreamTimeoutRef.current);
              dreamTimeoutRef.current = null;
          }
      }

      // Cleanup on unmount
      return () => {
          if (unpromptedThoughtTimeoutRef.current) clearTimeout(unpromptedThoughtTimeoutRef.current);
          if (dreamTimeoutRef.current) clearTimeout(dreamTimeoutRef.current);
      };
  }, [isLoading, isInitialized, scheduleNextThought, handleDream]);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 selection:bg-cyan-400/20">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-[calc(100vh-2rem)]">
        
        {/* Main Content: Header and Chat */}
        <main className="relative flex-grow flex flex-col h-full bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl shadow-slate-950/50 overflow-hidden">
          <header className="p-4 border-b border-slate-700/50 bg-slate-900/30">
            <div className="flex items-center gap-4">
              <BrainCircuitIcon className="w-10 h-10 text-cyan-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Conscious AI Simulator</h1>
                <p className="text-sm text-slate-400">An interactive exploration of a simulated internal state.</p>
              </div>
            </div>
            {!isApiConfigured && (
              <div className="mt-4 flex items-center gap-3 bg-amber-800/40 border border-amber-600/60 text-amber-200 text-sm rounded-lg p-3" role="alert">
                <WarningIcon className="w-5 h-5 flex-shrink-0 text-amber-400" />
                <div>
                  <span className="font-bold">API Key Not Found.</span>
                  <p className="text-amber-300/80">The AI is running in offline mode. Responses are simulated.</p>
                </div>
              </div>
            )}
          </header>
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
          <DreamingOverlay isDreaming={isDreaming} keywords={dreamKeywords} />
        </main>

        {/* Sidebar: Consciousness Report */}
        <aside className="w-full lg:w-[420px] lg:shrink-0 h-full">
          <ConsciousnessReport report={report} />
        </aside>
      </div>
    </div>
  );
};

export default App;