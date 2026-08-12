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

  const PIE_COLORS = ["#10b981", "#64748b", "#ef4444"];
  const BAR_COLORS = ["#38bdf8", "#818cf8", "#a855f7", "#f43f5e"];

  const customTooltipStyle = {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    color: "#ffffff",
    borderRadius: "12px",
    fontSize: "12px",
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 pt-4">
      <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Phân Tích Chỉ Số Tổng Quan
        </h3>
        <NewsChart chartData={chartData} />
      </div>

      {/* 1. Radar Chart: Sức Mạnh 360 Độ */}
      {radarData.length > 0 && (
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            1. Đánh Giá Toàn Diện 360° (Radar Model)
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tick={false}
                />
                <Radar
                  name="Scoring"
                  dataKey="A"
                  stroke="#06b6d4"
                  fill="#0891b2"
                  fillOpacity={0.6}
                />
                <Tooltip contentStyle={customTooltipStyle} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 2. Area Chart: Dự Báo Xung Lực Tăng Trưởng */}
      {timelineData.length > 0 && (
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            2. Dự Báo Xung Lực Tăng Trưởng Theo Quý
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#334155"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="period"
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip contentStyle={customTooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="growth"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#growthGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Donut Chart: Phân Tách Tâm Lý Thị Trường */}
      {pieData.length > 0 && (
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            3. Phân Tách Cơ Cấu Tâm Lý Thị Trường
          </h3>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
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
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. Bar Chart: Dòng Tiền & Tín Hiệu Kỹ Thuật */}
      {techData.length > 0 && (
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
            4. Chỉ Số Dòng Tiền & Kỹ Thuật
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip contentStyle={customTooltipStyle} />
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
