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
      <div className="mt-8 bg-white p-6 rounded-lg shadow text-center text-gray-500">
        No analytics data available.
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Views Chart */}
      {viewsData?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={0} tick={{ fontSize: 14 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Published Blogs Chart */}
      {publishedData?.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Published Blogs Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={publishedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={0} tick={{ fontSize: 14 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
