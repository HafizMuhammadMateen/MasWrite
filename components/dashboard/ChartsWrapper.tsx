"use client";

import dynamic from "next/dynamic";

const DashboardCharts = dynamic(() => import("./DashboardCharts"), { ssr: false });

export default function ChartsWrapper({
  chartData,
}: {
  chartData: { viewsData: any[]; publishedData: any[] };
}) {
  return <DashboardCharts chartData={chartData} />;
}