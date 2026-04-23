"use client";

import { ReactNode } from "react";
import CountUp from "react-countup";
import Link from "next/link";

interface CardConfig {
  title: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  href?: string;
}

interface SummaryCardsProps {
  totalBlogs: number;
  published: number;
  drafts: number;
}

export default function SummaryCards({ totalBlogs, published, drafts }: SummaryCardsProps) {
  const cards: CardConfig[] = [
    {
      title: "Total Posts",
      value: totalBlogs,
      iconBg: "bg-blue-50 text-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
        </svg>
      ),
      href: "/dashboard/manage-blogs",
    },
    {
      title: "Published",
      value: published,
      iconBg: "bg-green-50 text-green-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      href: "/dashboard/manage-blogs?status=published",
    },
    {
      title: "Drafts",
      value: drafts,
      iconBg: "bg-amber-50 text-amber-600",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      href: "/dashboard/manage-blogs?status=draft",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const inner = (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${card.iconBg} shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                <CountUp end={card.value} duration={1.2} />
              </p>
            </div>
          </div>
        );

        return card.href ? (
          <Link key={card.title} href={card.href}>{inner}</Link>
        ) : (
          <div key={card.title}>{inner}</div>
        );
      })}
    </div>
  );
}
