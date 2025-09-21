import React, { useMemo } from 'react';
import type { ConsciousnessReport as ReportType } from '../types';
import Gauge from './Gauge';
import ValueChart from './ValueChart';
import InternalStateChart from './InternalStateChart';
import DreamJournal from './DreamJournal';

interface ConsciousnessReportProps {
  report: ReportType | null;
}

const ConsciousnessReport: React.FC<ConsciousnessReportProps> = ({ report }) => {
  const dominantValuesData = useMemo(() => {
    if (!report) return [];
    return Object.entries(report.dominant_values).map(([name, value]) => ({ name, value }));
  }, [report]);

  const uncertaintyProfileData = useMemo(() => {
    if (!report) return [];
    return Object.entries(report.uncertainty_profile).map(([name, value]) => ({ name, value }));
  }, [report]);

  if (!report) {
    return (
      <div className="h-full w-full bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-center">
        <p className="text-slate-400">Awaiting system initialization...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl shadow-slate-950/50 p-6 flex flex-col gap-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-white text-center">Consciousness Report</h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700">
          <p className="text-sm text-slate-400">Current Mood</p>
          <p className="text-lg font-bold text-cyan-300 capitalize">{report.current_mood}</p>
        </div>
        <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700">
          <p className="text-sm text-slate-400">Interactions</p>
          <p className="text-lg font-bold text-cyan-300">{report.conversation_count}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <Gauge label="Consciousness" value={report.consciousness_level} />
        <Gauge label="Confidence" value={report.confidence} />
      </div>

      {report.latestDream && <DreamJournal dream={report.latestDream} />}

      <ValueChart title="Dominant Values" data={dominantValuesData} />
      <ValueChart title="Uncertainty Profile" data={uncertaintyProfileData} />
      <InternalStateChart title="Internal State Magnitude" data={report.internalStateHistory} />

      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-3">Recent Internal Monologue</h3>
        <div className="space-y-2 text-sm text-slate-400 font-roboto-mono bg-slate-900/40 p-4 rounded-lg border border-slate-700 max-h-48 overflow-y-auto">
          {report.recent_thoughts.map((thought, index) => (
            <p key={index} className="opacity-80 hover:opacity-100 transition-opacity">&raquo; {thought}</p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-3">Personality Traits</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {Object.entries(report.personality_traits).map(([trait, value]) => (
            <div key={trait} className="flex justify-between items-center">
              <span className="text-slate-400 capitalize">{trait.replace('_', ' ')}</span>
              <span className="font-bold text-indigo-300 font-roboto-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsciousnessReport;