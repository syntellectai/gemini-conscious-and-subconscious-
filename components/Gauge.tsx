
import React from 'react';

interface GaugeProps {
  label: string;
  value: number; // 0 to 1
}

const Gauge: React.FC<GaugeProps> = ({ label, value }) => {
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - value * circumference;

  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/40 p-4 rounded-lg border border-slate-700">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="rgba(100, 116, 139, 0.3)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white font-roboto-mono">
            {(value * 100).toFixed(0)}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-300">{label}</p>
    </div>
  );
};

export default Gauge;
