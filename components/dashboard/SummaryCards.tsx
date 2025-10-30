"use client"; // just to use react-countup

import { ReactNode } from "react";
import CountUp from "react-countup";

interface SummaryCardsProps {
  totalBlogs: number;
  published: number;
  drafts: number;
  icons: ReactNode[];
}

export default function SummaryCards({
  totalBlogs,
  published,
  drafts,
  icons,
}: SummaryCardsProps) {
  const cards = [
    { title: "Total Articles", value: totalBlogs, icon: icons[0] },
    { title: "Published Articles", value: published, icon: icons[1] },
    { title: "Draft Articles", value: drafts, icon: icons[2] },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
        key={card.title}
        className="bg-white rounded-lg shadow p-5 flex items-center gap-6 border border-gray-100"
        >
          {/* Icon's wrapper */}
          <div className="p-4 rounded-full bg-gray-100 text-gray-600">
            {card.icon}
          </div>

          {/* Text content */}
          <div>
            <h3 className="text-md text-gray-600 font-medium">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">
              <CountUp end={card.value} duration={1.5} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
