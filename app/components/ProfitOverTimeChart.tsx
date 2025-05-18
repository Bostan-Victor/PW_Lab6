import React, { useState } from "react";
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
  const [hovered, setHovered] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          padding: "32px 0",
          background: "var(--bg-card)",
          borderRadius: 16,
          marginTop: 16,
        }}
      >
        No data for profit graph.
      </div>
    );
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

  // Tooltip state
  const tooltip =
    hovered !== null && data[hovered]
      ? {
          x: points[hovered][0],
          y: points[hovered][1],
          date: data[hovered].date,
          profit: data[hovered].profit,
        }
      : null;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--bg-card)",
        borderRadius: 16,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: 24,
        marginTop: 16,
        color: "var(--text-main)",
        transition: "background 0.3s, color 0.3s",
        position: "relative",
      }}
    >
      <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: "var(--text-main)" }}>
        Profit Over Time
      </h3>
      <div style={{ position: "relative" }}>
        <svg
          width={width}
          height={height}
          style={{
            background: "var(--bg-main)",
            borderRadius: 12,
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
            display: "block",
          }}
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#888"
            strokeWidth={1}
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#888"
            strokeWidth={1}
          />
          <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth={3} />
          {points.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={hovered === i ? 7 : 4}
              fill={hovered === i ? "var(--accent)" : "#f472b6"}
              stroke="#fff"
              strokeWidth={hovered === i ? 2 : 1}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <text
            x={padding - 10}
            y={height - padding}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize={12}
            fill="var(--text-muted)"
          >
            {minY}
          </text>
          <text
            x={padding - 10}
            y={padding}
            textAnchor="end"
            alignmentBaseline="middle"
            fontSize={12}
            fill="var(--text-muted)"
          >
            {maxY}
          </text>
          <text
            x={padding}
            y={height - padding + 18}
            textAnchor="middle"
            fontSize={12}
            fill="var(--text-muted)"
          >
            {dates[0]}
          </text>
          <text
            x={width - padding}
            y={height - padding + 18}
            textAnchor="middle"
            fontSize={12}
            fill="var(--text-muted)"
          >
            {dates[dates.length - 1]}
          </text>
        </svg>
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x - 60,
              top: tooltip.y - 60,
              minWidth: 120,
              background: "var(--bg-card)",
              color: "var(--text-main)",
              border: "1px solid var(--accent)",
              borderRadius: 8,
              padding: "8px 12px",
              pointerEvents: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              fontSize: 14,
              zIndex: 10,
              whiteSpace: "nowrap",
            }}
          >
            <div>
              <b>Date:</b> {tooltip.date}
            </div>
            <div>
              <b>Profit:</b> {Number(tooltip.profit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}