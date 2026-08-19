import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { NewsChart } from "./NewsChart";

interface MultiInsightChartsProps {
  radarMetrics?: Record<string, number>;
  timelineGrowthData?: Record<string, number>;
  sentimentBreakdown?: Record<string, number>;
  technicalSignals?: Record<string, number>;
  chartData?: Record<string, number>;
}

export const MultiInsightCharts: React.FC<MultiInsightChartsProps> = ({
  radarMetrics,
  timelineGrowthData,
  sentimentBreakdown,
  technicalSignals,
  chartData,
}) => {
  // Convert Data Helper
  const radarData = radarMetrics
    ? Object.entries(radarMetrics).map(([subject, A]) => ({
        subject,
        A,
        fullMark: 100,
      }))
    : [];

  const timelineData = timelineGrowthData
    ? Object.entries(timelineGrowthData).map(([period, growth]) => ({
        period,
        growth,
      }))
    : [];

  const pieData = sentimentBreakdown
    ? Object.entries(sentimentBreakdown).map(([name, value]) => ({
        name,
        value,
      }))
    : [];

  const techData = technicalSignals
    ? Object.entries(technicalSignals).map(([name, score]) => ({ name, score }))
    : [];

  const PIE_COLORS = ["#3D5226", "#D97706", "#DC2626"];
  const BAR_COLORS = ["#3D5226", "#7A9B58", "#9CB953", "#C9973E"];

  const customTooltipStyle = {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EDE0",
    color: "#2B3A1A",
    borderRadius: "12px",
    fontSize: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 pt-1">
      {/* 1. Bar Chart Overview */}
      <NewsChart chartData={chartData} />

      {/* 2. Radar Chart: Sức Mạnh 360 Độ */}
      {radarData.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F0EDE6] pb-2">
            <h3 className="text-xs font-bold text-[#5A5248] uppercase tracking-wide">
              1. Đánh Giá Toàn Diện 360° (Radar Model)
            </h3>
            <span className="text-[10px] text-[#A09888] font-mono">Đa chiều</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E8EDE0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#5A5248", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tick={false}
                />
                <Radar
                  name="Điểm số"
                  dataKey="A"
                  stroke="#3D5226"
                  fill="#7A9B58"
                  fillOpacity={0.4}
                />
                <Tooltip contentStyle={customTooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Area Chart: Dự Báo Xung Lực Tăng Trưởng */}
      {timelineData.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F0EDE6] pb-2">
            <h3 className="text-xs font-bold text-[#5A5248] uppercase tracking-wide">
              2. Dự Báo Xung Lực Tăng Trưởng Theo Quý
            </h3>
            <span className="text-[10px] text-[#A09888] font-mono">Xu hướng</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="growthGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7A9B58" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#7A9B58" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#F0EDE6"
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tick={{ fill: "#5A5248", fontSize: 11 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tick={{ fill: "#A09888", fontSize: 10 }}
                />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="growth"
                  name="Xung lực"
                  stroke="#3D5226"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#growthGradLight)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. Donut Chart: Phân Tách Tâm Lý Thị Trường */}
      {pieData.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F0EDE6] pb-2">
            <h3 className="text-xs font-bold text-[#5A5248] uppercase tracking-wide">
              3. Phân Tách Cơ Cấu Tâm Lý Thị Trường
            </h3>
            <span className="text-[10px] text-[#A09888] font-mono">Tỷ lệ %</span>
          </div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={74}
                  paddingAngle={4}
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string;
                    percent?: number;
                  }) => `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 5. Bar Chart: Dòng Tiền & Tín Hiệu Kỹ Thuật */}
      {techData.length > 0 && (
        <div className="p-4 rounded-xl bg-white border border-[#E8EDE0]/80 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F0EDE6] pb-2">
            <h3 className="text-xs font-bold text-[#5A5248] uppercase tracking-wide">
              4. Chỉ Số Dòng Tiền & Kỹ Thuật
            </h3>
            <span className="text-[10px] text-[#A09888] font-mono">Điểm kỹ thuật</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#5A5248", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  itemStyle={{ color: "#3D5226", fontWeight: "bold" }}
                  labelStyle={{ color: "#2B3A1A", fontWeight: "bold" }}
                  formatter={(value: any) => [`${value}/100`, "Điểm"]}
                />
                <Bar dataKey="score" barSize={14} radius={[0, 6, 6, 0]}>
                  {techData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiInsightCharts;
