"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { ComparedPackage } from "@/lib/types";
import { formatCompactNumber } from "@/lib/format";

const COLORS = ["#60a5fa", "#34d399"];

interface DownloadsChartProps {
  names: [string, string];
  packages: [ComparedPackage, ComparedPackage];
}

interface ChartPoint {
  date: string;
  [packageName: string]: string | number;
}

function buildChartData(names: [string, string], packages: [ComparedPackage, ComparedPackage]) {
  const byDate = new Map<string, ChartPoint>();

  packages.forEach((pkg, index) => {
    const name = names[index];
    for (const point of pkg.downloads) {
      const entry = byDate.get(point.date) ?? { date: point.date };
      entry[name] = point.count;
      byDate.set(point.date, entry);
    }
  });

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function DownloadsChart({ names, packages }: DownloadsChartProps) {
  const data = buildChartData(names, packages);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/30">
      <h2 className="text-lg font-semibold text-slate-100">Downloads</h2>

      <div className="mt-4 flex items-center gap-6">
        {names.map((name, index) => (
          <div key={name} className="flex items-center gap-2 text-sm text-slate-300">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            {name}
          </div>
        ))}
      </div>

      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value: string) => value.slice(0, 7)}
              minTickGap={40}
              stroke="#334155"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickFormatter={(value: number) => formatCompactNumber(value)}
              width={48}
              stroke="#334155"
            />
            <Tooltip content={<ChartTooltip names={names} />} />
            {names.map((name, index) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[index]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
  names,
}: {
  active?: boolean;
  payload?: { value: number; dataKey: string }[];
  label?: string;
  names: [string, string];
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 shadow-xl">
      <p className="mb-1 font-medium text-slate-300">{label}</p>
      {names.map((name, index) => {
        const entry = payload.find((p) => p.dataKey === name);
        return (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            {name}: {entry ? formatCompactNumber(entry.value) : "N/A"}
          </div>
        );
      })}
    </div>
  );
}
