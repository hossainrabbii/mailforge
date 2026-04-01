"use client";

import { useEffect, useState } from "react";

interface Props {
  delayMs: number;
}

export const CountdownCircle = ({ delayMs }: Props) => {
  const [remaining, setRemaining] = useState(delayMs);

  useEffect(() => {
    setRemaining(delayMs);
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [delayMs]);

  const totalSecs = Math.ceil(delayMs / 1000);
  const remainSecs = Math.ceil(remaining / 1000);
  const progress = remainSecs / totalSecs;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const mins = Math.floor(remainSecs / 60);
  const secs = remainSecs % 60;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
        <text
          x="50"
          y="54"
          textAnchor="middle"
          fontSize="14"
          fill="#374151"
          fontWeight="bold"
        >
          {mins}:{secs.toString().padStart(2, "0")}
        </text>
      </svg>
      <p className="text-sm text-gray-500">Next mail in...</p>
    </div>
  );
};
