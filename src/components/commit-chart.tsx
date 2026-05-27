import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

export function CommitChart({ dates, days = 30 }: { dates: string[]; days?: number }) {
  const data = useMemo(() => {
    const buckets = new Map<string, number>();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const d of dates) {
      const k = new Date(d).toISOString().slice(0, 10);
      if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
    return Array.from(buckets, ([date, count]) => ({ date: date.slice(5), count }));
  }, [dates, days]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="cm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.74 0.18 200)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="oklch(0.74 0.18 200)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
        <XAxis dataKey="date" stroke="oklch(0.7 0.03 255)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
        <YAxis stroke="oklch(0.7 0.03 255)" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={32} />
        <Tooltip
          contentStyle={{
            background: "oklch(0.18 0.025 265)", border: "1px solid oklch(1 0 0 / 0.1)",
            borderRadius: 8, fontSize: 12,
          }}
          labelStyle={{ color: "oklch(0.96 0.01 250)" }}
        />
        <Area type="monotone" dataKey="count" stroke="oklch(0.85 0.2 195)" strokeWidth={2} fill="url(#cm)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}