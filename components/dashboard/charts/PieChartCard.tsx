"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const PALETTE = ["#091f46", "#c9a84c", "#2a4080", "#6b7280", "#4f72c2", "#9ca3af"];

export function PieChartCard({
  title,
  data,
  dataKey,
  nameKey = "label",
}: {
  title: string;
  data: Record<string, string | number>[];
  dataKey: string;
  nameKey?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-sm font-semibold text-[var(--color-text)]">{title}</p>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
                borderRadius: 12,
                fontSize: 13,
                color: "var(--color-text)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: 12, color: "var(--color-text-muted)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
