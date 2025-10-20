"use client";

import React from "react";

interface SpinnerProps {
  size?: number;      // default 24px
  color?: string;     // default gray-400
  thickness?: string; // default border-2
  className?: string;
}

export default function Spinner({
  size = 24,
  color = "border-gray-400",
  thickness = "border-2",
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`flex justify-center items-center py-10 ${className}`}
      style={{ height: size + 20 }}
    >
      <span
        className={`w-${Math.floor(size / 4)} h-${Math.floor(size / 4)} ${thickness} ${color} border-t-transparent rounded-full animate-spin`}
      ></span>
    </div>
  );
}
