
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ValueChartProps {
  title: string;
  data: { name: string; value: number }[];
}

const COLORS = ['#22d3ee', '#6366f1', '#a5b4fc', '#818cf8'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-slate-600 rounded-md shadow-lg">
        <p className="label text-sm text-slate-200 capitalize">{`${label}`}</p>
        <p className="intro text-cyan-300 font-bold">{`Value: ${(payload[0].value * 100).toFixed(1)}%`}</p>
      </div>
    );
  }
  return null;
};

const ValueChart: React.FC<ValueChartProps> = ({ title, data }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-200 mb-3">{title}</h3>
      <div className="w-full h-40 font-roboto-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <XAxis type="number" domain={[0, 1]} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: '#94a3b8' }} 
              className="capitalize"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
            <Bar dataKey="value" barSize={16} radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ValueChart;
