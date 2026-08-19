import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

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

  const colors = ["#3D5226", "#7A9B58", "#9CB953", "#C9973E", "#6B8E23"];

  return (
    <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-2 shadow-2xs">
      <div className="flex items-center justify-between border-b border-[#F0EDE6] pb-2">
        <h3 className="text-xs font-bold text-[#5A5248] uppercase tracking-wide">
          Chỉ Số Đánh Giá Động Lực
        </h3>
        <span className="text-[10px] text-[#A09888] font-mono">Thang điểm 100</span>
      </div>
      <div className="h-48 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#5A5248", fontSize: 11 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                borderColor: "#E8EDE0",
                borderRadius: "12px",
                color: "#2B3A1A",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              }}
              itemStyle={{ color: "#3D5226", fontWeight: "bold" }}
              labelStyle={{ color: "#2B3A1A", fontWeight: "bold" }}
              formatter={(value: any) => [`${value}/100`, "Điểm số"]}
            />
            <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={14}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NewsChart;