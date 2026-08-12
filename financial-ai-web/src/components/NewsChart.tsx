import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

interface NewsChartProps {
  chartData?: Record<string, number>;
}

export const NewsChart: React.FC<NewsChartProps> = ({ chartData }) => {
  if (!chartData || Object.keys(chartData).length === 0) {
    return null;
  }

  // Chuyển Map/Object thành mảng dữ liệu Recharts cần
  const data = Object.entries(chartData).map(([key, value]) => ({
    name: key,
    score: value,
  }));

  const colors = ['#38bdf8', '#818cf8', '#34d399', '#f39c12', '#a855f7'];

  return (
    <div className="bg-slate-800/40 p-5 border border-slate-800 space-y-3">
      <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
        Chỉ Số Đánh Giá Động Lực 
      </h3>
      <div className="h-48 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={110}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#ffffff' }} // Đổi màu chữ giá trị (Điểm số) thành trắng
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }} // Đảm bảo tiêu đề (Sức Mạnh Dòng Tiền) luôn trắng
              formatter={(value: any) => [`${value}/100`, 'Điểm số']}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};