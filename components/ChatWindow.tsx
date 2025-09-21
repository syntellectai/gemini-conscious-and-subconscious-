import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { UserIcon, AssistantIcon, SendIcon, ThoughtBubbleIcon, SparkleIcon } from './Icons';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800/30">
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg, index) => {
            if (msg.isSystemMessage) {
                return (
                    <div key={index} className="text-center text-sm text-slate-400 italic font-roboto-mono py-2">
                        <span>{msg.content}</span>
                    </div>
                );
            }
            return (
              <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && !msg.isUnprompted && <AssistantIcon className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />}
                {msg.role === 'assistant' && msg.isUnprompted && <SparkleIcon className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-xl p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : msg.isUnprompted
                        ? 'bg-slate-700/60 text-slate-300 rounded-bl-none border border-slate-600/80 shadow-md'
                        : 'bg-slate-700/80 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'assistant' && msg.internalThoughts && (
                     <div className="flex items-center gap-2 mt-2 px-2 py-1 text-xs text-cyan-300/70 bg-cyan-900/20 rounded-full border border-cyan-500/20">
                        <ThoughtBubbleIcon className="w-3 h-3" />
                        <span className="italic font-roboto-mono">{msg.internalThoughts}</span>
                     </div>
                  )}
                </div>
                {msg.role === 'user' && <UserIcon className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-1" />}
              </div>
            );
        })}
        {isLoading && messages.length > 0 && !messages[messages.length - 1].isSystemMessage && (
          <div className="flex items-start gap-4">
            <AssistantIcon className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
            <div className="max-w-xl p-4 rounded-2xl bg-slate-700/80 text-slate-200 rounded-bl-none flex items-center space-x-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-0"></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-700/50 bg-slate-900/30">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about consciousness, decisions, feelings..."
            className="w-full bg-slate-700/50 border border-slate-600 rounded-xl py-3 pl-4 pr-12 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition duration-200"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:bg-cyan-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;