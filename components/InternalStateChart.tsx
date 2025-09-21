
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface InternalStateChartProps {
  title: string;
  data: { turn: number; magnitude: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-slate-600 rounded-md shadow-lg">
        <p className="label text-sm text-slate-200">{`Turn: ${label}`}</p>
        <p className="intro text-cyan-300 font-bold">{`Magnitude: ${payload[0].value.toFixed(3)}`}</p>
      </div>
    );
  }
  return null;
};

const InternalStateChart: React.FC<InternalStateChartProps> = ({ title, data }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-200 mb-3">{title}</h3>
      <div className="w-full h-40 font-roboto-mono text-xs bg-slate-900/40 p-2 rounded-lg border border-slate-700">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
                <linearGradient id="colorMagnitude" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <XAxis 
                dataKey="turn" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#94a3b8' }} 
                padding={{ left: 10, right: 10 }}
            />
            <YAxis 
                domain={[0, 'dataMax + 0.1']} 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#94a3b8' }} 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area 
                type="monotone" 
                dataKey="magnitude" 
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorMagnitude)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InternalStateChart;
