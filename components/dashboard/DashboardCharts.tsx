"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  viewsData: { date: string; views: number }[];
  publishedData: { date: string; count: number }[];
}

export default function DashboardCharts({ chartData }: { chartData: ChartData }) {
  const { viewsData, publishedData } = chartData;

  if (!viewsData?.length && !publishedData?.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
        <p className="text-3xl mb-3">📊</p>
        <p className="text-gray-500 font-medium">No analytics yet</p>
        <p className="text-gray-400 text-sm mt-1">Publish some posts to see your stats here</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {viewsData?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Views over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {publishedData?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">Posts published over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={publishedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
