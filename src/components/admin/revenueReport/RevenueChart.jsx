import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'Tháng 1', value: 4000 },
  { name: 'Tháng 2', value: 3000 },
  { name: 'Tháng 3', value: 5000 },
  { name: 'Tháng 4', value: 2780 },
  { name: 'Tháng 5', value: 1890 },
  { name: 'Tháng 6', value: 6390 },
  { name: 'Tháng 7', value: 8490 }, // Đỉnh cao
  { name: 'Tháng 8', value: 7490 },
  { name: 'Tháng 9', value: 6000 },
  { name: 'Tháng 10', value: 7000 },
  { name: 'Tháng 11', value: 9000 },
  { name: 'Tháng 12', value: 8000 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Biến động doanh thu</h3>
        <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none">
          <option>Theo ngày</option>
          <option>Theo tháng</option>
          <option>Theo năm</option>
        </select>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9CA3AF'}} dy={10} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}