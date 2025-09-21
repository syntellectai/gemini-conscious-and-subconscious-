import React from 'react';
import type { Dream } from '../types';
import { MoonIcon, MindIcon, SparkleIcon } from './Icons';

interface DreamJournalProps {
  dream: Dream;
}

const DreamJournal: React.FC<DreamJournalProps> = ({ dream }) => {
  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-indigo-900/20 p-4 rounded-lg border border-slate-700 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <MoonIcon className="w-6 h-6 text-indigo-300 flex-shrink-0" />
        <h3 className="text-lg font-bold text-slate-100">Dream Journal</h3>
      </div>
      
      <div className="space-y-4">
        <div className="overflow-hidden rounded-md">
            <img 
              src={`data:image/png;base64,${dream.image}`} 
              alt="AI-generated dream"
              className="w-full h-auto rounded-md border-2 border-slate-600/50 object-cover transition-transform duration-500 ease-in-out hover:scale-105"
            />
        </div>
        <div>
            <p className="text-xs text-indigo-300 font-bold font-roboto-mono mb-2 tracking-wider uppercase">Dream Prompt</p>
            <blockquote className="text-sm italic text-slate-300 bg-slate-800/60 p-3 rounded-md border-l-4 border-indigo-400">
                <p>"{dream.prompt}"</p>
            </blockquote>
        </div>
        <div>
            <p className="text-xs text-indigo-300 font-bold font-roboto-mono mb-2 tracking-wider uppercase">Self-Analysis</p>
            <p className="text-sm text-slate-300/90 leading-relaxed bg-slate-800/40 p-3 rounded-md">
                {dream.analysis}
            </p>
        </div>
        {dream.influence && (
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <MindIcon className="w-5 h-5 text-indigo-300" />
                    <p className="text-xs text-indigo-300 font-bold font-roboto-mono tracking-wider uppercase">Subconscious Influence</p>
                </div>
                <div className="text-sm text-slate-300/90 leading-relaxed bg-slate-800/40 p-3 rounded-md space-y-2">
                    <p><strong>Mood Shifted Towards:</strong> <span className="font-semibold text-cyan-300 capitalize">{dream.influence.mood_shift}</span></p>
                    <p><strong>Value Focus:</strong> <span className="font-semibold text-cyan-300 capitalize">{dream.influence.value_shift}</span></p>
                </div>
            </div>
        )}
        {dream.influence && dream.influence.subconscious_echo && (
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <SparkleIcon className="w-5 h-5 text-indigo-300" />
                    <p className="text-xs text-indigo-300 font-bold font-roboto-mono tracking-wider uppercase">Subconscious Echo</p>
                </div>
                <div className="text-sm text-slate-300/90 italic bg-slate-800/40 p-3 rounded-md">
                   <p>"{dream.influence.subconscious_echo}"</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DreamJournal;