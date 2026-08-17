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

  const colors = ['#9CB953', '#7A9B58', '#3D5226', '#C9973E', '#8B9D6E'];

  return (
    <div className="bg-[#3D5226]/40 p-5 rounded-xl border border-[#3D5226]/60 space-y-3">
      <h3 className="text-xs font-bold text-[#9CB953] uppercase tracking-wider">
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
              tick={{ fill: '#D8D0C0', fontSize: 11 }}
              width={110}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2B3A1A', borderColor: '#3D5226', borderRadius: '8px', color: '#F5F0E8', fontSize: '12px' }}
              itemStyle={{ color: '#F5F0E8' }}
              labelStyle={{ color: '#F5F0E8', fontWeight: 'bold' }}
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

export default NewsChart;