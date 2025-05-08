import React from "react";
import type { Bet } from "../types/Bet";

function getCumulativeProfitData(bets: Bet[]) {
  const sorted = [...bets].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let cumulative = 0;
  const data: { date: string; profit: number }[] = [];
  sorted.forEach((bet) => {
    cumulative += bet.profit;
    data.push({ date: bet.date.slice(0, 10), profit: cumulative });
  });
  const grouped: Record<string, number> = {};
  data.forEach(({ date, profit }) => {
    grouped[date] = profit;
  });
  return Object.entries(grouped).map(([date, profit]) => ({ date, profit }));
}

export default function ProfitOverTimeChart({ bets }: { bets: Bet[] }) {
  const data = getCumulativeProfitData(bets);
  if (data.length === 0) {
    return <div className="text-center text-gray-400 py-8">No data for profit graph.</div>;
  }

  const width = 600;
  const height = 200;
  const padding = 40;

  const profits = data.map((d) => d.profit);
  const minY = Math.min(0, ...profits);
  const maxY = Math.max(0, ...profits);
  const dates = data.map((d) => d.date);

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - 2 * padding);
    const y =
      height -
      padding -
      ((d.profit - minY) / (maxY - minY || 1)) * (height - 2 * padding);
    return [x, y];
  });

  // Build SVG path
  const pathD = points
    .map(([x, y], i) => (i === 0 ? `M ${x},${y}` : `L ${x},${y}`))
    .join(" ");

  return (
    <div className="w-full flex flex-col items-center">
      <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">Profit Over Time</h3>
      <svg width={width} height={height} className="bg-white/30 dark:bg-gray-900/40 rounded-xl shadow border border-white/20 dark:border-gray-800/40">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#888" strokeWidth={1} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#888" strokeWidth={1} />
        <path d={pathD} fill="none" stroke="#a21caf" strokeWidth={3} />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="#f472b6" />
        ))}
        <text x={padding - 10} y={height - padding} textAnchor="end" alignmentBaseline="middle" fontSize={12} fill="#666">
          {minY}
        </text>
        <text x={padding - 10} y={padding} textAnchor="end" alignmentBaseline="middle" fontSize={12} fill="#666">
          {maxY}
        </text>
        <text x={padding} y={height - padding + 18} textAnchor="middle" fontSize={12} fill="#666">
          {dates[0]}
        </text>
        <text x={width - padding} y={height - padding + 18} textAnchor="middle" fontSize={12} fill="#666">
          {dates[dates.length - 1]}
        </text>
      </svg>
    </div>
  );
}